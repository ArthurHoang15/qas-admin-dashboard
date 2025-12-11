"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Input, Textarea, Button } from "@/components/ui";
import { HtmlPreview } from "./html-preview";
import { createTemplate, updateTemplate } from "@/actions/template-actions";
import { EmailTemplate } from "@/lib/types";

interface TemplateFormProps {
  template?: EmailTemplate;
  mode: "create" | "edit";
}

export function TemplateForm({ template, mode }: TemplateFormProps) {
  const router = useRouter();
  const t = useTranslations("templates");
  const tCommon = useTranslations("common");

  const [formData, setFormData] = useState({
    template_code: template?.template_code || "",
    subject: template?.subject || "",
    html_content: template?.html_content || "",
    description: template?.description || "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      let result;

      if (mode === "create") {
        result = await createTemplate({
          template_code: formData.template_code,
          subject: formData.subject,
          html_content: formData.html_content,
          description: formData.description || undefined,
        });
      } else {
        result = await updateTemplate(template!.template_code, {
          subject: formData.subject,
          html_content: formData.html_content,
          description: formData.description || undefined,
        });
      }

      if (result.success) {
        router.push("/dashboard/templates");
        router.refresh();
      } else {
        setError(result.error || "An error occurred");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Left Column - Form Inputs */}
        <div className="space-y-4">
          <Input
            id="template_code"
            label={t("code")}
            value={formData.template_code}
            onChange={(e) =>
              setFormData({ ...formData, template_code: e.target.value })
            }
            placeholder="e.g., welcome_email"
            required
            disabled={mode === "edit"}
          />

          <Input
            id="subject"
            label={t("subject")}
            value={formData.subject}
            onChange={(e) =>
              setFormData({ ...formData, subject: e.target.value })
            }
            placeholder="Email subject line"
            required
          />

          <Input
            id="description"
            label={t("description")}
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Optional description..."
          />

          <Textarea
            id="html_content"
            label={t("content")}
            value={formData.html_content}
            onChange={(e) =>
              setFormData({ ...formData, html_content: e.target.value })
            }
            placeholder="<html>...</html>"
            required
            className="min-h-[300px] font-mono text-sm"
          />

          <div className="p-3 rounded-lg bg-muted">
            <p className="text-xs font-medium text-muted-foreground mb-1">
              {t("variables")}
            </p>
            <p className="text-xs text-muted-foreground">
              {t("variablesHint")}
            </p>
            <div className="flex gap-2 mt-2">
              <code className="text-xs bg-card px-2 py-1 rounded border border-border">
                {"{{email}}"}
              </code>
              <code className="text-xs bg-card px-2 py-1 rounded border border-border">
                {"{{name}}"}
              </code>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? tCommon("loading") : tCommon("save")}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => router.back()}
              disabled={isLoading}
            >
              {tCommon("cancel")}
            </Button>
          </div>
        </div>

        {/* Right Column - Preview */}
        <div className="flex flex-col lg:sticky lg:top-20">
          <div className="mb-2">
            <span className="text-sm font-medium text-foreground">
              {t("preview")}
            </span>
          </div>
          <HtmlPreview html={formData.html_content} className="flex-1 min-h-[400px]" />
        </div>
      </div>
    </form>
  );
}
