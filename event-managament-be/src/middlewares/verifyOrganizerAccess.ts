import { Request, Response, NextFunction } from "express";
import { prisma } from "../config/prisma.js";

/**
 * Middleware to ensure the user has an associated organizer profile (either as owner or team member).
 * Attaches the `organizerId` to `req.user.organizerId`.
 * This should be used AFTER `verifyToken` and optionally after `requireRole("ORGANIZER")`.
 */
export const verifyOrganizerAccess = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Check if user is the owner
    const org = await prisma.organizer.findUnique({
      where: { ownerId: userId },
    });
    if (org) {
      req.user!.organizerId = org.id;
      return next();
    }

    // Check if user is a team member
    const teamMember = await prisma.organizerTeam.findFirst({
      where: { userId },
    });
    if (teamMember) {
      req.user!.organizerId = teamMember.organizerId;
      return next();
    }

    return res.status(403).json({ message: "Organizer profile required" });
  } catch (error) {
    next(error);
  }
};
