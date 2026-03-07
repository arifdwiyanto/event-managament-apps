import apiFetch from "@/services/apiFetch";

export interface UserCoupon {
  id: string;
  code: string;
  discountPercentage: number;
  expiresAt: string;
  isUsed: boolean;
  isExpired: boolean;
}

export const getUserCoupons = async (): Promise<UserCoupon[]> => {
  const { data } = await apiFetch.get<{ coupons: UserCoupon[] }>("/user-coupons");
  return data.coupons ?? [];
};
