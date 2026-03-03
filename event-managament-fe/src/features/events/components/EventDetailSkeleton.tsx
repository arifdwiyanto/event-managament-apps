"use client";

import React from "react";
import Skeleton from "@mui/material/Skeleton";

const EventDetailSkeleton: React.FC = () => {
  return (
    <main className="pt-6 pb-16 px-4 lg:px-8 max-w-7xl mx-auto overflow-x-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Content */}
        <div className="lg:col-span-8 space-y-10">
          {/* Hero Image Skeleton */}
          <div className="brutalist-card overflow-hidden">
            <Skeleton
              variant="rectangular"
              width="100%"
              height={400}
              className="dark:bg-white/5"
            />
          </div>

          {/* Event Basic Info Skeleton */}
          <div className="space-y-4">
            <Skeleton
              variant="text"
              width="60%"
              height={40}
              className="dark:bg-white/5"
            />
            <div className="flex gap-4">
              <Skeleton
                variant="rounded"
                width={120}
                height={24}
                className="dark:bg-white/5"
              />
              <Skeleton
                variant="rounded"
                width={120}
                height={24}
                className="dark:bg-white/5"
              />
            </div>
          </div>

          {/* Tabs and About Skeleton */}
          <div className="space-y-6">
            <div className="flex gap-4 border-b-4 border-black pb-2">
              <Skeleton
                variant="rectangular"
                width={100}
                height={40}
                className="dark:bg-white/5"
              />
              <Skeleton
                variant="rectangular"
                width={100}
                height={40}
                className="dark:bg-white/5"
              />
            </div>
            <div className="space-y-2">
              <Skeleton variant="text" width="100%" className="dark:bg-white/5" />
              <Skeleton variant="text" width="100%" className="dark:bg-white/5" />
              <Skeleton variant="text" width="90%" className="dark:bg-white/5" />
              <Skeleton variant="text" width="95%" className="dark:bg-white/5" />
              <Skeleton variant="text" width="40%" className="dark:bg-white/5" />
            </div>
          </div>

          {/* Organizer & Reviews Placeholder Skeleton */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="brutalist-card p-8">
              <Skeleton
                variant="text"
                width="40%"
                height={32}
                className="mb-6 dark:bg-white/5"
              />
              <div className="flex items-center gap-4">
                <Skeleton
                  variant="rectangular"
                  width={64}
                  height={64}
                  className="dark:bg-white/5"
                />
                <div className="flex-1">
                  <Skeleton
                    variant="text"
                    width="80%"
                    height={24}
                    className="dark:bg-white/5"
                  />
                  <Skeleton
                    variant="text"
                    width="60%"
                    height={20}
                    className="dark:bg-white/5"
                  />
                </div>
              </div>
            </div>

            <div className="brutalist-card p-8">
              <Skeleton
                variant="text"
                width="40%"
                height={32}
                className="mb-6 dark:bg-white/5"
              />
              <div className="flex gap-4">
                <Skeleton
                  variant="rectangular"
                  width={48}
                  height={48}
                  className="dark:bg-white/5"
                />
                <Skeleton
                  variant="text"
                  width="100%"
                  height={60}
                  className="dark:bg-white/5"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Sticky Skeleton */}
        <div className="lg:col-span-4">
          <div className="brutalist-card p-6 space-y-6 sticky top-32">
            <Skeleton
              variant="text"
              width="70%"
              height={32}
              className="dark:bg-white/5"
            />
            <Skeleton
              variant="rectangular"
              width="100%"
              height={200}
              className="dark:bg-white/5"
            />
            <Skeleton
              variant="rectangular"
              width="100%"
              height={56}
              className="dark:bg-white/5"
            />
          </div>
        </div>
      </div>
    </main>
  );
};

export default EventDetailSkeleton;
