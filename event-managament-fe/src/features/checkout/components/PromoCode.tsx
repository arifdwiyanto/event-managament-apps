"use client";

import React from "react";
import { Typography, Divider } from "@mui/material";
import { AppliedPromo } from "../types/checkout.types";

interface PromoCodeProps {
  appliedPromo: AppliedPromo | null;
  promoCode: string;
  promoError: string;
  isValidating: boolean;
  onSetPromoCode: (code: string) => void;
  onApply: () => void;
  onRemove: () => void;
}

export const PromoCode: React.FC<PromoCodeProps> = ({
  appliedPromo,
  promoCode,
  promoError,
  isValidating,
  onSetPromoCode,
  onApply,
  onRemove,
}) => {
  return (
    <div className="border-4 border-black dark:border-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)] bg-white dark:bg-[#0a0a0a]">
      <Typography
        variant="h5"
        className="font-display font-black uppercase mb-4 text-black dark:text-white"
      >
        Have a Promo Code?
      </Typography>
      <Divider className="border-black dark:border-white/20 border-[1.5px] mb-4" />

      {appliedPromo ? (
        <div className="flex items-center justify-between bg-neon-cyan/20 p-4 border-2 border-neon-cyan">
          <div>
            <Typography className="font-bold uppercase text-neon-cyan/80 text-xs mb-1">
              Promo Applied
            </Typography>
            <Typography className="font-black uppercase text-xl dark:text-white">
              {appliedPromo.code}
            </Typography>
          </div>
          <div className="flex items-center gap-4">
            <Typography className="font-bold text-neon-cyan uppercase">
              - IDR {appliedPromo.discount.toLocaleString("id-ID")}
            </Typography>
            <button
              onClick={onRemove}
              className="text-xs font-bold underline text-red-500 hover:text-red-700"
            >
              REMOVE
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-stretch gap-2">
            <input
              type="text"
              value={promoCode}
              onChange={(e) => onSetPromoCode(e.target.value.toUpperCase())}
              placeholder="ENTER CODE"
              className="flex-1 border-2 border-black dark:border-white/20 bg-transparent dark:bg-black px-4 py-3 font-bold uppercase placeholder:text-gray-400 dark:text-white focus:outline-none focus:border-neon-purple transition-colors"
            />
            <button
              onClick={onApply}
              disabled={!promoCode.trim() || isValidating}
              className="px-6 border-2 border-black dark:border-neon-purple bg-black dark:bg-neon-purple text-white dark:text-black font-black uppercase tracking-widest hover:bg-neon-purple hover:border-neon-purple dark:hover:bg-black dark:hover:text-white dark:hover:border-white transition-colors disabled:opacity-50"
            >
              {isValidating ? "..." : "APPLY"}
            </button>
          </div>
          {promoError && (
            <Typography className="text-red-500 font-bold text-sm mt-2 uppercase text-xs">
              * {promoError}
            </Typography>
          )}
        </div>
      )}
    </div>
  );
};
