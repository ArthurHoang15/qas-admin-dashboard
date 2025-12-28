import { getTranslations } from "next-intl/server";
import { Header } from "@/components/layout";
import { ContactsContent } from "@/components/dashboard/contacts";

export default async function ContactsPage() {
  const t = await getTranslations("contacts");

  return (
    <div className="min-h-screen bg-background">
      <Header title={t("title")} />
      <div className="p-6">
        <ContactsContent />
      </div>
    </div>
  );
}
