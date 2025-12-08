import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout";
import { getRegistrationById } from "@/actions/registration-actions";
import { RegistrationDetail } from "@/components/dashboard/registrations/registration-detail";

interface PageProps {
  params: Promise<{ id: string; locale: string }>;
}

export default async function RegistrationDetailPage({ params }: PageProps) {
  const { id } = await params;
  const t = await getTranslations("registrations");

  const registration = await getRegistrationById(Number(id));

  if (!registration) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <Header
        title={`${registration.first_name} ${registration.last_name}`}
        showBack
      />
      <div className="p-6">
        <RegistrationDetail registration={registration} />
      </div>
    </div>
  );
}
