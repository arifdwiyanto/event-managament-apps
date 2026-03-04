import { Request, Response, NextFunction } from "express";
import { ReviewsService } from "../services/reviews.service.js";

export class ReviewsController {
  private reviewsService: ReviewsService;

  constructor() {
    this.reviewsService = new ReviewsService();
  }

  public create = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      if (!req.user?.id) {
        throw new Error("Unauthorized");
      }
      const review = await this.reviewsService.create(req.body, req.user.id);
      res.status(201).send(review);
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

      const { data, meta } = await this.reviewsService.findAll(
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
      const review = await this.reviewsService.findOne(req.params.id as string);
      res.status(200).send(review);
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
      const review = await this.reviewsService.update(
        req.params.id as string,
        req.body,
      );

      res.status(200).send(review);
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
      const review = await this.reviewsService.delete(req.params.id as string);
      res.status(204).send("Review deleted");
    } catch (error) {
      next(error);
    }
  };

  public getReviewsByEvent = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const eventId = req.params.id as string;

      const { data, meta } = await this.reviewsService.findByEvent(
        eventId,
        page,
        limit,
      );

      res.status(200).send({ data, meta });
    } catch (error) {
      next(error);
    }
  };
}
