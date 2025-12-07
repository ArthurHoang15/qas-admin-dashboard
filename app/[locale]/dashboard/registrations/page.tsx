import { getTranslations } from "next-intl/server";
import { Header } from "@/components/layout";
import { Users } from "lucide-react";

export default async function RegistrationsPage() {
  const t = await getTranslations("registrations");

  return (
    <div className="min-h-screen bg-background">
      <Header title={t("title")} />
      <div className="p-6">
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Users className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-1">
            Coming in Branch 2
          </h3>
          <p className="text-sm text-muted-foreground">
            Registrations management will be implemented in feature/registrations branch
          </p>
        </div>
      </div>
    </div>
  );
}
