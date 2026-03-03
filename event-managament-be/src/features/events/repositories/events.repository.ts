import { prisma } from "src/config/prisma.js";
import { Prisma } from "@prisma/client";

export class EventsRepository {
  public create = async (
    data: any,
    tx?: Prisma.TransactionClient,
  ): Promise<any> => {
    const client = tx || prisma;
    return await client.event.create({
      data,
    });
  };

  public findMany = async (
    filters: any,
    skip?: number,
    take?: number,
  ): Promise<{ data: any[]; total: number }> => {
    const [data, total] = await prisma.$transaction([
      prisma.event.findMany({
        where: filters,
        include: {
          category: true,
          organizer: true,
          ticketTypes: true,
        },
        skip,
        take,
        orderBy: { createdAt: "desc" },
      }),
      prisma.event.count({ where: filters }),
    ]);

    return { data, total };
  };

  public findById = async (id: any): Promise<any> => {
    return await prisma.event.findUnique({
      where: { id },
      include: {
        category: true,
        organizer: true,
        ticketTypes: true,
        promotions: {
          include: {
            promotion: true,
          },
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
    return await client.event.update({
      where: { id },
      data,
    });
  };

  public delete = async (id: any): Promise<any> => {
    return await prisma.event.delete({
      where: { id },
    });
  };
}
