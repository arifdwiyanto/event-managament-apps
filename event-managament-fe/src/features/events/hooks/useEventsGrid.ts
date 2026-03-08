"use client";

import { useSearchParams } from "next/navigation";
import { useEvents } from "./useEvents";

export const useEventsGrid = () => {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const categoryId = searchParams.get("categoryId") || undefined;
  const location = searchParams.get("location") || undefined;
  const search = searchParams.get("search") || undefined;

  const eventsData = useEvents({
    page,
    categoryId,
    location,
    search,
  });

  return {
    ...eventsData,
    page,
    categoryId,
    location,
    search,
  };
};
