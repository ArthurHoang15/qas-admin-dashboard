import { query } from "@/lib/db";
import { getTranslations } from "next-intl/server";
import { Header } from "@/components/layout";

interface PriorityStat {
  priority_level: number;
  count: string;
}

export default async function DashboardPage() {
  const t = await getTranslations("dashboard");

  const totalRes = await query("SELECT count(*) FROM qas_registrations");
  const totalCount = Number(totalRes.rows[0].count);

  const priorityRes = await query(
    "SELECT priority_level, count(*) FROM qas_registrations GROUP BY priority_level ORDER BY priority_level ASC"
  );
  const priorityStats = priorityRes.rows as PriorityStat[];

  return (
    <div className="min-h-screen bg-background">
      <Header title={t("title")} />

      <div className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Total Registrations */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="text-sm font-medium text-muted-foreground">
              {t("totalRegistrations")}
            </h3>
            <div className="mt-2 text-3xl font-bold text-foreground">
              {totalCount}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              +12% {t("fromLastMonth")}
            </p>
          </div>

          {/* Qualified */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="text-sm font-medium text-muted-foreground">
              {t("qualified")}
            </h3>
            <div className="mt-2 text-3xl font-bold text-foreground">
              --
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Coming soon
            </p>
          </div>

          {/* Completed */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="text-sm font-medium text-muted-foreground">
              {t("completed")}
            </h3>
            <div className="mt-2 text-3xl font-bold text-foreground">
              --
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Coming soon
            </p>
          </div>

          {/* This Month */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="text-sm font-medium text-muted-foreground">
              {t("thisMonth")}
            </h3>
            <div className="mt-2 text-3xl font-bold text-foreground">
              --
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Coming soon
            </p>
          </div>
        </div>

        {/* Priority Breakdown */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="mb-4 text-sm font-medium text-muted-foreground">
              {t("priorityBreakdown")}
            </h3>
            <div className="space-y-3">
              {priorityStats.map((stat) => (
                <div
                  key={stat.priority_level}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm text-muted-foreground">
                    Level {stat.priority_level}
                  </span>
                  <span className="text-sm font-semibold text-foreground">
                    {stat.count}
                  </span>
                </div>
              ))}
              {priorityStats.length === 0 && (
                <p className="text-sm text-muted-foreground italic">
                  No data available
                </p>
              )}
            </div>
          </div>

          {/* Placeholder for chart */}
          <div className="rounded-xl border border-border bg-card p-6 flex items-center justify-center">
            <span className="text-muted-foreground">
              Charts coming in Branch 3
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
