# SecondSight Pro Frontend Specification

## 1. Purpose

This document defines the frontend design system and integration contract for SecondSight Pro, an evidence-grounded AI Medical Opinion Reconciliation Platform.

The frontend should help a stressed non-technical user upload or enter conflicting medical opinions, understand the differences, review trusted evidence, and generate a specialist-ready next step.

The interface must feel:
- premium
- medically trustworthy
- calm and readable
- fast on mobile
- easy to demo in under a few minutes

The app must never feel like a diagnosis chatbot.

## 2. Frontend Tech Stack

Recommended stack:
- React
  - Best fit for a multi-step, stateful medical workflow.
  - Easy to build reusable case, dashboard, and report screens.
- Vite
  - Fast local development and production builds.
  - Good for quick iteration during product demos.
- TypeScript
  - Prevents data-shape mistakes in complex case, OCR, and analysis flows.
  - Makes API contracts easier to maintain.
- Tailwind CSS
  - Best fit for a design-system-driven UI.
  - Makes consistent spacing, responsive layouts, and variants easier to maintain.
- shadcn/ui-style components
  - Accessible primitives for buttons, inputs, dialogs, tabs, and dropdowns.
  - Keeps the app polished without locking it into a heavy component framework.
- Framer Motion
  - Subtle page, panel, and state animations.
  - Gives the product a premium feel without distracting the user.
- Recharts
  - Best fit for score breakdowns and explainability charts.
- Lucide React
  - Clean icon set for upload, copy, audio, history, and report actions.

## 3. Product Layout Principles

- The app should feel like a clinical decision workspace, not a marketing website.
- Use full-width sections with a centered content width.
- Avoid nesting big cards inside other cards.
- Use cards only for repeated items, summary items, modals, or small grouped tools.
- Keep text density moderate so the user can scan quickly without feeling crowded.
- Make every important action visible on first glance.
- Use icons alongside action labels where they improve clarity.
- Keep all critical controls reachable on mobile.
- Never rely on decorative blobs or distracting motion.
- All medical explanations must show citations or a safety fallback.

## 4. Design System

### 4.1 Color Palette

Use these exact colors as the base palette.

#### Neutrals

| Token | Hex | Use |
|---|---:|---|
| `ink-900` | `#102A2F` | Main text, headings, important UI labels |
| `ink-700` | `#355459` | Secondary text, body copy |
| `ink-500` | `#5F7D7F` | Hints, metadata, timestamps |
| `surface-0` | `#FFFDF8` | Main card and panel background |
| `surface-1` | `#F4F5EF` | Soft section background |
| `surface-2` | `#FFFFFF` | Elevated modal and popover surfaces |
| `border` | `#D9DED3` | Default border color |

#### Brand and Accent

| Token | Hex | Use |
|---|---:|---|
| `primary` | `#0F7A73` | Primary buttons, active states, emphasis |
| `primary-deep` | `#0B5F5A` | Hover state for primary actions |
| `accent-amber` | `#C46D1F` | Alerts, highlights, evidence emphasis |
| `accent-blue` | `#1C4F7B` | Informational panels, citations, links |
| `accent-violet` | `#4B5DBA` | Secondary accent for charts and tags |

#### Semantic

| Token | Hex | Use |
|---|---:|---|
| `success-bg` | `#E8F7EF` | Success banners |
| `success-ink` | `#195F3A` | Success text |
| `warning-bg` | `#FFF7E8` | Low confidence, caution, review needed |
| `warning-ink` | `#8A5717` | Warning text |
| `error-bg` | `#FFECE8` | Error banners |
| `error-ink` | `#8F2B22` | Error text |
| `info-bg` | `#E9F4FF` | Informational state |
| `info-ink` | `#1C4F7B` | Informational text |

#### Gradient Guidelines

