"use client";

import { useMediaQuery, useTheme } from "@mui/material";
import { useBookingSidebar } from "./useBookingSidebar";
import { useCartStore } from "@/features/cart/store/useCartStore";
import { Event } from "../types/event.types";

interface UseTicketSelectionModalProps {
  event: Event;
  onClose: () => void;
  onToast: (message: string, severity: "success" | "error") => void;
}

export const useTicketSelectionModal = ({
  event,
  onClose,
  onToast,
}: UseTicketSelectionModalProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { quantities, handleUpdateQuantity, selectedTickets, total } =
    useBookingSidebar(event);

  const { addItem, isLoading: cartLoading } = useCartStore();

  const handleAddToCart = async () => {
    try {
      await Promise.all(
        selectedTickets.map((ticket) => addItem(ticket.id, ticket.qty)),
      );
      onToast("Successfully added to cart!", "success");
      onClose();
    } catch (error) {
      onToast("Failed to add to cart. Please try again.", "error");
    }
  };

  return {
    theme,
    isMobile,
    quantities,
    handleUpdateQuantity,
    selectedTickets,
    total,
    cartLoading,
    handleAddToCart,
  };
};
