"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Eye, Trash2, Play, Pause, Copy, Archive } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CampaignWithRates } from "@/lib/types";
import { CampaignStatusBadge } from "./campaign-status-badge";
import {
  deleteCampaign,
  startCampaign,
  pauseCampaign,
  resumeCampaign,
  archiveCampaign,
  duplicateCampaign,
} from "@/actions/campaign-actions";

interface CampaignsTableProps {
  campaigns: CampaignWithRates[];
  onCampaignUpdated: () => void;
}

export function CampaignsTable({ campaigns, onCampaignUpdated }: CampaignsTableProps) {
  const t = useTranslations("campaigns");
  const locale = useLocale();
  const router = useRouter();
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const handleViewDetails = (campaign: CampaignWithRates) => {
    router.push(`/dashboard/campaigns/${campaign.id}`);
  };

  const handleDelete = async (campaign: CampaignWithRates) => {
    if (!confirm(t("confirmDelete"))) return;

    setActionLoading(campaign.id);
    try {
      const result = await deleteCampaign(campaign.id);
      if (result.success) {
        onCampaignUpdated();
      } else {
        alert(result.error || t("deleteFailed"));
      }
    } catch (error) {
      console.error("Failed to delete campaign:", error);
      alert(t("deleteFailed"));
    } finally {
      setActionLoading(null);
    }
  };

  const handleStart = async (campaign: CampaignWithRates) => {
    if (!confirm(t("confirmStart"))) return;

    setActionLoading(campaign.id);
    try {
      const result = await startCampaign(campaign.id);
      if (result.success) {
        onCampaignUpdated();
      } else {
        alert(result.error || t("startFailed"));
      }
    } catch (error) {
      console.error("Failed to start campaign:", error);
      alert(t("startFailed"));
    } finally {
      setActionLoading(null);
    }
  };

  const handlePause = async (campaign: CampaignWithRates) => {
    setActionLoading(campaign.id);
    try {
      const result = await pauseCampaign(campaign.id);
      if (result.success) {
        onCampaignUpdated();
      } else {
        alert(result.error || t("pauseFailed"));
      }
    } catch (error) {
      console.error("Failed to pause campaign:", error);
      alert(t("pauseFailed"));
    } finally {
      setActionLoading(null);
    }
  };

  const handleResume = async (campaign: CampaignWithRates) => {
    setActionLoading(campaign.id);
    try {
      const result = await resumeCampaign(campaign.id);
      if (result.success) {
        onCampaignUpdated();
      } else {
        alert(result.error || t("resumeFailed"));
      }
    } catch (error) {
      console.error("Failed to resume campaign:", error);
      alert(t("resumeFailed"));
    } finally {
      setActionLoading(null);
    }
  };

  const handleArchive = async (campaign: CampaignWithRates) => {
    if (!confirm(t("confirmArchive"))) return;

    setActionLoading(campaign.id);
    try {
      const result = await archiveCampaign(campaign.id);
      if (result.success) {
        onCampaignUpdated();
      } else {
        alert(result.error || t("archiveFailed"));
      }
    } catch (error) {
      console.error("Failed to archive campaign:", error);
      alert(t("archiveFailed"));
    } finally {
      setActionLoading(null);
    }
  };

  const handleDuplicate = async (campaign: CampaignWithRates) => {
    setActionLoading(campaign.id);
    try {
      const result = await duplicateCampaign(campaign.id);
      if (result.success) {
        onCampaignUpdated();
      } else {
        alert(result.error || t("duplicateFailed"));
      }
    } catch (error) {
      console.error("Failed to duplicate campaign:", error);
      alert(t("duplicateFailed"));
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString(locale, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const formatPercent = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {t("name")}
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {t("status")}
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {t("template")}
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {t("recipients")}
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {t("openRate")}
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {t("clickRate")}
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {t("createdAt")}
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {t("actions")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {campaigns.map((campaign) => (
              <tr
                key={campaign.id}
                className="hover:bg-muted/30 transition-colors"
              >
                <td className="px-4 py-3 text-sm">
                  <div>
                    <p className="font-medium text-foreground">{campaign.name}</p>
                    {campaign.objective && (
                      <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                        {campaign.objective}
                      </p>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm whitespace-nowrap">
                  <CampaignStatusBadge status={campaign.status} />
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">
                  {campaign.template_code || "-"}
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">
                  {campaign.total_recipients > 0 ? (
                    <span>
                      {campaign.stats_sent}/{campaign.total_recipients}
                    </span>
                  ) : (
                    "-"
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">
                  {campaign.stats_sent > 0 ? formatPercent(campaign.open_rate) : "-"}
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">
                  {campaign.stats_sent > 0 ? formatPercent(campaign.click_rate) : "-"}
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">
                  {formatDate(campaign.created_at)}
                </td>
                <td className="px-4 py-3 text-sm text-right whitespace-nowrap">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      aria-label={t("viewDetails")}
                      onClick={() => handleViewDetails(campaign)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>

                    {/* Start/Resume/Pause based on status */}
                    {campaign.status === 'draft' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-green-600 hover:text-green-700"
                        aria-label={t("start")}
                        onClick={() => handleStart(campaign)}
                        disabled={actionLoading === campaign.id}
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                    )}

                    {campaign.status === 'paused' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-green-600 hover:text-green-700"
                        aria-label={t("resume")}
                        onClick={() => handleResume(campaign)}
                        disabled={actionLoading === campaign.id}
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                    )}

                    {campaign.status === 'sending' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-yellow-600 hover:text-yellow-700"
                        aria-label={t("pause")}
                        onClick={() => handlePause(campaign)}
                        disabled={actionLoading === campaign.id}
                      >
                        <Pause className="h-4 w-4" />
                      </Button>
                    )}

                    {/* Duplicate */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      aria-label={t("duplicate")}
                      onClick={() => handleDuplicate(campaign)}
                      disabled={actionLoading === campaign.id}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>

                    {/* Archive */}
                    {['completed', 'paused'].includes(campaign.status) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        aria-label={t("archive")}
                        onClick={() => handleArchive(campaign)}
                        disabled={actionLoading === campaign.id}
                      >
                        <Archive className="h-4 w-4" />
                      </Button>
                    )}

                    {/* Delete (only draft) */}
                    {campaign.status === 'draft' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        aria-label={t("delete")}
                        onClick={() => handleDelete(campaign)}
                        disabled={actionLoading === campaign.id}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
