import { getTranslations } from "next-intl/server";
import { Header } from "@/components/layout";
import { TemplateList } from "@/components/dashboard/templates";
import { getTemplates } from "@/actions/template-actions";

export default async function TemplatesPage() {
  const t = await getTranslations("templates");
  const templates = await getTemplates();

  return (
    <div className="min-h-screen bg-background">
      <Header title={t("title")} />
      <div className="p-6">
        <TemplateList templates={templates} />
      </div>
    </div>
  );
}
