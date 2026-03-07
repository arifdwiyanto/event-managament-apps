"use client";

import React from "react";
import { Typography, Divider } from "@mui/material";
import { groupCartItemsByOrganizer } from "../../cart/utils/groupItems";

import { GroupedCartItems, GroupedEvent } from "../../cart/utils/groupItems";

interface OrderSummaryProps {
  group: GroupedCartItems;
  appliedPromo: any;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({ group, appliedPromo }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Typography className="font-display font-black uppercase text-[10px] tracking-widest text-neon-purple dark:text-neon-cyan whitespace-nowrap">
            EO: {group.organizerName}
          </Typography>
          <div className="h-[1px] w-12 bg-black/10 dark:bg-white/10"></div>
        </div>
        {appliedPromo && (
          <Typography className="font-black uppercase text-[10px] text-neon-cyan bg-black px-2 py-0.5 border border-neon-cyan">
            Promo: {appliedPromo.code}
          </Typography>
        )}
      </div>

      <div className="space-y-8">
        {group.eventGroups.map((eventGroup: GroupedEvent) => (
          <div key={eventGroup.eventId} className="space-y-3">
            <Typography className="font-display font-bold text-xs uppercase text-gray-400 tracking-wider">
              {eventGroup.eventName}
            </Typography>
            
            <div className="space-y-4 pl-4 border-l-2 border-black/5 dark:border-white/5">
              {eventGroup.items.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div>
                    <Typography className="font-bold text-sm uppercase text-black dark:text-white">
                      {item.ticketType.name}
                    </Typography>
                    <Typography className="text-[10px] text-gray-400 uppercase font-bold">
                      QTY: {item.quantity}
                    </Typography>
                  </div>
                  <Typography className="font-black text-black dark:text-white text-sm">
                    IDR {(Number(item.ticketType.price) * item.quantity).toLocaleString("id-ID")}
                  </Typography>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      {appliedPromo && (
        <div className="flex justify-between items-center pt-4 border-t border-dashed border-black/10 dark:border-white/10">
          <Typography className="text-xs font-black uppercase text-neon-cyan">
            Group Discount applied
          </Typography>
          <Typography className="font-black text-neon-cyan">
            - IDR {appliedPromo.discount.toLocaleString("id-ID")}
          </Typography>
        </div>
      )}
    </div>
  );
};
