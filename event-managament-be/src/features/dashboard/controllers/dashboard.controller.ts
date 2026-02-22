import { Request, Response, NextFunction } from "express";
import { DashboardService } from "../services/dashboard.service.js";
import { prisma } from "../../../config/prisma.js";

export class DashboardController {
  private service: DashboardService;

  constructor() {
    this.service = new DashboardService();
  }

  private getOrganizerId = async (userId?: string): Promise<string | null> => {
    if (!userId) return null;
    const org = await prisma.organizer.findUnique({ where: { ownerId: userId } });
    return org?.id || null;
  };

  public getStats = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const organizerId = await this.getOrganizerId(req.user?.id);
      if (!organizerId) {
        res.status(403).json({ message: "Organizer profile required" });
        return;
      }
      
      const stats = await this.service.getStats(organizerId);
      res.status(200).json(stats);
    } catch (error) {
      next(error);
    }
  };

  public getTeamInfo = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const organizerId = await this.getOrganizerId(req.user?.id);
      if (!organizerId) {
        res.status(403).json({ message: "Organizer profile required" });
        return;
      }

      const info = await this.service.getTeamInfo(organizerId);
      res.status(200).json(info);
    } catch (error) {
      next(error);
    }
  };

  public getChartData = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const organizerId = await this.getOrganizerId(req.user?.id);
      if (!organizerId) {
        res.status(403).json({ message: "Organizer profile required" });
        return;
      }

      const filter = req.query.filter as "weekly" | "monthly" | "yearly" || "weekly";
      const data = await this.service.getChartData(organizerId, filter);
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  };

  public getActiveEvents = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const organizerId = await this.getOrganizerId(req.user?.id);
      if (!organizerId) {
        res.status(403).json({ message: "Organizer profile required" });
        return;
      }

      const events = await this.service.getActiveEvents(organizerId);
      res.status(200).json(events);
    } catch (error) {
      next(error);
    }
  };

  public getTransactions = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const organizerId = await this.getOrganizerId(req.user?.id);
      if (!organizerId) {
        res.status(403).json({ message: "Organizer profile required" });
        return;
      }

      const txs = await this.service.getRecentTransactions(organizerId);
      res.status(200).json(txs);
    } catch (error) {
      next(error);
    }
  };
}
