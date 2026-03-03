import React, { useState } from "react";
import Link from "next/link";
import { CheckBadgeIcon } from "@heroicons/react/24/solid";
import EditOrganizerProfileDialog from "./EditOrganizerProfileDialog";

interface ProfileHeaderCardProps {
  organizer: any;
  user: any;
}

const ProfileHeaderCard: React.FC<ProfileHeaderCardProps> = ({ organizer, user }) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const getInitials = (name?: string) => {
    if (!name) return "O";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <div className="bg-white dark:bg-[#221019] border border-slate-200 dark:border-[#3a1d2e] rounded-xl p-8 shadow-sm flex flex-col md:flex-row gap-8 items-center md:items-start relative overflow-hidden">
      {/* Subtle Accent Gradient */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#ee2b8c]/5 blur-3xl rounded-full -mr-16 -mt-16" />
      <div className="size-28 md:size-32 bg-white dark:bg-[#2a1621] border border-slate-200 dark:border-[#3a1d2e] rounded-xl flex-shrink-0 flex items-center justify-center p-4 shadow-sm overflow-hidden">
        {organizer?.logoUrl ? (
          <img
            alt="Organizer Logo"
            className="w-full h-full object-contain"
            src={organizer.logoUrl}
          />
        ) : (
          <span className="text-4xl font-bold text-gray-400 dark:text-white/20">
            {getInitials(organizer?.name)}
          </span>
        )}
      </div>
      <div className="flex-1 space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white uppercase">
            {organizer?.name || "Organizer Name"}
          </h2>
          <div className="flex items-center gap-1 bg-[#ee2b8c]/10 text-[#ee2b8c] px-2 py-0.5 rounded-full border border-[#ee2b8c]/20">
            <CheckBadgeIcon className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase">Verified</span>
          </div>
        </div>
        <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl">
          {organizer?.description ||
            "Professional curator for premium events. Focused on high-quality event execution and community building."}
        </p>
        <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-2">
          {user?.id === organizer?.ownerId && (
            <button
              onClick={() => setIsEditDialogOpen(true)}
              className="px-5 py-2.5 bg-[#ee2b8c] text-white text-sm font-semibold rounded-lg hover:bg-[#d41d77] transition-all shadow-sm"
            >
              Edit Profile
            </button>
          )}
          <button className="px-5 py-2.5 bg-white dark:bg-[#2a1621] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-[#3a1d2e] text-sm font-semibold rounded-lg hover:bg-slate-50 dark:hover:bg-[#351c2a] transition-all shadow-sm">
            View Public Page
          </button>
        </div>
      </div>

      <EditOrganizerProfileDialog 
        open={isEditDialogOpen} 
        onClose={() => setIsEditDialogOpen(false)} 
      />
    </div>
  );
};

export default ProfileHeaderCard;
