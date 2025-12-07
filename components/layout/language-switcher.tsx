"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { Globe } from "lucide-react";
import { useTransition } from "react";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const switchLocale = (newLocale: "vi" | "en") => {
    startTransition(() => {
      router.replace(pathname, { locale: newLocale });
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Globe className={`h-4 w-4 text-muted-foreground ${isPending ? "animate-spin" : ""}`} />
      <div className="flex rounded-lg border border-border overflow-hidden">
        <button
          onClick={() => switchLocale("vi")}
          disabled={isPending}
          className={`px-3 py-1.5 text-xs font-medium transition-colors ${
            locale === "vi"
              ? "bg-primary text-primary-foreground"
              : "bg-card text-muted-foreground hover:bg-muted"
          } ${isPending ? "opacity-50" : ""}`}
        >
          VI
        </button>
        <button
          onClick={() => switchLocale("en")}
          disabled={isPending}
          className={`px-3 py-1.5 text-xs font-medium transition-colors ${
            locale === "en"
              ? "bg-primary text-primary-foreground"
              : "bg-card text-muted-foreground hover:bg-muted"
          } ${isPending ? "opacity-50" : ""}`}
        >
          EN
        </button>
      </div>
    </div>
  );
}
