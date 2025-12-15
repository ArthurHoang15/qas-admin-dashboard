"use client";

import { useTranslations } from "next-intl";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Save, FilePlus } from "lucide-react";

interface SaveTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  templateCode: string;
  onUpdateExisting: () => void;
  onSaveAsNew: () => void;
  isPending: boolean;
}

export function SaveTemplateModal({
  isOpen,
  onClose,
  templateCode,
  onUpdateExisting,
  onSaveAsNew,
  isPending,
}: SaveTemplateModalProps) {
  const t = useTranslations("emailSender");

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t("saveTemplateTitle")} size="md">
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          {t("saveTemplateDescription", { code: templateCode })}
        </p>

        <div className="flex flex-col gap-3">
          {/* Update existing template button */}
          <button
            onClick={onUpdateExisting}
            disabled={isPending}
            className="flex items-center gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4 text-left transition-colors hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-blue-800 dark:bg-blue-950/40 dark:hover:bg-blue-900/50"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/60">
              <Save className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <div className="font-medium text-blue-900 dark:text-blue-100">
                {t("updateExistingTemplate")}
              </div>
              <div className="text-xs text-blue-600 dark:text-blue-400">
                {templateCode}
              </div>
            </div>
          </button>

          {/* Save as new template button */}
          <button
            onClick={onSaveAsNew}
            disabled={isPending}
            className="flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-left transition-colors hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-emerald-800 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/50"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/60">
              <FilePlus className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <div className="font-medium text-emerald-900 dark:text-emerald-100">
                {t("saveAsNewTemplate")}
              </div>
              <div className="text-xs text-emerald-600 dark:text-emerald-400">
                Auto-generated code
              </div>
            </div>
          </button>
        </div>

        <div className="flex justify-end border-t border-border pt-4">
          <Button variant="ghost" onClick={onClose} disabled={isPending}>
            {t("skipSaving")}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
