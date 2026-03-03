"use client";

import React, { useMemo } from "react";
import { PieChart } from '@mui/x-charts/PieChart';
import { useThemeStore } from "@/features/theme";
import { useTransactionStatusDistribution } from "../hooks/useReports";

// Helper for status colors
const getStatusColor = (status: string, theme: string) => {
  switch (status.toUpperCase()) {
    case 'PAID': return '#10b981'; // Green
    case 'PENDING': return '#f59e0b'; // Amber
    case 'CANCELED': return '#ef4444'; // Red
    case 'REFUNDED': return theme === 'dark' ? '#b58b9f' : '#896175'; // Muted pink/gray
    default: return '#6b7280'; // Gray
  }
};

type Props = { categoryId?: string; startDate?: string; endDate?: string };

export const TransactionStatusChart: React.FC<Props> = ({ categoryId, startDate, endDate }) => {
  const { theme } = useThemeStore();
  const { data: rawData, isLoading } = useTransactionStatusDistribution(categoryId, startDate, endDate);

  const chartData = useMemo(() => {
    if (!rawData) return [];
    return rawData.map((item: any) => ({
      ...item,
      color: getStatusColor(item.label, theme)
    }));
  }, [rawData, theme]);

  const totalTransactions = useMemo(() => {
    return chartData.reduce((sum: number, item: any) => sum + item.value, 0);
  }, [chartData]);

  return (
    <div className="bg-white dark:bg-[#221019] p-4 md:p-6 rounded-xl md:rounded-2xl border border-[#f4f0f2] dark:border-[#3a1d2e] shadow-sm flex flex-col">
      <h3 className="text-sm md:text-lg font-bold text-[#181114] dark:text-white mb-1">Transaction Success Rate</h3>
      <p className="text-xs md:text-sm text-[#896175] mb-3 md:mb-4">By transaction status</p>
      
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <span className="loading loading-spinner text-primary"></span>
        </div>
      ) : chartData.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-[#896175] text-sm">
          No transaction data available.
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
          
          {/* Custom Legend */}
          <div className="mt-8 w-full space-y-3 max-h-[120px] overflow-y-auto pr-2 custom-scrollbar">
            {chartData.map((item: any) => {
              const percentage = totalTransactions > 0 ? Math.round((item.value / totalTransactions) * 100) : 0;
              return (
                <div key={item.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="size-3 rounded-full flex-shrink-0" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm font-medium text-[#181114] dark:text-[#e8dce2]">{item.label}</span>
                  </div>
                  <span className="text-sm font-bold text-[#181114] dark:text-[#e8dce2]">
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
