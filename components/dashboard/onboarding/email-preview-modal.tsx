"use client";

import { useTranslations } from "next-intl";
import { Modal } from "@/components/ui/modal";

interface EmailPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  html: string | null;
  studentName?: string;
}

export function EmailPreviewModal({ isOpen, onClose, html, studentName }: EmailPreviewModalProps) {
  const t = useTranslations("onboarding");

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={studentName ? `${t("previewEmail")} — ${studentName}` : t("previewEmail")}
      size="3xl"
    >
      <div className="flex flex-col gap-3">
        <div className="flex-1 min-h-[500px] rounded-lg border border-border bg-card overflow-hidden flex flex-col">
          {/* Browser chrome */}
          <div className="flex items-center gap-1.5 border-b border-border bg-muted/50 px-3 py-2">
            <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
            <div className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
            <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
          </div>

          {/* Preview content */}
          <div className="flex-1 overflow-auto bg-white">
            {html ? (
              <iframe
                srcDoc={html}
                className="h-full w-full border-0"
                style={{ minHeight: "480px" }}
                sandbox="allow-same-origin"
                title="Email Preview"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground p-8">
                <p className="text-sm">{t("loadingPreview")}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
