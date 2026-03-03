"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Event } from "../types/event.types";
import { format } from "date-fns";
import { CalendarIcon, MapPinIcon } from "@heroicons/react/24/outline";

interface EventExplorerCardProps {
  event: Event;
}

const EventExplorerCard: React.FC<EventExplorerCardProps> = ({ event }) => {
  const borderColors = {
    Music: "hover:border-neon-cyan",
    Workshop: "hover:border-neon-pink",
    Nightlife: "hover:border-neon-purple",
    Art: "hover:border-neon-cyan",
    Other: "hover:border-black dark:hover:border-white",
  };

  const accentColors = {
    Music: "text-neon-cyan",
    Workshop: "text-neon-pink",
    Nightlife: "text-neon-purple",
    Art: "text-neon-cyan",
    Other: "text-foreground",
  };

  const bgAccents = {
    Music: "bg-neon-cyan text-black",
    Workshop: "bg-neon-pink text-white",
    Nightlife: "bg-neon-purple text-white",
    Art: "bg-neon-cyan text-black",
    Other: "bg-foreground text-background",
  };

  const categoryName = event.category?.name || "Other";
  const borderColor = borderColors[categoryName as keyof typeof borderColors] || borderColors.Other;
  const accentColor = accentColors[categoryName as keyof typeof accentColors] || accentColors.Other;
  const bgAccent = bgAccents[categoryName as keyof typeof bgAccents] || bgAccents.Other;

  const formattedDate = format(new Date(event.startDate), "MMM dd • HH:mm");
  const price = typeof event.price === "number" 
    ? `IDR ${event.price.toLocaleString("id-ID")}` 
    : event.price || "FREE";

  return (
    <div className={`group relative flex flex-col bg-surface border-2 border-gray-100 dark:border-white/10 ${borderColor} transition-all duration-300`}>
      <div className="relative h-60 overflow-hidden">
        <Image
          src={event.imageUrl || event.image || "/placeholder-event.jpg"}
          alt={event.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4 z-20 bg-black/80 backdrop-blur-md px-3 py-1 text-[10px] font-black uppercase border border-white/20 text-white">
          {categoryName}
        </div>
        <div className={`absolute bottom-4 right-4 z-20 ${bgAccent} px-3 py-1 text-xs font-black italic shadow-[4px_4px_0px_#000]`}>
          {price}
        </div>
      </div>
      <div className="p-6 space-y-4">
        <h3 className={`font-display font-bold text-xl uppercase tracking-tight group-hover:${accentColor} transition-colors line-clamp-1`}>
          {event.name}
        </h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            <CalendarIcon className={`size-5 ${accentColor}`} strokeWidth={2} />
            {formattedDate}
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
            <MapPinIcon className="size-5 text-neon-cyan" strokeWidth={2} />
            <span className="line-clamp-1">{typeof event.location === "string" ? event.location : event.location?.address || "TBA"}</span>
          </div>
        </div>
        <Link 
          href={`/events/${event.id}`}
          className={`block w-full text-center py-3 border-2 border-gray-100 dark:border-white/10 group-hover:${borderColor} group-hover:${bgAccent} font-black uppercase tracking-widest text-xs transition-all`}
        >
          {event.isFree ? "Join Waitlist" : "Secure Spot"}
        </Link>
      </div>
    </div>
  );
};

export default EventExplorerCard;
