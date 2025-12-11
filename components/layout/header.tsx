"use client";

import { useTranslations } from "next-intl";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import LanguageSwitcher from "./language-switcher";
import { ThemeToggle } from "./theme-toggle";

interface HeaderProps {
  title?: string;
  showBack?: boolean;
}

export default function Header({ title, showBack }: HeaderProps) {
  const t = useTranslations("header");
  const router = useRouter();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="flex items-center gap-3">
        {showBack && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => router.back()}
            className="gap-2 px-3 border border-border hover:bg-muted"
            aria-label={t("back")}
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">{t("back")}</span>
          </Button>
        )}
        {title && (
          <h1 className="text-xl font-semibold text-foreground">{title}</h1>
        )}
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <LanguageSwitcher />
      </div>
    </header>
  );
}
