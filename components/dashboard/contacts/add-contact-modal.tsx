"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Loader2, X } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createContact } from "@/actions/contact-actions";

interface AddContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  availableTags: string[];
}

export function AddContactModal({
  isOpen,
  onClose,
  onSuccess,
  availableTags,
}: AddContactModalProps) {
  const t = useTranslations("contacts");
  const tCommon = useTranslations("common");

  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setEmail("");
    setFirstName("");
    setLastName("");
    setSelectedTags([]);
    setNewTag("");
    setError(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleAddTag = () => {
    const tag = newTag.trim();
    if (tag && !selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag));
  };

  const handleSelectTag = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError(t("emailRequired"));
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createContact({
        email: email.trim(),
        first_name: firstName.trim() || undefined,
        last_name: lastName.trim() || undefined,
        tags: selectedTags.length > 0 ? selectedTags : undefined,
        source: "manual",
      });

      if (result.success) {
        onSuccess();
        handleClose();
      } else {
        setError(result.error || t("createFailed"));
      }
    } catch (err) {
      console.error("Failed to create contact:", err);
      setError(t("createFailed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={t("addContact")} size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div>
          <label className="text-sm font-medium mb-1 block">
            {t("email")} <span className="text-destructive">*</span>
          </label>
          <Input
            type="email"
            placeholder="email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Name */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">{t("firstName")}</label>
            <Input
              placeholder={t("firstName")}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">{t("lastName")}</label>
            <Input
              placeholder={t("lastName")}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="text-sm font-medium mb-1 block">{t("tags")}</label>

          {/* Selected tags */}
          {selectedTags.length > 0 && (
            <div className="flex gap-2 flex-wrap mb-2">
              {selectedTags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2 py-1 text-sm bg-primary/10 text-primary rounded-full"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Add new tag */}
          <div className="flex gap-2">
            <Input
              placeholder={t("enterNewTag")}
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
            />
            <Button type="button" variant="outline" onClick={handleAddTag}>
              {t("addTag")}
            </Button>
          </div>

          {/* Available tags */}
          {availableTags.length > 0 && (
            <div className="mt-2">
              <p className="text-xs text-muted-foreground mb-1">{t("existingTags")}:</p>
              <div className="flex gap-1 flex-wrap">
                {availableTags
                  .filter((tag) => !selectedTags.includes(tag))
                  .slice(0, 10)
                  .map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleSelectTag(tag)}
                      className="px-2 py-0.5 text-xs bg-muted rounded-full hover:bg-muted/80"
                    >
                      {tag}
                    </button>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="text-destructive text-sm">{error}</div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="ghost" onClick={handleClose}>
            {tCommon("cancel")}
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {t("creating")}
              </>
            ) : (
              t("createContact")
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
