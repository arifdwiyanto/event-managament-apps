import { useState, useCallback } from "react";
import { useUserReferral } from "../hooks";
import { useStoreLogin } from "../../auth/store/useAuthStore";
import { updateUserAvatar } from "../../auth/services/authService";

export const useUserReferralView = () => {
  const { data, loading, error, refetch } = useUserReferral();
  const { user, me } = useStoreLogin();
  const [copied, setCopied] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  
  // Infinite scroll state
  const [activityDisplayCount, setActivityDisplayCount] = useState(10);
  const [couponDisplayCount, setCouponDisplayCount] = useState(10);
  const [activityLoading, setActivityLoading] = useState(false);
  const [couponLoading, setCouponLoading] = useState(false);

  const handleCopyCode = () => {
    if (data?.profile.referralCode) {
      navigator.clipboard.writeText(data.profile.referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageToCrop(reader.result as string);
        setIsCropperOpen(true);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = "";
  };

  const handleCropComplete = async (croppedFile: File) => {
    if (user?.id) {
      setIsUploadingAvatar(true);
      setUploadProgress(0);
      try {
        const formData = new FormData();
        formData.append("image", croppedFile);
        await updateUserAvatar(user.id, formData, (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentCompleted);
          }
        });
        
        // Refresh local referral data to get new avatar URL
        if (refetch) {
          await refetch();
        }
        await me();
      } catch (err) {
        console.error("Failed to upload avatar:", err);
        alert("Failed to upload avatar. Please try again.");
      } finally {
        setIsUploadingAvatar(false);
        setUploadProgress(0);
      }
    }
  };

  const handleCropperClose = () => {
    setIsCropperOpen(false);
    setImageToCrop(null);
  };

  const loadMoreActivities = useCallback(() => {
    if (!data || activityLoading) return;
    setActivityLoading(true);
    // Simulate network delay
    setTimeout(() => {
      setActivityDisplayCount(prev => Math.min(prev + 10, data.recentActivity.length));
      setActivityLoading(false);
    }, 500);
  }, [data, activityLoading]);

  const loadMoreCoupons = useCallback(() => {
    if (!data || couponLoading) return;
    setCouponLoading(true);
    // Simulate network delay
    setTimeout(() => {
      setCouponDisplayCount(prev => Math.min(prev + 10, data.coupons.length));
      setCouponLoading(false);
    }, 500);
  }, [data, couponLoading]);

  return {
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
  };
};
