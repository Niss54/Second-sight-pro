# Medical Evidence Engine

This module is the lightweight evidence layer for SecondSight Pro.

## What it does
- retrieves trusted medical evidence for a query
- returns ranked evidence hits
- formats citations for patient-facing and specialist-facing UI
- supports a local seed corpus fallback and a Supabase-backed production mode

## Public API

```ts
import { createMedicalEvidenceEngine } from "./modules/medical-evidence-engine";

const engine = createMedicalEvidenceEngine();

const evidence = await engine.getMedicalEvidence({
  query: "conflicting diagnosis and medication mismatch",
  disease: "diagnostic uncertainty",
  specialty: "internal medicine",
  limit: 5
});

const citations = await engine.getCitations("conflicting prescriptions");
```

## Production mode
Set these environment variables:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `MEDICAL_EVIDENCE_TABLE`
- `MEDICAL_EVIDENCE_MATCH_FUNCTION`

The module will use the Supabase store when those values are present.

## Expected Supabase shape
The `medical_evidence` table should contain:
- `id`
- `title`
- `snippet`
- `source`
- `reference`
- `confidence`
- `metadata`

If you enable vector search, the matching RPC should return rows with similarity or score fields.

