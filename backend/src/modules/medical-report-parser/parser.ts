import type { MedicalReportExtractionResult } from "./types";
import { normalizeText, splitLines } from "./preprocess";

const SECTION_STOP_WORDS = [
  "medicines",
  "medication",
  "prescription",
  "rx",
  "test",
  "tests",
  "investigation",
  "investigations",
  "observations",
  "observation",
  "findings",
  "result",
  "results",
  "recommendation",
  "recommendations",
  "follow up",
  "follow-up"
];

const REPORT_TYPE_RULES: Array<{ type: string; patterns: RegExp[] }> = [
  { type: "discharge_summary", patterns: [/discharge summary/i, /discharge/i, /summary of care/i] },
  { type: "radiology_report", patterns: [/radiology/i, /\bx-?ray\b/i, /\bct\b/i, /\bmri\b/i, /\bultrasound\b/i, /\bscan\b/i] },
  { type: "pathology_report", patterns: [/pathology/i, /histopathology/i, /biopsy/i, /cytology/i] },
  { type: "lab_report", patterns: [/lab report/i, /\bcbc\b/i, /\bhba1c\b/i, /\blipid\b/i, /\bcreatinine\b/i, /\btsh\b/i] },
  { type: "prescription", patterns: [/prescription/i, /\brx\b/i, /\btablet\b/i, /\bcap(sule)?\b/i, /\bsyrup\b/i] },
  { type: "consultation_note", patterns: [/consultation/i, /assessment/i, /clinical note/i, /opinion/i] }
];

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

const DIAGNOSIS_HEADINGS = ["diagnosis", "final diagnosis", "impression", "assessment", "conclusion", "working diagnosis", "provisional diagnosis"];
const OBSERVATION_HEADINGS = ["observation", "observations", "findings", "remarks", "notes", "clinical findings", "recommendation", "recommendations", "result", "results"];

function uniqueOrdered(values: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const value of values) {
    const normalized = value.trim().replace(/\s+/g, " ");
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

function isHeadingLine(line: string): boolean {
  const lower = line.toLowerCase();
  return (
    DIAGNOSIS_HEADINGS.some((heading) => lower.startsWith(heading)) ||
    OBSERVATION_HEADINGS.some((heading) => lower.startsWith(heading)) ||
    SECTION_STOP_WORDS.some((word) => lower.startsWith(word))
  );
}

function getReportType(text: string, lines: string[]): string {
  const joined = `${text}\n${lines.join("\n")}`;

  for (const rule of REPORT_TYPE_RULES) {
    if (rule.patterns.some((pattern) => pattern.test(joined))) {
      return rule.type;
    }
  }

  return "medical_report";
}

function captureAfterHeading(lines: string[], headings: string[], maxLines = 3): string {
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const lower = line.toLowerCase();
    const match = headings.find((heading) => lower.startsWith(heading));

    if (!match) {
      continue;
    }

    const afterColon = line.split(/[:\-]/, 2)[1]?.trim();
    const collected: string[] = [];

    if (afterColon) {
      collected.push(afterColon);
    }

    let cursor = index + 1;
    while (cursor < lines.length && collected.length < maxLines) {
      const nextLine = lines[cursor];
      if (isHeadingLine(nextLine)) {
        break;
      }

      collected.push(nextLine);
      cursor += 1;
    }

    return normalizeText(collected.join(" "));
  }

  return "";
}

function extractDiagnosis(lines: string[]): string {
  const headingText = captureAfterHeading(lines, DIAGNOSIS_HEADINGS, 4);
  if (headingText) {
    return headingText;
  }

  const candidateLines = lines.filter((line) => /diagnos|impression|assessment|conclusion/i.test(line));
  return normalizeText(candidateLines.join(" "));
}

function extractMedicines(lines: string[]): string[] {
  const medicines: string[] = [];

  for (const line of lines) {
    if (!/\b(medication|medicine|prescription|rx|tab|tablet|cap|capsule|syrup|injection|ointment|drop|drops)\b/i.test(line) && !DOSAGE_PATTERNS.some((pattern) => pattern.test(line))) {
      continue;
    }

    const rxMatch = line.match(/(?:rx|medication|medicine|drug|tablet|tab|cap|capsule|syrup|injection)[:\-\s]+([A-Za-z][A-Za-z0-9+\-]*(?:\s+[A-Za-z][A-Za-z0-9+\-]*){0,3})/i);
    if (rxMatch?.[1]) {
      medicines.push(rxMatch[1].trim());
      continue;
    }

    const dosageMatch = line.match(/([A-Za-z][A-Za-z0-9+\-]*(?:\s+[A-Za-z][A-Za-z0-9+\-]*){0,3})\s+\d+(?:\.\d+)?\s?(?:mg|mcg|g|ml|iu|units?|tab|tablet|cap|capsule)\b/i);
    if (dosageMatch?.[1]) {
      medicines.push(dosageMatch[1].trim());
    }
  }

  return uniqueOrdered(medicines);
}

function extractTests(lines: string[]): string[] {
  const tests: string[] = [];

  for (const line of lines) {
    if (TEST_PATTERNS.some((pattern) => pattern.test(line))) {
      tests.push(line);
      continue;
    }

    if (/\btest(s)?\b/i.test(line) || /\binvestigation(s)?\b/i.test(line)) {
      tests.push(line);
    }
  }

  return uniqueOrdered(tests);
}

function extractObservations(lines: string[]): string[] {
  const observations: string[] = [];
  const sectionText = captureAfterHeading(lines, OBSERVATION_HEADINGS, 5);
  if (sectionText) {
    observations.push(sectionText);
  }

  for (const line of lines) {
    if (TEST_PATTERNS.some((pattern) => pattern.test(line))) {
      observations.push(line);
      continue;
    }

    if (/\b(?:normal|abnormal|mild|moderate|severe|elevated|reduced|positive|negative|recommend|follow up|follow-up)\b/i.test(line)) {
      observations.push(line);
    }
  }

  return uniqueOrdered(observations);
}

export function parseMedicalReport(rawText: string): MedicalReportExtractionResult {
  const normalized = normalizeText(rawText);
  const lines = splitLines(normalized);

  return {
    report_type: getReportType(normalized, lines),
    diagnosis: extractDiagnosis(lines),
    medicines: extractMedicines(lines),
    tests: extractTests(lines),
    observations: extractObservations(lines)
  };
}

