"use client";

import React from "react";
import { Event } from "../types/event.types";
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  TagIcon,
} from "@heroicons/react/24/outline";
import { formatEventDate, formatEventTime, formatEventLocation } from "../utils";

interface EventInfoSectionProps {
  event: Event;
}

const EventInfoSection: React.FC<EventInfoSectionProps> = ({ event }) => {
  const displayDate = formatEventDate(event.startDate);
  const displayTime = formatEventTime(event.startDate);
  const displayLocation = formatEventLocation(event.location);

  return (
    <div className="space-y-8 py-4">
      <div className="space-y-2">
        <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter leading-none text-gray-900 dark:text-white drop-shadow-xl dark:drop-shadow-2xl">
          {event.name}
        </h1>
        <div className="flex items-center gap-2">
          <div className="h-1 w-12 bg-gradient-to-r from-neon-cyan to-transparent"></div>
          <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-neon-cyan/80">
            Premium Event
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 md:gap-4">
        {/* Glass Badge: Date */}
        <div className="bg-black/5 dark:bg-white/5 backdrop-blur-xl border border-black/5 dark:border-white/10 px-4 md:px-6 py-2.5 md:py-3.5 flex items-center gap-3 rounded-2xl shadow-md dark:shadow-xl group/badge hover:border-neon-cyan/50 transition-colors">
          <div className="p-2 rounded-xl bg-neon-cyan/10 text-neon-cyan drop-shadow-[0_0_8px_rgba(0,255,221,0.5)]">
            <CalendarIcon className="size-5 md:size-6 stroke-[2.5]" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-none mb-1">
              Date
            </p>
            <span className="font-black uppercase text-xs md:text-sm text-gray-800 dark:text-white tracking-widest">
              {displayDate}
            </span>
          </div>
        </div>

        {/* Glass Badge: Time */}
        <div className="bg-black/5 dark:bg-white/5 backdrop-blur-xl border border-black/5 dark:border-white/10 px-4 md:px-6 py-2.5 md:py-3.5 flex items-center gap-3 rounded-2xl shadow-md dark:shadow-xl group/badge hover:border-neon-purple/50 transition-colors">
          <div className="p-2 rounded-xl bg-neon-purple/10 text-neon-purple drop-shadow-[0_0_8px_rgba(180,0,255,0.5)]">
            <ClockIcon className="size-5 md:size-6 stroke-[2.5]" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-none mb-1">
              Time
            </p>
            <span className="font-black uppercase text-xs md:text-sm text-gray-800 dark:text-white tracking-widest">
              {displayTime}
            </span>
          </div>
        </div>

        {/* Glass Badge: Location */}
        <div className="bg-black/5 dark:bg-white/5 backdrop-blur-xl border border-black/5 dark:border-white/10 px-4 md:px-6 py-2.5 md:py-3.5 flex items-center gap-3 rounded-2xl shadow-md dark:shadow-xl group/badge hover:border-neon-magenta/50 transition-colors">
          <div className="p-2 rounded-xl bg-neon-magenta/10 text-neon-magenta drop-shadow-[0_0_8px_rgba(255,0,85,0.5)]">
            <MapPinIcon className="size-5 md:size-6 stroke-[2.5]" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-none mb-1">
              Venue
            </p>
            <span className="font-black uppercase text-xs md:text-sm text-gray-800 dark:text-white tracking-widest line-clamp-1 max-w-[150px] md:max-w-[250px]">
              {displayLocation || "Venue TBA"}
            </span>
          </div>
        </div>
      </div>

      {event.promotions && event.promotions.length > 0 && (
        <div className="pt-4">
          <p className="text-sm md:text-lg font-bold text-gray-500 uppercase tracking-widest leading-none mb-3">
            Available Promos
          </p>
          <div className="flex flex-wrap gap-2">
            {event.promotions.map(
              (p: any) =>
                p.promotion && (
                  <div
                    key={p.promotion.id}
                    className="flex items-center gap-2 bg-[#ee2b8c]/10 border border-[#ee2b8c]/20 px-3 py-1.5 rounded-lg"
                  >
                    <TagIcon className="w-4 h-4 text-[#ee2b8c]" />
                    <span className="font-mono text-sm md:text-lg font-bold text-[#ee2b8c] uppercase tracking-wider">
                      {p.promotion.code}
                    </span>
                    <span className="text-sm md:text-lg font-bold text-[#ee2b8c]/80 uppercase ml-1">
                      {p.promotion.discountPercentage
                        ? `${p.promotion.discountPercentage}% OFF`
                        : `Rp ${Number(p.promotion.discountAmount).toLocaleString("id-ID")} OFF`}
                    </span>
                  </div>
                ),
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EventInfoSection;
