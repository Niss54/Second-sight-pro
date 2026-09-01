import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { MedicalEvidenceHit, MedicalEvidenceQuery, MedicalEvidenceStore } from "./types";
import { clampScore, mergeAndRankHits } from "./scoring";

type EvidenceRow = {
  id: string;
  title: string;
  snippet: string;
  source: string;
  reference?: string | null;
  confidence?: number | null;
  metadata?: Record<string, unknown> | null;
  similarity?: number | null;
  keyword_score?: number | null;
  vector_score?: number | null;
};

export interface SupabaseMedicalEvidenceStoreOptions {
  supabaseUrl: string;
  serviceRoleKey: string;
  tableName?: string;
  matchFunctionName?: string;
  client?: SupabaseClient;
}

export class SupabaseMedicalEvidenceStore implements MedicalEvidenceStore {
  private readonly supabase: SupabaseClient;

  private readonly tableName: string;

  private readonly matchFunctionName: string;

  constructor(options: SupabaseMedicalEvidenceStoreOptions) {
    this.supabase =
      options.client ??
      createClient(options.supabaseUrl, options.serviceRoleKey, {
        auth: { persistSession: false, autoRefreshToken: false }
      });

    this.tableName = options.tableName ?? "medical_evidence";
    this.matchFunctionName = options.matchFunctionName ?? "search_medical_evidence";
  }

  async search(query: MedicalEvidenceQuery): Promise<MedicalEvidenceHit[]> {
    const rpcAttempt = await this.tryRpcSearch(query);
    if (rpcAttempt.length > 0) {
      return rpcAttempt.slice(0, query.limit ?? 5);
    }

    return this.keywordFallbackSearch(query);
  }

  private async tryRpcSearch(query: MedicalEvidenceQuery): Promise<MedicalEvidenceHit[]> {
    const { data, error } = await this.supabase.rpc(this.matchFunctionName, {
      query_text: query.query,
      query_embedding: query.embedding ?? null,
      match_count: query.limit ?? 5,
      disease_filter: query.disease ?? null,
      specialty_filter: query.specialty ?? null,
      urgency_filter: query.urgency ?? null,
      condition_filter: query.condition ?? null,
      sources_filter: query.sources ?? null
    });

    if (error || !Array.isArray(data)) {
      return [];
    }

    return data.map((row: EvidenceRow): MedicalEvidenceHit => ({
      id: row.id,
      title: row.title,
      snippet: row.snippet,
      source: row.source,
      reference: row.reference ?? undefined,
      confidence: clampScore(row.confidence ?? 0.7),
      metadata: this.normalizeMetadata(row.metadata),
      score: clampScore(row.similarity ?? row.keyword_score ?? row.vector_score ?? row.confidence ?? 0.7),
      matchedFields: ["vector"],
      vectorScore: row.vector_score ?? row.similarity ?? undefined,
      keywordScore: row.keyword_score ?? undefined
    }));
  }

  private async keywordFallbackSearch(query: MedicalEvidenceQuery): Promise<MedicalEvidenceHit[]> {
    let request = this.supabase.from(this.tableName).select("id,title,snippet,source,reference,confidence,metadata");

    if (query.disease) {
      request = request.ilike("metadata->>disease", `%${query.disease}%`);
    }

    if (query.specialty) {
      request = request.ilike("metadata->>specialty", `%${query.specialty}%`);
    }

    if (query.condition) {
      request = request.ilike("metadata->>condition", `%${query.condition}%`);
    }

    if (query.urgency) {
      request = request.filter("metadata->>urgency", "ilike", `%${query.urgency}%`);
    }

    const { data, error } = await request.limit(query.limit ?? 10);

    if (error || !data) {
      return [];
    }

    const results = data.map((row: EvidenceRow): MedicalEvidenceHit => {
      const keywordScore = clampScore(
        [row.title, row.snippet, row.reference ?? "", JSON.stringify(row.metadata ?? {})].join(" ").toLowerCase().includes(query.query.toLowerCase())
          ? 0.8
          : 0.45
      );

      return {
        id: row.id,
        title: row.title,
        snippet: row.snippet,
        source: row.source,
        reference: row.reference ?? undefined,
        confidence: clampScore(row.confidence ?? 0.7),
        metadata: this.normalizeMetadata(row.metadata),
        score: clampScore((row.confidence ?? 0.7) * 0.7 + keywordScore * 0.3),
        matchedFields: ["keyword"],
        vectorScore: undefined,
        keywordScore
      };
    });

    return mergeAndRankHits(results).slice(0, query.limit ?? 5);
  }

  private normalizeMetadata(metadata?: Record<string, unknown> | null): MedicalEvidenceHit["metadata"] {
    const safe = metadata ?? {};

    return {
      disease: typeof safe.disease === "string" ? safe.disease : undefined,
      specialty: typeof safe.specialty === "string" ? safe.specialty : undefined,
      urgency: typeof safe.urgency === "string" ? safe.urgency : undefined,
      condition: typeof safe.condition === "string" ? safe.condition : undefined,
      category: typeof safe.category === "string" ? safe.category : undefined
    };
  }
}
