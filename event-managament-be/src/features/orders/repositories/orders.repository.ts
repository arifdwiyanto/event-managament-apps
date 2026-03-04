import { prisma } from "../../../config/prisma.js";
import { Prisma } from "@prisma/client";

export interface IOrdersRepositoryProps {
  invoice: string;
  totalPrice: number;
  pointUsed: number;
  customerId: string;
  eventId: string;
  paymentMethod: string;
  voucherId?: string;
  promotionId?: string;
  items: {
    ticketTypeId: string;
    qty: number;
    subTotal: number;
    pricePerUnit?: number;
    totalPrice?: number;
  }[];
}

export class OrdersRepository {
  public create = async (
    data: IOrdersRepositoryProps,
    tx?: Prisma.TransactionClient,
  ): Promise<any> => {
    const client = tx || prisma;
    return await client.transaction.create({
      data: {
        invoice: data.invoice,
        totalFinalPrice: data.totalPrice,
        totalOriginalPrice: data.totalPrice + (data.pointUsed || 0),
        pointsUsed: data.pointUsed,
        userId: data.customerId,
        eventId: data.eventId,
        paymentMethod: data.paymentMethod,
        userCouponId: data.voucherId,
        promotionId: data.promotionId,
        items: {
          create: data.items.map((item) => ({
            ticketType: { connect: { id: item.ticketTypeId } },
            quantity: item.qty,
            totalPrice: item.subTotal,
            pricePerUnit:
              item.pricePerUnit ||
              (item.qty > 0 ? item.subTotal / item.qty : 0),
          })),
        },
      } as any,
      include: {
        items: true,
      },
    });
  };

  public findMany = async (
    filters: any,
    skip?: number,
    take?: number,
  ): Promise<{ data: any[]; total: number }> => {
    const { organizerId, ...restFilters } = filters;
    const where: any = { ...restFilters };

    if (organizerId) {
      where.event = {
        organizerId: organizerId,
      };
    }

    const [data, total] = await prisma.$transaction([
      prisma.transaction.findMany({
        where,
        include: {
          user: true,
          event: true,
          items: {
            include: {
              ticketType: true,
            },
          },
        },
        skip,
        take,
        orderBy: { transactionDate: "desc" },
      }),
      prisma.transaction.count({ where }),
    ]);

    return { data, total };
  };

  public findById = async (id: string): Promise<any> => {
    return await prisma.transaction.findUnique({
      where: { id },
      include: {
        user: true,
        event: {
          include: {
            organizer: true,
          },
        },
        promotion: true,
        items: {
          include: {
            ticketType: true,
          },
        },
      },
    });
  };

  public update = async (id: string, data: any): Promise<any> => {
    return await prisma.transaction.update({
      where: { id },
      data,
    });
  };

  public delete = async (id: string): Promise<any> => {
    return await prisma.transaction.delete({
      where: { id },
    });
  };
}
