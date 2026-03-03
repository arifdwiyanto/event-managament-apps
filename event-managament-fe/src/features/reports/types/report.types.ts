export interface SalesPerformanceData {
  date: string;
  revenue: number;
}

export interface SalesByCategoryData {
  id: number;
  label: string;
  value: number;
}

export interface TransactionReportData {
  id: string;
  invoice: string;
  transactionDate: string;
  status: string;
  totalFinalPrice: number;
  user: {
    name: string;
    email: string;
  };
  event: {
    name: string;
  };
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface TopEventData {
  id: string;
  name: string;
  startDate: string;
  ticketsSold: number;
  totalRevenue: number;
}

export interface CapacityVsSalesData {
  event: string;
  capacity: number;
  sold: number;
}

export interface PromotionEffectivenessData {
  week: string;
  totalSales: number;
  promoSales: number;
}

export interface TransactionStatusData {
  id: number;
  label: string;
  value: number;
}

export interface EventRatingsData {
  event: string;
  rating: number;
  reviewsCount: number;
}

export interface RevenueByTicketTypeData {
  type: string;
  revenue: number;
}

export interface ReportApiResponse<T> {
  success: boolean;
  data?: T;
  meta?: PaginationMeta;
  message?: string;
}
