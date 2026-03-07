import { CartItem } from "../types";

export interface GroupedCartItems {
  organizerName: string;
  organizerId: string;
  items: CartItem[];
}

export const groupCartItemsByOrganizer = (items: CartItem[]): GroupedCartItems[] => {
  const groups: { [key: string]: GroupedCartItems } = {};

  items.forEach((item) => {
    const organizerId = item.ticketType.event.organizerId;
    const organizerName = item.ticketType.event.organizer?.name || "Other Organizer";

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
