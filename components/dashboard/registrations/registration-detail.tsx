"use client";

import { useTranslations } from "next-intl";
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

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Basic Info */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
        <div>
          <DetailRow label="ID" value={registration.id} />
          <DetailRow label={t("name")} value={`${registration.first_name} ${registration.last_name}`} />
          <DetailRow label={t("email")} value={registration.email} />
          <DetailRow label={t("phone")} value={registration.phone} />
          <DetailRow label="Birth Year" value={registration.birth_year} />
          <DetailRow label="Facebook" value={registration.facebook_link} />
        </div>
      </Card>

      {/* Status & Classification */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Status & Classification</h2>
        <div>
          <DetailRow label={t("priority")}>
            <PriorityBadge priority={registration.priority_level} />
          </DetailRow>
          <DetailRow label="Priority Score" value={registration.priority_score} />
          <DetailRow label="Priority Label" value={registration.priority_label} />
          <DetailRow label={t("pool")}>
            <PoolBadge pool={registration.engagement_pool} />
          </DetailRow>
          <DetailRow label="Pool Name" value={registration.pool_name} />
          <DetailRow label={t("qualified")}>
            <StatusBadge
              value={registration.is_qualified}
              trueLabel="Yes"
              falseLabel="No"
            />
          </DetailRow>
          <DetailRow label={t("completed")}>
            <StatusBadge
              value={registration.is_completed}
              trueLabel="Yes"
              falseLabel="No"
            />
          </DetailRow>
        </div>
      </Card>

      {/* SAT Information */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">SAT Information</h2>
        <div>
          <DetailRow label="Course" value={registration.course} />
          <DetailRow label="SAT Score" value={registration.sat_score} />
          <DetailRow label="Target Score" value={registration.target_score} />
          <DetailRow label="Test Date" value={registration.test_date} />
          <DetailRow label="SAT Test Status" value={registration.sat_test_status} />
          <DetailRow label="Discovery Source" value={registration.discovery_source} />
          <DetailRow label="Submission Type" value={registration.submission_type} />
        </div>
      </Card>

      {/* Email Activity */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Email Activity</h2>
        <div>
          <DetailRow label="Last Email Sent Code" value={registration.last_email_sent_code} />
          <DetailRow label="Last Action" value={registration.last_action} />
          <DetailRow label="Next Email Date" value={formatDate(registration.next_email_date)} />
        </div>
      </Card>

      {/* Timestamps */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Timestamps</h2>
        <div>
          <DetailRow label={t("createdAt")} value={formatDate(registration.created_at)} />
          <DetailRow label="Updated At" value={formatDate(registration.updated_at)} />
        </div>
      </Card>
    </div>
  );
}
