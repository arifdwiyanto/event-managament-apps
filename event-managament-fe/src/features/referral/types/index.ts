export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  memberSince: string;
  location: string;
  referralCode: string;
  tier: "Bronze" | "Silver" | "Gold" | "Platinum";
}

export interface PointsBalance {
  current: number;
  totalEarned: number;
  usedAmount: number;
  usedPercentage: number;
  expiresIn: string | null;
}

export interface ActivityItem {
  id: string;
  type: "referral" | "purchase" | "streak" | "bonus" | "coupon" | "point_usage";
  title: string;
  description: string;
  points: number;
  timeAgo: string;
  iconColor: string;
}

export interface ReferralStats {
  friends: number;
  coupons: number;
}

export interface Coupon {
  id: string;
  discount: string;
  description: string;
  isRedeemed: boolean;
}

export interface UserReferralData {
  profile: UserProfile;
  pointsBalance: PointsBalance;
  recentActivity: ActivityItem[];
  referralStats: ReferralStats;
  coupons: Coupon[];
}
