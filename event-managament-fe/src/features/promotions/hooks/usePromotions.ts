import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createPromotion,
  deletePromotion,
  getPromotion,
  getPromotions,
  updatePromotion,
  validatePromotion,
} from "../services/promotions.service";
import { CreatePromotion, UpdatePromotion } from "../types/promotions.types";

export const useGetPromotions = (params?: Record<string, any>) => {
  return useQuery({
    queryKey: ["promotions", params],
    queryFn: () => getPromotions(params),
  });
};

export const useGetPromotion = (id: string) => {
  return useQuery({
    queryKey: ["promotions", id],
    queryFn: () => getPromotion(id),
    enabled: !!id,
  });
};

export const useCreatePromotion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePromotion) => createPromotion(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promotions"] });
    },
  });
};

export const useUpdatePromotion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePromotion }) =>
      updatePromotion(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["promotions"] });
      queryClient.invalidateQueries({ queryKey: ["promotions", variables.id] });
    },
  });
};

export const useDeletePromotion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deletePromotion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promotions"] });
    },
  });
};

export const useValidatePromotion = () => {
  return useMutation({
    mutationFn: (payload: {
      code: string;
      userId?: string;
      eventId?: string;
    }) => validatePromotion(payload),
  });
};
