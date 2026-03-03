"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback } from "react";

interface UseFilterBarReturn {
  activeCategory: string;
  activeLocation: string;
  activeSearch: string;
  setCategory: (categoryId: string) => void;
  setLocation: (location: string) => void;
  setSearch: (search: string) => void;
  clearFilters: () => void;
}

export const useFilterBar = (): UseFilterBarReturn => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeCategory = searchParams.get("categoryId") || "all";
  const activeLocation = searchParams.get("location") || "";
  const activeSearch = searchParams.get("search") || "";

  const createUrl = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams);

      params.set("page", "1");
      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }
      return `${pathname}?${params.toString()}`;
    },
    [pathname, searchParams],
  );

  const setCategory = useCallback(
    (categoryId: string) => {
      const url = createUrl({
        categoryId: categoryId === "all" ? null : categoryId,
      });
      router.push(url, { scroll: false });
    },
    [router, createUrl],
  );

  const setLocation = useCallback(
    (location: string) => {
      const url = createUrl({ location: location || null });
      router.push(url, { scroll: false });
    },
    [router, createUrl],
  );

  const setSearch = useCallback(
    (search: string) => {
      const url = createUrl({ search: search || null });
      router.push(url, { scroll: false });
    },
    [router, createUrl],
  );

  const clearFilters = useCallback(() => {
    const params = new URLSearchParams();
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, [router, pathname]);

  return {
    activeCategory,
    activeLocation,
    activeSearch,
    setCategory,
    setLocation,
    setSearch,
    clearFilters,
  };
};

export default useFilterBar;
