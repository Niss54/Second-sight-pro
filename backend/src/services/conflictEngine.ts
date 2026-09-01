import { averagePairwiseSimilarity, clamp01, normalizeText } from "../utils/text";
import {
  MedicationConflict,
  PatientCaseInput,
  RiskTier,
  RuleAnalysis,
  UrgencyLevel
} from "../types/domain";

const urgencyScale: Record<UrgencyLevel, number> = {
  routine: 1,
  soon: 2,
  urgent: 3,
  emergency: 4
};

interface ParsedMedication {
  canonicalName: string;
  displayName: string;
  detail: string;
}

function parseMedication(line: string): ParsedMedication | null {
  const cleaned = line.trim();
  if (!cleaned) {
    return null;
  }

  const parts = cleaned.split("|").map((part) => part.trim()).filter(Boolean);
  const displayName = parts[0] ?? cleaned;
  const detail = parts.slice(1).join(" | ").trim();
  const canonicalName = normalizeText(displayName).replace(/\s+/g, "");

  if (!canonicalName) {
    return null;
  }

  return {
    canonicalName,
    displayName,
    detail: detail || "unspecified"
  };
}

function analyzeMedications(caseData: PatientCaseInput): {
  medicationConsistency: number;
  conflicts: MedicationConflict[];
} {
  const medicationMap = new Map<
    string,
    {
      label: string;
      details: Set<string>;
      doctors: Set<string>;
    }
  >();

  caseData.opinions.forEach((opinion) => {
    opinion.prescriptions.forEach((line) => {
      const parsed = parseMedication(line);
      if (!parsed) {
        return;
      }

      if (!medicationMap.has(parsed.canonicalName)) {
        medicationMap.set(parsed.canonicalName, {
          label: parsed.displayName,
          details: new Set<string>(),
          doctors: new Set<string>()
        });
      }

      const bucket = medicationMap.get(parsed.canonicalName);
      if (!bucket) {
        return;
      }

      bucket.details.add(parsed.detail.toLowerCase());
      bucket.doctors.add(opinion.doctorName);
    });
  });

  const conflicts: MedicationConflict[] = [];
  let fragmented = 0;

  medicationMap.forEach((entry) => {
    if (entry.details.size > 1) {
      conflicts.push({
        medication: entry.label,
        details: Array.from(entry.details),
        doctors: Array.from(entry.doctors)
      });
    }

    if (entry.doctors.size < caseData.opinions.length) {
      fragmented += 1;
    }
  });

  const total = Math.max(1, medicationMap.size);
  const conflictRatio = clamp01((conflicts.length + fragmented * 0.45) / total);

  return {
    medicationConsistency: clamp01(1 - conflictRatio),
    conflicts
  };
}

function analyzeUrgency(caseData: PatientCaseInput): {
  urgencyAgreement: number;
  hasEmergencyAdvice: boolean;
  hasRoutineAdvice: boolean;
} {
  const values = caseData.opinions.map((opinion) => urgencyScale[opinion.urgency]);
  const spread = Math.max(...values) - Math.min(...values);
  const disagreement = spread / 3;

  return {
    urgencyAgreement: clamp01(1 - disagreement),
    hasEmergencyAdvice: values.includes(4),
    hasRoutineAdvice: values.includes(1)
  };
}

function toRiskTier(score: number): RiskTier {
  if (score >= 66) {
    return "high";
  }

  if (score >= 36) {
    return "moderate";
  }

  return "low";
}

