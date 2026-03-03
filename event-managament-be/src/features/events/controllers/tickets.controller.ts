import { Request, Response, NextFunction } from "express";
import { TicketsService } from "../services/tickets.service.js";

export class TicketsController {
  private ticketsService: TicketsService;

  constructor() {
    this.ticketsService = new TicketsService();
  }

  public create = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const ticketData = { ...req.body, eventId: req.params.eventId };
      const ticket = await this.ticketsService.create(ticketData);
      res.status(201).send(ticket);
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

      const { data, meta } = await this.ticketsService.findAll(
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
      const ticket = await this.ticketsService.findOne(req.params.id as string);
      res.status(200).send(ticket);
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
      const ticket = await this.ticketsService.update(
        req.params.id as string,
        req.body,
      );

      res.status(200).send(ticket);
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
      const ticket = await this.ticketsService.delete(req.params.id as string);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
