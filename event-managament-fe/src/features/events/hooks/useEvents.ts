import { useState, useEffect, useCallback } from "react";
import { eventService } from "../services/eventService";
import { 
  Event, 
  Meta, 
  UseEventsOptions, 
  UseEventsReturn 
} from "../types/event.types";

export const useEvents = (
  options: UseEventsOptions | number = 1,
  limit = 8,
): UseEventsReturn => {
  const opts: UseEventsOptions =
    typeof options === "number" ? { page: options, limit } : options;

  const page = opts.page ?? 1;
  const _limit = opts.limit ?? limit;
  const categoryId = opts.categoryId;
  const location = opts.location;
  const search = opts.search;
  const organizerId = opts.organizerId;

  const [events, setEvents] = useState<Event[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await eventService.getEvents({
        page,
        limit: _limit,
        categoryId,
        location,
        search,
        organizerId,
      });

      setEvents(response.data);
      setMeta(response.meta);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Failed to fetch events");
    } finally {
      setIsLoading(false);
    }
  }, [page, _limit, categoryId, location, search, organizerId]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return { events, meta, isLoading, error, refetch: fetchEvents };
};