- Use soft gradients only.
- Approved examples:
  - `linear-gradient(150deg, #FAF5E8 0%, #EEF5F1 72%, #F8EFE4 100%)`
  - `linear-gradient(145deg, #0F7A73, #0B5F5A)` for primary button fills
- Avoid neon gradients and high-saturation backgrounds.

### 4.2 Typography

#### Font Stack

- Headings: `Fraunces`
  - Gives the product a calm, editorial, premium medical feel.
- Body: `Space Grotesk`
  - Clean, modern, readable on long screens and dashboards.
- Mono / data: `ui-monospace`, `SFMono-Regular`, `Consolas`, `Liberation Mono`, `monospace`
  - Use for ids, codes, timestamps, and technical tokens.

#### Type Scale

| Element | Size | Line Height | Weight | Use |
|---|---:|---:|---:|---|
| `H1` | `48px` | `56px` | `600` | Page title or landing hero title |
| `H2` | `32px` | `40px` | `600` | Section titles |
| `H3` | `24px` | `32px` | `600` | Panel titles and report blocks |
| `H4` | `18px` | `28px` | `600` | Card titles, subsection labels |
| Body | `16px` | `24px` | `400` | Standard copy |
| Small | `14px` | `20px` | `400` | Metadata and helper text |
| Tiny | `12px` | `16px` | `500` | Status labels and chips |

#### Typography Rules

- Headings should be short and clear.
- Avoid giant marketing copy inside the app workspace.
- Keep letter spacing at `0`.
- Never scale font size purely by viewport width.
- Use sentence case for most UI labels.

### 4.3 Spacing Scale

Use an 8-point system with these tokens:
- `4`
- `8`
- `12`
- `16`
- `24`
- `32`
- `40`
- `48`
- `64`
- `80`

Rules:
- Small gaps for form controls and metadata.
- Medium gaps for grouped content sections.
- Larger gaps only between major sections.
- Keep whitespace generous enough to reduce anxiety, but not so large that the app feels empty.

### 4.4 Layout Rules

- Desktop max content width: `1400px`
- Reading width for long text: `72ch` to `76ch`
- Primary dashboard layout: two columns on desktop, single column on tablet/mobile
- Use sticky side panels only when they help the user continue comparing the same case
- Use full-width section bands for major app areas
- Use cards for repeatable items like opinions, evidence sources, case history rows
- Cards should have `8px` radius or less
- Modal dialogs can use `12px` to `16px` radius
- Minimum touch target: `44px`

### 4.5 Elevation and Shape

- Cards: subtle shadow, thin border, `8px` radius
- Inputs: `12px` radius
- Buttons: pill or rounded rectangle, depending on button type
- Modals: larger rounded surface with overlay
- Chips/tags: small rounded capsules

### 4.6 Motion

Use only subtle motion:
- fade and slide on page load
- soft scale/opacity for dialogs
- gentle hover elevation on buttons and cards
- small stagger for dashboard reveal

Do not use:
- long bouncy transitions
- infinite decorative motion
- large parallax effects

## 5. Component Styles

### 5.1 Buttons

#### Primary Button

Use for the single most important action on a screen, such as Analyze, Save, Generate, or Continue.

Style:
- background: `primary` to `primary-deep` gradient
- text: white
- height: `44px` minimum
- radius: pill or `12px`
- shadow: light
- icon: use Lucide icon when the action is recognizable, such as upload, copy, microphone, or download

States:
- default: solid primary fill
- hover: slightly darker
- active: reduced elevation
- disabled: 50-60% opacity
- loading: spinner + label change

#### Secondary Button

Use for actions like Open, Refresh, or Review.

Style:
- background: white or `surface-1`
- border: `border`
- text: `ink-900`
- icon optional

#### Ghost Button

Use for low-priority actions or toolbar items.

Style:
- transparent background
- text: `ink-700`
- hover: light surface tint

#### Destructive Button

Use for delete actions only.

Style:
- background: `error-bg`
- text: `error-ink`
- border: light red tint

