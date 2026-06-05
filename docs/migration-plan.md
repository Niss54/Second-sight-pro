# JSON to Supabase Migration Plan

## Steps

1. Keep `backend/data/cases.json` read-only for legacy import.
2. Create Supabase tables from `docs/db-schema.sql`.
3. Configure env vars for Supabase URL, anon key, and service role key.
4. Run the migration script to map legacy cases into `medical_cases`, `doctor_opinions`, and `analysis_results`.
5. Switch routes to the repository abstraction.
6. Stop writing to JSON storage.

## Compatibility

Existing route shapes remain mostly unchanged so the frontend can migrate incrementally.
