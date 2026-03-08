"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStoreLogin } from "@/features/auth/store/useAuthStore";
import { useCartStore } from "@/features/cart/store/useCartStore";

interface UseEventCardActionsProps {
  onToast?: (message: string, severity: "success" | "error") => void;
}

export const useEventCardActions = ({ onToast }: UseEventCardActionsProps = {}) => {
  const { isAuthenticated } = useStoreLogin();
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
  };
};
