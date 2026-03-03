
import { Prisma } from "@prisma/client";
import { prisma } from "../../../config/prisma.js";

export class ReferralRepository {
  public findUserWithReferralData = async (userId: string): Promise<any> => {
    return await prisma.user.findUnique({
      where: { id: userId },
      include: {
        points: true,
        coupons: true,
        referralsSent: true,
        referralsReceived: true,
      },
    });
  };

  public createReferral = async (
    data: Prisma.ReferralCreateInput,
    tx?: Prisma.TransactionClient,
  ) => {
    const client = tx || prisma;
    return await client.referral.create({
      data: data,
    });
  };
}
