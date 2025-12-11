"use client";

import type { PoolBreakdown } from "@/lib/types/dashboard";

interface PoolBarChartProps {
  data: PoolBreakdown[];
  title: string;
  emptyMessage?: string;
}

// High contrast colors for pool bars
const POOL_COLORS: Record<string, string> = {
  Sales: "#3b82f6",
  Consulting: "#8b5cf6",
  Experience: "#06b6d4",
  Nurture: "#10b981",
  Education: "#f59e0b",
  Giveaway: "#ec4899",
};

export function PoolBarChart({ data, title, emptyMessage = "No data available" }: PoolBarChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="rounded-xl border border-border bg-card p-6 h-full">
      <h3 className="mb-4 text-sm font-medium text-foreground">{title}</h3>
      <div className="space-y-3">
        {data.map((item) => {
          const percentage = (item.value / maxValue) * 100;
          const color = POOL_COLORS[item.name] || "#6b7280";

          return (
            <div key={item.name} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-foreground font-medium">{item.name}</span>
                <span className="text-foreground font-semibold">{item.value}</span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-muted">
                <div
                  className="h-2.5 rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: color,
                  }}
                />
              </div>
            </div>
          );
        })}
        {data.length === 0 && (
          <p className="text-center text-sm text-muted-foreground italic py-4">
            {emptyMessage}
          </p>
        )}
      </div>
    </div>
  );
}
