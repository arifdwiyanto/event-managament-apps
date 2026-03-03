"use client";

import { useState } from "react";
import { Event } from "../types/event.types";

export const useBookingSidebar = (event: Event) => {
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const handleUpdateQuantity = (ticketId: string, delta: number) => {
    setQuantities((prev) => ({
      ...prev,
      [ticketId]: Math.max(0, (prev[ticketId] || 0) + delta),
    }));
  };

  const selectedTickets = (event.ticketTypes || []).map(tt => ({
    ...tt,
    qty: quantities[tt.id] || 0
  })).filter(t => t.qty > 0);

  const subtotal = selectedTickets.reduce((acc, t) => {
    const price = typeof t.price === 'string' ? Number(t.price) : t.price;
    return acc + (price * t.qty);
  }, 0);

  const bookingFee = subtotal > 0 ? 15000 : 0;
  const total = subtotal + bookingFee;

  return {
    quantities,
    handleUpdateQuantity,
    selectedTickets,
    subtotal,
    bookingFee,
    total,
  };
};
