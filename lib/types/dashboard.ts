export interface DashboardStats {
  totalRegistrations: number;
  qualifiedCount: number;
  completedCount: number;
  thisMonthCount: number;
  lastMonthCount: number;
  qualifiedLastMonth: number;
  completedLastMonth: number;
}

export interface TrendDataPoint {
  date: string;
  registrations: number;
}

export interface PriorityDistribution {
  name: string;
  value: number;
  color: string;
}

export interface PoolBreakdown {
  name: string;
  value: number;
}

export interface RecentActivity {
  id: number;
  name: string;
  email: string;
  action: string;
  timestamp: string;
  type: 'registration' | 'qualified' | 'completed';
  lastAction?: string | null;
  lastEmailSentCode?: string | null;
  nextEmailDate?: string | null;
}

export interface EmailActionStats {
  action: string;
  count: number;
  percentage: number;
}
