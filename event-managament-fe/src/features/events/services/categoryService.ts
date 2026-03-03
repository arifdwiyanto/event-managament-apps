import { categoryRepository } from "../repositories/categoryRepository";
import { Category } from "../types/event.types";

export const categoryService = {
  getCategories: async (): Promise<Category[]> => {
    const response = await categoryRepository.getCategories();
    return response.data || [];
  },
};
