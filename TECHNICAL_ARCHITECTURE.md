# SecondSight Pro Technical Architecture

## 1. System Overview

SecondSight Pro is an evidence-grounded Medical Opinion Reconciliation Platform. It helps patients understand why multiple doctors may disagree, what evidence supports each view, and what questions to ask next. It is a decision-support system only. It does not diagnose, prescribe, or replace licensed medical care.

The product is designed to turn fragmented second opinions into a clear, cited, multilingual reconciliation flow:

`Upload case -> OCR -> structured extraction -> hybrid evidence retrieval -> grounded analysis -> explainability -> multilingual summary -> voice explanation -> specialist report`

## 2. Recommended Tech Stack

### Frontend

- React
  - Best fit for a multi-step medical workflow with reusable panels, stateful forms, and dashboard views.
  - Mature ecosystem and easy integration with charts, uploads, motion, and design systems.
- Vite
  - Fast local development and simple production builds.
  - Keeps the UI iteration loop short for demo-heavy product work.
- TypeScript
  - Reduces mistakes in complex medical data flows and typed API contracts.
  - Useful for shared models between frontend and backend.
- Tailwind CSS
  - Fast way to produce a premium, consistent UI without a heavy styling runtime.
  - Works well with responsive medical SaaS layouts.
- shadcn/ui-style primitives
  - Gives accessible, composable base components without locking the app into a large opinionated system.
  - Good for forms, dialogs, tabs, dropdowns, and empty states.
- Framer Motion
  - Best for subtle, premium motion on page transitions, panels, and progressive disclosure.
  - Helps the app feel polished without becoming noisy.
- Recharts
  - Good fit for explainability charts and score breakdowns.
  - Light enough for a dashboard-style product.

### Backend

- Express + TypeScript
  - The current backend already uses this stack, so it is the lowest-risk path.
  - Easy to keep route shape stable while adding new modules.
- Supabase
  - Managed Postgres, auth, storage, and RLS in one place.
  - Best fit for a hackathon MVP that still needs real security boundaries.
- pgvector
  - Enables semantic retrieval over a trusted medical corpus.
  - Keeps evidence search inside the database instead of requiring a separate vector store.
- LangChain
  - Handles retrieval orchestration, prompt chaining, structured outputs, and grounding guardrails.
  - Useful without needing a full agent framework.
- OCR stack
  - `multer` for uploads, `pdf-parse` for text PDFs, `tesseract.js` for scanned images and low-quality documents.
- LiveKit
  - Real-time voice session and streaming plumbing.
  - Best fit for a premium spoken experience.
- Sarvam AI
  - Multilingual speech-to-text and text-to-speech, especially strong for Hindi and Indian accent support.
- OpenAI-compatible LLM
  - Used for grounded summaries and specialist question generation, but only after retrieval and safety filtering.

### Why This Stack Works

- It preserves the current architecture instead of replacing it.
- It gives the product a real production path: auth, storage, RLS, uploads, and evidence retrieval all live in a managed stack.
- It supports the hackathon goal: something that looks and feels impressive while staying medically cautious.
- It keeps the app demoable even when optional services are unavailable by allowing safe fallbacks.

## 3. Current Repository Structure

```text
NW1/
  backend/
    medical-corpus/
      disease_guidelines/
      treatment_guidelines/
      medication_conflicts/
      diagnostic_tests/
      emergency_flags/
    src/
      config/
      integrations/
      middleware/
      repositories/
      routes/
      scripts/
      services/
      store/
      types/
      utils/
      server.ts
    data/
    .env.example
    package.json
    tsconfig.json
  docs/
    api-contracts.md
    db-schema.sql
    folder-structure.md
    implementation-roadmap.md
    migration-plan.md
    phased-checklist.md
    prompt-specification.md
    ui-wireframes.md
  frontend/
    src/
      components/
      constants/
      lib/
      pages/
      services/
      utils/
      App.tsx
      main.tsx
      types.ts
    public/
    .env.example
    package.json
    vite.config.ts
  architecture.md
  PRD.md
  README.md
  TODO.md
  todo2.md
  package.json
```

## 4. Runtime Architecture

### Request Lifecycle

