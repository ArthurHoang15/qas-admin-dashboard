"use client";

import { useTranslations } from "next-intl";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ContactFilters as Filters } from "@/lib/types";

// Contact status options
const ALL_STATUSES = ["active", "unsubscribed", "bounced", "complained"] as const;

// Engagement level options
const ALL_ENGAGEMENT_LEVELS = ["none", "sent", "opened", "clicked"] as const;

interface ContactFiltersProps {
  filters: Filters;
  availableTags: string[];
  onFiltersChange: (filters: Filters) => void;
  onClearFilters: () => void;
}

export function ContactFilters({
  filters,
  availableTags,
  onFiltersChange,
  onClearFilters,
}: ContactFiltersProps) {
  const t = useTranslations("contacts");

  const statusOptions = [
    { value: "", label: t("status") + " - " + t("all") },
    ...ALL_STATUSES.map((s) => ({
      value: s,
      label: t(`statuses.${s}`),
    })),
  ];

  const engagementOptions = [
    { value: "", label: t("engagement") + " - " + t("all") },
    ...ALL_ENGAGEMENT_LEVELS.map((e) => ({
      value: e,
      label: t(`engagementLevels.${e}`),
    })),
  ];

  const tagOptions = [
    { value: "", label: t("tags") + " - " + t("all") },
    ...availableTags.map((tag) => ({
      value: tag,
      label: tag,
    })),
  ];

  const hasActiveFilters =
    filters.search ||
    filters.status !== undefined ||
    filters.engagement_level !== undefined ||
    (filters.tags && filters.tags.length > 0);

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
                status: e.target.value || undefined,
              } as Filters)
            }
          />
        </div>

        {/* Engagement Filter */}
        <div className="w-full lg:w-44">
          <Select
            options={engagementOptions}
            value={filters.engagement_level || ""}
            onChange={(e) =>
              onFiltersChange({
                ...filters,
                engagement_level: e.target.value || undefined,
              } as Filters)
            }
          />
        </div>

        {/* Tags Filter */}
        <div className="w-full lg:w-44">
          <Select
            options={tagOptions}
            value={filters.tags?.[0] || ""}
            onChange={(e) =>
              onFiltersChange({
                ...filters,
                tags: e.target.value ? [e.target.value] : undefined,
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
