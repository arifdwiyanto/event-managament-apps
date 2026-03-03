"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useMobileMenu } from "./useMobileMenu";
import { useStoreLogin } from "@/features/auth/store/useAuthStore";
import { useCartStore } from "@/features/cart/store/useCartStore";

export const useMainNavbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { isOpen, toggle, close } = useMobileMenu();
  const { isAuthenticated, signOut, user } = useStoreLogin();
  const isOrganizer = user?.roles?.includes("ORGANIZER") ?? false;

  // Detect Tailwind dark mode
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    const html = document.documentElement;
    const check = () => setIsDark(html.classList.contains("dark"));
    check();
    const observer = new MutationObserver(check);
    observer.observe(html, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  // State untuk Menu Dropdown
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Handle Logout
  const handleLogout = async () => {
    handleClose();
    await signOut();
    router.push("/login");
  };

  // Cart State
  const [cartOpen, setCartOpen] = useState(false);
  const { cart, fetchCart } = useCartStore();

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated, fetchCart]);

  const cartItemsCount = cart?.items.reduce((acc, item) => acc + item.quantity, 0) || 0;

  return {
    pathname,
    isOpen,
    toggle,
    close,
    isAuthenticated,
    user,
    isOrganizer,
    isDark,
    anchorEl,
    open,
    handleClick,
    handleClose,
    handleLogout,
    cartOpen,
    setCartOpen,
    cartItemsCount,
  };
};
