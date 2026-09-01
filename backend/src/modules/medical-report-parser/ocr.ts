import { parseMedicalReport } from "./parser";
import type { MedicalReportExtractionResult, MedicalReportInputFile } from "./types";
import { isPdfMimeType, looksLikePdf, normalizeReportInput, normalizeText, preprocessImageBuffer } from "./preprocess";

async function extractTextFromPdfBuffer(buffer: Buffer): Promise<string> {
  const pdfParseModule = await import("pdf-parse");
  const pdfParse = pdfParseModule as unknown as (data: Buffer) => Promise<{ text: string }>;
  const parsed = await pdfParse(buffer);
  return normalizeText(parsed.text || "");
}

async function extractTextFromImageBuffer(buffer: Buffer): Promise<string> {
  const { recognize } = await import("tesseract.js");
  const processed = await preprocessImageBuffer(buffer);
  const result = await recognize(processed, "eng");
  return normalizeText(result.data.text || "");
}

export async function extractMedicalReport(
  input: Buffer | string | MedicalReportInputFile
): Promise<MedicalReportExtractionResult> {
  const normalizedInput = normalizeReportInput(input);
  const source = isPdfMimeType(normalizedInput.mimetype) || looksLikePdf(normalizedInput.buffer) ? "pdf" : "image";

  const rawText = source === "pdf"
    ? await extractTextFromPdfBuffer(normalizedInput.buffer)
    : await extractTextFromImageBuffer(normalizedInput.buffer);

  return parseMedicalReport(rawText);
}

