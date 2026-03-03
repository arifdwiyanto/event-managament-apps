"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { eventService } from "../services/eventService";
import { 
  Event, 
  Meta, 
  UseEventsOptions 
} from "../types/event.types";

interface UseInfiniteEventsReturn {
  events: Event[];
  isLoading: boolean;
  isFetchingNextPage: boolean;
  error: string | null;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  totalResults: number;
}

export const useInfiniteEvents = (
  options: UseEventsOptions = {}
): UseInfiniteEventsReturn => {
  const [events, setEvents] = useState<Event[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const limit = options.limit || 12;
  
  // Track current state in refs to avoid dependency loops in fetchEvents
  const pageRef = useRef(1);
  const isInitialMount = useRef(true);

  const fetchEvents = useCallback(async (isNextPage: boolean = false) => {
    if (isNextPage) {
      setIsFetchingNextPage(true);
    } else {
      setIsLoading(true);
    }
    setError(null);

    try {
      const targetPage = isNextPage ? pageRef.current + 1 : 1;
      
      // Clear events immediately if it's a fresh load (e.g. filter change)
      // This triggers the skeleton loaders instantly in the UI
      if (!isNextPage) {
        setEvents([]);
        setMeta(null);
      }

      const response = await eventService.getEvents({
        ...options,
        page: targetPage,
        limit,
      });

      if (isNextPage) {
        setEvents((prev) => [...prev, ...response.data]);
        pageRef.current = targetPage;
      } else {
        setEvents(response.data);
        pageRef.current = 1;
      }
      setMeta(response.meta);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Failed to fetch events");
    } finally {
      setIsLoading(false);
      setIsFetchingNextPage(false);
    }
  }, [options, limit]);

  // Initial fetch and reset on filter change
  useEffect(() => {
    // This effect runs whenever filters change
    fetchEvents(false);
  }, [options.categoryId, options.location, options.search]);

  const hasNextPage = meta ? pageRef.current < meta.totalPages : false;

  const fetchNextPage = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage && !isLoading) {
      fetchEvents(true);
    }
  }, [hasNextPage, isFetchingNextPage, isLoading, fetchEvents]);

  return { 
    events, 
    isLoading, 
    isFetchingNextPage, 
    error, 
    hasNextPage, 
    fetchNextPage,
    totalResults: meta?.total || 0
  };
};
