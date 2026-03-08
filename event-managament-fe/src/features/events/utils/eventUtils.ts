"use client";

import { Event } from "../types/event.types";

export const formatEventDate = (date: string | Date | null | undefined): string => {
  if (!date) return "TBA";
  const d = new Date(date);
  return d
    .toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
    .toUpperCase();
};

export const formatEventTime = (date: string | Date | null | undefined): string => {
  if (!date) return "TBA";
  const d = new Date(date);
  return d
    .toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    })
    .toUpperCase();
};

export const formatEventLocation = (location: any): string => {
  if (!location) return "Venue TBA";
  return typeof location === "object" ? location.name : location;
};
