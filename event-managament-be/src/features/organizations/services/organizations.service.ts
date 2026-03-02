import { OrganizationsRepository } from "../repositories/organizations.repository.js";
import { deleteCloudinaryImage } from "../../uploadCloudinary/utils/uploadImage.js";
import { OrgRole } from "@prisma/client";
import { OrganizerNotificationService } from "../../notifications/services/organizer-notification.service.js";
import { prisma } from "../../../config/prisma.js";

export class OrganizationsService {
  private repository: OrganizationsRepository;
  private notificationService: OrganizerNotificationService;

  constructor() {
    this.repository = new OrganizationsRepository();
    this.notificationService = new OrganizerNotificationService();
  }

  /**
   * Create a new Organizer profile for a user.
   * The user becomes the OWNER and gets the ORGANIZER role.
   */
  public create = async (
    userId: string,
    data: { name: string; description?: string },
  ): Promise<any> => {
    // Check if user already owns an organizer
    const existing = await this.repository.findByOwnerId(userId);
    if (existing) {
      throw { status: 400, message: "You already own an organizer profile" };
    }

    // Validate name
    if (!data.name || data.name.trim().length === 0) {
      throw { status: 400, message: "Organizer name is required" };
    }

    return await this.repository.create({
      ownerId: userId,
      name: data.name.trim(),
      description: data.description?.trim(),
    });
  };

  public findAll = async (): Promise<any[]> => {
    return await this.repository.findMany();
  };

  public findOne = async (id: string): Promise<any> => {
    const organizer = await this.repository.findById(id);
    if (!organizer) {
      throw { status: 404, message: "Organizer not found" };
    }
    return organizer;
  };

  public findPublicOne = async (id: string): Promise<any> => {
    const organizer = await this.repository.findPublicById(id);
    if (!organizer) {
      throw { status: 404, message: "Organizer not found" };
    }
    return organizer;
  };

  public update = async (id: string, data: any): Promise<any> => {
    const organizer = await this.repository.findById(id);
    if (!organizer) {
      throw { status: 404, message: "Organizer not found" };
    }
    return await this.repository.update(id, data);
  };

  public delete = async (id: string, requestingUserId: string): Promise<any> => {
    const organizer = await this.repository.findById(id);
    if (!organizer) {
      throw { status: 404, message: "Organizer not found" };
    }
    if (organizer.ownerId !== requestingUserId) {
      throw { status: 403, message: "Only the OWNER can delete the organizer" };
    }
    return await this.repository.delete(id, organizer.ownerId);
  };

  public updateLogo = async (id: string, requestingUserId: string, fileUrl: string | undefined): Promise<any> => {
    if (!fileUrl) {
      throw { status: 400, message: "No image file provided" };
    }
    const organizer = await this.repository.findById(id);
    if (!organizer) {
      throw { status: 404, message: "Organizer not found" };
    }
    if (organizer.ownerId !== requestingUserId) {
      throw { status: 403, message: "Only the OWNER can update the logo" };
    }

    // Delete old logo from Cloudinary if it exists
    if (organizer.logoUrl) {
      await deleteCloudinaryImage(organizer.logoUrl);
    }

    return await this.repository.updateLogo(id, fileUrl);
  };

  /**
   * Add a team member to an organizer by email.
   * The requesting user must be OWNER or ADMIN of the organizer.
   */
  public addMember = async (
    organizerId: string,
    requestingUserId: string,
    data: { email: string; role?: OrgRole },
  ): Promise<any> => {
    // 1. Check organizer exists
    const organizer = await this.repository.findById(organizerId);
    if (!organizer) {
      throw { status: 404, message: "Organizer not found" };
    }

    // 2. Check requesting user is OWNER or ADMIN
    const requesterTeam = await this.repository.getTeamRole(
      organizerId,
      requestingUserId,
    );
    if (!requesterTeam || !["OWNER", "ADMIN"].includes(requesterTeam.role)) {
      throw {
        status: 403,
        message: "Only OWNER or ADMIN can invite team members",
      };
    }

    // 3. Find the user to invite by email
    const userToInvite = await this.repository.findUserByEmail(data.email);
    if (!userToInvite) {
      throw {
        status: 404,
        message: `No user found with email: ${data.email}`,
      };
    }

    // 4. Check user is not already a member
    const existingMember = await this.repository.findTeamMember(
      organizerId,
      userToInvite.id,
    );
    if (existingMember) {
      throw { status: 400, message: "User is already a team member" };
    }

    // 5. Add as member
    const newMember = await this.repository.addMember({
      organizerId,
      userId: userToInvite.id,
      role: data.role || "MARKETING",
    });

    // 6. Send Notification to invited user
    await this.notificationService.sendToOrganizerMember(
      organizerId,
      userToInvite.id,
      {
        title: "Welcome to the Team",
        message: `You have been added to the organizer team as ${data.role || "MARKETING"}.`,
        type: "TEAM_INVITE"
      }
    );

    // 7. Send Notification to Owner
    const [requesterUser, org] = await Promise.all([
      prisma.user.findUnique({ where: { id: requestingUserId }, select: { name: true } }),
      this.repository.findById(organizerId)
    ]);

    if (org && org.ownerId && org.ownerId !== requestingUserId) {
      const requesterName = requesterUser?.name || "An admin";
      const targetName = userToInvite.name || userToInvite.email || "A new member";
      
      await this.notificationService.sendToOrganizerMember(
        organizerId,
        org.ownerId,
        {
          title: "New Team Member",
          message: `${targetName} was added to the team as ${data.role || "MARKETING"} by ${requesterName}.`,
          type: "TEAM_INVITE"
        }
      );
    }

    return newMember;
  };

