"use client";

import React from "react";
import { Typography } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";

interface CheckoutTotalProps {
  total: number;
  totalPromoDiscount: number;
  pointDiscount: number;
  couponDiscount: number;
  finalTotal: number;
  onPay: () => void;
  isSubmitting: boolean;
}

export const CheckoutTotal: React.FC<CheckoutTotalProps> = ({
  total,
  totalPromoDiscount,
  pointDiscount,
  couponDiscount,
  finalTotal,
  onPay,
  isSubmitting,
}) => {
  const hasDiscount = totalPromoDiscount > 0 || pointDiscount > 0 || couponDiscount > 0;
  const totalSavings = totalPromoDiscount + pointDiscount + couponDiscount;

  return (
    <div className="sticky top-24 rounded-xl overflow-hidden border border-gray-200 dark:border-zinc-800 shadow-lg dark:shadow-[0_0_40px_rgba(168,85,247,0.08)]">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#0a0a0a] to-[#1a1a2e] p-6 border-b border-white/5">
        <Typography className="font-display font-black uppercase text-lg tracking-tight text-white">
          Order Summary
        </Typography>
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-[#111111] p-6 space-y-4">
        {/* Subtotal */}
        <div className="flex justify-between items-center">
          <Typography className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Subtotal
          </Typography>
          <Typography className="text-sm font-bold text-gray-900 dark:text-white">
            IDR {total.toLocaleString("id-ID")}
          </Typography>
        </div>

        {/* Event Promos */}
        {totalPromoDiscount > 0 && (
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1.5">
              <span className="text-xs">🏷️</span>
              <Typography className="text-sm font-bold text-[#00897b] dark:text-[#00FFFF]">
                Event Promos
              </Typography>
            </div>
            <Typography className="text-sm font-bold text-[#00897b] dark:text-[#00FFFF]">
              - IDR {totalPromoDiscount.toLocaleString("id-ID")}
            </Typography>
          </div>
        )}

        {/* Points Discount */}
        {pointDiscount > 0 && (
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1.5">
              <span className="text-xs">💎</span>
              <Typography className="text-sm font-bold text-neon-magenta">
                Points
              </Typography>
            </div>
            <Typography className="text-sm font-bold text-neon-magenta">
              - IDR {pointDiscount.toLocaleString("id-ID")}
            </Typography>
          </div>
        )}

        {/* Coupon Discount */}
        {couponDiscount > 0 && (
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1.5">
              <span className="text-xs">🎫</span>
              <Typography className="text-sm font-bold" style={{ color: "#d946ef" }}>
                Referral Coupon
              </Typography>
            </div>
            <Typography className="text-sm font-bold" style={{ color: "#d946ef" }}>
              - IDR {couponDiscount.toLocaleString("id-ID")}
            </Typography>
          </div>
        )}

        {/* Savings banner */}
        {hasDiscount && (
          <div className="rounded-lg bg-green-50 dark:bg-green-500/5 border border-green-200 dark:border-green-500/20 px-4 py-2.5">
            <Typography className="text-xs font-black uppercase text-green-700 dark:text-green-400 text-center tracking-wider">
              🎉 You save IDR {totalSavings.toLocaleString("id-ID")}
            </Typography>
          </div>
        )}

        {/* Divider */}
        <div className="border-t-2 border-dashed border-gray-200 dark:border-zinc-700 my-1" />

        {/* Final total */}
        <div className="flex justify-between items-center pt-1">
          <Typography className="text-sm font-bold uppercase text-gray-500 dark:text-gray-400">
            Total
          </Typography>
          <Typography className="font-display font-black text-2xl text-gray-900 dark:text-[#00FFFF] dark:drop-shadow-[0_0_12px_rgba(0,255,255,0.3)]">
            IDR {finalTotal.toLocaleString("id-ID")}
          </Typography>
        </div>
      </div>

      {/* Pay button */}
      <div className="p-6 pt-0 bg-white dark:bg-[#111111]">
        <button
          onClick={onPay}
          disabled={isSubmitting}
          className="w-full py-4 rounded-lg bg-gradient-to-r from-neon-purple to-[#7c3aed] text-white font-black uppercase tracking-widest text-sm
            shadow-[0_4px_20px_rgba(168,85,247,0.4)]
            hover:shadow-[0_6px_30px_rgba(168,85,247,0.6)] hover:translate-y-[-1px]
            active:translate-y-[1px] active:shadow-[0_2px_10px_rgba(168,85,247,0.3)]
            transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none
            flex items-center justify-center gap-2"
        >
          <LockIcon sx={{ fontSize: 16 }} />
          {isSubmitting ? "Processing..." : "Make Payment"}
        </button>
        <p className="text-center text-[10px] text-gray-400 dark:text-gray-600 font-medium mt-3">
          Secure payment powered by Midtrans
        </p>
      </div>
    </div>
  );
};
