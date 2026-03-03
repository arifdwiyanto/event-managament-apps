"use client";

import React from "react";
import Link from "next/link";
import { ActiveEvent } from "../types";
import { useOrgRole } from "@/hooks/useOrgRole";

// Icons
const AddIcon = () => (
  <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
  </svg>
);

const ImageIcon = () => (
  <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
  </svg>
);

const statusStyles = {
  active: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  draft: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  selling: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
};

interface ActiveEventsListProps {
  events: ActiveEvent[];
  loading?: boolean;
}

const ActiveEventsList: React.FC<ActiveEventsListProps> = ({ events, loading = false }) => {
  const role = useOrgRole();
  const canCreate = role === "OWNER" || role === "ADMIN";

  return (
    <div className="bg-white dark:bg-[#221019] p-4 md:p-6 rounded-[24px] md:rounded-[32px] border border-[#f4f0f2] dark:border-[#3a1d2e] shadow-sm flex flex-col h-full min-h-0 overflow-hidden">
      <div className="flex items-center justify-between mb-4 md:mb-6 shrink-0">
        <h3 className="text-base md:text-lg font-bold text-[#181114] dark:text-white">Active Events</h3>
        <Link href="/dashboard/events" className="text-[10px] md:text-xs font-bold text-[#ee2b8c] hover:underline">
          View All
        </Link>
      </div>

      <div className="flex-1 flex flex-col gap-2 md:gap-3 overflow-y-auto pr-1 min-h-0 custom-scrollbar">
        {loading ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-2.5 md:gap-4 p-2 md:p-3 rounded-lg md:rounded-xl bg-[#f8f6f7] dark:bg-[#2a1621] animate-pulse h-16" />
          ))
        ) : (
          events.map((event) => (
            <div
              key={event.id}
              className="flex items-center gap-2.5 md:gap-3 p-2 rounded-lg md:rounded-xl bg-[#f8f6f7] dark:bg-[#2a1621] border border-transparent hover:border-[#e6dbe0] dark:hover:border-[#3a1d2e] transition-colors group cursor-pointer"
            >
              {/* Image */}
              <div className="size-10 md:size-10 rounded-lg bg-gray-200 dark:bg-gray-700 shrink-0 flex items-center justify-center overflow-hidden">
                {event.image ? (
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-400">
                    <ImageIcon />
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h4 className="text-xs md:text-sm font-bold text-[#181114] dark:text-white truncate">
                  {event.title}
                </h4>
                <p className="text-[10px] md:text-xs text-[#896175] mt-0.5 truncate">
                  {event.date} • {event.location}
                </p>
              </div>

              {/* Status */}
              <div className="text-right shrink-0">
                <span className={`inline-flex items-center px-1.5 md:px-2 py-0.5 rounded text-[9px] md:text-xs font-bold capitalize ${statusStyles[event.status]}`}>
                  {event.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {canCreate && (
        <button className="w-full mt-3 md:mt-4 py-2.5 md:py-3 border border-dashed border-[#ee2b8c]/40 text-[#ee2b8c] font-bold rounded-lg md:rounded-xl hover:bg-[#ee2b8c]/5 transition-colors flex items-center justify-center gap-1.5 md:gap-2 text-xs md:text-sm">
          <AddIcon /> Create New Event
        </button>
      )}
    </div>
  );
};

export default ActiveEventsList;
