import { Request, Response, NextFunction } from "express";
import { UserPointService } from "../services/userPoint.service.js";

export class UserPointController {
  private userPointService: UserPointService;

  constructor() {
    this.userPointService = new UserPointService();
  }

  public getUserBalance = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(400).json({ message: "UserId is required" });
        return;
      }

      const balance = await this.userPointService.getUserBalance(userId);

      res.status(200).json({ balance });
    } catch (error) {
      next(error);
    }
  };

  public addPoint = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(400).json({ message: "UserId is required" });
        return;
      }

      const { amount, expiredDate } = req.body;

      if (!amount || !expiredDate) {
        res.status(400).json({ message: "Amount and expiredDate are required" });
        return;
      }

      const point = await this.userPointService.addPoint(
        userId,
        Number(amount),
        new Date(expiredDate)
      );

      res.status(201).json({ message: "Points added successfully", point });
    } catch (error) {
      next(error);
    }
  };

  public usePoints = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(400).json({ message: "UserId is required" });
        return;
      }

      const { amount } = req.body;

      if (!amount) {
        res.status(400).json({ message: "Amount is required" });
        return;
      }

      await this.userPointService.usePoints(userId, Number(amount));

      res.status(200).json({ message: "Points used successfully" });
    } catch (error) {
      next(error);
    }
  };
}
