const stopWords = new Set([
  "the",
  "and",
  "for",
  "with",
  "that",
  "this",
  "from",
  "into",
  "about",
  "have",
  "has",
  "had",
  "are",
  "was",
  "were",
  "will",
  "can",
  "could",
  "would",
  "should",
  "your",
  "their",
  "patient",
  "plan",
  "treatment",
  "doctor",
  "after",
  "before",
  "within",
  "daily",
  "twice",
  "thrice",
  "once"
]);

export function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function tokenize(value: string): Set<string> {
  const normalized = normalizeText(value);
  if (!normalized) {
    return new Set<string>();
  }

  const parts = normalized.split(" ");
  const filtered = parts.filter((token) => token.length > 2 && !stopWords.has(token));
  return new Set(filtered);
}

export function jaccardSimilarity(aSet: Set<string>, bSet: Set<string>): number {
  if (aSet.size === 0 && bSet.size === 0) {
    return 1;
  }

  const intersectionCount = Array.from(aSet).filter((token) => bSet.has(token)).length;
  const unionCount = new Set([...aSet, ...bSet]).size;

  return unionCount === 0 ? 1 : intersectionCount / unionCount;
}

export function averagePairwiseSimilarity(values: string[]): number {
  if (values.length < 2) {
    return 1;
  }

  const tokenSets = values.map((item) => tokenize(item));
  let total = 0;
  let pairs = 0;

  for (let left = 0; left < tokenSets.length; left += 1) {
    for (let right = left + 1; right < tokenSets.length; right += 1) {
      total += jaccardSimilarity(tokenSets[left], tokenSets[right]);
      pairs += 1;
    }
  }

  return pairs === 0 ? 1 : total / pairs;
}

export function clamp01(value: number): number {
  if (value < 0) {
    return 0;
  }

  if (value > 1) {
    return 1;
  }

  return value;
}
