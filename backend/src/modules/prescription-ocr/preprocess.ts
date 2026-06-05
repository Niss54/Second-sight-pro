import type { PrescriptionInputFile } from "./types";

export function isPdfMimeType(mimeType?: string): boolean {
  return Boolean(mimeType && mimeType.toLowerCase().includes("pdf"));
}

export function decodeBase64Input(value: string): Buffer {
  const cleaned = value.includes(",") ? value.slice(value.indexOf(",") + 1) : value;
  return Buffer.from(cleaned, "base64");
}

export function normalizePrescriptionInput(input: Buffer | string | PrescriptionInputFile): PrescriptionInputFile {
  if (Buffer.isBuffer(input)) {
    return {
      buffer: input
    };
  }

  if (typeof input === "string") {
    return {
      buffer: decodeBase64Input(input)
    };
  }

  return input;
}

export function trimWhitespace(value: string): string {
  return value.replace(/\r\n/g, "\n").replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim();
}

export function splitLines(value: string): string[] {
  return trimWhitespace(value)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}
