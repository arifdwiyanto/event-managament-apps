// Dashboard Types

export type ChartFilter = "weekly" | "monthly" | "yearly";

export interface ChartDataPoint {
  label: string;
  value: number;
  height: string;
  isHighlight?: boolean;
}

export interface StatData {
  id: string;
  title: string;
  value: string;
  trend: {
    value: string;
    isPositive: boolean | null;
  };
  iconType: "ticket" | "payment" | "star" | "group";
}

export interface ActiveEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  image?: string;
  status: "active" | "draft" | "selling";
}

export interface Transaction {
  id: string;
  customer: {
    name: string;
    avatar?: string;
    initials: string;
    color: string;
  };
  event: string;
  date: string;
  amount: string;
  status: "completed" | "pending" | "refunded";
}

export interface DashboardData {
  stats: StatData[];
  referral: {
    signups: number;
    code: string;
  };
  chartData: Record<ChartFilter, ChartDataPoint[]>;
  activeEvents: ActiveEvent[];
  transactions: Transaction[];
}
