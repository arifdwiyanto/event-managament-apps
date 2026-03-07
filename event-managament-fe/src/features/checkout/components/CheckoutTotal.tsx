"use client";

import React from "react";
import { Typography, Divider } from "@mui/material";

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
  return (
    <div className="border-4 border-black dark:border-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)] bg-[#0a0a0a] text-white sticky top-24">
      <Typography
        variant="h5"
        className="font-display font-black uppercase mb-4 tracking-tighter"
      >
        Total
      </Typography>
      <Divider className="border-white/10 border-[1.5px] mb-4" />

      <div className="space-y-4 mb-8">
        <div className="flex justify-between items-center">
          <Typography className="font-bold uppercase text-sm text-gray-400">
            Subtotal
          </Typography>
          <Typography className="font-bold text-sm">
            IDR {total.toLocaleString("id-ID")}
          </Typography>
        </div>

        {totalPromoDiscount > 0 && (
          <div className="flex justify-between items-center text-neon-cyan">
            <Typography className="font-bold uppercase text-sm">
              Event Promos
            </Typography>
            <Typography className="font-bold text-sm">
              - IDR {totalPromoDiscount.toLocaleString("id-ID")}
            </Typography>
          </div>
        )}

        {pointDiscount > 0 && (
          <div className="flex justify-between items-center text-neon-magenta">
            <Typography className="font-bold uppercase text-sm">
              Points Discount
            </Typography>
            <Typography className="font-bold text-sm">
              - IDR {pointDiscount.toLocaleString("id-ID")}
            </Typography>
          </div>
        )}

        {couponDiscount > 0 && (
          <div className="flex justify-between items-center" style={{ color: '#FF00FF' }}>
            <Typography className="font-bold uppercase text-sm" style={{ color: '#FF00FF' }}>
              Referral Coupon
            </Typography>
            <Typography className="font-bold text-sm" style={{ color: '#FF00FF' }}>
              - IDR {couponDiscount.toLocaleString("id-ID")}
            </Typography>
          </div>
        )}

        <Divider className="border-white/20 border-1 my-2" />

        <div className="flex justify-between items-center">
          <Typography className="font-bold uppercase text-sm text-gray-400">
            Amount to pay
          </Typography>
          <Typography className="font-display font-black text-2xl text-neon-cyan drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]">
            IDR {finalTotal.toLocaleString("id-ID")}
          </Typography>
        </div>
      </div>

      <button
        onClick={onPay}
        disabled={isSubmitting}
        className="w-full py-4 bg-neon-purple text-white font-black uppercase tracking-widest shadow-[4px_4px_0_0_#fff] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_0_#fff] active:translate-x-0 active:translate-y-0 active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Processing..." : "Make Payment"}
      </button>
    </div>
  );
};
