# Medical Guideline RAG

This repository has been reduced to a guideline retrieval backend that returns evidence-backed medical citations and a trusted, citation-grounded summary.

## What is kept
- Guideline retrieval
- Citation engine
- Trusted medical response generation

## What is removed from the runtime surface
- Chatbot and voice flows
- Case analysis and opinion conflict logic
- OCR and reporting flows
- Frontend UI startup path

## API

Base URL: `http://localhost:8080/api`

- `GET /health`
- `POST /evidence/search`
- `POST /evidence/citations`
- `POST /evidence/guidelines`

### Request body

```json
{
  "query": "conflicting diabetes treatment",
  "limit": 5,
  "disease": "diabetes",
  "specialty": "endocrinology",
  "urgency": "soon",
  "condition": "prescription mismatch",
  "sources": ["WHO", "NIH"]
}
```

## Service helpers

The backend now exposes two retrieval helpers for direct use inside the API layer:

- `fetchEvidence()` returns the ranked evidence bundle and citations.
- `fetchGuidelines()` returns the same evidence plus a grounded summary string.

## Local run

```bash
npm install
npm run dev
```

The backend runs on `http://localhost:8080` by default.
