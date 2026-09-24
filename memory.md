# 🧠 memory.md — Project Memory & AI Context File

> **Project:** SecondSight Pro — AI-Powered Medical Second Opinion Reconciliation Platform  
> **Version:** 1.0.0  
> **Last Updated:** 2026-09-24  
> **Maintained By:** AI Pair Programmer / Nishant Maurya (@Niss54)  
> **Purpose:** Persistent context memory for SecondSight Pro development, tracking UI/UX redesign tasks, design decisions, and status.

---

## ⚡ Quick Context

```
Project Type   : Full-Stack Healthcare AI Application (React 19 + Vite + Node.js Express + Supabase pgvector)
Current Focus  : Gemini -> Groq Automatic Failover Architecture & Chat Network Error Fix
Active Target  : Uninterrupted clinical AI chat & reconciliation with automated fallback on rate-limits
Primary LLM    : Google Gemini (gemini-3.6-flash / gemini-3.5-flash-lite)
Fallback LLM   : Groq (openai/gpt-oss-20b / llama) with seamless automatic switchover
Status         : Tested & working 100% (Gemini -> Groq auto-switch verified live)
```

---

## 📌 1. Project Identity

### 1.1 What Is SecondSight Pro?
In India, patients consult multiple doctors for complex conditions and frequently receive conflicting diagnoses and treatments. SecondSight Pro computationally reconciles these discrepancies, identifies dangerous drug interactions (like ACE+ARB or Triple Whammy AKI), grounds recommendations against verified ICMR (Indian Council of Medical Research) and WHO guidelines using pgvector RAG, and explains findings in Hindi, English, and Hinglish via Bhashini STT and Sarvam AI TTS.

### 1.2 Tech Stack Reference
| Layer | Technology | Details |
|---|---|---|
| **Frontend** | React 19 + TypeScript + Vite | `/frontend/src/` |
| **Styling** | Custom Design Tokens + Tailwind CSS + Framer Motion | `/frontend/src/App.css`, `index.css` |
| **Icons** | Lucide React | High-contrast semantic iconography |
| **Backend** | Node.js + Express + TypeScript | `/backend/src/` |
| **Database & Vector** | Supabase PostgreSQL + pgvector | `medical_evidence`, `cases` |
| **Primary LLM** | Google Gemini (gemini-3.6-flash) | Direct Google Generative Language REST API |
| **Fallback LLM** | Groq (openai/gpt-oss-20b) | Auto-switch when Gemini limits/503/429 occur |
| **Voice & Indic** | Bhashini STT (Govt of India) + Sarvam AI Hindi TTS | Real-time multilingual voice |

---

## 🎨 2. Failover Architecture & Auth Handling

1. **Auto-Failover Sequence:**
   - **Step 1:** Call Gemini (`gemini-3.6-flash`, with `gemini-3.5-flash-lite` backup) with 8s timeout.
   - **Step 2:** If Gemini encounters rate-limits (HTTP 429), quota limits, or spikes (HTTP 503), log error and **instantly auto-switch to Groq** (`openai/gpt-oss-20b`).
   - **Step 3:** If OpenAI key is present, try OpenAI as tertiary fallback.
   - **Step 4:** Return safe medical fallback string so user never encounters a blank screen or unhandled exception.

2. **Chat Network Error & 401 Fix:**
   - `authMiddleware.ts` was previously blocking all requests without an active Supabase user token with `401 Unauthorized`.
   - Updated middleware and frontend `api.ts` to attach and accept demo guest tokens (`Bearer demo-guest-token`), allowing instant hackathon demo testing and guest chat without login friction.

---

## 📋 3. Master TODO List

- [x] **Phase 1: Design System & Global Styling Foundation**
- [x] **Phase 2: Homepage Redesign (`HomePage.tsx`)**
- [x] **Phase 3: Active Case Intake & Form Redesign (`IntakePage.tsx`, `CaseFormPanel.tsx`, `OpinionCard.tsx`)**
- [x] **Phase 4: Reconciliation & Clinical Analysis Panel (`ReconciliationPanel.tsx`)**
- [x] **Phase 5: Case History & Doctor Triage Dashboard (`DashboardPage.tsx`, `DoctorDashboardPage.tsx`)**
- [x] **Phase 6: AI Chat & Voice Assistant Interface (`ChatPage.tsx`)**
- [x] **Phase 7: Verification & Build Validation**
- [x] **Phase 8: LLM Resilience — Gemini & Groq Auto-Failover**
  - [x] Configure Gemini API key and modern model (`gemini-3.6-flash`)
  - [x] Configure Groq API key and model (`openai/gpt-oss-20b`)
  - [x] Implement automatic failover mechanism in `backend/src/lib/failoverLlm.ts`
  - [x] Resolve 401 Network Error in `/api/voice/followup` and guest sessions
  - [x] Live end-to-end API test verifying 200 response and auto-switchover
