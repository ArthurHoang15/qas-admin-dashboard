"use client";

import { useLocale, useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
import { Registration } from "@/lib/types";
import { PriorityBadge } from "./priority-badge";
import { PoolBadge } from "./pool-badge";
import { StatusBadge } from "./status-badge";

interface DetailRowProps {
  label: string;
  value?: string | number | null;
  children?: React.ReactNode;
}

function DetailRow({ label, value, children }: DetailRowProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center py-3 border-b border-border last:border-0">
      <span className="text-sm font-medium text-muted-foreground w-full sm:w-48 mb-1 sm:mb-0">
        {label}
      </span>
      <span className="text-sm text-foreground flex-1">
        {children || value || "-"}
      </span>
    </div>
  );
}

interface RegistrationDetailProps {
  registration: Registration;
}

export function RegistrationDetail({ registration }: RegistrationDetailProps) {
  const t = useTranslations("registrations");
  const locale = useLocale();

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString(locale, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Basic Info */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">{t("detail.basicInfo")}</h2>
        <div>
          <DetailRow label="ID" value={registration.id} />
          <DetailRow label={t("name")} value={`${registration.first_name} ${registration.last_name}`} />
          <DetailRow label={t("email")} value={registration.email} />
          <DetailRow label={t("phone")} value={registration.phone} />
          <DetailRow label={t("detail.birthYear")} value={registration.birth_year} />
          <DetailRow label={t("detail.facebook")} value={registration.facebook_link} />
        </div>
      </Card>

      {/* Status & Classification */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">{t("detail.statusClassification")}</h2>
        <div>
          <DetailRow label={t("priority")}>
            <PriorityBadge priority={registration.priority_level} />
          </DetailRow>
          <DetailRow label={t("detail.priorityScore")} value={registration.priority_score} />
          <DetailRow label={t("detail.priorityLabel")} value={registration.priority_label} />
          <DetailRow label={t("pool")}>
            <PoolBadge pool={registration.engagement_pool} />
          </DetailRow>
          <DetailRow label={t("detail.poolName")} value={registration.pool_name} />
          <DetailRow label={t("qualified")}>
            <StatusBadge
              value={registration.is_qualified}
              trueLabel={t("detail.yes")}
              falseLabel={t("detail.no")}
            />
          </DetailRow>
          <DetailRow label={t("completed")}>
            <StatusBadge
              value={registration.is_completed}
              trueLabel={t("detail.yes")}
              falseLabel={t("detail.no")}
            />
          </DetailRow>
        </div>
      </Card>

      {/* SAT Information */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">{t("detail.satInfo")}</h2>
        <div>
          <DetailRow label={t("detail.course")} value={registration.course} />
          <DetailRow label={t("detail.satScore")} value={registration.sat_score} />
          <DetailRow label={t("detail.targetScore")} value={registration.target_score} />
          <DetailRow label={t("detail.testDate")} value={registration.test_date} />
          <DetailRow label={t("detail.satTestStatus")} value={registration.sat_test_status} />
          <DetailRow label={t("detail.discoverySource")} value={registration.discovery_source} />
          <DetailRow label={t("detail.submissionType")} value={registration.submission_type} />
        </div>
      </Card>

      {/* Email Activity */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">{t("detail.emailActivity")}</h2>
        <div>
          <DetailRow label={t("detail.lastEmailSentCode")} value={registration.last_email_sent_code} />
          <DetailRow label={t("detail.lastAction")} value={registration.last_action} />
          <DetailRow label={t("detail.nextEmailDate")} value={formatDate(registration.next_email_date)} />
        </div>
      </Card>

      {/* Timestamps */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">{t("detail.timestamps")}</h2>
        <div>
          <DetailRow label={t("createdAt")} value={formatDate(registration.created_at)} />
          <DetailRow label={t("detail.updatedAt")} value={formatDate(registration.updated_at)} />
        </div>
      </Card>
    </div>
  );
}
