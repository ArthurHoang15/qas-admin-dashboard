"use client";

import { DonutChart, Legend } from "@tremor/react";
import type { PriorityDistribution } from "@/lib/types/dashboard";

interface PriorityDonutChartProps {
  data: PriorityDistribution[];
  title: string;
}

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
      <h3 className="mb-4 text-sm font-medium text-muted-foreground">{title}</h3>
      <div className="flex flex-col items-center gap-4">
        <DonutChart
          className="h-48"
          data={data}
          category="value"
          index="name"
          colors={colors}
          showLabel={true}
          showAnimation={true}
          variant="donut"
        />
        <Legend
          categories={data.map((item) => item.name)}
          colors={colors}
          className="justify-center"
        />
      </div>
    </div>
  );
}
