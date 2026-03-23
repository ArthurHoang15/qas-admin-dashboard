import { PDFDocument, PDFFont, PDFTextField } from "pdf-lib";
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

  // Register fontkit — required for non-WinAnsi (Unicode) font embedding
  pdfDoc.registerFontkit(fontkit);
  const customFont = await pdfDoc.embedFont(fontBytes, { subset: false });

  const form = pdfDoc.getForm();

  // First pass: set all text values
  const filledFields: PDFTextField[] = [];
  for (const [fieldName, value] of Object.entries(fields)) {
    try {
      const field = form.getTextField(fieldName);
      // Set the font before setting text
      field.defaultUpdateAppearances(customFont);
      field.setText(value);
      filledFields.push(field);
    } catch {
      console.warn(`PDF field "${fieldName}" not found, skipping`);
    }
  }

  // Second pass: force re-render appearances with the custom font
  // This overrides the WinAnsi encoding that setText applies internally
  for (const field of filledFields) {
    field.updateAppearances(customFont);
  }

  // Flatten form so fields become static text (not editable)
  form.flatten();

  return pdfDoc.save();
}
