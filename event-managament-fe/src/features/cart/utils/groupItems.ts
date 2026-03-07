import { CartItem } from "../types";

export interface GroupedEvent {
  eventId: string;
  eventName: string;
  items: CartItem[];
}

export interface GroupedCartItems {
  organizerName: string;
  organizerId: string;
  eventGroups: GroupedEvent[];
}

export const groupCartItemsByOrganizer = (items: CartItem[]): GroupedCartItems[] => {
  const organizerGroups: { [key: string]: GroupedCartItems } = {};

  items.forEach((item) => {
    const organizerId = item.ticketType.event.organizerId;
    const organizerName = item.ticketType.event.organizer?.name || "Other Organizer";
    const eventId = item.ticketType.eventId;
    const eventName = item.ticketType.event.name;

    if (!organizerGroups[organizerId]) {
      organizerGroups[organizerId] = {
        organizerId,
        organizerName,
        eventGroups: [],
      };
    }

    let eventGroup = organizerGroups[organizerId].eventGroups.find(
      (eg) => eg.eventId === eventId,
    );

    if (!eventGroup) {
      eventGroup = {
        eventId,
        eventName,
        items: [],
      };
      organizerGroups[organizerId].eventGroups.push(eventGroup);
    }

    eventGroup.items.push(item);
  });

  return Object.values(organizerGroups);
};
