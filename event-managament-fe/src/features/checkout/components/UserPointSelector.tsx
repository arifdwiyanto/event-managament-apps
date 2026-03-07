"use client";

import React from "react";
import { Typography, Box, Button, Divider } from "@mui/material";
import { SavingsIcon } from "@/features/referral/components/ReferralIcons";

interface UserPointSelectorProps {
  balance: number;
  selectedPercentage: number;
  onSelectPercentage: (percentage: number) => void;
}

const PERCENTAGES = [0, 10, 25, 50, 75, 100];

export const UserPointSelector: React.FC<UserPointSelectorProps> = ({
  balance,
  selectedPercentage,
  onSelectPercentage,
}) => {
  const discountAmount = (balance * selectedPercentage) / 100;

  return (
    <div className="border-4 border-black dark:border-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)] bg-white dark:bg-[#0a0a0a]">
      <Box className="flex items-center gap-3 mb-4">
        <div className="bg-[#00FFFF] text-black p-2 border-2 border-black shadow-[2px_2px_0px_0px_#000]">
          <SavingsIcon />
        </div>
        <div>
          <Typography className="font-display font-black uppercase text-xl leading-none text-black dark:text-white">
            Use Your Points
          </Typography>
          <Typography className="text-[10px] font-bold uppercase text-gray-500 tracking-widest mt-1">
            Valid Balance: {balance.toLocaleString("id-ID")} Points
          </Typography>
        </div>
      </Box>

      <Divider className="border-black dark:border-white/20 border-[1.5px] mb-6" />

      <Box className="grid grid-cols-3 gap-3">
        {PERCENTAGES.map((pct) => (
          <Button
            key={pct}
            onClick={() => onSelectPercentage(pct)}
            className={`border-2 border-black font-black uppercase transition-all ${
              selectedPercentage === pct
                ? "bg-neon-magenta text-white shadow-[2px_2px_0px_0px_#000] translate-y-[-2px] translate-x-[-2px]"
                : "bg-white text-black hover:bg-gray-100 shadow-[2px_2px_0px_0px_#000] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none"
            }`}
            sx={{
              borderRadius: 0,
              minWidth: 0,
              py: 1,
              fontSize: "0.75rem",
              letterSpacing: "0.05em",
            }}
          >
            {pct}%
          </Button>
        ))}
      </Box>

      {selectedPercentage > 0 && (
        <Box className="mt-6 p-3 bg-neon-purple/10 border-2 border-dashed border-neon-purple">
          <Typography className="text-center font-black uppercase text-xs text-neon-purple dark:text-purple-400">
            Selected Discount: - IDR {discountAmount.toLocaleString("id-ID")}
          </Typography>
        </Box>
      )}
    </div>
  );
};
