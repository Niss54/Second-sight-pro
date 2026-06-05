import type { EvidenceCitation } from "../../types/domain";

export interface SeedEvidenceRecord extends EvidenceCitation {
  scoreHint: number;
}

export const SEED_MEDICAL_EVIDENCE: SeedEvidenceRecord[] = [
  {
    id: "who-emergency-flags-001",
    source: "WHO",
    title: "Emergency symptoms require urgent assessment",
    snippet:
      "Rapidly worsening breathing, chest pain, stroke-like symptoms, or sudden severe deterioration should be treated as urgent until a clinician says otherwise.",
    reference: "WHO emergency care guidance summary",
    confidence: 0.97,
    metadata: {
      category: "emergency_flags",
      urgency: "emergency",
      specialty: "emergency medicine",
      disease: "acute deterioration",
      condition: "danger symptoms"
    },
    scoreHint: 0.94
  },
  {
    id: "nih-diagnostic-confirmation-001",
    source: "NIH",
    title: "Uncertain diagnoses often need confirmatory testing",
    snippet:
      "When serious diagnoses conflict, the next safe step is often targeted confirmatory testing or specialist review rather than assuming one opinion is already final.",
    reference: "NIH clinical decision-making summary",
    confidence: 0.95,
    metadata: {
      category: "diagnostic_tests",
      urgency: "soon",
      specialty: "internal medicine",
      disease: "diagnostic uncertainty",
      condition: "conflicting diagnoses"
    },
    scoreHint: 0.9
  },
  {
    id: "medlineplus-medication-reconciliation-001",
    source: "MedlinePlus",
    title: "Medication reconciliation helps prevent unsafe duplication",
    snippet:
      "If two clinicians recommend different medicines or different dosing instructions, the safe next step is to reconcile the full medication list before starting or changing therapy.",
    reference: "MedlinePlus medication safety summary",
    confidence: 0.94,
    metadata: {
      category: "medication_conflicts",
      urgency: "soon",
      specialty: "pharmacy",
      disease: "medication conflict",
      condition: "prescription mismatch"
    },
    scoreHint: 0.88
  },
  {
    id: "mayo-specialist-review-001",
    source: "Mayo Clinic",
    title: "Specialist review helps resolve persistent disagreement",
    snippet:
      "If treatment plans differ materially, a specialist can often clarify the diagnosis, narrow the options, and explain which next test is most useful.",
    reference: "Mayo Clinic patient education summary",
    confidence: 0.95,
    metadata: {
      category: "treatment_guidelines",
      urgency: "soon",
      specialty: "specialist care",
      disease: "treatment disagreement",
      condition: "conflicting plans"
    },
    scoreHint: 0.91
  },
  {
    id: "pubmed-red-flags-001",
    source: "PubMed",
    title: "Red flags should override routine follow-up timing",
    snippet:
      "When there is material disagreement and the patient has red-flag symptoms, the urgency of care should be escalated even if one opinion appears conservative.",
    reference: "PubMed literature summary",
    confidence: 0.9,
    metadata: {
      category: "emergency_flags",
      urgency: "urgent",
      specialty: "triage",
      disease: "high-risk symptoms",
      condition: "urgent escalation"
    },
    scoreHint: 0.87
  },
  {
    id: "nih-follow-up-tests-001",
    source: "NIH",
    title: "Follow-up tests should answer one specific clinical question",
    snippet:
      "When doctors disagree, the next diagnostic test should be chosen because it can actually resolve the uncertainty, not just because it is available.",
    reference: "NIH diagnostic strategy summary",
    confidence: 0.93,
    metadata: {
      category: "diagnostic_tests",
      urgency: "soon",
      specialty: "diagnostics",
      disease: "uncertain diagnosis",
      condition: "test selection"
    },
    scoreHint: 0.89
  },
  {
    id: "who-patient-safety-001",
    source: "WHO",
    title: "Patient safety improves when medication and test histories are reviewed together",
    snippet:
      "A full review of prior prescriptions, investigations, and symptom timing reduces the risk of contradictory advice being missed.",
    reference: "WHO patient safety summary",
    confidence: 0.92,
    metadata: {
      category: "treatment_guidelines",
      urgency: "routine",
      specialty: "patient safety",
      disease: "history review",
      condition: "full context review"
    },
    scoreHint: 0.84
  }
];
