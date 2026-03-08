import { useQuery } from '@tanstack/react-query';
import { ReportService } from "../services/report.service";

export const useSalesPerformance = (interval: 'day' | 'month' | 'year' = 'day', startDate?: string, endDate?: string, categoryId?: string) => {
  return useQuery({
    queryKey: ['reports', 'sales-performance', interval, startDate, endDate, categoryId],
    queryFn: () => ReportService.getSalesPerformance(interval, startDate, endDate, categoryId),
    staleTime: 5 * 60 * 1000,
  });
};

export const useSalesByCategory = (categoryId?: string, startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: ['reports', 'sales-by-category', categoryId, startDate, endDate],
    queryFn: () => ReportService.getSalesByCategory(categoryId, startDate, endDate),
    staleTime: 5 * 60 * 1000,
  });
};

export const useTransactionReports = (page: number = 1, limit: number = 10, categoryId?: string, startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: ['reports', 'transactions', page, limit, categoryId, startDate, endDate],
    queryFn: () => ReportService.getTransactionReports(page, limit, categoryId, startDate, endDate),
    staleTime: 1 * 60 * 1000,
  });
};

export const useTopEvents = (limit: number = 5, categoryId?: string, startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: ['reports', 'top-events', limit, categoryId, startDate, endDate],
    queryFn: () => ReportService.getTopEvents(limit, categoryId, startDate, endDate),
    staleTime: 5 * 60 * 1000,
  });
};

export const useCapacityVsSales = (categoryId?: string, startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: ['reports', 'capacity-vs-sales', categoryId, startDate, endDate],
    queryFn: () => ReportService.getCapacityVsSales(categoryId, startDate, endDate),
    staleTime: 5 * 60 * 1000,
  });
};

export const usePromotionEffectiveness = (categoryId?: string, startDate?: string, endDate?: string, interval: 'day' | 'month' | 'year' = 'month') => {
  return useQuery({
    queryKey: ['reports', 'promotion-effectiveness', categoryId, startDate, endDate, interval],
    queryFn: () => ReportService.getPromotionEffectiveness(categoryId, startDate, endDate, interval),
    staleTime: 5 * 60 * 1000,
  });
};

export const useTransactionStatusDistribution = (categoryId?: string, startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: ['reports', 'transaction-status', categoryId, startDate, endDate],
    queryFn: () => ReportService.getTransactionStatusDistribution(categoryId, startDate, endDate),
    staleTime: 2 * 60 * 1000,
  });
};

export const useEventRatings = (categoryId?: string, startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: ['reports', 'event-ratings', categoryId, startDate, endDate],
    queryFn: () => ReportService.getEventRatings(categoryId, startDate, endDate),
    staleTime: 10 * 60 * 1000,
  });
};

export const useRevenueByTicketType = (categoryId?: string, startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: ['reports', 'revenue-by-ticket-type', categoryId, startDate, endDate],
    queryFn: () => ReportService.getRevenueByTicketType(categoryId, startDate, endDate),
    staleTime: 5 * 60 * 1000,
  });
};
