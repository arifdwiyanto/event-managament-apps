import { Request, Response, NextFunction } from "express";
import { UsersRepository } from "../repositories/users.repository.js";
import { UsersService } from "../services/users.service.js";

export class UsersController {
  private UsersService = new UsersService();

  constructor() {
    this.UsersService = new UsersService();
  }
  public create = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    throw new Error("Method not implemented.");
  };

  public findAll = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    throw new Error("Method not implemented.");
  };

  public findOne = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const resul = await this.UsersService.findOne(id as string);

      res.status(200).json({
        message: "successfully get user",
        user: resul,
      });
    } catch (error) {
      next(error);
    }
  };

  public update = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    throw new Error("Method not implemented.");
  };

  public updateAvatar = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const requestingUserId = req.user!.id;
      const targetUserId = req.params.id as string;

      if (requestingUserId !== targetUserId) {
        res.status(403).json({ message: "You can only update your own avatar" });
        return;
      }

      const imageUrl = req.file?.path;
      const updatedUser = await this.UsersService.updateAvatar(targetUserId, imageUrl);

      res.status(200).json({
        message: "Avatar updated successfully",
        data: { avatarUrl: updatedUser.avatarUrl },
      });
    } catch (error: any) {
      if (error.status) {
        res.status(error.status).json({ message: error.message });
      } else {
        next(error);
      }
    }
  };

  public delete = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    throw new Error("Method not implemented.");
  };

  public getPointHistory = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    throw new Error("Method not implemented.");
  };

  public getVouchers = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    throw new Error("Method not implemented.");
  };
}
