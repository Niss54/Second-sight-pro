# SecondSight Pro Feature Ticket List

This document breaks the PRD into buildable, AI-agent-friendly tickets. Each ticket includes scope, dependencies, acceptance criteria, and a ready-to-use coding prompt.

## Launch-Must-Have Tickets

### Ticket 1 - Project Foundation and Shared Types
- **Priority:** Must-have for launch
- **Feature name:** Project foundation and shared types
- **Description:** Create the basic app scaffolding needed to support all other features. This includes shared TypeScript types, API response contracts, frontend service helpers, a consistent error model, and common utility functions used across frontend and backend.
- **Dependencies:** None
- **Acceptance criteria:**
  - Shared types exist for cases, opinions, OCR results, evidence citations, analysis output, voice sessions, and reports.
  - Frontend and backend both import shared or mirrored contract shapes consistently.
  - A standard API error format is defined and used by backend routes.
  - The codebase has a clear separation between UI, API client, services, and data models.
- **AI coding prompt:**  
  Build the shared TypeScript foundation for SecondSight Pro. Create reusable types, API contracts, standard error shapes, and utility helpers for the frontend and backend. Keep the structure modular and ready for Supabase, OCR, hybrid evidence retrieval, multilingual responses, and voice features.

### Ticket 2 - Supabase Authentication and User Session Handling
- **Priority:** Must-have for launch
- **Feature name:** Supabase auth and session management
- **Description:** Implement secure authentication using Supabase Auth, including sign up, sign in, sign out, session persistence, and authenticated API requests.
- **Dependencies:** Ticket 1
- **Acceptance criteria:**
  - Users can sign up, sign in, and sign out.
  - Auth state persists across refreshes.
  - Backend can identify the current user from the request session or token.
  - Protected routes redirect unauthenticated users.
  - Authenticated requests include the correct token automatically.
- **AI coding prompt:**  
  Implement Supabase Auth for SecondSight Pro with secure session handling in the frontend and token verification in the backend. Add auth guards, session persistence, login/logout flows, and user-aware API requests.

### Ticket 3 - Supabase Database Schema, RLS, and Data Access Layer
- **Priority:** Must-have for launch
- **Feature name:** Supabase schema and row-level security
- **Description:** Replace JSON storage with Supabase Postgres tables for users, medical cases, doctor opinions, uploaded files, analysis results, voice sessions, and medical evidence. Add row-level security so each user can only access their own case data.
- **Dependencies:** Ticket 1, Ticket 2
- **Acceptance criteria:**
  - Tables exist for all required entities.
  - Relationships between cases, opinions, uploads, and analysis results are enforced.
  - RLS prevents users from reading or modifying other users' case data.
  - The backend uses a data access layer instead of direct JSON file writes.
  - Migration path from legacy storage is supported.
- **AI coding prompt:**  
  Design and implement the Supabase database schema for SecondSight Pro with row-level security and a clean data access layer. Replace JSON storage with Postgres-backed repositories for cases, opinions, uploads, analyses, voice sessions, and evidence.

### Ticket 4 - Premium App Shell, Routing, and Design System
- **Priority:** Must-have for launch
- **Feature name:** App shell and design system
- **Description:** Build the global UI structure, navigation, page routing, responsive layout, and reusable design tokens that give the app a premium medical SaaS look and feel.
- **Dependencies:** Ticket 1
- **Acceptance criteria:**
  - The app has a stable layout with header, navigation, content area, and footer or utility area.
  - Routing exists for landing, upload, dashboard, explainability, voice, history, report, and settings.
  - A shared design system controls color, typography, spacing, cards, buttons, inputs, and modals.
  - The UI is responsive on mobile and desktop.
  - Visual styling matches the premium healthtech direction.
- **AI coding prompt:**  
  Build the SecondSight Pro app shell, routing structure, and reusable design system. Implement a polished premium UI foundation with responsive layouts, navigation, shared components, and design tokens suitable for a healthcare SaaS product.

### Ticket 5 - Landing Page and Trust Story
- **Priority:** Must-have for launch
- **Feature name:** Landing page
- **Description:** Create the public-facing landing page with hero section, problem statement, how-it-works section, demo teaser, feature highlights, trust indicators, disclaimer, and call to action.
- **Dependencies:** Ticket 4
- **Acceptance criteria:**
  - Landing page includes all required sections.
  - The value proposition is instantly understandable.
  - The medical disclaimer is visible and clear.
  - The page feels premium, modern, and trustworthy.
  - Call-to-action routes users into the app flow.
