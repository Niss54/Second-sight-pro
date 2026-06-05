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

export const demoCase: PatientCaseInput = {
  caseLabel: "Conflicting Breast Lesion Opinions",
  primaryCondition: "Breast lesion with discordant imaging and pathology interpretation",
  patientAge: 49,
  comorbidities: ["Type 2 diabetes", "Hypothyroidism"],
  symptoms: ["Intermittent breast pain", "Nipple discharge"],
  opinions: [
    {
      doctorName: "Dr. N. Ahuja",
      specialty: "Breast Surgeon",
      urgency: "urgent",
      diagnosis: "Suspicious malignant lesion likely requiring surgical intervention.",
      treatment: "Proceed for lumpectomy after repeat targeted biopsy.",
      prescriptions: ["Tamoxifen | 10 mg once daily"],
      tests: ["Core needle biopsy repeat", "PET-CT"],
      notes: "High concern due to irregular margins"
    },
    {
      doctorName: "Dr. R. Iyer",
      specialty: "Radiologist",
      urgency: "soon",
      diagnosis: "Likely atypical benign lesion with inflammatory changes.",
      treatment: "Image-guided surveillance for 8-12 weeks before surgery.",
      prescriptions: ["Ibuprofen | 400 mg twice daily"],
      tests: ["MRI breast with contrast", "Follow-up ultrasound"],
      notes: "Radiology and pathology discordance"
    },
    {
      doctorName: "Dr. M. Fernandes",
      specialty: "Medical Oncologist",
      urgency: "routine",
      diagnosis: "Indeterminate lesion; requires molecular and receptor confirmation.",
      treatment: "Do not begin definitive treatment until receptor and genomic panel is complete.",
      prescriptions: ["Tamoxifen | 20 mg once daily"],
      tests: ["ER/PR/HER2 panel", "Genomic risk assay"],
      notes: "Requests complete biology before treatment direction"
    }
  ]
};

