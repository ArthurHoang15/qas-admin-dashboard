import { getTranslations, getLocale } from "next-intl/server";
import { Header } from "@/components/layout";
import { StatsGrid } from "@/components/dashboard/stats-grid";
import { TrendAreaChart } from "@/components/dashboard/charts/trend-area-chart";
import { PriorityDonutChart } from "@/components/dashboard/charts/priority-donut-chart";
import { PoolBarChart } from "@/components/dashboard/charts/pool-bar-chart";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import {
  getDashboardStats,
  getRegistrationTrends,
  getPriorityDistribution,
  getPoolBreakdown,
  getRecentActivities,
} from "@/actions/dashboard-actions";

export default async function DashboardPage() {
  const t = await getTranslations("dashboard");
  const locale = await getLocale();

  // Fetch all dashboard data in parallel
  const [stats, trends, priorityData, poolData, activities] = await Promise.all(
    [
      getDashboardStats(),
      getRegistrationTrends(30),
      getPriorityDistribution(),
      getPoolBreakdown(),
      getRecentActivities(10),
    ]
  );

  return (
    <div className="min-h-screen bg-background">
      <Header title={t("title")} />

      <div className="p-6 space-y-6">
        {/* Stats Grid */}
        <StatsGrid
          stats={stats}
          translations={{
            totalRegistrations: t("totalRegistrations"),
            qualified: t("qualified"),
            completed: t("completed"),
            thisMonth: t("thisMonth"),
            fromLastMonth: t("fromLastMonth"),
          }}
        />

        {/* Charts Row 1: Trend + Priority */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <TrendAreaChart data={trends} title={t("trends")} registrationsLabel={t("registrationsLabel")} />
          </div>
          <div className="lg:col-span-1">
            <PriorityDonutChart data={priorityData} title={t("priorityBreakdown")} />
          </div>
        </div>

        {/* Charts Row 2: Pool Breakdown + Activity Feed */}
        <div className="grid gap-6 lg:grid-cols-2">
          <PoolBarChart data={poolData} title={t("poolBreakdown")} />
          <ActivityFeed
            activities={activities}
            title={t("recentActivity")}
            locale={locale}
            emptyMessage={t("noActivity")}
          />
        </div>
      </div>
    </div>
  );
}
