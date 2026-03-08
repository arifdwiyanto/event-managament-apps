"use client";

import React from "react";
import { TicketType } from "../types/event.types";
import { 
  normalizeTicketPrice, 
  getTicketDisplayPrice, 
  checkIsPopular, 
  getTicketStatus 
} from "../utils/ticketUtils";

interface TicketSelectionCardProps {
  ticket: TicketType;
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
}

const TicketSelectionCard: React.FC<TicketSelectionCardProps> = ({ 
  ticket, 
  quantity, 
  onIncrease, 
  onDecrease 
}) => {
  const price = normalizeTicketPrice(ticket.price);
  const displayPrice = getTicketDisplayPrice(price);
  const isPopular = checkIsPopular(ticket.name);
  const { quota, isSoldOut, isMaxReached } = getTicketStatus(ticket, quantity);

  return (
    <div className={`relative p-4 rounded-xl border transition-all duration-300 backdrop-blur-md ${
      isSoldOut
        ? "bg-gray-100 dark:bg-[#1A1A1A]/50 border-gray-200 dark:border-white/5 opacity-60"
        : quantity > 0 
          ? "bg-neon-cyan/10 border-neon-cyan/50 shadow-[0_0_20px_rgba(0,255,221,0.1)] dark:bg-neon-cyan/20 dark:border-neon-cyan/60" 
          : "bg-black/5 dark:bg-[#1A1A1A]/80 border-black/5 dark:border-white/10 hover:bg-black/10 dark:hover:bg-[#2A2A2A]/80"
    }`}>
      {isPopular && !isSoldOut && (
        <div className="absolute -top-2 -right-2 bg-neon-magenta text-white px-2 py-0.5 font-black text-[8px] uppercase tracking-widest rounded-full shadow-lg border border-white/20 z-10">
          Popular
        </div>
      )}

      {isSoldOut && (
        <div className="absolute -top-2 -right-2 bg-red-500 text-white px-2 py-0.5 font-black text-[8px] uppercase tracking-widest rounded-full shadow-lg border border-white/20 z-10">
          Sold Out
        </div>
      )}
      
      <div className="flex justify-between items-start mb-2">
        <div className="flex-grow pr-4">
          <h4 className={`text-sm md:text-base font-black uppercase tracking-widest leading-none mb-1 ${isSoldOut ? "text-gray-400 dark:text-gray-600 line-through" : "text-gray-900 dark:text-white"}`}>
            {ticket.name}
          </h4>
          <p className="text-[9px] font-bold uppercase text-gray-500 dark:text-gray-400 tracking-tighter leading-tight line-clamp-1">
            {ticket.description || "Main Stage Entry"}
          </p>
        </div>
        <div className="text-right">
          <p className={`text-sm md:text-base font-black italic tracking-tighter ${isSoldOut ? "text-gray-400 dark:text-gray-600" : "text-neon-magenta"}`}>
            IDR {displayPrice}K
          </p>
          <span className={`text-[8px] font-black uppercase tracking-widest ${
            isSoldOut ? "text-red-500" : quota <= 5 ? "text-yellow-500" : "text-gray-400 dark:text-gray-500"
          }`}>
            {isSoldOut ? "Sold Out" : `${quota} Left`}
          </span>
        </div>
      </div>

      <div className="flex justify-between items-center mt-3 pt-3 border-t border-black/5 dark:border-white/10">
        <div className="flex items-center gap-1">
          {quantity > 0 && (
            <div className="flex items-center gap-1 animate-in fade-in slide-in-from-left-2 duration-300">
              <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan shadow-[0_0_8px_#00FFDD]"></div>
              <span className="text-[9px] font-black uppercase text-neon-cyan tracking-widest">Selected</span>
            </div>
          )}
          {!isSoldOut && isMaxReached && quantity > 0 && (
            <span className="text-[8px] font-black uppercase text-yellow-500 tracking-widest ml-1">
              (Max)
            </span>
          )}
        </div>

        <div className="flex items-center bg-black/5 dark:bg-[#1A1A1A] rounded-lg border border-black/5 dark:border-white/10 overflow-hidden">
          <button 
            type="button"
            onClick={onDecrease}
            className="w-7 h-7 flex items-center justify-center text-gray-900 dark:text-white font-black hover:bg-black/10 dark:hover:bg-white/10 transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
            disabled={quantity === 0 || isSoldOut}
          >
            -
          </button>
          <div className="w-8 flex items-center justify-center bg-black/5 dark:bg-[#2A2A2A]">
            <span className="text-xs font-black text-gray-900 dark:text-white">{quantity}</span>
          </div>
          <button 
            type="button"
            onClick={onIncrease}
            className={`w-7 h-7 flex items-center justify-center font-black transition-all ${
              isSoldOut || isMaxReached
                ? "text-gray-300 dark:text-gray-600 cursor-not-allowed"
                : "text-gray-900 dark:text-white hover:bg-neon-cyan hover:text-black"
            }`}
            disabled={isSoldOut || isMaxReached}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketSelectionCard;
