"use client";

import React, { useMemo } from "react";
import { BarChart } from '@mui/x-charts/BarChart';
import { useSalesPerformance } from "../hooks/useReports";
import { formatCurrency } from "@/utils/formatCurrency";
import { useThemeStore } from "@/features/theme";

type SalesPerformanceChartProps = {
  interval: 'day' | 'month' | 'year';
  categoryId?: string;
  startDate?: string;
  endDate?: string;
};

export const SalesPerformanceChart: React.FC<SalesPerformanceChartProps> = ({ interval, categoryId, startDate, endDate }) => {
  const { data: rawDataset, isLoading } = useSalesPerformance(interval, startDate, endDate, categoryId);
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const dataset = rawDataset || [];

  const totalRevenue = useMemo(() => {
    return dataset.reduce((sum: number, item: any) => sum + item.revenue, 0);
  }, [dataset]);

  const axisColor = isDark ? '#e8dce2' : '#181114';
  const gridColor = isDark ? '#3a1d2e' : '#f4f0f2';

  return (
    <div className="lg:col-span-2 bg-white dark:bg-[#221019] p-4 md:p-6 rounded-xl md:rounded-2xl border border-[#f4f0f2] dark:border-[#3a1d2e] shadow-sm relative group flex flex-col">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3 md:mb-4">
        <div>
          <h3 className="text-sm md:text-lg font-bold text-[#181114] dark:text-white">Sales Performance</h3>
          <p className="text-xs md:text-sm text-[#896175]">
            Total revenue generated {interval === 'day' ? 'daily' : interval === 'month' ? 'monthly' : 'yearly'}
          </p>
        </div>
        <div className="text-left sm:text-right">
          <p className="text-lg md:text-2xl font-black text-primary">{formatCurrency(totalRevenue)}</p>
          <p className="text-[10px] md:text-xs font-bold text-green-500">+14.2% from last period</p>
        </div>
      </div>
      
      {isLoading ? (
        <div className="h-[320px] w-full mt-4 flex items-center justify-center">
          <span className="loading loading-spinner text-primary"></span>
        </div>
      ) : dataset.length === 0 ? (
        <div className="h-[320px] w-full mt-4 flex items-center justify-center text-[#896175]">
          No sales data available for this period.
        </div>
      ) : (
        <div className="h-[220px] md:h-[320px] w-full mt-2 md:mt-4">
          <BarChart
            dataset={dataset as any}
            xAxis={[{ scaleType: 'band', dataKey: 'date' }]}
            series={[
              { dataKey: 'revenue', label: 'Revenue', color: '#ee2b8c' }
            ]}
            margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
            borderRadius={4}
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
