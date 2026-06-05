export interface MedicalReportExtractionResult {
  report_type: string;
  diagnosis: string;
  medicines: string[];
  tests: string[];
  observations: string[];
}

export interface MedicalReportInputFile {
  buffer: Buffer;
  mimetype?: string;
  originalname?: string;
}

