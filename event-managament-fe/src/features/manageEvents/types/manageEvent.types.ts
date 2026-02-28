export type ManageEventStatus = "active" | "completed" | "sold-out";

export interface ManageEventTicketType {
  id: string;
  name: string;
  price: number;
  quota: number;
}

export interface ManageEventItem {
  id: string;
  title: string;
  category: string;
  status: ManageEventStatus;
  date: string;
  location: string;
  ticketsSold: number;
  totalTickets: number;
  image?: string;
}

export interface ManageEventsOptions {
  organizerId?: string;
  search?: string;
  location?: string;
  page?: string;
  limit?: number;
}

export interface Category {
  id: string;
  name: string;
  icon?: string;
  color?: string;
}

export interface CreateTicketPayload {
  name: string;
  price: number;
  quota: number;
  description?: string;
}

export interface CreateEventPayload {
  organizerId: string;
  categoryId: string;
  name: string;
  description?: string;
  location: string;
  startDate: string;
  endDate: string;
  isPaid: boolean;
  ticketTypes: CreateTicketPayload[];
}

export interface ManageEventsMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ManageEventsResponse {
  events: ManageEventItem[];
  meta: ManageEventsMeta | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}
