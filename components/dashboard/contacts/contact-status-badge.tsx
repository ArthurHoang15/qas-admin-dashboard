"use client";

import { useTranslations } from "next-intl";

type ContactStatus = "active" | "unsubscribed" | "bounced" | "complained";

interface ContactStatusBadgeProps {
  status: ContactStatus;
}

const STATUS_STYLES: Record<ContactStatus, string> = {
  active: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  unsubscribed: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  bounced: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  complained: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
};

export function ContactStatusBadge({ status }: ContactStatusBadgeProps) {
  const t = useTranslations("contacts");

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[status]}`}
    >
      {t(`statuses.${status}`)}
    </span>
  );
}
