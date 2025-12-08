"use client";

import { Check, X } from "lucide-react";

interface StatusBadgeProps {
  value: boolean;
  trueLabel?: string;
  falseLabel?: string;
}

export function StatusBadge({ value, trueLabel, falseLabel }: StatusBadgeProps) {
  if (value) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
        <Check className="h-3 w-3" />
        {trueLabel}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
      <X className="h-3 w-3" />
      {falseLabel}
    </span>
  );
}
