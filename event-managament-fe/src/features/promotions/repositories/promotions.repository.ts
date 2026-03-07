import apiFetch from "@/services/apiFetch";
import {
  CreatePromotion,
  PaginatedPromotions,
  Promotion,
  UpdatePromotion,
} from "../types/promotions.types";

export const promotionsRepository = {
  getAll: async (params?: Record<string, any>): Promise<PaginatedPromotions> => {
    const response = await apiFetch.get("/promotions", { params });
    return response.data;
  },

  getById: async (id: string): Promise<Promotion> => {
    const response = await apiFetch.get(`/promotions/${id}`);
    return response.data;
  },

  create: async (data: CreatePromotion): Promise<Promotion> => {
    const response = await apiFetch.post("/promotions", data);
    return response.data;
  },

  update: async (id: string, data: UpdatePromotion): Promise<Promotion> => {
    const response = await apiFetch.patch(`/promotions/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiFetch.delete(`/promotions/${id}`);
  },

  validate: async (payload: {
    code: string;
    userId?: string;
    eventId?: string;
  }) => {
    const response = await apiFetch.post("/promotions/validate", payload);
    return response.data;
  },
};
