import { CartRepository } from "../repositories/cart.repository.js";
import { prisma } from "../../../config/prisma.js";

export class CartService {
  private cartRepository: CartRepository;

  constructor() {
    this.cartRepository = new CartRepository();
  }

  public getCart = async (userId: string) => {
    return await this.cartRepository.getCartByUserId(userId);
  };

  public addToCart = async (userId: string, ticketTypeId: string, quantity: number) => {
    // Check ticket quota
    const ticket = await prisma.ticketType.findUnique({
      where: { id: ticketTypeId },
    });

    if (!ticket) {
      throw new Error("Ticket type not found");
    }

    // Check existing quantity in cart
    const cart = await this.cartRepository.getCartByUserId(userId);
    const existingItem = cart.items?.find(
      (item: any) => item.ticketTypeId === ticketTypeId
    );
    const existingQty = existingItem ? existingItem.quantity : 0;
    const totalRequested = existingQty + quantity;

    if (totalRequested > ticket.quota) {
      throw new Error(
        `Only ${ticket.quota - existingQty} ticket(s) remaining for this ticket type`
      );
    }

    return await this.cartRepository.addItem(cart.id, ticketTypeId, quantity);
  };

  public updateQuantity = async (userId: string, itemId: string, quantity: number) => {
    // Find the cart item to get ticketTypeId
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: itemId },
    });

    if (!cartItem) {
      throw new Error("Cart item not found");
    }

    // Check ticket quota
    const ticket = await prisma.ticketType.findUnique({
      where: { id: cartItem.ticketTypeId },
    });

    if (!ticket) {
      throw new Error("Ticket type not found");
    }

    if (quantity > ticket.quota) {
      throw new Error(
        `Only ${ticket.quota} ticket(s) remaining for this ticket type`
      );
    }

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
