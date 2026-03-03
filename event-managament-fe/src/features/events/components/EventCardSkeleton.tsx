"use client";

import React from "react";
import Skeleton from "@mui/material/Skeleton";

const EventCardSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col bg-white dark:bg-[#111] rounded-lg md:rounded-xl overflow-hidden border border-gray-200 dark:border-white/10 shadow-sm dark:shadow-none">
      {/* Image Skeleton */}
      <div className="relative h-16 sm:h-28 md:h-38 lg:h-46 overflow-hidden">
        <Skeleton
          variant="rectangular"
          width="100%"
          height="50%"
          className="dark:bg-white/5"
        />
      </div>

      {/* Content Skeleton */}
      <div className="p-3 md:p-4 flex flex-col flex-grow bg-white dark:bg-[#111]">
        {/* Title Skeleton */}
        <div className="mb-1 md:mb-2 flex flex-col gap-0.5 md:gap-1">
          <Skeleton
            variant="rounded"
            width="90%"
            height={8}
            className="md:hidden dark:bg-white/5"
          />
          <Skeleton
            variant="rounded"
            width="60%"
            height={8}
            className="md:hidden dark:bg-white/5"
          />
          <Skeleton
            variant="rounded"
            width="90%"
            height={20}
            className="hidden md:block dark:bg-white/5"
          />
          <Skeleton
            variant="rounded"
            width="60%"
            height={20}
            className="hidden md:block dark:bg-white/5"
          />
        </div>

        {/* Date Skeleton */}
        <div className="mb-1 md:mb-2 flex items-center gap-1">
          <Skeleton
            variant="circular"
            width={8}
            height={8}
            className="dark:bg-white/5"
          />
          <Skeleton
            variant="rounded"
            width="40%"
            height={6}
            className="md:hidden dark:bg-white/5"
          />
          <Skeleton
            variant="rounded"
            width="40%"
            height={14}
            className="hidden md:block dark:bg-white/5"
          />
        </div>

        {/* Location Skeleton */}
        <div className="mb-2 md:mb-3 flex items-center gap-1">
          <Skeleton
            variant="circular"
            width={8}
            height={8}
            className="dark:bg-white/5"
          />
          <Skeleton
            variant="rounded"
            width="50%"
            height={6}
            className="md:hidden dark:bg-white/5"
          />
          <Skeleton
            variant="rounded"
            width="50%"
            height={14}
            className="hidden md:block dark:bg-white/5"
          />
        </div>

        {/* Footer Price Skeleton */}
        <div className="mt-auto pt-2 md:pt-3 border-t border-gray-200 dark:border-white/10">
          <Skeleton
            variant="rounded"
            width="35%"
            height={10}
            className="md:hidden dark:bg-white/5"
          />
          <Skeleton
            variant="rounded"
            width="35%"
            height={24}
            className="hidden md:block dark:bg-white/5"
          />
        </div>
      </div>
    </div>
  );
};

export default EventCardSkeleton;
