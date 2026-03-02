"use client";

import React from "react";
import Image from "next/image";
import { usePublicOrganizerProfile } from "../hooks/usePublicOrganizerProfile";
import { useEvents } from "@/features/events/hooks/useEvents";
import EventCard from "@/features/events/components/EventCard";
import { 
  CheckBadgeIcon, 
  MapPinIcon, 
  GlobeAltIcon,
  CalendarDaysIcon
} from "@heroicons/react/24/solid";

const PublicOrganizerView = ({ id }: { id: string }) => {
  const { data: organizer, loading: orgLoading, error: orgError } = usePublicOrganizerProfile(id);
  
  console.log("Organizer Data:", organizer);
  console.log("Organizer Error:", orgError);
  console.log("Organizer Loading:", orgLoading);

  // Fetch events for this specific organizer
  const { events, isLoading: eventsLoading } = useEvents({ organizerId: id, limit: 12 });

  if (orgLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-neon-cyan border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">Loading Organizer...</p>
      </div>
    );
  }

  if (orgError || !organizer) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-3xl font-black uppercase text-neon-magenta mb-4">Organizer Not Found</h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-md">We couldn't find the organizer you're looking for. They may have been removed or the link is broken.</p>
        <button 
          onClick={() => window.location.href = '/'}
          className="mt-8 px-6 py-3 bg-neon-cyan text-black font-black uppercase tracking-widest text-sm rounded-xl hover:scale-105 transition-transform"
        >
          Return Home
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-black min-h-screen text-gray-900 dark:text-white font-body selection:bg-neon-cyan/30 flex flex-col overflow-x-hidden">
      
      <main className="flex-1 w-full pt-20">
        {/* Organizer Header Hero */}
        <div className="relative w-full h-[300px] md:h-[400px] bg-gradient-to-br from-gray-900 to-black overflow-hidden flex items-end pb-12 pt-28">
          {/* Abstract background shapes */}
          <div className="absolute top-0 right-0 w-full h-full opacity-40">
             <div className="absolute top-1/4 right-1/4 size-[40vw] bg-neon-cyan/20 blur-[100px] rounded-full mix-blend-screen"></div>
             <div className="absolute bottom-1/4 left-1/4 size-[50vw] bg-neon-purple/20 blur-[120px] rounded-full mix-blend-screen"></div>
          </div>
          
          <div className="backdrop-blur-sm absolute inset-0 bg-black/40"></div>
          
          <div className="container mx-auto px-4 md:px-8 relative z-10">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8">
              {/* Logo Profile */}
              <div className="size-32 md:size-48 rounded-3xl bg-white dark:bg-[#131313] shadow-2xl overflow-hidden border-4 border-white dark:border-white/10 shrink-0 relative flex items-center justify-center">
                {organizer.logoUrl || organizer.logo ? (
                  <Image 
                    src={organizer.logoUrl || organizer.logo} 
                    alt={organizer.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-neon-purple to-neon-magenta flex flex-col items-center justify-center text-white">
                    <span className="font-black text-5xl md:text-7xl drop-shadow-lg">
                      {organizer.name?.substring(0, 1).toUpperCase() || "O"}
                    </span>
                  </div>
                )}
              </div>
              
              {/* Organizer Info */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                  <h1 className="text-3xl md:text-5xl font-black uppercase text-white tracking-tighter drop-shadow-md">
                    {organizer.name}
                  </h1>
                  <CheckBadgeIcon className="size-6 md:size-8 text-neon-cyan drop-shadow-[0_0_8px_rgba(0,255,221,0.5)]" />
                </div>
                
                <p className="text-gray-300 font-medium text-sm md:text-base max-w-2xl mb-6 line-clamp-3">
                  {organizer.description || "Official verified event partner on Hype. Bringing you the best and most exclusive events across the city."}
                </p>
                
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-neon-cyan bg-neon-cyan/10 px-3 py-1.5 rounded-full border border-neon-cyan/20">
                    <div className="w-1.5 h-1.5 bg-neon-cyan rounded-full animate-pulse shadow-[0_0_8px_#00FFDD]"></div>
                    Verified Partner
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-gray-300 bg-white/10 px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-md">
                    <CalendarDaysIcon className="size-4" />
                    {events.length} Events Organized
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Events Grid Section */}
        <div className="container mx-auto px-4 md:px-8 py-16 md:py-24">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-black uppercase tracking-tighter text-gray-900 dark:text-white mb-2">
                All Events <span className="text-neon-cyan italic">by {organizer.name}</span>
              </h2>
              <p className="text-sm font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
                Discover thrilling experiences
              </p>
            </div>
          </div>

          {eventsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-[400px] rounded-3xl bg-gray-200 dark:bg-white/5 animate-pulse border border-black/5 dark:border-white/5"></div>
              ))}
            </div>
          ) : events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
             <div className="py-20 text-center flex flex-col items-center justify-center border-2 border-dashed border-gray-200 dark:border-white/10 rounded-3xl bg-black/5 dark:bg-white/5">
                <CalendarDaysIcon className="size-16 text-gray-400 dark:text-gray-600 mb-4" />
                <h3 className="text-xl font-black uppercase text-gray-900 dark:text-white mb-2">No Active Events</h3>
                <p className="text-sm font-medium text-gray-500 max-w-md">This organizer doesn't have any upcoming events right now. Check back later!</p>
             </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default PublicOrganizerView;
