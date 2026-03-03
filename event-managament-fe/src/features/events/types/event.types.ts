export interface Category {
  id: string;
  name: string;
  slug?: string;
  icon?: string | null;
  color?: string | null;
  thumbnail?: string | null;
  eventCount?: number;
}

export interface Organizer {
  id: string;
  name: string;
}

export interface TicketType {
  id: string;
  name: string;
  price: number | string;
  quota?: number;
  description?: string | null;
}

export interface Event {
  id: string;
  name: string;
  title?: string;
  description?: string;
  location: any;
  price?: number | string;
  startDate: string;
  endDate: string;
  startDateObj?: Date;
  date?: string;
  time?: string;
  organizerId: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  imageUrl: string;
  image?: string;
  category: Category;
  organizer: Organizer;
  ticketTypes: TicketType[];
  isFavorite?: boolean;
  currency?: string;
  isFree?: boolean;
  categoryName?: string;
  promotions?: any[];
}

export interface Meta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface EventsResponse {
  data: Event[];
  meta: Meta;
}

export interface EventResponse extends Event {}

export interface UseEventsOptions {
  page?: number;
  limit?: number;
  categoryId?: string;
  location?: string;
  search?: string;
  organizerId?: string;
}

export interface UseEventsReturn {
  events: Event[];
  meta: Meta | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}
