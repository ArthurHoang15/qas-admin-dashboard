"use client";

import { useTranslations } from "next-intl";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import type { StudentOnboarding } from "@/lib/types";

interface SendConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  student?: StudentOnboarding | null;
  bulkCount?: number;
  isSending: boolean;
  progress?: { current: number; total: number };
}

export function SendConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  student,
  bulkCount,
  isSending,
  progress,
}: SendConfirmModalProps) {
  const t = useTranslations("onboarding");

  const isBulk = !student && bulkCount !== undefined && bulkCount > 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t("confirmSendTitle")} size="md">
      <div className="space-y-4">
        {isBulk ? (
          <p className="text-sm text-foreground">
            {t("confirmBulkSend", { count: bulkCount })}
          </p>
        ) : student ? (
          <div className="space-y-2">
            <p className="text-sm text-foreground">{t("confirmSendMessage")}</p>
            <div className="rounded-lg border border-border bg-muted/30 p-3 space-y-1">
              <p className="text-sm">
                <span className="text-muted-foreground">{t("studentName")}:</span>{" "}
                <span className="font-medium">{student.student_name}</span>
              </p>
              <p className="text-sm">
                <span className="text-muted-foreground">{t("course")}:</span>{" "}
                <span className="font-medium">{student.course_name}</span>
              </p>
              <p className="text-sm">
                <span className="text-muted-foreground">{t("email")}:</span>{" "}
                <span className="font-medium">{student.student_email}</span>
              </p>
              {student.parent_email && (
                <p className="text-sm">
                  <span className="text-muted-foreground">CC:</span>{" "}
                  <span className="font-medium">{student.parent_email}</span>
                </p>
              )}
            </div>
          </div>
        ) : null}

        {isSending && progress && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{t("sending")}</span>
              <span>{progress.current}/{progress.total}</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: `${(progress.current / progress.total) * 100}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose} disabled={isSending}>
            {t("cancel")}
          </Button>
          <Button variant="primary" onClick={onConfirm} disabled={isSending} className="gap-2">
            {isSending ? (
              <div className="w-4 h-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            {isSending ? t("sending") : t("sendEmail")}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
