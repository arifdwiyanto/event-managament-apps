import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CreateOrderPayload, PayOrderPayload } from "../types/orders.types";
import { ordersService } from "../services/orders.service";

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateOrderPayload) =>
      ordersService.createOrder(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};

export const useGetOrders = (params?: {
  page?: number;
  limit?: number;
  [key: string]: any;
}) => {
  return useQuery({
    queryKey: ["orders", params],
    queryFn: () => ordersService.getOrders(params),
  });
};

export const useGetOrder = (id: string) => {
  return useQuery({
    queryKey: ["orders", id],
    queryFn: () => ordersService.getOrderById(id),
    enabled: !!id,
  });
};

export const usePayOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: PayOrderPayload }) =>
      ordersService.payOrder(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["order", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};
