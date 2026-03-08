"use client";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Slide,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import CloseIcon from "@mui/icons-material/Close";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {
  getEventPromotions,
  EventPromotion,
} from "@/features/promotions/services/promotionService";
import { AppliedPromo } from "../types/checkout.types";
import { formatDate } from "@/utils/dateUtils";

const SlideUp = React.forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface EventPromoSelectorProps {
  eventId: string;
  eventName: string;
  appliedPromo: AppliedPromo | null;
  eventSubtotal: number;
  onApply: (eventId: string, promo: AppliedPromo) => void;
  onRemove: (eventId: string) => void;
}

export const EventPromoSelector: React.FC<EventPromoSelectorProps> = ({
  eventId,
  eventName,
  appliedPromo,
  eventSubtotal,
  onApply,
  onRemove,
}) => {
  const [open, setOpen] = useState(false);

  const { data: promotions = [], isLoading } = useQuery({
    queryKey: ["eventPromotions", eventId],
    queryFn: () => getEventPromotions(eventId),
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) {
    return (
      <div className="h-12 bg-gray-100 dark:bg-zinc-800 animate-pulse rounded-lg mt-3" />
    );
  }

  if (promotions.length === 0) return null;

  const handleSelect = (promo: EventPromotion) => {
    if (appliedPromo?.id === promo.id) {
      onRemove(eventId);
      setOpen(false);
      return;
    }
    let discount = 0;
    if (promo.discountPercentage) {
      discount = (eventSubtotal * promo.discountPercentage) / 100;
    } else if (promo.discountAmount) {
      discount = promo.discountAmount;
    }
    onApply(eventId, {
      id: promo.id,
      code: promo.code,
      discount,
      eventId,
      discountPercentage: promo.discountPercentage,
      discountAmount: promo.discountAmount,
    });
    setOpen(false);
  };

  const isDark =
    typeof window !== "undefined" &&
    document.documentElement.classList.contains("dark");

  return (
    <>
      {/* Compact trigger */}
      <div className="mt-3">
        {appliedPromo ? (
          <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-lg border border-[#00897b]/30 dark:border-[#00FFFF]/20 bg-[#00897b]/5 dark:bg-[#00FFFF]/5">
            <div className="flex items-center gap-2.5 min-w-0">
              <CheckCircleIcon
                sx={{ fontSize: 18 }}
                className="text-[#00897b] dark:text-[#00FFFF] shrink-0"
              />
              <div className="min-w-0">
                <p className="font-bold text-xs text-[#00897b] dark:text-[#00FFFF] truncate">
                  {appliedPromo.code}
                </p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">
                  Saving IDR {appliedPromo.discount.toLocaleString("id-ID")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => setOpen(true)}
                className="text-[11px] font-bold text-neon-purple hover:underline"
              >
                Change
              </button>
              <button
                onClick={() => onRemove(eventId)}
                className="text-[11px] font-bold text-gray-400 hover:text-red-500 transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setOpen(true)}
            className="w-full flex items-center justify-between px-4 py-3 rounded-lg border border-dashed border-gray-300 dark:border-zinc-700 hover:border-neon-purple dark:hover:border-neon-purple transition-all group bg-gray-50/50 dark:bg-white/[0.02] hover:bg-neon-purple/5 dark:hover:bg-neon-purple/5"
          >
            <div className="flex items-center gap-2.5">
              <LocalOfferOutlinedIcon
                sx={{ fontSize: 16 }}
                className="text-gray-400 group-hover:text-neon-purple transition-colors"
              />
              <span className="text-xs font-bold text-gray-500 dark:text-gray-400 group-hover:text-neon-purple transition-colors">
                {promotions.length} promo{promotions.length > 1 ? "s" : ""} available
              </span>
            </div>
            <span className="text-xs font-black text-neon-purple opacity-0 group-hover:opacity-100 transition-opacity">
              Select →
            </span>
          </button>
        )}
      </div>

      {/* Promo Selection Dialog */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        TransitionComponent={SlideUp}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "16px",
            border: "none",
            backgroundColor: isDark ? "#111111" : "#ffffff",
            color: isDark ? "#fff" : "#111",
            boxShadow: isDark
              ? "0 25px 50px -12px rgba(0,0,0,0.8), 0 0 40px rgba(168,85,247,0.1)"
              : "0 25px 50px -12px rgba(0,0,0,0.25)",
            maxHeight: "85vh",
            overflow: "hidden",
          },
        }}
      >
        {/* Dialog Header */}
        <DialogTitle sx={{ p: 0 }}>
          <div className="flex items-center justify-between px-6 pt-6 pb-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-neon-purple/10 dark:bg-neon-purple/20 flex items-center justify-center shrink-0">
                <LocalOfferOutlinedIcon className="text-neon-purple" sx={{ fontSize: 20 }} />
              </div>
              <div className="min-w-0">
                <Typography className="font-black uppercase text-sm tracking-wider text-gray-900 dark:text-white">
                  Select Promo
                </Typography>
                <Typography className="text-[11px] font-medium text-gray-400 dark:text-gray-500 truncate mt-0.5">
                  {eventName}
                </Typography>
              </div>
            </div>
            <IconButton
              onClick={() => setOpen(false)}
              sx={{
                color: isDark ? "#666" : "#999",
                "&:hover": { backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)" },
              }}
              size="small"
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </div>
          <div className="mx-6 border-b border-gray-100 dark:border-zinc-800" />
        </DialogTitle>

        {/* Dialog Content */}
        <DialogContent sx={{ px: 3, pb: 3, pt: 2 }}>
          <div className="space-y-2.5">
            {promotions.map((promo) => {
              const isSelected = appliedPromo?.id === promo.id;
              const isFull = promo.remaining !== null && promo.remaining <= 0;
              const discountLabel = promo.discountPercentage
                ? `${promo.discountPercentage}%`
                : `Rp ${promo.discountAmount?.toLocaleString("id-ID")}`;
              const savedAmount = promo.discountPercentage
                ? (eventSubtotal * promo.discountPercentage) / 100
                : promo.discountAmount || 0;

              return (
                <button
                  key={promo.id}
                  disabled={isFull && !isSelected}
                  onClick={() => handleSelect(promo)}
                  className={`w-full text-left rounded-xl p-4 transition-all duration-200 group
                    ${
                      isSelected
                        ? "bg-[#00897b]/10 dark:bg-[#00FFFF]/10 ring-2 ring-[#00897b] dark:ring-[#00FFFF] shadow-sm"
                        : isFull
                        ? "bg-gray-50 dark:bg-zinc-900 opacity-40 cursor-not-allowed"
                        : "bg-gray-50 dark:bg-white/[0.03] hover:bg-neon-purple/5 dark:hover:bg-neon-purple/5 hover:ring-1 hover:ring-neon-purple/40"
                    }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        {isSelected && (
                          <CheckCircleIcon
                            sx={{ fontSize: 16 }}
                            className="text-[#00897b] dark:text-[#00FFFF] shrink-0"
                          />
                        )}
                        <p
                          className={`font-bold text-sm truncate ${
                            isSelected
                              ? "text-[#00897b] dark:text-[#00FFFF]"
                              : "text-gray-900 dark:text-white"
                          }`}
                        >
                          {promo.name}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[10px] font-mono font-bold text-gray-400 bg-gray-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">
                          {promo.code}
                        </span>
                        <span className="text-[10px] text-gray-400 dark:text-gray-500">
                          Exp: {formatDate(promo.endDate)}
                        </span>
                        {promo.remaining !== null && (
                          <span className="text-[10px] text-gray-400 dark:text-gray-500">
                            · {promo.remaining} left
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#00897b] dark:text-[#00FFFF]/70 font-bold mt-1.5">
                        Save ~IDR {savedAmount.toLocaleString("id-ID")}
                      </p>
                    </div>

                    {/* Discount badge */}
                    <div
                      className={`shrink-0 rounded-lg px-3 py-2 text-center transition-all
                      ${
                        isSelected
                          ? "bg-[#00897b] dark:bg-[#00FFFF] text-white dark:text-black"
                          : "bg-neon-purple/10 dark:bg-neon-purple/20 text-neon-purple group-hover:bg-neon-purple group-hover:text-white"
                      }`}
                    >
                      <p className="font-black text-lg leading-none">{discountLabel}</p>
                      <p className="text-[8px] font-bold uppercase mt-0.5 opacity-70">OFF</p>
                    </div>
                  </div>

                  {isFull && !isSelected && (
                    <p className="text-[10px] text-red-500 font-bold mt-2">
                      Sold out
                    </p>
                  )}
                </button>
              );
            })}
          </div>

          {/* Remove promo option */}
          {appliedPromo && (
            <button
              onClick={() => {
                onRemove(eventId);
                setOpen(false);
              }}
              className="w-full mt-4 py-3 rounded-lg border border-dashed border-gray-200 dark:border-zinc-700 text-gray-400 dark:text-gray-500 font-bold text-xs hover:border-red-400 hover:text-red-500 dark:hover:border-red-500 dark:hover:text-red-400 transition-colors"
            >
              Don&apos;t use promo
            </button>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
