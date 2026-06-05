# Product Requirements Document: SecondSight Pro

## 1. Overview
SecondSight Pro is a medical opinion reconciliation platform that helps patients understand why multiple doctors may disagree and what to do next. It compares diagnoses, treatment plans, prescriptions, tests, and urgency levels across multiple opinions, then translates the differences into a clear, evidence-grounded summary for the patient.

The product is not a diagnosis engine. It does not prescribe treatment or replace licensed care. Its job is to reduce confusion, improve decision quality, and help patients prepare for the next specialist conversation.

## 2. Problem Statement
Patients with serious or uncertain health conditions often receive conflicting opinions from multiple doctors. The conflict can be difficult to interpret:
- Is this normal medical complexity?
- Is one doctor more conservative and another more aggressive?
- Is there a genuine risk of misdiagnosis?
- What evidence should the patient ask for next?

Today, patients usually resolve this through fragmented follow-up calls, personal research, and guesswork. That creates anxiety, delays, and poor decisions. SecondSight Pro gives the patient a structured way to compare opinions, see what differs, and understand when further specialist review or diagnostic confirmation is warranted.

## 3. Who It Is For
Primary users:
- Patients seeking a second or third medical opinion
- Family members and caregivers helping a patient navigate disagreement between doctors

Secondary users:
- Patient advocates
- Care coordinators
- Medical concierge services
- Specialist clinics that want to help patients prepare before consultation

## 4. Product Goals
- Make conflicting medical opinions easier to understand
- Ground explanations in trusted evidence, not freeform guesswork
- Help users know what questions to ask next
- Reduce anxiety by turning uncertainty into a structured next step
- Feel trustworthy, premium, and easy to use on mobile and desktop

## 5. Core User Promise
"When doctors disagree, patients deserve clarity."

## 6. Core Features

| Feature | Must-Have in MVP | Nice-to-Have Later |
|---|---:|---:|
| Upload or enter multiple doctor opinions | Yes |  |
| Compare diagnosis, treatment, prescriptions, tests, urgency | Yes |  |
| Conflict score and explanation of why it happened | Yes |  |
| Evidence-grounded summaries with citations | Yes |  |
| Specialist-ready next questions | Yes |  |
| Multilingual summaries in English, Hindi, Hinglish | Yes |  |
| OCR for scanned reports/prescriptions | Yes |  |
| Case history | Yes |  |
| Voice assistant for spoken explanations | Yes |  |
| Exportable specialist report | Yes |  |
| Manual correction after OCR | Yes |  |
| Confidence indicators and explainability panel | Yes |  |
| Trusted medical corpus retrieval | Yes |  |
| LiveKit/Sarvam voice mode | Yes |  |
| Advanced analytics dashboard | No for MVP | Yes |
| Clinician collaboration workspace | No for MVP | Yes |
| FHIR integration | No for MVP | Yes |
| Enterprise RBAC | No for MVP | Yes |

## 7. Must-Have User Flow
1. User lands on the app and sees a clear medical disclaimer and value proposition.
2. User creates or opens a case.
3. User uploads a prescription, report, or enters multiple doctor opinions manually.
4. OCR extracts text from scanned documents when needed.
5. User reviews and corrects extracted data if confidence is low.
6. The system compares opinions and retrieves trusted supporting evidence.
7. The app produces:
- conflict score
- explanation of disagreement
- evidence citations
- next questions to ask a specialist
- multilingual summary
8. User opens case history, generates a specialist report, or switches to voice mode for a spoken explanation.

## 8. MVP Definition
The MVP should be strong enough for a hackathon demo and useful enough for real users.

MVP includes:
- Manual entry of 2 to 5 doctor opinions
- Upload of PDF/image report or prescription
- OCR extraction with correction UI
- Evidence-grounded analysis using trusted corpus
- Conflict scoring and explainability breakdown
- Specialist question generation
- English, Hindi, and Hinglish outputs
- Case history
- Printable/shareable report
- Voice assistant fallback mode if live voice is unavailable

MVP should feel polished, medically responsible, and fast.

## 9. What We Are Deliberately Not Building in Version One
- Diagnosis automation
- Prescription generation
- Emergency triage replacement
- Full clinician collaboration tools
- Enterprise admin systems
- FHIR interoperability
- Complex role-based permissions
- Insurance workflows
- Billing
- Appointment booking
- Full medical records system
- Broad medical AI chatbot behavior without evidence grounding

## 10. Success Metrics
Product success:
- 70%+ of users complete a case analysis after starting one
- 50%+ of users generate or open a specialist report
- 40%+ of users use multilingual output or voice mode
- 60%+ of users report the explanation reduced confusion

Quality and trust:
- Low rate of unsafe or uncited medical claims
- High citation coverage in generated summaries
- OCR correction rate below a manageable threshold
- Clear emergency escalation behavior when needed

Engagement:
- Average time to first useful analysis under 3 minutes
- Repeat case usage for follow-up opinions
- Export/report generation usage rate

## 11. Product Principles
- Safety first
- Evidence over hype
- Clarity over complexity
- Decision support only
- Respect medical uncertainty
- Always show when the system is unsure

## 12. Assumptions
- Users are not medical experts.
- Users may be stressed, confused, and time-sensitive.
- The product must work well on mobile.
- Trusted evidence must come from a pre-indexed medical corpus, not live web retrieval.
- The app should be understandable in English, Hindi, and Hinglish.
- The best demo is a real patient journey: upload, compare, explain, ask, and report.

## 13. One-Sentence PRD Summary
SecondSight Pro is an evidence-grounded medical opinion reconciliation platform that helps patients understand conflicting doctor advice, see why opinions differ, and prepare the safest next specialist conversation.
