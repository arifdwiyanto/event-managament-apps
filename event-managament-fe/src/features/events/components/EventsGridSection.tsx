"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import EventCard from "./EventCard";
import EventCardSkeleton from "./EventCardSkeleton";
import { useEvents } from "../hooks/useEvents";
import PaginationBar from "../../home/components/PaginationBar";

interface EventsGridSectionProps {
  onToast?: (message: string, severity: "success" | "error") => void;
}

const EventsGridSection: React.FC<EventsGridSectionProps> = ({ onToast }) => {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const categoryId = searchParams.get("categoryId") || undefined;
  const location = searchParams.get("location") || undefined;
  const search = searchParams.get("search") || undefined;

  const { events, meta, isLoading, error } = useEvents({
    page,
    categoryId,
    location,
    search,
  });

  if (error) {
    return (
      <section className="bg-white dark:bg-[#0a0a0a] w-full border-t border-gray-200 dark:border-[#222]">
        <div className="py-8 md:py-16 px-4 md:px-6 lg:px-10 max-w-[1400px] mx-auto w-full text-center text-red-500">
          <p>{error}</p>
        </div>
      </section>
    );
  }

  if (!isLoading && events.length === 0) {
    return (
      <section className="bg-white dark:bg-[#0a0a0a] w-full border-t border-gray-200 dark:border-[#222]">
        <div className="py-16 md:py-24 px-4 md:px-6 lg:px-10 max-w-[1400px] mx-auto w-full flex flex-col items-center justify-center gap-4 text-center">
          <svg
            className="w-16 h-16 text-gray-300 dark:text-gray-700"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z" />
            <path d="M7 12h2v5H7zm4-7h2v12h-2zm4 4h2v8h-2z" />
          </svg>
          <p className="text-xl font-bold text-gray-400 dark:text-gray-600 uppercase tracking-wider">
            No events found
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-600">
            Try adjusting your filters or browse all events
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      id="events-grid"
      className="bg-white dark:bg-[#0a0a0a] w-full border-t border-gray-200 dark:border-[#222]"
    >
      <div className="py-8 md:py-16 px-4 md:px-6 lg:px-10 max-w-[1400px] mx-auto w-full">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 lg:gap-8">
          {isLoading
            ? [...Array(8)].map((_, i) => <EventCardSkeleton key={i} />)
            : events.map((event) => <EventCard key={event.id} event={event} onToast={onToast} />)}
        </div>

        {meta && meta.totalPages > 1 && (
          <PaginationBar totalPages={meta.totalPages} />
        )}
      </div>
    </section>
  );
};

export default EventsGridSection;
