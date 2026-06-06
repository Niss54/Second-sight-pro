import type { PatientCaseInput, SupportedLanguage, UrgencyLevel, EvidenceCitation } from "../types/domain";
import { clamp01, normalizeText } from "../utils/text";
import { createMedicalEvidenceEngine } from "../modules/medical-evidence-engine";

type SourceType = "ocr" | "pdf" | "manual";
type ConflictLevel = "Low conflict" | "Moderate conflict" | "High conflict";

interface OpinionSource {
  sourceType: SourceType;
  doctorId?: string;
  rawText?: string;
  opinion?: Partial<{
    doctorName: string;
    specialty: string;
    urgency: string;
    diagnosis: string;
    treatment: string;
    prescriptions: string[];
    tests: string[];
    notes: string;
  }>;
}

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

interface CategoryComparison {
  status: "agreement" | "partial_agreement" | "direct_contradiction" | "insufficient_data";
  notes: string[];
  agreement: number;
}

interface ComparisonOutcome {
  agreement_score: number;
  conflict_score: number;
  disagreement_categories: string[];
  missing_information: string[];
  key_conflicts: string[];
  confidence_level: "low" | "medium" | "high";
  comparison_table: {
    diagnosis: CategoryComparison;
    treatment: CategoryComparison;
    medicine: CategoryComparison;
    tests: CategoryComparison;
    urgency: CategoryComparison;
  };
}

interface DisagreementReason {
  category:
    | "Different treatment philosophy"
    | "Insufficient diagnostic evidence"
    | "Different interpretation of scans/tests"
    | "Different risk tolerance"
    | "Missing patient history"
    | "Specialist expertise difference"
    | "Diagnostic uncertainty"
    | "Additional testing required";
  evidence: string;
}

interface UiBlock {
  title: string;
  color: "green" | "yellow" | "red";
  items: string[];
}

