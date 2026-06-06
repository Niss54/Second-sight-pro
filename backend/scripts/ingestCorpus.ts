import fs from "fs";
import path from "path";
import pdfParse from "pdf-parse";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";
import { env } from "../src/config/env";

const supabase = createClient(env.SUPABASE_URL!, env.SUPABASE_SERVICE_ROLE_KEY!);
const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY, baseURL: env.OPENAI_BASE_URL });

const CORPUS_DIR = path.resolve(__dirname, "../data/corpus");

async function embedText(text: string): Promise<number[]> {
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

  // Split into chunks
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  const chunks = await splitter.createDocuments([text]);
  console.log(`Split ${filename} into ${chunks.length} chunks. Generating embeddings...`);

  const rowsToInsert = [];
  
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i].pageContent;
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
