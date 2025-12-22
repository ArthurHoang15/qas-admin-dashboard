"use client";

import { useTranslations } from "next-intl";
import { CampaignStatus } from "@/lib/types";

interface CampaignStatusBadgeProps {
  status: CampaignStatus;
}

const STATUS_STYLES: Record<CampaignStatus, string> = {
  draft: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  scheduled: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  sending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
  completed: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  paused: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
  archived: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
};

export function CampaignStatusBadge({ status }: CampaignStatusBadgeProps) {
  const t = useTranslations("campaigns");

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[status]}`}
    >
      {t(`statuses.${status}`)}
    </span>
  );
}
