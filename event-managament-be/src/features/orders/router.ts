import { Router } from "express";
import { OrdersController } from "./controllers/orders.controller.js";
import { verifyToken } from "../../middlewares/verifyToken.js";
import { requireRole } from "../../middlewares/requireRole.js";
import { requireOrgRole } from "../../middlewares/requireOrgRole.js";
import { uploadcloudinaryImage } from "../uploadCloudinary/utils/uploadImage.js";

export class OrdersRouter {
  private router: Router;
  private ordersController: OrdersController;

  constructor() {
    this.router = Router();
    this.ordersController = new OrdersController();
    this.setupRoutes();
  }

  private setupRoutes = (): void => {
    // All orders routes require authentication
    this.router.use(verifyToken);

    // Customer can create/view their own orders
    this.router.post(
      "/",
      requireRole("CUSTOMER"),
      this.ordersController.create,
    );

    // Manage Transactions (Requires OWNER, ADMIN)
    // For general list, we might need a separate endpoint or handle inside controller
    // But for single order updates/delete, we can use requireOrgRole if we can map it to an organizer context

    this.router.get("/", this.ordersController.findAll);
    this.router.get("/:id", this.ordersController.findOne);

    // Update/Delete usually for managing
    this.router.patch(
      "/:id",
      requireRole("ORGANIZER"),
      requireOrgRole(["ADMIN"], "order"),
      this.ordersController.update,
    );

    this.router.delete(
      "/:id",
      requireRole("ORGANIZER"),
      requireOrgRole(["ADMIN"], "order"),
      this.ordersController.delete,
    );

    this.router.post(
      "/:id/payment",
      requireRole("ORGANIZER"),
      requireOrgRole(["ADMIN", "OWNER"], "order"),
      this.ordersController.processPayment,
    );

    this.router.patch(
      "/:id/payment-proof",
      requireRole("CUSTOMER"),
      uploadcloudinaryImage("payment_proofs").single("paymentProof"),
      this.ordersController.uploadPaymentProof,
    );
  };

  public getRouter = (): Router => {
    return this.router;
  };
}
