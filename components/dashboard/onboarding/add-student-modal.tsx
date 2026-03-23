"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { createOnboardingStudent } from "@/actions/onboarding-actions";
import type { CreateOnboardingInput } from "@/lib/types";

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const COURSE_OPTIONS = [
  { value: "", label: "-- Select --" },
  { value: "PSAT", label: "PSAT" },
  { value: "BSAT", label: "BSAT" },
  { value: "SSAT", label: "SSAT" },
];

function getTodayString(): string {
  const d = new Date();
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

export function AddStudentModal({ isOpen, onClose, onSuccess }: AddStudentModalProps) {
  const t = useTranslations("onboarding");

  const [studentName, setStudentName] = useState("");
  const [courseName, setCourseName] = useState("");
  const [diagnosticScore, setDiagnosticScore] = useState("");
  const [outputCommitment, setOutputCommitment] = useState(true);
  const [signDate, setSignDate] = useState(getTodayString());
  const [representativeName, setRepresentativeName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [parentName, setParentName] = useState("");
  const [parentEmail, setParentEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setStudentName("");
    setCourseName("");
    setDiagnosticScore("");
    setOutputCommitment(true);
    setSignDate(getTodayString());
    setRepresentativeName("");
    setStudentEmail("");
    setParentName("");
    setParentEmail("");
    setPhone("");
    setError(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!studentName.trim()) {
      setError(t("validation.nameRequired"));
      return;
    }
    if (!courseName) {
      setError(t("validation.courseRequired"));
      return;
    }
    if (!studentEmail.trim()) {
      setError(t("validation.emailRequired"));
      return;
    }
    if (!signDate.trim()) {
      setError(t("validation.signDateRequired"));
      return;
    }

    const scoreNum = diagnosticScore ? Number(diagnosticScore) : null;
    if (diagnosticScore && (isNaN(scoreNum!) || scoreNum! < 0 || scoreNum! > 1600)) {
      setError(t("validation.scoreRange"));
      return;
    }

    setIsSubmitting(true);
    try {
      const input: CreateOnboardingInput = {
        student_name: studentName.trim(),
        course_name: courseName,
        diagnostic_score: scoreNum,
        output_commitment: outputCommitment,
        sign_date: signDate.trim(),
        representative_name: representativeName.trim() || null,
        student_email: studentEmail.trim(),
        parent_name: parentName.trim() || null,
        parent_email: parentEmail.trim() || null,
        phone: phone.trim() || null,
      };

      const result = await createOnboardingStudent(input);
      if (result.success) {
        resetForm();
        onSuccess();
        onClose();
      } else {
        setError(result.error || t("createFailed"));
      }
    } catch {
      setError(t("createFailed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={t("addStudent")} size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: PDF Fields */}
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            {t("sectionPdf")}
          </h3>
          <div className="space-y-4">
            <Input
              label={t("studentName") + " *"}
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder={t("studentNamePlaceholder")}
            />
            <Select
              label={t("course") + " *"}
              options={COURSE_OPTIONS}
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
            />
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <Input
                  label={t("diagnosticScore")}
                  type="number"
                  min={0}
                  max={1600}
                  value={diagnosticScore}
                  onChange={(e) => setDiagnosticScore(e.target.value)}
                  placeholder="0"
                />
              </div>
              <span className="pb-2 text-sm text-muted-foreground">/ 1600</span>
            </div>
            <div className="flex items-center gap-3">
              <Checkbox
                checked={outputCommitment}
                onCheckedChange={() => setOutputCommitment(!outputCommitment)}
              />
              <span className="text-sm font-medium text-foreground">
                {t("outputCommitment")}
              </span>
            </div>
            <Input
              label={t("signDate") + " *"}
              value={signDate}
              onChange={(e) => setSignDate(e.target.value)}
              placeholder="DD/MM/YYYY"
            />
            <Input
              label={t("representativeName")}
              value={representativeName}
              onChange={(e) => setRepresentativeName(e.target.value)}
              placeholder={t("representativeNamePlaceholder")}
            />
          </div>
        </div>

        {/* Section 2: Email Fields */}
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            {t("sectionEmail")}
          </h3>
          <div className="space-y-4">
            <Input
              label={t("studentEmail") + " *"}
              type="email"
              value={studentEmail}
              onChange={(e) => setStudentEmail(e.target.value)}
              placeholder={t("studentEmailPlaceholder")}
            />
            <Input
              label={t("parentName")}
              value={parentName}
              onChange={(e) => setParentName(e.target.value)}
              placeholder={t("parentNamePlaceholder")}
            />
            <Input
              label={t("parentEmail")}
              type="email"
              value={parentEmail}
              onChange={(e) => setParentEmail(e.target.value)}
              placeholder={t("parentEmailPlaceholder")}
            />
            <Input
              label={t("phone")}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={t("phonePlaceholder")}
            />
          </div>
        </div>

        {error && (
          <div className="text-sm text-destructive">{error}</div>
        )}

        <div className="flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={handleClose}>
            {t("cancel")}
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? t("creating") : t("addStudentBtn")}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
