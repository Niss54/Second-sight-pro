import sharp from "sharp";
import type { MedicalReportInputFile } from "./types";

export function isPdfMimeType(mimeType?: string): boolean {
  return Boolean(mimeType && mimeType.toLowerCase().includes("pdf"));
}

export function looksLikePdf(buffer: Buffer): boolean {
  return buffer.slice(0, 4).toString("utf8") === "%PDF";
}

export function decodeBase64Input(value: string): Buffer {
  const cleaned = value.includes(",") ? value.slice(value.indexOf(",") + 1) : value;
  return Buffer.from(cleaned, "base64");
}

export function normalizeReportInput(input: Buffer | string | MedicalReportInputFile): MedicalReportInputFile {
  if (Buffer.isBuffer(input)) {
    return { buffer: input };
  }

  if (typeof input === "string") {
    return { buffer: decodeBase64Input(input) };
  }

  return input;
}

export async function preprocessImageBuffer(buffer: Buffer): Promise<Buffer> {
  return sharp(buffer)
    .rotate()
    .resize({
      width: 1800,
      withoutEnlargement: true
    })
    .grayscale()
    .normalize()
    .sharpen()
    .threshold(165)
    .toBuffer();
}

export function normalizeText(value: string): string {
  return value
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[•·]/g, "-")
    .trim();
}

export function splitLines(value: string): string[] {
  return normalizeText(value)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

