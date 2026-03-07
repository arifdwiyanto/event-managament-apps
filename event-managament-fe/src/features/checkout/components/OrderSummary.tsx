"use client";

import React from "react";
import { Typography, Divider } from "@mui/material";
import { groupCartItemsByOrganizer } from "../../cart/utils/groupItems";

interface OrderSummaryProps {
  items: any[];
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({ items }) => {
  return (
    <div className="border-4 border-black dark:border-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)] bg-white dark:bg-[#0a0a0a]">
      <Typography
        variant="h5"
        className="font-display font-black uppercase mb-4 text-black dark:text-white"
      >
        Order Summary
      </Typography>
      <Divider className="border-black dark:border-white/20 border-[1.5px] mb-4" />

      <div className="space-y-8">
        {groupCartItemsByOrganizer(items).map((group) => (
          <div key={group.organizerId} className="space-y-4">
            <div className="flex items-center gap-2">
              <Typography className="font-display font-black uppercase text-[10px] tracking-widest text-neon-purple dark:text-neon-cyan whitespace-nowrap">
                EO: {group.organizerName}
              </Typography>
              <div className="h-[1px] flex-1 bg-black/10 dark:bg-white/10"></div>
            </div>

            <div className="space-y-4">
              {group.items.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div>
                    <Typography className="font-bold text-sm uppercase text-black dark:text-white">
                      {item.ticketType.event.name}
                    </Typography>
                    <Typography className="text-xs text-gray-400 uppercase">
                      {item.ticketType.name} x {item.quantity}
                    </Typography>
                  </div>
                  <Typography className="font-black text-black dark:text-white">
                    IDR {(Number(item.ticketType.price) * item.quantity).toLocaleString("id-ID")}
                  </Typography>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
