import { Request, Response, NextFunction } from "express";
import { PromotionsService } from "../services/promotions.service.js";

export class PromotionsController {
  private promotionsService: PromotionsService;

  constructor() {
    this.promotionsService = new PromotionsService();
  }

  public create = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const promotion = await this.promotionsService.create(req.body);
      res.status(201).send(promotion);
    } catch (error) {
      next(error);
    }
  };

  public findAll = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const { page: _p, limit: _l, ...filters } = req.query;

      const { data, meta } = await this.promotionsService.findAll(
        filters,
        page,
        limit,
      );

      res.status(200).send({ data, meta });
    } catch (error) {
      next(error);
    }
  };

  public findOne = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const promotion = await this.promotionsService.findOne(
        req.params.id as string,
      );

      res.status(200).send(promotion);
    } catch (error) {
      next(error);
    }
  };

  public update = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const promotion = await this.promotionsService.update(
        req.params.id as string,
        req.body,
      );

      res.status(200).send(promotion);
    } catch (error) {
      next(error);
    }
  };

  public delete = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      await this.promotionsService.delete(req.params.id as string);

      res.status(204).send("Promotion deleted");
    } catch (error) {
      next(error);
    }
  };

  public validateVoucher = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { code, userId, eventId } = req.body;

      if (!code) {
        throw new Error("Promotion code is required");
      }

      const result = await this.promotionsService.validate(
        code,
        userId as string | undefined,
        eventId as string | undefined,
      );

      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  };
}
