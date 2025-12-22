"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MarketingContact } from "@/lib/types";
import { EngagementBadge } from "./engagement-badge";
import { ContactStatusBadge } from "./contact-status-badge";
import { ContactDetailModal } from "./contact-detail-modal";
import { deleteContact } from "@/actions/contact-actions";

interface ContactsTableProps {
  contacts: MarketingContact[];
  onContactDeleted: () => void;
}

export function ContactsTable({ contacts, onContactDeleted }: ContactsTableProps) {
  const t = useTranslations("contacts");
  const locale = useLocale();
  const [selectedContact, setSelectedContact] = useState<MarketingContact | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleViewDetails = (contact: MarketingContact) => {
    setSelectedContact(contact);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedContact(null);
  };

  const handleDelete = async (contact: MarketingContact) => {
    if (!confirm(t("confirmDelete"))) return;

    setDeletingId(contact.id);
    try {
      const result = await deleteContact(contact.id);
      if (result.success) {
        onContactDeleted();
      } else {
        alert(result.error || t("deleteFailed"));
      }
    } catch (error) {
      console.error("Failed to delete contact:", error);
      alert(t("deleteFailed"));
    } finally {
      setDeletingId(null);
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

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {t("email")}
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {t("name")}
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {t("status")}
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {t("engagement")}
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {t("tags")}
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {t("lastEmail")}
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
            {contacts.map((contact) => (
              <tr
                key={contact.id}
                className="hover:bg-muted/30 transition-colors"
              >
                <td className="px-4 py-3 text-sm font-medium text-foreground whitespace-nowrap">
                  {contact.email}
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">
                  {contact.first_name || contact.last_name
                    ? `${contact.first_name || ""} ${contact.last_name || ""}`.trim()
                    : "-"}
                </td>
                <td className="px-4 py-3 text-sm whitespace-nowrap">
                  <ContactStatusBadge status={contact.status} />
                </td>
                <td className="px-4 py-3 text-sm whitespace-nowrap">
                  <EngagementBadge level={contact.engagement_level} />
                </td>
                <td className="px-4 py-3 text-sm whitespace-nowrap">
                  {contact.tags && contact.tags.length > 0 ? (
                    <div className="flex gap-1 flex-wrap max-w-[200px]">
                      {contact.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 text-xs bg-muted rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                      {contact.tags.length > 2 && (
                        <span className="px-2 py-0.5 text-xs bg-muted rounded-full">
                          +{contact.tags.length - 2}
                        </span>
                      )}
                    </div>
                  ) : (
                    "-"
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">
                  {formatDate(contact.last_email_at)}
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">
                  {formatDate(contact.created_at)}
                </td>
                <td className="px-4 py-3 text-sm text-right whitespace-nowrap">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      aria-label={t("viewDetails")}
                      onClick={() => handleViewDetails(contact)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      aria-label={t("delete")}
                      onClick={() => handleDelete(contact)}
                      disabled={deletingId === contact.id}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ContactDetailModal
        contact={selectedContact}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </Card>
  );
}
