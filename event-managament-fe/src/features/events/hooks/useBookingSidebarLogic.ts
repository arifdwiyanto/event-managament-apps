"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useBookingSidebar } from "./useBookingSidebar";
import { useCartStore } from "@/features/cart/store/useCartStore";
import { useStoreLogin } from "@/features/auth/store/useAuthStore";
import { Event } from "../types/event.types";

export const useBookingSidebarLogic = (event: Event) => {
  const router = useRouter();
  const { quantities, handleUpdateQuantity, selectedTickets, total } =
    useBookingSidebar(event);

  const { isAuthenticated } = useStoreLogin();
  const { addItem, isLoading: cartLoading } = useCartStore();

  // Snackbar State
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "info" | "warning",
  });

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      setSnackbar({
        open: true,
        message: "Please log in to add items to cart",
        severity: "error",
      });
      router.push("/login");
      return;
    }

    try {
      // Add all selected tickets to cart
      await Promise.all(
        selectedTickets.map((ticket) => addItem(ticket.id, ticket.qty)),
      );
      setSnackbar({
        open: true,
        message: "Successfully added to cart!",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to add to cart. Please try again.",
        severity: "error",
      });
    }
  };

  return {
    quantities,
    handleUpdateQuantity,
    selectedTickets,
    total,
    cartLoading,
    snackbar,
    handleCloseSnackbar,
    handleAddToCart,
  };
};
