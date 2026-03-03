import { ReportRepository } from "./report.repository.js";

export class ReportService {
  constructor(private reportRepository: ReportRepository) {}

  async getSalesPerformance(organizerId: string, startDate: Date, endDate: Date, interval: 'day' | 'month' | 'year', categoryId?: string) {
    const rawData = await this.reportRepository.getSalesPerformance(organizerId, startDate, endDate, interval, categoryId);
    
    // Format based on MUI Charts requirements
    return rawData.map((row: any) => ({
      date: row.interval_date.toISOString().split('T')[0], // YYYY-MM-DD
      revenue: Number(row.total_revenue)
    }));
  }

  async getSalesByCategory(organizerId: string, categoryId?: string, startDate?: Date, endDate?: Date) {
    const rawData = await this.reportRepository.getSalesByCategory(organizerId, categoryId, startDate, endDate);
    
    return rawData.map((row: any, index: number) => ({
      id: index,
      label: row.category_name,
      value: Number(row.total_tickets_sold)
    }));
  }

  async getTransactionReports(organizerId: string, page: number = 1, limit: number = 10, categoryId?: string, startDate?: Date, endDate?: Date) {
    const skip = (page - 1) * limit;
    const { transactions, total } = await this.reportRepository.getTransactionReports(organizerId, skip, limit, categoryId, startDate, endDate);
    return { data: transactions, meta: { page, limit, total } };
  }

  async getTopEvents(organizerId: string, limit: number = 5, categoryId?: string, startDate?: Date, endDate?: Date) {
    const rawData = await this.reportRepository.getTopEvents(organizerId, limit, categoryId, startDate, endDate);
    
    return rawData.map((row: any) => ({
      id: row.id,
      name: row.name,
      startDate: row.start_date,
      ticketsSold: Number(row.tickets_sold || 0),
      totalRevenue: Number(row.total_revenue || 0)
    }));
  }

  async getCapacityVsSales(organizerId: string, categoryId?: string, startDate?: Date, endDate?: Date) {
    const rawData = await this.reportRepository.getCapacityVsSales(organizerId, categoryId, startDate, endDate);
    
    return rawData.map((row: any) => ({
      event: row.event_name,
      capacity: Number(row.total_capacity || 0),
      sold: Number(row.tickets_sold || 0)
    }));
  }

  async getPromotionEffectiveness(organizerId: string, categoryId?: string, startDate?: Date, endDate?: Date) {
    const rawData = await this.reportRepository.getPromotionEffectiveness(organizerId, categoryId, startDate, endDate);
    
    return rawData.map((row: any) => ({
      week: row.week.toISOString().split('T')[0],
      totalSales: Number(row.total_tickets_sold || 0),
      promoSales: Number(row.promo_tickets_sold || 0)
    }));
  }

  async getTransactionStatusDistribution(organizerId: string, categoryId?: string, startDate?: Date, endDate?: Date) {
    const rawData = await this.reportRepository.getTransactionStatusDistribution(organizerId, categoryId, startDate, endDate);
    
    return rawData.map((row: any, index: number) => ({
      id: index,
      label: row.status,
      value: Number(row.count)
    }));
  }

  async getEventRatings(organizerId: string, categoryId?: string, startDate?: Date, endDate?: Date) {
    const rawData = await this.reportRepository.getEventRatings(organizerId, categoryId, startDate, endDate);
    
    return rawData.map((row: any) => ({
      event: row.event_name,
      rating: Number(Number(row.average_rating).toFixed(2)),
      reviewsCount: Number(row.review_count)
    }));
  }

  async getRevenueByTicketType(organizerId: string, categoryId?: string, startDate?: Date, endDate?: Date) {
    const rawData = await this.reportRepository.getRevenueByTicketType(organizerId, categoryId, startDate, endDate);

    return rawData.map((row: any) => ({
      type: row.ticket_type_name,
      revenue: Number(row.total_revenue)
    }));
  }
}