  /**
   * Remove a team member from an organizer.
   * Cannot remove the OWNER.
   */
  public removeMember = async (
    organizerId: string,
    requestingUserId: string,
    targetUserId: string,
  ): Promise<any> => {
    // Check if requesting user is OWNER or ADMIN
    // If requestingUserId === targetUserId, allow it (self-removal)
    const requesterTeam = await this.repository.getTeamRole(
      organizerId,
      requestingUserId,
    );

    if (requestingUserId !== targetUserId) {
      if (!requesterTeam || !["OWNER", "ADMIN"].includes(requesterTeam.role)) {
        throw {
          status: 403,
          message: "Only OWNER or ADMIN can remove other team members",
        };
      }
    }

    // Cannot remove the OWNER
    const targetTeam = await this.repository.getTeamRole(
      organizerId,
      targetUserId,
    );
    if (!targetTeam) {
      throw { status: 404, message: "Team member not found" };
    }
    if (targetTeam.role === "OWNER") {
      throw { status: 400, message: "Cannot remove the organizer owner" };
    }

    // Get user details for notification
    const [targetUser, requesterUser, organizer] = await Promise.all([
      prisma.user.findUnique({ where: { id: targetUserId }, select: { name: true, email: true } }),
      prisma.user.findUnique({ where: { id: requestingUserId }, select: { name: true } }),
      this.repository.findById(organizerId)
    ]);

    const result = await this.repository.deleteMember(organizerId, targetUserId);

    // Send Notification to Owner
    if (organizer && organizer.ownerId) {
      const targetName = targetUser?.name || targetUser?.email || "A member";
      const requesterName = requesterUser?.name || "An admin";
      
      await this.notificationService.sendToOrganizerMember(
        organizerId,
        organizer.ownerId,
        {
          title: "Team Member Removed",
          message: `${targetName} was removed from the team by ${requesterName}.`,
          type: "TEAM_REMOVE"
        }
      );
    }

    return result;
  };

  /**
   * Update a team member's role in an organizer.
   * Cannot edit the OWNER's role. Target user cannot become an OWNER.
   */
  public updateMemberRole = async (
    organizerId: string,
    requestingUserId: string,
    targetUserId: string,
    role: OrgRole,
  ): Promise<any> => {
    // Check requesting user is OWNER or ADMIN
    const requesterTeam = await this.repository.getTeamRole(
      organizerId,
      requestingUserId,
    );
    if (!requesterTeam || !["OWNER", "ADMIN"].includes(requesterTeam.role)) {
      throw {
        status: 403,
        message: "Only OWNER or ADMIN can edit team members' roles",
      };
    }

    // Cannot edit the OWNER
    const targetTeam = await this.repository.getTeamRole(
      organizerId,
      targetUserId,
    );
    if (!targetTeam) {
      throw { status: 404, message: "Team member not found" };
    }

    // Cannot edit own role
    if (requestingUserId === targetUserId) {
      throw { status: 403, message: "You cannot change your own role" };
    }
    if (targetTeam.role === "OWNER") {
      throw { status: 400, message: "Cannot edit the organizer owner's role" };
    }

    if (!["ADMIN", "MARKETING"].includes(role)) {
      throw { status: 400, message: "Invalid role provided. Must be ADMIN or MARKETING." };
    }

    const updatedRole = await this.repository.updateMemberRole(organizerId, targetUserId, role);

    // Send Notification to updated user
    await this.notificationService.sendToOrganizerMember(
      organizerId,
      targetUserId,
      {
        title: "Role Updated",
        message: `Your role in the organization has been updated to ${role}.`,
        type: "ROLE_UPDATE"
      }
    );

    // Send Notification to Owner
    const [targetUser, requesterUser, org] = await Promise.all([
      prisma.user.findUnique({ where: { id: targetUserId }, select: { name: true, email: true } }),
      prisma.user.findUnique({ where: { id: requestingUserId }, select: { name: true } }),
      this.repository.findById(organizerId)
    ]);

    if (org && org.ownerId && org.ownerId !== requestingUserId) {
      const requesterName = requesterUser?.name || "An admin";
      const targetName = targetUser?.name || targetUser?.email || "A member";
      
      await this.notificationService.sendToOrganizerMember(
        organizerId,
        org.ownerId,
        {
          title: "Team Role Updated",
          message: `${targetName}'s role was updated to ${role} by ${requesterName}.`,
          type: "ROLE_UPDATE"
        }
      );
    }

    return updatedRole;
  };
}
