"use client";

import React, { useState, useEffect } from "react";
import { ChartDataPoint, ChartFilter } from "../types";

interface SalesChartProps {
  data: ChartDataPoint[];
  filter: ChartFilter;
  onFilterChange: (filter: ChartFilter) => void;
  loading?: boolean;
}

const FILTERS: ChartFilter[] = ["weekly", "monthly", "yearly"];

const SalesChart: React.FC<SalesChartProps> = ({ 
  data, 
  filter, 
  onFilterChange, 
  loading = false 
}) => {
  // Find the initially highlighted point from backend, or default to the last one
  const initialActive = data.find(d => d.isHighlight) || data[data.length - 1];
  const [activePoint, setActivePoint] = useState<ChartDataPoint | null>(null);

  // Update active point when data changes (e.g. filter change)
  useEffect(() => {
    if (data.length > 0) {
      setActivePoint(data.find(d => d.isHighlight) || data[data.length - 1]);
    }
  }, [data]);

  return (
    <div className="lg:col-span-2 bg-white dark:bg-[#221019] p-4 md:p-6 rounded-[24px] md:rounded-[32px] border border-[#f4f0f2] dark:border-[#3a1d2e] shadow-sm flex flex-col h-full min-h-0 overflow-hidden">
      <div className="shrink-0 flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 md:mb-4 gap-3 md:gap-4">
        <div>
          <h3 className="text-base md:text-lg font-bold text-[#181114] dark:text-white">Sales Overview</h3>
          <p className="text-xs md:text-sm text-[#896175]">Transaction volume over time</p>
        </div>
        <div className="flex bg-[#f8f6f7] dark:bg-[#2a1621] p-1 rounded-lg">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => onFilterChange(f)}
              className={`px-2 md:px-3 py-1 text-[10px] md:text-xs font-medium rounded-md capitalize transition-colors ${
                filter === f
                  ? "bg-white dark:bg-[#3a1d2e] shadow-sm text-[#181114] dark:text-white font-bold"
                  : "text-[#896175] hover:text-[#181114] dark:hover:text-white"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col w-full min-h-[260px] lg:min-h-0 mt-4">
        {/* Chart Area */}
        <div className="flex-1 w-full relative">
          {/* Grid Lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none z-0">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-full h-px bg-gray-100 dark:bg-gray-800 border-dashed"></div>
            ))}
          </div>

          {/* Loading Overlay */}
          {loading && (
            <div className="absolute inset-0 bg-white/50 dark:bg-[#221019]/50 flex items-center justify-center z-20">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#ee2b8c] border-t-transparent"></div>
            </div>
          )}

          {/* Bars */}
          <div className="absolute inset-0 z-10 w-full h-full flex items-end justify-between gap-2 md:gap-4 pt-12 text-center" onMouseLeave={() => {
            // Restore to actual current period when mouse leaves chart area
            const current = data.find(d => d.isHighlight);
            if (current) setActivePoint(current);
          }}>
            {data.map((item, index) => {
              const isCurrentlyActive = activePoint?.label === item.label;
              return (
              <div
                key={`${item.label}-${index}`}
                onMouseEnter={() => setActivePoint(item)}
                onClick={() => setActivePoint(item)}
                className={`flex-1 min-w-0 rounded-t-[12px] md:rounded-t-[20px] relative group transition-all cursor-pointer ${
                  isCurrentlyActive
                    ? "bg-gradient-to-t from-[#ee2b8c] to-[#8b5cf6] shadow-lg shadow-[#ee2b8c]/20"
                    : index % 2 === 0
                    ? "bg-[#ee2b8c]/10 hover:bg-[#ee2b8c]/20"
                    : "bg-[#8b5cf6]/10 hover:bg-[#8b5cf6]/20"
                }`}
                style={{ height: item.height }}
              >
                <div 
                  className={`absolute -top-6 md:-top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[9px] md:text-xs px-1.5 md:px-2 py-0.5 md:py-1 rounded shadow-md whitespace-nowrap z-20 transition-opacity duration-200 ${isCurrentlyActive ? "opacity-100" : "opacity-0"}`}
                >
                  IDR {item.value}M
                </div>
              </div>
            )})}
          </div>
        </div>

        {/* Labels */}
        <div className="shrink-0 flex justify-between text-[8px] md:text-xs text-[#896175] mt-4 font-medium px-1 md:px-2">
          {data.map((item, index) => (
            <span key={`label-${item.label}-${index}`} className="truncate flex-1 text-center min-w-0">
              {item.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SalesChart;
