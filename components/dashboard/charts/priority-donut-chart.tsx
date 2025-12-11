"use client";

import type { PriorityDistribution } from "@/lib/types/dashboard";

interface PriorityDonutChartProps {
  data: PriorityDistribution[];
  title: string;
  emptyMessage?: string;
}

// Distinct high contrast colors for each priority level
const PRIORITY_HEX_COLORS: Record<string, string> = {
  emerald: "#10b981",
  blue: "#3b82f6",
  amber: "#eab308",
  orange: "#f97316",
  rose: "#e11d48",
  gray: "#6b7280",
};

export function PriorityDonutChart({ data, title, emptyMessage = "No data available" }: PriorityDonutChartProps) {
  // Handle empty data
  if (data.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-6 h-full">
        <h3 className="mb-4 text-sm font-medium text-foreground">{title}</h3>
        <div className="flex flex-col items-center justify-center gap-6 h-[calc(100%-2rem)]">
          <div className="relative">
            <div className="w-48 h-48 rounded-full bg-muted" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-28 h-28 rounded-full bg-card flex items-center justify-center">
                <span className="text-2xl font-bold text-foreground">0</span>
              </div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground italic">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  const total = data.reduce((sum, item) => sum + item.value, 0);

  // Calculate segments for the donut chart
  let cumulativePercent = 0;
  const segments = data.map((item) => {
    const percent = total > 0 ? (item.value / total) * 100 : 0;
    const startPercent = cumulativePercent;
    cumulativePercent += percent;
    return {
      ...item,
      percent,
      startPercent,
      endPercent: cumulativePercent,
      color: PRIORITY_HEX_COLORS[item.color] || "#6b7280",
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
      <div className="flex flex-col items-center justify-center gap-6 h-[calc(100%-2rem)]">
        {/* Custom Donut Chart */}
        <div className="relative">
          <div
            className="w-48 h-48 rounded-full"
            style={{
              background: total > 0
                ? `conic-gradient(${gradientStops})`
                : "#374151",
            }}
          />
          {/* Inner circle for donut hole */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-28 h-28 rounded-full bg-card flex items-center justify-center">
              <span className="text-2xl font-bold text-foreground">{total}</span>
            </div>
          </div>
        </div>

        {/* Custom legend with matching colors */}
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
          {data.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: PRIORITY_HEX_COLORS[item.color] || "#6b7280" }}
              />
              <span className="text-sm text-foreground">
                {item.name}: <span className="font-medium">{item.value}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
