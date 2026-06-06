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

export interface StructuredDoctorOpinion {
  doctor_id: string;
  diagnosis: string[];
  medications: string[];
  tests_recommended: string[];
  treatment_plan: string[];
  urgency_level: UrgencyLevel;
  specialist_type: string;
  clinical_reasoning: string[];
  precautions: string[];
  followup_recommendation: string;
  uncertainty_signals: string[];
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

export interface CategoryComparison {
  status: "agreement" | "partial_agreement" | "direct_contradiction" | "insufficient_data";
  notes: string[];
  agreement: number;
}

export interface ComparisonTable {
  diagnosis: CategoryComparison;
  treatment: CategoryComparison;
  medicine: CategoryComparison;
  tests: CategoryComparison;
  urgency: CategoryComparison;
}

export interface UiBlock {
  title: string;
  color: "green" | "yellow" | "red";
  items: string[];
}

export interface ReconciliationOutput {
  summary: string;
  conflict_score: string;
  agreement_score: string;
  disagreement_reason: string[];
  comparison_table: ComparisonTable;
  specialist_questions: string[];
  evidence_needed: string[];
  confidence_level: "low" | "medium" | "high";
  manual_correction_required: boolean;
  safety_disclaimer: string;
  visual_explanation_blocks: UiBlock[];
  multilingual_output: {
    english: string;
    hindi: string;
    hinglish: string;
  };
  citations?: EvidenceCitation[];
}

export interface StoredCase {
  id: string;
  ownerId?: string;
  createdAt: string;
  updatedAt: string;
  input: PatientCaseInput;
  analysis: ReconciliationOutput;
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

export interface ReconciliationComparison {
  agreement_score: number;
  conflict_score: number;
  disagreement_categories: string[];
  missing_information: string[];
  key_conflicts: string[];
  confidence_level: string;
}

export interface ReconciliationResponse {
  summary: string;
  conflict_score: string;
  agreement_score: string;
  disagreement_reason: string[];
  comparison_table: Record<string, unknown>;
  specialist_questions: string[];
  evidence_needed: string[];
  confidence_level: string;
  multilingual_output: Record<SupportedLanguage, string>;
  structured_opinions: StructuredDoctorOpinion[];
  comparison: ReconciliationComparison;
  safety_disclaimer: string;
  explainability: ExplainabilityBreakdown[];
  safetyWarnings: string[];
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
