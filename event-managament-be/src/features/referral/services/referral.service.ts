import { ReferralRepository } from "../repositories/referral.repository.js";

export class ReferralService {
  private referralRepository: ReferralRepository;

  constructor() {
    this.referralRepository = new ReferralRepository();
  }

  public getReferralData = async (userId: string) => {
    const user = await this.referralRepository.findUserWithReferralData(userId);

    if (!user) {
      throw new Error("User not found");
    }

    // Find the nearest expiry date from active points
    const now = new Date();
    const activePoints = user.points.filter((p: any) => p.expiresAt > now && p.remainingAmount > 0);
    const nearestExpiry = activePoints.length > 0
      ? activePoints.reduce((nearest: Date, p: any) => p.expiresAt < nearest ? p.expiresAt : nearest, activePoints[0].expiresAt)
      : null;

    // Calculate points
    const currentPoints = activePoints.reduce((acc: number, curr: any) => acc + curr.remainingAmount, 0);

    // Determines Tier
    const tier = "Bronze"; // Placeholder

    // Recent Activity
    const recentActivity = [
        ...user.referralsSent.map((ref: any) => ({
            id: ref.id,
            type: "referral" as const,
            title: "Referred a friend",
            description: `You referred a user`,
            points: 10000,
            timeAgo: ref.createdAt.toISOString(),
            iconColor: "text-green-500",
        })),
        ...user.referralsReceived.map((ref: any) => ({
             id: ref.id,
            type: "coupon" as const,
            title: "Referred by friend",
            description: `You received a 10% discount coupon`, 
            points: 0, 
            timeAgo: ref.createdAt.toISOString(),
            iconColor: "text-blue-500",
        }))
    ].sort((a: any, b: any) => new Date(b.timeAgo).getTime() - new Date(a.timeAgo).getTime());


    // Coupons
    const coupons = user.coupons.map((uv: any) => ({
        id: uv.id,
        discount: `${uv.discountPercentage}%`,
        description: "Referral Discount",
        isRedeemed: uv.isUsed
    }));

    return {
      profile: {
        id: user.id,
        name: user.name,
        avatar: user.avatarUrl,
        memberSince: user.createdAt.toISOString(),
        location: "Indonesia",
        referralCode: user.referralCode,
        tier: tier,
      },
      pointsBalance: {
        current: currentPoints,
        nextTier: "Silver",
        nextTierProgress: 50,
        expiresIn: nearestExpiry ? nearestExpiry.toISOString().split('T')[0] : null,
      },
      recentActivity: recentActivity,
      referralStats: {
        friends: user.referralsSent.length,
        coupons: coupons.length,
      },
      coupons: coupons,
    };
  };
}
