import { getTranslations } from "next-intl/server";
import { Header } from "@/components/layout";
import { UsersContent } from "@/components/dashboard/admin/users-content";

export default async function UsersPage() {
  const t = await getTranslations("admin");

  return (
    <div className="min-h-screen bg-background">
      <Header title={t("title")} />
      <div className="p-6">
        <UsersContent />
      </div>
    </div>
  );
}
