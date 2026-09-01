import { parsePrescriptionText } from "./parser";
import type { PrescriptionExtractionMeta, PrescriptionExtractionResult, PrescriptionInputFile } from "./types";
import { isPdfMimeType, normalizePrescriptionInput, trimWhitespace } from "./preprocess";

async function extractTextFromImageBuffer(buffer: Buffer): Promise<string> {
  const { recognize } = await import("tesseract.js");
  const result = await recognize(buffer, "eng");
  return trimWhitespace(result.data.text || "");
}

async function extractTextFromPdfBuffer(buffer: Buffer): Promise<string> {
  const pdfParseModule = await import("pdf-parse");
  const pdfParse = pdfParseModule as unknown as (data: Buffer) => Promise<{ text: string }>;
  const result = await pdfParse(buffer);
  return trimWhitespace(result.text || "");
}

export async function extractPrescription(
  input: Buffer | string | PrescriptionInputFile
): Promise<PrescriptionExtractionResult & PrescriptionExtractionMeta> {
  const normalizedInput = normalizePrescriptionInput(input);
  const mimeType = normalizedInput.mimetype;
  const source: PrescriptionExtractionMeta["source"] = isPdfMimeType(mimeType)
    ? "pdf"
    : Buffer.isBuffer(input)
      ? "buffer"
      : typeof input === "string"
        ? "base64"
        : "image";

  const rawText = isPdfMimeType(mimeType)
    ? await extractTextFromPdfBuffer(normalizedInput.buffer)
    : await extractTextFromImageBuffer(normalizedInput.buffer);

  const structured = parsePrescriptionText(rawText);
  const confidence = rawText.length === 0 ? 0 : Math.min(0.98, 0.42 + Math.min(rawText.length / 800, 0.45));
  const needsManualReview =
    rawText.length < 40 ||
    structured.medicines.length === 0 ||
    structured.dosage.length === 0 ||
    confidence < 0.65;

  return {
    ...structured,
    rawText,
    confidence,
    needsManualReview,
    source
  };
}
