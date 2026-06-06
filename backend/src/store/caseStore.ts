import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { ReconciliationOutput, PatientCaseInput, StoredCase } from "../types/domain";
import { env } from "../config/env";

const DB_FILE = path.resolve(process.cwd(), "data", "cases.json");

const useSupabase = Boolean(env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY);
const supabase = useSupabase
  ? createClient(env.SUPABASE_URL!, env.SUPABASE_SERVICE_ROLE_KEY!)
  : null;

interface DbShape {
  cases: StoredCase[];
}

// Local JSON Fallback Logic
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
  try {
    const raw = await fs.readFile(DB_FILE, "utf-8");
    const parsed = JSON.parse(raw) as DbShape;
    return { cases: Array.isArray(parsed.cases) ? parsed.cases : [] };
  } catch {
    return { cases: [] };
  }
}

async function writeDb(payload: DbShape): Promise<void> {
  await ensureDb();
  await fs.writeFile(DB_FILE, JSON.stringify(payload, null, 2), "utf-8");
}

export async function listCases(): Promise<StoredCase[]> {
  if (useSupabase && supabase) {
    const { data, error } = await supabase
      .from("cases")
      .select("*")
      .order("updatedAt", { ascending: false });
    
    if (error) {
      console.error("Supabase listCases error:", error);
      return [];
    }
    return data as StoredCase[];
  }

  const db = await readDb();
  return db.cases.sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
}

export async function findCaseById(id: string): Promise<StoredCase | undefined> {
  if (useSupabase && supabase) {
    const { data, error } = await supabase
      .from("cases")
      .select("*")
      .eq("id", id)
      .single();
      
    if (error) {
      console.error("Supabase findCaseById error:", error);
      return undefined;
    }
    return data as StoredCase;
  }

  const db = await readDb();
  return db.cases.find((entry) => entry.id === id);
}

export async function createCase(
  input: PatientCaseInput,
  analysis: ReconciliationOutput
): Promise<StoredCase> {
  const now = new Date().toISOString();
  const newEntry: StoredCase = {
    id: randomUUID(),
    createdAt: now,
    updatedAt: now,
    input,
    analysis
  };

  if (useSupabase && supabase) {
    const { error } = await supabase.from("cases").insert(newEntry);
    if (error) {
      console.error("Supabase createCase error:", error);
    }
    return newEntry;
  }

  const db = await readDb();
  db.cases.push(newEntry);
  await writeDb(db);
  return newEntry;
}

export async function updateCase(
  id: string,
  input: PatientCaseInput,
  analysis: ReconciliationOutput
): Promise<StoredCase | null> {
  const updatedAt = new Date().toISOString();
  
  if (useSupabase && supabase) {
    const { data, error } = await supabase
      .from("cases")
      .update({ input, analysis, updatedAt })
      .eq("id", id)
      .select()
      .single();
      
    if (error) {
      console.error("Supabase updateCase error:", error);
      return null;
    }
    return data as StoredCase;
  }

  const db = await readDb();
  const index = db.cases.findIndex((entry) => entry.id === id);
  if (index === -1) return null;

  const updated: StoredCase = { ...db.cases[index], input, analysis, updatedAt };
  db.cases[index] = updated;
  await writeDb(db);
  return updated;
}

export async function deleteCase(id: string): Promise<boolean> {
  if (useSupabase && supabase) {
    const { error } = await supabase.from("cases").delete().eq("id", id);
    if (error) {
      console.error("Supabase deleteCase error:", error);
      return false;
    }
    return true;
  }

  const db = await readDb();
  const remaining = db.cases.filter((entry) => entry.id !== id);
  if (remaining.length === db.cases.length) return false;

  await writeDb({ cases: remaining });
  return true;
}
