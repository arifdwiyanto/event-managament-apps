import { prisma } from "../../../config/prisma.js";
import { OrgRole } from "@prisma/client";

export class OrganizationsRepository {
  /**
   * Create an Organizer profile, assign ORGANIZER role to user, and set user as OWNER in OrganizerTeam.
   * All done in a single transaction.
   */
  public create = async (data: {
    ownerId: string;
    name: string;
    description?: string;
  }): Promise<any> => {
    return await prisma.$transaction(async (tx) => {
      // 1. Create the Organizer
      const organizer = await tx.organizer.create({
        data: {
          ownerId: data.ownerId,
          name: data.name,
          description: data.description || null,
        },
      });

      // 2. Add ORGANIZER role to user (if not already present)
      const existingRole = await tx.userRole.findUnique({
        where: {
          userId_role: {
            userId: data.ownerId,
            role: "ORGANIZER",
          },
        },
      });

      if (!existingRole) {
        await tx.userRole.create({
          data: {
            userId: data.ownerId,
            role: "ORGANIZER",
          },
        });
      }

      // 3. Add user as OWNER in OrganizerTeam
      await tx.organizerTeam.create({
        data: {
          organizerId: organizer.id,
          userId: data.ownerId,
          role: "OWNER",
        },
      });

      return organizer;
    });
  };

  public findByOwnerId = async (ownerId: string): Promise<any> => {
    return await prisma.organizer.findUnique({
      where: { ownerId },
      include: {
        teams: {
          include: { user: { select: { id: true, name: true, email: true } } },
        },
      },
    });
  };

  public findById = async (id: string): Promise<any> => {
    return await prisma.organizer.findUnique({
      where: { id },
      include: {
        owner: { select: { id: true, name: true, email: true } },
        teams: {
          include: { user: { select: { id: true, name: true, email: true } } },
        },
      },
    });
  };

  public findPublicById = async (id: string): Promise<any> => {
    return await prisma.organizer.findUnique({
      where: { id },
      include: {
        events: {
          orderBy: { createdAt: "desc" },
          include: {
            category: true,
            organizer: true,
            ticketTypes: true,
          }
        },
      },
    });
  };

  public findMany = async (): Promise<any[]> => {
    return await prisma.organizer.findMany({
      include: {
        owner: { select: { id: true, name: true, email: true } },
      },
    });
  };

  public update = async (id: string, data: any): Promise<any> => {
    return await prisma.organizer.update({
      where: { id },
      data,
    });
  };

  public updateLogo = async (id: string, logoUrl: string): Promise<any> => {
    return await prisma.organizer.update({
      where: { id },
      data: { logoUrl },
    });
  };

  public delete = async (id: string, ownerId: string): Promise<any> => {
    return await prisma.$transaction(async (tx) => {
      // 1. Remove all team members
      await tx.organizerTeam.deleteMany({
        where: { organizerId: id },
      });

      // 2. Remove the ORGANIZER role from the owner
      await tx.userRole.deleteMany({
        where: {
          userId: ownerId,
          role: "ORGANIZER",
        },
      });

      // 3. Delete the Organizer
      return await tx.organizer.delete({
        where: { id },
      });
    });
  };

  /**
   * Add a team member to an organizer.
   * Also assigns ORGANIZER role if the user doesn't have it yet.
   */
  public addMember = async (data: {
    organizerId: string;
    userId: string;
    role?: OrgRole;
  }): Promise<any> => {
    return await prisma.$transaction(async (tx) => {
      // 1. Add to OrganizerTeam
      const teamMember = await tx.organizerTeam.create({
        data: {
          organizerId: data.organizerId,
          userId: data.userId,
          role: data.role || "MARKETING",
        },
      });

      // 2. Add ORGANIZER role to user if not present
      const existingRole = await tx.userRole.findUnique({
        where: {
          userId_role: {
            userId: data.userId,
            role: "ORGANIZER",
          },
        },
      });

      if (!existingRole) {
        await tx.userRole.create({
          data: {
            userId: data.userId,
            role: "ORGANIZER",
          },
        });
      }

      return teamMember;
    });
  };

  /**
   * Check if a user is already a member of an organizer
   */
  public findTeamMember = async (
    organizerId: string,
    userId: string,
  ): Promise<any> => {
    return await prisma.organizerTeam.findFirst({
      where: { organizerId, userId },
    });
  };

  /**
   * Get the team member entry for a user in an organizer (to check their role)
   */
  public getTeamRole = async (
    organizerId: string,
    userId: string,
  ): Promise<any> => {
    return await prisma.organizerTeam.findFirst({
      where: { organizerId, userId },
    });
  };

  public deleteMember = async (
    organizerId: string,
    userId: string,
  ): Promise<any> => {
    const member = await prisma.organizerTeam.findFirst({
      where: { organizerId, userId },
    });
    if (!member) return null;
    return await prisma.organizerTeam.delete({
      where: { id: member.id },
    });
  };

  /**
   * Update the role of a team member within an organizer
   */
  public updateMemberRole = async (
    organizerId: string,
    userId: string,
    role: OrgRole,
  ): Promise<any> => {
    const member = await prisma.organizerTeam.findFirst({
      where: { organizerId, userId },
    });
    if (!member) return null;

    return await prisma.organizerTeam.update({
      where: { id: member.id },
      data: { role },
    });
  };

  /**
   * Find a user by email (needed for invite-by-email)
   */
  public findUserByEmail = async (email: string): Promise<any> => {
    return await prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true, email: true },
    });
  };
}
