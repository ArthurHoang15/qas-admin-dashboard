"use client";

import { AreaChart } from "@tremor/react";
import type { TrendDataPoint } from "@/lib/types/dashboard";

interface TrendAreaChartProps {
  data: TrendDataPoint[];
  title: string;
}

export function TrendAreaChart({ data, title }: TrendAreaChartProps) {
  // Format dates for display
  const formattedData = data.map((point) => ({
    ...point,
    date: new Date(point.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
  }));

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h3 className="mb-4 text-sm font-medium text-muted-foreground">{title}</h3>
      <AreaChart
        className="h-72"
        data={formattedData}
        index="date"
        categories={["registrations"]}
        colors={["blue"]}
        showLegend={false}
        showGridLines={false}
        curveType="monotone"
        yAxisWidth={40}
      />
    </div>
  );
}
