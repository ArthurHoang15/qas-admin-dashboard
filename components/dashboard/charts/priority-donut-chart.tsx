"use client";

import { DonutChart } from "@tremor/react";
import type { PriorityDistribution } from "@/lib/types/dashboard";

interface PriorityDonutChartProps {
  data: PriorityDistribution[];
  title: string;
}

// High contrast colors that work well in both light and dark modes
const PRIORITY_COLORS: Record<string, string> = {
  emerald: "#10b981",
  blue: "#3b82f6",
  amber: "#f59e0b",
  orange: "#f97316",
  rose: "#f43f5e",
  gray: "#6b7280",
};

export function PriorityDonutChart({ data, title }: PriorityDonutChartProps) {
  const colors = data.map((item) => item.color) as (
    | "emerald"
    | "blue"
    | "amber"
    | "orange"
    | "rose"
    | "gray"
  )[];

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h3 className="mb-4 text-sm font-medium text-foreground">{title}</h3>
      <div className="flex flex-col items-center gap-6">
        <DonutChart
          className="h-44"
          data={data}
          category="value"
          index="name"
          colors={colors}
          showLabel={true}
          showAnimation={true}
          variant="donut"
          showTooltip={true}
        />
        {/* Custom legend with better contrast */}
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
          {data.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: PRIORITY_COLORS[item.color] || "#6b7280" }}
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
