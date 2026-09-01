# TODO2 - Hackathon Upgrade Checklist

## Phase 1 - Demo Foundation
- [ ] Add architecture and implementation docs
- [ ] Add Supabase env config and client
- [ ] Add Supabase Auth middleware with demo fallback
- [ ] Replace JSON writes with Supabase-ready repository abstraction
- [ ] Add DB schema and migration plan

## Phase 2 - Evidence Grounding
- [ ] Add trusted medical corpus folders
- [ ] Add corpus seed documents
- [ ] Add corpus ingestion script
- [ ] Add hybrid retrieval service
- [ ] Add citation-aware analysis response

## Phase 3 - OCR and Specialist Workflow
- [ ] Add file upload API
- [ ] Add OCR extraction API
- [ ] Add entity extraction and confidence scoring
- [ ] Add specialist questions API
- [ ] Add report API

## Phase 4 - Multilingual and Voice
- [ ] Add English/Hindi/Hinglish summary API
- [ ] Add Sarvam service wrapper
- [ ] Add LiveKit session API
- [ ] Add text fallback for voice assistant

## Phase 5 - Premium Frontend
- [ ] Add Tailwind and shadcn-style primitives
- [ ] Add page-based app shell
- [ ] Add upload/OCR review UI
- [ ] Add evidence and explainability panels
- [ ] Add voice assistant view
- [ ] Add settings and deployment guidance

## Acceptance Criteria
- [ ] Upload a prescription/report and extract structured data
- [ ] Analyze 2-3 conflicting opinions with evidence citations
- [ ] Show risk contributors and confidence
- [ ] Generate Hindi/Hinglish/English summaries safely
- [ ] Create specialist-ready report
- [ ] Build and lint pass
