import { Prisma } from "@prisma/client";
import { prisma } from "../../../config/prisma.js";

export class OrganizerNotificationRepository {
  /**
   * Find all notifications assigned to an organizer (via their team members/owner)
   */
  public async findOrganizerNotifications(userId: string) {
    return await prisma.organizerNotificationRecipient.findMany({
      where: {
        userId,
      },
      include: {
        notification: true,
      },
      orderBy: {
        createdAt: 'desc'
      },
    });
  }

  /**
   * Count unread notifications for an organizer team member
   */
  public async countUnread(userId: string) {
    return await prisma.organizerNotificationRecipient.count({
      where: {
        userId,
        isRead: false,
      },
    });
  }

  /**
   * Mark a specific notification as read
   */
  public async markAsRead(id: string, userId: string) {
    return await prisma.organizerNotificationRecipient.update({
      where: {
        id,
        userId: userId // Extra safety
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  }

  /**
   * Mark all notifications as read for a specific user
   */
  public async markAllAsRead(userId: string) {
    return await prisma.organizerNotificationRecipient.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  }

  /**
   * Create the bare notification in organizer_notifications
   */
  public async createNotification(
    data: {
      organizerId: string;
      title: string;
      message: string;
      type: string;
      link?: string;
    },
    tx?: Prisma.TransactionClient
  ) {
    const p = tx || prisma;
    return await p.organizerNotification.create({
      data: {
        organizerId: data.organizerId,
        title: data.title,
        message: data.message,
        type: data.type,
        link: data.link,
      },
    });
  }

  /**
   * Create delivery recipients for a notification
   */
  public async createNotificationRecipients(
    userIds: string[],
    notificationId: string,
    tx?: Prisma.TransactionClient
  ) {
    const p = tx || prisma;
    return await p.organizerNotificationRecipient.createMany({
      data: userIds.map((userId) => ({
        userId,
        notificationId,
      })),
      skipDuplicates: true,
    });
  }
}