1. User submits a case manually or uploads a document.
2. Backend stores the file in Supabase Storage and extracts text through OCR.
3. The extraction service normalizes entities such as diagnosis, medications, urgency, and tests.
4. The conflict engine compares multiple opinions and computes disagreement signals.
5. The retrieval service searches the pre-indexed trusted corpus using:
   - dense semantic retrieval
   - keyword/BM25-style matching
   - metadata filtering
   - lightweight reranking
6. LangChain assembles grounded context and asks the LLM for a structured output.
7. The safety layer prevents diagnosis-like or prescription-like language.
8. The API returns citations, explainability, multilingual summaries, and specialist questions.
9. The frontend renders the dashboard and report surfaces, and optionally hands the user into voice mode.

### Core Services

- Conflict engine
  - Uses the current heuristic comparison logic for diagnosis, treatment, medication, tests, and urgency.
- Retrieval engine
  - Pulls evidence from the curated corpus and ranks the best support snippets.
- Analysis pipeline
  - Orchestrates conflict engine, retrieval, LLM, multilingual formatting, and report assembly.
- OCR pipeline
  - Extracts text from scanned prescriptions and diagnostic documents.
- Voice pipeline
  - Uses LiveKit for session transport and Sarvam for speech and multilingual interaction.

## 5. Database Schema

The platform uses Supabase Postgres with `vector` enabled. The database is organized around user-owned cases, uploaded documents, generated analyses, voice sessions, and a trusted evidence corpus.

### `users`

Purpose: profile record linked to Supabase Auth.

Fields:
- `id`: references `auth.users(id)`, primary key
- `email`: user email
- `full_name`: display name
- `created_at`: creation timestamp

Plain English:
This table stores the app profile for each authenticated user.

### `medical_cases`

Purpose: one patient case or episode of conflicting opinions.

Fields:
- `id`: UUID primary key
- `owner_id`: user who owns the case
- `case_label`: optional friendly name
- `primary_condition`: the main health concern
- `patient_age`: optional age
- `language`: default language for outputs
- `comorbidities`: JSON array
- `symptoms`: JSON array
- `created_at`: timestamp
- `updated_at`: timestamp

Plain English:
Each row is a case that groups multiple opinions, uploads, and analyses together.

Relationships:
- one `medical_cases` row belongs to one `users` row
- one `medical_case` can have many `doctor_opinions`, `uploaded_files`, `analysis_results`, and `voice_sessions`

### `doctor_opinions`

Purpose: each doctor’s opinion inside a case.

Fields:
- `id`: UUID primary key
- `case_id`: parent case
- `owner_id`: case owner
- `doctor_name`: doctor label
- `specialty`: specialty
- `urgency`: urgency level
- `diagnosis`: diagnosis or differential diagnosis
- `treatment`: proposed treatment plan
- `prescriptions`: JSON array of prescriptions
- `tests`: JSON array of recommended tests
- `notes`: optional notes
- `created_at`: timestamp

Plain English:
This table stores the raw opinions that the platform compares against each other.

### `uploaded_files`

Purpose: uploaded PDF/image/scanned documents.

Fields:
- `id`: UUID primary key
- `owner_id`: file owner
- `case_id`: optional linked case
- `storage_path`: file path in Supabase Storage
- `file_name`: original filename
- `mime_type`: file MIME type
- `ocr_status`: pending, processed, or failed
- `ocr_confidence`: OCR confidence score
- `extracted_json`: extracted structured payload
- `created_at`: timestamp

Plain English:
This table tracks uploads, OCR state, and the structured result of extraction.

### `analysis_results`

Purpose: stored results of each analysis run.

Fields:
- `id`: UUID primary key
- `owner_id`: user who ran analysis
- `case_id`: related case
- `final_score`: final reconciliation score
- `risk_tier`: low, moderate, or high
- `findings`: JSON array of findings
- `citations`: JSON array of evidence citations
- `multilingual_summaries`: JSON object keyed by language
- `report_json`: full specialist report payload
- `created_at`: timestamp

Plain English:
This table stores the analysis output that the frontend displays and reports on.

### `voice_sessions`

Purpose: voice assistant sessions tied to a case.

Fields:
- `id`: UUID primary key
- `owner_id`: user who started the session
- `case_id`: optional related case
- `language`: session language
- `livekit_room`: room identifier
- `transcript`: JSON transcript array
- `created_at`: timestamp

