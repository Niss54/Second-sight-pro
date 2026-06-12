import type { EvidenceCitation } from "../../types/domain";

export interface SeedEvidenceRecord extends EvidenceCitation {
  scoreHint: number;
}

export const SEED_MEDICAL_EVIDENCE: SeedEvidenceRecord[] = [
  {
    id: "who-emergency-flags-001",
    source: "WHO",
    title: "Emergency symptoms require urgent assessment",
    snippet:
      "Rapidly worsening breathing, chest pain, stroke-like symptoms, or sudden severe deterioration should be treated as urgent until a clinician says otherwise.",
    reference: "WHO emergency care guidance summary",
    confidence: 0.97,
    metadata: {
      category: "emergency_flags",
      urgency: "emergency",
      specialty: "emergency medicine",
      disease: "acute deterioration",
      condition: "danger symptoms"
    },
    scoreHint: 0.94
  },
  {
    id: "nih-diagnostic-confirmation-001",
    source: "NIH",
    title: "Uncertain diagnoses often need confirmatory testing",
    snippet:
      "When serious diagnoses conflict, the next safe step is often targeted confirmatory testing or specialist review rather than assuming one opinion is already final.",
    reference: "NIH clinical decision-making summary",
    confidence: 0.95,
    metadata: {
      category: "diagnostic_tests",
      urgency: "soon",
      specialty: "internal medicine",
      disease: "diagnostic uncertainty",
      condition: "conflicting diagnoses"
    },
    scoreHint: 0.9
  },
  {
    id: "medlineplus-medication-reconciliation-001",
    source: "MedlinePlus",
    title: "Medication reconciliation helps prevent unsafe duplication",
    snippet:
      "If two clinicians recommend different medicines or different dosing instructions, the safe next step is to reconcile the full medication list before starting or changing therapy.",
    reference: "MedlinePlus medication safety summary",
    confidence: 0.94,
    metadata: {
      category: "medication_conflicts",
      urgency: "soon",
      specialty: "pharmacy",
      disease: "medication conflict",
      condition: "prescription mismatch"
    },
    scoreHint: 0.88
  },
  {
    id: "mayo-specialist-review-001",
    source: "Mayo Clinic",
    title: "Specialist review helps resolve persistent disagreement",
    snippet:
      "If treatment plans differ materially, a specialist can often clarify the diagnosis, narrow the options, and explain which next test is most useful.",
    reference: "Mayo Clinic patient education summary",
    confidence: 0.95,
    metadata: {
      category: "treatment_guidelines",
      urgency: "soon",
      specialty: "specialist care",
      disease: "treatment disagreement",
      condition: "conflicting plans"
    },
    scoreHint: 0.91
  },
  {
    id: "pubmed-red-flags-001",
    source: "PubMed",
    title: "Red flags should override routine follow-up timing",
    snippet:
      "When there is material disagreement and the patient has red-flag symptoms, the urgency of care should be escalated even if one opinion appears conservative.",
    reference: "PubMed literature summary",
    confidence: 0.9,
    metadata: {
      category: "emergency_flags",
      urgency: "urgent",
      specialty: "triage",
      disease: "high-risk symptoms",
      condition: "urgent escalation"
    },
    scoreHint: 0.87
  },
  {
    id: "nih-follow-up-tests-001",
    source: "NIH",
    title: "Follow-up tests should answer one specific clinical question",
    snippet:
      "When doctors disagree, the next diagnostic test should be chosen because it can actually resolve the uncertainty, not just because it is available.",
    reference: "NIH diagnostic strategy summary",
    confidence: 0.93,
    metadata: {
      category: "diagnostic_tests",
      urgency: "soon",
      specialty: "diagnostics",
      disease: "uncertain diagnosis",
      condition: "test selection"
    },
    scoreHint: 0.89
  },
  {
    id: "who-patient-safety-001",
    source: "WHO",
    title: "Patient safety improves when medication and test histories are reviewed together",
    snippet:
      "A full review of prior prescriptions, investigations, and symptom timing reduces the risk of contradictory advice being missed.",
    reference: "WHO patient safety summary",
    confidence: 0.92,
    metadata: {
      category: "treatment_guidelines",
      urgency: "routine",
      specialty: "patient safety",
      disease: "history review",
      condition: "full context review"
    },
    scoreHint: 0.84
  },
  // ─── NEW ENTRIES START HERE ─────────────────────────────────────────
  {
    id: "icmr-diabetes-metformin-001",
    source: "ICMR",
    title: "Metformin is first-line for Type 2 Diabetes in India",
    snippet:
      "ICMR guidelines recommend Metformin as the first-line pharmacological agent for Type 2 Diabetes unless contraindicated (eGFR <30, hepatic failure, contrast procedures). Start at 500mg once daily and titrate over 4 weeks.",
    reference: "ICMR Clinical Practice Guidelines for Type 2 Diabetes 2022",
    confidence: 0.96,
    metadata: {
      category: "treatment_guidelines",
      urgency: "routine",
      specialty: "endocrinology",
      disease: "type 2 diabetes",
      condition: "first line treatment"
    },
    scoreHint: 0.93
  },
  {
    id: "icmr-diabetes-targets-001",
    source: "ICMR",
    title: "HbA1c targets for diabetic patients in India",
    snippet:
      "HbA1c target for most adults: <7.0%. For elderly patients (>70 years) or those with comorbidities: <8.0%. Fasting glucose target: 80–130 mg/dL. Post-prandial target: <180 mg/dL.",
    reference: "ICMR Clinical Practice Guidelines for Type 2 Diabetes 2022",
    confidence: 0.95,
    metadata: {
      category: "treatment_guidelines",
      urgency: "routine",
      specialty: "endocrinology",
      disease: "type 2 diabetes",
      condition: "glycaemic targets"
    },
    scoreHint: 0.91
  },
  {
    id: "who-drug-ace-arb-combination-001",
    source: "WHO",
    title: "ACE inhibitor and ARB combination should be avoided",
    snippet:
      "Combining an ACE inhibitor (e.g., Ramipril) with an ARB (e.g., Losartan) — called dual renin-angiotensin blockade — increases the risk of hypotension, hyperkalemia, and acute kidney injury without providing additional cardiovascular benefit. This combination should be avoided.",
    reference: "WHO Essential Medicines Drug Interactions Reference 2021",
    confidence: 0.98,
    metadata: {
      category: "medication_conflicts",
      urgency: "urgent",
      specialty: "cardiology",
      disease: "hypertension",
      condition: "ACE inhibitor ARB combination contraindicated"
    },
    scoreHint: 0.96
  },
  {
    id: "who-drug-statin-antibiotic-001",
    source: "WHO",
    title: "Clarithromycin and Simvastatin combination causes myopathy risk",
    snippet:
      "Clarithromycin inhibits CYP3A4 and significantly increases Simvastatin blood levels, causing a high risk of myopathy and rhabdomyolysis. If Clarithromycin is needed, suspend Simvastatin during the antibiotic course and consider switching to Rosuvastatin or Pravastatin.",
    reference: "WHO Essential Medicines Drug Interactions Reference 2021",
    confidence: 0.97,
    metadata: {
      category: "medication_conflicts",
      urgency: "urgent",
      specialty: "pharmacology",
      disease: "drug interaction",
      condition: "statin macrolide interaction"
    },
    scoreHint: 0.94
  },
  {
    id: "icmr-hypertension-india-firstline-001",
    source: "ICMR",
    title: "First-line antihypertensives recommended in India",
    snippet:
      "ICMR 2023 recommends any of: Amlodipine (CCB), Enalapril or Ramipril (ACE inhibitor), Telmisartan or Losartan (ARB), or Hydrochlorothiazide (thiazide) as first-line therapy. Choice depends on comorbidities. For diabetics with microalbuminuria: prefer ACE inhibitor or ARB. For elderly: prefer CCB or low-dose thiazide.",
    reference: "ICMR Consensus Guidelines on Hypertension India 2023",
    confidence: 0.96,
    metadata: {
      category: "treatment_guidelines",
      urgency: "routine",
      specialty: "cardiology",
      disease: "hypertension",
      condition: "first line antihypertensive India"
    },
    scoreHint: 0.93
  },
  {
    id: "icmr-hypertension-resistant-001",
    source: "ICMR",
    title: "Resistant hypertension management — add Spironolactone as fourth agent",
    snippet:
      "Resistant hypertension is defined as BP uncontrolled despite three agents including a diuretic. The most evidence-based fourth agent is Spironolactone 25mg once daily. Rule out secondary causes: primary aldosteronism, renal artery stenosis, obstructive sleep apnoea.",
    reference: "ICMR Consensus Guidelines on Hypertension India 2023",
    confidence: 0.94,
    metadata: {
      category: "treatment_guidelines",
      urgency: "soon",
      specialty: "cardiology",
      disease: "resistant hypertension",
      condition: "uncontrolled BP on three agents"
    },
    scoreHint: 0.90
  },
  {
    id: "who-antibiotic-uti-001",
    source: "WHO",
    title: "Nitrofurantoin is first-line for uncomplicated UTI",
    snippet:
      "WHO AWaRe guidelines recommend Nitrofurantoin 100mg MR twice daily for 5 days as first-choice for uncomplicated urinary tract infection. Avoid Ciprofloxacin as first-line for uncomplicated UTI to preserve fluoroquinolone effectiveness against serious infections.",
    reference: "WHO AWaRe Antibiotic Classification and Stewardship Guidelines 2021",
    confidence: 0.95,
    metadata: {
      category: "treatment_guidelines",
      urgency: "soon",
      specialty: "urology",
      disease: "urinary tract infection",
      condition: "uncomplicated UTI first line"
    },
    scoreHint: 0.92
  },
  {
    id: "who-antibiotic-no-cold-001",
    source: "WHO",
    title: "Antibiotics are NOT indicated for common cold or viral respiratory infections",
    snippet:
      "WHO guidance clearly states antibiotics do not help and should not be prescribed for common cold, rhinitis, acute bronchitis, or influenza. These are viral infections. Inappropriate antibiotic use contributes to antimicrobial resistance. Treatment is symptomatic: rest, hydration, paracetamol for fever.",
    reference: "WHO Global Action Plan on Antimicrobial Resistance 2015",
    confidence: 0.98,
    metadata: {
      category: "treatment_guidelines",
      urgency: "routine",
      specialty: "general practice",
      disease: "viral respiratory infection",
      condition: "antibiotic not indicated"
    },
    scoreHint: 0.95
  },
  {
    id: "nhp-india-cardiovascular-risk-001",
    source: "NHP India",
    title: "Indians develop cardiovascular disease earlier than Western populations",
    snippet:
      "Indian patients develop coronary artery disease and heart attacks approximately 5–10 years earlier than Europeans. The average age of first MI in India is 53 years. South Asians have higher insulin resistance and central obesity at lower BMI. Indian-specific cutoffs: waist >90cm in men and >80cm in women indicates abdominal obesity.",
    reference: "National Health Portal India Preventive Health Guidelines",
    confidence: 0.94,
    metadata: {
      category: "treatment_guidelines",
      urgency: "routine",
      specialty: "cardiology",
      disease: "cardiovascular disease",
      condition: "Indian population cardiovascular risk"
    },
    scoreHint: 0.89
  },
  {
    id: "who-triple-whammy-aki-001",
    source: "WHO",
    title: "Triple Whammy combination causes acute kidney injury",
    snippet:
      "The combination of ACE inhibitor (or ARB) + NSAID + Diuretic is called the 'Triple Whammy' and is the most common cause of drug-induced acute kidney injury in India. This combination severely reduces renal perfusion. Stop the NSAID first if AKI develops. Prefer Paracetamol for pain in patients on this combination.",
    reference: "WHO Essential Medicines Drug Interactions Reference 2021",
    confidence: 0.97,
    metadata: {
      category: "medication_conflicts",
      urgency: "urgent",
      specialty: "nephrology",
      disease: "acute kidney injury",
      condition: "ACE inhibitor NSAID diuretic triple whammy"
    },
    scoreHint: 0.95
  },
  {
    id: "icmr-diabetes-pregnancy-001",
    source: "ICMR",
    title: "Safe and unsafe diabetes medications in pregnancy",
    snippet:
      "In pregnancy, Metformin and Insulin are considered safe for diabetes management. Sulfonylureas (Glimepiride, Gliclazide), SGLT2 inhibitors (Empagliflozin), and GLP-1 agonists (Semaglutide) are NOT recommended during pregnancy. Gestational diabetes target: fasting glucose <95 mg/dL, post-prandial <140 mg/dL at 1 hour.",
    reference: "ICMR Clinical Practice Guidelines for Type 2 Diabetes 2022",
    confidence: 0.96,
    metadata: {
      category: "treatment_guidelines",
      urgency: "urgent",
      specialty: "obstetrics",
      disease: "gestational diabetes",
      condition: "diabetes medications pregnancy safe unsafe"
    },
    scoreHint: 0.94
  },
  {
    id: "who-nsaid-bleeding-001",
    source: "WHO",
    title: "NSAIDs combined with anticoagulants significantly increase bleeding risk",
    snippet:
      "NSAIDs (Ibuprofen, Diclofenac, Naproxen) combined with anticoagulants (Warfarin, Heparin, or DOACs like Rivaroxaban, Apixaban) significantly increase the risk of serious GI and intracranial bleeding. If analgesia is needed in anticoagulated patients, prefer Paracetamol at standard doses. If NSAID is unavoidable, add a PPI (Omeprazole, Pantoprazole).",
    reference: "WHO Essential Medicines Drug Interactions Reference 2021",
    confidence: 0.97,
    metadata: {
      category: "medication_conflicts",
      urgency: "urgent",
      specialty: "haematology",
      disease: "drug interaction",
      condition: "NSAID anticoagulant bleeding risk"
    },
    scoreHint: 0.95
  }
  // ─── NEW ENTRIES END HERE ────────────────────────────────────────────
];
