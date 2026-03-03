"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCategories } from "./useCategories";
import { Category } from "../types/event.types";

export interface EventFiltersReturn {
  searchValue: string;
  setSearchValue: (value: string) => void;
  currentCategoryId: string;
  currentDate: string;
  categories: Category[];
  isLoading: boolean;
  updateFilters: (key: string, value: string | undefined) => void;
  handleReset: () => void;
}

export const useEventFilters = (): EventFiltersReturn => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { categories, isLoading } = useCategories();

  // 1. Initial value from URL (only once on mount or when search param changes externally)
  const initialSearch = searchParams.get("search") || "";
  const [searchValue, setSearchValue] = useState(initialSearch);
  const isTyping = useRef(false);
  
  const currentCategoryId = searchParams.get("categoryId") || "";
  const currentDate = searchParams.get("date") || "";

  // 2. Sync local state with URL ONLY if it changed externally (e.g. Back button or Reset)
  // We use typing protection to avoid reset-flickers during typing
  useEffect(() => {
    const urlValue = searchParams.get("search") || "";
    if (!isTyping.current && urlValue !== searchValue) {
      setSearchValue(urlValue);
    }
  }, [searchParams.get("search")]); 

  // 3. Debounce the local state back to the URL
  useEffect(() => {
    // If the local value matches the current URL, do nothing
    const currentUrlVal = searchParams.get("search") || "";
    if (searchValue === currentUrlVal) {
      isTyping.current = false;
      return;
    }

    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (searchValue) {
        params.set("search", searchValue);
      } else {
        params.delete("search");
      }
      params.delete("page");
      
      isTyping.current = false;
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }, 500); 

    return () => clearTimeout(timer);
  }, [searchValue, pathname, router]); 

  const handleSearchChange = useCallback((value: string) => {
    isTyping.current = true;
    setSearchValue(value);
  }, []);

  const updateFilters = useCallback((key: string, value: string | undefined) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [searchParams, pathname, router]);

  const handleReset = useCallback(() => {
    isTyping.current = false;
    setSearchValue("");
    router.push(pathname, { scroll: false });
  }, [pathname, router]);

  return {
    searchValue,
    setSearchValue: handleSearchChange, // Use handled version
    currentCategoryId,
    currentDate,
    categories,
    isLoading,
    updateFilters,
    handleReset,
  };
};
