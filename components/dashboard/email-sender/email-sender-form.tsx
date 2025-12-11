"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { sendEmails } from "@/actions/email-actions";
import { TemplateSelector } from "./template-selector";
import { EmailPreviewPanel } from "./email-preview-panel";
import { InfoBox } from "./info-box";
import { SendResultModal } from "./send-result-modal";
import type { EmailTemplate, EmailFormData, BatchEmailResult } from "@/lib/types";

interface EmailSenderFormProps {
  templates: EmailTemplate[];
}

export function EmailSenderForm({ templates }: EmailSenderFormProps) {
  const t = useTranslations("emailSender");
  const [isPending, startTransition] = useTransition();
  const [showResultModal, setShowResultModal] = useState(false);
  const [sendResult, setSendResult] = useState<BatchEmailResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<EmailFormData>({
    from: "QAS Academy <info@qasacademy.com>",
    to: "",
    names: "",
    cc: "",
    subject: "",
    htmlContent: "",
    plainText: "",
    templateCode: null,
  });

  const handleTemplateSelect = (template: EmailTemplate | null) => {
    if (template) {
      setFormData((prev) => ({
        ...prev,
        templateCode: template.template_code,
        subject: template.subject,
        htmlContent: template.html_content,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        templateCode: null,
        subject: "",
        htmlContent: "",
      }));
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = () => {
    setError(null);

    // Basic validation
    if (!formData.from.trim()) {
      setError(t("errorFromRequired"));
      return;
    }
    if (!formData.to.trim()) {
      setError(t("errorToRequired"));
      return;
    }
    if (!formData.subject.trim()) {
      setError(t("errorSubjectRequired"));
      return;
    }
    if (!formData.htmlContent.trim()) {
      setError(t("errorHtmlRequired"));
      return;
    }

    startTransition(async () => {
      const result = await sendEmails(formData);
      setSendResult(result);
      setShowResultModal(true);
    });
  };

  // Get first email/name for preview sample
  const getPreviewSample = () => {
    const emails = formData.to.split(",").map((e) => e.trim()).filter(Boolean);
    const names = formData.names.split(",").map((n) => n.trim());
    return {
      email: emails[0] || "recipient@example.com",
      name: names[0] || undefined,
    };
  };

  const previewSample = getPreviewSample();

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Column - Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t("title")}</CardTitle>
            <p className="text-sm text-muted-foreground">{t("description")}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Template Selector */}
            <TemplateSelector
              templates={templates}
              selectedCode={formData.templateCode}
              onSelect={handleTemplateSelect}
            />

            {/* From */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                {t("from")} <span className="text-destructive">*</span>
              </label>
              <Input
                name="from"
                value={formData.from}
                onChange={handleInputChange}
                placeholder={t("fromPlaceholder")}
              />
              <p className="text-xs text-muted-foreground">{t("fromHint")}</p>
            </div>

            {/* To */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                {t("to")} <span className="text-destructive">*</span>
              </label>
              <Input
                name="to"
                value={formData.to}
                onChange={handleInputChange}
                placeholder={t("toPlaceholder")}
              />
            </div>

            {/* Names */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                {t("names")}
              </label>
              <Input
                name="names"
                value={formData.names}
                onChange={handleInputChange}
                placeholder={t("namesPlaceholder")}
              />
              <p className="text-xs text-muted-foreground">{t("namesHint")}</p>
            </div>

            {/* CC */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                {t("cc")}
              </label>
              <Input
                name="cc"
                value={formData.cc}
                onChange={handleInputChange}
                placeholder={t("ccPlaceholder")}
              />
            </div>

            {/* Subject */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                {t("subject")} <span className="text-destructive">*</span>
              </label>
              <Input
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                placeholder={t("subjectPlaceholder")}
              />
            </div>

            {/* HTML Content */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">
                  {t("htmlContent")} <span className="text-destructive">*</span>
                </label>
                <span className="text-xs text-muted-foreground">
                  {t("variablesHint")}
                </span>
              </div>
              <Textarea
                name="htmlContent"
                value={formData.htmlContent}
                onChange={handleInputChange}
                placeholder={t("htmlContentPlaceholder")}
                rows={8}
                className="font-mono text-sm"
              />
            </div>

            {/* Plain Text */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                {t("plainText")}
              </label>
              <Textarea
                name="plainText"
                value={formData.plainText}
                onChange={handleInputChange}
                placeholder={t("plainTextPlaceholder")}
                rows={4}
              />
            </div>

            {/* Error message */}
            {error && (
              <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            {/* Action button */}
            <div className="pt-2">
              <Button
                onClick={handleSubmit}
                disabled={isPending}
                className="gap-2"
              >
                <Send className="h-4 w-4" />
                {isPending ? t("sending") : t("sendEmail")}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Right Column - Preview */}
        <div className="lg:sticky lg:top-6 lg:h-fit">
          <EmailPreviewPanel
            html={formData.htmlContent}
            subject={formData.subject}
            sampleEmail={previewSample.email}
            sampleName={previewSample.name}
          />
        </div>
      </div>

      {/* Info Box */}
      <InfoBox />

      {/* Result Modal */}
      <SendResultModal
        isOpen={showResultModal}
        onClose={() => setShowResultModal(false)}
        result={sendResult}
      />
    </div>
  );
}
