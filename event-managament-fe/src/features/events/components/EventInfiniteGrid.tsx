"use client";

import React, { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import EventCard from "./EventCard";
import EventCardSkeleton from "./EventCardSkeleton";
import { useInfiniteEvents } from "../hooks/useInfiniteEvents";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useEventFilters, EventFiltersReturn } from "../hooks/useEventFilters";

interface EventInfiniteGridProps extends EventFiltersReturn {
  onToast: (message: string, severity: "success" | "error") => void;
}

const EventInfiniteGrid: React.FC<EventInfiniteGridProps> = ({ searchValue, setSearchValue, onToast }) => {
  const searchParams = useSearchParams();
  const observerTarget = useRef<HTMLDivElement>(null);

  const categoryId = searchParams.get("categoryId") || undefined;
  const location = searchParams.get("location") || undefined;
  const search = searchParams.get("search") || undefined;

  const {
    events,
    isLoading,
    isFetchingNextPage,
    error,
    hasNextPage,
    fetchNextPage,
    totalResults,
  } = useInfiniteEvents({
    categoryId,
    location,
    search,
    limit: 12,
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (error) {
    return (
      <div className="py-20 text-center">
        <p className="text-neon-pink font-bold uppercase tracking-widest">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-6 py-2 border-2 border-neon-cyan text-neon-cyan text-xs font-black uppercase tracking-widest hover:bg-neon-cyan hover:text-black transition-all"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-white/10 pb-4 transition-colors">
          <p className="text-xs font-mono text-gray-500 uppercase tracking-widest">
            Showing <span className="text-foreground">{events.length}</span> of <span className="text-foreground">{totalResults}</span> Vibes
          </p>
        </div>

        {/* Mobile Search - Visible only on small screens */}
        <div className="lg:hidden">
          <div className="relative group">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-neon-cyan size-5 transition-colors" strokeWidth={2.5} />
            <input
              className="w-full bg-white dark:bg-black border-2 border-gray-200 dark:border-white/10 focus:border-neon-cyan focus:ring-0 pl-12 pr-4 py-4 text-sm font-bold placeholder:text-gray-400 uppercase tracking-wide text-foreground transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,0.05)]"
              placeholder="Search events..."
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>
        </div>
      </div>

      {isLoading && events.length === 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-1 ">
          {[...Array(12)].map((_, i) => (
            <EventCardSkeleton key={i} />
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="py-20 text-center space-y-4">
          <MagnifyingGlassIcon className="size-16 text-gray-700 mx-auto" strokeWidth={1} />
          <p className="text-xl font-bold text-gray-400 uppercase tracking-wider">No Vibes Found</p>
          <p className="text-sm text-gray-500">Try adjusting your filters to find something else.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 ">
            {events.map((event) => (
              <EventCard key={event.id} event={event} onToast={onToast} />
            ))}
            {/* Infinite Pagination Skeletons */}
            {isFetchingNextPage && (
              <>
                {[...Array(12)].map((_, i) => (
                  <EventCardSkeleton key={`skeleton-next-${i}`} />
                ))}
              </>
            )}
          </div>

          {/* Observer Target / No More Vibes Info */}
          <div 
            ref={observerTarget} 
            className="flex justify-center py-12"
          >
            {!hasNextPage && !isLoading && (
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">
                You've reached the end of the vibe list.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default EventInfiniteGrid;
