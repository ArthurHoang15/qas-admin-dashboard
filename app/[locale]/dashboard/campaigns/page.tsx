import { getTranslations } from "next-intl/server";
import { Header } from "@/components/layout";
import { CampaignsContent } from "@/components/dashboard/campaigns";

export default async function CampaignsPage() {
  const t = await getTranslations("campaigns");

  return (
    <div className="min-h-screen bg-background">
      <Header title={t("title")} />
      <div className="p-6">
        <CampaignsContent />
      </div>
    </div>
  );
}
