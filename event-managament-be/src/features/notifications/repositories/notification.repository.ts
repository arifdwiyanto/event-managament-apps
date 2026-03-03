
import { Prisma } from "@prisma/client";
import { prisma } from "../../../config/prisma.js";

export class NotificationRepository {
  public createNotification = async (
    data: Prisma.NotificationCreateInput,
    tx?: Prisma.TransactionClient
  ) => {
    const client = tx || prisma;
    return await client.notification.create({ data });
  };

  public createUserNotifications = async (
    userIds: string[],
    notificationId: string,
    tx?: Prisma.TransactionClient
  ) => {
    const client = tx || prisma;
    const data = userIds.map((userId) => ({
      userId,
      notificationId,
    }));
    return await client.userNotification.createMany({
      data,
      skipDuplicates: true,
    });
  };

  public findUserNotifications = async (userId: string, limit: number = 20) => {
    return await prisma.userNotification.findMany({
      where: { userId },
      include: {
        notification: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    });
  };

  public markAsRead = async (userNotificationId: string, userId: string) => {
    return await prisma.userNotification.update({
      where: { 
        id: userNotificationId,
        userId: userId // Security check
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  };

  public markAllAsRead = async (userId: string) => {
    return await prisma.userNotification.updateMany({
      where: { userId, isRead: false },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  };

  public countUnread = async (userId: string) => {
    return await prisma.userNotification.count({
      where: { userId, isRead: false },
    });
  };
}
