import {
  AlignmentMetrics,
  DoctorOpinionInput,
  ExplainabilityBreakdown,
  GroundedAnalysis,
  MedicationConflict,
  PatientCaseInput,
  RiskTier,
  SupportedLanguage,
  UrgencyLevel
} from "../types/domain";
import { normalizeText, averagePairwiseSimilarity, clamp01 } from "../utils/text";

export interface StructuredOpinion {
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

export interface OpinionComparison {
  agreement_score: number;
  conflict_score: number;
  disagreement_categories: string[];
  missing_information: string[];
  key_conflicts: string[];
  confidence_level: "low" | "moderate" | "high";
}

export interface ReconciliationOutput {
  summary: string;
  conflict_score: string;
  agreement_score: string;
  disagreement_reason: string[];
  comparison_table: Record<string, unknown>;
  specialist_questions: string[];
  evidence_needed: string[];
  confidence_level: string;
  multilingual_output: Record<SupportedLanguage, string>;
  structured_opinions: StructuredOpinion[];
  comparison: OpinionComparison;
  safety_disclaimer: string;
  explainability: ExplainabilityBreakdown[];
  safetyWarnings: string[];
}

const urgencyPriority: Record<UrgencyLevel, number> = {
  routine: 1,
  soon: 2,
  urgent: 3,
  emergency: 4
};

const diagnosisSynonyms: Record<string, string> = {
  "mild lumbar disc bulge": "lumbar disc herniation",
  "l4-l5 mild herniation": "lumbar disc herniation",
  "lumbar disc bulge": "lumbar disc herniation",
  "operative management recommended": "surgical management",
  "immediate surgery advised": "surgical management",
  "conservative treatment": "non-operative management",
  "watchful waiting": "non-operative management",
  "repeat imaging": "additional imaging",
  "further imaging": "additional imaging"
};

function canonicalizePhrase(text: string): string {
  const normalized = normalizeText(text).replace(/[^a-z0-9\s-]/g, " ").trim();
  return diagnosisSynonyms[normalized] ?? normalized;
}

function splitTerms(text: string): string[] {
  return canonicalizePhrase(text)
    .split(/\s+/)
    .map((term) => term.trim())
    .filter(Boolean);
}

function dedupe(items: string[]): string[] {
  return Array.from(new Set(items.map((item) => item.trim()).filter(Boolean)));
}

function similarityScore(left: string[], right: string[]): number {
  return averagePairwiseSimilarity([left.join(" "), right.join(" ")]);
}

function inferSpecialist(opinion: DoctorOpinionInput): string {
  const joined = `${opinion.specialty} ${opinion.diagnosis} ${opinion.treatment}`.toLowerCase();
  if (joined.includes("surgery") || joined.includes("operative")) return "surgical specialist";
  if (joined.includes("neuro") || joined.includes("spine")) return "neurology / spine";
  if (joined.includes("cardio") || joined.includes("heart")) return "cardiology";
  if (joined.includes("onco") || joined.includes("cancer")) return "oncology";
  if (joined.includes("ortho") || joined.includes("bone") || joined.includes("joint")) return "orthopedics";
  if (joined.includes("pedia")) return "pediatrics";
  return opinion.specialty || "general medicine";
}

function inferTreatmentIntent(treatment: string): string {
  const text = treatment.toLowerCase();
  if (/(immediate surgery|operative|procedure|intervention)/.test(text)) return "aggressive intervention";
  if (/(surgery|operation)/.test(text)) return "procedural management";
  if (/(observe|monitor|rest|lifestyle|conservative|watchful)/.test(text)) return "conservative management";
  if (/(additional test|repeat imaging|repeat scan|further evaluation|workup)/.test(text)) return "diagnostic clarification";
  return "mixed management";
}

function extractStructuredOpinion(opinion: DoctorOpinionInput, index: number): StructuredOpinion {
  const diagnosis = dedupe(splitTerms(opinion.diagnosis));
  const medications = dedupe(opinion.prescriptions.map(canonicalizePhrase));
  const testsRecommended = dedupe(opinion.tests.map(canonicalizePhrase));
  const treatmentPlan = dedupe(splitTerms(opinion.treatment));
  const notes = opinion.notes ? splitTerms(opinion.notes) : [];

  const uncertaintySignals: string[] = [];
  const diagnosisText = opinion.diagnosis.toLowerCase();
  const treatmentText = opinion.treatment.toLowerCase();

  if (/maybe|possible|uncertain|cannot rule out|differential/.test(diagnosisText)) {
    uncertaintySignals.push("diagnostic uncertainty");
  }
  if (/consider|may|could|if needed/.test(treatmentText)) {
    uncertaintySignals.push("conditional treatment language");
  }
  if (testsRecommended.length === 0) {
    uncertaintySignals.push("missing test recommendation");
  }

  return {
    doctor_id: `doctor_${index + 1}`,
    diagnosis,
    medications,
    tests_recommended: testsRecommended,
    treatment_plan: treatmentPlan,
    urgency_level: opinion.urgency,
    specialist_type: inferSpecialist(opinion),
    clinical_reasoning: dedupe([
      ...notes,
      `Treatment intent: ${inferTreatmentIntent(opinion.treatment)}`,
      `Urgency level: ${opinion.urgency}`
    ]),
    precautions: dedupe([
      ...(opinion.notes ? splitTerms(opinion.notes) : []),
      ...(opinion.treatment.toLowerCase().includes("monitor") ? ["monitor closely"] : [])
    ]),
    followup_recommendation:
      testsRecommended.length > 0
        ? `Review ${testsRecommended.join(", ")} before finalizing the plan.`
        : "Clarify the next step with the treating specialist.",
    uncertainty_signals: dedupe(uncertaintySignals)
  };
}

function compareLists(left: string[], right: string[]): number {
  if (left.length === 0 || right.length === 0) {
    return 0;
  }
  const leftText = left.join(" ");
  const rightText = right.join(" ");
  const overlap = averagePairwiseSimilarity([leftText, rightText]);
  return clamp01(overlap);
}

function buildComparison(structuredOpinions: StructuredOpinion[]): OpinionComparison {
  const diagnosisScore = averagePairwiseSimilarity(structuredOpinions.map((item) => item.diagnosis.join(" ")));
  const treatmentScore = averagePairwiseSimilarity(structuredOpinions.map((item) => item.treatment_plan.join(" ")));
  const medicationScore = averagePairwiseSimilarity(structuredOpinions.map((item) => item.medications.join(" ")));
  const testScore = averagePairwiseSimilarity(structuredOpinions.map((item) => item.tests_recommended.join(" ")));
  const urgencyScore = averagePairwiseSimilarity(structuredOpinions.map((item) => item.urgency_level));

  const agreementScore = Math.round(
    100 *
      (diagnosisScore * 0.28 + treatmentScore * 0.3 + medicationScore * 0.16 + testScore * 0.12 + urgencyScore * 0.14)
  );
  const conflictScore = Math.max(0, Math.min(100, 100 - agreementScore));

  const disagreementCategories: string[] = [];
  if (diagnosisScore < 0.7) disagreementCategories.push("diagnosis comparison");
  if (treatmentScore < 0.7) disagreementCategories.push("treatment comparison");
  if (medicationScore < 0.7) disagreementCategories.push("medicine comparison");
  if (testScore < 0.7) disagreementCategories.push("test recommendation comparison");
  if (urgencyScore < 0.7) disagreementCategories.push("urgency comparison");

  const missingInformation: string[] = [];
  if (structuredOpinions.some((item) => item.tests_recommended.length === 0)) {
    missingInformation.push("One or more opinions do not specify confirming tests.");
  }
  if (structuredOpinions.some((item) => item.uncertainty_signals.length > 0)) {
    missingInformation.push("One or more opinions contain uncertainty signals or conditional language.");
  }
  if (structuredOpinions.some((item) => item.followup_recommendation.includes("Clarify"))) {
    missingInformation.push("Follow-up clarification is not fully specified in at least one opinion.");
  }

  const keyConflicts: string[] = [];
  if (diagnosisScore < 0.7) keyConflicts.push("Doctors may be using different diagnostic interpretations.");
  if (treatmentScore < 0.7) keyConflicts.push("Treatment intensity or sequencing differs across opinions.");
  if (medicationScore < 0.7) keyConflicts.push("Medication lists or dosing intent do not fully match.");
  if (testScore < 0.7) keyConflicts.push("Different tests are being prioritized to resolve uncertainty.");
  if (urgencyScore < 0.7) keyConflicts.push("Recommended urgency differs materially between doctors.");

  const confidence_level = conflictScore >= 70 ? "high" : conflictScore >= 40 ? "moderate" : "low";

  return {
    agreement_score: agreementScore,
    conflict_score: conflictScore,
    disagreement_categories: disagreementCategories,
    missing_information: dedupe(missingInformation),
    key_conflicts: dedupe(keyConflicts),
    confidence_level
  };
}

function explainDisagreement(structuredOpinions: StructuredOpinion[], comparison: OpinionComparison): string[] {
  const reasons: string[] = [];
  const treatmentIntentSet = new Set(structuredOpinions.map((item) => inferTreatmentIntent(item.treatment_plan.join(" "))));

  if (treatmentIntentSet.size > 1) {
    reasons.push("Different treatment philosophy may be present (conservative vs aggressive management).");
  }
  if (comparison.disagreement_categories.includes("diagnosis comparison")) {
    reasons.push("The opinions may differ because diagnostic evidence is being interpreted differently.");
  }
  if (comparison.missing_information.length > 0) {
    reasons.push("Insufficient diagnostic evidence or incomplete patient history may be contributing to disagreement.");
  }
  if (comparison.disagreement_categories.includes("test recommendation comparison")) {
    reasons.push("Doctors may be prioritizing different additional tests to reduce uncertainty.");
  }
  if (comparison.disagreement_categories.includes("urgency comparison")) {
    reasons.push("Different risk tolerance or escalation thresholds may be driving urgency differences.");
  }
  if (structuredOpinions.some((item) => item.specialist_type !== structuredOpinions[0]?.specialist_type)) {
    reasons.push("Specialist expertise differences may explain part of the disagreement.");
  }
  if (structuredOpinions.some((item) => item.uncertainty_signals.includes("diagnostic uncertainty"))) {
    reasons.push("Diagnostic uncertainty is explicitly present in at least one opinion.");
  }
  if (structuredOpinions.some((item) => item.tests_recommended.length > 0) && comparison.disagreement_categories.includes("test recommendation comparison")) {
    reasons.push("Additional testing is being recommended as a way to reduce uncertainty.");
  }

  return dedupe(reasons);
}

function generateQuestions(comparison: OpinionComparison, structuredOpinions: StructuredOpinion[]): string[] {
  const questions: string[] = [];

  if (comparison.disagreement_categories.includes("diagnosis comparison")) {
    questions.push("What objective findings support each diagnosis, and what alternatives were ruled out?");
  }
  if (comparison.disagreement_categories.includes("treatment comparison")) {
    questions.push("What is the reasoning behind conservative versus more aggressive management?");
  }
  if (comparison.disagreement_categories.includes("medicine comparison")) {
    questions.push("Can you provide a single reconciled medication list with exact purpose and schedule?");
  }
  if (comparison.disagreement_categories.includes("test recommendation comparison")) {
    questions.push("Would additional imaging or testing reduce uncertainty enough to change the plan?");
  }
  if (comparison.disagreement_categories.includes("urgency comparison")) {
    questions.push("What warning signs mean urgent escalation versus routine follow-up?");
  }

  if (structuredOpinions.some((item) => item.uncertainty_signals.length > 0)) {
    questions.push("What part of the case is still uncertain, and what evidence would clarify it most?");
  }

  questions.push("What is the safest next step while the opinions are being reconciled?");
  return dedupe(questions);
}

function generateEvidenceNeeded(comparison: OpinionComparison, structuredOpinions: StructuredOpinion[]): string[] {
  const evidenceNeeded: string[] = [];

  if (comparison.disagreement_categories.includes("diagnosis comparison")) {
    evidenceNeeded.push("Side-by-side review of imaging, pathology, or lab findings supporting diagnosis.");
  }
  if (comparison.disagreement_categories.includes("treatment comparison")) {
    evidenceNeeded.push("Reasoning notes that explain why one treatment path was preferred over another.");
  }
  if (comparison.disagreement_categories.includes("medicine comparison")) {
    evidenceNeeded.push("A reconciled medication chart that resolves dose, frequency, and duplication differences.");
  }
  if (comparison.disagreement_categories.includes("test recommendation comparison")) {
    evidenceNeeded.push("Confirmation of which single test is most likely to reduce uncertainty.");
  }
  if (comparison.disagreement_categories.includes("urgency comparison")) {
    evidenceNeeded.push("Clear triage criteria defining routine, soon, urgent, or emergency escalation.");
  }

  if (structuredOpinions.some((item) => item.followup_recommendation.includes("Clarify"))) {
    evidenceNeeded.push("Missing follow-up recommendations from all clinicians.");
  }

  return dedupe(evidenceNeeded);
}

function buildMultilingualSummary(englishSummary: string): Record<SupportedLanguage, string> {
  const hindi = englishSummary
    .replace(/agreement/gi, "sahamati")
    .replace(/conflict/gi, "virodh")
    .replace(/uncertainty/gi, "anischitata")
    .replace(/doctor/gi, "doctor")
    .replace(/tests/gi, "tests");

  const hinglish = englishSummary
    .replace(/agreement/gi, "alignment")
    .replace(/conflict/gi, "difference")
    .replace(/uncertainty/gi, "uncertainty")
    .replace(/doctor/gi, "doctor");

  return {
    en: englishSummary,
    hi: hindi,
    hinglish: hinglish
  };
}

function buildSummary(comparison: OpinionComparison, caseData: PatientCaseInput): string {
  const descriptor = comparison.conflict_score >= 66 ? "High conflict" : comparison.conflict_score >= 36 ? "Moderate conflict" : "Low conflict";
  const safetyLine = caseData.opinions.some((opinion) => opinion.urgency === "emergency")
    ? "Emergency-level advice appears in at least one opinion, so severe symptoms should be escalated immediately."
    : "No emergency-level recommendation was detected across all opinions.";

  return `${descriptor} (${comparison.conflict_score}%). Doctors differ mainly on ${comparison.disagreement_categories.join(", ") || "limited details"}. ${safetyLine}`;
}

function buildComparisonTable(structuredOpinions: StructuredOpinion[]): Record<string, unknown> {
  return {
    diagnosis: structuredOpinions.map((item) => item.diagnosis.join("; ")),
    treatment_plan: structuredOpinions.map((item) => item.treatment_plan.join("; ")),
    medications: structuredOpinions.map((item) => item.medications.join("; ")),
    tests_recommended: structuredOpinions.map((item) => item.tests_recommended.join("; ")),
    urgency_level: structuredOpinions.map((item) => item.urgency_level),
    specialist_type: structuredOpinions.map((item) => item.specialist_type)
  };
}

function generateSafetyWarnings(caseData: PatientCaseInput): string[] {
  const warnings: string[] = [
    "This comparison is designed to reduce confusion, not replace doctors.",
    "It does not diagnose disease or prescribe treatment.",
    "Use specialist discussion to resolve unresolved disagreement."
  ];

  if (caseData.opinions.some((opinion) => opinion.urgency === "emergency")) {
    warnings.push("If severe or red-flag symptoms are present, seek emergency medical care immediately.");
  }

  return warnings;
}

function confidenceLabel(confidence: OpinionComparison["confidence_level"]): string {
  if (confidence === "high") return "High confidence";
  if (confidence === "moderate") return "Moderate confidence";
  return "Low confidence";
}

export function extractOpinion(opinion: DoctorOpinionInput, index: number): StructuredOpinion {
  return extractStructuredOpinion(opinion, index);
}

export function normalizeOpinion(opinion: StructuredOpinion): StructuredOpinion {
  return {
    ...opinion,
    diagnosis: dedupe(opinion.diagnosis.map(canonicalizePhrase)),
    medications: dedupe(opinion.medications.map(canonicalizePhrase)),
    tests_recommended: dedupe(opinion.tests_recommended.map(canonicalizePhrase)),
    treatment_plan: dedupe(opinion.treatment_plan.map(canonicalizePhrase)),
    clinical_reasoning: dedupe(opinion.clinical_reasoning),
    precautions: dedupe(opinion.precautions),
    uncertainty_signals: dedupe(opinion.uncertainty_signals)
  };
}

export function compareOpinions(caseData: PatientCaseInput): {
  structuredOpinions: StructuredOpinion[];
  comparison: OpinionComparison;
  comparison_table: Record<string, unknown>;
} {
  const structuredOpinions = caseData.opinions.map((opinion, index) => normalizeOpinion(extractOpinion(opinion, index)));
  const comparison = buildComparison(structuredOpinions);
  return {
    structuredOpinions,
    comparison,
    comparison_table: buildComparisonTable(structuredOpinions)
  };
}

export function generateConflictScore(comparison: OpinionComparison): {
  score: number;
  label: string;
  explanation: string;
} {
  const score = Math.max(0, Math.min(100, comparison.conflict_score));
  const label = score >= 66 ? "High conflict" : score >= 36 ? "Moderate conflict" : "Low conflict";
  const explanation =
    score >= 66
      ? "Doctors significantly disagree on treatment urgency and intervention approach."
      : score >= 36
        ? "Doctors partially agree but differ on important parts of diagnosis, timing, or tests."
        : "Most opinions are aligned with limited disagreement.";

  return { score, label, explanation };
}

export function explainDisagreementForCase(
  structuredOpinions: StructuredOpinion[],
  comparison: OpinionComparison
): string[] {
  return explainDisagreement(structuredOpinions, comparison);
}

export function generateQuestionsForCase(
  structuredOpinions: StructuredOpinion[],
  comparison: OpinionComparison
): string[] {
  return generateQuestions(comparison, structuredOpinions);
}

export function generatePatientSummary(caseData: PatientCaseInput): ReconciliationOutput {
  const { structuredOpinions, comparison, comparison_table } = compareOpinions(caseData);
  const scoreBundle = generateConflictScore(comparison);
  const disagreement_reason = explainDisagreement(structuredOpinions, comparison);
  const specialist_questions = generateQuestions(comparison, structuredOpinions);
  const evidence_needed = generateEvidenceNeeded(comparison, structuredOpinions);
  const summary = buildSummary(comparison, caseData);
  const safetyWarnings = generateSafetyWarnings(caseData);
  const multilingual_output = buildMultilingualSummary(summary);

  const explainability: ExplainabilityBreakdown[] = structuredOpinions.map((opinion, index) => ({
    contributor: opinion.specialist_type,
    impact: Number(((comparison.conflict_score / 100) * (index + 1) / structuredOpinions.length).toFixed(3)),
    confidence: comparison.confidence_level === "high" ? 0.86 : comparison.confidence_level === "moderate" ? 0.66 : 0.45,
    evidenceLinks: []
  }));

  const output = {
    summary,
    conflict_score: `${scoreBundle.label} (${scoreBundle.score}%)`,
    agreement_score: `${comparison.agreement_score}%`,
    disagreement_reason,
    comparison_table,
    specialist_questions,
    evidence_needed,
    confidence_level: confidenceLabel(comparison.confidence_level),
    multilingual_output,
    structured_opinions: structuredOpinions,
    comparison,
    safety_disclaimer:
      "This comparison is designed to help you understand differences in medical opinions. It does not replace licensed medical care.",
    explainability,
    safetyWarnings
  };

  return output;
}
