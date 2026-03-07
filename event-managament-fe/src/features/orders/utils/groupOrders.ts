import { OrderItem } from "../types/orders.types";

export interface EventGroup {
  eventId: string;
  eventName: string;
  items: OrderItem[];
}

export interface GroupedOrderItems {
  organizerName: string;
  organizerId: string;
  eventGroups: EventGroup[];
}

export const groupOrderItemsByOrganizer = (items: OrderItem[]): GroupedOrderItems[] => {
  const groups: Record<string, { organizerName: string; organizerId: string; events: Record<string, { eventName: string; items: OrderItem[] }> }> = {};

  items.forEach((item) => {
    const organizerId = item.ticketType.event?.organizerId || "other";
    const organizerName = item.ticketType.event?.organizer?.name || "Other Organizer";
    const eventId = item.ticketType.event?.id || "other";
    const eventName = item.ticketType.event?.name || "Unknown Event";

    if (!groups[organizerId]) {
      groups[organizerId] = { organizerId, organizerName, events: {} };
    }

    if (!groups[organizerId].events[eventId]) {
      groups[organizerId].events[eventId] = { eventName, items: [] };
    }

    groups[organizerId].events[eventId].items.push(item);
  });

  return Object.values(groups).map((g) => ({
    organizerId: g.organizerId,
    organizerName: g.organizerName,
    eventGroups: Object.entries(g.events).map(([eventId, eg]) => ({
      eventId,
      eventName: eg.eventName,
      items: eg.items,
    })),
  }));
};
