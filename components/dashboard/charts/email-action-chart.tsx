"use client";

import type { EmailActionStats } from "@/lib/types/dashboard";

interface EmailActionChartProps {
  data: EmailActionStats[];
  title: string;
  emptyMessage?: string;
}

// Colors for different email actions
const ACTION_COLORS: Record<string, string> = {
  "None": "#6b7280",
  "Opened": "#3b82f6",
  "Clicked": "#10b981",
};

export function EmailActionChart({ data, title, emptyMessage = "No data available" }: EmailActionChartProps) {
  const total = data.reduce((sum, item) => sum + item.count, 0);

  // Handle empty data
  if (data.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-6 h-full">
        <h3 className="mb-4 text-sm font-medium text-foreground">{title}</h3>
        <div className="flex flex-col items-center justify-center gap-4 h-[calc(100%-2rem)]">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-muted" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-card flex items-center justify-center">
                <span className="text-xl font-bold text-foreground">0</span>
              </div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground italic">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  // Ensure all 3 actions are present (None, Opened, Clicked)
  const allActions = ["None", "Opened", "Clicked"];
  const completeData = allActions.map((action) => {
    const existing = data.find((d) => d.action === action);
    return existing || { action, count: 0, percentage: 0 };
  });

  // Calculate segments for the donut chart
  let cumulativePercent = 0;
  const segments = completeData.map((item) => {
    const percent = total > 0 ? (item.count / total) * 100 : 0;
    const startPercent = cumulativePercent;
    cumulativePercent += percent;
    return {
      ...item,
      percent,
      startPercent,
      endPercent: cumulativePercent,
      color: ACTION_COLORS[item.action] || "#6b7280",
    };
  });

  // Create conic gradient for donut
  const gradientStops = segments
    .filter((seg) => seg.percent > 0)
    .map((seg) => `${seg.color} ${seg.startPercent}% ${seg.endPercent}%`)
    .join(", ");

  return (
    <div className="rounded-xl border border-border bg-card p-6 h-full">
      <h3 className="mb-4 text-sm font-medium text-foreground">{title}</h3>
      <div className="flex flex-col items-center justify-center gap-4 h-[calc(100%-2rem)]">
        {/* Donut Chart */}
        <div className="relative">
          <div
            className="w-32 h-32 rounded-full"
            style={{
              background: total > 0
                ? `conic-gradient(${gradientStops})`
                : "#374151",
            }}
          />
          {/* Inner circle for donut hole */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-card flex items-center justify-center">
              <span className="text-xl font-bold text-foreground">{total}</span>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="w-full space-y-2">
          {completeData.map((item) => {
            const color = ACTION_COLORS[item.action] || "#6b7280";
            const percentage = total > 0 ? Math.round((item.count / total) * 100) : 0;

            return (
              <div key={item.action} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-foreground">{item.action}</span>
                </div>
                <span className="text-foreground font-medium">
                  {item.count} <span className="text-muted-foreground text-xs">({percentage}%)</span>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
