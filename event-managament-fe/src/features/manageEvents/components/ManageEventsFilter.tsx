import { CheckCircleIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import * as React from "react";

interface ManageEventsFilterProps {
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  dateRange: string;
  setDateRange: (range: string) => void;
  location: string;
  setLocation: (loc: string) => void;
}

const statusOptions = [
  { id: "all", label: "All Events" },
  { id: "active", label: "Active" },
  { id: "draft", label: "Draft" },
  { id: "completed", label: "Completed" },
  { id: "sold-out", label: "Sold Out" },
];

const ManageEventsFilter: React.FC<ManageEventsFilterProps> = ({
  statusFilter,
  setStatusFilter,
  dateRange,
  setDateRange,
  location,
  setLocation,
}) => {
  return (
    <aside className="w-full lg:w-64 xl:w-72 flex-shrink-0 bg-white dark:bg-[#111] rounded-2xl md:rounded-3xl p-5 md:p-6 shadow-sm border border-gray-100 dark:border-white/5 lg:sticky top-8 self-start">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-black font-display tracking-tight text-foreground">
          Filters
        </h2>
        <button
          onClick={() => {
            setStatusFilter("all");
            setDateRange("upcming");
            setLocation("all");
          }}
          className="text-xs font-bold text-neon-pink hover:text-[#d6197b] transition-colors uppercase tracking-widest"
        >
          Reset
        </button>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <label className="text-xs font-black uppercase tracking-widest text-gray-500 block mb-2">
            Status
          </label>
          <div className="space-y-2">
            {statusOptions.map((status) => {
              const isActive = statusFilter === status.id;
              return (
                <button
                  key={status.id}
                  onClick={() => setStatusFilter(status.id)}
                  className={`w-full flex items-center gap-3 py-1.5 px-2 rounded-lg transition-colors text-left ${
                    isActive
                      ? "bg-neon-pink/10 dark:bg-neon-pink/5"
                      : "hover:bg-gray-50 dark:hover:bg-white/5"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                      isActive
                        ? "text-neon-pink"
                        : "border-2 border-gray-300 dark:border-gray-600"
                    }`}
                  >
                    {isActive && <CheckCircleIcon className="w-5 h-5" />}
                  </div>
                  <span
                    className={`text-sm font-bold ${
                      isActive
                        ? "text-foreground"
                        : "text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    {status.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Date Range Dropdown */}
        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-gray-500 block">
            Date Range
          </label>
          <div className="relative">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full appearance-none bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-sm font-bold text-foreground focus:ring-2 focus:ring-neon-pink focus:outline-none focus:border-neon-pink transition-colors pr-10 cursor-pointer"
            >
              <option value="upcoming">Upcoming</option>
              <option value="past">Past</option>
              <option value="this-week">This Week</option>
              <option value="this-month">This Month</option>
            </select>
            <ChevronDownIcon className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Location Dropdown */}
        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-gray-500 block">
            Location
          </label>
          <div className="relative">
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full appearance-none bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-sm font-bold text-foreground focus:ring-2 focus:ring-neon-pink focus:outline-none focus:border-neon-pink transition-colors pr-10 cursor-pointer"
            >
              <option value="all">All Locations</option>
              <option value="jakarta">Jakarta</option>
              <option value="bali">Bali</option>
              <option value="bandung">Bandung</option>
              <option value="online">Online</option>
            </select>
            <ChevronDownIcon className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>
    </aside>
  );
};

export default ManageEventsFilter;
