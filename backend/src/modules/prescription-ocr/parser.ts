import type { PrescriptionExtractionResult } from "./types";
import { splitLines, trimWhitespace } from "./preprocess";

const DOSAGE_PATTERNS = [
  /\b\d+(?:\.\d+)?\s?(?:mg|mcg|g|ml|iu|units?)\b/i,
  /\b\d+\s?(?:tab|tablet|tabs|tablets|cap|capsule|capsules|drop|drops|puff|puffs|sachet|sachets)\b/i,
  /\b(?:od|bd|bid|tid|qid|hs|qhs|prn|stat)\b/i,
  /\b(?:before meals|after meals|with food|without food|at night|daily|twice daily|three times daily)\b/i
];

const TEST_PATTERNS = [
  /\bcbc\b/i,
  /\bblood sugar\b/i,
  /\bhba1c\b/i,
  /\blipid(?: profile)?\b/i,
  /\blft\b/i,
  /\brft\b/i,
  /\bcreatinine\b/i,
  /\burea\b/i,
  /\becg\b/i,
  /\bekg\b/i,
  /\bmri\b/i,
  /\bct\b/i,
  /\bx-?ray\b/i,
  /\bultrasound\b/i,
  /\busg\b/i,
  /\burine\b/i,
  /\bculture\b/i,
  /\btsh\b/i,
  /\bt3\b/i,
  /\bt4\b/i
];

function uniqueOrdered(values: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const value of values) {
    const normalized = value.trim();
    if (!normalized) {
      continue;
    }

    const key = normalized.toLowerCase();
    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    result.push(normalized);
  }

  return result;
}

function extractMedicines(lines: string[]): string[] {
  const medicines: string[] = [];

  for (const line of lines) {
    const medicineMatches = [
      line.match(/(?:rx|medication|medicine|drug|tablet|tab|cap|capsule|syrup|injection)[:\-\s]+([A-Za-z][A-Za-z0-9+\-]*(?:\s+[A-Za-z][A-Za-z0-9+\-]*){0,2})/i),
      line.match(/([A-Za-z][A-Za-z0-9+\-]*(?:\s+[A-Za-z][A-Za-z0-9+\-]*){0,2})\s+\d+(?:\.\d+)?\s?(?:mg|mcg|g|ml|iu|units?|tab|tablet|cap|capsule)\b/i)
    ].filter(Boolean) as RegExpMatchArray[];

    for (const match of medicineMatches) {
      const candidate = trimWhitespace(match[1]).replace(/^[\W_]+|[\W_]+$/g, "");
      if (candidate.length >= 2) {
        medicines.push(candidate);
      }
    }
  }

  return uniqueOrdered(medicines);
}

function extractDosage(lines: string[]): string[] {
  const dosage: string[] = [];

  for (const line of lines) {
    if (DOSAGE_PATTERNS.some((pattern) => pattern.test(line))) {
      dosage.push(trimWhitespace(line));
      continue;
    }

    const dosageMatch = line.match(/([A-Za-z][A-Za-z0-9+\-]*(?:\s+[A-Za-z][A-Za-z0-9+\-]*){0,2}\s+\d+(?:\.\d+)?\s?(?:mg|mcg|g|ml|iu|units?)\b[^,;.]*)/i);
    if (dosageMatch) {
      dosage.push(trimWhitespace(dosageMatch[1]));
    }
  }

  return uniqueOrdered(dosage);
}

function extractTests(lines: string[]): string[] {
  const tests: string[] = [];

  for (const line of lines) {
    if (!TEST_PATTERNS.some((pattern) => pattern.test(line))) {
      continue;
    }

    tests.push(trimWhitespace(line));
  }

  return uniqueOrdered(tests);
}

function extractDoctorNotes(lines: string[], medicines: string[], dosage: string[], tests: string[]): string {
  const excludedTokens = [...medicines, ...dosage, ...tests]
    .flatMap((value) => value.toLowerCase().split(/\s+/))
    .filter((token) => token.length > 2);

  const notes = lines.filter((line) => {
    const lower = line.toLowerCase();
    return !excludedTokens.some((token) => lower.includes(token));
  });

  const result = notes.join(" ");
  return trimWhitespace(result);
}

export function parsePrescriptionText(rawText: string): PrescriptionExtractionResult {
  const normalized = trimWhitespace(rawText);
  const lines = splitLines(normalized);
  const medicines = extractMedicines(lines);
  const dosage = extractDosage(lines);
  const tests = extractTests(lines);
  const doctor_notes = extractDoctorNotes(lines, medicines, dosage, tests);

  return {
    medicines,
    dosage,
    tests,
    doctor_notes
  };
}

