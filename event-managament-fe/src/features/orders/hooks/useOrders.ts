import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CreateOrderPayload, Order, OrdersResponse, PayOrderPayload } from "../types/orders.types";
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

export const useGetOrders = (
  params?: {
    page?: number;
    limit?: number;
    [key: string]: any;
  },
  initialData?: OrdersResponse,
) => {
  return useQuery({
    queryKey: ["orders", params],
    queryFn: () => ordersService.getOrders(params),
    initialData,
  });
};

export const useGetOrder = (id: string, initialData?: Order) => {
  return useQuery({
    queryKey: ["orders", id],
    queryFn: () => ordersService.getOrderById(id),
    enabled: !!id,
    initialData,
  });
};

export const usePayOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: PayOrderPayload }) =>
      ordersService.payOrder(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["orders", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};