- **AI coding prompt:**  
  Build a high-conversion landing page for SecondSight Pro. Include a compelling hero section, medical disclaimer, how-it-works section, feature overview, trust indicators, demo callout, and CTA. Make it visually premium and responsive.

### Ticket 6 - Case Creation and Doctor Opinion Entry
- **Priority:** Must-have for launch
- **Feature name:** Case intake and doctor opinion capture
- **Description:** Let users create a new case and enter 2 to 5 doctor opinions with diagnosis, treatment plan, medications, tests, urgency, and notes.
- **Dependencies:** Ticket 3, Ticket 4
- **Acceptance criteria:**
  - A user can create a new case.
  - A case can store multiple doctor opinions.
  - The form validates required fields and limits opinions to the supported range.
  - Saved case data is persisted in Supabase.
  - Existing case data can be edited and reloaded.
- **AI coding prompt:**  
  Build the case intake flow for SecondSight Pro. Let users create a medical case and enter multiple doctor opinions with structured fields for diagnosis, treatment, medications, tests, urgency, and notes. Persist everything in Supabase.

### Ticket 7 - File Upload, Storage, and OCR Extraction
- **Priority:** Must-have for launch
- **Feature name:** Prescription and report upload with OCR
- **Description:** Add support for uploading PDFs and images of prescriptions or diagnostic reports, storing them in Supabase Storage, and extracting structured text with OCR.
- **Dependencies:** Ticket 3, Ticket 6
- **Acceptance criteria:**
  - Users can upload image and PDF files.
  - Files are saved securely in Supabase Storage.
  - OCR runs on upload and returns extracted text.
  - Low-confidence OCR is flagged for manual review.
  - Extracted file metadata is attached to the correct case.
- **AI coding prompt:**  
  Build the upload and OCR pipeline for SecondSight Pro. Support PDF and image uploads, save files to Supabase Storage, extract text and basic medical entities, and flag low-confidence results for manual correction.

### Ticket 8 - Manual OCR Review and Correction UI
- **Priority:** Must-have for launch
- **Feature name:** OCR review and correction
- **Description:** Provide a user interface that lets users review extracted OCR data and correct errors before analysis runs.
- **Dependencies:** Ticket 7
- **Acceptance criteria:**
  - Users can view OCR output in a review screen.
  - Users can edit extracted diagnosis, medication, dosage, tests, and urgency fields.
  - Corrections are saved back to the case.
  - The app clearly indicates when OCR confidence is low.
  - The flow continues from review to analysis.
- **AI coding prompt:**  
  Build an OCR correction workflow for SecondSight Pro. Show extracted text and structured fields to the user, allow edits, show confidence levels, and save the corrected data back to the case before analysis.

### Ticket 9 - Trusted Medical Evidence Corpus and Ingestion
- **Priority:** Must-have for launch
- **Feature name:** Trusted evidence corpus
- **Description:** Create the pre-indexed trusted medical corpus structure and ingest curated reference content for disease guidelines, treatment guidelines, medication conflicts, diagnostic tests, and emergency flags.
- **Dependencies:** Ticket 3
- **Acceptance criteria:**
  - Corpus folders exist and are organized by category.
  - Seed content is stored in a structured, reusable format.
  - Evidence entries include source, specialty, urgency, condition, and confidence metadata.
  - The ingestion script can populate the evidence table with vectors.
- **AI coding prompt:**  
  Create the trusted medical evidence corpus for SecondSight Pro. Organize curated content into guideline and emergency categories, add metadata, chunk it for retrieval, and ingest it into Supabase pgvector.

### Ticket 10 - Hybrid Evidence Retrieval Engine
- **Priority:** Must-have for launch
- **Feature name:** Hybrid retrieval search
- **Description:** Build the retrieval pipeline that combines semantic search, keyword matching, metadata filtering, and reranking to fetch trusted evidence for each case.
- **Dependencies:** Ticket 9, Ticket 3
- **Acceptance criteria:**
  - The system returns relevant evidence for a case query.
  - Results include citations, source names, and confidence values.
  - Metadata filters work by disease, specialty, urgency, and source.
  - The retriever can return a small, ranked set of grounded sources.
