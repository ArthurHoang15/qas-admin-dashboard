"use server";

import { query } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { EmailTemplate, EmailTemplateCreateInput, EmailTemplateUpdateInput } from "@/lib/types";

export async function getTemplates(search?: string): Promise<EmailTemplate[]> {
  try {
    let sql = "SELECT * FROM email_templates";
    const params: string[] = [];

    if (search && search.trim()) {
      sql += " WHERE template_code ILIKE $1 OR subject ILIKE $1 OR description ILIKE $1";
      params.push(`%${search.trim()}%`);
    }

    sql += " ORDER BY template_code ASC";

    const result = await query(sql, params);
    return result.rows as EmailTemplate[];
  } catch (error) {
    console.error("Error fetching templates:", error);
    return [];
  }
}

export async function getTemplateByCode(code: string): Promise<EmailTemplate | null> {
  try {
    const result = await query(
      "SELECT * FROM email_templates WHERE template_code = $1",
      [code]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0] as EmailTemplate;
  } catch (error) {
    console.error("Error fetching template:", error);
    return null;
  }
}

export async function createTemplate(data: EmailTemplateCreateInput): Promise<{ success: boolean; error?: string }> {
  try {
    // Check if template code already exists
    const existing = await getTemplateByCode(data.template_code);
    if (existing) {
      return { success: false, error: "Template code already exists" };
    }

    await query(
      `INSERT INTO email_templates (template_code, subject, html_content, description)
       VALUES ($1, $2, $3, $4)`,
      [data.template_code, data.subject, data.html_content, data.description || null]
    );

    revalidatePath("/dashboard/templates");
    return { success: true };
  } catch (error) {
    console.error("Error creating template:", error);
    return { success: false, error: "Failed to create template" };
  }
}

export async function updateTemplate(
  code: string,
  data: EmailTemplateUpdateInput
): Promise<{ success: boolean; error?: string }> {
  try {
    const result = await query(
      `UPDATE email_templates
       SET subject = $2, html_content = $3, description = $4
       WHERE template_code = $1`,
      [code, data.subject, data.html_content, data.description || null]
    );

    if (result.rowCount === 0) {
      return { success: false, error: "Template not found" };
    }

    revalidatePath("/dashboard/templates");
    revalidatePath(`/dashboard/templates/${code}`);
    return { success: true };
  } catch (error) {
    console.error("Error updating template:", error);
    return { success: false, error: "Failed to update template" };
  }
}

export async function deleteTemplate(code: string): Promise<{ success: boolean; error?: string }> {
  try {
    const result = await query(
      "DELETE FROM email_templates WHERE template_code = $1",
      [code]
    );

    if (result.rowCount === 0) {
      return { success: false, error: "Template not found" };
    }

    revalidatePath("/dashboard/templates");
    return { success: true };
  } catch (error) {
    console.error("Error deleting template:", error);
    return { success: false, error: "Failed to delete template" };
  }
}

/**
 * Check if a template with the same subject and html_content already exists
 */
export async function findTemplateByContent(
  subject: string,
  htmlContent: string
): Promise<EmailTemplate | null> {
  try {
    const result = await query(
      "SELECT * FROM email_templates WHERE subject = $1 AND html_content = $2 LIMIT 1",
      [subject, htmlContent]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0] as EmailTemplate;
  } catch (error) {
    console.error("Error finding template by content:", error);
    return null;
  }
}

/**
 * Generate a unique template code from subject
 */
function generateTemplateCode(subject: string): string {
  // Extract first 3-4 meaningful words from subject, convert to uppercase snake_case
  const words = subject
    .replace(/[^a-zA-Z0-9\s]/g, "") // Remove special characters
    .split(/\s+/)
    .filter((w) => w.length > 2) // Filter out short words
    .slice(0, 4)
    .map((w) => w.toUpperCase());

  const baseCode = words.length > 0 ? words.join("_") : "CUSTOM";

  // Add timestamp suffix for uniqueness
  const timestamp = Date.now().toString(36).toUpperCase();

  return `${baseCode}_${timestamp}`;
}

/**
 * Save a custom email template (auto-generates template_code)
 * Only saves if no template with same subject + html_content exists
 */
export async function saveCustomTemplate(
  subject: string,
  htmlContent: string,
  description?: string
): Promise<{ success: boolean; templateCode?: string; error?: string; alreadyExists?: boolean }> {
  try {
    // Check if template with same content already exists
    const existing = await findTemplateByContent(subject, htmlContent);
    if (existing) {
      return {
        success: true,
        templateCode: existing.template_code,
        alreadyExists: true,
      };
    }

    // Generate unique template code
    let templateCode = generateTemplateCode(subject);

    // Ensure uniqueness by checking if code exists
    let existingCode = await getTemplateByCode(templateCode);
    let attempts = 0;
    while (existingCode && attempts < 5) {
      templateCode = generateTemplateCode(subject);
      existingCode = await getTemplateByCode(templateCode);
      attempts++;
    }

    if (existingCode) {
      // Fallback: append random string
      templateCode = `${templateCode}_${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    }

    // Insert the new template
    await query(
      `INSERT INTO email_templates (template_code, subject, html_content, description)
       VALUES ($1, $2, $3, $4)`,
      [templateCode, subject, htmlContent, description || "Auto-saved custom template"]
    );

    revalidatePath("/dashboard/templates");

    return {
      success: true,
      templateCode,
      alreadyExists: false,
    };
  } catch (error) {
    console.error("Error saving custom template:", error);
    return { success: false, error: "Failed to save custom template" };
  }
}
