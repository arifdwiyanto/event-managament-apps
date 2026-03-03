import { eventRepository } from "../repositories/eventRepository";
import { EventsResponse, Event, UseEventsOptions } from "../types/event.types";

export const eventService = {
  getEvents: async (options: UseEventsOptions): Promise<EventsResponse> => {
    const rawData = await eventRepository.getEvents(options);

    const mappedEvents: Event[] = (rawData.data as Event[]).map((ticket) => {
      const prices = (ticket.ticketTypes || []).map((t) =>
        typeof t.price === "string" ? Number(t.price) : Number(t.price || 0),
      );
      const minPrice = prices.length ? Math.min(...prices) : 0;

      return {
        ...ticket,
        price: minPrice,
        startDate: ticket.startDate,
        endDate: ticket.endDate,
      };
    });

    return {
      data: mappedEvents,
      meta: rawData.meta,
    };
  },
  getEventById: async (id: string): Promise<Event> => {
    const event = await eventRepository.getEventById(id);
    
    if (!event) throw new Error("Event not found");

    // Mapping logic (same as in getEvents)
    const prices = (event.ticketTypes || []).map((t) =>
      typeof t.price === "string" ? Number(t.price) : Number(t.price || 0),
    );
    const minPrice = prices.length ? Math.min(...prices) : 0;

    return {
      ...event,
      price: minPrice,
      startDate: event.startDate,
      endDate: event.endDate,
    };
  },
};
