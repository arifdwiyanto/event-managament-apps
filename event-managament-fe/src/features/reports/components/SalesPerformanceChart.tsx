"use client";

import React, { useMemo } from "react";
import { BarChart } from '@mui/x-charts/BarChart';
import { useSalesPerformance } from "../hooks/useReports";
import { formatCurrency } from "@/utils/formatCurrency";
import { useThemeStore } from "@/features/theme";
import { 
  format, 
  parseISO, 
  eachDayOfInterval, 
  eachMonthOfInterval, 
  eachYearOfInterval, 
  subDays, 
  subMonths, 
  subYears,
  isSameDay,
  isSameMonth,
  isSameYear
} from "date-fns";

import { useTheme as useMuiTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

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
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));

  const dataset = useMemo(() => {
    // Determine range
    const now = new Date();
    let start = startDate ? parseISO(startDate) : null;
    let end = endDate ? parseISO(endDate) : null;

    if (!start || !end) {
      if (interval === 'day') {
        start = subDays(now, 6);
        end = now;
      } else if (interval === 'month') {
        start = new Date(now.getFullYear(), 0, 1);
        end = new Date(now.getFullYear(), 11, 31);
      } else {
        start = subYears(now, 4);
        end = now;
      }
    }

    // Generate sequence
    let sequence: Date[] = [];
    try {
      if (interval === 'day') sequence = eachDayOfInterval({ start, end });
      else if (interval === 'month') sequence = eachMonthOfInterval({ start, end });
      else sequence = eachYearOfInterval({ start, end });
    } catch (e) {
      console.error("Interval error:", e);
      return [];
    }

    // Merge with raw data
    return sequence.map(dateObj => {
      const match = rawDataset?.find((item: any) => {
        const itemDate = parseISO(item.date);
        if (interval === 'day') return isSameDay(itemDate, dateObj);
        if (interval === 'month') return isSameMonth(itemDate, dateObj);
        return isSameYear(itemDate, dateObj);
      });

      let label = "";
      if (interval === 'day') label = format(dateObj, "EEEE");
      else if (interval === 'month') label = format(dateObj, "MMM");
      else label = format(dateObj, "yyyy");

      return {
        date: format(dateObj, 'yyyy-MM-dd'),
        revenue: match ? Number(match.revenue) : 0,
        label
      };
    });
  }, [rawDataset, interval, startDate, endDate]);

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
      ) : (
        <div className="h-[300px] md:h-[400px] w-full mt-2 md:mt-4">
          <BarChart
            dataset={dataset as any}
            xAxis={[{ 
              scaleType: 'band', 
              dataKey: 'label',
              tickLabelInterval: () => true
            }]}
            series={[
              { dataKey: 'revenue', label: 'Revenue', color: '#ee2b8c' }
            ]}
            margin={{ top: 20, bottom: 20, left: isMobile ? 35 : 60, right: 10 }}
            borderRadius={4}
            slotProps={{
              legend: { hidden: true } as any
            }}
          />
        </div>
      )}
    </div>
  );
};
