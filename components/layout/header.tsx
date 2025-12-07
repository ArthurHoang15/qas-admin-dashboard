"use client";

import { useTranslations } from "next-intl";
import LanguageSwitcher from "./language-switcher";

interface HeaderProps {
  title?: string;
}

export default function Header({ title }: HeaderProps) {
  const t = useTranslations("header");

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div>
        {title && (
          <h1 className="text-xl font-semibold text-foreground">{title}</h1>
        )}
      </div>
      <div className="flex items-center gap-4">
        <LanguageSwitcher />
      </div>
    </header>
  );
}
