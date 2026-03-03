"use client";

import React from "react";
import { StatData } from "../types";
import { 
  TicketIcon, 
  CurrencyDollarIcon, 
  StarIcon, 
  UsersIcon,
  ArrowTrendingUpIcon,
  MinusIcon
} from "@heroicons/react/24/outline";

// Icon config
const ICON_CONFIG = {
  ticket: {
    icon: <TicketIcon className="w-4 h-4 md:w-6 md:h-6" />,
    bg: "bg-[#ee2b8c]/10",
    color: "text-[#ee2b8c]",
    bgIcon: TicketIcon,
    bgColor: "text-[#ee2b8c]",
  },
  payment: {
    icon: <CurrencyDollarIcon className="w-4 h-4 md:w-6 md:h-6" />,
    bg: "bg-[#8b5cf6]/10",
    color: "text-[#8b5cf6]",
    bgIcon: CurrencyDollarIcon,
    bgColor: "text-[#8b5cf6]",
  },
  star: {
    icon: <StarIcon className="w-4 h-4 md:w-6 md:h-6" />,
    bg: "bg-yellow-400/10",
    color: "text-yellow-500",
    bgIcon: StarIcon,
    bgColor: "text-yellow-400",
  },
  group: {
    icon: <UsersIcon className="w-4 h-4 md:w-6 md:h-6" />,
    bg: "bg-white/10",
    color: "text-white",
    bgIcon: UsersIcon,
    bgColor: "text-white",
  },
};

interface StatCardProps {
  stat: StatData;
}

const StatCard: React.FC<StatCardProps> = ({ stat }) => {
  const config = ICON_CONFIG[stat.iconType];

  return (
    <div className="bg-white dark:bg-[#221019] p-3 md:p-6 rounded-[20px] md:rounded-[32px] border border-[#f4f0f2] dark:border-[#3a1d2e] shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
      <div className="flex justify-between items-start gap-2 mb-2 md:mb-4 relative z-10">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] md:text-sm font-medium text-[#896175] mb-0.5 md:mb-1 truncate" title={stat.title}>{stat.title}</p>
          <h3 className="text-sm md:text-2xl font-black text-[#181114] dark:text-white truncate" title={stat.value}>{stat.value}</h3>
        </div>
        <div className={`size-7 md:size-10 shrink-0 rounded-full ${config.bg} flex items-center justify-center ${config.color} group-hover:scale-110 transition-transform`}>
          {config.icon}
        </div>
      </div>
      <div className="flex items-center gap-1 text-[10px] md:text-xs font-bold relative z-10">
        {stat.trend.isPositive === null ? (
          <>
            <span className="text-[#896175]"><MinusIcon className="w-3 h-3 md:w-4 md:h-4 stroke-2" /></span>
            <span className="text-[#896175]">{stat.trend.value}</span>
          </>
        ) : (
          <>
            <span className="text-green-500"><ArrowTrendingUpIcon className="w-3 h-3 md:w-4 md:h-4 stroke-2" /></span>
            <span className="text-green-500">{stat.trend.value}</span>
          </>
        )}
        <span className="text-[#896175] font-normal ml-1">vs last month</span>
      </div>
      
      {/* Background Watermark */}
      <config.bgIcon className={`absolute right-1 md:right-2 bottom-0 w-16 h-16 md:w-24 md:h-24 ${config.bgColor} opacity-10 pointer-events-none`} />
    </div>
  );
};

interface ReferralCardProps {
  signups: number;
  code: string;
}

const ReferralCard: React.FC<ReferralCardProps> = ({ signups, code }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gradient-to-br from-[#221019] to-[#3a1d2e] dark:from-[#ee2b8c]/20 dark:to-[#8b5cf6]/20 p-3 md:p-6 rounded-[20px] md:rounded-[32px] shadow-lg relative overflow-hidden text-white group">
      <div className="relative z-10">
        <div className="flex justify-between items-start gap-2 mb-2 md:mb-4">
          <div className="min-w-0 flex-1">
            <p className="text-[10px] md:text-sm font-medium text-white/70 mb-0.5 md:mb-1 truncate" title="Total Team Members">Total Team Members</p>
            <h3 className="text-sm md:text-2xl font-black text-white truncate" title={signups.toString()}>{signups.toLocaleString()}</h3>
          </div>
          <div className="size-7 md:size-10 shrink-0 rounded-full bg-white/10 flex items-center justify-center text-white backdrop-blur-sm group-hover:rotate-12 transition-transform">
            <UsersIcon className="w-4 h-4 md:w-6 md:h-6" />
          </div>
        </div>
        <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
          <span className="text-[10px] md:text-xs font-medium text-white/80">
            Org: <span className="font-bold text-white tracking-widest bg-white/20 px-1.5 md:px-2 py-0.5 md:py-1 rounded ml-1 text-[10px] md:text-xs">{code}</span>
          </span>
          <button 
            onClick={handleCopy}
            className="text-[10px] md:text-xs font-bold text-[#ee2b8c] bg-white px-2 md:px-3 py-0.5 md:py-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {copied ? "COPIED!" : "COPY"}
          </button>
        </div>
      </div>
      
      {/* Background Watermark */}
      <UsersIcon className="absolute right-1 md:right-2 bottom-1 md:bottom-2 w-14 h-14 md:w-20 md:h-20 text-white opacity-10 pointer-events-none" />
      
      {/* Blur Effects */}
      <div className="absolute top-0 right-0 w-20 h-20 md:w-32 md:h-32 bg-[#ee2b8c]/30 rounded-full blur-[40px] md:blur-[50px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-16 h-16 md:w-24 md:h-24 bg-[#8b5cf6]/30 rounded-full blur-[30px] md:blur-[40px] pointer-events-none"></div>
    </div>
  );
};

interface StatsSectionProps {
  stats: StatData[];
  referral: { signups: number; code: string } | null;
  loading?: boolean;
}

const StatsSection: React.FC<StatsSectionProps> = ({ stats, referral, loading = false }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-[#221019] p-3 md:p-6 rounded-[20px] md:rounded-[32px] border border-[#f4f0f2] dark:border-[#3a1d2e] animate-pulse h-24 md:h-32" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
      {stats.map((stat) => (
        <StatCard key={stat.id} stat={stat} />
      ))}
      {referral && <ReferralCard signups={referral.signups} code={referral.code} />}
    </div>
  );
};

export default StatsSection;
