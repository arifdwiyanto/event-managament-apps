import { prisma } from "../../../config/prisma.js";
import { OrdersRepository } from "../repositories/orders.repository.js";
import { TicketsRepository } from "../../events/repositories/tickets.repository.js";
import { UserPointRepository } from "../../userPoint/repositories/userPoint.repository.js";
import { UserCouponRepository } from "../../userCoupons/repositories/voucher.repository.js";
import { generateInvoiceHtml } from "../../../services/email/templates/invoice.template.js";
import { EmailService } from "../../../services/email/email.service.js";
import { snap } from "../../../config/midtrans.js";

export interface IOrdersServiceProps {
  customerId: string;
  pointUsed?: number;
  voucherId?: string;
  paymentMethod: string;
  items: {
    ticketId: string;
    qty: number;
    promotionId?: string;
  }[];
}

export class OrdersService {
  private ordersRepository: OrdersRepository;
  private ticketsRepository: TicketsRepository;
  private userPointRepository: UserPointRepository;
  private userCouponRepository: UserCouponRepository;
  private emailService: EmailService;

  constructor() {
    this.ordersRepository = new OrdersRepository();
    this.ticketsRepository = new TicketsRepository();
    this.userPointRepository = new UserPointRepository();
    this.userCouponRepository = new UserCouponRepository();
    this.emailService = new EmailService();
  }

  public create = async (data: IOrdersServiceProps): Promise<any> => {
    return await prisma.$transaction(async (tx: any) => {
      let firstEventId: string | null = null;
      let isSingleEvent = true;
      let totalPrice = 0;
      let totalDiscount = 0;
      const orderItems: any[] = [];
      // Track which fixed-amount promos have already been applied per event
      const appliedFixedPromos = new Set<string>();

      for (let item of data.items) {
        const ticket = await this.ticketsRepository.findById(item.ticketId, tx);
        if (!ticket) {
          throw new Error(`Ticket with id ${item.ticketId} not found`);
        }

        if (firstEventId === null) {
          firstEventId = ticket.eventId;
        } else if (firstEventId !== ticket.eventId) {
          isSingleEvent = false;
        }

        if (ticket.quota < item.qty) {
          throw new Error(`Insufficient quota for ticket id ${item.ticketId}`);
        }

        const subTotalOriginal = Number(ticket.price) * item.qty;
        let itemDiscount = 0;

        if (item.promotionId) {
          const promotion = await tx.promotion.findUnique({
            where: { id: item.promotionId },
            include: { events: true },
          });

          if (!promotion) {
            throw new Error(
              `Invalid promotion code for ticket ${item.ticketId}`,
            );
          }

          const isEventEligible = promotion.events.some(
            (pe: any) => pe.eventId === ticket.eventId,
          );

          if (!isEventEligible) {
            throw new Error(
              `Promotion ${promotion.name} is not applicable for this event`,
            );
          }

          if (
            promotion.startDate > new Date() ||
            promotion.endDate < new Date()
          ) {
            throw new Error(
              `Promotion ${promotion.name} is expired or not yet active`,
            );
          }

          if (promotion.maxUsage !== null) {
            const usageCount = await tx.transaction.count({
              where: { promotionId: promotion.id },
            });
            const usageCountItem = await tx.transactionItem.count({
              where: { promotionId: promotion.id },
            });
            if (usageCount + usageCountItem >= promotion.maxUsage) {
              throw new Error(
                `Promotion ${promotion.name} usage limit reached`,
              );
            }
          }

          if (promotion.discountPercentage) {
            // Percentage discount applies per item (proportional — correct behavior)
            itemDiscount =
              Math.round((subTotalOriginal * Number(promotion.discountPercentage)) / 100);
          } else if (promotion.discountAmount) {
            // Fixed amount discount: apply only ONCE per promotion per event
            const fixedKey = `${item.promotionId}:${ticket.eventId}`;
            if (!appliedFixedPromos.has(fixedKey)) {
              itemDiscount = Number(promotion.discountAmount);
              appliedFixedPromos.add(fixedKey);
            }
          }
        }

        totalPrice += subTotalOriginal;
        totalDiscount += itemDiscount;

        orderItems.push({
          ticketTypeId: item.ticketId,
          promotionId: item.promotionId,
          qty: item.qty,
          pricePerUnit: Number(ticket.price),
          subTotal: subTotalOriginal - itemDiscount,
        });

        await this.ticketsRepository.updateTicketQuota(
          item.ticketId,
          item.qty,
          tx,
        );
      }

      if (data.pointUsed && data.pointUsed > 0) {
        await this.userPointRepository.usePoints(
          data.customerId,
          data.pointUsed,
          tx,
        );
      }

      // Apply user coupon (referral voucher) — validate and mark used
      let couponDiscount = 0;
      if (data.voucherId) {
        const coupon = await tx.userCoupon.findUnique({
          where: { id: data.voucherId },
        });
        if (!coupon) throw new Error("Coupon not found");
        if (coupon.isUsed) throw new Error("Coupon has already been used");
        if (new Date(coupon.expiresAt) < new Date())
          throw new Error("Coupon has expired");
        if (coupon.userId !== data.customerId)
          throw new Error("Coupon does not belong to this user");

        couponDiscount =
          Math.round(((totalPrice - totalDiscount - (data.pointUsed || 0)) *
            Number(coupon.discountPercentage)) /
          100);
        await this.userCouponRepository.useCouponInTx(data.voucherId, tx);
      }

      let finalPrice =
        totalPrice - totalDiscount - (data.pointUsed || 0) - couponDiscount;

      if (finalPrice < 0) {
        finalPrice = 0;
      }

      const roundedFinalPrice = Math.round(finalPrice);

      // Generate order number
      const now = new Date();
      const yy = String(now.getFullYear()).slice(-2);
      const mm = String(now.getMonth() + 1).padStart(2, "0");
      const dd = String(now.getDate()).padStart(2, "0");
      const randomNum = String(Math.floor(100000 + Math.random() * 900000));
      const invoice = `${yy}${mm}${dd}${randomNum}`;

      let snapToken: string | undefined = undefined;

      if (roundedFinalPrice > 0) {
        const parameter = {
          transaction_details: {
            order_id: invoice,
            gross_amount: roundedFinalPrice,
          },
        };

        try {
          const midtransResponse = await snap.createTransaction(parameter);
          snapToken = midtransResponse.token;
        } catch (error: any) {
          console.error(
            "Midtrans Error:",
            error?.response?.data || error?.message || error,
          );
          if (error?.response?.data?.error_messages) {
            console.error(
              "Midtrans Error Messages:",
              error.response.data.error_messages,
            );
          }
          throw new Error("Failed to generate payment link");
        }
      }

      const orderData = {
        invoice,
        totalPrice: finalPrice,
        totalOriginalPrice: totalPrice,
        pointUsed: data.pointUsed || 0,
        customerId: data.customerId,
        eventId: isSingleEvent ? firstEventId : null,
        paymentMethod: data.paymentMethod,
        voucherId: data.voucherId,
        snapToken,
        items: orderItems,
        originalPrice: totalPrice,
      };

      return await this.ordersRepository.create(orderData, tx);
    });
  };

