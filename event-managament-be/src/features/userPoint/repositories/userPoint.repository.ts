import { prisma } from "../../../config/prisma.js";
import { Prisma } from "@prisma/client";

export class UserPointRepository {
  public addPoint = async (
    userId: string,
    amount: number,
    expiredDate: Date,
    tx?: Prisma.TransactionClient,
  ): Promise<any> => {
    const client = tx || prisma;
    return await client.point.create({
      data: {
        userId: userId,
        amount: amount,
        remainingAmount: amount,
        type: "EARN_REFERRAL" as any, 
        expiresAt: expiredDate,
      },
    });
  };

  public getUserBalance = async (userId: string): Promise<number> => {
    const result = await prisma.point.aggregate({
      where: {
        userId: userId,
        expiresAt: {
          gt: new Date(),
        },
      },
      _sum: {
        remainingAmount: true,
      },
    });
    return result._sum.remainingAmount || 0;
  };

  public usePoints = async (
    userId: string,
    amountToUse: number,
    tx?: Prisma.TransactionClient,
  ): Promise<void> => {
    const client = tx || prisma;
    const availablePoints = await client.point.findMany({
      where: {
        userId: userId,
        expiresAt: { gt: new Date() },
        remainingAmount: { gt: 0 },
      },
      orderBy: { expiresAt: "asc" },
    });

    let needed = amountToUse;
    for (const point of availablePoints) {
      if (needed <= 0) break;
      const take = Math.min(needed, point.remainingAmount);

      await client.point.update({
        where: { id: point.id },
        data: {
          remainingAmount: point.remainingAmount - take,
        },
      });
      needed -= take;
    }
    if (needed > 0) throw new Error("points are not enough");
  };
}
