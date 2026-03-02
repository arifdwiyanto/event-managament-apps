import { UserCouponRepository } from "../repositories/voucher.repository.js";

export class UserCouponService {
  private userCouponRepository: UserCouponRepository;

  constructor() {
    this.userCouponRepository = new UserCouponRepository();
  }

  public getUserCoupons = async (userId: string): Promise<any[]> => {
    const coupons = await this.userCouponRepository.getUserCoupons(userId);

    return coupons.map((coupon: any) => ({
      id: coupon.id,
      code: coupon.code,
      discountPercentage: Number(coupon.discountPercentage),
      expiresAt: coupon.expiresAt,
      isUsed: coupon.isUsed,
      isExpired: new Date(coupon.expiresAt) < new Date(),
    }));
  };

  public useCoupon = async (userId: string, code: string): Promise<any> => {
    const coupon = await this.userCouponRepository.getCouponByCode(code, userId);

    if (!coupon) {
      throw new Error("Coupon not found");
    }

    if (coupon.isUsed) {
      throw new Error("Coupon has already been used");
    }

    if (new Date(coupon.expiresAt) < new Date()) {
      throw new Error("Coupon has expired");
    }

    return await this.userCouponRepository.useCoupon(coupon.id);
  };
}
