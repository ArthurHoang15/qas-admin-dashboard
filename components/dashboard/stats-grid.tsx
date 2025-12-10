import { Users, UserCheck, CheckCircle, Calendar } from "lucide-react";
import { StatsCard } from "./stats-card";
import type { DashboardStats } from "@/lib/types/dashboard";

interface StatsGridProps {
  stats: DashboardStats;
  translations: {
    totalRegistrations: string;
    qualified: string;
    completed: string;
    thisMonth: string;
    fromLastMonth: string;
  };
}

export function StatsGrid({ stats, translations }: StatsGridProps) {
  // Calculate previous month's total (total now minus this month's new registrations)
  const previousMonthTotal = stats.totalRegistrations - stats.thisMonthCount;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title={translations.totalRegistrations}
        value={stats.totalRegistrations}
        previousValue={previousMonthTotal > 0 ? previousMonthTotal : stats.lastMonthCount}
        suffix={translations.fromLastMonth}
        icon={<Users className="h-4 w-4" />}
      />
      <StatsCard
        title={translations.qualified}
        value={stats.qualifiedCount}
        previousValue={stats.qualifiedLastMonth}
        suffix={translations.fromLastMonth}
        icon={<UserCheck className="h-4 w-4" />}
      />
      <StatsCard
        title={translations.completed}
        value={stats.completedCount}
        previousValue={stats.completedLastMonth}
        suffix={translations.fromLastMonth}
        icon={<CheckCircle className="h-4 w-4" />}
      />
      <StatsCard
        title={translations.thisMonth}
        value={stats.thisMonthCount}
        previousValue={stats.lastMonthCount}
        suffix={translations.fromLastMonth}
        icon={<Calendar className="h-4 w-4" />}
      />
    </div>
  );
}
