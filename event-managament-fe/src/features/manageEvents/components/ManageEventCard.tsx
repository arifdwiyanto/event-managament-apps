import React from "react";
import Image from "next/image";
import {
  CalendarIcon,
  MapPinIcon,
  PencilIcon,
  ChartBarIcon,
  TicketIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";

import { ManageEventItem } from "../types/manageEvent.types";

interface ManageEventCardProps {
  event: ManageEventItem;
}

const statusConfig = {
  active: {
    label: "Active",
    color: "text-green-500",
    bg: "bg-green-500/10",
    border: "border-green-500/20",
  },
  draft: {
    label: "Draft",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
  },
  completed: {
    label: "Completed",
    color: "text-gray-500",
    bg: "bg-gray-100 dark:bg-white/10",
    border: "border-gray-200 dark:border-white/10",
  },
  "sold-out": {
    label: "Sold Out",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
  },
};

const ManageEventCard: React.FC<ManageEventCardProps> = ({ event }) => {
  const status = statusConfig[event.status] ?? statusConfig.active;

  const progressPercentage =
    event.totalTickets > 0
      ? Math.min(
          Math.round((event.ticketsSold / event.totalTickets) * 100),
          100,
        )
      : 0;

  let progressColor = "bg-neon-pink";
  if (progressPercentage >= 100) progressColor = "bg-purple-500";
  else if (progressPercentage === 0)
    progressColor = "bg-gray-200 dark:bg-gray-700";

  return (
    <div className="flex flex-col md:flex-row gap-5 p-4 md:p-6 bg-white dark:bg-[#111] border border-gray-100 dark:border-white/5 rounded-2xl md:rounded-3xl shadow-sm hover:shadow-md transition-shadow">
      {/* Event Image */}
      <div className="relative w-full md:w-56 h-40 md:h-auto rounded-xl md:rounded-2xl overflow-hidden bg-gray-100 dark:bg-white/5 flex-shrink-0 flex items-center justify-center">
        {event.image ? (
          <Image
            src={event.image}
            alt={event.title || "Event Type"}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-400">
            <EyeIcon className="w-8 h-8 md:w-10 md:h-10 opacity-20" />
          </div>
        )}

        {/* Category Badge */}
        <div className="absolute top-3 left-3 px-2 py-1 bg-white dark:bg-black uppercase tracking-wider text-[10px] font-black rounded text-foreground shadow-sm">
          {event.category}
        </div>
      </div>

      {/* Event Info */}
      <div className="flex-1 flex flex-col justify-between pt-1">
        <div>
          <div className="flex justify-between items-start gap-4 mb-2">
            <h3 className="text-lg md:text-xl font-black font-display tracking-tight text-foreground line-clamp-1">
              {event.title}
            </h3>

            {/* Status Badge */}
            <span
              className={`px-3 py-1 text-xs font-bold rounded-full border flex-shrink-0 ${status.bg} ${status.color} ${status.border}`}
            >
              ● {status.label}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-6 text-xs md:text-sm font-medium text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1.5">
              <CalendarIcon className="w-4 h-4" />
              {event.date}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPinIcon className="w-4 h-4" />
              {event.location}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          {/* Ticket Progress */}
          <div className="flex-1 max-w-sm">
            <div className="flex justify-between items-center text-xs font-bold mb-2">
              <span className="text-gray-500 uppercase tracking-widest text-[10px]">
                Tickets Sold
              </span>
              <span>
                <span className="text-neon-pink">
                  {event.ticketsSold.toLocaleString()}
                </span>
                <span className="text-gray-400 font-medium">
                  {" "}
                  / {event.totalTickets.toLocaleString()}
                </span>
              </span>
            </div>

            <div className="w-full h-2 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${progressColor}`}
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 md:gap-3">
            <button
              className="p-2 md:p-2.5 text-gray-400 hover:text-foreground hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors"
              title="Edit Event"
            >
              <PencilIcon className="w-5 h-5" />
            </button>
            <button
              className="p-2 md:p-2.5 text-gray-400 hover:text-foreground hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors"
              title="View Analytics"
            >
              <ChartBarIcon className="w-5 h-5" />
            </button>

            {/* Primary Action */}
            {event.status === "completed" ? (
              <button
                disabled
                className="ml-2 flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-white/5 text-gray-400 rounded-full text-sm font-bold cursor-not-allowed"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  ></path>
                </svg>
                Archived
              </button>
            ) : (
              <button className="ml-2 flex items-center gap-2 px-5 py-2.5 bg-foreground text-background dark:bg-white dark:text-black rounded-full text-sm font-bold hover:bg-neon-pink hover:text-white dark:hover:bg-neon-pink transition-colors">
                <TicketIcon className="w-5 h-5 flex-shrink-0" />
                Manage Tickets
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageEventCard;
