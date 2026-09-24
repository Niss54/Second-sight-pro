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
Current Focus  : UI/UX Redesign according to docs/UI-UX.md design specifications
Active Target  : Production-grade medical interface with modern aesthetics, WCAG AA accessibility, and microinteractions
Styling Engine : CSS Design Tokens + Tailwind CSS + Lucide Icons + Framer Motion
Deployed Target: Render PR Previews + Vercel
Status         : Redesign completed, TypeScript build passed (0 errors), dev servers running
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
| **AI Models** | OpenAI GPT-4.1-mini + Groq Llama-3.1 failover | FailoverLLM architecture |
| **Voice & Indic** | Bhashini STT (Govt of India) + Sarvam AI Hindi TTS | Real-time multilingual voice |

---

## 🎨 2. UI/UX Design System Guidelines (`docs/UI-UX.md`)

- **Design Philosophy:** Clarity, Speed (<= 3 clicks), Consistency, Accessibility (WCAG 2.1 AA), Mobile First.
- **Color Tokens:**
  - Primary Brand: Medical Teal (`#0d7c73`, `#14b8a6`, `#0a5e58`) & Sky Blue (`#2563eb`, `#0ea5e9`)
  - Semantic Status:
    - High Danger/Critical Conflict: `#ef4444` / Crimson
    - Warning/Moderate Conflict: `#f59e0b` / Amber
    - Success/Safe/Aligned: `#22c55e` / Emerald
    - Info/Guideline Citation: `#3b82f6` / Blue
  - Surfaces: Frosted glass layers (`backdrop-filter: blur(20px)`), light `--bg-0` through `--bg-2`, dark mode support.
- **Typography:** Inter / Sans-serif with clear type hierarchy (`display`, `h1`, `h2`, `h3`, `body`, `caption`).
- **Rhythm & Radius:** 4px spacing unit, rounded card radii (`--radius-sm: 8px`, `--radius-md: 14px`, `--radius-lg: 20px`, `--radius-xl: 28px`, `--radius-full: 9999px`).
- **Component Anatomy:** Structured headers, description labels, interactive hover & focus states, accessible badges.

---

## 📋 3. UI/UX Redesign Master TODO List

- [x] **Phase 1: Design System & Global Styling Foundation**
  - [x] Polish global design tokens, CSS variables, typography scale, and focus rings in `App.css` and `index.css`
  - [x] Add smooth transitions, modern frosted glass card utilities, status badges, and button variants
  - [x] Refine responsive navigation pill and header (`Navbar.tsx`) with sleek mobile drawer and active route indicator
  - [x] Add direct `/chat` (AI Voice Copilot) and Doctor Portal links to navigation

- [x] **Phase 2: Homepage Redesign (`HomePage.tsx`)**
  - [x] Hero section upgrade: Engaging medical consensus badge, high-contrast typography, dual CTAs, and interactive India demo case pills
  - [x] Interactive Core Capabilities cards: RAG pgvector grounding, Conflict resolution engine, Sarvam Hindi voice, ABDM readiness
  - [x] Patient Journey Timeline: Step-by-step visual workflow (01 Intake -> 02 Algorithmic Diff -> 03 ICMR Grounding -> 04 Voice/WhatsApp Action Plan)
  - [x] Detailed Comparison Matrix: SecondSight Pro vs Generic ChatGPT vs Telemedicine
  - [x] Interactive FAQ Accordion with smooth Framer Motion transitions
  - [x] High-converting bottom CTA banner with quick links

- [x] **Phase 3: Active Case Intake & Form Redesign (`IntakePage.tsx`, `CaseFormPanel.tsx`, `OpinionCard.tsx`)**
  - [x] Patient demographic banner: Age, Gender, Primary Condition, ABHA Health ID, Comorbidities pills
  - [x] Multi-doctor opinion cards: Color-coded doctor accent bars (Doctor A, Doctor B, Doctor C), specialty tags, diagnosis, treatment, prescription chips, urgency badge with color dot
  - [x] Prescription & Medical Report OCR dropzone integration
  - [x] Sticky action toolbar: "Run AI Analysis", "Save Case", "Cycle Demo Cases", "Reset"

- [x] **Phase 4: Reconciliation & Clinical Analysis Panel (`ReconciliationPanel.tsx`)**
  - [x] Conflict severity gauge / score meter with dynamic gradient animation
  - [x] Disagreement breakdown: Side-by-side comparison table, visual explanation blocks
  - [x] ICMR & WHO Guideline Evidence Cards with verified badge and expand/collapse citations
  - [x] Multilingual Summary: Hindi & English audio playback with Sarvam AI
  - [x] WhatsApp Share Preview Modal & PDF Export button

- [x] **Phase 5: Case History & Doctor Triage Dashboard (`DashboardPage.tsx`, `DoctorDashboardPage.tsx`)**
  - [x] Doctor Triage Queue: Filter by High Conflict, Review Needed, ABDM Linked, Search by patient or condition
  - [x] Status indicators, conflict badges, and quick-action cards
  - [x] Responsive table/card hybrid layout for desktop and mobile

- [x] **Phase 6: AI Chat & Voice Assistant Interface (`ChatPage.tsx`)**
  - [x] Conversational UI with medical disclaimer, suggested prompt chips, and message citation bubbles
  - [x] Voice mic input trigger with live wave/pulse state
  - [x] Linked from Navbar and Footer for easy discoverability

- [x] **Phase 7: Verification & Build Validation**
  - [x] Run Vite TypeScript build check (`tsc -b && vite build`) to ensure zero errors (Passed: 2,464 modules transformed in 4.93s)
  - [x] Verify dev server status for Frontend (Port 5173) and Backend (Port 8080)
  - [x] Commit all redesign changes cleanly to Git

---

## 📝 4. Changelog & Activity Log
- **2026-09-24 21:20:** Initialized `memory.md` with full project context and detailed UI/UX master TODO list.
- **2026-09-24 21:24:** Upgraded `Navbar.tsx` and `App.css`: added Stethoscope brand badge, AI Chat Voice link, active route indicator, and responsive drawer.
- **2026-09-24 21:25:** Redesigned `HomePage.tsx`: implemented clinical trust badge, gradient typography, India demo case launcher pills (Diabetes, HTN, Oncology), 4 core capability cards, step-by-step triage workflow timeline, comparison table, and interactive accordion FAQ.
- **2026-09-24 21:26:** Redesigned `OpinionCard.tsx` and `CaseFormPanel.tsx`: color-coded doctor accents (Doctor A / Doctor B / Doctor C), urgency dot indicators, ABDM/ABHA ID badge, and sticky action toolbar.
- **2026-09-24 21:27:** Redesigned `IntakePage.tsx`: added active case status strip with conflict risk badge, database sync indicator, and quick chat launcher.
- **2026-09-24 21:27:** Upgraded `Footer.tsx`: added AI Voice Copilot and Doctor Portal navigation links.
- **2026-09-24 21:28:** Updated `index.css`: imported Inter and JetBrains Mono typography, configured WCAG focus states.
- **2026-09-24 21:29:** Validated production build (`tsc -b && vite build`) — 0 errors, built in 4.93s. Started dev server on port 5173.
