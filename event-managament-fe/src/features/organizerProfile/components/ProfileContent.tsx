import React from "react";
import ProfileHeaderCard from "./ProfileHeaderCard";
import AboutOrganizerCard from "./AboutOrganizerCard";
import OrganizerSettingsCard from "./OrganizerSettingsCard";
import TeamCard from "./TeamCard";
import { useOrganizerProfile } from "../hooks/useOrganizerProfile";
import { Skeleton } from "@mui/material";

const ProfileContent: React.FC = () => {
  const { data: organizer, loading, error, user, refetch } = useOrganizerProfile();

  if (loading && !organizer) {
    return (
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Skeleton */}
        <div className="bg-white dark:bg-[#221019] border border-slate-200 dark:border-[#3a1d2e] rounded-xl p-8 shadow-sm flex flex-col md:flex-row gap-8 items-center md:items-start">
          <Skeleton variant="rectangular" width={128} height={128} className="rounded-xl flex-shrink-0" />
          <div className="flex-1 space-y-4 w-full">
            <div className="flex items-center gap-3">
              <Skeleton variant="text" width="60%" height={40} />
              <Skeleton variant="rectangular" width={80} height={24} className="rounded-full" />
            </div>
            <Skeleton variant="text" width="100%" height={60} />
            <div className="flex gap-3 pt-2">
              <Skeleton variant="rectangular" width={120} height={40} className="rounded-lg" />
              <Skeleton variant="rectangular" width={120} height={40} className="rounded-lg" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* About Skeleton */}
          <div className="lg:col-span-2 space-y-4">
            <Skeleton variant="text" width={150} height={24} className="mb-4" />
            <div className="bg-white dark:bg-[#221019] border border-slate-200 dark:border-[#3a1d2e] rounded-xl p-6 shadow-sm space-y-4">
              <Skeleton variant="text" width="100%" height={20} />
              <Skeleton variant="text" width="100%" height={20} />
              <Skeleton variant="text" width="60%" height={20} />
              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-200 dark:border-[#3a1d2e]">
                <div><Skeleton variant="text" width={60} /><Skeleton variant="text" width={100} height={24} /></div>
                <div><Skeleton variant="text" width={60} /><Skeleton variant="text" width={100} height={24} /></div>
              </div>
            </div>
          </div>

          {/* Team Skeleton */}
          <div className="lg:col-span-1 space-y-4">
            <Skeleton variant="text" width={100} height={24} className="mb-4" />
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-[#221019] border border-slate-200 dark:border-[#3a1d2e] rounded-xl p-3 shadow-sm flex items-center gap-3">
                  <Skeleton variant="rectangular" width={40} height={40} className="rounded-lg flex-shrink-0" />
                  <div className="flex-1 space-y-1">
                    <Skeleton variant="text" width="80%" height={16} />
                    <Skeleton variant="text" width="40%" height={14} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !organizer) {
    return (
      <div className="flex justify-center items-center h-64 text-red-500">
        <p>{error || "Organizer profile not found"}</p>
      </div>
    );
  }
  return (
    <div className="max-w-6xl mx-auto space-y-6 md:space-y-8">
      <ProfileHeaderCard organizer={organizer} user={user} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-2 order-1">
          <AboutOrganizerCard organizer={organizer} />
        </div>

        <div className="lg:col-span-1 order-2 lg:order-2">
          <TeamCard organizer={organizer} user={user} refetch={refetch} />
        </div>

        {user?.id === organizer?.ownerId && (
          <div className="lg:col-span-2 order-3 lg:order-3">
            <OrganizerSettingsCard organizer={organizer} user={user} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileContent;
