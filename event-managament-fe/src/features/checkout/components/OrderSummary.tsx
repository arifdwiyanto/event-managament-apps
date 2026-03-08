"use client";

import React from "react";
import { Typography } from "@mui/material";
import StorefrontIcon from "@mui/icons-material/Storefront";

import { GroupedCartItems, GroupedEvent } from "../../cart/utils/groupItems";
import { AppliedPromo } from "../types/checkout.types";

interface OrderSummaryProps {
  group: GroupedCartItems;
  appliedPromos: Record<string, AppliedPromo>;
  renderPromoSelector?: (eventGroup: GroupedEvent) => React.ReactNode;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  group,
  appliedPromos,
  renderPromoSelector,
}) => {
  return (
    <div className="space-y-6">
      {/* Organizer header */}
      <div className="flex items-center gap-3 pb-4 border-b border-gray-100 dark:border-zinc-800">
        <div className="w-8 h-8 rounded-lg bg-neon-purple/10 dark:bg-neon-purple/20 flex items-center justify-center">
          <StorefrontIcon className="text-neon-purple" sx={{ fontSize: 18 }} />
        </div>
        <div>
          <Typography className="font-black uppercase text-xs tracking-wider text-gray-900 dark:text-white">
            {group.organizerName}
          </Typography>
          <Typography className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
            Event Organizer
          </Typography>
        </div>
      </div>

      {/* Event groups */}
      <div className="space-y-8">
        {group.eventGroups.map((eventGroup: GroupedEvent) => {
          const promo = appliedPromos[eventGroup.eventId] || null;

          // Calculate event subtotal
          const eventSubtotal = eventGroup.items.reduce(
            (sum, item) => sum + Number(item.ticketType.price) * item.quantity,
            0,
          );

          return (
            <div key={eventGroup.eventId}>
              {/* Event name */}
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan dark:bg-[#00FFFF]" />
                <Typography className="font-bold text-sm uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  {eventGroup.eventName}
                </Typography>
              </div>

              {/* Ticket items */}
              <div className="space-y-3 ml-4">
                {eventGroup.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center py-3 px-4 rounded-lg bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-zinc-800/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-neon-purple/10 dark:bg-neon-purple/20 flex items-center justify-center">
                        <span className="font-black text-sm text-neon-purple">
                          {item.quantity}x
                        </span>
                      </div>
                      <div>
                        <Typography className="font-bold text-sm text-gray-900 dark:text-white">
                          {item.ticketType.name}
                        </Typography>
                        <Typography className="text-[11px] text-gray-400 dark:text-gray-500 font-medium">
                          IDR {Number(item.ticketType.price).toLocaleString("id-ID")} / ticket
                        </Typography>
                      </div>
                    </div>
                    <Typography className="font-black text-sm text-gray-900 dark:text-white">
                      IDR{" "}
                      {(
                        Number(item.ticketType.price) * item.quantity
                      ).toLocaleString("id-ID")}
                    </Typography>
                  </div>
                ))}
              </div>

              {/* Event subtotal */}
              <div className="flex justify-between items-center ml-4 mt-3 px-4 py-2">
                <Typography className="text-xs font-bold uppercase text-gray-400 dark:text-gray-500 tracking-wider">
                  Event Subtotal
                </Typography>
                <Typography className="text-sm font-black text-gray-700 dark:text-gray-300">
                  IDR {eventSubtotal.toLocaleString("id-ID")}
                </Typography>
              </div>

              {/* Event discount line */}
              {promo && (
                <div className="flex justify-between items-center ml-4 px-4 py-2 rounded-lg bg-[#00bcd4]/5 dark:bg-[#00FFFF]/5 border border-[#00bcd4]/20 dark:border-[#00FFFF]/20">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">🏷️</span>
                    <Typography className="text-xs font-black uppercase text-[#00897b] dark:text-[#00FFFF]">
                      Promo: {promo.code}
                    </Typography>
                  </div>
                  <Typography className="font-black text-sm text-[#00897b] dark:text-[#00FFFF]">
                    - IDR {promo.discount.toLocaleString("id-ID")}
                  </Typography>
                </div>
              )}

              {/* Promo selector trigger — rendered right below each event */}
              <div className="ml-4 mt-2">
                {renderPromoSelector && renderPromoSelector(eventGroup)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
