import { Router } from "express";
import { DashboardController } from "./controllers/dashboard.controller.js";
import { verifyToken } from "../../middlewares/verifyToken.js";
import { requireRole } from "../../middlewares/requireRole.js";
import { verifyOrganizerAccess } from "../../middlewares/verifyOrganizerAccess.js";

export class DashboardRouter {
  private router: Router;
  private dashboardController: DashboardController;

  constructor() {
    this.router = Router();
    this.dashboardController = new DashboardController();
    this.setupRoutes();
  }

  private setupRoutes = (): void => {
    // All dashboard routes require authentication + ORGANIZER role + valid organizer profile
    this.router.use(verifyToken, requireRole("ORGANIZER"), verifyOrganizerAccess);

    this.router.get("/stats", this.dashboardController.getStats);
    this.router.get("/team-info", this.dashboardController.getTeamInfo);
    this.router.get("/chart-data", this.dashboardController.getChartData);
    this.router.get("/active-events", this.dashboardController.getActiveEvents);
    this.router.get("/transactions", this.dashboardController.getTransactions);
  };

  public getRouter = (): Router => {
    return this.router;
  };
}
