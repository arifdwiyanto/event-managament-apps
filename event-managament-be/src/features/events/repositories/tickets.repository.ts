import { prisma } from "src/config/prisma.js";
import { Prisma } from "@prisma/client";

export class TicketsRepository {
  public create = async (
    data: any,
    tx?: Prisma.TransactionClient,
  ): Promise<any> => {
    const client = tx || prisma;
    return await client.ticketType.create({
      data,
    });
  };

  public findMany = async (
    filters: any,
    skip?: number,
    take?: number,
  ): Promise<{ data: any[]; total: number }> => {
    const [data, total] = await prisma.$transaction([
      prisma.ticketType.findMany({
        where: filters,
        include: {
          event: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        skip,
        take,
        orderBy: { name: "desc" },
      }),
      prisma.ticketType.count({ where: filters }),
    ]);

    return { data, total };
  };

  public findById = async (
    id: string,
    tx?: Prisma.TransactionClient,
  ): Promise<any> => {
    const client = tx || prisma;
    return await client.ticketType.findUnique({
      where: { id },
      include: {
        event: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  };

  public updateTicketQuota = async (
    id: string,
    qty: number,
    tx?: Prisma.TransactionClient,
  ) => {
    const client = tx || prisma;
    return await client.ticketType.update({
      where: { id },
      data: {
        quota: {
          decrement: qty,
        },
      },
    });
  };

  public update = async (
    id: string,
    data: any,
    tx?: Prisma.TransactionClient,
  ): Promise<any> => {
    const client = tx || prisma;
    return await client.ticketType.update({
      where: { id },
      data,
    });
  };

  public delete = async (id: any): Promise<any> => {
    return await prisma.ticketType.delete({
      where: { id },
    });
  };
}
