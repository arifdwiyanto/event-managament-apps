import { Router } from "express";
import { CartController } from "./controllers/cart.controller.js";
import { verifyToken } from "../../middlewares/verifyToken.js";

export class CartRouter {
  private router: Router;
  private cartController: CartController;

  constructor() {
    this.router = Router();
    this.cartController = new CartController();
    this.setupRoutes();
  }

  private setupRoutes = (): void => {
    this.router.use(verifyToken);
    this.router.get("/", this.cartController.getCart);
    this.router.post("/", this.cartController.addToCart);
    this.router.patch("/:itemId", this.cartController.updateQuantity);
    this.router.delete("/:itemId", this.cartController.removeItem);
    this.router.delete("/", this.cartController.clearCart);
  };

  public getRouter = (): Router => {
    return this.router;
  };
}
