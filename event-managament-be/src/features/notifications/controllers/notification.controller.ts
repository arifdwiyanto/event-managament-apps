
import { Request, Response, NextFunction } from "express";
import { NotificationService } from "../services/notification.service.js";

export class NotificationController {
  private notificationService: NotificationService;

  constructor() {
    this.notificationService = new NotificationService();
  }

  public getMyNotifications = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const notifications = await this.notificationService.getUserNotifications(userId);
      res.status(200).json(notifications);
    } catch (error) {
      next(error);
    }
  };

  public getUnreadCount = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const count = await this.notificationService.getUnreadCount(userId);
      res.status(200).json({ count });
    } catch (error) {
      next(error);
    }
  };

  public markAsRead = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const { id } = req.params;
      await this.notificationService.markAsRead(id as string, userId);
      res.status(200).json({ message: "Notification marked as read" });
    } catch (error) {
      next(error);
    }
  };

  public markAllAsRead = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      await this.notificationService.markAllAsRead(userId);
      res.status(200).json({ message: "All notifications marked as read" });
    } catch (error) {
      next(error);
    }
  };
}
