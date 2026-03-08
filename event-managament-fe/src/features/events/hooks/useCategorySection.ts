"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCategories } from "./useCategories";

export const useCategorySection = () => {
  const router = useRouter();
  const { categories, isLoading } = useCategories(5);
  const { categories: allCategories } = useCategories();
  const [open, setOpen] = useState(false);

  const handleOpen = (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const handleCategoryClick = (categoryId: string) => {
    router.push(`/events?categoryId=${categoryId}`);
  };

  return {
    categories,
    allCategories,
    isLoading,
    open,
    handleOpen,
    handleClose,
    handleCategoryClick,
  };
};
