const TOKEN_PATTERN = /[a-z0-9]+/gi;

export function normalizeText(value: string): string {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

export function tokenize(value: string): string[] {
  return normalizeText(value).match(TOKEN_PATTERN) ?? [];
}

export function scoreTextOverlap(query: string, candidate: string): number {
  const queryTokens = new Set(tokenize(query));
  const candidateTokens = new Set(tokenize(candidate));

  if (queryTokens.size === 0 || candidateTokens.size === 0) {
    return 0;
  }

  let matches = 0;
  queryTokens.forEach((token) => {
    if (candidateTokens.has(token)) {
      matches += 1;
    }
  });

  return matches / queryTokens.size;
}

export function clampScore(score: number): number {
  if (Number.isNaN(score) || !Number.isFinite(score)) {
    return 0;
  }

  return Math.max(0, Math.min(1, score));
}

export function mergeAndRankHits<T extends { id: string; score: number }>(hits: T[]): T[] {
  const seen = new Map<string, T>();

  for (const hit of hits) {
    const existing = seen.get(hit.id);

    if (!existing || hit.score > existing.score) {
      seen.set(hit.id, hit);
    }
  }

  return [...seen.values()].sort((a, b) => b.score - a.score);
}

