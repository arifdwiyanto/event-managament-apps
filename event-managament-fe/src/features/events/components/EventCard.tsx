"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Event } from "../types/event.types";
import { 
  CalendarIcon, 
  MapPinIcon, 
  ShoppingCartIcon
} from "@heroicons/react/24/outline";
import { useEventCardActions, useEventCard } from "../hooks";
import TicketSelectionModal from "./TicketSelectionModal";

interface EventCardProps {
  event: Event;
  onToast?: (message: string, severity: "success" | "error") => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onToast }) => {
  const {
    badgeColor,
    badgeTextColor,
    shadowStyle,
    displayTitle,
    displayDate,
    displayTime,
    displayLocation,
    resolvedPrice,
    currency,
    formatPrice,
    imageSrc,
  } = useEventCard(event);

  const {
    cartLoading,
    localLoading,
    isModalOpen,
    handleAddToCart,
    handleCloseModal,
  } = useEventCardActions({ onToast });

  return (
    <div
      className="group relative flex flex-col bg-white/70 dark:bg-white/5 backdrop-blur-xl rounded-lg md:rounded-xl overflow-hidden border border-black/5 dark:border-white/10 transition-all duration-500 hover:shadow-[0_15px_40px_rgba(0,255,221,0.15)] dark:hover:shadow-[0_15px_40px_rgba(0,255,221,0.12)] hover:-translate-y-1"
    >
      <Link href={`/events/${event.id}`} className="flex flex-col flex-grow">
        {/* Image */}
        <div className="relative h-28 sm:h-36 md:h-48 lg:h-52 overflow-hidden">
          <Image
            alt={displayTitle}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            src={imageSrc}
            fill
          />
          
          {/* Top Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent opacity-60"></div>
          
          {/* Category Badge - Glass Style */}
          <div
            className="absolute top-2 left-2 md:top-3 md:left-3 z-20 px-2 py-0.5 md:px-2.5 md:py-1 text-[7px] md:text-[10px] font-black uppercase tracking-widest backdrop-blur-md border border-white/20 rounded-full text-white"
            style={{ 
              backgroundColor: `${badgeColor}66`,
              boxShadow: `0 0 10px ${badgeColor}44`
            }}
          >
            {event.category?.name || event.categoryName || "Category"}
          </div>

          {/* Price Tag - Glass Style */}
          <div className="absolute bottom-2 left-2 md:bottom-3 md:left-3 z-20 bg-black/50 backdrop-blur-xl border border-white/10 text-white px-2 py-0.5 md:px-2.5 md:py-1 rounded-md md:rounded-lg text-[9px] md:text-xs font-black tracking-tight">
            {formatPrice(resolvedPrice, currency)}
          </div>
          
          {/* Bottom Bloom Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80"></div>
        </div>

        {/* Content */}
        <div className="p-2.5 md:p-4 flex flex-col flex-grow relative bg-gradient-to-b from-transparent to-black/5 dark:to-white/5">
          {/* Date & Time */}
          <div className="flex flex-wrap items-center gap-1.5 md:gap-2 mb-1 md:mb-2 text-foreground">
            <div className="flex items-center gap-1 text-neon-cyan drop-shadow-[0_0_8px_rgba(0,255,221,0.5)]">
              <CalendarIcon className="w-2.5 h-2.5 md:w-3 md:h-3" strokeWidth={2.5} />
              <span className="text-[7px] md:text-[10px] font-black uppercase tracking-tighter">
                {displayDate}
              </span>
            </div>
            <div className="hidden sm:block w-1 h-1 rounded-full bg-black/10 dark:bg-white/20"></div>
            <span className="text-[7px] md:text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-tighter">
              {displayTime}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-display font-black text-[10px] sm:text-xs md:text-base lg:text-lg text-gray-900 dark:text-white leading-[1.2] group-hover:text-neon-cyan transition-colors uppercase mb-1.5 md:mb-3 line-clamp-2 tracking-tighter">
            {displayTitle}
          </h3>

          {/* Location */}
          <div className="mt-auto flex items-center gap-1 text-gray-600 dark:text-gray-400 text-[7px] md:text-xs font-medium uppercase tracking-tight pr-8 md:pr-0">
            <MapPinIcon className="w-2.5 h-2.5 md:w-3 md:h-3 text-neon-purple shrink-0" strokeWidth={2.5} />
            <span className="truncate">{displayLocation}</span>
          </div>
        </div>
      </Link>

      {/* Quick Add To Cart Button - Glass Style */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleAddToCart();
        }}
        disabled={localLoading || cartLoading}
        className={`absolute bottom-1.5 right-1.5 md:bottom-3 md:right-3 p-1.5 md:p-2 rounded-md md:rounded-xl backdrop-blur-2xl border border-black/10 dark:border-white/20 transition-all z-20 shadow-xl bg-white/50 dark:bg-white/10 hover:bg-neon-cyan hover:text-black dark:hover:bg-neon-cyan dark:hover:text-black group/btn ${
          (localLoading || cartLoading) ? "opacity-50 cursor-not-allowed" : "hover:scale-110 active:scale-95"
        }`}
        title="Select Tickets"
      >
        <ShoppingCartIcon className={`w-3.5 h-3.5 md:w-5 md:h-5 text-gray-900 dark:text-white group-hover/btn:text-black transition-colors ${localLoading ? "animate-bounce" : ""}`} strokeWidth={2} />
        
        {/* Button Glow Effect */}
        <div className="absolute inset-0 bg-neon-cyan/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
      </button>

      {/* Ticket Selection Modal */}
      <TicketSelectionModal 
        open={isModalOpen}
        onClose={handleCloseModal}
        event={event}
        onToast={onToast || (() => {})}
      />
    </div>
  );
};

export default EventCard;
