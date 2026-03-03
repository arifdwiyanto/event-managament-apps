"use client";

import React from "react";
import { Bars3BottomLeftIcon } from "@heroicons/react/24/outline";
import { useTransactionReports } from "../hooks/useReports";
import { formatCurrency } from "@/utils/formatCurrency";

// Helper for status classes
const getStatusBadgeClasses = (status: string, theme?: string) => {
  switch (status.toUpperCase()) {
    case 'PAID': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
    case 'PENDING': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
    case 'CANCELED': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
    default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
  }
};

type Props = { categoryId?: string; startDate?: string; endDate?: string };

export const TransactionReportsTable: React.FC<Props> = ({ categoryId, startDate, endDate }) => {
  // Hardcoding page 1 and limit 5 for dashboard summary view
  const { data, isLoading } = useTransactionReports(1, 5, categoryId, startDate, endDate);
  const transactions = data?.data || [];

  return (
    <div className="lg:col-span-3 bg-white dark:bg-[#221019] rounded-xl md:rounded-2xl border border-[#f4f0f2] dark:border-[#3a1d2e] shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-4 md:p-6 border-b border-[#f4f0f2] dark:border-[#3a1d2e] flex items-center justify-between">
        <h3 className="text-sm md:text-lg font-bold text-[#181114] dark:text-white">Recent Transactions</h3>
        <div className="flex gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#f8f6f7] dark:bg-[#2a1621] rounded-lg text-xs font-bold text-[#5f4351] cursor-pointer hover:bg-gray-100 dark:hover:bg-[#361e2b] transition-colors dark:text-gray-300">
            <Bars3BottomLeftIcon className="w-4 h-4" /> Filter
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-[#896175] uppercase bg-[#fcfbfc] dark:bg-[#2a1621] font-bold">
            <tr>
              <th className="px-6 py-4">Transaction ID</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Event</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Amount</th>
            </tr>
          </thead>
          
          <tbody className="divide-y divide-[#f4f0f2] dark:divide-[#3a1d2e]">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <span className="loading loading-spinner text-primary"></span>
                </td>
              </tr>
            ) : transactions.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-[#896175]">
                  No transactions found.
                </td>
              </tr>
            ) : (
              transactions.map((trx: any) => (
                <tr key={trx.id} className="bg-white dark:bg-[#221019] hover:bg-[#f8f6f7] dark:hover:bg-[#2a1621] transition-colors">
                  <td className="px-6 py-4 font-mono font-bold text-primary">
                    #{trx.invoice}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">
                        {trx.user.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-medium truncate dark:text-white">{trx.user.name}</span>
                        <span className="text-[10px] text-gray-500 truncate">{trx.user.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[#5f4351] dark:text-gray-300 truncate max-w-[200px]">
                    {trx.event.name}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold ${getStatusBadgeClasses(trx.status)}`}>
                      {trx.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[#5f4351] dark:text-gray-400 whitespace-nowrap">
                    {new Date(trx.transactionDate).toLocaleDateString('en-ID', {
                      day: 'numeric', month: 'short', year: 'numeric'
                    })}
                  </td>
                  <td className="px-6 py-4 font-bold text-[#181114] dark:text-white whitespace-nowrap">
                    {formatCurrency(trx.totalFinalPrice)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      <div className="p-4 border-t border-[#f4f0f2] dark:border-[#3a1d2e] flex items-center justify-center">
        <button className="text-sm font-bold text-primary hover:underline">
          View All Transactions
        </button>
      </div>
    </div>
  );
};