  public findAll = async (
    filters: any,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: any[]; meta: any }> => {
    const skip = (page - 1) * limit;
    const take = limit;

    const { data, total } = await this.ordersRepository.findMany(
      filters,
      skip,
      take,
    );

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  };

  public findOne = async (id: string): Promise<any> => {
    const order = await this.ordersRepository.findById(id);

    if (!order) {
      throw new Error("Order not found");
    }

    return order;
  };

  public update = async (id: string, data: any): Promise<any> => {
    return this.ordersRepository.update(id, data);
  };

  public delete = async (id: string): Promise<any> => {
    return this.ordersRepository.delete(id);
  };

  public pay = async (orderId: string, paymentData: any): Promise<any> => {
    const order = await this.ordersRepository.findById(orderId);

    if (!order) {
      throw new Error("Order not found");
    }

    const updateData: any = {
      status: "PAID",
    };

    if (paymentData && paymentData.method) {
      updateData.paymentMethod = paymentData.method;
    }

    const updatedOrder = await this.ordersRepository.update(
      orderId,
      updateData,
    );

    // Send Invoice Email
    if (order.user?.email) {
      let promoData;
      const appliedPromos = new Map<string, number>();

      if (order.items && Array.isArray(order.items)) {
        order.items.forEach((item: any) => {
          if (item.promotion) {
            const promoCode = item.promotion.code;
            const origSubTotal = Number(item.pricePerUnit || 0) * item.quantity;
            const finalSubTotal = Number(item.totalPrice || 0);
            const diff = origSubTotal - finalSubTotal;

            if (diff > 0) {
              appliedPromos.set(
                promoCode,
                (appliedPromos.get(promoCode) || 0) + diff,
              );
            }
          }
        });
      }

      const totalItemDiscount = Array.from(appliedPromos.values()).reduce(
        (a, b) => a + b,
        0,
      );

      if (order.userCoupon) {
        const couponAmount =
          Number(order.totalOriginalPrice) -
          Number(order.totalFinalPrice) -
          order.pointsUsed -
          totalItemDiscount;
        if (couponAmount > 0) {
          appliedPromos.set(
            order.userCoupon.code,
            (appliedPromos.get(order.userCoupon.code) || 0) + couponAmount,
          );
        }
      }

      if (appliedPromos.size > 0) {
        const codes = Array.from(appliedPromos.keys()).join(", ");
        const totalAmount = Array.from(appliedPromos.values()).reduce(
          (a, b) => a + b,
          0,
        );
        promoData = {
          code: codes,
          amount: totalAmount,
        };
      }

      const emailHtml = generateInvoiceHtml({
        invoice: order.invoice,
        transactionDate: order.transactionDate,
        status: "PAID",
        paymentMethod: updatedOrder.paymentMethod || order.paymentMethod,
        totalOriginalPrice: Number(order.totalOriginalPrice),
        pointsUsed: order.pointsUsed,
        totalFinalPrice: Number(order.totalFinalPrice),
        customerName: order.user.name,
        promoData: promoData,
        items: order.items.map((item: any) => ({
          ticketName: item.ticketType.name,
          eventName: item.ticketType.event?.name,
          qty: item.quantity,
          price: Number(item.pricePerUnit || item.totalPrice / item.quantity),
          subTotal: Number(item.totalPrice),
        })),
      });

      this.emailService
        .sendEmail(
          order.user.email,
          `Invoice for Your Order: ${order.invoice}`,
          emailHtml,
        )
        .catch((err) => {
          console.error("Failed to send invoice email:", err);
        });
    }

    return updatedOrder;
  };
}
