import apiFetch from "../../../services/apiFetch";
import { Cart, CartItem } from "../types";

export const cartService = {
  getCart: async (): Promise<Cart> => {
    const response = await apiFetch.get("/cart");
    return response.data;
  },

  addToCart: async (ticketTypeId: string, quantity: number): Promise<CartItem> => {
    const response = await apiFetch.post("/cart", { ticketTypeId, quantity });
    return response.data;
  },

  updateQuantity: async (itemId: string, quantity: number): Promise<CartItem> => {
    const response = await apiFetch.patch(`/cart/${itemId}`, { quantity });
    return response.data;
  },

  removeItem: async (itemId: string): Promise<void> => {
    await apiFetch.delete(`/cart/${itemId}`);
  },

  clearCart: async (): Promise<void> => {
    await apiFetch.delete("/cart");
  },
};