- [x] **Phase 9: Security Audit & Database Management via Supabase MCP**
  - [x] Discovered Supabase project `jizvgurnppvbrqhbhjqj` was paused (`INACTIVE`) and successfully restored via MCP `restore_project`
  - [x] Diagnosed security vulnerabilities via `get_advisors(type: "security")`: resolved `SECURITY DEFINER` execution risks on `rls_auto_enable`
  - [x] Applied migrations via MCP `apply_migration` to create all public tables with strict Row-Level Security (RLS) enabled
  - [x] Relocated `vector` extension to `extensions` schema to isolate public API schema
  - [x] Optimized all RLS policies using `(select auth.uid())` for InitPlan caching
  - [x] Confirmed 0 security warnings (`{"result":{"lints":[]}}`) via Supabase MCP
  - [x] Created `case-uploads` storage bucket with RLS ownership policies
  - [x] Built `search_medical_evidence` RPC function (vector + keyword ranking with `SECURITY INVOKER`)
  - [x] Seeded 19 verified ICMR, WHO, NIH, and Mayo clinical guideline records into Supabase `public.medical_evidence`
  - [x] Exported live database TypeScript typings to `frontend/src/database.types.ts` & `backend/src/database.types.ts` via MCP `generate_typescript_types`
  - [x] Added sliding-window rate limiting middleware (`rateLimiter.ts`) protecting AI, voice, OCR, and general API routes
  - [x] Added DNS resilience resolver (`8.8.8.8`, `1.1.1.1`) to eliminate ISP DNS caching issues
  - [x] Sanitized production error responses in `errorHandler.ts` to prevent data leakage
- [x] **Phase 10: Dockerization & Workspace Cleanup**
  - [x] Created production `docker-compose.yml` linking Backend (port 8080) and Nginx-based React Frontend (port 5173) with healthchecks
  - [x] Created development `docker-compose.dev.yml` supporting hot reload and live file sync
  - [x] Modernized `backend/Dockerfile` with healthcheck, port 8080 exposure, non-root user, and OCR dependencies
  - [x] Built multi-stage `frontend/Dockerfile` and `frontend/nginx.conf` with gzip, asset caching, security headers, and SPA routing
  - [x] Added root and frontend `.dockerignore` files
  - [x] Purged root duplicate/stale documentation files (`architecture.md`, `PRD.md`, `TODO.md`, `todo2.md`, etc.), preserving the entire `docs/` folder untouched
  - [x] Added npm scripts (`docker:build`, `docker:up`, `docker:down`, `docker:dev`) to root `package.json`

- [x] **Phase 11: `nissh.info` Inspired Kinetic Visual & Neo-Brutalist Redesign**
  - [x] Inspected user's personal website (`https://nissh.info`) for design tokens, kinetic animations, and neo-brutalist interactive elements
  - [x] Created `InteractiveCursor.tsx`: Desktop pointer-following interactive bubble displaying contextual action labels via `data-cursor` attributes
  - [x] Created `AmbientParticles.tsx`: Pulsing ambient particle system with staggered animation delays
  - [x] Created `InteractiveStickers.tsx`: Kinetic stickers including `SpinningStar`, `WobblySmiley`, `HandDrawnUnderline`, `HandDrawnOval`, and `NeoPill`
  - [x] Created `MarqueeTicker.tsx`: Continuous dual-track infinite marquee ticker with colorful clinical safety pills and edge gradient masks
  - [x] Created `MotionCardDeck.tsx`: 4-card overlapping fan deck displaying conflicting doctor opinions, conflict detection alert, and ICMR reconciliation with hover fanning and click focus
  - [x] Added kinetic CSS rules to `App.css` (`@keyframes pulseParticle`, `spinSlow`, `floatWobble`, `drawUnderline`, `scrollLeft`, `scrollRight`, `floatTag`, `.neo-cta`, `.neo-badge`, `.fan-card`)
  - [x] Integrated into `HomePage.tsx`, and updated `App.tsx` and `Navbar.tsx` for seamless public landing page navigation and guest demo access

