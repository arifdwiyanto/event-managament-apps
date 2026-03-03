import { prisma } from "../../config/prisma.js";
import { Prisma } from "@prisma/client";

export class ReportRepository {
  /**
   * 1. Sales Performance (Daily/Monthly/Yearly)
   */
  async getSalesPerformance(organizerId: string, startDate: Date, endDate: Date, interval: 'day' | 'month' | 'year' = 'day', categoryId?: string) {
    let dateTrunc = 'day';
    if (interval === 'month') dateTrunc = 'month';
    if (interval === 'year') dateTrunc = 'year';

    let queryArgs: any[] = [dateTrunc, organizerId, startDate, endDate];
    let categoryFilter = '';
    
    if (categoryId) {
      categoryFilter = ` AND e.category_id = $5`;
      queryArgs.push(categoryId);
    }

    const result = await prisma.$queryRawUnsafe(`
      SELECT 
        DATE_TRUNC($1, t.transaction_date) as interval_date,
        SUM(t.total_final_price) as total_revenue
      FROM transactions t
      JOIN events e ON t.event_id = e.id
      WHERE e.organizer_id = $2
        AND t.status = 'PAID'
        AND t.transaction_date >= $3
        AND t.transaction_date <= $4
        ${categoryFilter}
      GROUP BY DATE_TRUNC($1, t.transaction_date)
      ORDER BY interval_date ASC
    `, ...queryArgs);

    return result as any[];
  }

  /**
   * 2. Ticket Sales by Category
   */
  async getSalesByCategory(organizerId: string, categoryId?: string, startDate?: Date, endDate?: Date) {
    const result = await prisma.$queryRaw`
      SELECT 
        c.name as category_name,
        SUM(ti.quantity) as total_tickets_sold
      FROM transaction_items ti
      JOIN transactions t ON ti.transaction_id = t.id
      JOIN events e ON t.event_id = e.id
      JOIN categories c ON e.category_id = c.id
      WHERE e.organizer_id = ${organizerId}
        AND t.status = 'PAID'
        ${categoryId ? Prisma.sql`AND e.category_id = ${categoryId}` : Prisma.empty}
        ${startDate ? Prisma.sql`AND t.transaction_date >= ${startDate}` : Prisma.empty}
        ${endDate ? Prisma.sql`AND t.transaction_date <= ${endDate}` : Prisma.empty}
      GROUP BY c.name
      ORDER BY total_tickets_sold DESC
    `;
    return result as any[];
  }

