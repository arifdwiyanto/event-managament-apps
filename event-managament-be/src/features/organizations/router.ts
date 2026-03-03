import { Router } from "express";
import { OrganizationsController } from "./controllers/organizations.controller.js";
import { verifyToken } from "../../middlewares/verifyToken.js";
import { uploadcloudinaryImage } from "../uploadCloudinary/utils/uploadImage.js";
import { requireOrgRole } from "../../middlewares/requireOrgRole.js";
import { requireRole } from "../../middlewares/requireRole.js";

export class OrganizationsRouter {
  private router: Router;
  private organizationsController: OrganizationsController;

  constructor() {
    this.router = Router();
    this.organizationsController = new OrganizationsController();
    this.setupRoutes();
  }

  private setupRoutes = (): void => {
    // Create organizer (requires auth)
    this.router.post("/", verifyToken, this.organizationsController.create);

    // List all organizers
    this.router.get("/", this.organizationsController.findAll);

    // Get public organizer profile (no auth required)
    this.router.get("/public/:id", this.organizationsController.findPublicOne);

    // Get single organizer (admin/owner view)
    this.router.get("/:id", this.organizationsController.findOne);

    // Update organizer (requires auth)
    this.router.patch("/:id", verifyToken, this.organizationsController.update);

    // Update organizer logo
    this.router.patch(
      "/:id/logo",
      verifyToken,
      uploadcloudinaryImage("organizer-profile").single("image"),
      this.organizationsController.updateLogo
    );

    // Delete organizer (requires auth)
    this.router.delete(
      "/:id",
      verifyToken,
      this.organizationsController.delete,
    );

    // Add team member — invite by email (Requires OWNER, ADMIN)
    this.router.post(
      "/:id/members",
      verifyToken,
      requireRole("ORGANIZER"),
      requireOrgRole(["ADMIN"], "organizer"),
      this.organizationsController.addTeamMember,
    );

    // Remove team member (Requires OWNER, ADMIN)
    this.router.delete(
      "/:id/members/:userId",
      verifyToken,
      requireRole("ORGANIZER"),
      requireOrgRole(["ADMIN"], "organizer"),
      this.organizationsController.removeTeamMember,
    );

    // Update team member role (Requires OWNER, ADMIN)
    this.router.patch(
      "/:id/members/:userId",
      verifyToken,
      requireRole("ORGANIZER"),
      requireOrgRole(["ADMIN"], "organizer"),
      this.organizationsController.updateTeamMemberRole,
    );
  };

  public getRouter = (): Router => {
    return this.router;
  };
}
