# 🩺 SecondSight Pro
### AI-Powered Medical Second Opinion Reconciliation Platform

>  Team: SecondSight

[![License: MIT](https://img.shields.io/badge/License-MIT-teal.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue.svg)](https://typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-pgvector-orange.svg)](https://supabase.com)

---

##  The Problem

In India, patients frequently consult 2–5 doctors for serious diagnoses and receive **conflicting opinions** — different diagnoses, different drugs, different urgency levels. This confusion leads to:

-  **Delayed treatment** while patients try to "figure out" which doctor is right
-  **Dangerous self-medication** based on partial advice
-  **Missed emergencies** when one doctor says "routine" and another says "urgent"
-  **Language barriers** — rural patients can't read English reports or type queries

**SecondSight Pro** uses AI to instantly reconcile these conflicts, explain *why* doctors disagree, surface evidence from ICMR and WHO guidelines, and guide the patient to the right next step — in Hindi, English, or Hinglish.

---

## Live Demo Walkthrough (5 minutes)

1. **Patient View** → Go to `/case/new` → Click "Load Demo" to cycle through India-specific cases (diabetes, hypertension, UTI, breast lesion)
2. **Run Analysis** → See conflict score, disagreement reasons, RAG citations from ICMR 2022/WHO
3. **AI Chat** → Go to `/chat` → Ask medical questions in Hindi or English → Get evidence-backed AI responses with citations
4. **Voice Input** → Click the 🎤 mic button → Speak in Hindi → Bhashini STT transcribes → AI responds
5. **Voice Summary** → Click "Speak Summary" → Hear the analysis in Hindi via Sarvam TTS
6. **Share** → Click "Share via WhatsApp" → See the formatted Hindi + English message with citations, ready to send to family
7. **Doctor View** → Click "Doctor Portal" in navbar → See cases sorted by conflict severity, highest priority first

---

## 🇮🇳 India-Specific Features (Hackathon Differentiators)

| Feature | Technology | Why It Matters |
|---------|-----------|---------------|
| Hindi/Bhojpuri voice input | **Bhashini STT** (Govt of India, free) | Rural patients cannot type in English |
| Indian-accent voice output | **Sarvam AI TTS** | Natural Hindi speech, not robotic Google TTS |
| ICMR clinical guidelines RAG | Custom corpus + pgvector | Citations from Indian Council of Medical Research |
| ABDM health ID support | ABHA ID field in patient intake | Aligned with Ayushman Bharat Digital Mission |
| India-specific drug conflicts | WHO Essential Medicines + NHP India | ACE+ARB danger, Triple Whammy AKI, fluoroquinolone AMR |
| Hinglish multilingual output | Custom LLM prompting | How Indian patients actually speak to family |
| LLM failover (OpenAI → Groq) | FailoverLLM pattern | Demo never breaks during live presentation |
| AI Chat with citations | Voice followup API + RAG | Patients can ask questions and get source-backed answers |

---

## 🏗️ Technical Architecture

```
Frontend (React + Vite + TypeScript)
│
├── /case/new     → Patient intake: add doctor opinions, run analysis
├── /dashboard    → Patient case history
├── /doctor       → Doctor review queue (sorted by conflict severity)
└── /chat         → AI chat + voice-first patient interface
    │
    └── Calls Backend API (Node.js + Express + TypeScript)
            │
            ├── POST /api/reconciliation/compare  → Opinion conflict scoring engine
            ├── POST /api/voice/summary           → LLM summary + Sarvam TTS audio
            ├── POST /api/voice/followup          → AI chat (Hindi/English Q&A)
            ├── POST /api/voice/transcribe        → Bhashini STT (Hindi voice → text)
            ├── POST /api/ocr/prescription        → Prescription image OCR
            └── GET  /api/cases                   → Supabase case history CRUD
                    │
                    ├── Supabase (PostgreSQL + pgvector)
                    │   ├── cases table (patient cases + analysis JSON)
                    │   └── medical_evidence table (RAG corpus, 6 guideline files)
                    │
                    ├── OpenAI (GPT-4.1-mini) → Primary LLM
                    ├── Groq (Llama-3.1-8b) → Automatic fallback if OpenAI fails
                    ├── Sarvam AI → Indian-accent Hindi TTS
                    └── Bhashini (Govt of India) → Hindi/regional STT
```

---

## 📚 RAG Corpus (Medical Knowledge Base)

The system retrieves evidence from these files (embedded via `npm run ingest`):

| File | Source | Key Coverage |
|------|--------|-------------|
| `ICMR_Type2_Diabetes_Guidelines.txt` | ICMR 2022 | HbA1c targets, Metformin dosing, India-specific drug conflicts |
| `ICMR_Hypertension_India_2023.txt` | ICMR 2023 | BP targets, India-first antihypertensives, resistant HTN |
| `WHO_Essential_Medicines_Drug_Interactions.txt` | WHO 2021 | ACE+ARB danger, Triple Whammy AKI, statin+macrolide |
| `WHO_Antibiotic_Stewardship_Guidelines.txt` | WHO AWaRe | AMR in India, first-line antibiotics, Watch/Reserve list |
| `NHP_India_Preventive_Health_Guidelines.txt` | NHP India | Indian BMI cutoffs, CVD risk, thyroid screening |
| `WHO_Hypertension_Guideline.txt` | WHO 2021 | BP thresholds, pharmacological choices |

---

## ⚡ Quick Start

### Prerequisites
- Node.js 18+
- Supabase account (free tier works)
- OpenAI API key **OR** Groq API key (free at [console.groq.com](https://console.groq.com))

### 1. Clone & Install

```bash
git clone https://github.com/Niss54/Second-sight-pro.git
cd Second-sight-pro
npm install
cd frontend && npm install && cd ..
```

### 2. Configure Backend

```bash
cd backend
cp .env.example .env
# Fill in your API keys in .env (see below)
```

### 3. Run

```bash
# Terminal 1 — Backend (port 8080)
cd backend && npm run dev

# Terminal 2 — Frontend (port 5173)
cd frontend && npm run dev

# One-time: Embed medical corpus into Supabase
cd backend && npm run ingest
```

### Key Environment Variables (`backend/.env`)

| Variable | Required? | Where to get it |
|----------|-----------|-----------------|
| `OPENAI_API_KEY` | One of these | [platform.openai.com](https://platform.openai.com) |
| `GROQ_API_KEY` | is required | [console.groq.com](https://console.groq.com) (free) |
| `SARVAM_API_KEY` | Optional | [sarvam.ai](https://sarvam.ai) (Hindi TTS) |
| `BHASHINI_USER_ID` | Optional | [bhashini.gov.in/ulca](https://bhashini.gov.in/ulca) (free, Hindi STT) |
| `BHASHINI_API_KEY` | Optional | Same as above |
| `SUPABASE_URL` | Yes | [supabase.com](https://supabase.com) dashboard |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Supabase project settings → API |

---

## 👥 Team

- **Nishanth Sharma** ([@Niss54](https://github.com/Niss54)) — Full-stack development, RAG pipeline, Bhashini/Sarvam integration, UI/UX design

---

## 🙏 Acknowledgements

- [ICMR](https://icmr.gov.in) — Indian Council of Medical Research clinical practice guidelines
- [Bhashini / ULCA](https://bhashini.gov.in) — Government of India free multilingual AI platform
- [Sarvam AI](https://sarvam.ai) — Indian language text-to-speech
- [WHO](https://who.int) — Essential Medicines List and AWaRe antibiotic classification
- [NHP India](https://nhp.gov.in) — National Health Portal preventive health guidelines
- [Groq](https://groq.com) — Free, fast LLM inference for failover
- [Supabase](https://supabase.com) — Open-source Firebase alternative with pgvector

---

## 📄 License

MIT © 2026 SecondSight Pro
