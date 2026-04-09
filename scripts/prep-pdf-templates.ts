/**
 * One-time script to add fillable form fields to base PDF templates.
 *
 * Usage:
 *   npx tsx scripts/prep-pdf-templates.ts
 *
 * Input:
 *   scripts/QAS_LuuY_HocVien_v3_base.pdf
 *   scripts/QAS_QuyDinh_BaoLuu_base.pdf
 *
 * Output:
 *   templates/QAS_LuuY_HocVien.pdf
 *   templates/QAS_QuyDinh_BaoLuu.pdf
 *
 * Coordinates are placeholders and should be adjusted after visual inspection.
 * PDF coordinate system: (0,0) is bottom-left corner of the page.
 */

import { PDFDocument, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import * as fs from "fs";
import * as path from "path";

interface FieldDef {
  name: string;
  page: number;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize?: number;
  bold?: boolean;
}

const LUUY_FIELDS: FieldDef[] = [
  // Page 1
  { name: "diagnostic_math_score",        page: 0, x: 308, y: 366, width: 28,  height: 15, fontSize: 11 },
  { name: "diagnostic_verbal_score",      page: 0, x: 308, y: 331, width: 28,  height: 15, fontSize: 11 },
  { name: "diagnostic_total_score",       page: 0, x: 308, y: 296, width: 32,  height: 15, fontSize: 11 },
  { name: "course_math_name",             page: 0, x: 220, y: 257, width: 30,  height: 17, fontSize: 11, bold: true },
  { name: "math_code",                    page: 0, x: 250, y: 257, width: 23,  height: 17, fontSize: 11, bold: true },
  { name: "course_verbal_name",           page: 0, x: 220, y: 222, width: 30,  height: 17, fontSize: 11, bold: true },
  { name: "verbal_code",                  page: 0, x: 250, y: 222, width: 23,  height: 17, fontSize: 11, bold: true },
  { name: "output_commitment_math_yes",   page: 0, x: 241, y: 191, width: 6,   height: 6,  fontSize: 6 },
  { name: "output_commitment_math_no",    page: 0, x: 319, y: 191, width: 6,   height: 6,  fontSize: 6 },
  { name: "output_commitment_verbal_yes", page: 0, x: 241, y: 156, width: 6,   height: 6,  fontSize: 6 },
  { name: "output_commitment_verbal_no",  page: 0, x: 319, y: 156, width: 6,   height: 6,  fontSize: 6 },
  // Page 3
  { name: "student_name",                 page: 2, x: 115, y: 669, width: 140, height: 18, fontSize: 11 },
  { name: "sign_date",                    page: 2, x: 115, y: 652, width: 142, height: 15, fontSize: 11 },
  { name: "representative_name",          page: 2, x: 368, y: 669, width: 140, height: 18, fontSize: 11 },
  { name: "representative_sign_date",     page: 2, x: 368, y: 652, width: 142, height: 15, fontSize: 11 },
];

const BAOLUU_FIELDS: FieldDef[] = [
  { name: "agree_checkbox", page: 0, x: 72, y: 219, width: 6, height: 6, fontSize: 6 },
  { name: "student_name", page: 0, x: 378, y: 132, width: 162, height: 18, fontSize: 11 },
  { name: "sign_date", page: 0, x: 378, y: 116, width: 162, height: 14, fontSize: 11 },
];

const ROOT = path.resolve(__dirname, "..");
const SCRIPTS_DIR = path.resolve(__dirname);
const TEMPLATES_DIR = path.join(ROOT, "templates");
const FONTS_DIR = path.join(ROOT, "fonts");

async function addFieldsToPdf(
  inputPath: string,
  outputPath: string,
  fields: FieldDef[]
) {
  console.log(`\nProcessing: ${path.basename(inputPath)}`);
  console.log(`  Output:   ${path.basename(outputPath)}`);

  const pdfBytes = fs.readFileSync(inputPath);
  const pdfDoc = await PDFDocument.load(pdfBytes);

  pdfDoc.registerFontkit(fontkit);

  const fontPath = path.join(FONTS_DIR, "NotoSerif-Regular.ttf");
  const boldFontPath = path.join(FONTS_DIR, "NotoSerif-Bold.ttf");
  let customFont;
  let boldFont;

  if (fs.existsSync(fontPath)) {
    const fontBytes = fs.readFileSync(fontPath);
    customFont = await pdfDoc.embedFont(fontBytes);
    console.log("  Font:     NotoSerif-Regular.ttf loaded");
  } else {
    console.log("  Font:     NotoSerif-Regular.ttf not found, using Helvetica");
  }

  if (fs.existsSync(boldFontPath)) {
    const boldFontBytes = fs.readFileSync(boldFontPath);
    boldFont = await pdfDoc.embedFont(boldFontBytes);
    console.log("  Font:     NotoSerif-Bold.ttf loaded");
  } else {
    console.log("  Font:     NotoSerif-Bold.ttf not found, bold fields will use regular font");
  }

  const pages = pdfDoc.getPages();
  console.log(`  Pages:    ${pages.length}`);
  for (let i = 0; i < pages.length; i++) {
    const { width, height } = pages[i].getSize();
    console.log(`  Page ${i}:   ${width} x ${height}`);
  }

  const form = pdfDoc.getForm();

  for (const field of fields) {
    const page = pages[field.page];
    if (!page) {
      console.error(`  ERROR:    Page ${field.page} does not exist for field "${field.name}"`);
      continue;
    }

    const textField = form.createTextField(field.name);
    const fontSize = field.fontSize ?? 11;

    textField.addToPage(page, {
      x: field.x,
      y: field.y,
      width: field.width,
      height: field.height,
      borderWidth: 0,
      backgroundColor: rgb(1, 1, 1),
    });

    const fieldFont = field.bold && boldFont ? boldFont : customFont;
    if (fieldFont) {
      textField.defaultUpdateAppearances(fieldFont);
    }
    textField.setFontSize(fontSize);

    console.log(
      `  Field:    ${field.name.padEnd(28)} page=${field.page} @ (${field.x}, ${field.y}) ${field.width}x${field.height} fontSize=${fontSize}`
    );
  }

  const savedBytes = await pdfDoc.save();
  fs.writeFileSync(outputPath, savedBytes);
  console.log(`  Saved:    ${outputPath} (${(savedBytes.length / 1024).toFixed(1)} KB)`);
}

async function main() {
  console.log("=== PDF Template Prep Script ===\n");

  if (!fs.existsSync(TEMPLATES_DIR)) {
    fs.mkdirSync(TEMPLATES_DIR, { recursive: true });
  }

  const luuyInput = path.join(SCRIPTS_DIR, "QAS_LuuY_HocVien_v3_base.pdf");
  const luuyOutput = path.join(TEMPLATES_DIR, "QAS_LuuY_HocVien.pdf");

  if (!fs.existsSync(luuyInput)) {
    console.error(`ERROR: Input file not found: ${luuyInput}`);
    console.error("Please place the base PDF in the scripts/ directory first.");
  } else {
    await addFieldsToPdf(luuyInput, luuyOutput, LUUY_FIELDS);
  }

  const baoluuInput = path.join(SCRIPTS_DIR, "QAS_QuyDinh_BaoLuu_base.pdf");
  const baoluuOutput = path.join(TEMPLATES_DIR, "QAS_QuyDinh_BaoLuu.pdf");

  if (!fs.existsSync(baoluuInput)) {
    console.error(`ERROR: Input file not found: ${baoluuInput}`);
    console.error("Please place the base PDF in the scripts/ directory first.");
  } else {
    await addFieldsToPdf(baoluuInput, baoluuOutput, BAOLUU_FIELDS);
  }

  console.log("\n=== Done ===");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
