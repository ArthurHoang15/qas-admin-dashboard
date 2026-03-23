"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Send, X } from "lucide-react";

interface BulkSendBarProps {
  count: number;
  onSend: () => void;
  onClear: () => void;
}

export function BulkSendBar({ count, onSend, onClear }: BulkSendBarProps) {
  const t = useTranslations("onboarding");

  if (count === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 rounded-xl border border-border bg-card px-6 py-3 shadow-lg">
      <span className="text-sm font-medium text-foreground">
        {t("selectedCount", { count })}
      </span>
      <Button variant="primary" size="sm" onClick={onSend} className="gap-2">
        <Send className="h-4 w-4" />
        {t("sendAll")}
      </Button>
      <Button variant="ghost" size="sm" onClick={onClear} className="gap-1">
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
