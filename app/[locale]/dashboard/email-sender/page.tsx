import { getTranslations } from "next-intl/server";
import { Header } from "@/components/layout";
import { EmailSenderForm } from "@/components/dashboard/email-sender";
import { getTemplates } from "@/actions/template-actions";

export default async function EmailSenderPage() {
  const t = await getTranslations("emailSender");
  const templates = await getTemplates();

  return (
    <div className="min-h-screen bg-background">
      <Header title={t("title")} />
      <div className="p-6">
        <EmailSenderForm templates={templates} />
      </div>
    </div>
  );
}
