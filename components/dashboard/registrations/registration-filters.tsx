"use client";

import { useTranslations } from "next-intl";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { RegistrationFilters as Filters, FilterOptions } from "@/lib/types";

interface RegistrationFiltersProps {
  filters: Filters;
  filterOptions: FilterOptions;
  onFiltersChange: (filters: Filters) => void;
  onClearFilters: () => void;
}

export function RegistrationFilters({
  filters,
  filterOptions,
  onFiltersChange,
  onClearFilters,
}: RegistrationFiltersProps) {
  const t = useTranslations("registrations");

  const priorityOptions = [
    { value: "", label: t("priority") + " - All" },
    ...filterOptions.priority_levels.map((p) => ({
      value: String(p),
      label: `P${p}`,
    })),
  ];

  const poolOptions = [
    { value: "", label: t("pool") + " - All" },
    ...filterOptions.engagement_pools.map((pool) => ({
      value: pool,
      label: pool,
    })),
  ];

  const qualifiedOptions = [
    { value: "", label: t("qualified") + " - All" },
    { value: "true", label: "Yes" },
    { value: "false", label: "No" },
  ];

  const completedOptions = [
    { value: "", label: t("completed") + " - All" },
    { value: "true", label: "Yes" },
    { value: "false", label: "No" },
  ];

  const hasActiveFilters =
    filters.search ||
    filters.priority_level !== undefined ||
    filters.engagement_pool !== undefined ||
    filters.is_qualified !== undefined ||
    filters.is_completed !== undefined;

  return (
    <div className="space-y-4">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t("searchPlaceholder") || "Search by name or email..."}
              value={filters.search || ""}
              onChange={(e) =>
                onFiltersChange({ ...filters, search: e.target.value || undefined })
              }
              className="pl-10"
            />
          </div>
        </div>

        {/* Priority Filter */}
        <div className="w-full lg:w-40">
          <Select
            options={priorityOptions}
            value={filters.priority_level !== undefined ? String(filters.priority_level) : ""}
            onChange={(e) =>
              onFiltersChange({
                ...filters,
                priority_level: e.target.value ? Number(e.target.value) : undefined,
              })
            }
          />
        </div>

        {/* Pool Filter */}
        <div className="w-full lg:w-40">
          <Select
            options={poolOptions}
            value={filters.engagement_pool || ""}
            onChange={(e) =>
              onFiltersChange({
                ...filters,
                engagement_pool: e.target.value || undefined,
              } as Filters)
            }
          />
        </div>

        {/* Qualified Filter */}
        <div className="w-full lg:w-40">
          <Select
            options={qualifiedOptions}
            value={
              filters.is_qualified !== undefined
                ? String(filters.is_qualified)
                : ""
            }
            onChange={(e) =>
              onFiltersChange({
                ...filters,
                is_qualified:
                  e.target.value === ""
                    ? undefined
                    : e.target.value === "true",
              })
            }
          />
        </div>

        {/* Completed Filter */}
        <div className="w-full lg:w-40">
          <Select
            options={completedOptions}
            value={
              filters.is_completed !== undefined
                ? String(filters.is_completed)
                : ""
            }
            onChange={(e) =>
              onFiltersChange({
                ...filters,
                is_completed:
                  e.target.value === ""
                    ? undefined
                    : e.target.value === "true",
              })
            }
          />
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button variant="ghost" onClick={onClearFilters} className="gap-2">
            <X className="h-4 w-4" />
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}
