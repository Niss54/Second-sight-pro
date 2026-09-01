# SecondSight Pro Security and Access Document

## 1. Purpose

This document explains how SecondSight Pro should control access, protect user data, handle failures, and prevent unsafe behavior before launch.

SecondSight Pro is a medical opinion reconciliation platform. It helps users compare conflicting doctor opinions and understand the next best question to ask. It does not diagnose disease, prescribe medicine, or replace licensed medical care.

## 2. Best-Fit Authentication Method

### Recommended choice: Supabase Auth with email-based sign-in

This is the best fit for SecondSight Pro because:
- It is simple for non-technical patients to use.
- It is secure enough for a healthcare-adjacent product.
- It reduces custom authentication code in the backend.
- It works well with Supabase Row Level Security.
- It supports future expansion without rebuilding auth later.

### Recommended sign-in experience

Use one of these in the MVP:
- Magic link by email
- One-time password by email
- Optional Google sign-in later if needed

### Why not custom auth for version one

Custom username/password auth creates more security work, more password reset risk, and more room for mistakes. For this product, the safest and fastest path is managed auth with database-level access control.

## 3. User Roles

SecondSight Pro should stay intentionally simple in version one.

### Role 1: Patient Owner

This is the main user.

Can:
- Create an account
- Sign in and sign out
- Create a case
- Edit their own case
- Upload reports or prescriptions
- Run analysis
- View citations and explainability
- Generate specialist questions
- Use multilingual summaries
- Use voice mode
- View and export their own reports
- Delete their own data

Cannot:
- See another user’s cases
- Edit trusted medical evidence
- Change system prompts or retrieval logic
- Access admin-only configuration
- Prescribe medicine or diagnose disease through the app

### Role 2: Support Admin

This role is only for the internal team operating the product.

Can:
- Review system health
- Troubleshoot failed uploads or analysis runs
- Inspect logs and non-clinical operational data
- Help a user recover access if support process is needed

Cannot:
- Edit a patient’s medical interpretation unless the product explicitly includes a support workflow
- View all patient data by default without a support process and audit trail
- Change analysis output on behalf of a patient
- Access data outside the support ticket or support reason

### Role 3: System Service Account

This is not a human user. It is used by the backend.

Can:
- Insert and read rows needed for uploads, analysis, and evidence retrieval
- Write vector embeddings and analysis results
- Create voice session records

Cannot:
- Be used interactively by a human
- Bypass security rules for frontend users
- Share credentials with the browser

### Role 4: Anonymous Visitor

This is someone browsing the landing page before sign-in.

Can:
- Read public marketing and safety content
- View the product explanation

Cannot:
- Access any medical case data
- Upload documents
- Run analysis
- View reports

## 4. Database Access Rules in Plain English

SecondSight Pro should use Row Level Security so the database itself blocks data leaks.

### `users`

- A person can read and update only their own profile.
- No one can read another person’s profile.

### `medical_cases`

- A user can create a case for themselves.
- A user can read, update, and delete only their own cases.
- A user cannot see another user’s cases.

### `doctor_opinions`

- A user can create opinions only inside their own cases.
- A user can read, update, and delete only opinions attached to their own cases.
- A user cannot edit another person’s opinions.

### `uploaded_files`

- A user can upload files only for their own account.
- A user can read and delete only their own files.
- A user cannot inspect another person’s upload metadata or extracted text.

### `analysis_results`

- A user can see only the analysis results generated for their own cases.
- A user cannot read someone else’s scores, citations, or report content.

### `voice_sessions`

- A user can create and read only their own voice sessions.
- Voice transcripts must stay private to the case owner.

### `medical_evidence`

- Authenticated users can read evidence.
- Only the backend or ingestion process can write evidence.
- Regular users cannot edit or delete trusted evidence.

### Storage bucket rules

The upload bucket should be private.

- Users can upload only to paths tied to their own user id.
- Users can read only files attached to their own cases.
- Files should never be public by default.

## 5. Error Handling Guide

This section explains the major failure points and what the app should do.

### 5.1 Sign-in failure

Examples:
- Bad email
- Expired magic link
- Invalid OTP
- Supabase auth outage

User-facing behavior:
- Show a simple message like “We could not verify your sign-in. Please try again.”

System behavior:
- Do not create a partial account session.
- Log the error without exposing tokens or secrets.

### 5.2 Session expired

Examples:
- User stays idle too long
- Refresh token expires

User-facing behavior:
- Ask the user to sign in again.
- Keep any unsaved form data locally if possible.

System behavior:
- Clear protected API access until the session is renewed.

### 5.3 Permission denied

Examples:
- User tries to open another person’s case
- User tries to access evidence or files they should not see

User-facing behavior:
- Show “You do not have access to this case.”

