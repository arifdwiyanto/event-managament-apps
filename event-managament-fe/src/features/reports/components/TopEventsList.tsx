"use client";

import React from "react";
import { PhotoIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { useTopEvents } from "../hooks/useReports";
import { formatCurrency } from "@/utils/formatCurrency";

type Props = { categoryId?: string; startDate?: string; endDate?: string };

export const TopEventsList: React.FC<Props> = ({ categoryId, startDate, endDate }) => {
  const { data: events, isLoading } = useTopEvents(5, categoryId, startDate, endDate);

  return (
    <div className="bg-white dark:bg-[#221019] p-4 md:p-6 rounded-xl md:rounded-2xl border border-[#f4f0f2] dark:border-[#3a1d2e] shadow-sm flex flex-col h-full">
      <h3 className="text-sm md:text-lg font-bold text-[#181114] dark:text-white mb-4 md:mb-6">Top Events</h3>
      
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <span className="loading loading-spinner text-primary"></span>
        </div>
      ) : !events || events.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-[#896175] text-sm">
          No top events found.
        </div>
      ) : (
        <div className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
          {events.map((event: any, index: number) => (
            <div key={event.id} className={`flex items-center gap-4 ${index > 2 ? 'opacity-75' : ''}`}>
               {/* 
                 For now using a placeholder icon or random colors, 
                 in reality you'd show event.thumbnail if it exists in your data 
               */}
              <div className="size-10 rounded-lg bg-gray-100 dark:bg-gray-800 shrink-0 flex items-center justify-center overflow-hidden">
                {index === 0 ? (
                  <SparklesIcon className="w-5 h-5 text-yellow-500" />
                ) : (
                  <PhotoIcon className="w-5 h-5 text-gray-400" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold truncate dark:text-white">{event.name}</h4>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[10px] text-[#896175] font-bold">
                    {event.ticketsSold} tickets
                  </span>
                  <span className="size-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                  <span className="text-[10px] text-green-500 font-bold">
                    {formatCurrency(event.totalRevenue)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Optional: Add Link to proper events list if needed */}
      <button className="w-full mt-6 py-2 bg-[#f8f6f7] dark:bg-[#2a1621] text-xs font-bold rounded-xl hover:bg-gray-100 dark:hover:bg-[#361e2b] transition-colors dark:text-gray-300">
        View Full Rankings
      </button>
    </div>
  );
};
