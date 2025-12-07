"use client";

interface PriorityBadgeProps {
  priority: number | null;
}

const priorityConfig: Record<number, { label: string; className: string }> = {
  1: {
    label: "P1",
    className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  },
  2: {
    label: "P2",
    className: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  },
  3: {
    label: "P3",
    className: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  },
  4: {
    label: "P4",
    className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  },
  5: {
    label: "P5",
    className: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
  },
};

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  if (priority === null || priority === undefined) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
        -
      </span>
    );
  }

  const config = priorityConfig[priority] || {
    label: `P${priority}`,
    className: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
}