export interface ReconciliationOutput {
  summary: string;
  conflict_score: string;
  agreement_score: string;
  disagreement_reason: string[];
  comparison_table: ComparisonOutcome["comparison_table"];
  specialist_questions: string[];
  evidence_needed: string[];
  confidence_level: ComparisonOutcome["confidence_level"];
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

const safetyDisclaimer =
  "This comparison is designed to help you understand differences in medical opinions. It does not replace licensed medical care.";

const diagnosisSynonyms: Array<{ pattern: RegExp; canonical: string }> = [
  { pattern: /(mild\s+lumbar\s+disc\s+bulge|l4\s*-?\s*l5\s+mild\s+herniation)/i, canonical: "lumbar disc herniation mild" },
  { pattern: /(disc\s+prolapse|disc\s+herniation)/i, canonical: "disc herniation" },
  { pattern: /(sciatica|radicular\s+pain)/i, canonical: "lumbar radiculopathy" }
];

const treatmentSynonyms: Array<{ pattern: RegExp; canonical: string }> = [
  { pattern: /(immediate\s+surgery\s+advised|operative\s+management\s+recommended)/i, canonical: "surgical intervention advised" },
  { pattern: /(watchful\s+waiting|conservative\s+management|trial\s+physiotherapy)/i, canonical: "conservative management" },
  { pattern: /(pain\s+management|symptom\s+control)/i, canonical: "symptomatic management" }
];

const urgencyMap: Array<{ pattern: RegExp; level: UrgencyLevel }> = [
  { pattern: /(emergency|immediate|er|icu)/i, level: "emergency" },
  { pattern: /(urgent|within\s*24|asap)/i, level: "urgent" },
  { pattern: /(soon|1\s*-\s*2\s*weeks|early\s+review)/i, level: "soon" }
];

const aggressiveSignals = /(surgery|operative|invasive|admission)/i;
const conservativeSignals = /(conservative|observe|physiotherapy|wait|monitor)/i;

function splitToItems(text?: string): string[] {
  if (!text) {
    return [];
  }

  return text
    .split(/[\n,;]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeByMap(value: string, mappings: Array<{ pattern: RegExp; canonical: string }>): string {
  const found = mappings.find((item) => item.pattern.test(value));
  return found ? found.canonical : normalizeText(value);
}

function normalizeUrgency(raw: string): UrgencyLevel {
  const match = urgencyMap.find((item) => item.pattern.test(raw));
  return match?.level ?? "routine";
}

function unique(items: string[]): string[] {
  return Array.from(new Set(items.map((item) => item.trim()).filter(Boolean)));
}

function setSimilarity(left: string[], right: string[]): number {
  const a = new Set(left);
  const b = new Set(right);
  const union = new Set([...a, ...b]);
  if (union.size === 0) {
    return 1;
  }

  let intersect = 0;
  union.forEach((item) => {
    if (a.has(item) && b.has(item)) {
      intersect += 1;
    }
  });

  return intersect / union.size;
}

function mean(values: number[]): number {
  if (values.length === 0) {
    return 1;
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function pairwiseScores<T>(opinions: StructuredOpinion[], selector: (item: StructuredOpinion) => T, score: (a: T, b: T) => number): number[] {
  const scores: number[] = [];
  for (let i = 0; i < opinions.length; i += 1) {
    for (let j = i + 1; j < opinions.length; j += 1) {
      scores.push(score(selector(opinions[i]), selector(opinions[j])));
    }
  }

  return scores;
}

function categoryStatus(agreement: number, hasData: boolean): CategoryComparison["status"] {
  if (!hasData) {
    return "insufficient_data";
  }
  if (agreement >= 0.75) {
    return "agreement";
  }
  if (agreement <= 0.25) {
    return "direct_contradiction";
  }
  return "partial_agreement";
}

function hasSevereSymptom(caseData: PatientCaseInput): boolean {
  const joined = [caseData.primaryCondition, ...(caseData.symptoms ?? [])].join(" ");
  return /(severe|chest pain|stroke|bleeding|breathless|unconscious|paralysis)/i.test(joined);
}

export function extractOpinion(source: OpinionSource): StructuredOpinion {
  const raw = source.rawText?.trim() ?? "";
  const opinion = source.opinion ?? {};
  const doctorName = source.doctorId ?? opinion.doctorName ?? "doctor-unknown";

  const diagnosis = unique([
    ...splitToItems(opinion.diagnosis),
    ...splitToItems(raw.match(/diagnosis\s*:\s*([^\n]+)/i)?.[1])
  ]);
  const medications = unique([
    ...(opinion.prescriptions ?? []),
    ...splitToItems(raw.match(/medications?\s*:\s*([^\n]+)/i)?.[1])
  ]);
  const tests = unique([
    ...(opinion.tests ?? []),
    ...splitToItems(raw.match(/tests?\s*:\s*([^\n]+)/i)?.[1])
  ]);
  const treatmentPlan = unique([
    ...splitToItems(opinion.treatment),
    ...splitToItems(raw.match(/treatment\s*plan\s*:\s*([^\n]+)/i)?.[1]),
    ...splitToItems(raw.match(/plan\s*:\s*([^\n]+)/i)?.[1])
  ]);

  const uncertaintySignals = unique([
    ...splitToItems(opinion.notes).filter((item) => /(uncertain|possible|rule out|suggest|likely)/i.test(item)),
    ...splitToItems(raw).filter((item) => /(uncertain|possible|rule out|limited|unclear|illegible)/i.test(item))
  ]);

  return {
    doctor_id: doctorName,
    diagnosis,
    medications,
    tests_recommended: tests,
    treatment_plan: treatmentPlan,
    urgency_level: normalizeUrgency(opinion.urgency ?? raw),
    specialist_type: normalizeText(opinion.specialty ?? raw.match(/specialty\s*:\s*([^\n]+)/i)?.[1] ?? "general"),
    clinical_reasoning: unique(splitToItems(raw.match(/reasoning\s*:\s*([^\n]+)/i)?.[1] ?? opinion.notes)),
    precautions: unique(splitToItems(raw.match(/precautions?\s*:\s*([^\n]+)/i)?.[1])),
    followup_recommendation: raw.match(/follow\s*up\s*:\s*([^\n]+)/i)?.[1]?.trim() ?? "not specified",
    uncertainty_signals: uncertaintySignals
  };
}

export function normalizeOpinion(opinion: StructuredOpinion): StructuredOpinion {
  return {
    ...opinion,
    diagnosis: unique(opinion.diagnosis.map((item) => normalizeByMap(item, diagnosisSynonyms))),
    treatment_plan: unique(opinion.treatment_plan.map((item) => normalizeByMap(item, treatmentSynonyms))),
    medications: unique(opinion.medications.map((item) => normalizeText(item))),
    tests_recommended: unique(opinion.tests_recommended.map((item) => normalizeText(item))),
    specialist_type: normalizeText(opinion.specialist_type),
    clinical_reasoning: unique(opinion.clinical_reasoning.map((item) => normalizeText(item))),
    precautions: unique(opinion.precautions.map((item) => normalizeText(item))),
    followup_recommendation: normalizeText(opinion.followup_recommendation),
    uncertainty_signals: unique(opinion.uncertainty_signals.map((item) => normalizeText(item))),
    urgency_level: normalizeUrgency(opinion.urgency_level)
  };
}

export function compareOpinions(opinions: StructuredOpinion[]): ComparisonOutcome {
  const diagnosisAgreement = mean(pairwiseScores(opinions, (item) => item.diagnosis, setSimilarity));
  const treatmentAgreement = mean(pairwiseScores(opinions, (item) => item.treatment_plan, setSimilarity));
  const medicineAgreement = mean(pairwiseScores(opinions, (item) => item.medications, setSimilarity));
  const testAgreement = mean(pairwiseScores(opinions, (item) => item.tests_recommended, setSimilarity));
  const urgencyAgreement = mean(
    pairwiseScores(opinions, (item) => item.urgency_level, (left, right) => (left === right ? 1 : 0))
  );

  const table: ComparisonOutcome["comparison_table"] = {
    diagnosis: {
      status: categoryStatus(diagnosisAgreement, opinions.some((item) => item.diagnosis.length > 0)),
      notes: ["Standardized diagnosis overlap evaluated across all opinions."],
      agreement: Number(diagnosisAgreement.toFixed(3))
    },
    treatment: {
      status: categoryStatus(treatmentAgreement, opinions.some((item) => item.treatment_plan.length > 0)),
      notes: ["Treatment intent compared after semantic normalization."],
      agreement: Number(treatmentAgreement.toFixed(3))
    },
    medicine: {
      status: categoryStatus(medicineAgreement, opinions.some((item) => item.medications.length > 0)),
      notes: ["Medication names normalized and overlap measured."],
      agreement: Number(medicineAgreement.toFixed(3))
    },
    tests: {
      status: categoryStatus(testAgreement, opinions.some((item) => item.tests_recommended.length > 0)),
      notes: ["Recommended diagnostic evidence compared."],
      agreement: Number(testAgreement.toFixed(3))
    },
    urgency: {
      status: categoryStatus(urgencyAgreement, true),
      notes: ["Escalation level consistency assessed."],
      agreement: Number(urgencyAgreement.toFixed(3))
    }
  };

  const disagreement_categories = Object.entries(table)
    .filter(([, item]) => item.status !== "agreement")
    .map(([key]) => key);

  const missing_information = opinions.flatMap((item) => {
    const missing: string[] = [];
    if (item.diagnosis.length === 0) {
      missing.push(`${item.doctor_id}: missing diagnosis`);
    }
    if (item.tests_recommended.length === 0) {
      missing.push(`${item.doctor_id}: missing test recommendation`);
    }
    if (item.clinical_reasoning.length === 0) {
      missing.push(`${item.doctor_id}: missing clinical reasoning`);
    }
    return missing;
  });

  const key_conflicts: string[] = [];
  if (table.urgency.status === "direct_contradiction") {
    key_conflicts.push("Contradictory urgency signals across opinions.");
  }
  if (table.treatment.status !== "agreement") {
    key_conflicts.push("Treatment approach differs (possible conservative vs aggressive split).");
  }
  if (table.diagnosis.status !== "agreement") {
    key_conflicts.push("Diagnosis interpretation is not fully aligned.");
  }

  const agreement_score = Math.round(
    100 * (diagnosisAgreement * 0.27 + treatmentAgreement * 0.3 + medicineAgreement * 0.15 + urgencyAgreement * 0.2 + testAgreement * 0.08)
  );

  const conflict_score = generateConflictScore(table);
  const confidence_level: ComparisonOutcome["confidence_level"] =
    missing_information.length > 3 ? "low" : conflict_score > 70 ? "high" : "medium";

  return {
    agreement_score,
    conflict_score,
    disagreement_categories,
    missing_information,
    key_conflicts,
    confidence_level,
    comparison_table: table
  };
}

export function generateConflictScore(table: ComparisonOutcome["comparison_table"]): number {
  const disagreement = {
    diagnosis: 1 - table.diagnosis.agreement,
    treatment: 1 - table.treatment.agreement,
    medicine: 1 - table.medicine.agreement,
    urgency: 1 - table.urgency.agreement,
    tests: 1 - table.tests.agreement
  };

  const weighted =
    disagreement.diagnosis * 0.27 +
    disagreement.treatment * 0.3 +
    disagreement.medicine * 0.15 +
    disagreement.urgency * 0.2 +
    disagreement.tests * 0.08;

  return Math.round(clamp01(weighted) * 100);
}

function conflictLevel(score: number): ConflictLevel {
  if (score >= 66) {
    return "High conflict";
  }
  if (score >= 36) {
    return "Moderate conflict";
  }
  return "Low conflict";
}

export function explainDisagreement(opinions: StructuredOpinion[], comparison: ComparisonOutcome): DisagreementReason[] {
  const reasons: DisagreementReason[] = [];
  const allTreatmentText = opinions.map((item) => item.treatment_plan.join(" ")).join(" ");
  const specialties = unique(opinions.map((item) => item.specialist_type));
  const hasUncertainty = opinions.some((item) => item.uncertainty_signals.length > 0);

  if (aggressiveSignals.test(allTreatmentText) && conservativeSignals.test(allTreatmentText)) {
    reasons.push({
      category: "Different treatment philosophy",
      evidence: "At least one opinion uses invasive/surgical language while another recommends conservative management."
    });
  }

  if (comparison.comparison_table.tests.status !== "agreement") {
    reasons.push({
      category: "Insufficient diagnostic evidence",
      evidence: "Doctors did not request the same tests, so evidence basis is uneven across opinions."
    });
    reasons.push({
      category: "Additional testing required",
      evidence: "Non-overlapping test recommendations indicate additional objective evidence may reduce uncertainty."
    });
  }

  if (comparison.comparison_table.diagnosis.status !== "agreement") {
    reasons.push({
      category: "Different interpretation of scans/tests",
      evidence: "Diagnosis normalization still shows partial or direct mismatch across doctors."
    });
  }

  if (comparison.comparison_table.urgency.status !== "agreement") {
    reasons.push({
      category: "Different risk tolerance",
      evidence: "Urgency classification differs, suggesting different thresholds for escalation."
    });
  }

  if (comparison.missing_information.some((item) => item.includes("missing clinical reasoning"))) {
    reasons.push({
      category: "Missing patient history",
      evidence: "One or more opinions lack explicit clinical reasoning/history linkage."
    });
  }

  if (specialties.length > 1) {
    reasons.push({
      category: "Specialist expertise difference",
      evidence: "Opinions come from different specialties, which can prioritize different outcome risks."
    });
  }

  if (hasUncertainty) {
    reasons.push({
      category: "Diagnostic uncertainty",
      evidence: "At least one opinion contains explicit uncertainty signals (e.g., possible/unclear)."
    });
  }

  return reasons;
}

export function generateQuestions(comparison: ComparisonOutcome, reasons: DisagreementReason[]): string[] {
  const questions: string[] = [];

  if (comparison.comparison_table.treatment.status !== "agreement") {
    questions.push("What objective evidence supports this intervention approach over alternatives?");
    questions.push("What risks exist if conservative treatment is attempted first?");
  }

  if (comparison.comparison_table.tests.status !== "agreement") {
    questions.push("Would additional imaging or lab tests reduce current uncertainty?");
  }

  if (comparison.comparison_table.urgency.status !== "agreement") {
    questions.push("What warning signs should trigger urgent or emergency care?");
  }

  if (reasons.some((item) => item.category === "Specialist expertise difference")) {
    questions.push("How does your specialty perspective influence this recommendation?");
  }

  if (reasons.some((item) => item.category === "Diagnostic uncertainty")) {
    questions.push("Which findings are still uncertain, and how will they be clarified?");
  }

  if (questions.length === 0) {
    questions.push("What follow-up evidence should we track to confirm this plan remains safe?");
  }

  return unique(questions).slice(0, 8);
}

function generateMultilingual(summary: string, conflictLabel: string): ReconciliationOutput["multilingual_output"] {
  return {
    english: `${summary} ${safetyDisclaimer}`,
    hindi: `Yeh tulna doctor opinions ke antar ko samajhne ke liye hai. ${conflictLabel}. Yeh licensed medical care ka vikalp nahi hai.`,
    hinglish: `Yeh comparison confusion kam karne ke liye hai. ${conflictLabel}. Final decision ke liye specialist se discuss karein.`
  };
}

export function generatePatientSummary(
  comparison: ComparisonOutcome,
  reasons: DisagreementReason[],
  questions: string[],
  severeSymptoms: boolean
): ReconciliationOutput {
  const level = conflictLevel(comparison.conflict_score);
  const summary = `${level} (${comparison.conflict_score}%) - Doctors differ most on ${comparison.disagreement_categories.join(", ") || "minor details"}.`;

  const evidenceNeeded = unique([
    ...comparison.missing_information,
    ...(comparison.comparison_table.tests.status !== "agreement"
      ? ["Unified diagnostic evidence plan (shared imaging/labs review)"]
      : []),
    ...(comparison.comparison_table.diagnosis.status !== "agreement"
      ? ["Objective criteria used to confirm or exclude each diagnosis"]
      : [])
  ]);

  const visualBlocks: UiBlock[] = [
    {
      title: "Areas doctors agree",
      color: "green",
      items: Object.entries(comparison.comparison_table)
        .filter(([, item]) => item.status === "agreement")
        .map(([name]) => name)
    },
    {
      title: "Areas doctors disagree",
      color: comparison.conflict_score >= 66 ? "red" : "yellow",
      items: comparison.disagreement_categories.length > 0 ? comparison.disagreement_categories : ["No major disagreements"]
    },
    {
      title: "Why disagreement may exist",
      color: "yellow",
      items: reasons.map((item) => `${item.category}: ${item.evidence}`)
    },
    {
      title: "Questions to ask specialist",
      color: "yellow",
      items: questions
    },
    {
      title: "Suggested evidence/tests",
      color: "yellow",
      items: evidenceNeeded
    },
    {
      title: "Safety disclaimer",
      color: "red",
      items: [
        safetyDisclaimer,
        ...(severeSymptoms ? ["If severe or rapidly worsening symptoms are present, seek urgent emergency care immediately."] : [])
      ]
    }
  ];

  return {
    summary,
    conflict_score: `${level} (${comparison.conflict_score}%)`,
    agreement_score: `${comparison.agreement_score}%`,
    disagreement_reason: reasons.map((item) => `${item.category}: ${item.evidence}`),
    comparison_table: comparison.comparison_table,
    specialist_questions: questions,
    evidence_needed: evidenceNeeded,
    confidence_level: comparison.confidence_level,
    manual_correction_required: comparison.confidence_level === "low",
    safety_disclaimer: safetyDisclaimer,
    visual_explanation_blocks: visualBlocks,
    multilingual_output: generateMultilingual(summary, `${level} conflict identified`)
  };
}

export async function reconcileOpinions(caseData: PatientCaseInput, language: SupportedLanguage = "en"): Promise<ReconciliationOutput> {
  const sources: OpinionSource[] = caseData.opinions.map((item, index) => ({
    sourceType: "manual",
    doctorId: item.doctorName || `doctor-${index + 1}`,
    opinion: {
      doctorName: item.doctorName,
      specialty: item.specialty,
      urgency: item.urgency,
      diagnosis: item.diagnosis,
      treatment: item.treatment,
      prescriptions: item.prescriptions,
      tests: item.tests,
      notes: item.notes
    }
  }));

  const structured = sources.map((source) => normalizeOpinion(extractOpinion(source)));
  const comparison = compareOpinions(structured);
  const reasons = explainDisagreement(structured, comparison);
  const questions = generateQuestions(comparison, reasons);
  const output = generatePatientSummary(comparison, reasons, questions, hasSevereSymptom(caseData));

  // Retrieve evidence citations (RAG module)
  const evidenceEngine = createMedicalEvidenceEngine();
  const searchTerms = [
    caseData.primaryCondition,
    ...comparison.key_conflicts
  ].filter(Boolean).join(" ");
  
  output.citations = await evidenceEngine.getCitations(searchTerms);

  if (language === "hi") {
    output.summary = output.multilingual_output.hindi;
  } else if (language === "hinglish") {
    output.summary = output.multilingual_output.hinglish;
  } else {
    output.summary = output.multilingual_output.english;
  }

  return output;
}
