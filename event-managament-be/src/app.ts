import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import morgan from "morgan";
import { AuthRouter } from "./features/auth/router.js";
import { UsersRouter } from "./features/users/router.js";
import { OrganizationsRouter } from "./features/organizations/router.js";
import { EventsRouter } from "./features/events/router.js";
import { OrdersRouter } from "./features/orders/router.js";
import { PromotionsRouter } from "./features/promotions/router.js";
import { ReviewsRouter } from "./features/reviews/router.js";
import { DashboardRouter } from "./features/dashboard/router.js";
import { ReferralRouter } from "./features/referral/router.js";
import { NotificationRouter } from "./features/notifications/router.js";
import { CartRouter } from "./features/cart/router.js";
import { ReportRouter } from "./features/report/report.router.js";
import { UserPointRouter } from "./features/userPoint/route.js";

class App {
  private app: Application;
  private port: number | string;

  constructor() {
    this.app = express();
    this.port = process.env.PORT || 8000;
    this.configureMiddlewares();
    this.configureRoutes();
    this.configureErrorHandling();
  }

  private configureMiddlewares = (): void => {
    this.app.use(cors({
    origin: [
      "http://localhost:3000", 
      "https://hype-event-alpha.vercel.app"
    ],
      credentials:true
    }));
    this.app.use(express.json());
    this.app.use(morgan("dev"));

    // Basic root route
    this.app.get("/", (req: Request, res: Response) => {
      res.status(200).json({ status: "ok", message: "Event Management API" });
    });

    // Basic health check
    this.app.get("/api/health", (req: Request, res: Response) => {
      res
        .status(200)
        .json({ status: "ok", message: "Event Management API is running" });
    });
  };

  private configureRoutes = (): void => {
    this.app.use("/api/auth", new AuthRouter().getRouter());
    this.app.use("/api/users", new UsersRouter().getRouter());
    this.app.use("/api/organizations", new OrganizationsRouter().getRouter());
    this.app.use("/api/events", new EventsRouter().getRouter());
    this.app.use("/api/orders", new OrdersRouter().getRouter());
    this.app.use("/api/promotions", new PromotionsRouter().getRouter());
    this.app.use("/api/reviews", new ReviewsRouter().getRouter());
    this.app.use("/api/dashboard", new DashboardRouter().getRouter());
    this.app.use("/api/referrals", new ReferralRouter().getRouter());
    this.app.use("/api/notifications", new NotificationRouter().getRouter());
    this.app.use("/api/cart", new CartRouter().getRouter());
    this.app.use("/api/reports", new ReportRouter().getRouter());
    this.app.use("/api/user-points", new UserPointRouter().getRouter());
  };

  private configureErrorHandling = (): void => {
    // Global error handler
    this.app.use(
      (err: any, req: Request, res: Response, next: NextFunction) => {
        console.error(err.stack);
        res.status(err.status || 500).json({
          error: {
            message: err.message || "Internal Server Error",
          },
        });
      },
    );
  };

  public getApp = (): Application => {
    return this.app;
  };

  public listen = (): void => {
    this.app.listen(this.port, () => {
      console.log(
        `[server]: Server is running at http://localhost:${this.port}`,
      );
    });
  };
}

export default App;
