import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getCampaignById } from "@/actions/campaign-actions";
import { CampaignDetail } from "@/components/dashboard/campaigns/campaign-detail";

interface CampaignDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: CampaignDetailPageProps) {
  const { id } = await params;
  const campaign = await getCampaignById(id);
  const t = await getTranslations("campaigns");

  if (!campaign) {
    return { title: t("campaignNotFound") };
  }

  return {
    title: campaign.name,
  };
}

export default async function CampaignDetailPage({ params }: CampaignDetailPageProps) {
  const { id } = await params;
  const campaign = await getCampaignById(id);

  if (!campaign) {
    notFound();
  }

  return <CampaignDetail campaign={campaign} />;
}
