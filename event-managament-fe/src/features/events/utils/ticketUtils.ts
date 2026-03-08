"use client";

import { TicketType } from "../types/event.types";

export const normalizeTicketPrice = (price: string | number): number => {
  return typeof price === "string" ? Number(price) : price;
};

export const getTicketDisplayPrice = (price: number): string => {
  return (price / 1000).toFixed(0);
};

export const checkIsPopular = (name: string): boolean => {
  return name.toLowerCase().includes("vip");
};

export const getTicketStatus = (ticket: TicketType, quantity: number) => {
  const quota = ticket.quota ?? 0;
  const isSoldOut = quota <= 0;
  const isMaxReached = quantity >= quota;
  return { quota, isSoldOut, isMaxReached };
};
