"use client";

import React from "react";
import StatsSection from "./StatsSection";
import SalesChart from "./SalesChart";
import ActiveEventsList from "./ActiveEventsList";
import TransactionsTable from "./TransactionsTable";
import { 
  useChartData, 
  useStatsData, 
  useActiveEvents, 
  useTransactions 
} from "../hooks";

const DashboardView: React.FC = () => {
  // Data hooks - clean separation of concerns
  const { data: chartData, filter, setFilter, loading: chartLoading } = useChartData("weekly");
  const { stats, referral, loading: statsLoading } = useStatsData();
  const { events, loading: eventsLoading } = useActiveEvents();
  const { transactions, loading: transactionsLoading } = useTransactions();

  return (
    <main className="flex-1 overflow-y-auto p-3 md:p-6 lg:p-8 bg-[#fcfbfc] dark:bg-[#1a0c13]">
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6 lg:space-y-8">
        {/* Stats Cards */}
        <StatsSection 
          stats={stats} 
          referral={referral} 
          loading={statsLoading} 
        />

        {/* Charts & Events Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 lg:h-[440px]">
          <SalesChart 
            data={chartData} 
            filter={filter} 
            onFilterChange={setFilter}
            loading={chartLoading}
          />
          <ActiveEventsList 
            events={events} 
            loading={eventsLoading} 
          />
        </div>

        {/* Transactions Table */}
        <TransactionsTable 
          transactions={transactions} 
          loading={transactionsLoading} 
        />
      </div>

      {/* Footer */}
      <footer className="mt-8 md:mt-12 mb-4 md:mb-6 text-center text-[10px] md:text-xs text-[#896175]">
        <p>© 2024 Hype Events. All rights reserved.</p>
      </footer>
    </main>
  );
};

export default DashboardView;
