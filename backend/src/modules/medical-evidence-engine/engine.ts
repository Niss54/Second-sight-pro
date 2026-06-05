import type { MedicalEvidenceBundle, MedicalEvidenceEngineOptions, MedicalEvidenceQuery, MedicalEvidenceStore } from "./types";
import { SeedMedicalEvidenceStore } from "./store";
import { SupabaseMedicalEvidenceStore } from "./supabaseStore";
import { env } from "../../config/env";
import OpenAI from "openai";

const openaiClient = env.OPENAI_API_KEY
  ? new OpenAI({
      apiKey: env.OPENAI_API_KEY,
      baseURL: env.OPENAI_BASE_URL
    })
  : null;

async function defaultEmbedQuery(query: string): Promise<number[] | null> {
  if (!openaiClient) {
    return null;
  }

  try {
    const response = await openaiClient.embeddings.create({
      model: "text-embedding-3-small",
      input: query
    });

    return response.data[0]?.embedding ?? null;
  } catch {
    return null;
  }
}

function createDefaultStore(): MedicalEvidenceStore {
  if (env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY) {
    return new SupabaseMedicalEvidenceStore({
      supabaseUrl: env.SUPABASE_URL,
      serviceRoleKey: env.SUPABASE_SERVICE_ROLE_KEY,
      tableName: env.MEDICAL_EVIDENCE_TABLE,
      matchFunctionName: env.MEDICAL_EVIDENCE_MATCH_FUNCTION
    });
  }

  return new SeedMedicalEvidenceStore();
}

function toBundle(query: MedicalEvidenceQuery, evidence: Awaited<ReturnType<MedicalEvidenceStore["search"]>>): MedicalEvidenceBundle {
  return {
    query: query.query,
    evidence,
    citations: evidence.map((item) => ({
      id: item.id,
      source: item.source,
      title: item.title,
      snippet: item.snippet,
      reference: item.reference,
      confidence: item.confidence,
      metadata: item.metadata
    })),
    generatedAt: new Date().toISOString(),
    sourceMode:
      evidence.length > 0 && evidence.some((item) => item.vectorScore !== undefined)
        ? "supabase"
        : "seed"
  };
}

export class MedicalEvidenceEngine {
  private readonly store: MedicalEvidenceStore;

  private readonly defaultLimit: number;

  private readonly embedQuery: (query: string) => Promise<number[] | null>;

  constructor(options: MedicalEvidenceEngineOptions = {}) {
    this.store = options.store ?? createDefaultStore();
    this.defaultLimit = options.defaultLimit ?? 5;
    this.embedQuery = options.embedQuery ?? defaultEmbedQuery;
  }

  async getMedicalEvidence(input: string | MedicalEvidenceQuery): Promise<MedicalEvidenceBundle> {
    const query = typeof input === "string" ? { query: input, limit: this.defaultLimit } : { limit: this.defaultLimit, ...input };
    const embedding = query.embedding ?? (await this.embedQuery(query.query));
    const evidence = await this.store.search({
      ...query,
      embedding: embedding ?? undefined
    });
    return toBundle(
      {
        ...query,
        embedding: embedding ?? undefined
      },
      evidence
    );
  }

  async getCitations(input: string | MedicalEvidenceQuery) {
    const bundle = await this.getMedicalEvidence(input);
    return bundle.citations;
  }
}

export function createMedicalEvidenceEngine(options: MedicalEvidenceEngineOptions = {}): MedicalEvidenceEngine {
  return new MedicalEvidenceEngine(options);
}
