import apiFetch from "@/services/apiFetch";
import { EventsResponse, UseEventsOptions, EventResponse } from "../types/event.types";

export const eventRepository = {
  getEvents: async (options: UseEventsOptions): Promise<EventsResponse> => {
    const params = new URLSearchParams();
    if (options.page) params.set("page", String(options.page));
    if (options.limit) params.set("limit", String(options.limit));
    if (options.categoryId) params.set("categoryId", options.categoryId);
    if (options.location) params.set("location", options.location);
    if (options.search) params.set("name", options.search);
    if (options.organizerId) params.set("organizerId", options.organizerId);

    const response = await apiFetch.get(`/events?${params.toString()}`);
    return response.data;
  },
  getEventById: async (id: string): Promise<EventResponse> => {
    const response = await apiFetch.get(`/events/${id}`);
    return response.data;
  },
};
