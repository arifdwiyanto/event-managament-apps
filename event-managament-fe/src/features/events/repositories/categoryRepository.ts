import apiFetch from "@/services/apiFetch";
import { Category } from "../types/event.types";

export interface CategoriesResponse {
  data: Category[];
}

export const categoryRepository = {
  getCategories: async (): Promise<CategoriesResponse> => {
    const response = await apiFetch.get("/events/categories");
    return response.data;
  },
};
