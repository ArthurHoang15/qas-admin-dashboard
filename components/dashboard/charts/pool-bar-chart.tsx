"use client";

import { BarList } from "@tremor/react";
import type { PoolBreakdown } from "@/lib/types/dashboard";

interface PoolBarChartProps {
  data: PoolBreakdown[];
  title: string;
}

export function PoolBarChart({ data, title }: PoolBarChartProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h3 className="mb-4 text-sm font-medium text-muted-foreground">{title}</h3>
      <BarList
        data={data}
        color="blue"
        showAnimation={true}
        className="mt-2"
      />
    </div>
  );
}
