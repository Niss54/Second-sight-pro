import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";
import { env } from "../src/config/env";

const supabaseUrl = env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabase = createClient(supabaseUrl!, env.SUPABASE_SERVICE_ROLE_KEY!);
const openai = env.OPENAI_API_KEY ? new OpenAI({ apiKey: env.OPENAI_API_KEY, baseURL: env.OPENAI_BASE_URL }) : null;

const CORPUS_DIR = path.resolve(__dirname, "../data/corpus");

async function embedText(text: string): Promise<number[]> {
  if (!openai) {
    // Mock embeddings for demonstration if no API key is provided
    return Array.from({ length: 1536 }, () => (Math.random() * 2 - 1) * 0.1);
  }
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text
  });
  return response.data[0].embedding;
}

async function ingestFile(filePath: string) {
  const ext = path.extname(filePath).toLowerCase();
  const filename = path.basename(filePath);
  console.log(`Processing ${filename}...`);

  let text = "";
  if (ext === ".pdf") {
    const dataBuffer = fs.readFileSync(filePath);
    const pdfParseModule = await import("pdf-parse");
    const pdfParse = pdfParseModule as unknown as (data: Buffer) => Promise<{ text: string }>;
    const pdfData = await pdfParse(dataBuffer);
    text = pdfData.text;
  } else if (ext === ".txt") {
    text = fs.readFileSync(filePath, "utf-8");
  } else {
    console.log(`Skipping unsupported file type: ${filename}`);
    return;
  }

  // Clean text slightly
  text = text.replace(/\s+/g, " ").trim();

  // Custom text splitter
  function splitText(txt: string, chunkSize: number, chunkOverlap: number): string[] {
    const words = txt.split(" ");
    const resultChunks = [];
    let currentChunk = [];
    let currentLength = 0;

    for (const word of words) {
      if (currentLength + word.length > chunkSize && currentChunk.length > 0) {
        resultChunks.push(currentChunk.join(" "));
        let overlapLength = 0;
        let overlapChunk = [];
        for (let i = currentChunk.length - 1; i >= 0; i--) {
          overlapLength += currentChunk[i].length + 1;
          if (overlapLength > chunkOverlap) break;
          overlapChunk.unshift(currentChunk[i]);
        }
        currentChunk = overlapChunk;
        currentLength = currentChunk.join(" ").length;
      }
      currentChunk.push(word);
      currentLength += word.length + 1;
    }
    if (currentChunk.length > 0) {
      resultChunks.push(currentChunk.join(" "));
    }
    return resultChunks;
  }

  const chunks = splitText(text, 1000, 200);
  console.log(`Split ${filename} into ${chunks.length} chunks. Generating embeddings...`);

  const rowsToInsert = [];
  
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const embedding = await embedText(chunk);

    rowsToInsert.push({
      title: filename,
      snippet: chunk,
      source: "RAG Ingestor",
      reference: `${filename}#chunk=${i + 1}`,
      confidence: 0.95, // Automated ingestion from trusted corpus
      metadata: { chunkIndex: i, totalChunks: chunks.length },
      embedding
    });
  }

  // Bulk insert into Supabase
  const { error } = await supabase
    .from(env.MEDICAL_EVIDENCE_TABLE || "medical_evidence")
    .insert(rowsToInsert);

  if (error) {
    console.error(`Failed to insert chunks for ${filename}:`, error.message);
  } else {
    console.log(`Successfully ingested ${filename} (${chunks.length} chunks).`);
  }
}

async function main() {
  console.log("Starting RAG Corpus Ingestion...");
  
  if (!fs.existsSync(CORPUS_DIR)) {
    console.log(`Creating corpus directory at ${CORPUS_DIR}. Please place PDFs there and re-run.`);
    fs.mkdirSync(CORPUS_DIR, { recursive: true });
    return;
  }

  const files = fs.readdirSync(CORPUS_DIR);
  const targetFiles = files.filter(f => f.endsWith(".pdf") || f.endsWith(".txt"));

  if (targetFiles.length === 0) {
    console.log("No .pdf or .txt files found in data/corpus. Place some files there and try again.");
    return;
  }

  for (const file of targetFiles) {
    const filePath = path.join(CORPUS_DIR, file);
    await ingestFile(filePath);
  }

  console.log("Ingestion Pipeline Complete!");
}

main().catch(err => {
  console.error("Ingestion failed:", err);
  process.exit(1);
});
