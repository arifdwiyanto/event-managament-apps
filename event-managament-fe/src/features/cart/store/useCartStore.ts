import { create } from "zustand";
import { persist } from "zustand/middleware";
import { cartService } from "../services/cartService";
import { Cart, CartItem } from "../types";

interface CartState {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;
  fetchCart: () => Promise<void>;
  addItem: (ticketTypeId: string, quantity: number) => Promise<void>;
  updateItemQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: null,
      isLoading: false,
      error: null,

      fetchCart: async () => {
        set({ isLoading: true, error: null });
        try {
          const cart = await cartService.getCart();
          set({ cart, isLoading: false });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },

      addItem: async (ticketTypeId: string, quantity: number) => {
        set({ isLoading: true, error: null });
        try {
          await cartService.addToCart(ticketTypeId, quantity);
          const cart = await cartService.getCart();
          set({ cart, isLoading: false });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },

      updateItemQuantity: async (itemId: string, quantity: number) => {
        set({ isLoading: true, error: null });
        try {
          await cartService.updateQuantity(itemId, quantity);
          const cart = await cartService.getCart();
          set({ cart, isLoading: false });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },

      removeItem: async (itemId: string) => {
        set({ isLoading: true, error: null });
        try {
          await cartService.removeItem(itemId);
          const cart = await cartService.getCart();
          set({ cart, isLoading: false });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },

      clearCart: async () => {
        set({ isLoading: true, error: null });
        try {
          await cartService.clearCart();
          set({ cart: null, isLoading: false });
        } catch (error: any) {
          set({ error: error.message, isLoading: false });
        }
      },
    }),
    {
      name: "hype-cart-storage",
    }
  )
);
