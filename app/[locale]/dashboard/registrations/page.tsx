import { getTranslations } from "next-intl/server";
import { Header } from "@/components/layout";
import { RegistrationsContent } from "@/components/dashboard/registrations";

export default async function RegistrationsPage() {
  const t = await getTranslations("registrations");

  return (
    <div className="min-h-screen bg-background">
      <Header title={t("title")} />
      <div className="p-6">
        <RegistrationsContent />
      </div>
    </div>
  );
}
