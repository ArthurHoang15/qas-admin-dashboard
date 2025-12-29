import Sidebar from "./sidebar";
import { getCurrentUserAllowedPages } from "@/actions/rbac-actions";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  // Fetch allowed pages for current user
  const allowedPages = await getCurrentUserAllowedPages();

  return (
    <div className="min-h-screen bg-background">
      <Sidebar allowedPages={allowedPages} />
      <main className="pl-64">
        {children}
      </main>
    </div>
  );
}
