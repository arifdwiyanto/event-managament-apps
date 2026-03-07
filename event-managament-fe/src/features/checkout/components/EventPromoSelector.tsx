"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getEventPromotions, EventPromotion } from "@/features/promotions/services/promotionService";
import { AppliedPromo } from "../types/checkout.types";
import { formatDate } from "@/utils/dateUtils";

interface EventPromoSelectorProps {
  eventId: string;
  eventName: string;
  organizerId: string;
  appliedPromo: AppliedPromo | null;
  eventSubtotal: number;
  onApply: (organizerId: string, promo: AppliedPromo) => void;
  onRemove: (organizerId: string) => void;
}

export const EventPromoSelector: React.FC<EventPromoSelectorProps> = ({
  eventId,
  eventName,
  organizerId,
  appliedPromo,
  eventSubtotal,
  onApply,
  onRemove,
}) => {
  const { data: promotions = [], isLoading } = useQuery({
    queryKey: ["eventPromotions", eventId],
    queryFn: () => getEventPromotions(eventId),
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) {
    return (
      <div className="h-10 bg-gray-100 dark:bg-zinc-800 animate-pulse rounded" />
    );
  }

  if (promotions.length === 0) return null;

  const handleSelect = (promo: EventPromotion) => {
    if (appliedPromo?.id === promo.id) {
      onRemove(organizerId);
      return;
    }
    let discount = 0;
    if (promo.discountPercentage) {
      discount = (eventSubtotal * promo.discountPercentage) / 100;
    } else if (promo.discountAmount) {
      discount = promo.discountAmount;
    }
    onApply(organizerId, {
      id: promo.id,
      code: promo.code,
      discount,
      eventId,
      discountPercentage: promo.discountPercentage,
      discountAmount: promo.discountAmount,
    });
  };

  return (
    <div className="mt-4">
      <p className="font-black text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-3">
        🏷️ Available Promos — {eventName}
      </p>
      <div className="grid grid-cols-1 gap-2">
        {promotions.map((promo) => {
          const isSelected = appliedPromo?.id === promo.id;
          const isFull = promo.remaining !== null && promo.remaining <= 0;
          return (
            <button
              key={promo.id}
              disabled={isFull && !isSelected}
              onClick={() => handleSelect(promo)}
              className={`w-full text-left p-3 border-2 transition-all flex items-center justify-between gap-3 group
                ${isSelected
                  ? "border-[#00FFFF] bg-[#00FFFF]/10 dark:bg-[#00FFFF]/5 shadow-[2px_2px_0_0_#00FFFF]"
                  : isFull
                  ? "border-gray-200 dark:border-zinc-700 opacity-50 cursor-not-allowed bg-white dark:bg-black"
                  : "border-gray-300 dark:border-zinc-700 bg-white dark:bg-black hover:border-[#a855f7] dark:hover:border-[#a855f7] hover:shadow-[2px_2px_0_0_#a855f7]"
                }`}
            >
              <div className="min-w-0">
                <p className={`font-black text-sm uppercase truncate ${isSelected ? "text-[#00bcd4] dark:text-[#00FFFF]" : "text-gray-900 dark:text-white"}`}>
                  {promo.name}
                  <span className="ml-2 font-mono text-xs font-bold text-gray-400 dark:text-gray-500 lowercase">
                    ({promo.code})
                  </span>
                </p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase mt-0.5">
                  Exp: {formatDate(promo.endDate)}
                  {promo.remaining !== null && ` · ${promo.remaining} left`}
                </p>
              </div>
              <span className={`shrink-0 font-black text-sm px-2 py-0.5 border-2 transition-all
                ${isSelected
                  ? "bg-[#00FFFF] border-[#00FFFF] text-black"
                  : "bg-white dark:bg-black border-[#a855f7] text-[#a855f7] group-hover:bg-[#a855f7] group-hover:text-white"
                }`}
              >
                {promo.discountPercentage ? `-${promo.discountPercentage}%` : `-Rp ${promo.discountAmount?.toLocaleString("id-ID")}`}
              </span>
            </button>
          );
        })}
      </div>
      {appliedPromo && (
        <button
          onClick={() => onRemove(organizerId)}
          className="mt-2 text-[10px] font-bold uppercase text-red-500 hover:underline"
        >
          Remove promo
        </button>
      )}
    </div>
  );
};
