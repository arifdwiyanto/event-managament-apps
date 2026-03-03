import { Router } from "express";
import { EventsController } from "./controllers/events.controller.js";
import { CategoriesController } from "./controllers/categories.controllers.js";
import { verifyToken } from "../../middlewares/verifyToken.js";
import { requireOrgRole } from "../../middlewares/requireOrgRole.js";
import { requireRole } from "../../middlewares/requireRole.js";
import { TicketsController } from "./controllers/tickets.controller.js";
import { uploadcloudinaryImage } from "../uploadCloudinary/utils/uploadImage.js";

export class EventsRouter {
  private router: Router;
  private eventsController: EventsController;
  private categoriesController: CategoriesController;
  private ticketsController: TicketsController;

  constructor() {
    this.router = Router();
    this.eventsController = new EventsController();
    this.categoriesController = new CategoriesController();
    this.ticketsController = new TicketsController();
    this.setupRoutes();
  }

  private setupRoutes = (): void => {
    this.router.get("/categories", this.categoriesController.findAll);

    // Tickets
    this.router.get("/:eventId/tickets", this.ticketsController.findAll);
    this.router.get("/:eventId/tickets/:id", this.ticketsController.findOne);
    this.router.post(
      "/:eventId/tickets",
      verifyToken,
      // requireRole("ORGANIZER"),
      // requireOrgRole(["ADMIN"], "organizer"),
      this.ticketsController.create,
    );
    this.router.patch(
      "/:eventId/tickets/:id",
      verifyToken,
      this.ticketsController.update,
    );
    this.router.delete(
      "/:eventId/tickets/:id",
      verifyToken,
      this.ticketsController.delete,
    );

    // Create event/ticket (Requires OWNER, ADMIN)
    this.router.post(
      "/",
      verifyToken,
      requireRole("ORGANIZER"),
      uploadcloudinaryImage("events").single("image"),
      requireOrgRole(["ADMIN"], "organizer"), // Check body.organizerId
      this.eventsController.create,
    );

    this.router.get("/", this.eventsController.findAll);
    this.router.get("/:id", this.eventsController.findOne);

    // Update event/ticket (Requires OWNER, ADMIN)
    this.router.patch(
      "/:id",
      verifyToken,
      requireRole("ORGANIZER"),
      requireOrgRole(["ADMIN"], "event"),
      this.eventsController.update,
    );

    // Delete event/ticket (Requires OWNER, ADMIN)
    this.router.delete(
      "/:id",
      verifyToken,
      requireRole("ORGANIZER"),
      requireOrgRole(["ADMIN"], "event"),
      this.eventsController.delete,
    );
  };

  public getRouter = (): Router => {
    return this.router;
  };
}
