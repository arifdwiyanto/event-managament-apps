import { promotionsRepository } from "../repositories/promotions.repository";
import {
  CreatePromotion,
  PaginatedPromotions,
  Promotion,
  UpdatePromotion,
} from "../types/promotions.types";

export const getPromotions = (
  params?: Record<string, any>,
): Promise<PaginatedPromotions> => {
  return promotionsRepository.getAll(params);
};

export const getPromotion = (id: string): Promise<Promotion> => {
  return promotionsRepository.getById(id);
};

export const createPromotion = (data: CreatePromotion): Promise<Promotion> => {
  return promotionsRepository.create(data);
};

export const updatePromotion = (
  id: string,
  data: UpdatePromotion,
): Promise<Promotion> => {
  return promotionsRepository.update(id, data);
};

export const deletePromotion = (id: string): Promise<void> => {
  return promotionsRepository.delete(id);
};

export const validatePromotion = (payload: {
  code: string;
  userId?: string;
  eventId?: string;
}) => {
  return promotionsRepository.validate(payload);
};
