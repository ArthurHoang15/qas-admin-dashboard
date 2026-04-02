"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { updateOnboardingStudent } from "@/actions/onboarding-actions";
import type { StudentOnboarding } from "@/lib/types";

interface EditStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  student: StudentOnboarding | null;
}

const COURSE_OPTIONS = [
  { value: "", label: "-- Select --" },
  { value: "PSAT", label: "PSAT" },
  { value: "BSAT", label: "BSAT" },
  { value: "SSAT", label: "SSAT" },
  { value: "SAT 1-1", label: "SAT 1-1" },
];

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidVietnamesePhone(phone: string): boolean {
  return /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/.test(phone);
}

function isValidDateDDMMYYYY(dateStr: string): boolean {
  const match = dateStr.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return false;
  const day = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  const year = parseInt(match[3], 10);
  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}

export function EditStudentModal({ isOpen, onClose, onSuccess, student }: EditStudentModalProps) {
  const t = useTranslations("onboarding");

  const [studentName, setStudentName] = useState("");
  const [courseName, setCourseName] = useState("");
  const [diagnosticScore, setDiagnosticScore] = useState("");
  const [outputCommitment, setOutputCommitment] = useState(true);
  const [signDate, setSignDate] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [parentName, setParentName] = useState("");
  const [parentEmail, setParentEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Populate form when student changes
  useEffect(() => {
    if (student) {
      setStudentName(student.student_name);
      setCourseName(student.course_name);
      setDiagnosticScore(student.diagnostic_score !== null ? String(student.diagnostic_score) : "");
      setOutputCommitment(student.output_commitment);
      setSignDate(student.sign_date);
      setStudentEmail(student.student_email);
      setParentName(student.parent_name || "");
      setParentEmail(student.parent_email || "");
      setPhone(student.phone || "");
      setFieldErrors({});
      setError(null);
    }
  }, [student]);

  const validate = (): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (!studentName.trim()) {
      errors.studentName = t("validation.nameRequired");
    } else if (studentName.trim().length < 2) {
      errors.studentName = t("validation.nameMinLength");
    } else if (/^\d+$/.test(studentName.trim())) {
      errors.studentName = t("validation.nameNotNumber");
    }

    if (!courseName) {
      errors.courseName = t("validation.courseRequired");
    }

    if (!studentEmail.trim()) {
      errors.studentEmail = t("validation.emailRequired");
    } else if (!isValidEmail(studentEmail.trim())) {
      errors.studentEmail = t("validation.emailFormat");
    }

    if (!signDate.trim()) {
      errors.signDate = t("validation.signDateRequired");
    } else if (!isValidDateDDMMYYYY(signDate.trim())) {
      errors.signDate = t("validation.signDateFormat");
    }

    if (!diagnosticScore.trim()) {
      errors.diagnosticScore = t("validation.scoreRequired");
    } else {
      const scoreNum = Number(diagnosticScore);
      if (isNaN(scoreNum) || scoreNum < 0 || scoreNum > 1600) {
        errors.diagnosticScore = t("validation.scoreRange");
      } else if (!Number.isInteger(scoreNum)) {
        errors.diagnosticScore = t("validation.scoreInteger");
      }
    }

    if (parentName.trim() && parentName.trim().length < 2) {
      errors.parentName = t("validation.nameMinLength");
    } else if (parentName.trim() && /^\d+$/.test(parentName.trim())) {
      errors.parentName = t("validation.nameNotNumber");
    }
    if (parentEmail.trim() && !isValidEmail(parentEmail.trim())) {
      errors.parentEmail = t("validation.parentEmailFormat");
    }
    if (phone.trim() && !isValidVietnamesePhone(phone.trim())) {
      errors.phone = t("validation.phoneFormat");
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!student) return;

    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const scoreNum = Number(diagnosticScore);

    setIsSubmitting(true);
    try {
      const result = await updateOnboardingStudent(student.id, {
        student_name: studentName.trim(),
        course_name: courseName,
        diagnostic_score: scoreNum,
        output_commitment: outputCommitment,
        sign_date: signDate.trim(),
        representative_name: "QAS Academy",
        student_email: studentEmail.trim(),
        parent_name: parentName.trim() || null,
        parent_email: parentEmail.trim() || null,
        phone: phone.trim() || null,
      });

      if (result.success) {
        onSuccess();
        onClose();
      } else {
        setError(result.error || t("updateFailed"));
      }
    } catch {
      setError(t("updateFailed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t("editStudent")} size="lg">
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
              error={fieldErrors.studentName}
            />
            <Select
              label={t("course") + " *"}
              options={COURSE_OPTIONS}
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              error={fieldErrors.courseName}
            />
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <Input
                  label={t("diagnosticScore") + " *"}
                  type="number"
                  min={0}
                  max={1600}
                  value={diagnosticScore}
                  onChange={(e) => setDiagnosticScore(e.target.value)}
                  placeholder="0"
                  error={fieldErrors.diagnosticScore}
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
              error={fieldErrors.signDate}
            />
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                {t("representativeName")}
              </label>
              <div className="px-3 py-2 text-sm rounded-md border border-input bg-muted text-muted-foreground">
                QAS Academy
              </div>
            </div>
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
              error={fieldErrors.studentEmail}
            />
            <Input
              label={t("parentName")}
              value={parentName}
              onChange={(e) => setParentName(e.target.value)}
              error={fieldErrors.parentName}
            />
            <Input
              label={t("parentEmail")}
              type="email"
              value={parentEmail}
              onChange={(e) => setParentEmail(e.target.value)}
              error={fieldErrors.parentEmail}
            />
            <Input
              label={t("phone")}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              error={fieldErrors.phone}
            />
          </div>
        </div>

        {error && (
          <div className="text-sm text-destructive">{error}</div>
        )}

        <div className="flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            {t("cancel")}
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? t("saving") : t("saveChanges")}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