- **AI coding prompt:**  
  Build a hybrid retrieval engine for SecondSight Pro that combines vector search, keyword search, metadata filtering, and reranking. Return a small set of cited, trusted evidence items for each case.

### Ticket 11 - Conflict Analysis Engine and Risk Scoring
- **Priority:** Must-have for launch
- **Feature name:** Conflict scoring and analysis
- **Description:** Compare the doctor opinions in a case and generate a conflict score with a breakdown of diagnosis mismatch, treatment conflict, medication contradiction, urgency disagreement, and test disagreement.
- **Dependencies:** Ticket 6, Ticket 10
- **Acceptance criteria:**
  - The app produces a consistent score and tier for each case.
  - The result includes a clear breakdown of why the score was assigned.
  - The existing analysis logic is preserved and improved, not replaced blindly.
  - The output is structured and usable by the frontend.
- **AI coding prompt:**  
  Implement the conflict analysis engine for SecondSight Pro. Compare multiple doctor opinions, calculate a conflict score, and generate a structured breakdown of the contributors to the score.

### Ticket 12 - Grounded Analysis Summary with Citations
- **Priority:** Must-have for launch
- **Feature name:** Evidence-grounded summary generation
- **Description:** Generate a safe, cited explanation of the disagreement using retrieved evidence, without diagnosing or prescribing.
- **Dependencies:** Ticket 10, Ticket 11
- **Acceptance criteria:**
  - The summary clearly explains what differs, why it may differ, what to ask next, and when to seek urgent care.
  - Every medical claim is grounded in evidence citations.
  - The output includes safety warnings and uncertainty handling.
  - The language never crosses into diagnosis or prescription.
- **AI coding prompt:**  
  Build a grounded medical summary generator for SecondSight Pro. Use retrieved evidence to explain the disagreement safely, cite sources, avoid diagnosis or prescribing, and include uncertainty and next-step guidance.

### Ticket 13 - Explainability Dashboard
- **Priority:** Must-have for launch
- **Feature name:** Explainability panel
- **Description:** Create a visual dashboard that shows why the score happened using charts, confidence markers, and risk contributor cards.
- **Dependencies:** Ticket 11, Ticket 12
- **Acceptance criteria:**
  - Users can see a clear breakdown of score contributors.
  - Visual elements make the score easy to understand.
  - Evidence links are visible from each contributor.
  - The dashboard works on mobile and desktop.
- **AI coding prompt:**  
  Build an explainability dashboard for SecondSight Pro. Visualize the conflict score, show contributor breakdowns, display confidence levels, and link each contributor to evidence citations.

### Ticket 14 - Specialist Questions Generator
- **Priority:** Must-have for launch
- **Feature name:** Specialist question generation
- **Description:** Generate safe, evidence-grounded questions the patient can ask their specialist next.
- **Dependencies:** Ticket 10, Ticket 12
- **Acceptance criteria:**
  - The app outputs a focused list of specialist questions.
  - Questions are grounded in retrieved evidence and case context.
  - Questions stay safe, practical, and non-diagnostic.
  - The output is ready for display and export.
- **AI coding prompt:**  
  Build a specialist question generator for SecondSight Pro. Use case context and evidence retrieval results to create safe, practical, evidence-grounded questions the patient can ask a specialist.

### Ticket 15 - Specialist Summary Report
- **Priority:** Must-have for launch
- **Feature name:** Exportable specialist report
- **Description:** Generate a report that summarizes the case, comparison results, evidence citations, and specialist questions in a clean, printable format.
- **Dependencies:** Ticket 12, Ticket 13, Ticket 14
- **Acceptance criteria:**
  - A report can be generated from a completed case.
  - The report includes summary, score, evidence, and questions.
  - The format is clean enough to print or share.
  - The report data is saved and tied to the case.
- **AI coding prompt:**  
  Build a specialist-ready report generator for SecondSight Pro. Produce a clean exportable summary that includes the case overview, conflict analysis, citations, next questions, and safety guidance.

### Ticket 16 - Multilingual Summaries and UI Copy
- **Priority:** Must-have for launch
- **Feature name:** English, Hindi, and Hinglish support
- **Description:** Support multilingual summaries and interface outputs for the key patient-facing explanation content.
- **Dependencies:** Ticket 12, Ticket 14
- **Acceptance criteria:**
  - The user can switch between English, Hindi, and Hinglish.
  - Summary and question outputs update correctly.
  - Medical accuracy is preserved during translation.
  - Important clinical terms are not oversimplified.
