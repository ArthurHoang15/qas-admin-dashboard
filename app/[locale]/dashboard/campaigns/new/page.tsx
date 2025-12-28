import { getTranslations } from "next-intl/server";
import { CampaignWizard } from "@/components/dashboard/campaigns/campaign-wizard";
import { Megaphone } from "lucide-react";

export async function generateMetadata() {
  const t = await getTranslations("campaigns");
  return {
    title: t("createCampaign"),
  };
}

export default async function NewCampaignPage() {
  const t = await getTranslations("campaigns");

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/5 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="relative flex items-center gap-4">
          <div className="flex-shrink-0 p-4 bg-primary/10 rounded-2xl">
            <Megaphone className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {t("createCampaign")}
            </h1>
            <p className="text-muted-foreground mt-1">
              {t("createCampaignDescription")}
            </p>
          </div>
        </div>
      </div>

      {/* Wizard */}
      <CampaignWizard mode="create" />
    </div>
  );
}
