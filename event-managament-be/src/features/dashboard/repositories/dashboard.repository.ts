import { prisma } from "../../../config/prisma.js";
import { Prisma } from "@prisma/client";

export class DashboardRepository {
  public getEventStats = async (organizerId: string) => {
    // Aggregate revenue and tickets sold for paid, non-draft events
    const stats = await prisma.transaction.aggregate({
      where: {
        event: {
          organizerId,
        },
        status: "PAID",
      },
      _sum: {
        totalFinalPrice: true,
      },
    });

    const ticketStats = await prisma.transactionItem.aggregate({
      where: {
        transaction: {
          event: {
            organizerId,
          },
          status: "PAID",
        },
      },
      _sum: {
        quantity: true,
      },
    });

    return {
      totalRevenue: Number(stats._sum.totalFinalPrice || 0),
      ticketsSold: ticketStats._sum.quantity || 0,
    };
  };

  public getTotalEvents = async (organizerId: string) => {
    const count = await prisma.event.count({
      where: {
        organizerId,
      },
    });
    return count;
  };

  public getTeamMemberCount = async (organizerId: string) => {
    const count = await prisma.organizerTeam.count({
      where: {
        organizerId,
      },
    });
    return count;
  };

  public getTransactionsByPeriod = async (
    organizerId: string,
    filter: "weekly" | "monthly" | "yearly",
  ) => {
    const now = new Date();
    let startDate: Date;

    if (filter === "weekly") {
      // Last 7 days
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 6);
      startDate.setHours(0, 0, 0, 0);
    } else if (filter === "monthly") {
      // Current year (to group by month)
      startDate = new Date(now.getFullYear(), 0, 1);
    } else {
      // Last 5 years (to group by year)
      startDate = new Date(now.getFullYear() - 4, 0, 1);
    }

    const transactions = await prisma.transaction.findMany({
      where: {
        event: {
          organizerId,
        },
        status: "PAID",
        transactionDate: {
          gte: startDate,
        },
      },
      select: {
        totalFinalPrice: true,
        transactionDate: true,
      },
      orderBy: {
        transactionDate: "asc",
      },
    });

    return transactions;
  };

  public getActiveEvents = async (organizerId: string) => {
    // Only fetch upcoming events
    const now = new Date();
    const events = await prisma.event.findMany({
      where: {
        organizerId,
        endDate: {
          gte: now,
        },
      },
      select: {
        id: true,
        name: true,
        startDate: true,
        endDate: true,
        location: true,
        imageUrl: true,
        ticketTypes: {
          select: {
            price: true,
          }
        },
        _count: {
          select: {
            transactions: {
              where: {
                status: "PAID"
              }
            }
          }
        }
      },
      orderBy: {
        startDate: "asc", // Show soonest events first
      },
      take: 5, // Limit for dashboard view
    });

    return events;
  };

  public getRecentTransactions = async (organizerId: string) => {
    const transactions = await prisma.transaction.findMany({
      where: {
        event: {
          organizerId,
        },
      },
      select: {
        id: true,
        invoice: true,
        transactionDate: true,
        totalFinalPrice: true,
        status: true,
        user: {
          select: {
            name: true,
            avatarUrl: true,
          }
        },
        event: {
          select: {
            name: true,
          }
        }
      },
      orderBy: {
        transactionDate: "desc",
      },
      take: 5,
    });

    return transactions;
  };
}
