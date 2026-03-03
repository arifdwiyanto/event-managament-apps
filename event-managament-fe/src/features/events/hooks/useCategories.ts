"use client";

import { useState, useEffect } from "react";
import { categoryService } from "../services/categoryService";
import { Category } from "../types/event.types";

export const useCategories = (limit?: number) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    categoryService.getCategories()
      .then((data) => {
        if (isMounted) {
          setCategories(limit ? data.slice(0, limit) : data);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error("Failed to fetch categories"));
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [limit]);

  return { categories, isLoading, error };
};
