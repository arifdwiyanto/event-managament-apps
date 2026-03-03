import { Request, Response, NextFunction } from "express";
import { UserCouponService } from "../services/userCoupon.service.js";

export class UserCouponController {
  private userCouponService: UserCouponService;

  constructor() {
    this.userCouponService = new UserCouponService();
  }

  public getUserCoupons = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(400).json({ message: "UserId is required" });
        return;
      }

      const coupons = await this.userCouponService.getUserCoupons(userId);

      res.status(200).json({ coupons });
    } catch (error) {
      next(error);
    }
  };

  public useCoupon = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(400).json({ message: "UserId is required" });
        return;
      }

      const { code } = req.body;

      if (!code) {
        res.status(400).json({ message: "Coupon code is required" });
        return;
      }

      const coupon = await this.userCouponService.useCoupon(userId, code);

      res.status(200).json({ message: "Coupon used successfully", coupon });
    } catch (error) {
      next(error);
    }
  };
}
