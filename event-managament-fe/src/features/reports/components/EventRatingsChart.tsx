"use client";

import React, { useMemo } from "react";
import { BarChart } from '@mui/x-charts/BarChart';
import { useEventRatings } from "../hooks/useReports";
import { useThemeStore } from "@/features/theme";

import { useTheme as useMuiTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

type Props = { categoryId?: string; startDate?: string; endDate?: string };

export const EventRatingsChart: React.FC<Props> = ({ categoryId, startDate, endDate }) => {
  const { data: rawDataset, isLoading } = useEventRatings(categoryId, startDate, endDate);
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));
  
  const dataset = useMemo(() => {
    if (!rawDataset) return [];
    return rawDataset.slice(0, 5); 
  }, [rawDataset]);

  const overallAvg = useMemo(() => {
    if (!rawDataset || rawDataset.length === 0) return 0;
    const sum = rawDataset.reduce((acc: number, item: any) => acc + item.rating, 0);
    return Number((sum / rawDataset.length).toFixed(2));
  }, [rawDataset]);

  const axisColor = isDark ? '#e8dce2' : '#181114';
  const gridColor = isDark ? '#3a1d2e' : '#f4f0f2';

  return (
    <div className="bg-white dark:bg-[#221019] p-4 md:p-6 rounded-xl md:rounded-2xl border border-[#f4f0f2] dark:border-[#3a1d2e] shadow-sm relative group flex flex-col">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3 md:mb-4">
        <div>
          <h3 className="text-sm md:text-lg font-bold text-[#181114] dark:text-white">Customer Satisfaction</h3>
          <p className="text-xs md:text-sm text-[#896175]">Average rating per event (1-5)</p>
        </div>
        <div className="text-left sm:text-right">
          <p className="text-lg md:text-2xl font-black text-[#facc15]">{overallAvg}</p>
          <p className="text-[10px] md:text-xs font-bold text-green-500">Overall Avg</p>
        </div>
      </div>
      
      {isLoading ? (
        <div className="h-[320px] w-full mt-4 flex items-center justify-center">
          <span className="loading loading-spinner text-primary"></span>
        </div>
      ) : dataset.length === 0 ? (
        <div className="h-[320px] w-full mt-4 flex items-center justify-center text-[#896175]">
          No reviews available.
        </div>
      ) : (
        <div className="h-[220px] md:h-[320px] w-full mt-2 md:mt-4">
          <BarChart
            dataset={dataset as any}
            yAxis={[{ scaleType: 'band', dataKey: 'event' }]}
            layout="horizontal"
            series={[
              { dataKey: 'rating', label: 'Avg Rating', color: '#facc15' }
            ]}
            margin={{ top: 10, bottom: 30, left: isMobile ? 60 : 90, right: 10 }}
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
