import { Request, Response, NextFunction } from "express";
import { ReportService } from "./report.service.js";

// Helper to parse optional date query params
function parseDateParam(value: unknown): Date | undefined {
  if (!value) return undefined;
  const d = new Date(value as string);
  return isNaN(d.getTime()) ? undefined : d;
}

export class ReportController {
  constructor(private reportService: ReportService) {}

  async getSalesPerformance(req: Request, res: Response, next: NextFunction) {
    try {
      const organizerId = req.user?.organizerId;
      const { startDate, endDate, interval, categoryId } = req.query;
      
      const sDate = startDate ? new Date(startDate as string) : new Date(new Date().setMonth(new Date().getMonth() - 1));
      const eDate = endDate ? new Date(endDate as string) : new Date();
      const intvl = (interval as 'day' | 'month' | 'year') || 'day';

      if (!organizerId) {
        return res.status(401).json({ success: false, message: "Unauthorized: Organizer ID missing" });
      }

      const data = await this.reportService.getSalesPerformance(organizerId, sDate, eDate, intvl, categoryId as string | undefined);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async getSalesByCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const organizerId = req.user?.organizerId;
      const categoryId = req.query.categoryId as string | undefined;
      const sDate = parseDateParam(req.query.startDate);
      const eDate = parseDateParam(req.query.endDate);
      if (!organizerId) return res.status(401).json({ success: false, message: "Unauthorized" });

      const data = await this.reportService.getSalesByCategory(organizerId, categoryId, sDate, eDate);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async getTransactionReports(req: Request, res: Response, next: NextFunction) {
    try {
      const organizerId = req.user?.organizerId;
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const categoryId = req.query.categoryId as string | undefined;
      const sDate = parseDateParam(req.query.startDate);
      const eDate = parseDateParam(req.query.endDate);
      
      if (!organizerId) return res.status(401).json({ success: false, message: "Unauthorized" });

      const result = await this.reportService.getTransactionReports(organizerId, page, limit, categoryId, sDate, eDate);
      res.status(200).json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }

  async getTopEvents(req: Request, res: Response, next: NextFunction) {
    try {
      const organizerId = req.user?.organizerId;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
      const categoryId = req.query.categoryId as string | undefined;
      const sDate = parseDateParam(req.query.startDate);
      const eDate = parseDateParam(req.query.endDate);
      
      if (!organizerId) return res.status(401).json({ success: false, message: "Unauthorized" });

      const data = await this.reportService.getTopEvents(organizerId, limit, categoryId, sDate, eDate);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async getCapacityVsSales(req: Request, res: Response, next: NextFunction) {
    try {
      const organizerId = req.user?.organizerId;
      const categoryId = req.query.categoryId as string | undefined;
      const sDate = parseDateParam(req.query.startDate);
      const eDate = parseDateParam(req.query.endDate);
      if (!organizerId) return res.status(401).json({ success: false, message: "Unauthorized" });

      const data = await this.reportService.getCapacityVsSales(organizerId, categoryId, sDate, eDate);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async getPromotionEffectiveness(req: Request, res: Response, next: NextFunction) {
    try {
      const organizerId = req.user?.organizerId;
      const categoryId = req.query.categoryId as string | undefined;
      const sDate = parseDateParam(req.query.startDate);
      const eDate = parseDateParam(req.query.endDate);
      const interval = (req.query.interval as 'day' | 'month' | 'year') || 'month';
      
      if (!organizerId) return res.status(401).json({ success: false, message: "Unauthorized" });

      const data = await this.reportService.getPromotionEffectiveness(organizerId, categoryId, sDate, eDate, interval);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async getTransactionStatusDistribution(req: Request, res: Response, next: NextFunction) {
    try {
      const organizerId = req.user?.organizerId;
      const categoryId = req.query.categoryId as string | undefined;
      const sDate = parseDateParam(req.query.startDate);
      const eDate = parseDateParam(req.query.endDate);
      if (!organizerId) return res.status(401).json({ success: false, message: "Unauthorized" });

      const data = await this.reportService.getTransactionStatusDistribution(organizerId, categoryId, sDate, eDate);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async getEventRatings(req: Request, res: Response, next: NextFunction) {
    try {
      const organizerId = req.user?.organizerId;
      const categoryId = req.query.categoryId as string | undefined;
      const sDate = parseDateParam(req.query.startDate);
      const eDate = parseDateParam(req.query.endDate);
      if (!organizerId) return res.status(401).json({ success: false, message: "Unauthorized" });

      const data = await this.reportService.getEventRatings(organizerId, categoryId, sDate, eDate);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async getRevenueByTicketType(req: Request, res: Response, next: NextFunction) {
    try {
      const organizerId = req.user?.organizerId;
      const categoryId = req.query.categoryId as string | undefined;
      const sDate = parseDateParam(req.query.startDate);
      const eDate = parseDateParam(req.query.endDate);
      if (!organizerId) return res.status(401).json({ success: false, message: "Unauthorized" });

      const data = await this.reportService.getRevenueByTicketType(organizerId, categoryId, sDate, eDate);
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }
}
