"use client";

import React, { useState } from "react";
import { ReportHeader } from "./ReportHeader";
import { ReportFilters } from "./ReportFilters";
import { SalesPerformanceChart } from "./SalesPerformanceChart";
import { TicketSalesByCategoryChart } from "./TicketSalesByCategoryChart";
import { TransactionReportsTable } from "./TransactionReportsTable";
import { TopEventsList } from "./TopEventsList";
import { TicketSalesComparisonChart } from "./TicketSalesComparisonChart";
import { PromotionEffectivenessChart } from "./PromotionEffectivenessChart";
import { TransactionStatusChart } from "./TransactionStatusChart";
import { EventRatingsChart } from "./EventRatingsChart";
import { RevenueByTicketTypeChart } from "./RevenueByTicketTypeChart";

export const ReportView: React.FC = () => {
  const [interval, setInterval] = useState<'day' | 'month' | 'year'>('day');
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined);
  const [startDate, setStartDate] = useState<string | undefined>(undefined);
  const [endDate, setEndDate] = useState<string | undefined>(undefined);

  return (
    <main className="flex-1 overflow-y-auto p-3 md:p-6 lg:p-8 bg-[#fcfbfc] dark:bg-[#1a0c13]">
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6 lg:space-y-8">
        <ReportHeader />
        <ReportFilters 
          interval={interval} 
          onIntervalChange={setInterval} 
          categoryId={categoryId}
          onCategoryChange={setCategoryId}
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
        />

        {/* Charts Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <SalesPerformanceChart interval={interval} categoryId={categoryId} startDate={startDate} endDate={endDate} />
          <TicketSalesByCategoryChart categoryId={categoryId} startDate={startDate} endDate={endDate} />
        </div>

        {/* Comparison Charts Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <TicketSalesComparisonChart categoryId={categoryId} startDate={startDate} endDate={endDate} />
          <PromotionEffectivenessChart categoryId={categoryId} startDate={startDate} endDate={endDate} />
        </div>

        {/* Additional Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <TransactionStatusChart categoryId={categoryId} startDate={startDate} endDate={endDate} />
          <EventRatingsChart categoryId={categoryId} startDate={startDate} endDate={endDate} />
        </div>

        {/* Revenue By Ticket Type — Full Width */}
        <RevenueByTicketTypeChart categoryId={categoryId} startDate={startDate} endDate={endDate} />

        {/* Tables and List Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <TransactionReportsTable categoryId={categoryId} startDate={startDate} endDate={endDate} />
          <TopEventsList categoryId={categoryId} startDate={startDate} endDate={endDate} />
        </div>
      </div>
    </main>
  );
};
