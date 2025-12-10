"use server";

import { query } from "@/lib/db";
import type {
  DashboardStats,
  TrendDataPoint,
  PriorityDistribution,
  PoolBreakdown,
  RecentActivity,
  EmailActionStats,
} from "@/lib/types/dashboard";

const PRIORITY_COLORS: Record<number, string> = {
  1: "emerald",
  2: "blue",
  3: "amber",
  4: "orange",
  5: "rose",
};

const POOL_LABELS: Record<string, string> = {
  sales: "Sales",
  consulting: "Consulting",
  experience: "Experience",
  nurture: "Nurture",
  education: "Education",
  giveaway: "Giveaway",
};

export async function getDashboardStats(): Promise<DashboardStats> {
  const now = new Date();
  const firstDayThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastDayLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

  const [totalRes, qualifiedRes, completedRes, thisMonthRes, lastMonthRes, qualifiedLastMonthRes, completedLastMonthRes] =
    await Promise.all([
      query("SELECT COUNT(*) FROM qas_registrations"),
      query("SELECT COUNT(*) FROM qas_registrations WHERE is_qualified = true"),
      query("SELECT COUNT(*) FROM qas_registrations WHERE is_completed = true"),
      query("SELECT COUNT(*) FROM qas_registrations WHERE created_at >= $1", [
        firstDayThisMonth.toISOString(),
      ]),
      query(
        "SELECT COUNT(*) FROM qas_registrations WHERE created_at >= $1 AND created_at <= $2",
        [firstDayLastMonth.toISOString(), lastDayLastMonth.toISOString()]
      ),
      query(
        "SELECT COUNT(*) FROM qas_registrations WHERE is_qualified = true AND created_at >= $1 AND created_at <= $2",
        [firstDayLastMonth.toISOString(), lastDayLastMonth.toISOString()]
      ),
      query(
        "SELECT COUNT(*) FROM qas_registrations WHERE is_completed = true AND created_at >= $1 AND created_at <= $2",
        [firstDayLastMonth.toISOString(), lastDayLastMonth.toISOString()]
      ),
    ]);

  return {
    totalRegistrations: Number(totalRes.rows[0].count),
    qualifiedCount: Number(qualifiedRes.rows[0].count),
    completedCount: Number(completedRes.rows[0].count),
    thisMonthCount: Number(thisMonthRes.rows[0].count),
    lastMonthCount: Number(lastMonthRes.rows[0].count),
    qualifiedLastMonth: Number(qualifiedLastMonthRes.rows[0].count),
    completedLastMonth: Number(completedLastMonthRes.rows[0].count),
  };
}

export async function getRegistrationTrends(
  days: number = 30
): Promise<TrendDataPoint[]> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const result = await query(
    `SELECT
      DATE(created_at) as date,
      COUNT(*) as count
    FROM qas_registrations
    WHERE created_at >= $1
    GROUP BY DATE(created_at)
    ORDER BY date ASC`,
    [startDate.toISOString()]
  );

  // Fill in missing dates with 0
  const dataMap = new Map<string, number>();
  result.rows.forEach((row: { date: string; count: string }) => {
    const dateStr = new Date(row.date).toISOString().split("T")[0];
    dataMap.set(dateStr, Number(row.count));
  });

  const trendData: TrendDataPoint[] = [];
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (days - 1 - i));
    const dateStr = date.toISOString().split("T")[0];
    trendData.push({
      date: dateStr,
      registrations: dataMap.get(dateStr) || 0,
    });
  }

  return trendData;
}

export async function getPriorityDistribution(): Promise<PriorityDistribution[]> {
  const result = await query(
    `SELECT
      priority_level,
      COUNT(*) as count
    FROM qas_registrations
    WHERE priority_level IS NOT NULL
    GROUP BY priority_level
    ORDER BY priority_level ASC`
  );

  return result.rows.map((row: { priority_level: number; count: string }) => ({
    name: `P${row.priority_level}`,
    value: Number(row.count),
    color: PRIORITY_COLORS[row.priority_level] || "gray",
  }));
}

export async function getPoolBreakdown(): Promise<PoolBreakdown[]> {
  const result = await query(
    `SELECT
      engagement_pool,
      COUNT(*) as count
    FROM qas_registrations
    WHERE engagement_pool IS NOT NULL
    GROUP BY engagement_pool
    ORDER BY count DESC`
  );

  return result.rows.map((row: { engagement_pool: string; count: string }) => ({
    name: POOL_LABELS[row.engagement_pool] || row.engagement_pool,
    value: Number(row.count),
  }));
}

export async function getRecentActivities(
  limit: number = 10
): Promise<RecentActivity[]> {
  const result = await query(
    `SELECT
      id,
      first_name,
      last_name,
      email,
      is_qualified,
      is_completed,
      submission_type,
      created_at,
      updated_at,
      last_action,
      last_email_sent_code,
      next_email_date
    FROM qas_registrations
    ORDER BY updated_at DESC
    LIMIT $1`,
    [limit]
  );

  return result.rows.map(
    (row: {
      id: number;
      first_name: string;
      last_name: string;
      email: string;
      is_qualified: boolean;
      is_completed: boolean;
      submission_type: string | null;
      created_at: string;
      updated_at: string;
      last_action: string | null;
      last_email_sent_code: string | null;
      next_email_date: string | null;
    }) => {
      let type: "registration" | "qualified" | "completed" = "registration";

      if (row.is_completed) {
        type = "completed";
      } else if (row.is_qualified) {
        type = "qualified";
      }

      const submissionType = (row.submission_type === "partial" ? "partial" : "completed") as "completed" | "partial";

      return {
        id: row.id,
        name: `${row.first_name} ${row.last_name}`,
        email: row.email,
        submissionType,
        timestamp: row.updated_at,
        type,
        lastAction: row.last_action,
        lastEmailSentCode: row.last_email_sent_code,
        nextEmailDate: row.next_email_date,
      };
    }
  );
}

export async function getEmailActionStats(): Promise<EmailActionStats[]> {
  const result = await query(
    `SELECT
      COALESCE(last_action, 'None') as action,
      COUNT(*) as count
    FROM qas_registrations
    GROUP BY last_action
    ORDER BY count DESC`
  );

  const totalCount = result.rows.reduce((sum: number, row: { count: string }) => sum + Number(row.count), 0);

  return result.rows.map((row: { action: string; count: string }) => ({
    action: row.action || 'None',
    count: Number(row.count),
    percentage: totalCount > 0 ? Math.round((Number(row.count) / totalCount) * 100) : 0,
  }));
}
