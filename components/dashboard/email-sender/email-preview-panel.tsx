"use client";

import { useTranslations } from "next-intl";
import { useMemo } from "react";

interface EmailPreviewPanelProps {
  html: string;
  subject: string;
  sampleEmail?: string;
  sampleName?: string;
  className?: string;
}

/**
 * Replace {{email}} and {{name}} placeholders for preview
 */
function replacePlaceholders(
  content: string,
  email: string,
  name?: string
): string {
  let result = content.replace(/\{\{email\}\}/gi, email);
  result = result.replace(/\{\{name\}\}/gi, name || email.split("@")[0]);
  return result;
}

export function EmailPreviewPanel({
  html,
  subject,
  sampleEmail = "example@email.com",
  sampleName,
  className = "",
}: EmailPreviewPanelProps) {
  const t = useTranslations("emailSender");

  const previewHtml = useMemo(
    () => replacePlaceholders(html, sampleEmail, sampleName),
    [html, sampleEmail, sampleName]
  );

  const previewSubject = useMemo(
    () => replacePlaceholders(subject, sampleEmail, sampleName),
    [subject, sampleEmail, sampleName]
  );

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground">{t("preview")}</h3>
        <span className="text-xs text-muted-foreground">
          {t("previewSample")}
        </span>
      </div>

      {/* Subject preview */}
      {previewSubject && (
        <div className="rounded-lg border border-border bg-muted/30 p-3">
          <span className="text-xs text-muted-foreground">{t("subject")}:</span>
          <p className="text-sm font-medium text-foreground mt-1">
            {previewSubject}
          </p>
        </div>
      )}

      {/* HTML preview */}
      <div className="flex-1 min-h-[400px] rounded-lg border border-border bg-card overflow-hidden flex flex-col">
        {/* Browser chrome */}
        <div className="flex items-center gap-1.5 border-b border-border bg-muted/50 px-3 py-2">
          <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
          <div className="h-2.5 w-2.5 rounded-full bg-yellow-500" />
          <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
        </div>

        {/* Preview content */}
        <div className="flex-1 overflow-auto bg-white">
          {previewHtml ? (
            <iframe
              srcDoc={previewHtml}
              className="h-full w-full border-0"
              sandbox="allow-same-origin"
              title="Email Preview"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <p className="text-sm">{t("noPreview")}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
