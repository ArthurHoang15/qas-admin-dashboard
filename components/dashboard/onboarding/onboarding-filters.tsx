"use client";

import { useTranslations } from "next-intl";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { OnboardingFilters as Filters } from "@/lib/types";

interface OnboardingFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  onClearFilters: () => void;
}

export function OnboardingFilters({
  filters,
  onFiltersChange,
  onClearFilters,
}: OnboardingFiltersProps) {
  const t = useTranslations("onboarding");

  const statusOptions = [
    { value: "", label: t("statusAll") },
    { value: "pending", label: t("statuses.pending") },
    { value: "sent", label: t("statuses.sent") },
    { value: "failed", label: t("statuses.failed") },
  ];

  const hasActiveFilters = filters.search || filters.status;

  return (
    <div className="flex flex-col lg:flex-row gap-4">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t("searchPlaceholder")}
            value={filters.search || ""}
            onChange={(e) =>
              onFiltersChange({ ...filters, search: e.target.value || undefined })
            }
            className="pl-10"
          />
        </div>
      </div>

      <div className="w-full lg:w-44">
        <Select
          options={statusOptions}
          value={filters.status || ""}
          onChange={(e) =>
            onFiltersChange({
              ...filters,
              status: (e.target.value || undefined) as Filters["status"],
            })
          }
        />
      </div>

      {hasActiveFilters && (
        <Button variant="ghost" onClick={onClearFilters} className="gap-2">
          <X className="h-4 w-4" />
          {t("clearFilters")}
        </Button>
      )}
    </div>
  );
}
