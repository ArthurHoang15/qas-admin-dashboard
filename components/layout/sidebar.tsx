"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { LayoutDashboard, Mail, Users, LogOut, Send, BookUser, Megaphone } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useTransition } from "react";

interface NavItem {
  href: string;
  labelKey: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { href: "/dashboard", labelKey: "dashboard", icon: LayoutDashboard },
  { href: "/dashboard/templates", labelKey: "templates", icon: Mail },
  { href: "/dashboard/email-sender", labelKey: "emailSender", icon: Send },
  { href: "/dashboard/registrations", labelKey: "registrations", icon: Users },
  { href: "/dashboard/contacts", labelKey: "contacts", icon: BookUser },
  { href: "/dashboard/campaigns", labelKey: "campaigns", icon: Megaphone },
];

export default function Sidebar() {
  const pathname = usePathname();
  const t = useTranslations("sidebar");
  const tHeader = useTranslations("header");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    startTransition(() => {
      router.push("/login");
    });
  };

  const isActive = (href: string) => {
    // Remove locale prefix for comparison
    const pathWithoutLocale = pathname.replace(/^\/(vi|en)/, "");
    if (href === "/dashboard") {
      return pathWithoutLocale === "/dashboard" || pathWithoutLocale === "/";
    }
    return pathWithoutLocale.startsWith(href);
  };

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-card">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center border-b border-border px-6">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="text-sm font-bold text-primary-foreground">Q</span>
            </div>
            <span className="text-lg font-semibold text-foreground">QAS Admin</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="h-5 w-5" />
                {t(item.labelKey)}
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="border-t border-border p-3">
          <button
            onClick={handleLogout}
            disabled={isPending}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive ${isPending ? "opacity-50" : ""}`}
          >
            <LogOut className={`h-5 w-5 ${isPending ? "animate-spin" : ""}`} />
            {tHeader("logout")}
          </button>
        </div>
      </div>
    </aside>
  );
}
