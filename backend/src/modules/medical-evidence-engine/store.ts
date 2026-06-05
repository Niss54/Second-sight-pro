import type { MedicalEvidenceHit, MedicalEvidenceQuery, MedicalEvidenceStore } from "./types";
import { clampScore, mergeAndRankHits, scoreTextOverlap } from "./scoring";
import { SEED_MEDICAL_EVIDENCE, type SeedEvidenceRecord } from "./seedCorpus";

function matchesFilter(value: string | undefined, filter?: string): boolean {
  if (!filter) {
    return true;
  }

  if (!value) {
    return false;
  }

  return value.toLowerCase().includes(filter.toLowerCase());
}

function scoreSeedRecord(query: MedicalEvidenceQuery, record: SeedEvidenceRecord): MedicalEvidenceHit {
  const queryText = [
    query.query,
    query.disease,
    query.specialty,
    query.condition,
    query.urgency
  ]
    .filter(Boolean)
    .join(" ");

  const keywordScore = clampScore(
    scoreTextOverlap(queryText, [record.title, record.snippet, record.reference ?? "", record.metadata.category ?? ""].join(" "))
  );

  const metadataScore = clampScore(
    [
      matchesFilter(record.metadata.disease, query.disease) ? 0.18 : 0,
      matchesFilter(record.metadata.specialty, query.specialty) ? 0.14 : 0,
      matchesFilter(record.metadata.condition, query.condition) ? 0.16 : 0,
      matchesFilter(record.metadata.urgency, query.urgency) ? 0.12 : 0,
      query.sources?.length && query.sources.includes(record.source) ? 0.08 : 0
    ].reduce((sum, value) => sum + value, 0)
  );

  const score = clampScore(record.scoreHint * 0.6 + keywordScore * 0.3 + metadataScore * 0.1);

  return {
    ...record,
    score,
    matchedFields: [
      ...(keywordScore > 0 ? ["keyword"] : []),
      ...(metadataScore > 0 ? ["metadata"] : [])
    ],
    keywordScore,
    vectorScore: undefined
  };
}

export class SeedMedicalEvidenceStore implements MedicalEvidenceStore {
  async search(query: MedicalEvidenceQuery): Promise<MedicalEvidenceHit[]> {
    const results = SEED_MEDICAL_EVIDENCE.map((record) => scoreSeedRecord(query, record));

    return mergeAndRankHits(results).slice(0, query.limit ?? 5);
  }
}
