"use client";

import { Event } from "../types/event.types";
import { getContrastColor, hexToRgba } from "@/utils/colorUtils";

export const useEventCard = (event: Event) => {
  // Process category color
  const hexColor = event?.category?.color || "#ee2b8c";
  const isHex = hexColor.startsWith("#");
  
  const badgeColor = hexColor;
  const badgeTextColor = getContrastColor(hexColor);
  
  // Custom shadow style
  const shadowRgba = isHex ? hexToRgba(hexColor, 0.4) : "rgba(0,0,0,0.1)";
  const shadowStyle = {
    "--hover-shadow": `0 10px 40px -10px ${shadowRgba}`,
  } as React.CSSProperties;

  const displayTitle = event.title || event.name || "Untitled";

  const start = event.startDate
    ? new Date(event.startDate)
    : event.startDateObj || null;

  const displayDate =
    event.date ||
    (start
      ? start.toLocaleDateString("id-ID", {
          weekday: "short",
          month: "short",
          day: "numeric",
        })
      : "");
  
  const displayTime =
    event.time ||
    (start
      ? start.toLocaleTimeString("id-ID", {
          hour: "numeric",
          minute: "numeric",
          hour12: false,
        })
      : "");

  const displayLocation = event.location?.name || event.location || "";

  const currency = event.currency || "IDR";

  const resolvedPrice = (() => {
    if (typeof event.price === "number") return event.price;
    if (event.ticketTypes && Array.isArray(event.ticketTypes)) {
      const prices = event.ticketTypes.map((t) =>
        typeof t.price === "string" ? Number(t.price) : Number(t.price || 0),
      );
      return prices.length ? Math.min(...prices) : 0;
    }
    if (typeof event.price === "string") return Number(event.price) || 0;
    return 0;
  })();

  const isFree = event.isFree ?? resolvedPrice === 0;

  const formatPrice = (price: number, currencyStr: string) => {
    if (isFree) return "FREE";
    return `${currencyStr} ${(price / 1000).toFixed(0)}K`;
  };

  const imageSrc =
    event.image ||
    event.imageUrl ||
    event.category?.thumbnail ||
    event.category?.icon ||
    "/placeholder.jpg";

  return {
    badgeColor,
    badgeTextColor,
    shadowStyle,
    displayTitle,
    displayDate,
    displayTime,
    displayLocation,
    resolvedPrice,
    currency,
    isFree,
    formatPrice,
    imageSrc,
  };
};
