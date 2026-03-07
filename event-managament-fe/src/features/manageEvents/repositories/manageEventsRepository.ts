import apiFetch from "@/services/apiFetch";
import { ManageEventsOptions } from "../types/manageEvent.types";

export const manageEventsRepository = {
  getOrganizerEvents: async (options: ManageEventsOptions) => {
    const params = new URLSearchParams();

    if (options.organizerId) params.set("organizerId", options.organizerId);
    if (options.search) params.set("name", options.search);
    if (options.location && options.location !== "all") {
      params.set("location", options.location);
    }
    if (options.page) params.set("page", String(options.page));

    params.set("limit", String(options.limit ?? 10));

    const response = await apiFetch.get(`/events?${params.toString()}`);
    return response.data;
  },

  getCategories: async () => {
    const response = await apiFetch.get("/events/categories");
    return response.data;
  },

  createEvent: async (formData: FormData) => {
    const response = await apiFetch.post("/events", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  getEventById: async (id: string) => {
    const response = await apiFetch.get(`/events/${id}`);
    return response.data;
  },

  createTicketTier: async (
    eventId: string,
    data: { name: string; price: number; quota: number; description?: string },
  ) => {
    const response = await apiFetch.post(`/events/${eventId}/tickets`, data);
    return response.data;
  },

  updateTicketTier: async (
    eventId: string,
    ticketId: string,
    data: { name?: string; price?: number; quota?: number; description?: string },
  ) => {
    const response = await apiFetch.patch(`/events/${eventId}/tickets/${ticketId}`, data);
    return response.data;
  },

  deleteTicketTier: async (eventId: string, ticketId: string) => {
    const response = await apiFetch.delete(`/events/${eventId}/tickets/${ticketId}`);
    return response.data;
  },
};
