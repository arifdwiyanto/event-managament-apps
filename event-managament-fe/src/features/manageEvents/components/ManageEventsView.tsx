"use client";

import { useStoreLogin } from "@/features/auth/store/useAuthStore";
import { useEffect, useMemo, useState } from "react";
import { useManageEvents } from "../hooks/useManageEvents";
import { ManageEventItem, ManageEventStatus } from "../types/manageEvent.types";
import ManageEventsFilter from "./ManageEventsFilter";
import { CalendarDaysIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import ManageEventsCard from "./ManageEventCard";

const ManageEventSkeleton = () => (
  <div className="flex flex-col md:flex-row gap-5 p-4 md:p-6 bg-white dark:bg-[#221019] border border-gray-100 dark:border-[#3a1d2e] rounded-2xl md:rounded-3xl animate-pulse">
    <div className="w-full md:w-56 h-40 md:h-36 rounded-xl md:rounded-2xl bg-gray-200 dark:bg-white/5 flex-shrink-0"></div>
    <div className="flex-1 py-1 space-y-3">
      <div className="h-5 bg-gray-200 dark:bg-white/10 rounded w-2/3"></div>
      <div className="h-4 bg-gray-100 dark:bg-white/5 rounded w-1/3"></div>
      <div className="h-4 bg-gray-100 dark:bg-white/5 rounded w-1/4"></div>
      <div className="mt-4 h-2 bg-gray-100 dark:bg-white/5 rounded-full w-full"></div>
    </div>
  </div>
);

const ManageEventsView = () => {
  const { user } = useStoreLogin();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRange, setDateRange] = useState("upcoming");
  const [location, setLocation] = useState("all");

  const [debouncedSearch, setDebouncedSearch] = useState("");
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchQuery), 500);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const organizerId = user?.organizer?.id ?? "";

  const { events, meta, isLoading, error, refetch } = useManageEvents({
    organizerId,
    search: debouncedSearch || undefined,
    location: location !== "all" ? location : undefined,
  });

  const filteredEvents = useMemo<ManageEventItem[]>(() => {
    if (statusFilter === "all") return events;
    return events.filter(
      (e) => e.status === (statusFilter as ManageEventStatus),
    );
  }, [events, statusFilter]);

  const displayedEvents = useMemo<ManageEventItem[]>(() => {
    const now = new Date();
    return filteredEvents.filter((event) => {
      if (dateRange === "upcoming") return event.status === "active";
      if (dateRange === "past") return event.status === "completed";
      return true;
    });
  }, [filteredEvents, dateRange]);

  return (
    <main className="flex-1 overflow-y-auto p-3 md:p-6 lg:p-8 bg-[#fcfbfc] dark:bg-[#1a0c13]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 md:mb-8">
          <h1 className="text-xl md:text-2xl font-black font-display tracking-tight text-foreground">
            Manage Events
          </h1>
          <div className="w-full md:w-auto relative">
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-64 px-4 py-2 border border-gray-200 dark:border-[#3a1d2e] rounded-xl bg-white dark:bg-[#221019] focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filter */}
          <ManageEventsFilter
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            dateRange={dateRange}
            setDateRange={setDateRange}
            location={location}
            setLocation={setLocation}
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-gray-500 font-medium">
                {isLoading ? (
                  "Loading..."
                ) : (
                  <>
                    Showing{" "}
                    <span className="font-bold text-foreground">
                      {displayedEvents.length} event
                      {displayedEvents.length !== 1 ? "s" : ""}
                    </span>
                  </>
                )}
              </p>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-500">Sort by:</span>
                <button className="font-bold flex items-center gap-1 hover:text-[#ee2b8c] transition-colors">
                  Newest Created <ChevronDownIcon className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-2xl border border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/5 p-6 text-center text-sm text-red-500">
                <p className="font-bold mb-1">Failed to load events</p>
                <p className="text-xs text-red-400 mb-3">{error}</p>
                <button
                  onClick={refetch}
                  className="px-4 py-1.5 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Loading Skeleton */}
            {isLoading && !error && (
              <div className="space-y-4 md:space-y-6">
                {[1, 2, 3].map((i) => (
                  <ManageEventSkeleton key={i} />
                ))}
              </div>
            )}

            {/* Empty State */}
            {!isLoading && !error && displayedEvents.length === 0 && (
              <div className="flex flex-col items-center justify-center py-24 text-center text-gray-400">
                <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center mb-4">
                  <CalendarDaysIcon className="w-8 h-8 opacity-40" />
                </div>
                <p className="font-bold text-lg text-foreground mb-1">
                  {debouncedSearch
                    ? "No events match your search"
                    : "No events yet"}
                </p>
                <p className="text-sm text-gray-400 max-w-xs">
                  {debouncedSearch
                    ? `Try searching for something else.`
                    : statusFilter !== "all"
                      ? `No ${statusFilter} events found.`
                      : "Start by creating your first event!"}
                </p>
              </div>
            )}

            {/* Event Cards List */}
            {!isLoading && !error && displayedEvents.length > 0 && (
              <div className="space-y-4 md:space-y-6">
                {displayedEvents.map((event) => (
                  <ManageEventsCard key={event.id} event={event} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-8 md:mt-12 mb-4 md:mb-6 text-center text-[10px] md:text-xs text-[#896175]">
        <p>2026 Hype Events. All rights reserved.</p>
      </footer>
    </main>
  );
};

export default ManageEventsView;
