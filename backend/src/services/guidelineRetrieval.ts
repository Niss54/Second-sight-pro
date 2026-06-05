import { createMedicalEvidenceEngine } from "../modules/medical-evidence-engine";
import type { MedicalEvidenceBundle, MedicalEvidenceQuery } from "../modules/medical-evidence-engine";

export interface TrustedMedicalGuidance extends MedicalEvidenceBundle {
  guidance: string;
  keyGuidance: string[];
}

const defaultEngine = createMedicalEvidenceEngine();

function formatCitationLabel(bundle: MedicalEvidenceBundle): string {
  if (bundle.citations.length === 0) {
    return `No guideline evidence matched "${bundle.query}".`;
  }

  const topSource = bundle.citations[0];
  return `${topSource.title} (${topSource.source})`;
}

function buildGuidance(bundle: MedicalEvidenceBundle): TrustedMedicalGuidance {
  const topCitations = bundle.citations.slice(0, 3);

  const guidance =
    topCitations.length === 0
      ? `No guideline-backed evidence was found for "${bundle.query}". Broaden the query or add disease, specialty, or condition filters before drawing a conclusion.`
      : [
          `Guideline-backed summary for "${bundle.query}": ${formatCitationLabel(bundle)}.`,
          `Use the most relevant citations below to verify the full recommendation before acting.`,
          ...topCitations.map((citation) => `${citation.title} - ${citation.snippet}`)
        ].join(" ");

  return {
    ...bundle,
    guidance,
    keyGuidance: topCitations.map((citation) => `${citation.title} (${citation.source})`)
  };
}

export async function fetchEvidence(input: string | MedicalEvidenceQuery): Promise<MedicalEvidenceBundle> {
  return defaultEngine.getMedicalEvidence(input);
}

export async function fetchGuidelines(input: string | MedicalEvidenceQuery): Promise<TrustedMedicalGuidance> {
  const evidence = await fetchEvidence(input);
  return buildGuidance(evidence);
}