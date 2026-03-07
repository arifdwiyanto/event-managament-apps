import { OrderItem } from "../types/orders.types";

export interface GroupedOrderItems {
  organizerName: string;
  organizerId: string;
  items: OrderItem[];
}

export const groupOrderItemsByOrganizer = (items: OrderItem[]): GroupedOrderItems[] => {
  const groups: { [key: string]: GroupedOrderItems } = {};

  items.forEach((item) => {
    const organizerId = item.ticketType.event?.organizerId || "other";
    const organizerName = item.ticketType.event?.organizer?.name || "Other Organizer";

    if (!groups[organizerId]) {
      groups[organizerId] = {
        organizerId,
        organizerName,
        items: [],
      };
    }

    groups[organizerId].items.push(item);
  });

  return Object.values(groups);
};
