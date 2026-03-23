import { PDFDocument } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";

/**
 * Load a PDF with fillable form fields, fill them, flatten, and return the result.
 *
 * @param templateBytes - The PDF template with form fields (Uint8Array)
 * @param fields - Key-value pairs where key = field name, value = text to fill
 * @param fontBytes - TTF font bytes for Vietnamese diacritics support
 * @returns Filled and flattened PDF as Uint8Array
 */
export async function fillPdfTemplate(
  templateBytes: Uint8Array,
  fields: Record<string, string>,
  fontBytes: Uint8Array
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(templateBytes);

  // Register fontkit for custom font embedding
  pdfDoc.registerFontkit(fontkit);
  const customFont = await pdfDoc.embedFont(fontBytes);

  const form = pdfDoc.getForm();

  for (const [fieldName, value] of Object.entries(fields)) {
    try {
      const field = form.getTextField(fieldName);
      field.defaultUpdateAppearances(customFont);
      field.setText(value);
    } catch {
      // Field not found in this template — skip silently
      console.warn(`PDF field "${fieldName}" not found, skipping`);
    }
  }

  // Flatten form so fields become static text (not editable)
  form.flatten();

  return pdfDoc.save();
}
