import { Request, Response, NextFunction } from "express";
import { prisma } from "../config/prisma.js";
import { OrgRole } from "@prisma/client";

/**
 * Middleware that checks if the authenticated user has a specific role
 * within the organization that owns the resource.
 *
 * @param allowedRoles roles that are allowed to access the route
 * @param resourceType the type of resource being accessed ('event', 'promotion', 'organizer')
 */
export const requireOrgRole = (
  allowedRoles: OrgRole[],
  resourceType: "event" | "promotion" | "organizer" | "order" = "organizer"
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      if (!user) {
        return res.status(401).json({ message: "Unauthorized: Please login" });
      }

      let organizerId: string | undefined;

      // 1. Identify organizerId based on resourceType and request params/body
      if (resourceType === "organizer") {
        organizerId = req.params.id || req.body.organizerId;
      } else if (resourceType === "event") {
        const eventId = req.params.id || req.body.eventId;
        if (!eventId) {
          return res.status(400).json({ message: "Event ID is required" });
        }
        const event = await prisma.event.findUnique({
          where: { id: eventId },
          select: { organizerId: true },
        });
        organizerId = event?.organizerId;
      } else if (resourceType === "promotion") {
        const promotionId = req.params.id || req.body.promotionId;
        if (!promotionId) {
          return res.status(400).json({ message: "Promotion ID is required" });
        }
        const promotion = await prisma.promotion.findUnique({
          where: { id: promotionId },
          select: { organizerId: true },
        });
        organizerId = promotion?.organizerId;
      } else if (resourceType === "order") {
        const orderId = req.params.id || req.body.orderId;
        if (!orderId) {
          return res.status(400).json({ message: "Order ID is required" });
        }
        const order = await prisma.transaction.findUnique({
          where: { id: orderId },
          include: {
            event: {
              select: { organizerId: true }
            }
          }
        });
        organizerId = order?.event?.organizerId;
      }

      if (!organizerId) {
        return res.status(404).json({ message: "Organizer context not found" });
      }

      // 2. Check if user is OWNER (explicit check if ownerId matches)
      const organizer = await prisma.organizer.findUnique({
        where: { id: organizerId },
        select: { ownerId: true },
      });

      if (organizer?.ownerId === user.id) {
        return next();
      }

      // 3. Check role in OrganizerTeam
      const teamMember = await prisma.organizerTeam.findFirst({
        where: {
          organizerId,
          userId: user.id,
        },
      });

      if (!teamMember || !allowedRoles.includes(teamMember.role)) {
        return res.status(403).json({
          message: `Forbidden: You need one of [${allowedRoles.join(
            ", "
          )}] roles in this organization`,
        });
      }

      next();
    } catch (error) {
      console.error("Error in requireOrgRole middleware:", error);
      res.status(500).json({ message: "Internal server error during authorization" });
    }
  };
};
