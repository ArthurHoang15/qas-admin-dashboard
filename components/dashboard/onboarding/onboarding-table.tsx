"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useLocale, useTranslations } from "next-intl";
import { MoreHorizontal, Eye, Download, Send, Trash2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { StudentOnboarding } from "@/lib/types";

interface OnboardingTableProps {
  students: StudentOnboarding[];
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  onPreviewEmail: (student: StudentOnboarding) => void;
  onDownloadPdfs: (student: StudentOnboarding) => void;
  onSendEmail: (student: StudentOnboarding) => void;
  onEdit: (student: StudentOnboarding) => void;
  onDelete: (student: StudentOnboarding) => void;
}

const STATUS_STYLES: Record<string, { variant: "warning" | "success" | "danger"; label: string }> = {
  pending: { variant: "warning", label: "pending" },
  sent: { variant: "success", label: "sent" },
  failed: { variant: "danger", label: "failed" },
};

const COURSE_COLORS: Record<string, string> = {
  PSAT: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  BSAT: "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-400",
  SSAT: "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400",
};

export function OnboardingTable({
  students,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onPreviewEmail,
  onDownloadPdfs,
  onSendEmail,
  onEdit,
  onDelete,
}: OnboardingTableProps) {
  const t = useTranslations("onboarding");
  const locale = useLocale();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [dropdownPos, setDropdownPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const buttonRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  const allSelected = students.length > 0 && students.every((s) => selectedIds.has(s.id));

  const openMenu = useCallback((studentId: string) => {
    if (openDropdown === studentId) {
      setOpenDropdown(null);
      return;
    }
    const btn = buttonRefs.current.get(studentId);
    if (btn) {
      const rect = btn.getBoundingClientRect();
      setDropdownPos({ top: rect.bottom + 4, left: rect.right - 192 }); // 192 = w-48
    }
    setOpenDropdown(studentId);
  }, [openDropdown]);

  // Close dropdown on scroll
  useEffect(() => {
    if (!openDropdown) return;
    const close = () => setOpenDropdown(null);
    window.addEventListener("scroll", close, true);
    return () => window.removeEventListener("scroll", close, true);
  }, [openDropdown]);

  const formatRelativeTime = (dateString: string | null) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMin < 1) return t("justNow");
    if (diffMin < 60) return `${diffMin}m`;
    if (diffHours < 24) return `${diffHours}h`;
    return `${diffDays}d`;
  };

  const getCourseColor = (course: string) => {
    return COURSE_COLORS[course.toUpperCase()] || "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
  };

  const currentStudent = openDropdown ? students.find((s) => s.id === openDropdown) : null;

  return (
    <>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={onToggleSelectAll}
                    className="h-4 w-4 rounded border-muted-foreground"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {t("studentName")}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {t("course")}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {t("email")}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {t("signDate")}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {t("status")}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {t("sentAt")}
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {t("actions")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {students.map((student) => {
                const statusInfo = STATUS_STYLES[student.status] || STATUS_STYLES.pending;
                return (
                  <tr key={student.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(student.id)}
                        onChange={() => onToggleSelect(student.id)}
                        className="h-4 w-4 rounded border-muted-foreground"
                      />
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-foreground whitespace-nowrap">
                      {student.student_name}
                    </td>
                    <td className="px-4 py-3 text-sm whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCourseColor(student.course_name)}`}>
                        {student.course_name}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">
                      {student.student_email}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">
                      {student.sign_date}
                    </td>
                    <td className="px-4 py-3 text-sm whitespace-nowrap">
                      <Badge variant={statusInfo.variant}>
                        {t(`statuses.${statusInfo.label}`)}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">
                      {formatRelativeTime(student.sent_at)}
                    </td>
                    <td className="px-4 py-3 text-sm text-right whitespace-nowrap">
                      <Button
                        ref={(el) => {
                          if (el) buttonRefs.current.set(student.id, el);
                        }}
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => openMenu(student.id)}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Dropdown rendered as fixed portal outside the table */}
      {openDropdown && currentStudent && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpenDropdown(null)} />
          <div
            className="fixed z-50 w-48 rounded-lg border border-border bg-card shadow-lg py-1"
            style={{ top: dropdownPos.top, left: dropdownPos.left }}
          >
            <button
              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
              onClick={() => { onPreviewEmail(currentStudent); setOpenDropdown(null); }}
            >
              <Eye className="h-4 w-4" />
              {t("previewEmail")}
            </button>
            <button
              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
              onClick={() => { onDownloadPdfs(currentStudent); setOpenDropdown(null); }}
            >
              <Download className="h-4 w-4" />
              {t("downloadPdfs")}
            </button>
            {currentStudent.status === "pending" && (
              <>
                <button
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                  onClick={() => { onEdit(currentStudent); setOpenDropdown(null); }}
                >
                  <Pencil className="h-4 w-4" />
                  {t("edit")}
                </button>
                <button
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                  onClick={() => { onSendEmail(currentStudent); setOpenDropdown(null); }}
                >
                  <Send className="h-4 w-4" />
                  {t("sendEmail")}
                </button>
                <button
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-muted transition-colors"
                  onClick={() => { onDelete(currentStudent); setOpenDropdown(null); }}
                >
                  <Trash2 className="h-4 w-4" />
                  {t("delete")}
                </button>
              </>
            )}
          </div>
        </>
      )}
    </>
  );
}
