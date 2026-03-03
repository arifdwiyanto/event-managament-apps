import React from "react";
import Link from "next/link";
import { EditIcon, CopyIcon, TicketIcon, GiftIcon } from "./ReferralIcons";
import { UserProfile } from "../types";
import { formatDate } from "../../../utils/dateUtils";

interface ProfileHeaderProps {
  profile: UserProfile;
  onCopyCode: () => void;
  onAvatarChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isUploadingAvatar?: boolean;
  uploadProgress?: number;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  profile,
  onCopyCode,
  onAvatarChange,
  isUploadingAvatar,
  uploadProgress,
}) => (
  <section className="flex flex-col gap-4 md:gap-8 items-center md:flex-row md:items-end md:justify-between border-b-2 border-gray-200 dark:border-zinc-800 pb-4 md:pb-8 border-dashed">
    <div className="flex flex-col items-center gap-4 md:flex-row md:items-end md:gap-6 w-full md:w-auto">
      {/* Avatar */}
      <div className="relative group cursor-pointer">
        <div
          className="size-24 md:size-40 rounded-none border-2 md:border-4 border-gray-300 dark:border-white/20 bg-cover bg-center shadow-[2px_2px_0px_0px_#ccc] dark:shadow-[2px_2px_0px_0px_#333333] md:shadow-[4px_4px_0px_0px_#ccc] md:dark:shadow-[4px_4px_0px_0px_#333333] transition-all bg-gray-100 dark:bg-zinc-900 relative"
          style={{ backgroundImage: `url("${profile.avatar}")` }}
        >
          {isUploadingAvatar && (
            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center backdrop-blur-sm">
              <span className="text-white font-black text-xl md:text-3xl drop-shadow-md">
                {uploadProgress || 0}%
              </span>
              <span className="text-white/80 text-[10px] md:text-xs font-bold uppercase mt-1">
                Uploading
              </span>
            </div>
          )}
        </div>
        <label
          className={`absolute -bottom-2 -right-2 md:-bottom-3 md:-right-3 ${isUploadingAvatar ? "bg-gray-400" : "bg-[#00FFFF] hover:rotate-12"} text-black p-1.5 md:p-2 border-2 border-black shadow-[1px_1px_0px_0px_#333333] md:shadow-[2px_2px_0px_0px_#333333] transition-transform cursor-pointer`}
        >
          {isUploadingAvatar ? (
            <span className="material-symbols-outlined animate-spin text-sm">
              refresh
            </span>
          ) : (
            <EditIcon />
          )}
          <input
            type="file"
            accept="image/png, image/jpeg, image/jpg, image/webp"
            className="hidden"
            onChange={onAvatarChange}
            disabled={isUploadingAvatar}
          />
        </label>
      </div>

      {/* Profile Info */}
      <div className="flex flex-col items-center md:items-start text-center md:text-left gap-1">
        {/* <div className="inline-block bg-[#FF00FF] text-white px-2 md:px-3 py-0.5 md:py-1 text-[10px] md:text-xs font-black uppercase tracking-widest transform -rotate-1 mb-1 md:mb-2 border border-black">
          {profile.tier}
        </div> */}
        <h1 className="text-2xl md:text-5xl font-black tracking-tighter uppercase leading-none text-gray-900 dark:text-white drop-shadow-[1px_1px_0px_rgba(255,0,255,0.5)] md:drop-shadow-[2px_2px_0px_rgba(255,0,255,0.5)]">
          {profile.name}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 font-bold text-xs md:text-base">
          Joined {formatDate(profile.memberSince)} • {profile.location}
        </p>
        <div className="flex items-center gap-2 md:gap-3 mt-2 md:mt-4">
          <button
            onClick={onCopyCode}
            className="bg-gray-100 dark:bg-zinc-900 px-2 md:px-4 py-1.5 md:py-2 border-2 border-gray-300 dark:border-zinc-800 shadow-[1px_1px_0px_0px_#ccc] dark:shadow-[1px_1px_0px_0px_#333333] md:shadow-[2px_2px_0px_0px_#ccc] md:dark:shadow-[2px_2px_0px_0px_#333333] flex items-center gap-2 md:gap-3 group cursor-pointer active:shadow-none active:translate-x-[1px] active:translate-y-[1px] transition-all hover:border-[#00bcd4] dark:hover:border-[#00FFFF]"
          >
            <span className="text-[10px] md:text-xs font-black uppercase tracking-wider text-gray-500">
              ID:
            </span>
            <span className="font-mono font-bold text-sm md:text-lg text-[#00bcd4] dark:text-[#00FFFF]">
              {profile.referralCode}
            </span>
            <span className="text-gray-500 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
              <CopyIcon />
            </span>
          </button>
        </div>
      </div>
    </div>

    {/* Action Buttons */}
    <div className="flex flex-col sm:flex-row gap-2 md:gap-4 w-full md:w-auto">
      <Link
        href="/events"
        className="bg-gray-900 dark:bg-zinc-900 border-2 border-gray-800 dark:border-zinc-800 text-white px-4 md:px-6 py-2 md:py-3 font-bold text-xs md:text-base shadow-[2px_2px_0px_0px_#333] md:shadow-[4px_4px_0px_0px_#333] hover:shadow-[3px_3px_0px_0px_#FF00FF] md:hover:shadow-[6px_6px_0px_0px_#FF00FF] hover:border-[#00bcd4] dark:hover:border-[#00FFFF] hover:-translate-y-1 active:shadow-none active:translate-y-0 transition-all flex items-center justify-center gap-2 uppercase tracking-wide"
      >
        <span className="text-[#00FFFF]">
          <TicketIcon />
        </span>
        Browse Events
      </Link>
      <button className="bg-[#ee2b8c] dark:bg-[#FF00FF] border-2 border-black text-white px-4 md:px-8 py-2 md:py-3 font-black text-xs md:text-lg shadow-[2px_2px_0px_0px_#d61f7a] dark:shadow-[2px_2px_0px_0px_#ffffff] md:shadow-[4px_4px_0px_0px_#d61f7a] md:dark:shadow-[4px_4px_0px_0px_#ffffff] hover:bg-[#d61f7a] dark:hover:bg-[#d900d9] hover:-translate-y-1 active:shadow-none active:translate-y-0 transition-all flex items-center justify-center gap-2 uppercase tracking-wide">
        <GiftIcon />
        Redeem Points
      </button>
    </div>
  </section>
);

export default ProfileHeader;
