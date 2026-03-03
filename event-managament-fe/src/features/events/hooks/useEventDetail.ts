"use client"
import { useState, useEffect, useCallback } from "react";
import { eventService } from "../services/eventService";
import { Event } from "../types/event.types";

export const useEventDetail = (id: string) => {
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvent = useCallback(async () => {
    if (!id) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const data = await eventService.getEventById(id);
      setEvent(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch event details");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchEvent();
  }, [fetchEvent]);

  return {
    event,
    isLoading,
    error,
    refetch: fetchEvent,
  };
};