### 5.2 Inputs

Use for text, textarea, select, email, and numeric entry.

Style:
- background: white
- border: `1px solid border`
- radius: `12px`
- padding: comfortable but compact
- height: `44px` for single-line fields
- text color: `ink-900`
- placeholder: `ink-500`

States:
- default: neutral border
- hover: slightly darker border
- focus: `2px` teal ring with low-opacity background glow
- error: red border and helper text
- disabled: muted background and lower contrast

Rules:
- Every input needs a visible label.
- Use helper text for upload guidance and OCR uncertainty.
- Use textarea for multi-line medical notes and test lists.

### 5.3 Cards

Use cards for:
- opinion items
- analysis blocks
- evidence snippets
- case history rows

Style:
- background: `surface-0` or `surface-2`
- border: `border`
- radius: `8px`
- shadow: minimal
- padding: `16px` to `24px`

Rules:
- Never put a card inside another large card.
- Keep titles compact.
- Show status labels and confidence markers at the top right or bottom.

### 5.4 Modals

Use for:
- OCR correction
- upload preview
- voice permission guidance
- report export options

Style:
- overlay: `rgba(16, 42, 47, 0.6)`
- surface: white
- radius: `16px`
- max width: `720px`
- centered vertically and horizontally
- focus trap required

Behavior:
- close on escape
- close on backdrop click only when safe
- preserve form state when closing

### 5.5 Tabs and Segmented Controls

Use for:
- English / Hindi / Hinglish switch
- Dashboard / Explainability / Report views
- text / voice mode

Style:
- active state filled
- inactive state outlined
- compact and accessible

### 5.6 Chips / Tags

Use for:
- urgency labels
- source labels
- confidence labels
- specialty labels

Style:
- small capsule
- subtle border
- color-coded background only when helpful

### 5.7 Alerts and Status Banners

Use for:
- upload success
- OCR low confidence
- no evidence found
- emergency warning
- auth/session issues

Style:
- clear color coding
- short sentence copy
- icon on the left
- never verbose

### 5.8 Evidence Citations

Citations should be rendered as compact source rows or badges.

Each citation should include:
- source name
- short snippet
- confidence indicator
- optional source link or reference id

The evidence panel should clearly show when something is supported by trusted guidance, for example:
- “Supported by Mayo Clinic + NIH guidance”

### 5.9 File Upload Dropzone

Use for:
- prescriptions
- scanned reports
- PDFs
- images

Style:
- dashed border
- clear drag-and-drop affordance
- upload icon
- file type hint
- progress bar during upload and OCR

States:
- idle
- dragging
- uploading
- OCR processing
- low confidence
- completed
- failed

## 6. Page Structure

The frontend should be organized around these surfaces:

1. Landing page
2. Upload Case
3. Conflict Analysis Dashboard
4. Explainability View
5. Voice Assistant
6. Case History
7. Specialist Summary Report
8. Settings

### Landing Page

Sections:
- hero
- problem statement
- how it works
- demo section
- features
- trust indicators
- medical disclaimer
- CTA

### Upload Case

Includes:
- case metadata
- multiple doctor opinion inputs
- file upload dropzone
- OCR progress
- manual correction state

### Conflict Analysis Dashboard

Includes:
- final score
- risk tier
- disagreement cards
- evidence panel
- next steps

### Explainability View

Includes:
- score contributors
- confidence indicators
- chart breakdowns
- explanation of why the score changed

### Voice Assistant

Includes:
- language selector
- microphone button
- transcript view
- AI response view
- fallback text input

### Case History

Includes:
- saved cases
- open/reanalyze/report actions
- last score snapshot

### Specialist Summary Report

Includes:
- printable summary
- citations
- specialist questions
- emergency note

### Settings

Includes:
- language defaults
- voice provider status
- account/session status
- safety disclaimer

## 7. Integration Spec for Third-Party Services