  /**
   * 3. Transaction Reports (Paginated Table)
   */
  async getTransactionReports(organizerId: string, skip: number, take: number, categoryId?: string, startDate?: Date, endDate?: Date) {
    const eventFilter = categoryId ? { organizerId, categoryId } : { organizerId };
    
    const whereClause: Prisma.TransactionWhereInput = {
      event: eventFilter,
      ...(startDate || endDate ? {
        transactionDate: {
          ...(startDate && { gte: startDate }),
          ...(endDate && { lte: endDate })
        }
      } : {})
    };

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where: whereClause,
        include: {
          user: { select: { name: true, email: true } },
          event: { select: { name: true } }
        },
        orderBy: { transactionDate: 'desc' },
        skip,
        take
      }),
      prisma.transaction.count({
        where: whereClause
      })
    ]);
    return { transactions, total };
  }

  /**
   * 4. Top Events (By Revenue)
   */
  async getTopEvents(organizerId: string, limit: number = 5, categoryId?: string, startDate?: Date, endDate?: Date) {
    const result = await prisma.$queryRaw`
      SELECT 
        e.id,
        e.name,
        e.start_date,
        COUNT(DISTINCT t.id) as total_transactions,
        SUM(ti.quantity) as tickets_sold,
        SUM(ti.total_price) as total_revenue
      FROM events e
      LEFT JOIN transactions t ON e.id = t.event_id AND t.status = 'PAID' 
        ${startDate ? Prisma.sql`AND t.transaction_date >= ${startDate}` : Prisma.empty}
        ${endDate ? Prisma.sql`AND t.transaction_date <= ${endDate}` : Prisma.empty}
      LEFT JOIN transaction_items ti ON t.id = ti.transaction_id
      WHERE e.organizer_id = ${organizerId}
        ${categoryId ? Prisma.sql`AND e.category_id = ${categoryId}` : Prisma.empty}
      GROUP BY e.id, e.name, e.start_date
      ORDER BY total_revenue DESC NULLS LAST
      LIMIT ${limit}
    `;
    return result as any[];
  }

  /**
   * 5. Ticket Sales vs Capacity
   * Note: capacity is event-scoped, but tickets sold can be filtered by date.
   */
  async getCapacityVsSales(organizerId: string, categoryId?: string, startDate?: Date, endDate?: Date) {
    const result = await prisma.$queryRaw`
      SELECT 
        e.name as event_name,
        COALESCE(SUM(tt.quota), 0) + COALESCE(SUM(ti.quantity), 0) as total_capacity,
        COALESCE(SUM(ti.quantity), 0) as tickets_sold
      FROM events e
      LEFT JOIN ticket_types tt ON e.id = tt.event_id
      LEFT JOIN transactions t ON e.id = t.event_id AND t.status = 'PAID'
        ${startDate ? Prisma.sql`AND t.transaction_date >= ${startDate}` : Prisma.empty}
        ${endDate ? Prisma.sql`AND t.transaction_date <= ${endDate}` : Prisma.empty}
      LEFT JOIN transaction_items ti ON t.id = ti.transaction_id AND ti.ticket_type_id = tt.id
      WHERE e.organizer_id = ${organizerId}
        ${categoryId ? Prisma.sql`AND e.category_id = ${categoryId}` : Prisma.empty}
      GROUP BY e.id, e.name
      ORDER BY e.start_date DESC
      LIMIT 10
    `;
    return result as any[];
  }

  /**
   * 6. Promotion Effectiveness
   */
  async getPromotionEffectiveness(organizerId: string, categoryId?: string, startDate?: Date, endDate?: Date) {
    const result = await prisma.$queryRaw`
      SELECT 
        DATE_TRUNC('week', t.transaction_date) as week,
        SUM(ti.quantity) as total_tickets_sold,
        SUM(CASE WHEN t.promotion_id IS NOT NULL THEN ti.quantity ELSE 0 END) as promo_tickets_sold
      FROM transactions t
      JOIN events e ON t.event_id = e.id
      JOIN transaction_items ti ON t.id = ti.transaction_id
      WHERE e.organizer_id = ${organizerId}
        AND t.status = 'PAID'
        ${categoryId ? Prisma.sql`AND e.category_id = ${categoryId}` : Prisma.empty}
        ${startDate ? Prisma.sql`AND t.transaction_date >= ${startDate}` : Prisma.empty}
        ${endDate ? Prisma.sql`AND t.transaction_date <= ${endDate}` : Prisma.empty}
      GROUP BY DATE_TRUNC('week', t.transaction_date)
      ORDER BY week ASC
      LIMIT 12
    `;
    return result as any[];
  }

  /**
   * 7. Transaction Success Rate (Status Distribution)
   */
  async getTransactionStatusDistribution(organizerId: string, categoryId?: string, startDate?: Date, endDate?: Date) {
    const result = await prisma.$queryRaw`
      SELECT 
        t.status,
        COUNT(t.id) as count
      FROM transactions t
      JOIN events e ON t.event_id = e.id
      WHERE e.organizer_id = ${organizerId}
        ${categoryId ? Prisma.sql`AND e.category_id = ${categoryId}` : Prisma.empty}
        ${startDate ? Prisma.sql`AND t.transaction_date >= ${startDate}` : Prisma.empty}
        ${endDate ? Prisma.sql`AND t.transaction_date <= ${endDate}` : Prisma.empty}
      GROUP BY t.status
    `;
    return result as any[];
  }

  /**
   * 8. Event Ratings (Customer Satisfaction)
   * Note: review created_at vs transaction_date, better to filter by event date? No, review created_at
   */
  async getEventRatings(organizerId: string, categoryId?: string, startDate?: Date, endDate?: Date) {
    const result = await prisma.$queryRaw`
      SELECT 
        e.name as event_name,
        AVG(r.rating) as average_rating,
        COUNT(r.id) as review_count
      FROM events e
      JOIN reviews r ON e.id = r.event_id
      WHERE e.organizer_id = ${organizerId}
        ${categoryId ? Prisma.sql`AND e.category_id = ${categoryId}` : Prisma.empty}
        ${startDate ? Prisma.sql`AND r.created_at >= ${startDate}` : Prisma.empty}
        ${endDate ? Prisma.sql`AND r.created_at <= ${endDate}` : Prisma.empty}
      GROUP BY e.id, e.name
      HAVING COUNT(r.id) > 0
      ORDER BY average_rating DESC
    `;
    return result as any[];
  }

  /**
   * 9. Revenue by Ticket Type
   */
  async getRevenueByTicketType(organizerId: string, categoryId?: string, startDate?: Date, endDate?: Date) {
    const result = await prisma.$queryRaw`
      SELECT 
        tt.name as ticket_type_name,
        SUM(ti.total_price) as total_revenue
      FROM transaction_items ti
      JOIN ticket_types tt ON ti.ticket_type_id = tt.id
      JOIN transactions t ON ti.transaction_id = t.id
      JOIN events e ON t.event_id = e.id
      WHERE e.organizer_id = ${organizerId}
        AND t.status = 'PAID'
        ${categoryId ? Prisma.sql`AND e.category_id = ${categoryId}` : Prisma.empty}
        ${startDate ? Prisma.sql`AND t.transaction_date >= ${startDate}` : Prisma.empty}
        ${endDate ? Prisma.sql`AND t.transaction_date <= ${endDate}` : Prisma.empty}
      GROUP BY tt.name
      ORDER BY total_revenue DESC
    `;
    return result as any[];
  }
}
