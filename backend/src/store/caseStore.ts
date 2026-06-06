import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { ReconciliationOutput, PatientCaseInput, StoredCase } from "../types/domain";

interface DbShape {
  cases: StoredCase[];
}

const DB_FILE = path.resolve(process.cwd(), "data", "cases.json");

async function ensureDb(): Promise<void> {
  const dir = path.dirname(DB_FILE);
  await fs.mkdir(dir, { recursive: true });

  try {
    await fs.access(DB_FILE);
  } catch {
    const initial: DbShape = { cases: [] };
    await fs.writeFile(DB_FILE, JSON.stringify(initial, null, 2), "utf-8");
  }
}

async function readDb(): Promise<DbShape> {
  await ensureDb();
  const raw = await fs.readFile(DB_FILE, "utf-8");

  try {
    const parsed = JSON.parse(raw) as DbShape;
    return {
      cases: Array.isArray(parsed.cases) ? parsed.cases : []
    };
  } catch {
    return { cases: [] };
  }
}

async function writeDb(payload: DbShape): Promise<void> {
  await ensureDb();
  await fs.writeFile(DB_FILE, JSON.stringify(payload, null, 2), "utf-8");
}

export async function listCases(): Promise<StoredCase[]> {
  const db = await readDb();
  return db.cases.sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
}

export async function findCaseById(id: string): Promise<StoredCase | undefined> {
  const db = await readDb();
  return db.cases.find((entry) => entry.id === id);
}

export async function createCase(
  input: PatientCaseInput,
  analysis: ReconciliationOutput
): Promise<StoredCase> {
  const db = await readDb();
  const now = new Date().toISOString();

  const newEntry: StoredCase = {
    id: randomUUID(),
    createdAt: now,
    updatedAt: now,
    input,
    analysis
  };

  db.cases.push(newEntry);
  await writeDb(db);
  return newEntry;
}

export async function updateCase(
  id: string,
  input: PatientCaseInput,
  analysis: ReconciliationOutput
): Promise<StoredCase | null> {
  const db = await readDb();
  const index = db.cases.findIndex((entry) => entry.id === id);

  if (index === -1) {
    return null;
  }

  const existing = db.cases[index];

  const updated: StoredCase = {
    ...existing,
    input,
    analysis,
    updatedAt: new Date().toISOString()
  };

  db.cases[index] = updated;
  await writeDb(db);
  return updated;
}

export async function deleteCase(id: string): Promise<boolean> {
  const db = await readDb();
  const remaining = db.cases.filter((entry) => entry.id !== id);

  if (remaining.length === db.cases.length) {
    return false;
  }

  await writeDb({ cases: remaining });
  return true;
}
