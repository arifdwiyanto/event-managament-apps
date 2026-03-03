"use client";

import React, { useMemo } from "react";
import { PieChart } from '@mui/x-charts/PieChart';
import { useThemeStore } from "@/features/theme";
import { useSalesByCategory } from "../hooks/useReports";

// Helper function to assign consistent colors to categories if backend doesn't provide them
const getColorForCategory = (index: number, theme: string) => {
  const colors = [
    '#ee2b8c', // Primary Pink
    theme === 'dark' ? '#b58b9f' : '#896175', // Secondary subtle
    '#facc15', // Yellow
    '#10b981', // Green
    '#3b82f6', // Blue
  ];
  return colors[index % colors.length];
};

type Props = { categoryId?: string; startDate?: string; endDate?: string };

export const TicketSalesByCategoryChart: React.FC<Props> = ({ categoryId, startDate, endDate }) => {
  const { theme } = useThemeStore();
  const { data: rawData, isLoading } = useSalesByCategory(categoryId, startDate, endDate);

  const chartData = useMemo(() => {
    if (!rawData) return [];
    return rawData.map((item: any, index: number) => ({
      ...item,
      color: getColorForCategory(index, theme)
    }));
  }, [rawData, theme]);

  const totalSales = useMemo(() => {
    return chartData.reduce((sum: number, item: any) => sum + item.value, 0);
  }, [chartData]);

  return (
    <div className="bg-white dark:bg-[#221019] p-4 md:p-6 rounded-xl md:rounded-2xl border border-[#f4f0f2] dark:border-[#3a1d2e] shadow-sm flex flex-col">
      <h3 className="text-sm md:text-lg font-bold text-[#181114] dark:text-white mb-1">Ticket Sales</h3>
      <p className="text-xs md:text-sm text-[#896175] mb-3 md:mb-4">By Event Category</p>
      
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <span className="loading loading-spinner text-primary"></span>
        </div>
      ) : chartData.length === 0 ? (
         <div className="flex-1 flex items-center justify-center text-[#896175] text-sm">
          No category data available.
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center relative">
          <div className="h-[200px] w-full flex items-center justify-center -ml-4">
            <PieChart
              series={[
                {
                  data: chartData,
                  innerRadius: 60,
                  outerRadius: 100,
                  paddingAngle: 5,
                  cornerRadius: 5,
                },
              ]}
              height={200}
              slotProps={{
                legend: { hidden: true } as any
              }}
            />
          </div>
          
          {/* Dynamic Custom Legend */}
          <div className="mt-8 w-full space-y-3 max-h-[120px] overflow-y-auto pr-2 custom-scrollbar">
            {chartData.map((item: any) => {
              const percentage = totalSales > 0 ? Math.round((item.value / totalSales) * 100) : 0;
              return (
                <div key={item.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="size-3 rounded-full flex-shrink-0" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm font-medium truncate max-w-[120px] text-[#181114] dark:text-[#e8dce2]">{item.label}</span>
                  </div>
                  <span className="text-sm font-bold whitespace-nowrap text-[#181114] dark:text-[#e8dce2]">
                    {item.value} ({percentage}%)
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
