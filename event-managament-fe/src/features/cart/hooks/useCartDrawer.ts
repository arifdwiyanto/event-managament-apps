"use client";

import { useEffect, useMemo } from "react";
import { useCartStore } from "../store/useCartStore";

export const useCartDrawer = (open: boolean) => {
  const { cart, fetchCart, updateItemQuantity, removeItem, isLoading } = useCartStore();

  useEffect(() => {
    if (open) {
      fetchCart();
    }
  }, [open, fetchCart]);

  const total = useMemo(() => {
    return cart?.items.reduce((acc, item) => {
      return acc + (Number(item.ticketType.price) * item.quantity);
    }, 0) || 0;
  }, [cart?.items]);

  const sortedItems = useMemo(() => {
    return cart?.items ? [...cart.items].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ) : [];
  }, [cart?.items]);

  return {
    cart,
    isLoading,
    updateItemQuantity,
    removeItem,
    total,
    sortedItems
  };
};
