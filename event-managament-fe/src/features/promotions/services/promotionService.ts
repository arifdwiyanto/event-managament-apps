import apiFetch from "@/services/apiFetch";

export interface EventPromotion {
  id: string;
  name: string;
  code: string;
  discountAmount: number | null;
  discountPercentage: number | null;
  startDate: string;
  endDate: string;
  maxUsage: number | null;
  usageCount: number;
  remaining: number | null;
}

export const getEventPromotions = async (eventId: string): Promise<EventPromotion[]> => {
  const { data } = await apiFetch.get<EventPromotion[]>(`/promotions/events/${eventId}`);
  return data;
};
