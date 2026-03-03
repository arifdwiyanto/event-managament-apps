"use client";

import React from "react";
import { 
  AdjustmentsHorizontalIcon, 
  MagnifyingGlassIcon, 
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";
import { EventFiltersReturn } from "../hooks/useEventFilters";

const EventFilters: React.FC<EventFiltersReturn> = ({
  searchValue,
  setSearchValue,
  currentCategoryId,
  currentDate,
  categories,
  isLoading,
  updateFilters,
  handleReset,
}) => {
  return (
    <aside className="w-full lg:w-80 flex-shrink-0 space-y-6 lg:space-y-8 lg:sticky lg:top-26 h-fit">
      {/* Filters Container */}
      <div className="bg-white dark:bg-[#0a0a0a] border-2 border-gray-200 dark:border-white/5 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.05)] dark:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.3)] transition-all rounded-2xl lg:rounded-none overflow-hidden">
        <div className="p-5 md:p-6 space-y-2">
          <div className="flex items-center justify-between mb-2 lg:mb-6">
            <h2 className="font-display font-black text-xl lg:text-xl uppercase tracking-wider flex items-center gap-2">
              <AdjustmentsHorizontalIcon className="size-6 text-neon-cyan" strokeWidth={3} />
              Filters
            </h2>
            <button 
              onClick={handleReset}
              className="text-[10px] font-black uppercase text-[#ee2b8c] hover:text-neon-cyan underline tracking-widest transition-colors"
            >
              Reset All
            </button>
          </div>

          {/* Search */}
          <div className="sm:block hidden space-y-2">
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Search Events</label>
            <div className="relative group">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-neon-cyan size-5 transition-colors" strokeWidth={2.5} />
              <input
                className="w-full bg-white dark:bg-black border-2 border-gray-200 dark:border-white/10 focus:border-neon-cyan focus:ring-0 pl-12 pr-4 py-3 text-xs font-bold placeholder:text-gray-400 uppercase tracking-wide text-foreground transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,0.05)]"
                placeholder="Search events..."
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Categories</label>
            <div className="grid grid-cols-2 gap-2 lg:gap-3">
              {isLoading ? (
                <div className="animate-pulse space-y-2 col-span-2 lg:col-span-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-10 bg-gray-100 dark:bg-white/5 w-full"></div>
                  ))}
                </div>
              ) : (
                categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => updateFilters("categoryId", currentCategoryId === cat.id ? undefined : cat.id)}
                    className={`flex items-center justify-between px-4 py-2 border-2 transition-all text-[10px] font-black uppercase tracking-widest ${
                      currentCategoryId === cat.id 
                        ? "border-neon-pink bg-neon-pink/5 text-neon-pink shadow-[4px_4px_0px_0px_rgba(238,43,140,0.2)]" 
                        : "border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-black/20 text-gray-500 hover:border-neon-cyan/50 hover:text-neon-cyan"
                    }`}
                  >
                    <span className="truncate">{cat.name}</span>
                    {currentCategoryId === cat.id && <div className="size-1.5 bg-neon-pink shadow-[0_0_8px_#ee2b8c]"></div>}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* When */}
          <div className="space-y-4">
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Event Date</label>
            <div className="relative group">
              <CalendarDaysIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-neon-purple size-4 transition-colors" strokeWidth={2} />
              <input
                className="w-full bg-gray-50 dark:bg-black border-2 border-gray-200 dark:border-white/5 focus:border-neon-purple focus:ring-0 pl-12 pr-4 py-3 text-xs font-bold uppercase text-foreground tracking-wide [color-scheme:light] dark:[color-scheme:dark] transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.02)]"
                type="date"
                value={currentDate}
                onChange={(e) => updateFilters("date", e.target.value)}
              />
            </div>
          </div>

          {/* Price Range */}
          {/* <div className="space-y-4 pt-2">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Budget</label>
              <span className="text-[10px] font-black text-neon-cyan">ANY</span>
            </div>
            <input
              className="w-full h-1.5 bg-gray-200 dark:bg-white/10 appearance-none cursor-pointer accent-neon-cyan rounded-full"
              max="2000000"
              min="0"
              type="range"
            />
            <div className="flex justify-between text-[8px] font-black text-gray-400 uppercase tracking-tighter">
              <span>0</span>
              <span>1M</span>
              <span>2M+</span>
            </div>
          </div> */}
        </div>
      </div>

      {/* Refer Card - Desktop Only or adapt for mobile */}
      <div className="block p-6  bg-black text-white dark:bg-white dark:text-black relative overflow-hidden group transition-all border-2 border-transparent hover:border-neon-purple shadow-[8px_8px_0px_0px_#ee2b8c]">
        <div className="absolute top-0 right-0 w-32 h-32 bg-neon-purple/20 blur-3xl animate-pulse"></div>
        <h3 className="font-display font-black text-lg sm:text-xl uppercase leading-none mb-4 italic">
          Get <span className="text-neon-pink">10K</span> Points?
        </h3>
        <p className="text-[8px] sm:text-[10px] font-bold uppercase tracking-widest opacity-60 mb-6 leading-relaxed">
          Invite your squad and both vibe with extra discounts.
        </p>
        <button className="w-full py-2 sm:py-4 bg-[#ee2b8c] text-white text-[10px] font-black uppercase tracking-widest hover:bg-neon-purple transition-all translate-y-0 hover:-translate-y-1 active:translate-y-0">
          Send Invitation
        </button>
      </div>
    </aside>
  );
};

export default EventFilters;
