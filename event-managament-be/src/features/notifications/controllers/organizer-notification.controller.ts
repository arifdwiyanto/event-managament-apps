import { Request, Response, NextFunction } from "express";
import { OrganizerNotificationService } from "../services/organizer-notification.service.js";

export class OrganizerNotificationController {
  private service: OrganizerNotificationService;

  constructor() {
    this.service = new OrganizerNotificationService();
  }

  public getMyNotifications = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const notifications = await this.service.getNotifications(userId);
      res.status(200).json(notifications);
    } catch (error) {
      next(error);
    }
  };

  public getUnreadCount = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const count = await this.service.getUnreadCount(userId);
      res.status(200).json({ count });
    } catch (error) {
      next(error);
    }
  };

  public markAsRead = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const { id } = req.params;
      await this.service.markAsRead(id as string, userId);
      res.status(200).json({ message: "Organizer notification marked as read" });
    } catch (error) {
      next(error);
    }
  };

  public markAllAsRead = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      await this.service.markAllAsRead(userId);
      res.status(200).json({ message: "All organizer notifications marked as read" });
    } catch (error) {
      next(error);
    }
  };
}
