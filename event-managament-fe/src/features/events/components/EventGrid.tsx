"use client";

import React from "react";
import EventExplorerCard from "./EventExplorerCard";
import { Event } from "../types/event.types";
import { useEventFilters } from "../hooks/useEventFilters";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

interface EventGridProps {
  events: Event[];
  totalResults: number;
}

const EventGrid: React.FC<EventGridProps> = ({ events, totalResults }) => {
  const { searchValue, setSearchValue } = useEventFilters();

  return (
    <section className="flex-1 space-y-10">
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-white/10 pb-4 transition-colors">
          <p className="text-xs font-mono text-gray-500 uppercase tracking-widest">
            Showing <span className="text-foreground">{totalResults}</span> Results
          </p>
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase">Sort by:</span>
            <select className="bg-transparent border-none text-xs font-black uppercase tracking-widest text-neon-cyan focus:ring-0 cursor-pointer">
              <option className="bg-background dark:bg-surface-dark">Newest</option>
              <option className="bg-background dark:bg-surface-dark">Popular</option>
              <option className="bg-background dark:bg-surface-dark">Price: Low to High</option>
            </select>
          </div>
        </div>

        {/* Mobile Search - Visible only on small screens */}
        <div className="lg:hidden space-y-3">
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

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {events.map((event) => (
          <EventExplorerCard key={event.id} event={event} />
        ))}
      </div>

      {events.length < totalResults && (
        <div className="flex justify-center pt-12">
          <button className="px-12 py-5 border-4 border-neon-pink text-neon-pink font-display font-black text-2xl uppercase tracking-tighter hover:bg-neon-pink hover:text-black transition-all shadow-[8px_8px_0px_0px_rgba(255,0,255,0.1)] dark:shadow-[8px_8px_0px_0px_rgba(255,0,255,0.3)] hover:shadow-none hover:translate-x-1 hover:translate-y-1">
            Load More Vibes
          </button>
        </div>
      )}
    </section>
  );
};

export default EventGrid;
