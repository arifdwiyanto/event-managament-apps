"use client";

import React, { useMemo } from "react";
import { LineChart } from '@mui/x-charts/LineChart';
import { useCapacityVsSales } from "../hooks/useReports";
import { useThemeStore } from "@/features/theme";

type Props = { categoryId?: string; startDate?: string; endDate?: string };

export const TicketSalesComparisonChart: React.FC<Props> = ({ categoryId, startDate, endDate }) => {
  const { data: rawDataset, isLoading } = useCapacityVsSales(categoryId, startDate, endDate);
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const dataset = rawDataset || [];

  const fillRate = useMemo(() => {
    let totalCap = 0;
    let totalSold = 0;
    dataset.forEach(item => {
      totalCap += item.capacity;
      totalSold += item.sold;
    });

    if (totalCap === 0) return 0;
    return Math.round((totalSold / totalCap) * 100);
  }, [dataset]);

  const axisColor = isDark ? '#e8dce2' : '#181114';
  const gridColor = isDark ? '#3a1d2e' : '#f4f0f2';
  const capacityColor = isDark ? '#5a3d4d' : '#e6dbe0';

  return (
    <div className="w-full bg-white dark:bg-[#221019] p-4 md:p-6 rounded-xl md:rounded-2xl border border-[#f4f0f2] dark:border-[#3a1d2e] shadow-sm relative group flex flex-col">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3 md:mb-4">
        <div>
          <h3 className="text-sm md:text-lg font-bold text-[#181114] dark:text-white">Ticket Sales vs Capacity</h3>
          <p className="text-xs md:text-sm text-[#896175]">Average ticket realization per event</p>
        </div>
        <div className="text-left sm:text-right">
          <p className="text-lg md:text-2xl font-black text-primary">{fillRate}%</p>
          <p className="text-[10px] md:text-xs font-bold text-green-500">Average Fill Rate</p>
        </div>
      </div>

      {/* Custom Legend */}
      <div className="flex items-center gap-4 mb-2">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: capacityColor }}></div>
          <span className="text-xs font-medium text-[#5f4351] dark:text-[#b58b9f]">Total Capacity</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#ee2b8c' }}></div>
          <span className="text-xs font-medium text-[#5f4351] dark:text-[#b58b9f]">Tickets Sold</span>
        </div>
      </div>
      
      {isLoading ? (
        <div className="h-[320px] w-full flex items-center justify-center">
          <span className="loading loading-spinner text-primary"></span>
        </div>
      ) : dataset.length === 0 ? (
         <div className="h-[320px] w-full flex items-center justify-center text-[#896175]">
          No events available for comparison.
        </div>
      ) : (
        <div className="h-[220px] md:h-[320px] w-full">
          <LineChart
            dataset={dataset as any}
            xAxis={[{ scaleType: 'point', dataKey: 'event' }]}
            series={[
              { dataKey: 'capacity', label: 'Total Capacity', color: capacityColor },
              { dataKey: 'sold', label: 'Tickets Sold', color: '#ee2b8c' }
            ]}
            margin={{ top: 10, bottom: 30, left: 50, right: 10 }}
            slotProps={{
              legend: { hidden: true } as any
            }}
            sx={{
              '& .MuiChartsAxis-tickLabel': { fill: axisColor + ' !important' },
              '& .MuiChartsAxis-line': { stroke: gridColor + ' !important' },
              '& .MuiChartsAxis-tick': { stroke: gridColor + ' !important' },
              '& .MuiChartsGrid-line': { stroke: gridColor + ' !important' },
            }}
          />
        </div>
      )}
    </div>
  );
};
