import { getTranslations } from "next-intl/server";
import { Header } from "@/components/layout";
import { OnboardingContent } from "@/components/dashboard/onboarding";

export default async function OnboardingPage() {
  const t = await getTranslations("onboarding");

  return (
    <div className="min-h-screen bg-background">
      <Header title={t("title")} />
      <div className="p-6">
        <OnboardingContent />
      </div>
    </div>
  );
}
