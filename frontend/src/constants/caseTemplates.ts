import type { PatientCaseInput } from "../types";

export const createBlankCase = (): PatientCaseInput => ({
  caseLabel: "",
  primaryCondition: "",
  patientAge: null,
  comorbidities: [],
  symptoms: [],
  opinions: [
    {
      doctorName: "",
      specialty: "",
      urgency: "routine",
      diagnosis: "",
      treatment: "",
      prescriptions: [],
      tests: [],
      notes: ""
    },
    {
      doctorName: "",
      specialty: "",
      urgency: "routine",
      diagnosis: "",
      treatment: "",
      prescriptions: [],
      tests: [],
      notes: ""
    }
  ]
});

// ─── DEMO CASE 1 — Breast Lesion (existing, India oncology context) ───────────
export const demoCase1: PatientCaseInput = {
  caseLabel: "Breast Lesion — Discordant Opinions",
  primaryCondition: "Breast lesion with discordant imaging and pathology interpretation",
  patientAge: 49,
  comorbidities: ["Type 2 diabetes", "Hypothyroidism"],
  symptoms: ["Intermittent breast pain", "Nipple discharge"],
  opinions: [
    {
      doctorName: "Dr. N. Ahuja",
      specialty: "Breast Surgeon",
      urgency: "urgent",
      diagnosis:
        "Suspicious malignant lesion likely requiring surgical intervention.",
      treatment: "Proceed for lumpectomy after repeat targeted biopsy.",
      prescriptions: ["Tamoxifen 10 mg once daily"],
      tests: ["Core needle biopsy repeat", "PET-CT"],
      notes: "High concern due to irregular margins on imaging"
    },
    {
      doctorName: "Dr. R. Iyer",
      specialty: "Radiologist",
      urgency: "soon",
      diagnosis: "Likely atypical benign lesion with inflammatory changes.",
      treatment: "Image-guided surveillance for 8–12 weeks before surgery.",
      prescriptions: ["Ibuprofen 400 mg twice daily"],
      tests: ["MRI breast with contrast", "Follow-up ultrasound at 8 weeks"],
      notes: "Radiology and pathology discordance noted"
    },
    {
      doctorName: "Dr. M. Fernandes",
      specialty: "Medical Oncologist",
      urgency: "routine",
      diagnosis:
        "Indeterminate lesion; requires molecular and receptor confirmation.",
      treatment:
        "Do not begin definitive treatment until receptor and genomic panel is complete.",
      prescriptions: ["Tamoxifen 20 mg once daily"],
      tests: ["ER/PR/HER2 panel", "Genomic risk assay (Oncotype DX)"],
      notes: "Requests complete tumour biology before treatment direction"
    }
  ]
};

