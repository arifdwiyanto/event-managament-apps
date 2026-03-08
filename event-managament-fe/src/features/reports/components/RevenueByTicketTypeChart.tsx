"use client";

import React from "react";
import { BarChart } from '@mui/x-charts/BarChart';
import { useRevenueByTicketType } from "../hooks/useReports";
import { useThemeStore } from "@/features/theme";

import { useTheme as useMuiTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

type Props = { categoryId?: string; startDate?: string; endDate?: string };

export const RevenueByTicketTypeChart: React.FC<Props> = ({ categoryId, startDate, endDate }) => {
  const { data: rawDataset, isLoading } = useRevenueByTicketType(categoryId, startDate, endDate);
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));
  const dataset = rawDataset || [];

  const axisColor = isDark ? '#e8dce2' : '#181114';
  const gridColor = isDark ? '#3a1d2e' : '#f4f0f2';

  return (
    <div className="bg-white dark:bg-[#221019] p-3 md:p-4 rounded-xl md:rounded-2xl border border-[#f4f0f2] dark:border-[#3a1d2e] shadow-sm relative group flex flex-col">
      <div className="flex items-center justify-between mb-4 md:mb-10">
        <div>
          <h3 className="text-sm md:text-lg font-bold text-[#181114] dark:text-white">Revenue by Ticket Type</h3>
          <p className="text-xs md:text-sm text-[#896175]">Total revenue generated per tier</p>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex-1 min-h-[200px] w-full mt-4 flex items-center justify-center">
          <span className="loading loading-spinner text-primary"></span>
        </div>
      ) : dataset.length === 0 ? (
        <div className="flex-1 min-h-[200px] w-full mt-4 flex items-center justify-center text-[#896175]">
          No ticket revenue data.
        </div>
      ) : (
        <div className="flex-1 min-h-[300px] w-full">
          <BarChart
            dataset={dataset as any}
            xAxis={[{ scaleType: 'band', dataKey: 'type', categoryGapRatio: 0.5 }]}
            series={[
              { dataKey: 'revenue', label: 'Revenue', color: '#ee2b8c' }
            ]}
            height={300}
            margin={{ top: 10, bottom: 30, left: isMobile ? 35 : 60, right: 10 }}
            borderRadius={6}
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
