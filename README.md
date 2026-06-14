# SecondSight Pro
### AI-Powered Medical Second Opinion Reconciliation Platform

> Built for [Hackathon Name] · Team: [Your Team Name]

---

## What Problem Does This Solve?

In India, patients frequently consult 2–5 doctors for serious diagnoses and receive **conflicting opinions** — different diagnoses, different drugs, different urgency levels. This confusion leads to:
- Delayed treatment while patients try to "figure out" which doctor is right
- Dangerous self-medication based on partial advice
- Missed emergencies when one doctor says "routine" and another says "urgent"

**SecondSight Pro** uses AI to instantly reconcile these conflicts, explain *why* doctors disagree, surface evidence from ICMR and WHO guidelines, and guide the patient to the right next step — in Hindi, English, or Hinglish.

---

## Live Demo Walkthrough (5 minutes)

1. **Patient View** → Go to `/case/new` → Click "Load Demo" to load an India-specific case (e.g., conflicting diabetes treatment, hypertension drug conflict, antibiotic prescribing conflict)
2. **Run Analysis** → See conflict score, disagreement reasons, RAG citations from ICMR 2022/WHO
3. **Voice Summary** → Click "Speak Summary" → Hear the analysis in Hindi via Sarvam TTS
4. **Speak in Hindi** → Click the mic button → Say your question in Hindi → Bhashini STT transcribes it
5. **Share** → Click "Share via WhatsApp" → See the formatted Hindi + English message ready to send to a family member
6. **Doctor View** → Click "Doctor View" in navbar → See the same cases sorted by conflict severity, highest priority first

---

## India-Specific Features (Hackathon Differentiators)

| Feature | Technology | Why It Matters |
|---------|-----------|---------------|
| Hindi/Bhojpuri voice input | **Bhashini STT** (Govt of India free API) | Rural patients cannot type in English |
| Indian-accent voice output | **Sarvam AI TTS** | Natural Hindi speech synthesis |
| ICMR clinical guidelines RAG | Custom corpus + pgvector | Citations from Indian Council of Medical Research 2022 |
| ABDM health ID support | ABHA ID field | Aligned with India's Ayushman Bharat Digital Mission |
| India-specific drug conflicts | WHO Essential Medicines + NHP India | ACE+ARB danger, Triple Whammy AKI, fluoroquinolone AMR |
| Hinglish multilingual output | Custom LLM prompt | How Indian patients actually speak |
| LLM failover (OpenAI → Groq) | FailoverLLM pattern | Demo never breaks during live presentation |

---

## Technical Architecture

```
Frontend (React + Vite + TypeScript)
│
├── /case/new     → Patient intake: add doctor opinions, run analysis
├── /dashboard    → Patient case history
├── /doctor       → Doctor review queue (sorted by conflict severity)
└── /chat         → Voice-first patient interface
    │
    └── Calls Backend API (Node.js + Express + TypeScript)
            │
            ├── POST /api/reconciliation/compare  → Opinion conflict scoring engine
            ├── POST /api/voice/summary           → LLM voice summary (Sarvam TTS)
            ├── POST /api/voice/followup          → Hindi follow-up Q&A
            ├── POST /api/voice/transcribe        → Bhashini STT (Hindi input)
            ├── POST /api/ocr/prescription        → Prescription image OCR (Tesseract)
            └── GET  /api/cases                   → Supabase case history
                    │
                    ├── Supabase (PostgreSQL + pgvector)
                    │   ├── cases table (patient cases + analysis)
                    │   └── medical_evidence table (RAG corpus, 6 guideline files)
                    │
                    ├── OpenAI (GPT-4.1-mini) → LLM text generation
                    ├── Groq (Llama-3.1) → LLM fallback if OpenAI fails
                    ├── Sarvam AI → Indian-accent TTS
                    └── Bhashini (Govt of India) → Hindi/regional language STT
```

## RAG Corpus (Medical Knowledge Base)

The system retrieves evidence from these files (embedded via `npm run ingest`):

| File | Source | Key Coverage |
|------|--------|-------------|
| ICMR_Type2_Diabetes_Guidelines.txt | ICMR 2022 | HbA1c targets, Metformin dosing, India-specific drug conflicts |
| ICMR_Hypertension_India_2023.txt | ICMR 2023 | BP targets, India-first antihypertensives, resistant HTN |
| WHO_Essential_Medicines_Drug_Interactions.txt | WHO 2021 | ACE+ARB danger, Triple Whammy AKI, statin+macrolide |
| WHO_Antibiotic_Stewardship_Guidelines.txt | WHO AWaRe | AMR in India, first-line antibiotics, Watch/Reserve list |
| NHP_India_Preventive_Health_Guidelines.txt | NHP India | Indian BMI cutoffs, CVD risk, thyroid screening |
| WHO_Hypertension_Guideline.txt | WHO 2021 | BP thresholds, pharmacological choices |

---

## Setup Instructions

### Prerequisites
- Node.js 18+
- Supabase account (free tier works)
- OpenAI API key OR Groq API key (free)

### Backend

```bash
cd backend
cp .env.example .env
# Fill in your API keys in .env
npm install
npm run dev         # Start backend on port 8080
npm run ingest      # Embed medical corpus into Supabase (run once)
```

### Frontend

```bash
cd frontend
npm install
npm run dev         # Start frontend on port 5173
```

### Key Environment Variables (`backend/.env`)

```
OPENAI_API_KEY=sk-...          # Primary LLM
GROQ_API_KEY=gsk_...           # Fallback LLM (free at console.groq.com)
SARVAM_API_KEY=...             # Hindi TTS (sarvam.ai)
BHASHINI_USER_ID=...           # Hindi STT (free at ulca.gov.in)
BHASHINI_API_KEY=...           # Hindi STT
SUPABASE_URL=https://...       # Database
SUPABASE_SERVICE_ROLE_KEY=...  # Database auth
```

---

## Team

- [Team Member 1] — Backend, RAG pipeline, Bhashini STT integration
- [Team Member 2] — Frontend, Doctor View dashboard, UI
- [Team Member 3] — Demo cases, medical content, presentation

---

## Acknowledgements

- [ICMR](https://icmr.gov.in) for publicly available clinical practice guidelines
- [Bhashini / ULCA](https://bhashini.gov.in) — Government of India free multilingual AI
- [Sarvam AI](https://sarvam.ai) — Indian language TTS
- [WHO](https://who.int) — Essential Medicines and AWaRe antibiotic classification
- [NHP India](https://nhp.gov.in) — National Health Portal preventive health guidelines
