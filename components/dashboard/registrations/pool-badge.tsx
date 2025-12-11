"use client";

import { EngagementPool } from "@/lib/types";

interface PoolBadgeProps {
  pool: EngagementPool | null;
}

const poolConfig: Record<EngagementPool, { label: string; className: string }> = {
  sales: {
    label: "Sales",
    className: "bg-red-200 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  },
  consulting: {
    label: "Consulting",
    className: "bg-orange-200 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  },
  experience: {
    label: "Experience",
    className: "bg-blue-200 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  },
  nurture: {
    label: "Nurture",
    className: "bg-cyan-200 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400",
  },
  education: {
    label: "Education",
    className: "bg-green-200 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  },
  giveaway: {
    label: "Giveaway",
    className: "bg-purple-200 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  },
};

export function PoolBadge({ pool }: PoolBadgeProps) {
  if (!pool) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-200 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
        -
      </span>
    );
  }

  const config = poolConfig[pool];

  if (!config) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-400">
        {pool}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
}
