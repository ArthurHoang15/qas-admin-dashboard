"use client";

import { useLocale, useTranslations } from "next-intl";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Registration } from "@/lib/types";
import { PriorityBadge } from "./priority-badge";
import { PoolBadge } from "./pool-badge";
import { StatusBadge } from "./status-badge";
import { Link } from "@/i18n/navigation";

interface RegistrationsTableProps {
  registrations: Registration[];
}

export function RegistrationsTable({ registrations }: RegistrationsTableProps) {
  const t = useTranslations("registrations");
  const locale = useLocale();

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString(locale, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {t("name")}
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {t("email")}
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {t("phone")}
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {t("priority")}
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {t("pool")}
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {t("qualified")}
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {t("completed")}
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {t("createdAt")}
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {t("actions")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {registrations.map((registration) => (
              <tr
                key={registration.id}
                className="hover:bg-muted/30 transition-colors"
              >
                <td className="px-4 py-3 text-sm font-medium text-foreground whitespace-nowrap">
                  {registration.first_name} {registration.last_name}
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">
                  {registration.email}
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">
                  {registration.phone || "-"}
                </td>
                <td className="px-4 py-3 text-sm whitespace-nowrap">
                  <PriorityBadge priority={registration.priority_level} />
                </td>
                <td className="px-4 py-3 text-sm whitespace-nowrap">
                  <PoolBadge pool={registration.engagement_pool} />
                </td>
                <td className="px-4 py-3 text-sm whitespace-nowrap">
                  <StatusBadge
                    value={registration.is_qualified}
                    trueLabel={t("detail.yes")}
                    falseLabel={t("detail.no")}
                  />
                </td>
                <td className="px-4 py-3 text-sm whitespace-nowrap">
                  <StatusBadge
                    value={registration.is_completed}
                    trueLabel={t("detail.yes")}
                    falseLabel={t("detail.no")}
                  />
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">
                  {formatDate(registration.created_at)}
                </td>
                <td className="px-4 py-3 text-sm text-right whitespace-nowrap">
                  <Link href={`/dashboard/registrations/${registration.id}`}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      aria-label={t("actions")}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
