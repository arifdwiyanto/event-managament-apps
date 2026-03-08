"use client";

import { useQuery } from "@tanstack/react-query";
import { categoryService } from "../services/categoryService";
import { Category } from "../types/event.types";

export const useCategories = (limit?: number) => {
  const { data, isLoading, error } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: () => categoryService.getCategories(),
  });

  const categories = data || [];
  const limitedCategories = limit ? categories.slice(0, limit) : categories;

  return { 
    categories: limitedCategories, 
    isLoading, 
    error 
  };
};
