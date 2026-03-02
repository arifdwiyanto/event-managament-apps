import { Router } from "express";
import { UserPointController } from "./controllers/userPoint.controller.js";
import { verifyToken } from "../../middlewares/verifyToken.js";

export class UserPointRouter {
  private router: Router;
  private userPointController: UserPointController;

  constructor() {
    this.router = Router();
    this.userPointController = new UserPointController();
    this.setupRoutes();
  }

  private setupRoutes = (): void => {
    this.router.get("/balance", verifyToken, this.userPointController.getUserBalance);
    this.router.post("/add", verifyToken, this.userPointController.addPoint);
    this.router.post("/use", verifyToken, this.userPointController.usePoints);
  };

  public getRouter = (): Router => {
    return this.router;
  };
}
