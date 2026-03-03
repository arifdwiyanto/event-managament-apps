import { Request, Response, NextFunction } from "express";
import { CartService } from "../services/cart.service.js";

export class CartController {
  private cartService: CartService;

  constructor() {
    this.cartService = new CartService();
  }

  public getCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const cart = await this.cartService.getCart(userId);
      res.status(200).json(cart);
    } catch (error) {
      next(error);
    }
  };

  public addToCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const { ticketTypeId, quantity } = req.body;
      const item = await this.cartService.addToCart(userId, ticketTypeId, quantity);
      res.status(201).json(item);
    } catch (error) {
      next(error);
    }
  };

  public updateQuantity = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const { itemId } = req.params;
      const { quantity } = req.body;
      const item = await this.cartService.updateQuantity(userId, itemId as string, quantity);
      res.status(200).json(item);
    } catch (error) {
      next(error);
    }
  };

  public removeItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      const { itemId } = req.params;
      await this.cartService.removeItem(userId, itemId as string);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  public clearCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id;
      await this.cartService.clearCart(userId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
