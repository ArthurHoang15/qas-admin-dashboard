"use server";

import { query } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { Resend } from "resend";
import { fillPdfTemplate } from "@/lib/pdf-fill";
import { removeDiacritics } from "@/lib/diacritics";
import * as fs from "fs/promises";
import * as path from "path";
import type {
  StudentOnboarding,
  OnboardingFilters,
  OnboardingStats,
  CreateOnboardingInput,
  PaginationParams,
  PaginatedResult,
} from "@/lib/types";

// ---------------------------------------------------------------------------
// Lazy Resend client (same pattern as email-actions.ts)
// ---------------------------------------------------------------------------

let resendSalesClient: Resend | null = null;

function getResendSalesClient(): Resend {
  if (!resendSalesClient) {
    const apiKey = process.env.RESEND_SALES_API_KEY;
    if (!apiKey) {
      throw new Error("RESEND_SALES_API_KEY environment variable is not configured");
    }
    resendSalesClient = new Resend(apiKey);
  }
  return resendSalesClient;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function loadFile(relativePath: string): Promise<Buffer> {
  const fullPath = path.join(process.cwd(), relativePath);
  return fs.readFile(fullPath);
}

// ---------------------------------------------------------------------------
// CRUD Actions
// ---------------------------------------------------------------------------

export async function getOnboardingStudents(
  filters: OnboardingFilters,
  pagination: PaginationParams = {}
): Promise<PaginatedResult<StudentOnboarding>> {
  const { page = 1, limit = 10, sortBy = "created_at", sortOrder = "desc" } = pagination;

  try {
    const { search, status } = filters;
    const offset = (page - 1) * limit;

    const conditions: string[] = [];
    const params: (string | number | boolean)[] = [];
    let paramIndex = 1;

    if (search && search.trim()) {
      conditions.push(
        `(student_name ILIKE $${paramIndex} OR student_email ILIKE $${paramIndex} OR course_name ILIKE $${paramIndex})`
      );
      params.push(`%${search.trim()}%`);
      paramIndex++;
    }

    if (status) {
      conditions.push(`status = $${paramIndex}`);
      params.push(status);
      paramIndex++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const allowedSortColumns = [
      "created_at", "updated_at", "student_name", "course_name",
      "student_email", "status", "sign_date", "sent_at",
    ];
    const safeSortBy = allowedSortColumns.includes(sortBy) ? sortBy : "created_at";
    const safeSortOrder = sortOrder === "asc" ? "ASC" : "DESC";

    const countResult = await query(
      `SELECT COUNT(*) FROM student_onboarding ${whereClause}`,
      params
    );
    const total = parseInt(countResult.rows[0].count, 10);

    const dataResult = await query(
      `SELECT * FROM student_onboarding ${whereClause}
       ORDER BY "${safeSortBy}" ${safeSortOrder}
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      [...params, limit, offset]
    );

    return {
      data: dataResult.rows as StudentOnboarding[],
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error) {
    console.error("Error fetching onboarding students:", error);
    return { data: [], total: 0, page, limit, totalPages: 0 };
  }
}

export async function getOnboardingStats(): Promise<OnboardingStats> {
  try {
    const result = await query(
      `SELECT status, COUNT(*)::int as count FROM student_onboarding GROUP BY status`
    );

    const stats: OnboardingStats = { total: 0, pending: 0, sent: 0, failed: 0 };
    for (const row of result.rows) {
      const count = row.count as number;
      stats.total += count;
      if (row.status === "pending") stats.pending = count;
      else if (row.status === "sent") stats.sent = count;
      else if (row.status === "failed") stats.failed = count;
    }
    return stats;
  } catch (error) {
    console.error("Error fetching onboarding stats:", error);
    return { total: 0, pending: 0, sent: 0, failed: 0 };
  }
}

export async function createOnboardingStudent(
  input: CreateOnboardingInput
): Promise<{ success: boolean; error?: string }> {
  try {
    // Validation
    if (!input.student_name.trim()) {
      return { success: false, error: "Student name is required" };
    }
    if (!input.course_name.trim()) {
      return { success: false, error: "Course name is required" };
    }
    if (!input.student_email.trim() || !isValidEmail(input.student_email)) {
      return { success: false, error: "Valid student email is required" };
    }
    if (!input.sign_date.trim()) {
      return { success: false, error: "Sign date is required" };
    }
    if (
      input.diagnostic_score !== null &&
      input.diagnostic_score !== undefined &&
      (input.diagnostic_score < 0 || input.diagnostic_score > 1600)
    ) {
      return { success: false, error: "Diagnostic score must be between 0 and 1600" };
    }
    if (input.parent_email && !isValidEmail(input.parent_email)) {
      return { success: false, error: "Invalid parent email format" };
    }

    await query(
      `INSERT INTO student_onboarding
        (student_name, course_name, diagnostic_score, output_commitment, sign_date,
         representative_name, student_email, parent_name, parent_email, phone)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [
        input.student_name.trim(),
        input.course_name.trim(),
        input.diagnostic_score ?? null,
        input.output_commitment,
        input.sign_date.trim(),
        input.representative_name?.trim() || null,
        input.student_email.trim().toLowerCase(),
        input.parent_name?.trim() || null,
        input.parent_email?.trim().toLowerCase() || null,
        input.phone?.trim() || null,
      ]
    );

    revalidatePath("/dashboard/onboarding");
    return { success: true };
  } catch (error) {
    console.error("Error creating onboarding student:", error);
    return { success: false, error: "Failed to create student" };
  }
}

export async function deleteOnboardingStudent(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Only allow deleting pending students
    const existing = await query<{ status: string }>(
      `SELECT status FROM student_onboarding WHERE id = $1`,
      [id]
    );

    if (existing.rows.length === 0) {
      return { success: false, error: "Student not found" };
    }

    if (existing.rows[0].status !== "pending") {
      return { success: false, error: "Cannot delete a student that has already been sent or failed" };
    }

    await query(`DELETE FROM student_onboarding WHERE id = $1`, [id]);

    revalidatePath("/dashboard/onboarding");
    return { success: true };
  } catch (error) {
    console.error("Error deleting onboarding student:", error);
    return { success: false, error: "Failed to delete student" };
  }
}

export async function updateOnboardingStudent(
  id: string,
  input: CreateOnboardingInput
): Promise<{ success: boolean; error?: string }> {
  try {
    // Only allow editing pending students
    const existing = await query<{ status: string }>(
      `SELECT status FROM student_onboarding WHERE id = $1`,
      [id]
    );

    if (existing.rows.length === 0) {
      return { success: false, error: "Student not found" };
    }

    if (existing.rows[0].status !== "pending") {
      return { success: false, error: "Cannot edit a student that has already been sent" };
    }

    // Validation
    if (!input.student_name.trim()) {
      return { success: false, error: "Student name is required" };
    }
    if (!input.course_name.trim()) {
      return { success: false, error: "Course name is required" };
    }
    if (!input.student_email.trim()) {
      return { success: false, error: "Student email is required" };
    }
    if (!input.sign_date.trim()) {
      return { success: false, error: "Sign date is required" };
    }
    if (
      input.diagnostic_score !== null &&
      input.diagnostic_score !== undefined &&
      (input.diagnostic_score < 0 || input.diagnostic_score > 1600)
    ) {
      return { success: false, error: "Diagnostic score must be between 0 and 1600" };
    }

    await query(
      `UPDATE student_onboarding SET
        student_name = $2, course_name = $3, diagnostic_score = $4,
        output_commitment = $5, sign_date = $6, representative_name = $7,
        student_email = $8, parent_name = $9, parent_email = $10,
        phone = $11, updated_at = NOW()
       WHERE id = $1`,
      [
        id,
        input.student_name.trim(),
        input.course_name.trim(),
        input.diagnostic_score ?? null,
        input.output_commitment,
        input.sign_date.trim(),
        input.representative_name?.trim() || null,
        input.student_email.trim().toLowerCase(),
        input.parent_name?.trim() || null,
        input.parent_email?.trim().toLowerCase() || null,
        input.phone?.trim() || null,
      ]
    );

    revalidatePath("/dashboard/onboarding");
    return { success: true };
  } catch (error) {
    console.error("Error updating onboarding student:", error);
    return { success: false, error: "Failed to update student" };
  }
}

// ---------------------------------------------------------------------------
// PDF Generation
// ---------------------------------------------------------------------------

export async function generateOnboardingPdfs(
  studentId: string
): Promise<{ success: boolean; luuY?: string; baoLuu?: string; error?: string }> {
  try {
    const result = await query<StudentOnboarding>(
      `SELECT * FROM student_onboarding WHERE id = $1`,
      [studentId]
    );

    const student = result.rows[0];
    if (!student) {
      return { success: false, error: "Student not found" };
    }

    // Load templates and font
    const [luuYTemplate, baoLuuTemplate, fontBytes] = await Promise.all([
      loadFile("templates/QAS_LuuY_HocVien.pdf"),
      loadFile("templates/QAS_QuyDinh_BaoLuu.pdf"),
      loadFile("fonts/NotoSerif-Regular.ttf"),
    ]);

    // Fill LuuY PDF (7 fields)
    const diagnosticText =
      student.diagnostic_score !== null
        ? `${student.diagnostic_score}`
        : "";

    const luuYBytes = await fillPdfTemplate(
      new Uint8Array(luuYTemplate),
      {
        diagnostic_score: diagnosticText,
        output_commitment_yes: student.output_commitment ? "X" : "",
        output_commitment_no: student.output_commitment ? "" : "X",
        student_name: student.student_name,
        sign_date: student.sign_date,
        representative_name: student.representative_name || "",
        representative_sign_date: student.sign_date,
      },
      new Uint8Array(fontBytes)
    );

    // Fill BaoLuu PDF (2 fields)
    const baoLuuBytes = await fillPdfTemplate(
      new Uint8Array(baoLuuTemplate),
      {
        student_name: student.student_name,
        sign_date: student.sign_date,
      },
      new Uint8Array(fontBytes)
    );

    // Return as base64 strings so they can be sent to the client
    return {
      success: true,
      luuY: Buffer.from(luuYBytes).toString("base64"),
      baoLuu: Buffer.from(baoLuuBytes).toString("base64"),
    };
  } catch (error) {
    console.error("Error generating PDFs:", error);
    return { success: false, error: "Failed to generate PDFs" };
  }
}

// ---------------------------------------------------------------------------
// Email
// ---------------------------------------------------------------------------

export async function previewOnboardingEmail(
  studentId: string
): Promise<{ success: boolean; html?: string; error?: string }> {
  try {
    const result = await query<StudentOnboarding>(
      `SELECT * FROM student_onboarding WHERE id = $1`,
      [studentId]
    );

    const student = result.rows[0];
    if (!student) {
      return { success: false, error: "Student not found" };
    }

    const templateBuffer = await loadFile("templates/QAS_Email_Template.html");
    let html = templateBuffer.toString("utf-8");

    // Replace placeholders
    html = html.replace(/\[Tên học viên\]/g, student.student_name);
    html = html.replace(
      /\[Tên khóa học – ví dụ: BSAT \/ SSAT\]/g,
      student.course_name
    );

    return { success: true, html };
  } catch (error) {
    console.error("Error previewing email:", error);
    return { success: false, error: "Failed to preview email" };
  }
}

export async function sendOnboardingEmail(
  studentId: string,
  senderEmail: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const result = await query<StudentOnboarding>(
      `SELECT * FROM student_onboarding WHERE id = $1`,
      [studentId]
    );

    const student = result.rows[0];
    if (!student) {
      return { success: false, error: "Student not found" };
    }

    if (student.status === "sent") {
      return { success: false, error: "Email already sent for this student" };
    }

    // Generate PDFs
    const pdfResult = await generateOnboardingPdfs(studentId);
    if (!pdfResult.success || !pdfResult.luuY || !pdfResult.baoLuu) {
      return { success: false, error: pdfResult.error || "Failed to generate PDFs" };
    }

    // Load and render email HTML
    const templateBuffer = await loadFile("templates/QAS_Email_Template.html");
    let html = templateBuffer.toString("utf-8");
    html = html.replace(/\[Tên học viên\]/g, student.student_name);
    html = html.replace(
      /\[Tên khóa học – ví dụ: BSAT \/ SSAT\]/g,
      student.course_name
    );

    const safeName = removeDiacritics(student.student_name);
    const subject = `QAS Academy — Thông tin đăng ký khóa ${student.course_name}`;

    // Build CC list
    const cc: string[] = [];
    if (student.parent_email) {
      cc.push(student.parent_email);
    }

    // Send via Resend
    const { data, error } = await getResendSalesClient().emails.send({
      from: `QAS Academy <sale@qascademy.com>`,
      to: student.student_email,
      cc: cc.length > 0 ? cc : undefined,
      subject,
      html,
      attachments: [
        {
          filename: `QAS_LuuY_HocVien_${safeName}.pdf`,
          content: pdfResult.luuY,
        },
        {
          filename: `QAS_QuyDinh_BaoLuu_${safeName}.pdf`,
          content: pdfResult.baoLuu,
        },
      ],
    });

    if (error) {
      // Update status to failed
      await query(
        `UPDATE student_onboarding
         SET status = 'failed', error_message = $2, sent_by = $3, updated_at = NOW()
         WHERE id = $1`,
        [studentId, error.message, senderEmail]
      );
      revalidatePath("/dashboard/onboarding");
      return { success: false, error: error.message };
    }

    // Update status to sent
    await query(
      `UPDATE student_onboarding
       SET status = 'sent', resend_message_id = $2, sent_by = $3, sent_at = NOW(), error_message = NULL, updated_at = NOW()
       WHERE id = $1`,
      [studentId, data?.id || null, senderEmail]
    );

    revalidatePath("/dashboard/onboarding");
    return { success: true };
  } catch (error) {
    console.error("Error sending onboarding email:", error);

    // Update status to failed
    await query(
      `UPDATE student_onboarding
       SET status = 'failed', error_message = $2, sent_by = $3, updated_at = NOW()
       WHERE id = $1`,
      [studentId, error instanceof Error ? error.message : "Unknown error", senderEmail]
    ).catch(() => {});

    revalidatePath("/dashboard/onboarding");
    return { success: false, error: error instanceof Error ? error.message : "Failed to send email" };
  }
}

export async function sendBulkOnboardingEmails(
  studentIds: string[],
  senderEmail: string
): Promise<{ sent: number; failed: number; results: { id: string; success: boolean; error?: string }[] }> {
  const results: { id: string; success: boolean; error?: string }[] = [];
  let sent = 0;
  let failed = 0;

  // Send sequentially to avoid Resend rate limits
  for (const id of studentIds) {
    const result = await sendOnboardingEmail(id, senderEmail);
    results.push({ id, success: result.success, error: result.error });
    if (result.success) {
      sent++;
    } else {
      failed++;
    }
  }

  return { sent, failed, results };
}
