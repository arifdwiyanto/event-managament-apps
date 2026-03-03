import React from "react";
import { SavingsIcon, ScheduleIcon } from "./ReferralIcons";
import { PointsBalance } from "../types";

interface PointsBalanceCardProps {
  balance: PointsBalance;
}

const PointsBalanceCard: React.FC<PointsBalanceCardProps> = ({ balance }) => (
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
      {/* <div className="bg-[#00FFFF] border-2 border-black px-2 md:px-3 py-0.5 md:py-1 transform rotate-2 shadow-[1px_1px_0px_0px_#ffffff] md:shadow-[2px_2px_0px_0px_#ffffff]">
        <span className="text-[10px] md:text-xs font-black uppercase text-black">Gold Tier</span>
      </div> */}
    </div>

    {/* Points Display */}
    <div className="relative z-10 py-2 md:py-6">
      <span className="text-5xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-200 tracking-tighter drop-shadow-[2px_2px_0px_#000000] md:drop-shadow-[4px_4px_0px_#000000] leading-none">
        {(balance.current / 1000).toFixed(0)}k
      </span>
      <span className="text-lg md:text-2xl font-bold text-white uppercase tracking-widest ml-1 drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]">
        Points
      </span>
    </div>

    {/* Progress Bar */}
    <div className="relative z-10 bg-black/50 backdrop-blur-sm border-2 border-zinc-700/50 p-2 md:p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)] md:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)]">
      <div className="flex justify-between text-xs md:text-sm font-black uppercase mb-1 md:mb-2 text-white">
        <span>Next: {balance.nextTier}</span>
        <span className="text-[#00FFFF]">{balance.nextTierProgress}%</span>
      </div>
      <div className="h-4 md:h-6 w-full bg-black/60 border-2 border-white/20 relative overflow-hidden">
        <div
          className="h-full bg-[#00FFFF] border-r-2 border-black shadow-[0_0_10px_rgba(6,182,212,0.5)]"
          style={{
            width: `${balance.nextTierProgress}%`,
            backgroundImage:
              "linear-gradient(45deg,rgba(0,0,0,.15) 25%,transparent 25%,transparent 50%,rgba(0,0,0,.15) 50%,rgba(0,0,0,.15) 75%,transparent 75%,transparent)",
            backgroundSize: "0.75rem 0.75rem",
          }}
        />
      </div>
      <p className="mt-2 md:mt-3 text-[10px] md:text-xs font-bold text-gray-300 flex items-center gap-1 uppercase">
        <ScheduleIcon />
        {balance.expiresIn
          ? `Expires in ${balance.expiresIn}`
          : "No active points"}
      </p>
    </div>
  </div>
);

export default PointsBalanceCard;
