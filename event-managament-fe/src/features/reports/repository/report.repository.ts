import apiFetch from "@/services/apiFetch";
import { 
  ReportApiResponse,
  SalesPerformanceData,
  SalesByCategoryData,
  TransactionReportData,
  PaginatedResponse,
  TopEventData,
  CapacityVsSalesData,
  PromotionEffectivenessData,
  TransactionStatusData,
  EventRatingsData,
  RevenueByTicketTypeData
} from "../types/report.types";

// Helper to build query string from params
function buildParams(params: Record<string, string | number | undefined>): string {
  const p = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') p.append(k, String(v));
  });
  return p.toString();
}

export const getSalesPerformance = async (interval: 'day' | 'month' | 'year' = 'day', startDate?: string, endDate?: string, categoryId?: string) => {
  const qs = buildParams({ interval, startDate, endDate, categoryId });
  const response = await apiFetch.get<ReportApiResponse<SalesPerformanceData[]>>(`/reports/sales-performance?${qs}`);
  return response.data;
};

export const getSalesByCategory = async (categoryId?: string, startDate?: string, endDate?: string) => {
  const qs = buildParams({ categoryId, startDate, endDate });
  const response = await apiFetch.get<ReportApiResponse<SalesByCategoryData[]>>(`/reports/sales-by-category?${qs}`);
  return response.data;
};

export const getTransactionReports = async (page: number = 1, limit: number = 10, categoryId?: string, startDate?: string, endDate?: string) => {
  const qs = buildParams({ page, limit, categoryId, startDate, endDate });
  const response = await apiFetch.get<PaginatedResponse<TransactionReportData>>(`/reports/transactions?${qs}`);
  return response.data;
};

export const getTopEvents = async (limit: number = 5, categoryId?: string, startDate?: string, endDate?: string) => {
  const qs = buildParams({ limit, categoryId, startDate, endDate });
  const response = await apiFetch.get<ReportApiResponse<TopEventData[]>>(`/reports/top-events?${qs}`);
  return response.data;
};

export const getCapacityVsSales = async (categoryId?: string, startDate?: string, endDate?: string) => {
  const qs = buildParams({ categoryId, startDate, endDate });
  const response = await apiFetch.get<ReportApiResponse<CapacityVsSalesData[]>>(`/reports/capacity-vs-sales?${qs}`);
  return response.data;
};

export const getPromotionEffectiveness = async (categoryId?: string, startDate?: string, endDate?: string) => {
  const qs = buildParams({ categoryId, startDate, endDate });
  const response = await apiFetch.get<ReportApiResponse<PromotionEffectivenessData[]>>(`/reports/promotion-effectiveness?${qs}`);
  return response.data;
};

export const getTransactionStatusDistribution = async (categoryId?: string, startDate?: string, endDate?: string) => {
  const qs = buildParams({ categoryId, startDate, endDate });
  const response = await apiFetch.get<ReportApiResponse<TransactionStatusData[]>>(`/reports/transaction-status?${qs}`);
  return response.data;
};

export const getEventRatings = async (categoryId?: string, startDate?: string, endDate?: string) => {
  const qs = buildParams({ categoryId, startDate, endDate });
  const response = await apiFetch.get<ReportApiResponse<EventRatingsData[]>>(`/reports/event-ratings?${qs}`);
  return response.data;
};

export const getRevenueByTicketType = async (categoryId?: string, startDate?: string, endDate?: string) => {
  const qs = buildParams({ categoryId, startDate, endDate });
  const response = await apiFetch.get<ReportApiResponse<RevenueByTicketTypeData[]>>(`/reports/revenue-by-ticket-type?${qs}`);
  return response.data;
};
