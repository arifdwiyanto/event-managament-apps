"use client";

import React from "react";
import { useEventDetail } from "../hooks/useEventDetail";
import EventHeroSection from "./EventHeroSection";
import EventInfoSection from "./EventInfoSection";
import EventAboutSection from "./EventAboutSection";
import BookingSidebar from "./BookingSidebar";
import EventDetailSkeleton from "./EventDetailSkeleton";
import { StarIcon, UserIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

interface EventDetailViewProps {
  eventId: string;
}

const EventDetailView: React.FC<EventDetailViewProps> = ({ eventId }) => {
  const { event, isLoading, error } = useEventDetail(eventId);

  if (isLoading) {
    return <EventDetailSkeleton />;
  }

  if (error || !event) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center flex-col gap-8">
        <div className="text-4xl font-black uppercase text-neon-magenta text-center">
          {error || "Event Not Found"}
        </div>
        <button 
          onClick={() => window.location.href = '/'}
          className="brutalist-button px-8 py-4 bg-white text-black text-xl"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <main className="pt-6 pb-16 px-4 lg:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Content */}
        <div className="lg:col-span-8 space-y-10 group/content">
          {/* Hero Image */}
          <EventHeroSection event={event} />
          
          {/* Event Basic Info */}
          <EventInfoSection event={event} />
          
          {/* Tabs and About */}
          <EventAboutSection event={event} />

          {/* Organizer & Reviews - Glass Style */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white/70 dark:bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-black/5 dark:border-white/10 shadow-xl dark:shadow-2xl">
              <h3 className="text-xl font-black uppercase mb-6 text-neon-cyan tracking-widest flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-neon-cyan shadow-[0_0_8px_#00FFDD]"></div>
                Organizer
              </h3>
              <Link href={`/organizer/${event.organizerId}`} className="flex items-center gap-5 hover:opacity-80 transition-opacity">
                <div className="size-16 rounded-xl bg-gradient-to-br from-neon-purple to-neon-magenta flex items-center justify-center border border-white/20 shadow-xl overflow-hidden relative group/org">
                  <div className="absolute inset-0 bg-black/20 group-hover/org:bg-transparent transition-colors"></div>
                  <span className="font-black text-xl text-white relative z-10 drop-shadow-md">
                    {event.organizer?.name?.substring(0, 4).toUpperCase() || "NEON"}
                  </span>
                </div>
                <div>
                   <h4 className="text-lg md:text-xl font-black uppercase text-gray-900 dark:text-white tracking-tight leading-none mb-1 group-hover/org:text-neon-cyan transition-colors">
                     {event.organizer?.name || "Organizer Name"}
                   </h4>
                   <p className="text-[10px] md:text-xs font-bold uppercase text-gray-500 dark:text-gray-400 tracking-widest flex items-center gap-1.5">
                     <span className="text-neon-cyan">★</span> Verified Partner • 4.8 Rating
                   </p>
                 </div>
              </Link>
            </div>
            
            <div className="bg-gradient-to-br from-neon-cyan/10 to-neon-purple/10 dark:from-neon-cyan/20 dark:to-neon-purple/20 backdrop-blur-xl rounded-2xl p-8 border border-black/5 dark:border-white/20 shadow-xl dark:shadow-2xl relative overflow-hidden group/review">
              <div className="absolute -top-10 -right-10 size-32 bg-neon-cyan/10 blur-[50px]"></div>
              
              <h3 className="text-xl font-black uppercase mb-6 flex justify-between items-center text-gray-900 dark:text-white tracking-widest">
                Reviews
                <span className="flex items-center gap-1 text-neon-cyan text-sm">
                  <StarIcon className="size-4 text-neon-cyan drop-shadow-[0_0_5px_#00FFDD]" /> 4.9
                </span>
              </h3>
              
              <div className="flex gap-4 items-center">
                <div className="size-12 rounded-full bg-black/5 dark:bg-white/10 border border-black/5 dark:border-white/20 shrink-0 flex items-center justify-center overflow-hidden">
                    <UserIcon className="size-6 text-gray-400 dark:text-white/50" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold uppercase leading-tight italic text-gray-800 dark:text-white tracking-tight">
                    "Absolutely insane experience! The vibes were unmatched."
                  </p>
                  <p className="text-[10px] font-black text-neon-cyan/60 dark:text-neon-cyan/60 uppercase tracking-widest">— Happy Hopper</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Sticky */}
        <div className="lg:col-span-4 sticky top-28 self-start hidden lg:block">
          <BookingSidebar event={event} />
        </div>
        
        {/* Mobile Booking Bar - Optional or keep as is? User just said sticky top. 
            Usually on mobile it's not sticky top but sticky bottom or just normal.
            Let's keep the existing desktop sticky view for now as requested. */}
        <div className="lg:hidden">
          <BookingSidebar event={event} />
        </div>
      </div>
    </main>
  );
};

export default EventDetailView;