System behavior:
- Return `403 Forbidden`
- Do not reveal whether the record exists to unauthorized users when possible

### 5.4 File upload failure

Examples:
- File too large
- Unsupported type
- Storage upload fails
- Network interruption

User-facing behavior:
- Show a clear upload error and allow retry
- Tell the user if the file type is not supported

System behavior:
- Do not create a broken file record
- Mark the upload as failed if a record already exists

### 5.5 OCR failure

Examples:
- Image too blurry
- PDF text cannot be read
- OCR confidence too low

User-facing behavior:
- Show extracted text if available
- Mark low-confidence fields clearly
- Ask the user to manually correct the text

System behavior:
- Save raw OCR output only if safe and needed
- Set `needsManualReview = true`

### 5.6 Evidence retrieval failure

Examples:
- Vector search returns no useful result
- Corpus not seeded
- Metadata filter too strict

User-facing behavior:
- Say evidence support is limited for this case
- Still return a safe summary based on the conflict engine

System behavior:
- Fall back to deterministic conflict analysis
- Never invent evidence

### 5.7 LLM failure

Examples:
- Provider timeout
- Rate limit
- Invalid model key
- Response format invalid

User-facing behavior:
- Show a fallback summary
- Do not block the user from continuing

System behavior:
- Use the deterministic safety fallback
- Keep citations and conflict explanation intact where possible

### 5.8 Voice failure

Examples:
- LiveKit unavailable
- Sarvam unavailable
- Browser permissions denied
- Microphone not found

User-facing behavior:
- Switch to text mode automatically
- Explain that voice is temporarily unavailable

System behavior:
- Preserve the transcript if any text was captured
- Do not crash the session

### 5.9 Report generation failure

Examples:
- PDF/export service error
- Missing analysis data

User-facing behavior:
- Show a retry button
- Let the user still copy the plain text summary

System behavior:
- Save the failed attempt for debugging

### 5.10 Database or Supabase outage

Examples:
- Auth unavailable
- Database write failed
- Storage access failed

User-facing behavior:
- Show a simple “service temporarily unavailable” message
- Keep the app usable in read-only or demo fallback mode where possible

System behavior:
- Retry transient calls safely
- Do not duplicate writes unless the operation is idempotent

### 5.11 Safety filter failure

Examples:
- The model tries to sound like it is diagnosing
- The prompt returns a prescription-like statement

User-facing behavior:
- Replace unsafe text with a safety notice

System behavior:
- Block the output
- Regenerate or fall back to a safer response

## 6. Edge Cases to Handle Before Launch

- The user uploads a blurry photo of a prescription.
- The user uploads a PDF that is actually a scanned image.
- The uploaded document contains handwriting.
- OCR extracts the wrong dosage or test name.
- The user enters only one opinion instead of two or more.
- The user compares opinions that are actually from different medical conditions.
- The user changes the language midway through analysis.
- The LLM returns a response without citations.
- Two doctors use different words for the same condition.
- The app receives an emergency symptom like chest pain, stroke signs, severe bleeding, or trouble breathing.
- A user tries to see another person’s case through a shared link or direct URL.
- The retrieval engine finds no relevant evidence.
- The same upload is sent twice because of a network retry.
- A voice session starts but the microphone is blocked by the browser.
- A user leaves the page midway through upload or OCR.
- A report is generated before analysis has completed.
- A user deletes a case and then tries to reopen it from history.
- A case contains contradictory medication instructions for the same drug.
- A case contains a mix of routine and emergency urgency levels.
- A translation to Hindi or Hinglish risks losing a medical term, so the original term should be preserved.
- A support admin needs access for debugging, but the access must be logged and limited.

## 7. Practical Security Rules for the Team

- Use Supabase Auth for all sign-in flows.
- Use Row Level Security on every user-owned table.
- Keep uploads private by default.
- Never store Supabase service role keys in the frontend.
- Never show raw secrets, tokens, or private URLs in the UI.
- Log operational errors, not patient content unless necessary for debugging and permitted by policy.
- Default to safe fallback responses when AI, OCR, or voice services fail.
- Keep the medical evidence corpus read-only after ingestion.

## 8. Launch Checklist

- Auth works with expired-session handling.
- RLS blocks cross-user data access.
- Uploads are private.
- OCR low-confidence cases require manual review.
- Evidence-less answers fall back safely.
- Voice mode has a text fallback.
- Emergency escalation messaging is present.
- Unsafe diagnosis or prescription language is filtered out.
- All major user actions are logged at the application level without exposing secrets.

## 9. Bottom Line

For SecondSight Pro, the safest and best-fit access model is:
- Supabase Auth for identity
- RLS for database protection
- private storage buckets for uploads
- service-role access only in backend code
- safe fallback behavior when AI, OCR, or voice components fail

That gives the product a clean security posture without making the experience heavy for patients.
