# SecondSight Pro Architecture

SecondSight Pro is an evidence-grounded AI Medical Opinion Reconciliation Platform. It helps patients understand conflicting medical opinions without diagnosing, prescribing, or replacing licensed medical care.

## Target System

```mermaid
flowchart LR
  FE["React + Vite + TypeScript"] --> API["Express TypeScript API"]
  API --> AUTH["Supabase Auth"]
  API --> DB["Supabase Postgres + pgvector"]
  API --> STORAGE["Supabase Storage"]
  API --> OCR["OCR + Entity Extraction"]
  API --> RAG["Hybrid Retrieval Engine"]
  API --> LC["LangChain Grounding Chain"]
  API --> VOICE["LiveKit + Sarvam Voice"]
  RAG --> CORPUS["Trusted Medical Corpus"]
  LC --> LLM["OpenAI-compatible LLM"]
  CORPUS --> DB
```

## Request Flow

1. User uploads reports or enters doctor opinions.
2. OCR extracts text and medical entities from PDF/image files.
3. Existing conflict engine compares diagnoses, treatments, medications, tests, and urgency.
4. Hybrid RAG retrieves trusted evidence from the pre-indexed corpus.
5. LangChain injects evidence into a strict safety prompt.
6. API returns grounded findings, citations, explainability, multilingual summaries, and specialist questions.
7. Frontend renders the dashboard, report, and voice assistant.

## RAG Pipeline

```mermaid
flowchart TD
  CASE["Case + OCR Entities"] --> QUERY["Query Builder"]
  QUERY --> DENSE["Dense Vector Retrieval"]
  QUERY --> BM25["BM25 Keyword Retrieval"]
  DENSE --> FILTER["Metadata Filter"]
  BM25 --> FILTER
  FILTER --> RERANK["Lightweight Reranker"]
  RERANK --> CITE["Cited Evidence Context"]
  CITE --> CHAIN["Grounded LangChain Prompt"]
```

## Voice Flow

```mermaid
sequenceDiagram
  participant U as User
  participant FE as Frontend
  participant API as Backend
  participant LK as LiveKit
  participant S as Sarvam

  U->>FE: Speaks Hindi/Hinglish/English
  FE->>API: Request voice session
  API->>LK: Create room token
  FE->>LK: Join room
  FE->>S: Speech-to-text / text-to-speech
  FE->>API: Send transcript for grounded response
  API->>FE: Safe multilingual answer + citations
```

## Safety Boundary

The system is decision support only. All clinical explanations must be evidence-grounded, cite sources, and avoid diagnosis, prescription, or overriding clinician advice.