- **AI coding prompt:**  
  Add multilingual support to SecondSight Pro for English, Hindi, and Hinglish. Translate summaries, specialist questions, and key explanations while preserving medical meaning and safety.

### Ticket 17 - Safety Guardrails and Emergency Escalation
- **Priority:** Must-have for launch
- **Feature name:** Safety filters and urgent care warnings
- **Description:** Add safety logic that prevents unsafe outputs and warns users when dangerous symptoms or urgent escalation flags appear.
- **Dependencies:** Ticket 12, Ticket 14
- **Acceptance criteria:**
  - The app always shows the medical disclaimer.
  - Unsafe diagnosis or prescribing requests are refused or redirected safely.
  - Emergency flags trigger an urgent care message.
  - The safety behavior is consistent across text and voice output.
- **AI coding prompt:**  
  Implement safety guardrails for SecondSight Pro. Prevent diagnosis and prescription behavior, enforce a clear medical disclaimer, and surface emergency escalation guidance when dangerous symptoms or urgent flags are detected.

### Ticket 18 - Case History and Saved Analyses
- **Priority:** Must-have for launch
- **Feature name:** Case history
- **Description:** Let users view previously saved cases, open old analysis results, and resume work on incomplete cases.
- **Dependencies:** Ticket 3, Ticket 15
- **Acceptance criteria:**
  - Users can see a list of their saved cases.
  - Each case shows status and last analysis summary.
  - Users can reopen a prior case and review its outputs.
  - Users only see their own records.
- **AI coding prompt:**  
  Build the case history experience for SecondSight Pro. Show a user’s saved cases, last analysis state, and allow reopening and reviewing previous work safely with user-scoped access.

### Ticket 19 - Voice Assistant Session Flow
- **Priority:** Must-have for launch
- **Feature name:** Voice assistant
- **Description:** Add a voice interaction flow using LiveKit and Sarvam AI so users can hear and speak explanations in a premium voice experience, with text fallback if voice services are unavailable.
- **Dependencies:** Ticket 12, Ticket 16, Ticket 17
- **Acceptance criteria:**
  - Users can start a voice session from the app.
  - The system supports text fallback when voice setup is missing.
  - Voice output stays safe and aligned with the text analysis.
  - The session is associated with the current case.
- **AI coding prompt:**  
  Build the voice assistant flow for SecondSight Pro using LiveKit and Sarvam AI. Support multilingual voice explanations, safe responses, and a text fallback when voice services are unavailable.

### Ticket 20 - Settings, Preferences, and Environment Handling
- **Priority:** Must-have for launch
- **Feature name:** User settings and app configuration
- **Description:** Add settings for language preference, voice support status, account actions, and a visible view of environment-dependent features.
- **Dependencies:** Ticket 2, Ticket 16, Ticket 19
- **Acceptance criteria:**
  - Users can change language preference.
  - The app clearly shows if voice is enabled or unavailable.
  - Account actions like sign out work correctly.
  - The settings screen is clean, minimal, and understandable.
- **AI coding prompt:**  
  Build the settings experience for SecondSight Pro. Let users manage language preference, view voice feature availability, and handle basic account actions in a clean settings page.

### Ticket 21 - Deployment Configuration and Production Readiness
- **Priority:** Must-have for launch
- **Feature name:** Deployment and runtime configuration
- **Description:** Prepare the app for production deployment with environment variables, build scripts, and runtime configuration for frontend, backend, and Supabase integration.
- **Dependencies:** Ticket 1, Ticket 2, Ticket 3
- **Acceptance criteria:**
  - Local, staging, and production environment variables are documented.
  - The app builds successfully in production mode.
  - Secrets are not hardcoded.
  - Deployment instructions are clear enough for handoff.
- **AI coding prompt:**  
  Prepare SecondSight Pro for production deployment. Document and wire environment variables, build scripts, and runtime configuration for frontend, backend, and Supabase without hardcoding secrets.

## Should-Have Tickets