export function runRuleEngine(caseData: PatientCaseInput): RuleAnalysis {
  const diagnosisAlignment = averagePairwiseSimilarity(caseData.opinions.map((item) => item.diagnosis));
  const treatmentAlignment = averagePairwiseSimilarity(caseData.opinions.map((item) => item.treatment));
  const testAlignment = averagePairwiseSimilarity(
    caseData.opinions.map((item) => item.tests.join(" "))
  );

  const medication = analyzeMedications(caseData);
  const urgency = analyzeUrgency(caseData);

  const diagnosisDisagreement = 1 - diagnosisAlignment;
  const treatmentDisagreement = 1 - treatmentAlignment;
  const testDisagreement = 1 - testAlignment;
  const medicationDisagreement = 1 - medication.medicationConsistency;
  const urgencyDisagreement = 1 - urgency.urgencyAgreement;

  const conflictScore = Math.round(
    100 *
      (
        diagnosisDisagreement * 0.33 +
        treatmentDisagreement * 0.25 +
        medicationDisagreement * 0.2 +
        urgencyDisagreement * 0.17 +
        testDisagreement * 0.05
      )
  );

  const riskTier = toRiskTier(conflictScore);

  const findings: string[] = [];

  if (riskTier === "high") {
    findings.push(
      "High conflict detected: recommendations diverge significantly and require specialist reconciliation before irreversible decisions."
    );
  } else if (riskTier === "moderate") {
    findings.push(
      "Moderate conflict detected: plans overlap partially but material differences need clarification."
    );
  } else {
    findings.push("Low conflict detected: most recommendations align with limited variation.");
  }

  if (diagnosisAlignment < 0.45) {
    findings.push("Diagnosis overlap is low, indicating competing root-cause explanations.");
  } else if (diagnosisAlignment < 0.7) {
    findings.push("Diagnosis overlap is partial and should be explicitly reconciled.");
  } else {
    findings.push("Diagnosis opinions are broadly aligned.");
  }

  if (treatmentAlignment < 0.45) {
    findings.push("Treatment pathways conflict in approach or timing.");
  } else if (treatmentAlignment < 0.7) {
    findings.push("Treatment pathways partially align but differ in sequencing or intensity.");
  } else {
    findings.push("Treatment plans are mostly consistent.");
  }

  if (medication.conflicts.length > 0) {
    findings.push(
      `Medication instruction mismatch found for ${medication.conflicts[0].medication}. Dose/frequency reconciliation is recommended.`
    );
  }

  if (urgency.hasEmergencyAdvice && urgency.hasRoutineAdvice) {
    findings.push(
      "Urgency conflict is critical: at least one opinion indicates emergency while another indicates routine follow-up."
    );
  }

  if (testAlignment < 0.5) {
    findings.push("Diagnostic confirmation strategy differs across doctors.");
  }

  findings.push(`${caseData.opinions.length} doctor opinions analyzed.`);

  const recommendedActions: string[] = [];

  if (urgency.hasEmergencyAdvice) {
    recommendedActions.push(
      "If red-flag symptoms are active, follow emergency advice immediately and do not delay safety care."
    );
  }

  if (riskTier === "high") {
    recommendedActions.push(
      "Arrange tertiary specialist or multidisciplinary board review within 24-72 hours."
    );
    recommendedActions.push(
      "Request side-by-side reassessment of imaging, pathology, and recent lab reports."
    );
    recommendedActions.push(
      "Avoid non-urgent irreversible procedures until diagnostic basis is revalidated."
    );
  } else if (riskTier === "moderate") {
    recommendedActions.push(
      "Book one focused specialist consultation to reconcile disagreements before finalizing treatment."
    );
    recommendedActions.push(
      "Ask each doctor to provide evidence and rationale behind differences in plan."
    );
  } else {
    recommendedActions.push(
      "Proceed with coordinated plan while documenting unresolved questions and follow-up markers."
    );
  }

  recommendedActions.push(
    "Create a shared case packet: timeline, reports, scans, pathology, and current medication list."
  );

  if (medication.conflicts.length > 0) {
    recommendedActions.push(
      "Complete pharmacist-led medication reconciliation for final dose/frequency safety check."
    );
  }

  const specialistQuestions: string[] = [];

  if (diagnosisAlignment < 0.7) {
    specialistQuestions.push(
      "Which diagnosis best explains all findings, and what evidence rules out the alternatives?"
    );
  }

  if (treatmentAlignment < 0.7) {
    specialistQuestions.push(
      "What benefit-risk evidence supports your plan over the alternative plan?"
    );
  }

  if (testAlignment < 0.7) {
    specialistQuestions.push(
      "Which single next test will reduce uncertainty the most right now?"
    );
  }

  if (medication.conflicts.length > 0) {
    specialistQuestions.push(
      "Can you provide one final unified medication chart with exact dose and schedule?"
    );
  }

  if (urgency.hasEmergencyAdvice && urgency.hasRoutineAdvice) {
    specialistQuestions.push(
      "What warning signs require immediate ER care versus planned follow-up?"
    );
  }

  specialistQuestions.push("If this were your family member, what would be the safest next step this week?");

  return {
    metrics: {
      diagnosisAlignment,
      treatmentAlignment,
      testAlignment,
      medicationConsistency: medication.medicationConsistency,
      urgencyAgreement: urgency.urgencyAgreement
    },
    conflictScore,
    riskTier,
    findings,
    recommendedActions,
    specialistQuestions,
    medicationConflicts: medication.conflicts
  };
}
