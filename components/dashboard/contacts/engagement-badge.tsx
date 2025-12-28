"use client";

import { useTranslations } from "next-intl";

type EngagementLevel = "none" | "sent" | "opened" | "clicked";

interface EngagementBadgeProps {
  level: EngagementLevel;
}

const ENGAGEMENT_STYLES: Record<EngagementLevel, string> = {
  none: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  sent: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  opened: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
  clicked: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
};

export function EngagementBadge({ level }: EngagementBadgeProps) {
  const t = useTranslations("contacts");

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${ENGAGEMENT_STYLES[level]}`}
    >
      {t(`engagementLevels.${level}`)}
    </span>
  );
}