// ─── DEMO CASE 2 — Hypertension (India-specific, ICMR context) ───────────────
export const demoCase2: PatientCaseInput = {
  caseLabel: "Hypertension — Conflicting Drug Choices",
  primaryCondition: "Newly diagnosed Stage 2 Hypertension in a middle-aged Indian male",
  patientAge: 52,
  comorbidities: ["Type 2 diabetes", "Overweight (BMI 26.4)"],
  symptoms: [
    "Persistent headache",
    "Occasional dizziness",
    "Blurred vision episodes"
  ],
  abha_id: "98760043211234",
  opinions: [
    {
      doctorName: "Dr. Priya Sharma",
      specialty: "Cardiologist",
      urgency: "soon",
      diagnosis:
        "Stage 2 hypertension (BP 158/98 mmHg) with high cardiovascular risk given diabetes. Target BP < 130/80 mmHg.",
      treatment:
        "Start ACE inhibitor immediately given diabetic nephropathy risk. Aggressive BP target < 130/80 as per ICMR 2023.",
      prescriptions: [
        "Ramipril 5 mg once daily",
        "Aspirin 75 mg once daily (after meals)"
      ],
      tests: [
        "Fasting lipid profile",
        "Serum creatinine and eGFR",
        "Urine microalbumin (spot ACR)",
        "ECG",
        "Echo if cardiac symptoms"
      ],
      notes:
        "Strong preference for ACE inhibitor due to renoprotective benefit in diabetic hypertension per ICMR and ABDM guidelines."
    },
    {
      doctorName: "Dr. Rakesh Gupta",
      specialty: "General Physician",
      urgency: "routine",
      diagnosis:
        "Hypertension Stage 2. Lifestyle modification possible before pharmacological escalation.",
      treatment:
        "Start with Amlodipine (CCB) as first line — lower risk of ACE inhibitor cough which is common in Indian patients (up to 40%). Add salt restriction < 5g/day, daily walking.",
      prescriptions: [
        "Amlodipine 5 mg once daily",
        "Telmisartan 40 mg once daily if CCB insufficient at 8 weeks"
      ],
      tests: [
        "Fasting lipid profile",
        "HbA1c",
        "Serum electrolytes",
        "Kidney function tests"
      ],
      notes:
        "ACE inhibitor cough affects 15–40% of Indian patients due to ACE gene polymorphism — prefer ARB or CCB as first line for Indian patients."
    }
  ]
};

// ─── DEMO CASE 3 — Type 2 Diabetes (ICMR guidelines conflict) ────────────────
export const demoCase3: PatientCaseInput = {
  caseLabel: "Type 2 Diabetes — Treatment Escalation Conflict",
  primaryCondition:
    "Uncontrolled Type 2 Diabetes (HbA1c 9.2%) — conflicting second-line treatment recommendations",
  patientAge: 58,
  comorbidities: [
    "Hypertension (on Amlodipine)",
    "Overweight (BMI 27.1)",
    "Mild CKD Stage 2 (eGFR 68)"
  ],
  symptoms: ["Excessive thirst", "Frequent urination", "Unexplained weight loss of 3 kg in 2 months"],
  opinions: [
    {
      doctorName: "Dr. Anita Mehta",
      specialty: "Endocrinologist",
      urgency: "soon",
      diagnosis:
        "HbA1c 9.2% — Metformin 1000 mg BD is insufficient. SGLT2 inhibitor indicated per ICMR 2022: cardiovascular and renal protection benefit in CKD Stage 2.",
      treatment:
        "Add Empagliflozin 10 mg once daily to existing Metformin. Monitor for UTI and genital infections. Review eGFR in 4 weeks.",
      prescriptions: [
        "Metformin 1000 mg twice daily (continue)",
        "Empagliflozin 10 mg once daily (add)"
      ],
      tests: [
        "HbA1c at 3 months",
        "eGFR and serum creatinine in 4 weeks",
        "Urine microalbumin",
        "Fasting lipid profile"
      ],
      notes:
        "SGLT2 inhibitor preferred over sulfonylurea for this patient: cardiovascular benefit, weight neutral, low hypoglycemia risk. ICMR 2022 strongly recommends in CKD Stage 2."
    },
    {
      doctorName: "Dr. Suresh Pillai",
      specialty: "General Physician",
      urgency: "soon",
      diagnosis:
        "HbA1c 9.2% — Poor control despite Metformin. Affordable second-line agent needed.",
      treatment:
        "Add Glimepiride (sulfonylurea) — well-established, low cost, widely available in India. SGLT2 inhibitors are expensive and not always covered.",
      prescriptions: [
        "Metformin 1000 mg twice daily (continue)",
        "Glimepiride 1 mg once daily before breakfast (add)"
      ],
      tests: [
        "HbA1c at 3 months",
        "Fasting blood glucose weekly for first month",
        "Kidney function test"
      ],
      notes:
        "Patient is from low-income background. SGLT2 inhibitors cost ₹80–120/day vs Glimepiride ₹2–3/day. Affordability is a critical real-world constraint in Indian primary care."
    },
    {
      doctorName: "Dr. Kavita Rao",
      specialty: "Diabetologist",
      urgency: "urgent",
      diagnosis:
        "HbA1c 9.2% with weight loss — consider insulin initiation per ICMR guidelines. HbA1c > 9% with symptoms warrants immediate insulin.",
      treatment:
        "Do not delay with oral agents alone. Initiate Insulin Glargine 10 units at bedtime. Adjust weekly. Review oral agents after glucose stabilisation.",
      prescriptions: [
        "Metformin 1000 mg twice daily (continue)",
        "Insulin Glargine 10 units subcutaneous at bedtime (initiate)"
      ],
      tests: [
        "Fasting and post-prandial glucose daily for 1 week",
        "HbA1c at 3 months",
        "Liver function test"
      ],
      notes:
        "ICMR 2022 recommends insulin initiation when HbA1c > 10% OR symptomatic hyperglycaemia (weight loss, polyuria present). This patient meets symptom criteria."
    }
  ]
};

