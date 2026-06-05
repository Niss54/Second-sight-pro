# Implementation Roadmap

## Priority 1: Demo-Critical

Build the judge-visible path first: upload a report, extract entities, analyze conflict, retrieve evidence, show citations, and generate specialist questions.

## Priority 2: Experience Layer

Add multilingual summaries, premium dashboard UX, explainability charts, and voice assistant fallback.

## Priority 3: Production Readiness

Harden deployment, Supabase RLS, environment management, and migration scripts.

## Risk Controls

- Keep existing conflict engine as the stable core.
- Use deterministic fallbacks when Supabase, LLM, Sarvam, or LiveKit keys are missing.
- Never generate clinical claims without corpus evidence.
- Keep the demo corpus small and transparent.
