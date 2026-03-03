import { Prisma } from "@prisma/client";
import { OrganizerNotificationRepository } from "../repositories/organizer-notification.repository.js";
import { prisma } from "../../../config/prisma.js";

export class OrganizerNotificationService {
  private repository: OrganizerNotificationRepository;

  constructor() {
    this.repository = new OrganizerNotificationRepository();
  }

  public async getNotifications(userId: string) {
    return await this.repository.findOrganizerNotifications(userId);
  }

  public async getUnreadCount(userId: string) {
    return await this.repository.countUnread(userId);
  }

  public async markAsRead(recipientId: string, userId: string) {
    return await this.repository.markAsRead(recipientId, userId);
  }

  public async markAllAsRead(userId: string) {
    return await this.repository.markAllAsRead(userId);
  }

  /**
   * Send a notification to all members of an Organizer
   * (Owner + Teams)
   */
  public async sendToOrganizer(
    organizerId: string,
    data: { title: string; message: string; type?: string; link?: string },
    tx?: Prisma.TransactionClient
  ) {
    const p = tx || prisma;

    // 1. Fetch Organizer Owner
    const org = await p.organizer.findUnique({
      where: { id: organizerId },
      select: { ownerId: true },
    });

    if (!org) {
      throw new Error(`Organizer not found: ${organizerId}`);
    }

    // 2. Fetch Organizer Teams
    const teams = await p.organizerTeam.findMany({
      where: { organizerId },
      select: { userId: true },
    });

    const userIds = new Set([org.ownerId, ...teams.map(t => t.userId)]);

    // 3. Create Notification
    const notification = await this.repository.createNotification(
      {
        organizerId,
        title: data.title,
        message: data.message,
        type: data.type || "INFO",
        link: data.link,
      },
      tx
    );

    // 4. Deliver to all members
    await this.repository.createNotificationRecipients(
      Array.from(userIds),
      notification.id,
      tx
    );

    return notification;
  }

  /**
   * Send a notification to a specific member of an Organizer
   */
  public async sendToOrganizerMember(
    organizerId: string,
    userId: string,
    data: { title: string; message: string; type?: string; link?: string },
    tx?: Prisma.TransactionClient
  ) {
    const notification = await this.repository.createNotification(
      {
        organizerId,
        title: data.title,
        message: data.message,
        type: data.type || "INFO",
        link: data.link,
      },
      tx
    );

    await this.repository.createNotificationRecipients(
      [userId],
      notification.id,
      tx
    );

    return notification;
  }

  /**
   * Broadcast a notification to ALL Organizers and their team members
   */
  public async broadcastToAllOrganizers(
    data: { title: string; message: string; type?: string; link?: string }
  ) {
    return await prisma.$transaction(async (tx) => {
      const allOrganizers = await tx.organizer.findMany({
        select: {
          id: true,
          ownerId: true,
          teams: { select: { userId: true } }
        }
      });

      if (allOrganizers.length === 0) return 0;

      let totalDelivered = 0;

      for (const org of allOrganizers) {
        const userIds = new Set([org.ownerId, ...org.teams.map((t: { userId: string }) => t.userId)]);
        
        const notification = await this.repository.createNotification(
          {
            organizerId: org.id,
            title: data.title,
            message: data.message,
            type: data.type || "BROADCAST",
            link: data.link,
          },
          tx as Prisma.TransactionClient
        );

        await this.repository.createNotificationRecipients(
          Array.from(userIds),
          notification.id,
          tx as Prisma.TransactionClient
        );
        
        totalDelivered += userIds.size;
      }

      return totalDelivered;
    });
  }
}
