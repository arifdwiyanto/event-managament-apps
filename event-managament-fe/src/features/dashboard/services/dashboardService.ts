// Dashboard Data Service
import { ChartFilter, ChartDataPoint } from "../types";
import apiFetch from "@/services/apiFetch";

export async function fetchChartData(filter: ChartFilter): Promise<ChartDataPoint[]> {
  const response = await apiFetch.get(`/dashboard/chart-data?filter=${filter}`);
  return response.data;
}

export async function fetchStats() {
  const response = await apiFetch.get("/dashboard/stats");
  return response.data;
}

export async function fetchReferral() {
  const response = await apiFetch.get("/dashboard/team-info");
  return response.data;
}

export async function fetchActiveEvents() {
  const response = await apiFetch.get("/dashboard/active-events");
  return response.data;
}

export async function fetchTransactions() {
  const response = await apiFetch.get("/dashboard/transactions");
  return response.data;
}
