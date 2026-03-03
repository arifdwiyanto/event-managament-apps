import { prisma } from "../../../config/prisma.js";

export class CartRepository {
  public getCartByUserId = async (userId: string) => {
    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          orderBy: { createdAt: 'desc' },
          include: {
            ticketType: {
              include: {
                event: true
              }
            }
          }
        }
      }
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
        include: {
          items: {
            include: {
              ticketType: {
                include: {
                  event: true
                }
              }
            }
          }
        }
      });
    }

    return cart;
  };

  public addItem = async (cartId: string, ticketTypeId: string, quantity: number) => {
    // Check if item already exists in cart
    const existingItem = await prisma.cartItem.findFirst({
      where: { cartId, ticketTypeId }
    });

    if (existingItem) {
      return await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity }
      });
    }

    return await prisma.cartItem.create({
      data: {
        cartId,
        ticketTypeId,
        quantity
      }
    });
  };

  public updateItemQuantity = async (itemId: string, quantity: number) => {
    return await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity }
    });
  };

  public removeItem = async (itemId: string) => {
    return await prisma.cartItem.delete({
      where: { id: itemId }
    });
  };

  public clearCart = async (cartId: string) => {
    return await prisma.cartItem.deleteMany({
      where: { cartId }
    });
  };
}
