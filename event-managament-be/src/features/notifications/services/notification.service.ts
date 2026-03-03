
import { Prisma } from "@prisma/client";
import { NotificationRepository } from "../repositories/notification.repository.js";
import { prisma } from "../../../config/prisma.js";

export class NotificationService {
  private notificationRepository: NotificationRepository;

  constructor() {
    this.notificationRepository = new NotificationRepository();
  }

  public async getUserNotifications(userId: string) {
    return await this.notificationRepository.findUserNotifications(userId);
  }

  public async getUnreadCount(userId: string) {
    return await this.notificationRepository.countUnread(userId);
  }

  public async markAsRead(userNotificationId: string, userId: string) {
    return await this.notificationRepository.markAsRead(userNotificationId, userId);
  }

  public async markAllAsRead(userId: string) {
    return await this.notificationRepository.markAllAsRead(userId);
  }

  /**
   * Send a notification to a specific user
   */
  public async sendToUser(userId: string, data: { title: string; message: string; type?: string; link?: string }, tx?: Prisma.TransactionClient) {
    const notification = await this.notificationRepository.createNotification(
      {
        title: data.title,
        message: data.message,
        type: data.type || "INFO",
        link: data.link,
      },
      tx
    );

    await this.notificationRepository.createUserNotifications([userId], notification.id, tx);
    return notification;
  }

  /**
   * Send a notification to multiple users (broadcast or multicast)
   */
  public async sendToUsers(userIds: string[], data: { title: string; message: string; type?: string; link?: string }, tx?: Prisma.TransactionClient) {
    const notification = await this.notificationRepository.createNotification(
      {
        title: data.title,
        message: data.message,
        type: data.type || "INFO",
        link: data.link,
      },
      tx
    );

    await this.notificationRepository.createUserNotifications(userIds, notification.id, tx);
    return notification;
  }

  /**
   * Send a notification to ALL users
   */
  public async broadcastToAll(data: { title: string; message: string; type?: string; link?: string }) {
    const allUsers = await prisma.user.findMany({ select: { id: true } });
    const userIds = allUsers.map(u => u.id);
    
    if (userIds.length === 0) return null;

    return await this.sendToUsers(userIds, data);
  }
}
