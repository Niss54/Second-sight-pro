# API Contracts

Base URL: `/api`

## Uploads

`POST /uploads`

Multipart fields:
- `file`: PDF/image/text file
- `caseId`: optional case id

Returns `UploadedFileRecord`.

## OCR

`POST /ocr/extract`

Body:
```json
{ "fileId": "string" }
```

Returns `OcrExtractionResult`.

## Analyze

`POST /analyze`

Body:
```json
{ "caseData": "PatientCaseInput", "language": "en|hi|hinglish" }
```

Returns `GroundedAnalysis`.

## Evidence

`POST /evidence/search`

Body:
```json
{ "query": "string", "filters": { "source": "NIH", "urgency": "emergency" } }
```

Returns `EvidenceCitation[]`.

## Explainability

`GET /explainability/:caseId`

Returns `ExplainabilityBreakdown[]`.

## Specialist Questions

`GET /questions/:caseId`

Returns evidence-grounded specialist questions.

## Multilingual Summary

`POST /i18n/summary`

Body:
```json
{ "analysis": "GroundedAnalysis", "language": "en|hi|hinglish" }
```

## Voice

`POST /voice/session`

Body:
```json
{ "caseId": "string", "language": "en|hi|hinglish" }
```

Returns LiveKit token when configured, otherwise text fallback mode.

## Reports

`GET /reports/:caseId`

Returns specialist-ready report JSON and plain text.
