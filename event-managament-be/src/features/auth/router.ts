import { Router } from "express";
import { AuthController } from "./controllers/auth.controller.js";
import { verifyToken } from "../../middlewares/verifyToken.js";

export class AuthRouter {
  private router: Router;
  private authController: AuthController;

  constructor() {
    this.router = Router();
    this.authController = new AuthController();
    this.setupRoutes();
  }

  private setupRoutes = (): void => {
    this.router.post("/register", this.authController.register);
    this.router.post("/login", this.authController.login);
    this.router.post("/logout", this.authController.logout);
    this.router.get("/me", verifyToken, this.authController.me);
    this.router.post("/refresh-token", this.authController.refreshToken);
    this.router.post("/google-login", this.authController.googleLogin);
  };

  public getRouter = (): Router => {
    return this.router;
  };
}
