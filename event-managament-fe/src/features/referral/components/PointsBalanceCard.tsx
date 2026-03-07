import React from "react";
import { SavingsIcon, ScheduleIcon } from "./ReferralIcons";
import { PointsBalance } from "../types";

interface PointsBalanceCardProps {
  balance: PointsBalance;
}

const PointsBalanceCard: React.FC<PointsBalanceCardProps> = ({ balance }) => {
  const remainingPercentage = balance.totalEarned > 0
    ? Math.round((balance.current / balance.totalEarned) * 100)
    : 0;

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-[#a855f7] to-[#3b82f6] border-2 md:border-4 border-zinc-800 shadow-[2px_2px_0px_0px_#333333] md:shadow-[4px_4px_0px_0px_#333333] p-4 md:p-8 flex flex-col justify-between min-h-[240px] md:min-h-full group">
      {/* Background Effects */}
      <div className="absolute top-0 right-0 w-20 h-20 md:w-32 md:h-32 bg-[#00FFFF] rounded-full mix-blend-overlay filter blur-3xl opacity-30 group-hover:scale-150 transition-transform duration-700" />
      <div className="absolute bottom-0 left-0 w-24 h-24 md:w-40 md:h-40 bg-[#FF00FF] rounded-full mix-blend-overlay filter blur-3xl opacity-30 group-hover:scale-150 transition-transform duration-700" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-10" />

      {/* Header */}
      <div className="relative z-10 flex justify-between items-start gap-2">
        <div className="bg-black/40 backdrop-blur-md border border-white/10 px-2 md:px-4 py-1 md:py-2">
          <h3 className="font-black text-white text-sm md:text-xl uppercase italic tracking-wide flex items-center gap-1.5 md:gap-2">
            <span className="text-[#00FFFF] drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]">
              <SavingsIcon />
            </span>
            Balance
          </h3>
        </div>
      </div>

      {/* Points Display — Remaining */}
      <div className="relative z-10 py-2 md:py-4">
        <div className="mb-1">
          <span className="text-4xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-200 tracking-tighter drop-shadow-[2px_2px_0px_#000000] md:drop-shadow-[4px_4px_0px_#000000] leading-none">
            {balance.current.toLocaleString("id-ID")}
          </span>
          <span className="text-base md:text-xl font-bold text-white uppercase tracking-widest ml-2 drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]">
            pts
          </span>
        </div>
        <p className="text-[10px] md:text-xs font-bold uppercase text-white/60 tracking-widest">
          Remaining balance
        </p>
      </div>

      {/* Stats Row */}
      <div className="relative z-10 grid grid-cols-2 gap-2 md:gap-3 mb-3 md:mb-4">
        <div className="bg-black/30 backdrop-blur-sm border border-white/10 p-2 md:p-3">
          <p className="text-[9px] md:text-[10px] font-bold uppercase text-white/50 tracking-widest mb-0.5">
            Total Earned
          </p>
          <p className="font-black text-white text-sm md:text-lg leading-none">
            {balance.totalEarned.toLocaleString("id-ID")}
            <span className="text-[9px] md:text-xs font-bold ml-1 text-white/60">pts</span>
          </p>
        </div>
        <div className="bg-black/30 backdrop-blur-sm border border-white/10 p-2 md:p-3">
          <p className="text-[9px] md:text-[10px] font-bold uppercase text-white/50 tracking-widest mb-0.5">
            Used
          </p>
          <p className="font-black text-[#FF6B6B] text-sm md:text-lg leading-none">
            {balance.usedAmount.toLocaleString("id-ID")}
            <span className="text-[9px] md:text-xs font-bold ml-1 text-white/60">pts</span>
          </p>
        </div>
      </div>

      {/* Usage Progress Bar */}
      <div className="relative z-10 bg-black/50 backdrop-blur-sm border-2 border-zinc-700/50 p-2 md:p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)] md:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)]">
        <div className="flex justify-between text-xs md:text-sm font-black uppercase mb-1 md:mb-2 text-white">
          <span>Used</span>
          <span className="text-[#FF6B6B]">{balance.usedPercentage}%</span>
        </div>
        <div className="h-3 md:h-5 w-full bg-black/60 border-2 border-white/20 relative overflow-hidden mb-1 md:mb-2">
          {/* Remaining bar (cyan) */}
          <div
            className="h-full bg-[#00FFFF] border-r-2 border-black/40 shadow-[0_0_10px_rgba(6,182,212,0.5)] absolute left-0 top-0 transition-all duration-700"
            style={{
              width: `${remainingPercentage}%`,
              backgroundImage:
                "linear-gradient(45deg,rgba(0,0,0,.15) 25%,transparent 25%,transparent 50%,rgba(0,0,0,.15) 50%,rgba(0,0,0,.15) 75%,transparent 75%,transparent)",
              backgroundSize: "0.75rem 0.75rem",
            }}
          />
          {/* Used bar (red/pink) fills from the right */}
          {balance.usedPercentage > 0 && (
            <div
              className="h-full bg-[#FF6B6B]/70 absolute right-0 top-0 transition-all duration-700"
              style={{ width: `${balance.usedPercentage}%` }}
            />
          )}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[9px] md:text-[10px] font-bold text-white/60 uppercase">
            <span className="inline-block w-2 h-2 bg-[#00FFFF]" /> Remaining
            <span className="inline-block w-2 h-2 bg-[#FF6B6B]/70 ml-1" /> Used
          </div>
          <p className="text-[9px] md:text-[10px] font-bold text-gray-300 flex items-center gap-1 uppercase">
            <ScheduleIcon />
            {balance.expiresIn
              ? `Exp: ${balance.expiresIn}`
              : "No active points"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PointsBalanceCard;
