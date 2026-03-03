import { Request, Response, NextFunction } from "express";
import { EventsService } from "../services/events.service.js";

export class EventsController {
  private eventsService: EventsService;

  constructor() {
    this.eventsService = new EventsService();
  }

  public create = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const payload = typeof req.body.data === "string"? JSON.parse(req.body.data) : req.body;

      if (req.file) {
        payload.imageUrl = req.file.path;
      }

      const event = await this.eventsService.create(payload);
      res.status(201).send(event);
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
      const limit = parseInt(req.query.limit as string) || 3;

      const { page: _p, limit: _l, ...filters } = req.query;

      const { data, meta } = await this.eventsService.findAll(
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
      const event = await this.eventsService.findOne(req.params.id as string);
      res.status(200).send(event);
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
      const event = await this.eventsService.update(
        req.params.id as string,
        req.body,
      );

      res.status(200).send(event);
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
      const event = await this.eventsService.delete(req.params.id as string);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
