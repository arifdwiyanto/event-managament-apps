
import { Router } from "express";
import { NotificationController } from "./controllers/notification.controller.js";
import { OrganizerNotificationController } from "./controllers/organizer-notification.controller.js";
import { verifyToken } from "../../middlewares/verifyToken.js";

export class NotificationRouter {
  private router: Router;
  private notificationController: NotificationController;
  private organizerNotificationController: OrganizerNotificationController;

  constructor() {
    this.router = Router();
    this.notificationController = new NotificationController();
    this.organizerNotificationController = new OrganizerNotificationController();
    this.setupRoutes();
  }

  private setupRoutes = (): void => {
    // Regular User Notifications
    this.router.get("/", verifyToken, this.notificationController.getMyNotifications);
    this.router.get("/unread-count", verifyToken, this.notificationController.getUnreadCount);
    this.router.patch("/:id/read", verifyToken, this.notificationController.markAsRead);
    this.router.patch("/read-all", verifyToken, this.notificationController.markAllAsRead);

    // Organizer Notifications
    this.router.get("/org", verifyToken, this.organizerNotificationController.getMyNotifications);
    this.router.get("/org/unread-count", verifyToken, this.organizerNotificationController.getUnreadCount);
    this.router.patch("/org/:id/read", verifyToken, this.organizerNotificationController.markAsRead);
    this.router.patch("/org/read-all", verifyToken, this.organizerNotificationController.markAllAsRead);
  };

  public getRouter = (): Router => {
    return this.router;
  };
}
