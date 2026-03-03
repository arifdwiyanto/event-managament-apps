import { Router } from "express";
import { PromotionsController } from "./controllers/promotions.controller.js";
import { verifyToken } from "../../middlewares/verifyToken.js";
import { requireOrgRole } from "../../middlewares/requireOrgRole.js";
import { requireRole } from "../../middlewares/requireRole.js";

export class PromotionsRouter {
  private router: Router;
  private promotionsController: PromotionsController;

  constructor() {
    this.router = Router();
    this.promotionsController = new PromotionsController();
    this.setupRoutes();
  }

  private setupRoutes = (): void => {
    // Create promotion (Requires OWNER, MARKETING)
    this.router.post(
      "/", 
      verifyToken, 
      requireRole("ORGANIZER"), 
      requireOrgRole(["MARKETING"], "organizer"), // Check body.organizerId
      this.promotionsController.create
    );

    this.router.get("/", this.promotionsController.findAll);
    this.router.get("/:id", this.promotionsController.findOne);

    // Update promotion (Requires OWNER, MARKETING)
    this.router.patch(
      "/:id", 
      verifyToken, 
      requireRole("ORGANIZER"), 
      requireOrgRole(["MARKETING"], "promotion"), 
      this.promotionsController.update
    );

    // Delete promotion (Requires OWNER, MARKETING)
    this.router.delete(
      "/:id", 
      verifyToken, 
      requireRole("ORGANIZER"), 
      requireOrgRole(["MARKETING"], "promotion"), 
      this.promotionsController.delete
    );

    this.router.post("/validate", this.promotionsController.validateVoucher);
  };

  public getRouter = (): Router => {
    return this.router;
  };
}
