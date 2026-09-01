import type { EvidenceCitation, UrgencyLevel } from "../../types/domain";

export type MedicalEvidenceSource = EvidenceCitation["source"];

export interface MedicalEvidenceFilters {
  disease?: string;
  specialty?: string;
  urgency?: UrgencyLevel | "routine" | "soon" | "urgent" | "emergency";
  condition?: string;
  sources?: MedicalEvidenceSource[];
}

export interface MedicalEvidenceQuery extends MedicalEvidenceFilters {
  query: string;
  limit?: number;
  embedding?: number[];
}

export interface MedicalEvidenceHit extends EvidenceCitation {
  score: number;
  matchedFields: string[];
  vectorScore?: number;
  keywordScore?: number;
}

export interface MedicalEvidenceBundle {
  query: string;
  evidence: MedicalEvidenceHit[];
  citations: EvidenceCitation[];
  generatedAt: string;
  sourceMode: "seed" | "supabase" | "hybrid";
}

export interface MedicalEvidenceStore {
  search(query: MedicalEvidenceQuery): Promise<MedicalEvidenceHit[]>;
}

export interface MedicalEvidenceEngineOptions {
  store?: MedicalEvidenceStore;
  defaultLimit?: number;
  embedQuery?: (query: string) => Promise<number[] | null>;
}
