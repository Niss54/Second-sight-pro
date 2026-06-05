export type UrgencyLevel = "routine" | "soon" | "urgent" | "emergency";

export type RiskTier = "low" | "moderate" | "high";

export type SupportedLanguage = "en" | "hi" | "hinglish";

export interface DoctorOpinionInput {
  doctorName: string;
  specialty: string;
  urgency: UrgencyLevel;
  diagnosis: string;
  treatment: string;
  prescriptions: string[];
  tests: string[];
  notes?: string;
}

export interface PatientCaseInput {
  caseLabel?: string;
  primaryCondition: string;
  patientAge?: number | null;
  comorbidities?: string[];
  symptoms?: string[];
  language?: SupportedLanguage;
  opinions: DoctorOpinionInput[];
}

export interface AlignmentMetrics {
  diagnosisAlignment: number;
  treatmentAlignment: number;
  testAlignment: number;
  medicationConsistency: number;
  urgencyAgreement: number;
}

export interface MedicationConflict {
  medication: string;
  details: string[];
  doctors: string[];
}

export interface RuleAnalysis {
  metrics: AlignmentMetrics;
  conflictScore: number;
  riskTier: RiskTier;
  findings: string[];
  recommendedActions: string[];
  specialistQuestions: string[];
  medicationConflicts: MedicationConflict[];
}

export interface RiskModelContribution {
  feature: string;
  impact: number;
}

export interface RiskModelOutput {
  probability: number;
  modelScore: number;
  contributions: RiskModelContribution[];
  summary: string;
}

export interface AiInsight {
  status: "live" | "fallback" | "disabled";
  executiveSummary: string;
  patientSummary: string;
  triageAdvice: string;
  conversationScript: string[];
}

export interface FullAnalysisResponse {
  generatedAt: string;
  ruleAnalysis: RuleAnalysis;
  riskModel: RiskModelOutput;
  finalScore: number;
  finalRiskTier: RiskTier;
  aiInsight: AiInsight;
}

export interface StoredCase {
  id: string;
  ownerId?: string;
  createdAt: string;
  updatedAt: string;
  input: PatientCaseInput;
  analysis: FullAnalysisResponse;
}

export interface AuthenticatedUser {
  id: string;
  email?: string;
  isDemo: boolean;
}

export interface EvidenceCitation {
  id: string;
  source: "WHO" | "NIH" | "PubMed" | "Mayo Clinic" | "MedlinePlus" | string;
  title: string;
  snippet: string;
  reference?: string;
  confidence: number;
  metadata: {
    disease?: string;
    specialty?: string;
    urgency?: string;
    condition?: string;
    category?: string;
  };
}

export interface OcrEntityExtraction {
  diagnosis: string[];
  medications: Array<{
    name: string;
    dosage?: string;
    frequency?: string;
  }>;
  urgency: string[];
  tests: string[];
  doctorSpecialty: string[];
  reportValues: Array<{
    label: string;
    value: string;
    unit?: string;
  }>;
}

export interface OcrExtractionResult {
  fileId?: string;
  rawText: string;
  confidence: number;
  needsManualReview: boolean;
  entities: OcrEntityExtraction;
}

export interface UploadedFileRecord {
  id: string;
  ownerId: string;
  caseId?: string;
  storagePath: string;
  fileName: string;
  mimeType: string;
  size: number;
  ocrStatus: "pending" | "processed" | "failed";
  ocrConfidence?: number;
  extractedJson?: OcrExtractionResult;
  bufferBase64?: string;
  createdAt: string;
}

export interface ExplainabilityBreakdown {
  contributor: string;
  impact: number;
  confidence: number;
  evidenceLinks: EvidenceCitation[];
}

export interface GroundedAnalysis extends FullAnalysisResponse {
  citations: EvidenceCitation[];
  explainability: ExplainabilityBreakdown[];
  safetyWarnings: string[];
  multilingualSummaries: Record<SupportedLanguage, string>;
}

export interface VoiceSessionResponse {
  sessionId: string;
  roomName: string;
  language: SupportedLanguage;
  mode: "livekit" | "text-fallback";
  token?: string;
  wsUrl?: string;
  providerStatus: {
    livekit: boolean;
    sarvam: boolean;
  };
}
