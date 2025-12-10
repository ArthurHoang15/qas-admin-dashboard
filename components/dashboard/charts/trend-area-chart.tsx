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
      <h3 className="mb-4 text-sm font-medium text-foreground">{title}</h3>
      <AreaChart
        className="h-72 [&_.recharts-cartesian-axis-tick-value]:fill-foreground [&_.recharts-cartesian-grid-horizontal_line]:stroke-border [&_.recharts-cartesian-grid-vertical_line]:stroke-border"
        data={formattedData}
        index="date"
        categories={["registrations"]}
        colors={["cyan"]}
        showLegend={false}
        showGridLines={true}
        curveType="monotone"
        yAxisWidth={40}
        showXAxis={true}
        showYAxis={true}
        autoMinValue={true}
        connectNulls={true}
      />
    </div>
  );
}
