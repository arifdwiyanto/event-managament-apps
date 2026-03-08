"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStoreLogin } from "@/features/auth/store/useAuthStore";
import { useCartStore } from "@/features/cart/store/useCartStore";
import { Event } from "../types/event.types";

interface UseEventCardActionsProps {
  event: Event;
  onToast?: (message: string, severity: "success" | "error") => void;
}

export const useEventCardActions = ({ event, onToast }: UseEventCardActionsProps) => {
  const { isAuthenticated, user } = useStoreLogin();
  const { isLoading: cartLoading } = useCartStore();
  const router = useRouter();

  const [localLoading, setLocalLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      if (onToast) onToast("Please log in to add items to cart", "error");
      setTimeout(() => router.push("/login"), 1500);
      return;
    }

    if (user?.organizer?.id === event.organizerId) {
      if (onToast) onToast("You cannot purchase tickets for your own event", "error");
      return;
    }

    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  return {
    isAuthenticated,
    cartLoading,
    localLoading,
    isModalOpen,
    handleAddToCart,
    handleCloseModal,
    setLocalLoading,
    isOwnEvent: user?.organizer?.id === event.organizerId,
  };
};

