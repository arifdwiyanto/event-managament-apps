// Dashboard Data Hooks
// Separate hooks for fetching and managing dashboard data
"use client"
import { useState, useEffect, useCallback } from "react";
import { 
  ChartFilter, 
  ChartDataPoint, 
  StatData, 
  ActiveEvent, 
  Transaction 
} from "../types";
import {
  fetchChartData,
  fetchStats,
  fetchReferral,
  fetchActiveEvents,
  fetchTransactions,
} from "../services/dashboardService";

// Hook for chart data with filter
export function useChartData(initialFilter: ChartFilter = "weekly") {
  const [filter, setFilter] = useState<ChartFilter>(initialFilter);
  const [data, setData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const chartData = await fetchChartData(filter);
      setData(chartData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch chart data"));
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return { data, filter, setFilter, loading, error, refetch: loadData };
}

// Hook for stats data
export function useStatsData() {
  const [stats, setStats] = useState<StatData[]>([]);
  const [referral, setReferral] = useState<{ signups: number; code: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [statsData, referralData] = await Promise.all([
        fetchStats(),
        fetchReferral(),
      ]);
      setStats(statsData);
      setReferral(referralData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch stats"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return { stats, referral, loading, error, refetch: loadData };
}

// Hook for active events
export function useActiveEvents() {
  const [events, setEvents] = useState<ActiveEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const eventsData = await fetchActiveEvents();
      setEvents(eventsData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch events"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return { events, loading, error, refetch: loadData };
}

// Hook for transactions
export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const transactionsData = await fetchTransactions();
      setTransactions(transactionsData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch transactions"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return { transactions, loading, error, refetch: loadData };
}