// ─── DEMO CASE 4 — Antibiotic conflict (India AMR context) ───────────────────
export const demoCase4: PatientCaseInput = {
  caseLabel: "Recurrent UTI — Antibiotic Prescribing Conflict",
  primaryCondition:
    "Recurrent urinary tract infection in a diabetic female — conflicting antibiotic prescriptions",
  patientAge: 45,
  comorbidities: ["Type 2 diabetes (HbA1c 7.8%)", "Hypertension"],
  symptoms: [
    "Burning micturition",
    "Increased urinary frequency",
    "Low-grade fever (38.1°C)",
    "Lower abdominal discomfort"
  ],
  opinions: [
    {
      doctorName: "Dr. Sunita Bose",
      specialty: "Urologist",
      urgency: "soon",
      diagnosis:
        "Recurrent uncomplicated UTI in a diabetic female. High risk of fluoroquinolone-resistant E. coli in India (resistance > 70% in community). Culture mandatory.",
      treatment:
        "Per WHO AWaRe guidelines: Nitrofurantoin is first-line for uncomplicated UTI. Do NOT use Ciprofloxacin empirically — reserve for complicated UTI. Send urine culture before starting antibiotics.",
      prescriptions: [
        "Nitrofurantoin 100 mg MR twice daily for 5 days"
      ],
      tests: [
        "Urine culture and sensitivity (before antibiotics)",
        "Urine routine and microscopy",
        "Blood glucose fasting",
        "Serum creatinine (Nitrofurantoin contraindicated if eGFR < 30)"
      ],
      notes:
        "WHO AWaRe classifies Nitrofurantoin as Access antibiotic (first-line). Ciprofloxacin is Watch antibiotic — overuse fuelling AMR in India. Fluoroquinolone resistance in community UTI in India exceeds 70%."
    },
    {
      doctorName: "Dr. Ashok Verma",
      specialty: "General Physician",
      urgency: "soon",
      diagnosis: "UTI with low-grade fever suggesting possible early pyelonephritis.",
      treatment:
        "Ciprofloxacin — broad spectrum, fast relief, widely available, patient has used it before with good response. Course: 7 days.",
      prescriptions: [
        "Ciprofloxacin 500 mg twice daily for 7 days",
        "Phenazopyridine 200 mg three times daily for 2 days (symptomatic relief)"
      ],
      tests: [
        "Urine routine",
        "Blood glucose"
      ],
      notes:
        "Patient reports Ciprofloxacin worked last time. Prescribing same for faster relief. Note: patient is also on Metformin — monitor glucose as fluoroquinolones can cause dysglycaemia in diabetics."
    }
  ]
};

// ─── All demo cases — used for cycling with Load Demo button ─────────────────
export const ALL_DEMO_CASES: PatientCaseInput[] = [
  demoCase1,
  demoCase2,
  demoCase3,
  demoCase4
];

// Legacy export for backward compatibility (IntakePage currently uses this name)
export const demoCase = demoCase1;