This section lists every external service the frontend or backend relies on in version one.

### 7.1 Supabase Auth

What it does:
- signs users in and out
- stores session state
- supplies JWTs for protected data access

Why it is used:
- it is the best fit for a patient-facing product that needs security without complex custom auth code

Who calls it:
- frontend for sign-in and sign-out
- backend for verified user checks

Primary methods and endpoints:
- `supabase.auth.signInWithOtp(...)`
- `supabase.auth.getSession()`
- `supabase.auth.getUser()`
- `supabase.auth.refreshSession()`
- `supabase.auth.signOut()`

Data sent:
- email address for passwordless sign-in
- optional redirect URL
- access token or refresh token when the session is refreshed

Expected response:
- session object
- user object
- email delivery confirmation or auth error

Important behavior:
- use `getUser()` on the server when you need a trusted user identity
- do not rely on unverified local session state for security decisions

### 7.2 Supabase Postgres

What it does:
- stores cases, opinions, uploads, analyses, voice sessions, and evidence

Who calls it:
- backend repository layer
- possibly frontend for read-only session-aware access later

Primary API style:
- Supabase JavaScript client against the database REST layer
- tables accessed through `from('table').select(...)`, `insert(...)`, `update(...)`, `delete(...)`

Typical data sent:
- case metadata
- doctor opinions
- OCR results
- analysis results
- evidence rows

Expected response:
- inserted or updated rows
- selected rows with typed records
- errors for constraint or permission issues

Important behavior:
- RLS must be enabled on all user-owned tables
- service-role access should stay server-side only

### 7.3 Supabase Storage

What it does:
- stores uploaded prescriptions, scans, and reports privately

Who calls it:
- backend upload flow
- possibly frontend upload flow if direct browser uploads are enabled later

Primary endpoints / methods:
- `supabase.storage.from('case-uploads').upload(path, file, options)`
- `supabase.storage.from('case-uploads').createSignedUrl(path, expiresIn)`
- `supabase.storage.from('case-uploads').download(path)`

Data sent:
- binary file
- file path
- MIME type
- metadata such as owner and case id

Expected response:
- storage path
- object metadata
- signed URL when requested
- upload error on file type, permission, or size failure

Important behavior:
- the bucket should be private
- file paths should be scoped per user and case
- uploaded files should never be public by default

### 7.4 OpenAI-Compatible LLM

What it does:
- produces grounded medical summaries, specialist questions, and report text after retrieval has been assembled

Who calls it:
- backend analysis service only

Primary endpoint:
- `POST https://api.openai.com/v1/responses`

Data sent:
- `model`
- `instructions`
- `input`
- optional structured output configuration
- retrieved evidence snippets and case context

Expected response:
- text or structured JSON
- token usage
- optional refusal or error if the model cannot comply

Important behavior:
- the LLM must only see curated evidence and case context
- it must never invent unsupported medical claims
- if the response is unsafe or malformed, the backend must use a safe fallback summary

### 7.5 LiveKit

What it does:
- provides real-time voice session infrastructure for the voice assistant

Who calls it:
- backend creates signed access tokens
- frontend joins the room with the token

Primary integration:
- backend endpoint: `POST /api/voice/session`
- backend uses LiveKit server SDK to sign an access token
- frontend uses the returned token to connect to the LiveKit room URL

Data sent:
- case id
- user id
- language
- room name or session name

Expected response from backend:
- room name
- access token
- websocket/room URL
- provider availability flags

Expected response from LiveKit connection:
- joined room
- active media session
- errors if microphone permission, token expiry, or room access fails

Important behavior:
- if LiveKit is unavailable, the app must fall back to text mode

### 7.6 Sarvam AI

What it does:
- handles multilingual speech-to-text, text-to-speech, and optional chat assistance for Indian languages and Hinglish

Who calls it:
- backend voice and multilingual services

#### Speech-to-Text

