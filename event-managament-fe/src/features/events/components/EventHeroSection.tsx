"use client";

import React from "react";
import Image from "next/image";
import { Event } from "../types/event.types";
import { FireIcon } from "@heroicons/react/24/solid";

interface EventHeroSectionProps {
  event: Event;
}

const EventHeroSection: React.FC<EventHeroSectionProps> = ({ event }) => {
  const imageSrc = event.image || event.imageUrl || "/placeholder.jpg";
  
  return (
    <div className="relative group overflow-hidden rounded-2xl md:rounded-3xl shadow-2xl border border-white/10 aspect-video">
      <Image
        alt={event.name}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
        src={imageSrc}
        fill
        priority
      />
      
      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 transition-opacity group-hover:opacity-100"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent opacity-60"></div>

      {/* Badges */}
      <div className="absolute top-4 left-4 md:top-8 md:left-8 z-20 flex flex-col gap-3">
        <div className="bg-neon-magenta/20 backdrop-blur-md border border-neon-magenta/30 px-3 md:px-5 py-1.5 md:py-2.5 rounded-full font-black text-white text-[9px] md:text-xs uppercase flex items-center gap-2 shadow-[0_0_20px_rgba(255,0,85,0.3)] animate-pulse">
          <FireIcon className="size-3 md:size-4 text-neon-magenta" />
          Trending Now
        </div>
      </div>

      <div className="absolute bottom-4 right-4 md:bottom-8 md:right-8 z-20">
        <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-black/5 dark:border-white/10 px-4 md:px-6 py-2 md:py-3 rounded-2xl md:rounded-3xl text-[9px] md:text-xs font-bold uppercase text-gray-700 dark:text-gray-300 tracking-widest shadow-xl dark:shadow-2xl flex items-center gap-3">
          <div className="size-6 md:size-8 rounded-full bg-gradient-to-br from-neon-cyan to-neon-purple p-[1px]">
            <div className="w-full h-full rounded-full bg-white dark:bg-black flex items-center justify-center text-[8px] md:text-[10px] font-black text-gray-900 dark:text-white">
              {event.organizer?.name?.substring(0, 1).toUpperCase() || "H"}
            </div>
          </div>
          <span>Hosted by <span className="text-black dark:text-white font-black">{event.organizer?.name || "Organizer"}</span></span>
        </div>
      </div>

      {/* Decorative Glow */}
      <div className="absolute -bottom-20 -left-20 size-64 bg-neon-cyan/10 blur-[80px] rounded-full pointer-events-none"></div>
    </div>
  );
};

export default EventHeroSection;
