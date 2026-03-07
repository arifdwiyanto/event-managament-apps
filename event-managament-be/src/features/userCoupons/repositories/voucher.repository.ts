import { Prisma } from "@prisma/client";
import { prisma } from "../../../config/prisma.js";

export class UserCouponRepository {
  public createUserCoupon = async (
    data: any,
    tx?: Prisma.TransactionClient,
  ): Promise<any> => {
    const client = tx || prisma;
    return await client.userCoupon.create({
      data: data,
    });
  };

  public getUserCoupons = async (userId: string): Promise<any[]> => {
    return await prisma.userCoupon.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  };

  public getCouponByCode = async (
    code: string,
    userId: string
  ): Promise<any> => {
    return await prisma.userCoupon.findFirst({
      where: { code, userId },
    });
  };

  public useCoupon = async (couponId: string): Promise<any> => {
    return await prisma.userCoupon.update({
      where: { id: couponId },
      data: { isUsed: true },
    });
  };

  public useCouponInTx = async (
    couponId: string,
    tx: Prisma.TransactionClient,
  ): Promise<any> => {
    return await tx.userCoupon.update({
      where: { id: couponId },
      data: { isUsed: true },
    });
  };
}
