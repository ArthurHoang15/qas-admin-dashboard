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
