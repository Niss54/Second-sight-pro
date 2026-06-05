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
  analysis: FullAnalysisResponse;
}

export interface CaseSummary {
  id: string;
  createdAt: string;
  updatedAt: string;
  caseLabel: string;
  primaryCondition: string;
  opinionsCount: number;
  finalScore: number;
  finalRiskTier: RiskTier;
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
