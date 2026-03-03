import { Router } from "express";
import { ReportController } from "./report.controller.js";
import { ReportService } from "./report.service.js";
import { ReportRepository } from "./report.repository.js";
import { verifyToken } from "../../middlewares/verifyToken.js";
import { requireRole } from "../../middlewares/requireRole.js";
import { verifyOrganizerAccess } from "../../middlewares/verifyOrganizerAccess.js";
import { Role } from "@prisma/client";

export class ReportRouter {
  private router: Router;
  private reportController: ReportController;

  constructor() {
    this.router = Router();
    this.reportController = new ReportController(new ReportService(new ReportRepository()));
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // Only Organizer can access these reports
    this.router.use(verifyToken, requireRole(Role.ORGANIZER), verifyOrganizerAccess);

    this.router.get("/sales-performance", this.reportController.getSalesPerformance.bind(this.reportController));
    this.router.get("/sales-by-category", this.reportController.getSalesByCategory.bind(this.reportController));
    this.router.get("/transactions", this.reportController.getTransactionReports.bind(this.reportController));
    this.router.get("/top-events", this.reportController.getTopEvents.bind(this.reportController));
    this.router.get("/capacity-vs-sales", this.reportController.getCapacityVsSales.bind(this.reportController));
    this.router.get("/promotion-effectiveness", this.reportController.getPromotionEffectiveness.bind(this.reportController));
    this.router.get("/transaction-status", this.reportController.getTransactionStatusDistribution.bind(this.reportController));
    this.router.get("/event-ratings", this.reportController.getEventRatings.bind(this.reportController));
    this.router.get("/revenue-by-ticket-type", this.reportController.getRevenueByTicketType.bind(this.reportController));
  }

  getRouter(): Router {
    return this.router;
  }
}
