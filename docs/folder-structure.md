# Folder Structure

```text
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
    types/
    utils/

frontend/
  src/
    components/
      ui/
    constants/
    lib/
    pages/
    services/
    utils/
```

## Ownership

- `services/`: domain logic, OCR, RAG, language, voice, analysis.
- `repositories/`: persistence and Supabase access.
- `integrations/`: third-party client setup.
- `pages/`: top-level product surfaces.
- `components/ui/`: reusable shadcn-style primitives.
