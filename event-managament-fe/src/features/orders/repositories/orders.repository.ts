import apiFetch from "@/services/apiFetch";
import { Order } from "../types/orders.types";

export const ordersRepository = {
  async getOrderById(id: string, token?: string): Promise<Order> {
    const { data } = await apiFetch.get<Order>(`/orders/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return data;
  },
};
