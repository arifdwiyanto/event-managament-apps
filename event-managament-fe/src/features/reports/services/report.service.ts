import * as ReportRepository from "../repository/report.repository";

export class ReportService {
  static async getSalesPerformance(interval: 'day' | 'month' | 'year' = 'day', startDate?: string, endDate?: string, categoryId?: string) {
    const res = await ReportRepository.getSalesPerformance(interval, startDate, endDate, categoryId);
    if (!res.success) throw new Error(res.message || "Failed to fetch sales performance");
    return res.data || [];
  }

  static async getSalesByCategory(categoryId?: string, startDate?: string, endDate?: string) {
    const res = await ReportRepository.getSalesByCategory(categoryId, startDate, endDate);
    if (!res.success) throw new Error(res.message || "Failed to fetch sales by category");
    return res.data || [];
  }

  static async getTransactionReports(page: number = 1, limit: number = 10, categoryId?: string, startDate?: string, endDate?: string) {
    const res = await ReportRepository.getTransactionReports(page, limit, categoryId, startDate, endDate);
    // @ts-ignore - The response shape from backend for pagination spreads data/meta
    if (res.success === false) throw new Error("Failed to fetch transactions");
    return {
      data: res.data || [],
      meta: res.meta || { page: 1, limit: 10, total: 0 }
    };
  }

  static async getTopEvents(limit: number = 5, categoryId?: string, startDate?: string, endDate?: string) {
    const res = await ReportRepository.getTopEvents(limit, categoryId, startDate, endDate);
    if (!res.success) throw new Error(res.message || "Failed to fetch top events");
    return res.data || [];
  }

  static async getCapacityVsSales(categoryId?: string, startDate?: string, endDate?: string) {
    const res = await ReportRepository.getCapacityVsSales(categoryId, startDate, endDate);
    if (!res.success) throw new Error(res.message || "Failed to fetch capacity vs sales");
    return res.data || [];
  }

  static async getPromotionEffectiveness(categoryId?: string, startDate?: string, endDate?: string) {
    const res = await ReportRepository.getPromotionEffectiveness(categoryId, startDate, endDate);
    if (!res.success) throw new Error(res.message || "Failed to fetch promotion effectiveness");
    return res.data || [];
  }

  static async getTransactionStatusDistribution(categoryId?: string, startDate?: string, endDate?: string) {
    const res = await ReportRepository.getTransactionStatusDistribution(categoryId, startDate, endDate);
    if (!res.success) throw new Error(res.message || "Failed to fetch transaction status");
    return res.data || [];
  }

  static async getEventRatings(categoryId?: string, startDate?: string, endDate?: string) {
    const res = await ReportRepository.getEventRatings(categoryId, startDate, endDate);
    if (!res.success) throw new Error(res.message || "Failed to fetch event ratings");
    return res.data || [];
  }

  static async getRevenueByTicketType(categoryId?: string, startDate?: string, endDate?: string) {
    const res = await ReportRepository.getRevenueByTicketType(categoryId, startDate, endDate);
    if (!res.success) throw new Error(res.message || "Failed to fetch revenue by ticket type");
    return res.data || [];
  }
}