### Ticket 22 - Premium Motion and Micro-Interaction Polish
- **Priority:** Should-have
- **Feature name:** Motion and interaction polish
- **Description:** Add subtle Framer Motion transitions and polished feedback states for key UI moments without making the interface feel busy.
- **Dependencies:** Ticket 4
- **Acceptance criteria:**
  - Page transitions and card interactions feel smooth.
  - Motion is subtle and supports usability.
  - Loading, success, and error states feel premium.
- **AI coding prompt:**  
  Add polished but subtle motion design to SecondSight Pro using Framer Motion. Improve page transitions, loading states, and interaction feedback without over-animating the product.

### Ticket 23 - Demo Mode and Seeded Example Cases
- **Priority:** Should-have
- **Feature name:** Demo cases and sample walkthrough
- **Description:** Add a seeded demo flow so judges or users can see the product working instantly with realistic sample cases.
- **Dependencies:** Ticket 6, Ticket 11, Ticket 15
- **Acceptance criteria:**
  - A demo case can be loaded with one click.
  - The demo includes realistic conflicting opinions and evidence.
  - The workflow shows the full product value without requiring manual setup.
- **AI coding prompt:**  
  Build a demo mode for SecondSight Pro with seeded sample cases that demonstrate uploads, conflicting opinions, evidence grounding, explainability, and report generation in one smooth walkthrough.

### Ticket 24 - Error Handling, Empty States, and Recovery Flows
- **Priority:** Should-have
- **Feature name:** Resilient UX for failures
- **Description:** Improve the product’s error handling so uploads, analysis, auth failures, and retrieval errors show friendly recovery actions instead of dead ends.
- **Dependencies:** Ticket 2, Ticket 7, Ticket 10, Ticket 12, Ticket 19
- **Acceptance criteria:**
  - Major failure states display clear messaging and next steps.
  - Users can retry failed actions where appropriate.
  - Empty states are informative and not confusing.
  - The app never leaves the user without guidance after a failure.
- **AI coding prompt:**  
  Implement resilient error handling and empty states for SecondSight Pro. Cover auth issues, upload failures, OCR failures, analysis failures, retrieval failures, and voice service issues with clear recovery paths.

## Nice-to-Have Tickets

### Ticket 25 - Advanced Analytics and Usage Insights
- **Priority:** Nice-to-have
- **Feature name:** Product analytics dashboard
- **Description:** Add internal analytics that show case volume, feature usage, language usage, and user engagement patterns.
- **Dependencies:** Ticket 3, Ticket 18
- **Acceptance criteria:**
  - Analytics views show meaningful product-level metrics.
  - Data is aggregated safely without exposing private case content.
  - The dashboard is useful for internal product learning.
- **AI coding prompt:**  
  Build an internal analytics dashboard for SecondSight Pro that shows usage trends, language distribution, case completion rates, and feature adoption without exposing sensitive medical content.

### Ticket 26 - Accessibility Audit and Remediation Pass
- **Priority:** Nice-to-have
- **Feature name:** Accessibility refinement
- **Description:** Improve accessibility beyond baseline compliance with keyboard navigation, contrast review, semantic HTML, and screen reader support.
- **Dependencies:** Ticket 4
- **Acceptance criteria:**
  - Core flows are usable with keyboard only.
  - Contrast and focus states meet accessibility expectations.
  - Semantic structure supports screen readers.
- **AI coding prompt:**  
  Perform an accessibility hardening pass on SecondSight Pro. Improve keyboard navigation, semantic markup, focus states, contrast, and screen reader compatibility across the main user flows.

## Suggested Build Order
1. Ticket 1
2. Ticket 2
3. Ticket 3
4. Ticket 4
5. Ticket 6
6. Ticket 7
7. Ticket 8
8. Ticket 9
9. Ticket 10
10. Ticket 11
11. Ticket 12
12. Ticket 13
13. Ticket 14
14. Ticket 15
15. Ticket 16
16. Ticket 17
17. Ticket 18
18. Ticket 19
19. Ticket 20
20. Ticket 21
21. Ticket 5
22. Ticket 22
23. Ticket 23
24. Ticket 24
25. Ticket 25
26. Ticket 26

## Notes
- The launch path focuses on clarity, safety, and evidence-grounded outputs.
- The should-have and nice-to-have items can be added after the core patient workflow is stable.
- Each ticket is written to be directly usable as an AI coding prompt with clear scope and acceptance criteria.
