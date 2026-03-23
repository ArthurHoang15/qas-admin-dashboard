"use client";

import { useTranslations } from "next-intl";
import { Modal } from "@/components/ui/modal";
import { Badge } from "@/components/ui/badge";
import type { StudentOnboarding } from "@/lib/types";

interface StudentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentOnboarding | null;
}

const STATUS_VARIANT: Record<string, "warning" | "success" | "danger"> = {
  pending: "warning",
  sent: "success",
  failed: "danger",
};

export function StudentDetailsModal({ isOpen, onClose, student }: StudentDetailsModalProps) {
  const t = useTranslations("onboarding");

  if (!student) return null;

  const rows: { label: string; value: string | null }[] = [
    { label: t("studentName"), value: student.student_name },
    { label: t("course"), value: student.course_name },
    { label: t("diagnosticScore"), value: student.diagnostic_score !== null ? `${student.diagnostic_score} / 1600` : "—" },
    { label: t("outputCommitment"), value: student.output_commitment ? t("yes") : t("no") },
    { label: t("signDate"), value: student.sign_date },
    { label: t("representativeName"), value: student.representative_name || "—" },
    { label: t("studentEmail"), value: student.student_email },
    { label: t("parentName"), value: student.parent_name || "—" },
    { label: t("parentEmail"), value: student.parent_email || "—" },
    { label: t("phone"), value: student.phone || "—" },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t("viewDetails")} size="lg">
      <div className="space-y-4">
        {/* Status badge */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">{t("status")}:</span>
          <Badge variant={STATUS_VARIANT[student.status] || "warning"}>
            {t(`statuses.${student.status}`)}
          </Badge>
        </div>

        {/* Info rows */}
        <div className="rounded-lg border border-border divide-y divide-border">
          {rows.map((row) => (
            <div key={row.label} className="flex px-4 py-3">
              <span className="w-40 shrink-0 text-sm text-muted-foreground">{row.label}</span>
              <span className="text-sm font-medium text-foreground">{row.value}</span>
            </div>
          ))}
        </div>

        {/* Send info (if sent or failed) */}
        {student.status !== "pending" && (
          <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-2">
            {student.sent_at && (
              <div className="flex gap-2 text-sm">
                <span className="text-muted-foreground">{t("sentAt")}:</span>
                <span className="font-medium">{new Date(student.sent_at).toLocaleString()}</span>
              </div>
            )}
            {student.sent_by && (
              <div className="flex gap-2 text-sm">
                <span className="text-muted-foreground">{t("sentBy")}:</span>
                <span className="font-medium">{student.sent_by}</span>
              </div>
            )}
            {student.error_message && (
              <div className="flex gap-2 text-sm">
                <span className="text-muted-foreground">{t("errorMessage")}:</span>
                <span className="font-medium text-destructive">{student.error_message}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}
