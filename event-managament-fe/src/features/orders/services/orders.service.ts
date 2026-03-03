import apiFetch from "@/services/apiFetch";
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

  getOrders: async (params?: {
    page?: number;
    limit?: number;
    [key: string]: any;
  }): Promise<OrdersResponse> => {
    const { data } = await apiFetch.get<OrdersResponse>("/orders", { params });
    return data;
  },

  getOrderById: async (id: string): Promise<Order> => {
    const { data } = await apiFetch.get<Order>(`/orders/${id}`);
    return data;
  },

  payOrder: async (id: string, payload: PayOrderPayload): Promise<Order> => {
    const { data } = await apiFetch.post<Order>(
      `/orders/${id}/payment`,
      payload,
    );
    return data;
  },

  uploadPaymentProof: async (id: string, file: File): Promise<Order> => {
    const formData = new FormData();
    formData.append("paymentProof", file);

    const { data } = await apiFetch.patch<Order>(
      `/orders/${id}/payment-proof`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return data;
  },
};
