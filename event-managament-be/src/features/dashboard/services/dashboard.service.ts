import { DashboardRepository } from "../repositories/dashboard.repository.js";

export class DashboardService {
  private repository: DashboardRepository;

  constructor() {
    this.repository = new DashboardRepository();
  }

  public getStats = async (organizerId: string): Promise<any> => {
    // Note: To calculate trend, you typically need to fetch previous period data.
    // For simplicity in this demo, trend is static or basic
    const eventStats = await this.repository.getEventStats(organizerId);

    return [
      {
        id: "tickets",
        title: "Total Tickets Sold",
        value: eventStats.ticketsSold.toLocaleString(),
        trend: { value: "+0.0%", isPositive: true },
        iconType: "ticket",
      },
      {
        id: "revenue",
        title: "Total Revenue",
        value: `IDR ${(eventStats.totalRevenue / 1000000).toFixed(1)}M`, // Format as IDR X.XM
        trend: { value: "+0.0%", isPositive: true },
        iconType: "payment",
      },
      {
        id: "events",
        title: "Total Events",
        value: (await this.repository.getTotalEvents(organizerId)).toString(),
        trend: { value: "0.0%", isPositive: null },
        iconType: "star", // Reusing star for events
      },
    ];
  };

  public getTeamInfo = async (organizerId: string): Promise<any> => {
    const memCount = await this.repository.getTeamMemberCount(organizerId);
    return {
      membersCount: memCount,
      // For UI compatibility, mapping this to the 'referral' object shape exactly
      signups: memCount, 
      code: "SQUAD", // Placeholder or fetch actual if needed
    };
  };

  public getChartData = async (
    organizerId: string,
    filter: "weekly" | "monthly" | "yearly"
  ): Promise<any> => {
    const rawTransactions = await this.repository.getTransactionsByPeriod(organizerId, filter);
    
    // Grouping logic
    const dataPoints: { label: string; value: number }[] = [];
    
    if (filter === "weekly") {
      // Initialize last 7 days including today
      const today = new Date();
      for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const label = d.toLocaleDateString("en-US", { weekday: "short" }); // Mon, Tue
        dataPoints.push({ label, value: 0 });
      }
      
      rawTransactions.forEach((tx: any) => {
        const txDate = new Date(tx.transactionDate);
        const dayLabel = txDate.toLocaleDateString("en-US", { weekday: "short" });
        const pt = dataPoints.find((p) => p.label === dayLabel);
        if (pt) pt.value += Number(tx.totalFinalPrice);
      });
      
    } else if (filter === "monthly") {
      // Initialize 12 months for current year
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      months.forEach(m => dataPoints.push({ label: m, value: 0 }));
      
      rawTransactions.forEach((tx: any) => {
        const txDate = new Date(tx.transactionDate);
        const monthLabel = txDate.toLocaleDateString("en-US", { month: "short" }); // Jan, Feb
        const pt = dataPoints.find((p) => p.label === monthLabel);
        if (pt) pt.value += Number(tx.totalFinalPrice);
      });
      
    } else if (filter === "yearly") {
      // Initialize last 5 years
      const currentYear = new Date().getFullYear();
      for (let i = 4; i >= 0; i--) {
        dataPoints.push({ label: String(currentYear - i), value: 0 });
      }
      
      rawTransactions.forEach((tx: any) => {
        const txDate = new Date(tx.transactionDate);
        const yearLabel = String(txDate.getFullYear());
        const pt = dataPoints.find((p) => p.label === yearLabel);
        if (pt) pt.value += Number(tx.totalFinalPrice);
      });
    }

    // Convert values to millions (M) and calculate percentages for heights
    const allZero = dataPoints.every((d) => d.value === 0);
    const maxVal = allZero ? 1 : Math.max(...dataPoints.map(d => d.value));

    // Determine the current label for highlighting
    const today = new Date();
    let currentLabel = "";
    if (filter === "weekly") {
      currentLabel = today.toLocaleDateString("en-US", { weekday: "short" });
    } else if (filter === "monthly") {
      currentLabel = today.toLocaleDateString("en-US", { month: "short" });
    } else if (filter === "yearly") {
      currentLabel = String(today.getFullYear());
    }

    return dataPoints.map((dp) => {
      // If all values are 0, just show a 2% line. Otherwise relative scale with min 5%
      const heightPercent = allZero ? 2 : Math.max(5, Math.round((dp.value / maxVal) * 100));
      return {
        label: dp.label,
        value: Number((dp.value / 1000000).toFixed(1)), // To IDR Millions
        height: `${heightPercent}%`,
        isHighlight: dp.label === currentLabel // Highlight current period dynamically
      };
    });
  };

  public getActiveEvents = async (organizerId: string): Promise<any> => {
    const events = await this.repository.getActiveEvents(organizerId);
    return events.map((e: any) => ({
      id: e.id,
      title: e.name,
      date: e.startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      location: e.location,
      image: e.imageUrl || "https://picsum.photos/seed/event/100/100", // Fallback image
      status: e.endDate > new Date() ? "active" : "draft", // simplifies status
    }));
  };

  public getRecentTransactions = async (organizerId: string): Promise<any> => {
    const txs = await this.repository.getRecentTransactions(organizerId);
    return txs.map((tx: any) => ({
      id: `#${tx.invoice}`,
      customer: {
         name: tx.user.name,
         initials: tx.user.name.substring(0,2).toUpperCase(),
         color: "bg-[#ee2b8c]/10 text-[#ee2b8c]", // dynamic color later
         avatar: tx.user.avatarUrl
      },
      event: tx.event.name,
      date: tx.transactionDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      amount: `IDR ${Number(tx.totalFinalPrice).toLocaleString()}`,
      status: tx.status.toLowerCase(),
    }));
  };
}
