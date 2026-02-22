"use client";

import React from "react";
import { StatData } from "../types";

// Icons
const TicketIcon = () => (
  <svg className="w-4 h-4 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M22 10V6c0-1.11-.9-2-2-2H4c-1.1 0-1.99.89-1.99 2v4c1.1 0 1.99.9 1.99 2s-.89 2-2 2v4c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-4c-1.1 0-2-.9-2-2s.9-2 2-2zm-9 7.5h-2v-2h2v2zm0-4.5h-2v-2h2v2zm0-4.5h-2v-2h2v2z"/>
  </svg>
);

const PaymentIcon = () => (
  <svg className="w-4 h-4 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 14V6c0-1.1-.9-2-2-2H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zm-9-1c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm13-6v11c0 1.1-.9 2-2 2H4v-2h17V7h2z"/>
  </svg>
);

const StarIcon = () => (
  <svg className="w-4 h-4 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
  </svg>
);

const GroupIcon = () => (
  <svg className="w-4 h-4 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
  </svg>
);

const TrendUpIcon = () => (
  <svg className="w-3 h-3 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="m16 6 2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
  </svg>
);

const TrendNeutralIcon = () => (
  <svg className="w-3 h-3 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 13H5v-2h14v2z"/>
  </svg>
);

// Icon config
const ICON_CONFIG = {
  ticket: {
    icon: <TicketIcon />,
    bg: "bg-[#ee2b8c]/10",
    color: "text-[#ee2b8c]",
    bgPath: "M22 10V6c0-1.11-.9-2-2-2H4c-1.1 0-1.99.89-1.99 2v4c1.1 0 1.99.9 1.99 2s-.89 2-2 2v4c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-4c-1.1 0-2-.9-2-2s.9-2 2-2zm-9 7.5h-2v-2h2v2zm0-4.5h-2v-2h2v2zm0-4.5h-2v-2h2v2z",
    bgColor: "text-[#ee2b8c]",
  },
  payment: {
    icon: <PaymentIcon />,
    bg: "bg-[#8b5cf6]/10",
    color: "text-[#8b5cf6]",
    bgPath: "M19 14V6c0-1.1-.9-2-2-2H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zm-9-1c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm13-6v11c0 1.1-.9 2-2 2H4v-2h17V7h2z",
    bgColor: "text-[#8b5cf6]",
  },
  star: {
    icon: <StarIcon />,
    bg: "bg-yellow-400/10",
    color: "text-yellow-500",
    bgPath: "M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z",
    bgColor: "text-yellow-400",
  },
  group: {
    icon: <GroupIcon />,
    bg: "bg-white/10",
    color: "text-white",
    bgPath: "M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z",
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
            <span className="text-[#896175]"><TrendNeutralIcon /></span>
            <span className="text-[#896175]">{stat.trend.value}</span>
          </>
        ) : (
          <>
            <span className="text-green-500"><TrendUpIcon /></span>
            <span className="text-green-500">{stat.trend.value}</span>
          </>
        )}
        <span className="text-[#896175] font-normal ml-1">vs last month</span>
      </div>
      
      {/* Background Watermark */}
      <svg 
        className={`absolute right-1 md:right-2 bottom-0 w-16 h-16 md:w-24 md:h-24 ${config.bgColor} opacity-30 pointer-events-none`}
        fill="currentColor" 
        viewBox="0 0 24 24"
      >
        <path d={config.bgPath} />
      </svg>
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
            <GroupIcon />
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
      <svg 
        className="absolute right-1 md:right-2 bottom-1 md:bottom-2 w-14 h-14 md:w-20 md:h-20 text-white opacity-30 pointer-events-none"
        fill="currentColor" 
        viewBox="0 0 24 24"
      >
        <path d={ICON_CONFIG.group.bgPath} />
      </svg>
      
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
