"use client";

import { useTranslations } from "next-intl";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import type { BatchEmailResult } from "@/lib/types";

interface SendResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: BatchEmailResult | null;
}

export function SendResultModal({
  isOpen,
  onClose,
  result,
}: SendResultModalProps) {
  const t = useTranslations("emailSender");

  if (!result) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t("resultTitle")} size="lg">
      <div className="space-y-4">
        {/* Summary */}
        <div className="flex gap-4">
          <div className="flex-1 rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-950/30">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {result.totalSent}
            </div>
            <div className="text-sm text-green-700 dark:text-green-300">
              {t("resultSent")}
            </div>
          </div>
          <div className="flex-1 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/30">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {result.totalFailed}
            </div>
            <div className="text-sm text-red-700 dark:text-red-300">
              {t("resultFailed")}
            </div>
          </div>
        </div>

        {/* General error */}
        {result.error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-900 dark:bg-red-950/30">
            <p className="text-sm text-red-700 dark:text-red-300">
              {result.error}
            </p>
          </div>
        )}

        {/* Individual results */}
        {result.results.length > 0 && (
          <div className="max-h-60 overflow-y-auto space-y-2">
            {result.results.map((item, index) => (
              <div
                key={index}
                className={`flex items-center justify-between rounded-lg border p-3 ${
                  item.success
                    ? "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/30"
                    : "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30"
                }`}
              >
                <div className="flex items-center gap-2">
                  {item.success ? (
                    <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                  )}
                  <span className="text-sm font-medium text-foreground">
                    {item.email}
                  </span>
                </div>
                <span
                  className={`text-xs ${
                    item.success
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {item.success ? t("resultSuccess") : item.error || t("resultError")}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Close button */}
        <div className="flex justify-end pt-2">
          <Button onClick={onClose}>{t("close")}</Button>
        </div>
      </div>
    </Modal>
  );
}
