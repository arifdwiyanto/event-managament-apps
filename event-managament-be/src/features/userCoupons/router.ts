import { Router } from "express";
import { UserCouponController } from "./controllers/userCoupon.controller.js";
import { verifyToken } from "../../middlewares/verifyToken.js";

export class UserCouponRouter {
  private router: Router;
  private userCouponController: UserCouponController;

  constructor() {
    this.router = Router();
    this.userCouponController = new UserCouponController();
    this.setupRoutes();
  }

  private setupRoutes = (): void => {
    this.router.get("/", verifyToken, this.userCouponController.getUserCoupons);
    this.router.post("/use", verifyToken, this.userCouponController.useCoupon);
  };

  public getRouter = (): Router => {
    return this.router;
  };
}
