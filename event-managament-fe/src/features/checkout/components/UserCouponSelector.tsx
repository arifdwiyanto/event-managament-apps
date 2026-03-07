"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getUserCoupons, UserCoupon } from "../services/userCouponService";
import { formatDate } from "@/utils/dateUtils";

interface UserCouponSelectorProps {
  selectedCouponId: string | null;
  onSelect: (coupon: UserCoupon | null) => void;
}

export const UserCouponSelector: React.FC<UserCouponSelectorProps> = ({
  selectedCouponId,
  onSelect,
}) => {
  const { data: coupons = [], isLoading } = useQuery({
    queryKey: ["userCoupons"],
    queryFn: getUserCoupons,
    staleTime: 1000 * 60 * 5,
  });

  const available = coupons.filter((c) => !c.isUsed && !c.isExpired);

  if (isLoading) {
    return <div className="h-16 bg-gray-100 dark:bg-zinc-800 animate-pulse rounded" />;
  }

  if (available.length === 0) return null;

  return (
    <div className="border-4 border-[#FF00FF] dark:border-[#FF00FF] p-6 shadow-[8px_8px_0px_0px_rgba(238,43,140,0.3)] bg-white dark:bg-[#0a0a0a]">
      <p className="font-black uppercase tracking-widest text-sm text-[#ee2b8c] dark:text-[#FF00FF] mb-4 flex items-center gap-2">
        🎫 Your Referral Coupon
      </p>
      <div className="grid grid-cols-1 gap-2">
        {available.map((coupon) => {
          const isSelected = selectedCouponId === coupon.id;
          return (
            <button
              key={coupon.id}
              onClick={() => onSelect(isSelected ? null : coupon)}
              className={`w-full text-left p-3 border-2 transition-all flex items-center justify-between gap-3 group
                ${isSelected
                  ? "border-[#FF00FF] bg-[#FF00FF]/10 dark:bg-[#FF00FF]/5 shadow-[2px_2px_0_0_#FF00FF]"
                  : "border-gray-300 dark:border-zinc-700 bg-white dark:bg-black hover:border-[#ee2b8c] dark:hover:border-[#FF00FF] hover:shadow-[2px_2px_0_0_#ee2b8c] dark:hover:shadow-[2px_2px_0_0_#FF00FF]"
                }`}
            >
              <div className="min-w-0">
                <p className={`font-black text-sm uppercase tracking-wide truncate ${isSelected ? "text-[#ee2b8c] dark:text-[#FF00FF]" : "text-gray-900 dark:text-white"}`}>
                  {coupon.code}
                </p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase mt-0.5">
                  Referral Discount · Exp: {formatDate(coupon.expiresAt)}
                </p>
              </div>
              <span className={`shrink-0 font-black text-base px-3 py-1 border-2 transition-all
                ${isSelected
                  ? "bg-[#FF00FF] border-[#FF00FF] text-white"
                  : "bg-white dark:bg-black border-[#ee2b8c] dark:border-[#FF00FF] text-[#ee2b8c] dark:text-[#FF00FF] group-hover:bg-[#ee2b8c] dark:group-hover:bg-[#FF00FF] group-hover:text-white"
                }`}
              >
                -{coupon.discountPercentage}%
              </span>
            </button>
          );
        })}
      </div>
      {selectedCouponId && (
        <button
          onClick={() => onSelect(null)}
          className="mt-2 text-[10px] font-bold uppercase text-red-500 hover:underline"
        >
          Remove coupon
        </button>
      )}
    </div>
  );
};
