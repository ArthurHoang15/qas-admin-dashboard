"use client";

import { useTranslations } from "next-intl";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CampaignFilters as Filters, CampaignStatus } from "@/lib/types";

const ALL_STATUSES: CampaignStatus[] = ['draft', 'scheduled', 'sending', 'completed', 'paused', 'archived'];

interface CampaignFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  onClearFilters: () => void;
}

export function CampaignFilters({
  filters,
  onFiltersChange,
  onClearFilters,
}: CampaignFiltersProps) {
  const t = useTranslations("campaigns");

  const statusOptions = [
    { value: "", label: t("status") + " - " + t("all") },
    ...ALL_STATUSES.map((s) => ({
      value: s,
      label: t(`statuses.${s}`),
    })),
  ];

  const hasActiveFilters =
    filters.search ||
    filters.status !== undefined ||
    filters.template_code !== undefined;

  return (
    <div className="space-y-4">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
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

        {/* Status Filter */}
        <div className="w-full lg:w-44">
          <Select
            options={statusOptions}
            value={filters.status || ""}
            onChange={(e) =>
              onFiltersChange({
                ...filters,
                status: (e.target.value || undefined) as CampaignStatus | undefined,
              })
            }
          />
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button variant="ghost" onClick={onClearFilters} className="gap-2">
            <X className="h-4 w-4" />
            {t("clearFilters")}
          </Button>
        )}
      </div>
    </div>
  );
}