- [x] **Phase 13: End-to-End Step-by-Step MCP Verification & Visual Polishing**
  - [x] Verified **Homepage (`/`)** in Light & Dark Mode via Chrome DevTools MCP screenshots: hero, animated stickers, 4-pillar cards, timeline, comparison table, marquee, and motion card deck.
  - [x] Verified **Case Intake (`/case/new`)** in Light & Dark Mode: drag-and-drop zone, form inputs, doctor opinion cards, and action buttons.
  - [x] Fixed **Critical Alert Banner** in `ReconciliationPanel.tsx`: converted hardcoded white/pink gradient to responsive CSS classes (`emergency-alert-banner`), rendering sleek dark crimson in dark mode and clean soft red in light mode.
  - [x] Fixed **Confidence Badges & Meta Pills** in `ReconciliationPanel.tsx`: converted hardcoded inline pastel badges to responsive high/medium/low classes and `var(--card)` background.
  - [x] Fixed **Data Table & Table Container** in `App.css`: removed hardcoded white/gray backgrounds causing light strips in dark mode; verified `/dashboard` in both modes.
  - [x] Started Guideline Retrieval Backend (port 8080) and verified **Doctor Portal (`/doctor`)** with live saved cases, KPI metrics, filter chips, and navigation to case triage.
  - [x] Enhanced **AI Voice Chat (`/chat`)**: added top navigation (`← Home`) and Theme Toggle (`Moon/Sun`) directly to the chat header; executed live query and verified bilingual AI response with RAG citations in Light and Dark mode.
  - [x] Confirmed zero build errors via `tsc -b && vite build` in 3.32s.

---

## 📝 4. Changelog & Activity Log
- **2026-09-24 22:01:** Added `GEMINI_API_KEY`, `GEMINI_MODEL`, `GROQ_API_KEY`, and `GROQ_MODEL` into `backend/.env` and `env.ts`.
- **2026-09-24 22:02:** Fixed `authMiddleware.ts` and `api.ts` to permit guest tokens (`demo-guest-token`), resolving the 401 Network Error on `/api/voice/followup`.
- **2026-09-24 22:07:** Rebuilt `failoverLlm.ts` with direct Gemini REST API + Groq OpenAI SDK failover.
- **2026-09-24 22:09:** Successfully tested live request: Gemini 503 was detected and instantly auto-switched to Groq (`openai/gpt-oss-20b`), returning a high-quality bilingual (Hindi & English) response with HTTP 200.
- **2026-09-24 22:30:** Restored paused Supabase database (`jizvgurnppvbrqhbhjqj`) using `supabase-mcp-server`.
- **2026-09-24 22:45:** Fixed all Supabase security advisories: revoked execute on `rls_auto_enable()`, moved `vector` extension to `extensions` schema, enabled RLS on all 7 tables and storage bucket, and optimized policies with `(select auth.uid())` (0 security warnings remain).
- **2026-09-24 22:48:** Seeded 19 verified ICMR/WHO medical guideline evidence records into `medical_evidence` and deployed `search_medical_evidence` RPC.
- **2026-09-24 22:52:** Hardened backend security with sliding-window rate limiting, production error sanitization, DNS fallback resolvers, and generated Supabase TypeScript types. Verified with live end-to-end clinical query.
- **2026-09-24 23:40:** Removed redundant root markdown files and scratch scripts while preserving all documentation in `docs/`. Added full Docker containerization (`docker-compose.yml`, `docker-compose.dev.yml`, `backend/Dockerfile`, `frontend/Dockerfile`, `frontend/nginx.conf`).
- **2026-09-25 00:10:** Implemented `nissh.info` kinetic visual elements: interactive follower cursor bubble, ambient pulsing particles, neo-brutalist stickers, infinite dual-track marquee, and 4-card fanning motion deck. Verified with successful clean frontend build.
- **2026-09-25 00:30:** Fixed Light Mode and Dark Mode strict separation: eliminated rainbow navbar borders, removed background color splotches, polished clinical tokens, and verified via Chrome DevTools MCP.
- **2026-09-25 01:00:** Step-by-step MCP visual inspection completed across all pages (`/`, `/case/new`, `/dashboard`, `/doctor`, `/chat`). Fixed critical alert dark mode styling, table dark mode background, and added header controls to AI chat. Verified with 100% clean production build.
- **2026-09-25 01:20:** Fixed jerky zig-zag animations on fanning card deck and floating stickers: eliminated horizontal jump to center (`translateX(0)`), removed conflicting parent hover expansion, changed transition curve to non-overshooting fluid ease-out (`cubic-bezier(0.16, 1, 0.3, 1)`), converted floating tags to smooth vertical drifting with static tilt, and optimized `InteractiveCursor` with `requestAnimationFrame` + `translate3d`. Verified live via Chrome DevTools MCP.


