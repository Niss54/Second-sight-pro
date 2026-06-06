export type UrgencyLevel = "routine" | "soon" | "urgent" | "emergency";

export type RiskTier = "low" | "moderate" | "high";

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
  comorbidities: string[];
  symptoms: string[];
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
  createdAt: string;
  updatedAt: string;
  input: PatientCaseInput;
  analysis: ReconciliationOutput;
}

export interface CaseSummary {
  id: string;
  createdAt: string;
  updatedAt: string;
  caseLabel: string;
  primaryCondition: string;
  opinionsCount: number;
  finalScore: string;
}

export interface EvidenceCitation {
  id: string;
  source: string;
  title: string;
  snippet: string;
  reference?: string;
  confidence: number;
  metadata: Record<string, unknown>;
}

export interface VoiceAssistantResponse {
  text: string;
  ssml: string;
  style: "calm" | "empathetic" | "medical";
  interruptible: boolean;
  segmentBreaks: string[];
  followUpPhrases: string[];
  safetyNotice: string;
  citations: EvidenceCitation[];
}
