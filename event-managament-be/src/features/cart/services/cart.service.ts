import { CartRepository } from "../repositories/cart.repository.js";

export class CartService {
  private cartRepository: CartRepository;

  constructor() {
    this.cartRepository = new CartRepository();
  }

  public getCart = async (userId: string) => {
    return await this.cartRepository.getCartByUserId(userId);
  };

  public addToCart = async (userId: string, ticketTypeId: string, quantity: number) => {
    const cart = await this.cartRepository.getCartByUserId(userId);
    return await this.cartRepository.addItem(cart.id, ticketTypeId, quantity);
  };

  public updateQuantity = async (userId: string, itemId: string, quantity: number) => {
    // Verification that item belongs to user's cart could be added here
    return await this.cartRepository.updateItemQuantity(itemId, quantity);
  };

  public removeItem = async (userId: string, itemId: string) => {
    return await this.cartRepository.removeItem(itemId);
  };

  public clearCart = async (userId: string) => {
    const cart = await this.cartRepository.getCartByUserId(userId);
    return await this.cartRepository.clearCart(cart.id);
  };
}
