"use client";

import { useState } from "react";
import { useThemeStore } from "@/features/theme/stores/themeStore";
import { useEventFilters } from "./useEventFilters";

export const useEventExplorer = () => {
  const filters = useEventFilters();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { resolvedTheme, toggleTheme } = useThemeStore();

  // Single Toast State
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const handleShowToast = (message: string, severity: "success" | "error") => {
    setToast({ open: true, message, severity });
  };

  const handleCloseToast = () => {
    setToast((prev) => ({ ...prev, open: false }));
  };

  const toggleFilter = (open: boolean) => setIsFilterOpen(open);
  const toggleMenu = (open: boolean) => setIsMenuOpen(open);

  return {
    filters,
    isFilterOpen,
    isMenuOpen,
    resolvedTheme,
    toggleTheme,
    toast,
    handleShowToast,
    handleCloseToast,
    toggleFilter,
    toggleMenu,
    setIsFilterOpen,
    setIsMenuOpen,
  };
};
