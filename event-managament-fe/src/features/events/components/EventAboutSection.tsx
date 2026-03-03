"use client";

import React, { useState } from "react";
import { Event } from "../types/event.types";
import { CheckBadgeIcon, ShieldCheckIcon } from "@heroicons/react/24/solid";
import { useEventReviews } from "../../reviews/hooks/useReviews";
import { StarIcon, UserIcon } from "@heroicons/react/24/solid";

interface EventAboutSectionProps {
  event: Event;
}

const EventAboutSection: React.FC<EventAboutSectionProps> = ({ event }) => {
  const [activeTab, setActiveTab] = useState<"about" | "reviews">("about");
  const { data: reviewsData, isLoading: isReviewsLoading } = useEventReviews(
    event.id,
  );

  const reviews = reviewsData?.data || [];
  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((acc: number, r: any) => acc + r.rating, 0) /
          reviews.length
        ).toFixed(1)
      : "No Ratings";

  return (
    <div className="space-y-10 font-display">
      <div className="border-b border-black/5 dark:border-white/10 relative">
        <nav className="flex gap-8 md:gap-12 relative z-10">
          <button
            onClick={() => setActiveTab("about")}
            className={`relative pb-4 text-sm md:text-lg font-black uppercase tracking-widest group transition-colors ${activeTab === "about" ? "text-gray-900 dark:text-white" : "text-gray-500 hover:text-gray-900 dark:hover:text-white"}`}
          >
            About
            {activeTab === "about" && (
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-neon-cyan to-neon-purple shadow-[0_0_15px_#00FFDD]"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`relative pb-4 text-sm md:text-lg font-bold uppercase tracking-widest flex items-center gap-2 group transition-colors ${activeTab === "reviews" ? "text-gray-900 dark:text-white" : "text-gray-500 hover:text-gray-900 dark:hover:text-white"}`}
          >
            Reviews
            <span
              className={`text-[10px] md:text-xs px-2 py-0.5 rounded-full transition-colors ${activeTab === "reviews" ? "bg-neon-cyan/20 text-neon-cyan" : "bg-black/5 dark:bg-white/10 group-hover:bg-neon-cyan/20 group-hover:text-neon-cyan"}`}
            >
              {reviews.length}
            </span>
            {activeTab === "reviews" && (
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-neon-purple to-neon-magenta shadow-[0_0_15px_#B400FF]"></div>
            )}
          </button>
        </nav>
      </div>

      <div className="max-w-none font-body">
        {activeTab === "about" && (
          <div className="bg-white/70 dark:bg-white/5 backdrop-blur-xl rounded-3xl p-6 md:p-10 border border-black/5 dark:border-white/10 shadow-xl dark:shadow-2xl relative overflow-hidden group">
            {/* Decorative background glow */}
            <div className="absolute top-0 right-0 size-64 bg-neon-purple/5 blur-[80px] rounded-full group-hover:bg-neon-purple/10 transition-all"></div>

            <div className="relative z-10 font-medium leading-[1.8] text-base md:text-xl text-gray-700 dark:text-gray-300 tracking-wide">
              {event.description || "No description available for this event."}
            </div>

            <div className="grid sm:grid-cols-2 gap-4 md:gap-6 mt-10 relative z-10">
              <div className="flex items-center gap-4 bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 p-5 md:p-6 rounded-2xl hover:bg-black/10 dark:hover:bg-white/10 transition-colors group/item">
                <div className="p-3 rounded-xl bg-neon-magenta/10 text-neon-magenta shadow-[0_0_15px_rgba(255,0,85,0.2)] group-hover/item:scale-110 transition-transform">
                  <CheckBadgeIcon className="size-6 md:size-8" />
                </div>
                <span className="font-black uppercase text-xs md:text-sm text-gray-900 dark:text-white tracking-widest leading-none">
                  Verified Event Platform
                </span>
              </div>

              <div className="flex items-center gap-4 bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 p-5 md:p-6 rounded-2xl hover:bg-black/10 dark:hover:bg-white/10 transition-colors group/item">
                <div className="p-3 rounded-xl bg-neon-cyan/10 text-neon-cyan shadow-[0_0_15px_rgba(0,255,221,0.2)] group-hover/item:scale-110 transition-transform">
                  <ShieldCheckIcon className="size-6 md:size-8" />
                </div>
                <span className="font-black uppercase text-xs md:text-sm text-gray-900 dark:text-white tracking-widest leading-none">
                  Secure E-Ticketing System
                </span>
              </div>
            </div>
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="bg-gradient-to-br from-neon-cyan/10 to-neon-purple/10 dark:from-neon-cyan/20 dark:to-neon-purple/20 backdrop-blur-xl rounded-2xl p-8 md:p-10 border border-black/5 dark:border-white/20 shadow-xl dark:shadow-2xl relative overflow-hidden group/review flex flex-col max-h-[600px]">
            <div className="absolute -top-10 -right-10 size-32 bg-neon-cyan/10 blur-[50px] pointer-events-none"></div>

            <h3 className="text-2xl md:text-3xl font-black uppercase mb-8 flex justify-between items-center text-gray-900 dark:text-white tracking-widest shrink-0">
              Reviews
              <span className="flex items-center gap-2 text-neon-cyan text-lg md:text-xl">
                <StarIcon className="size-6 text-neon-cyan drop-shadow-[0_0_5px_#00FFDD]" />{" "}
                {averageRating}
              </span>
            </h3>

            <div className="flex flex-col gap-8 overflow-y-auto pr-4 custom-scrollbar">
              {isReviewsLoading ? (
                <p className="text-sm font-bold uppercase text-gray-500">
                  Loading reviews...
                </p>
              ) : reviews.length === 0 ? (
                <p className="text-sm font-bold uppercase text-gray-500">
                  No reviews yet.
                </p>
              ) : (
                reviews.map((review: any) => (
                  <div
                    key={review.id}
                    className="flex gap-5 items-start bg-white/40 dark:bg-black/20 p-6 rounded-2xl border border-white/50 dark:border-white/10"
                  >
                    <div className="size-14 rounded-full bg-black/5 dark:bg-white/10 border border-black/5 dark:border-white/20 shrink-0 flex items-center justify-center overflow-hidden">
                      {review.user?.avatarUrl ? (
                        <img
                          src={review.user.avatarUrl}
                          alt={review.user.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <UserIcon className="size-7 text-gray-400 dark:text-white/50" />
                      )}
                    </div>
                    <div className="space-y-2 flex-1">
                      <div className="flex justify-between items-start">
                        <p className="text-[11px] md:text-sm font-black text-neon-cyan/80 dark:text-neon-cyan uppercase tracking-widest">
                          {review.user?.name || "Anonymous"}
                        </p>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <StarIcon
                              key={i}
                              className={`size-4 ${i < review.rating ? "text-neon-cyan drop-shadow-[0_0_3px_#00FFDD]" : "text-gray-300 dark:text-gray-600"}`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-base md:text-lg font-bold uppercase leading-tight italic text-gray-800 dark:text-white/90 tracking-tight">
                        "{review.comment || "No comment provided."}"
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventAboutSection;
