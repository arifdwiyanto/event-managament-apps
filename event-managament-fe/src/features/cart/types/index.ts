import { Event } from "../../events/types/event.types";

export interface CartItem {
  id: string;
  cartId: string;
  ticketTypeId: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  ticketType: {
    id: string;
    eventId: string;
    name: string;
    price: number;
    quota: number;
    description: string | null;
    event: Event;
  };
}

export interface Cart {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  items: CartItem[];
}
