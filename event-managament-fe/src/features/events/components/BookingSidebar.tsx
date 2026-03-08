"use client";

import React from "react";
import { Event } from "../types/event.types";
import TicketSelectionCard from "./TicketSelectionCard";
import { ShoppingCartIcon, LockClosedIcon } from "@heroicons/react/24/solid";
import { useBookingSidebarLogic } from "../hooks";
import { Snackbar, Alert } from "@mui/material";

interface BookingSidebarProps {
  event: Event;
}

const BookingSidebar: React.FC<BookingSidebarProps> = ({ event }) => {
  const {
    quantities,
    handleUpdateQuantity,
    selectedTickets,
    total,
    cartLoading,
    snackbar,
    handleCloseSnackbar,
    handleAddToCart,
  } = useBookingSidebarLogic(event);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-10 duration-700">
      {/* Ticket Selection Area - Glass Container */}
      <div className="bg-white/70 dark:bg-[#131313]/90 backdrop-blur-xl rounded-3xl border border-black/5 dark:border-white/10 shadow-xl dark:shadow-2xl overflow-hidden relative group">
        {/* Decorative background blur */}
        <div className="absolute -top-10 -right-10 size-32 bg-neon-cyan/5 blur-[50px] rounded-full"></div>

        <div className="p-5 border-b border-black/5 dark:border-white/10 bg-black/5 dark:bg-black/40 flex items-center justify-between">
          <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-900 dark:text-white">
            Select Tickets
          </h3>
          <div className="px-2 py-0.5 rounded-full bg-neon-cyan/20 border border-neon-cyan/30 text-[9px] font-black text-neon-cyan uppercase">
            Live
          </div>
        </div>

        <div className="p-4 space-y-3 max-h-[450px] overflow-y-auto no-scrollbar relative z-10">
          {(event.ticketTypes || []).map((ticket) => (
            <TicketSelectionCard
              key={ticket.id}
              ticket={ticket}
              quantity={quantities[ticket.id] || 0}
              onIncrease={() => handleUpdateQuantity(ticket.id, 1)}
              onDecrease={() => handleUpdateQuantity(ticket.id, -1)}
            />
          ))}
          {(!event.ticketTypes || event.ticketTypes.length === 0) && (
            <div className="py-12 text-center space-y-3">
              <div className="inline-block p-4 rounded-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10">
                <ShoppingCartIcon className="size-8 text-gray-400 dark:text-white/20" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 font-bold uppercase text-[10px] tracking-widest">
                No tickets available
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Order Summary - Premium Glass Card */}
      <div className="bg-white/80 dark:bg-[#131313]/90 backdrop-blur-2xl rounded-3xl p-6 border border-black/5 dark:border-white/10 shadow-xl dark:shadow-[0_20px_60px_rgba(0,0,0,0.6)] relative group overflow-hidden">
        {/* Animated Background Accent */}
        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-neon-cyan to-transparent opacity-50"></div>

        <div className="flex items-center justify-between mb-6 border-b border-black/5 dark:border-white/10 pb-4">
          <h3 className="text-sm font-black uppercase tracking-[0.2em] text-gray-900 dark:text-white">
            Order Summary
          </h3>
          <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
            {selectedTickets.length} Items
          </span>
        </div>

        <div className="space-y-4 mb-8">
          {selectedTickets.map((t: any) => (
            <div
              key={t.id}
              className="flex justify-between items-center group/item"
            >
              <div className="space-y-0.5">
                <p className="font-black uppercase text-gray-900 dark:text-white text-xs tracking-tight">
                  {t.name}
                </p>
                <p className="text-[9px] font-bold text-neon-cyan uppercase tracking-widest">
                  Qty: {t.qty}
                </p>
              </div>
              <span className="font-black text-sm text-gray-600 dark:text-gray-300 tracking-tighter italic">
                IDR {((Number(t.price) * t.qty) / 1000).toFixed(0)}K
              </span>
            </div>
          ))}

          {selectedTickets.length === 0 && (
            <div className="py-2 flex items-center gap-3 text-gray-400 dark:text-gray-500">
              <div className="w-1.5 h-1.5 rounded-full bg-black/5 dark:bg-white/10"></div>
              <p className="font-bold uppercase text-[10px] tracking-widest leading-none">
                No tickets selected yet
              </p>
            </div>
          )}

          <div className="pt-6 mt-4 border-t border-black/5 dark:border-white/10 flex justify-between items-end">
            <div>
              <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest leading-none mb-2">
                Total Amount
              </p>
              <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter italic drop-shadow-sm dark:drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                IDR {(total / 1000).toFixed(0)}K
              </h2>
            </div>
          </div>
        </div>

        <button
          disabled={selectedTickets.length === 0 || cartLoading}
          onClick={handleAddToCart}
          className="relative w-full py-4 rounded-2xl bg-neon-cyan text-black font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(0,255,221,0.4)] active:scale-[0.98] disabled:opacity-20 disabled:grayscale disabled:cursor-not-allowed group/btn overflow-hidden"
        >
          <ShoppingCartIcon
            className="size-5 transition-transform group-hover/btn:-translate-y-1"
            strokeWidth={2.5}
          />
          {cartLoading ? "PROCESSING..." : "CONFIRM BOOKING"}

          {/* Shine effect on hover */}
          <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover/btn:animate-shine"></div>
        </button>

        <div className="mt-8 flex flex-col items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10">
            <LockClosedIcon className="size-3 text-neon-cyan" />
            <span className="font-black text-[8px] md:text-[9px] uppercase tracking-widest text-gray-500 dark:text-gray-400">
              Secure Checkout via HypePay
            </span>
          </div>

          <div className="flex gap-4 opacity-30 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-500">
            {/* Simple Logo Placeholder icons */}
            <div className="w-8 h-4 bg-gray-400 dark:bg-white/20 rounded-sm"></div>
            <div className="w-8 h-4 bg-gray-400 dark:bg-white/20 rounded-sm"></div>
            <div className="w-8 h-4 bg-gray-400 dark:bg-white/20 rounded-sm"></div>
          </div>
        </div>
      </div>

      {/* Snackbar Feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{
            width: "100%",
            borderRadius: "16px",
            border: "1px solid rgba(255,255,255,0.1)",
            backdropFilter: "blur(10px)",
            boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
            fontWeight: "900",
            textTransform: "uppercase",
            fontSize: "12px",
            letterSpacing: "0.1em",
            py: 2,
            px: 4,
            "&.MuiAlert-filledSuccess": {
              bgcolor: "rgba(0, 255, 221, 0.9)",
              color: "black",
            },
            "&.MuiAlert-filledError": {
              bgcolor: "rgba(255, 0, 85, 0.9)",
              color: "white",
            },
            "& .MuiAlert-icon": {
              color: snackbar.severity === "success" ? "black" : "white",
              fontSize: "20px",
            },
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default BookingSidebar;
