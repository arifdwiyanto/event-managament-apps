"use client";

import { useSearchParams } from "next/navigation";
import { useInfiniteEvents } from "./useInfiniteEvents";

interface UseEventInfiniteGridOptions {
  limit?: number;
}

export const useEventInfiniteGrid = (options: UseEventInfiniteGridOptions = {}) => {
  const searchParams = useSearchParams();

  const categoryId = searchParams.get("categoryId") || undefined;
  const location = searchParams.get("location") || undefined;
  const search = searchParams.get("search") || undefined;

  const infiniteEvents = useInfiniteEvents({
    categoryId,
    location,
    search,
    limit: options.limit || 12,
  });

  return {
    ...infiniteEvents,
    categoryId,
    location,
    search,
  };
};
