import { Request, Response, NextFunction } from "express";
import { OrganizationsService } from "../services/organizations.service.js";
import { AuthService } from "../../auth/services/auth.service.js";
import { OrgRole } from "@prisma/client";
import {
  createOrganizerSchema,
  updateOrganizerSchema,
  addTeamMemberSchema,
  updateTeamMemberRoleSchema,
} from "../validations/organizations.validation.js";

export class OrganizationsController {
  private service: OrganizationsService;
  private authService: AuthService;

  constructor() {
    this.service = new OrganizationsService();
    this.authService = new AuthService();
  }

  /**
   * POST /api/organizations
   * Creates a new organizer profile for the authenticated user.
   * Body: { name: string, description?: string }
   */
  public create = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = req.user!.id;
      const validatedData = createOrganizerSchema.parse(req.body);

      const organizer = await this.service.create(userId, {
        name: validatedData.name,
        description: validatedData.description,
      });

      const updatedUser = await this.authService.getMe(userId);
      const tokens = await this.authService.generateTokens(updatedUser);

      res.status(201).json({
        message: "Organizer profile created successfully",
        data: organizer,
        tokens,
      });
    } catch (error: any) {
      if (error.status) {
        res.status(error.status).json({ message: error.message });
      } else {
        next(error);
      }
    }
  };

  /**
   * GET /api/organizations
   */
  public findAll = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const organizers = await this.service.findAll();
      res.status(200).json({ data: organizers });
    } catch (error: any) {
      next(error);
    }
  };

  public findOne = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const organizer = await this.service.findOne(req.params.id as string);
      res.status(200).json({ data: organizer });
    } catch (error: any) {
      if (error.status) {
        res.status(error.status).json({ message: error.message });
      } else {
        next(error);
      }
    }
  };

  /**
   * GET /api/organizations/public/:id
   * Public endpoint to get an organizer's profile with their events
   */
  public findPublicOne = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const organizer = await this.service.findPublicOne(req.params.id as string);
      res.status(200).json({ data: organizer });
    } catch (error: any) {
      if (error.status) {
        res.status(error.status).json({ message: error.message });
      } else {
        next(error);
      }
    }
  };

  /**
   * PATCH /api/organizations/:id
   */
  public update = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const validatedData = updateOrganizerSchema.parse(req.body);
      const organizer = await this.service.update(req.params.id as string, validatedData);
      res.status(200).json({
        message: "Organizer updated successfully",
        data: organizer,
      });
    } catch (error: any) {
      if (error.status) {
        res.status(error.status).json({ message: error.message });
      } else {
        next(error);
      }
    }
  };

  public updateLogo = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const organizerId = req.params.id as string;
      const requestingUserId = req.user!.id;
      const imageUrl = req.file?.path;

      const updatedOrganizer = await this.service.updateLogo(organizerId, requestingUserId, imageUrl);

      res.status(200).json({
        message: "Organizer logo updated successfully",
        data: { logoUrl: updatedOrganizer.logoUrl },
      });
    } catch (error: any) {
      if (error.status) {
        res.status(error.status).json({ message: error.message });
      } else {
        next(error);
      }
    }
  };

  /**
   * DELETE /api/organizations/:id
   */
  public delete = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const requestingUserId = req.user!.id;
      await this.service.delete(req.params.id as string, requestingUserId);
      res.status(200).json({ message: "Organizer deleted successfully" });
    } catch (error: any) {
      if (error.status) {
        res.status(error.status).json({ message: error.message });
      } else {
        next(error);
      }
    }
  };

  /**
   * POST /api/organizations/:id/members
   * Invite a user to the organizer team by email.
   * Body: { email: string, role?: "ADMIN" | "MARKETING" }
   */
  public addTeamMember = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const organizerId = req.params.id as string;
      const requestingUserId = req.user!.id;
      const validatedData = addTeamMemberSchema.parse(req.body);

      const member = await this.service.addMember(
        organizerId,
        requestingUserId,
        { email: validatedData.email, role: validatedData.role as OrgRole | undefined },
      );

      res.status(201).json({
        message: "Team member added successfully",
        data: member,
      });
    } catch (error: any) {
      if (error.status) {
        res.status(error.status).json({ message: error.message });
      } else {
        next(error);
      }
    }
  };

  /**
   * DELETE /api/organizations/:id/members/:userId
   */
  public removeTeamMember = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const organizerId = req.params.id as string;
      const requestingUserId = req.user!.id;
      const targetUserId = req.params.userId as string;

      await this.service.removeMember(
        organizerId,
        requestingUserId,
        targetUserId,
      );

      res
        .status(200)
        .json({ message: "Team member removed successfully" });
    } catch (error: any) {
      if (error.status) {
        res.status(error.status).json({ message: error.message });
      } else {
        next(error);
      }
    }
  };

  /**
   * PATCH /api/organizations/:id/members/:userId
   */
  public updateTeamMemberRole = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const organizerId = req.params.id as string;
      const requestingUserId = req.user!.id;
      const targetUserId = req.params.userId as string;
      const validatedData = updateTeamMemberRoleSchema.parse(req.body);

      await this.service.updateMemberRole(
        organizerId,
        requestingUserId,
        targetUserId,
        validatedData.role,
      );

      res
        .status(200)
        .json({ message: "Team member role updated successfully" });
    } catch (error: any) {
      if (error.status) {
        res.status(error.status).json({ message: error.message });
      } else {
        next(error);
      }
    }
  };
}
