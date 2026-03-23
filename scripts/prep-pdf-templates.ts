/**
 * One-time script to add fillable form fields to base PDF templates.
 *
 * Usage:
 *   npx tsx scripts/prep-pdf-templates.ts
 *
 * Input:
 *   scripts/QAS_LuuY_HocVien_v2_base.pdf
 *   scripts/QAS_QuyDinh_BaoLuu_base.pdf
 *
 * Output:
 *   templates/QAS_LuuY_HocVien.pdf
 *   templates/QAS_QuyDinh_BaoLuu.pdf
 *
 * Coordinates are placeholders — adjust after visual inspection of the base PDFs.
 * PDF coordinate system: (0,0) is bottom-left corner of the page.
 */

import { PDFDocument, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import * as fs from "fs";
import * as path from "path";

// ---------------------------------------------------------------------------
// Field definitions — ADJUST COORDINATES after measuring with a PDF viewer
// ---------------------------------------------------------------------------

interface FieldDef {
  name: string;
  page: number; // 0-based page index
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize?: number;
}

// QAS_LuuY_HocVien — 7 fields across 2 pages
// Page 1: diagnostic_score, output_commitment checkboxes
// Page 2: student signing + representative signing
const LUUY_FIELDS: FieldDef[] = [
  // --- Page 1 ---
  { name: "diagnostic_score",           page: 0, x: 350, y: 413, width: 28,  height: 14, fontSize: 11 },
  { name: "output_commitment_yes",      page: 0, x: 241, y: 349, width: 6,  height: 6, fontSize: 6 },
  { name: "output_commitment_no",       page: 0, x: 319, y: 349, width: 6,  height: 6, fontSize: 6 },
  // --- Page 2 ---
  { name: "student_name",               page: 1, x: 115, y: 221, width: 142, height: 14, fontSize: 11 },
  { name: "sign_date",                  page: 1, x: 115, y: 205,  width: 142, height: 14, fontSize: 11 },
  { name: "representative_name",        page: 1, x: 368, y: 221, width: 142, height: 14, fontSize: 11 },
  { name: "representative_sign_date",   page: 1, x: 368, y: 205,  width: 142, height: 14, fontSize: 11 },
];

// QAS_QuyDinh_BaoLuu — 3 fields (all on page 1)
const BAOLUU_FIELDS: FieldDef[] = [
  { name: "agree_checkbox", page: 0, x: 72, y: 219, width: 6, height: 6, fontSize: 6 },
  { name: "student_name", page: 0, x: 378, y: 132, width: 162, height: 14, fontSize: 11 },
  { name: "sign_date", page: 0, x: 378, y: 116, width: 162, height: 14, fontSize: 11 },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

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

  // Register fontkit for custom font embedding
  pdfDoc.registerFontkit(fontkit);

  // Load Noto Serif — supports Vietnamese diacritics (Georgia does not)
  const fontPath = path.join(FONTS_DIR, "NotoSerif-Regular.ttf");
  let customFont;
  if (fs.existsSync(fontPath)) {
    const fontBytes = fs.readFileSync(fontPath);
    customFont = await pdfDoc.embedFont(fontBytes);
    console.log("  Font:     NotoSerif-Regular.ttf loaded");
  } else {
    console.log("  Font:     NotoSerif-Regular.ttf not found, using Helvetica");
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
      backgroundColor: rgb(1, 1, 1), // white background (invisible)
    });

    // Set default appearance with font
    if (customFont) {
      textField.defaultUpdateAppearances(customFont);
    }
    textField.setFontSize(fontSize);

    console.log(
      `  Field:    ${field.name.padEnd(25)} page=${field.page} @ (${field.x}, ${field.y}) ${field.width}x${field.height} fontSize=${fontSize}`
    );
  }

  const savedBytes = await pdfDoc.save();
  fs.writeFileSync(outputPath, savedBytes);
  console.log(`  Saved:    ${outputPath} (${(savedBytes.length / 1024).toFixed(1)} KB)`);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log("=== PDF Template Prep Script ===\n");

  // Ensure output directory exists
  if (!fs.existsSync(TEMPLATES_DIR)) {
    fs.mkdirSync(TEMPLATES_DIR, { recursive: true });
  }

  // Process QAS_LuuY_HocVien
  const luuyInput = path.join(SCRIPTS_DIR, "QAS_LuuY_HocVien_v2_base.pdf");
  const luuyOutput = path.join(TEMPLATES_DIR, "QAS_LuuY_HocVien.pdf");

  if (!fs.existsSync(luuyInput)) {
    console.error(`ERROR: Input file not found: ${luuyInput}`);
    console.error("Please place the base PDF in the scripts/ directory first.");
  } else {
    await addFieldsToPdf(luuyInput, luuyOutput, LUUY_FIELDS);
  }

  // Process QAS_QuyDinh_BaoLuu
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
