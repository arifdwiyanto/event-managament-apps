import { prisma } from "../../../config/prisma.js";
import { OrdersRepository } from "../repositories/orders.repository.js";
import { TicketsRepository } from "../../events/repositories/tickets.repository.js";
import { generateInvoiceHtml } from "../../../services/email/templates/invoice.template.js";
import { EmailService } from "../../../services/email/email.service.js";

export interface IOrdersServiceProps {
  customerId: string;
  pointUsed?: number;
  voucherId?: string;
  promotionId?: string;
  paymentMethod: string;
  items: {
    ticketId: string;
    qty: number;
  }[];
}

export class OrdersService {
  private ordersRepository: OrdersRepository;
  private ticketsRepository: TicketsRepository;
  private emailService: EmailService;

  constructor() {
    this.ordersRepository = new OrdersRepository();
    this.ticketsRepository = new TicketsRepository();
    this.emailService = new EmailService();
  }

  public create = async (data: IOrdersServiceProps): Promise<any> => {
    return await prisma.$transaction(async (tx: any) => {
      let eventId: string | null = null;
      let totalPrice = 0;
      const orderItems: any[] = [];

      for (let item of data.items) {
        const ticket = await this.ticketsRepository.findById(item.ticketId, tx);
        if (!ticket) {
          throw new Error(`Ticket with id ${item.ticketId} not found`);
        }

        if (eventId === null) {
          eventId = ticket.eventId;
        } else if (eventId !== ticket.eventId) {
          throw new Error(
            "Cannot mix tickets from different events in one order",
          );
        }

        if (ticket.quota < item.qty) {
          throw new Error(`Insufficient quota for ticket id ${item.ticketId}`);
        }

        const subTotal = Number(ticket.price) * item.qty;
        totalPrice += subTotal;

        orderItems.push({
          ticketTypeId: item.ticketId,
          qty: item.qty,
          pricePerUnit: Number(ticket.price),
          subTotal: subTotal,
        });

        await this.ticketsRepository.updateTicketQuota(
          item.ticketId,
          item.qty,
          tx,
        );
      }

      if (!eventId) {
        throw new Error("No valid event found for tickets");
      }

      let promoDiscount = 0;
      if (data.promotionId) {
        const promotion = await tx.promotion.findUnique({
          where: { id: data.promotionId },
          include: { events: true },
        });

        if (!promotion) {
          throw new Error("Invalid promotion code");
        }

        const isEventEligible = promotion.events.some(
          (pe: any) => pe.eventId === eventId,
        );

        if (!isEventEligible) {
          throw new Error("Promotion is not applicable for this event");
        }

        if (
          promotion.startDate > new Date() ||
          promotion.endDate < new Date()
        ) {
          throw new Error("Promotion is expired or not yet active");
        }

        if (promotion.maxUsage !== null) {
          const usageCount = await tx.transaction.count({
            where: { promotionId: promotion.id },
          });
          if (usageCount >= promotion.maxUsage) {
            throw new Error("Promotion usage limit reached");
          }
        }

        if (promotion.discountPercentage) {
          promoDiscount =
            (totalPrice * Number(promotion.discountPercentage)) / 100;
        } else if (promotion.discountAmount) {
          promoDiscount = Number(promotion.discountAmount);
        }
      }

      let finalPrice = totalPrice - promoDiscount - (data.pointUsed || 0);

      if (finalPrice < 0) {
        finalPrice = 0;
      }

      const invoice = `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      console.log(Date.now());
      console.log(invoice);

      const orderData = {
        invoice,
        totalPrice: finalPrice,
        pointUsed: data.pointUsed || 0,
        customerId: data.customerId,
        eventId,
        paymentMethod: data.paymentMethod,
        voucherId: data.voucherId,
        promotionId: data.promotionId,
        items: orderItems,
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
      const emailHtml = generateInvoiceHtml({
        invoice: order.invoice,
        transactionDate: order.transactionDate,
        status: "PAID",
        paymentMethod: updatedOrder.paymentMethod || order.paymentMethod,
        totalOriginalPrice: order.totalOriginalPrice,
        pointsUsed: order.pointsUsed,
        totalFinalPrice: order.totalFinalPrice,
        customerName: order.user.name,
        eventName: order.event?.name || "Event",
        items: order.items.map((item: any) => ({
          ticketName: item.ticketType.name,
          qty: item.quantity,
          price: item.pricePerUnit || item.totalPrice / item.quantity,
          subTotal: item.totalPrice,
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

  public updatePaymentProof = async (
    orderId: string,
    paymentProofUrl: string,
  ): Promise<any> => {
    const order = await this.ordersRepository.findById(orderId);

    if (!order) {
      throw new Error("Order not found");
    }

    return await this.ordersRepository.update(orderId, {
      paymentProofUrl,
    });
  };
}
