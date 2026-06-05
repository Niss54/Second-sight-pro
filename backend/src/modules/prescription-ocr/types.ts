export interface PrescriptionExtractionResult {
  medicines: string[];
  dosage: string[];
  tests: string[];
  doctor_notes: string;
}

export interface PrescriptionInputFile {
  buffer: Buffer;
  mimetype?: string;
  originalname?: string;
}

export interface PrescriptionExtractionMeta {
  rawText: string;
  confidence: number;
  needsManualReview: boolean;
  source: "image" | "pdf" | "base64" | "buffer";
}

