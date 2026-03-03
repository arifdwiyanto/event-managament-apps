"use client";

import React from "react";
import { useUserReferralView } from "../hooks/useUserReferralView";
import { LoadingSkeleton } from "./LoadingSkeleton";
import ProfileHeader from "./ProfileHeader";
import PointsBalanceCard from "./PointsBalanceCard";
import ReferralCrewCard from "./ReferralCrewCard";
import RecentActivityCard from "./RecentActivityCard";
import YourStashCard from "./YourStashCard";
import { ImageCropperModal } from "@/features/imageCropper/components/ImageCropperModal";

export const UserReferralView: React.FC = () => {
  const {
    data,
    loading,
    error,
    copied,
    activityDisplayCount,
    couponDisplayCount,
    activityLoading,
    couponLoading,
    isUploadingAvatar,
    uploadProgress,
    imageToCrop,
    isCropperOpen,
    handleCopyCode,
    handleAvatarChange,
    handleCropComplete,
    handleCropperClose,
    loadMoreActivities,
    loadMoreCoupons
  } = useUserReferralView();

  if (loading) {
    return (
      <div className="flex-grow w-full max-w-[1400px] mx-auto px-3 md:px-8 py-4 md:py-10">
        <LoadingSkeleton />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex-grow w-full max-w-[1400px] mx-auto px-3 md:px-8 py-4 md:py-10">
        <div className="text-center text-red-500">Failed to load data</div>
      </div>
    );
  }

  return (
    <div className="flex-grow w-full max-w-[1400px] mx-auto px-3 md:px-8 py-4 md:py-10">
      {/* Copied Toast */}
      {copied && (
        <div className="fixed bottom-4 left-2 md:left-4 z-50 bg-[#00FFFF] text-black px-3 md:px-4 py-1.5 md:py-2 font-black uppercase text-xs md:text-sm shadow-[2px_2px_0px_0px_#ffffff] md:shadow-[4px_4px_0px_0px_#ffffff] animate-pulse">
          Code Copied!
        </div>
      )}

      <div className="flex flex-col gap-4 md:gap-10">
        {/* Profile Header */}
        <ProfileHeader 
          profile={data.profile} 
          onCopyCode={handleCopyCode} 
          onAvatarChange={handleAvatarChange}
          isUploadingAvatar={isUploadingAvatar}
          uploadProgress={uploadProgress}
        />

        {/* Top Row - Balance & Referral */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 md:items-stretch">
          <div className="md:col-span-7">
            <PointsBalanceCard balance={data.pointsBalance} />
          </div>
          <div className="md:col-span-5">
            <ReferralCrewCard 
              code={data.profile.referralCode} 
              stats={data.referralStats} 
              onCopyCode={handleCopyCode} 
            />
          </div>
        </div>

        {/* Bottom Row - Activity & Stash */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 md:items-stretch">
          <div className="md:col-span-7">
            <RecentActivityCard 
              activities={data.recentActivity} 
              displayCount={activityDisplayCount}
              onLoadMore={loadMoreActivities}
              hasMore={activityDisplayCount < data.recentActivity.length}
              isLoading={activityLoading}
            />
          </div>
          <div className="md:col-span-5">
            <YourStashCard 
              coupons={data.coupons} 
              displayCount={couponDisplayCount}
              onLoadMore={loadMoreCoupons}
              hasMore={couponDisplayCount < data.coupons.length}
              isLoading={couponLoading}
            />
          </div>
        </div>
      </div>

      <ImageCropperModal
        open={isCropperOpen}
        imageSrc={imageToCrop}
        onClose={handleCropperClose}
        onCropComplete={handleCropComplete}
        title="Crop Your Avatar"
        aspectRatio={1} // Square crop
      />
    </div>
  );
};

export default UserReferralView;
