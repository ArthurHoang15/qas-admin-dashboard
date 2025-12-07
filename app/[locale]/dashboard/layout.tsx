import { DashboardLayout } from "@/components/layout";

export default function DashboardLayoutPage({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
