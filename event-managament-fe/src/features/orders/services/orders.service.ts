import apiFetch from "@/services/apiFetch";
import { ordersRepository } from "../repositories/orders.repository";
import {
  CreateOrderPayload,
  Order,
  OrdersResponse,
  PayOrderPayload,
} from "../types/orders.types";

export const ordersService = {
  createOrder: async (payload: CreateOrderPayload): Promise<Order> => {
    const { data } = await apiFetch.post<Order>("/orders", payload);
    return data;
  },

  getOrders: async (
    params?: {
      page?: number;
      limit?: number;
      [key: string]: any;
    },
    token?: string,
  ): Promise<OrdersResponse> => {
    return ordersRepository.getOrders(params, token);
  },

  getOrderById: async (id: string, token?: string): Promise<Order> => {
    return ordersRepository.getOrderById(id, token);
  },

  payOrder: async (id: string, payload: PayOrderPayload): Promise<Order> => {
    const { data } = await apiFetch.post<Order>(
      `/orders/${id}/payment`,
      payload,
    );
    return data;
  },
};