Plain English:
This table stores the voice interaction session metadata and transcript trail.

### `medical_evidence`

Purpose: trusted pre-indexed medical corpus.

Fields:
- `id`: UUID primary key
- `title`: evidence title
- `source`: WHO, NIH, PubMed, Mayo Clinic, MedlinePlus, etc.
- `source_url`: reference URL or citation reference
- `corpus_category`: disease_guidelines, treatment_guidelines, medication_conflicts, diagnostic_tests, emergency_flags
- `disease`: related disease name
- `specialty`: specialty tag
- `urgency`: urgency tag
- `condition`: condition tag
- `confidence`: corpus confidence score
- `content`: chunk text
- `metadata`: JSON metadata
- `embedding`: pgvector embedding
- `created_at`: timestamp

Plain English:
This is the evidence layer used to ground the LLM and support citations.

## 6. Relationships in Plain English

- One user can own many cases.
- One case can contain many doctor opinions.
- One case can have many uploaded files.
- One case can produce many analysis results over time.
- One case can have many voice sessions.
- The evidence corpus is read-only for authenticated users and does not belong to a single case.

## 7. Environment Variables and Configuration

### Backend

- `NODE_ENV`
  - `development`, `test`, or `production`
- `PORT`
  - Backend port, usually `8080`
- `FRONTEND_ORIGIN`
  - Allowed frontend origin(s), comma-separated if needed
- `SUPABASE_URL`
  - Supabase project URL
- `SUPABASE_ANON_KEY`
  - Public auth client key
- `SUPABASE_SERVICE_ROLE_KEY`
  - Server-side admin key for secure operations
- `SUPABASE_BUCKET_UPLOADS`
  - Upload bucket name, recommended `case-uploads`
- `ENABLE_LLM`
  - `true` or `false`
- `OPENAI_API_KEY`
  - API key for OpenAI-compatible generation
- `OPENAI_MODEL`
  - Model name, for example `gpt-4.1-mini`
- `OPENAI_BASE_URL`
  - Optional custom base URL
- `LIVEKIT_API_KEY`
  - LiveKit API key
- `LIVEKIT_API_SECRET`
  - LiveKit API secret
- `LIVEKIT_URL`
  - LiveKit server URL
- `SARVAM_API_KEY`
  - Sarvam service key
- `OCR_PROVIDER`
  - Optional OCR provider selector, if swapped later

### Frontend

- `VITE_API_BASE_URL`
  - Backend API base URL, usually `http://localhost:8080/api`
- `VITE_SUPABASE_URL`
  - Supabase URL if frontend auth is enabled
- `VITE_SUPABASE_ANON_KEY`
  - Supabase anonymous key
- `VITE_LIVEKIT_URL`
  - LiveKit URL for voice mode

### Configuration Notes

- Keep secrets in environment variables only.
- The medical corpus must be seeded before retrieval-based features are demoed.
- If Supabase or voice provider keys are missing, the app should fall back to text-only or local demo behavior.
- Preserve strict safety prompts even in demo mode.
- For production, use HTTPS, secure cookies or auth tokens, and RLS on every user-owned table.

## 8. Deployment Model

- Frontend: Vercel
- Backend: Railway or Render
- Database/Auth/Storage: Supabase

Recommended deployment split:
- Frontend speaks to backend via `VITE_API_BASE_URL`.
- Backend connects to Supabase using server-side secrets.
- Uploaded files go to Supabase Storage.
- Evidence corpus is loaded into `medical_evidence` with embeddings.

## 9. Explicit Non-Goals for Version One

- Diagnosing disease
- Replacing doctors
- Prescribing medicines
- Enterprise RBAC
- Clinician collaboration workflow
- FHIR integration
- Insurance or billing flows
- Full EHR replacement

## 10. Summary

SecondSight Pro should stay small enough to ship, but strong enough to impress. The right architecture is:
- React + Vite + TypeScript for the product surface
- Express TypeScript for the API
- Supabase for auth, Postgres, vector search, and storage
- LangChain for grounded generation
- OCR for upload understanding
- LiveKit + Sarvam for multilingual voice

That combination gives the app a credible, production-shaped path without overbuilding the first version.
