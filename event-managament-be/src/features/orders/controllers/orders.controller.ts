import { Request, Response, NextFunction } from "express";
import { OrdersService } from "../services/orders.service.js";

export class OrdersController {
  private ordersService: OrdersService;

  constructor() {
    this.ordersService = new OrdersService();
  }

  public create = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const order = await this.ordersService.create(req.body);
      res.status(201).send(order);
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

      const { page: _p, limit: _l, organizerId, ...queryFilters } = req.query;

      let filters: any = { ...queryFilters };

      if (req.user?.roles?.includes("ORGANIZER") && organizerId) {
        filters.organizerId = organizerId;
      } else {
        filters.userId = req.user?.id;
      }
      
      const { data, meta } = await this.ordersService.findAll(
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
      const order = await this.ordersService.findOne(req.params.id as string);

      res.status(200).send(order);
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
      const order = await this.ordersService.update(
        req.params.id as string,
        req.body,
      );

      res.status(200).send(order);
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
      const order = await this.ordersService.delete(req.params.id as string);

      res.status(204).send("Order deleted");
    } catch (error) {
      next(error);
    }
  };

  public processPayment = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const orderId = req.params.id as string;
      const paymentData = req.body;

      const result = await this.ordersService.pay(orderId, paymentData);

      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  };
}
