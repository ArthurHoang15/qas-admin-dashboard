import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowLeft, Edit } from "lucide-react";
import { Header } from "@/components/layout";
import { Button } from "@/components/ui";
import { HtmlPreview } from "@/components/dashboard/templates";
import { getTemplateByCode } from "@/actions/template-actions";

interface TemplateDetailPageProps {
  params: Promise<{ code: string }>;
}

export default async function TemplateDetailPage({ params }: TemplateDetailPageProps) {
  const { code } = await params;
  const t = await getTranslations("templates");
  const tCommon = await getTranslations("common");

  const template = await getTemplateByCode(decodeURIComponent(code));

  if (!template) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <Header title={template.template_code} />

      <div className="p-6 space-y-6">
        {/* Back Button & Actions */}
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard/templates"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            {tCommon("back")}
          </Link>
          <Link href={`/dashboard/templates/${code}/edit`}>
            <Button>
              <Edit className="h-4 w-4 mr-2" />
              {tCommon("edit")}
            </Button>
          </Link>
        </div>

        {/* Template Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Template Details
              </h2>

              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">
                    {t("code")}
                  </dt>
                  <dd className="mt-1 text-foreground font-mono text-sm">
                    {template.template_code}
                  </dd>
                </div>

                <div>
                  <dt className="text-sm font-medium text-muted-foreground">
                    {t("subject")}
                  </dt>
                  <dd className="mt-1 text-foreground">
                    {template.subject}
                  </dd>
                </div>

                {template.description && (
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">
                      {t("description")}
                    </dt>
                    <dd className="mt-1 text-foreground">
                      {template.description}
                    </dd>
                  </div>
                )}

                <div>
                  <dt className="text-sm font-medium text-muted-foreground">
                    {t("content")}
                  </dt>
                  <dd className="mt-2">
                    <pre className="p-4 rounded-lg bg-muted text-xs overflow-x-auto max-h-[300px] overflow-y-auto">
                      <code>{template.html_content}</code>
                    </pre>
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Preview */}
          <div>
            <div className="mb-2">
              <span className="text-sm font-medium text-foreground">
                {t("preview")}
              </span>
            </div>
            <HtmlPreview html={template.html_content} className="h-[500px]" />
          </div>
        </div>
      </div>
    </div>
  );
}