Primary endpoints:
- `POST https://api.sarvam.ai/speech-to-text/job/v1`
- `POST https://api.sarvam.ai/speech-to-text/job/v1/upload-files`
- `POST https://api.sarvam.ai/speech-to-text/job/v1/:job_id/start`
- `GET https://api.sarvam.ai/speech-to-text/job/v1/:job_id/status`
- `POST https://api.sarvam.ai/text-to-speech/stream` is not STT and should not be confused with it
- streaming STT is also available through the documented websocket path referenced by the provider

Data sent:
- audio file or audio stream
- model selection, usually Saaras v3
- language/output mode such as transcribe, translate, verbatim, transliterate, or codemix
- optional diarization or codec settings for batch jobs

Expected response:
- transcript text
- detected language code
- job id and processing state for batch flows

Use in SecondSight Pro:
- convert spoken Hindi/Hinglish/English into text for safe grounded analysis
- if the audio is longer or noisier, use batch mode

#### Text-to-Speech

Primary endpoints:
- `POST https://api.sarvam.ai/text-to-speech`
- `POST https://api.sarvam.ai/text-to-speech/stream`
- streaming websocket API as documented by Sarvam for low-latency playback

Data sent:
- text to speak
- `target_language_code`
- speaker voice
- model `bulbul:v3`
- pace and output format when needed

Expected response:
- `request_id`
- base64 audio strings
- audio bytes after decode

Use in SecondSight Pro:
- speak the explanation back in English, Hindi, or Hinglish
- keep the tone calm and non-alarming

#### Chat Completion

Primary endpoint:
- `POST https://api.sarvam.ai/v1/chat/completions`

Data sent:
- messages array
- model, usually `sarvam-30b` or `sarvam-105b`
- temperature and optional tool metadata

Expected response:
- chat completion message content
- usage fields
- error codes for invalid input, rate limits, or service errors

Use in SecondSight Pro:
- optional multilingual phrasing or fallback explanation when a Sarvam text assistant is preferred

Important behavior:
- preserve medical terms where translation could weaken accuracy
- keep the output evidence-aware and safety-constrained

## 8. Frontend Environment Variables

Use these values in the frontend build:
- `VITE_API_BASE_URL`
  - backend API base URL
- `VITE_SUPABASE_URL`
  - Supabase project URL
- `VITE_SUPABASE_ANON_KEY`
  - public auth key for client sign-in
- `VITE_LIVEKIT_URL`
  - LiveKit server URL

Do not put private secrets in the browser bundle.

## 9. UI State and Error Handling Rules

- Show loading states during upload, OCR, retrieval, analysis, and report generation.
- Show low-confidence OCR warnings instead of hiding uncertain data.
- Allow manual correction whenever OCR confidence is low.
- Fall back to safe text explanations when voice or AI services fail.
- Keep a visible medical disclaimer in every major workflow.
- Use a calm error style, not a dramatic one.
- Never show a blank screen when a service is unavailable if a safe fallback exists.

## 10. Accessibility Rules

- All fields need labels.
- Buttons must have clear text or icon + text.
- Color is never the only way to explain state.
- Contrast must remain readable on mobile and desktop.
- Focus states must be visible.
- Upload and voice controls must be keyboard accessible.
- Reports should be printable and readable in a low-distraction layout.

## 11. What Not to Build in the Frontend v1

- Heavy animation systems
- Complex admin panels
- Enterprise permission matrices
- Full EHR replacement
- Long onboarding flows
- Hidden controls that make the product feel magical but unclear

## 12. Summary

SecondSight Pro should use a simple but premium medical SaaS visual system:
- teal and warm neutral base
- Fraunces for headings
- Space Grotesk for body
- compact, readable cards
- subtle motion
- clear evidence presentation
- calm failure states
- strongly typed service integrations

The frontend must make the product feel trustworthy, modern, and easy to understand in under one minute.
