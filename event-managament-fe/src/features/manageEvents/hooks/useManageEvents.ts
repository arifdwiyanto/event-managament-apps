"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ManageEventItem,
  ManageEventsMeta,
  ManageEventsOptions,
} from "../types/manageEvent.types";
import { manageEventsService } from "../services/manageEventsService";

export function useManageEvents(options: ManageEventsOptions) {
  const [events, setEvents] = useState<ManageEventItem[]>([]);
  const [meta, setMeta] = useState<ManageEventsMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    if (!options.organizerId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await manageEventsService.getOrganizerEvents(options);
      setEvents(result.events);
      setMeta(result.meta);
    } catch (error: any) {
      setError(error?.message ?? "Failed to load events");
    } finally {
      setIsLoading(false);
    }
  }, [options.organizerId, options.search, options.location, options.page]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return { events, meta, isLoading, error, refetch: fetchEvents };
}
