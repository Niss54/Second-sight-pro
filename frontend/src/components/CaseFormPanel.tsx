import type { PatientCaseInput } from "../types";
import { toLines } from "../utils/format";
import { OpinionCard } from "./OpinionCard";
import { DocumentUploadPanel } from "./DocumentUploadPanel";

const MIN_OPINIONS = 2;
const MAX_OPINIONS = 5;

interface CaseFormPanelProps {
  caseData: PatientCaseInput;
  onChange: (next: PatientCaseInput) => void;
  onAnalyze: () => void;
  onSave: () => void;
  onReset: () => void;
  onLoadDemo: () => void;
  isAnalyzing: boolean;
  isSaving: boolean;
}

export function CaseFormPanel({
  caseData,
  onChange,
  onAnalyze,
  onSave,
  onReset,
  onLoadDemo,
  isAnalyzing,
  isSaving
}: CaseFormPanelProps) {
  const updateOpinion = (index: number, nextOpinion: PatientCaseInput["opinions"][number]) => {
    const nextOpinions = caseData.opinions.map((opinion, currentIndex) =>
      currentIndex === index ? nextOpinion : opinion
    );

    onChange({
      ...caseData,
      opinions: nextOpinions
    });
  };

  const addOpinion = () => {
    if (caseData.opinions.length >= MAX_OPINIONS) {
      return;
    }

    onChange({
      ...caseData,
      opinions: [
        ...caseData.opinions,
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
  };

  const removeOpinion = (index: number) => {
    if (caseData.opinions.length <= MIN_OPINIONS) {
      return;
    }

    onChange({
      ...caseData,
      opinions: caseData.opinions.filter((_, currentIndex) => currentIndex !== index)
    });
  };

  const handleExtractionComplete = (type: "ocr" | "report", data: any) => {
    if (type === "ocr") {
      const newOpinion = {
        doctorName: "Extracted Prescription",
        specialty: "General",
        urgency: "routine" as any,
        diagnosis: "",
        treatment: "",
        prescriptions: data.medicines || [],
        tests: data.tests || [],
        notes: [
          ...(data.doctor_notes || []),
          data.dosage?.length ? "Dosage Info: " + data.dosage.join(", ") : ""
        ].filter(Boolean).join("\n")
      };
      
      if (caseData.opinions.length < MAX_OPINIONS) {
        onChange({
          ...caseData,
          opinions: [...caseData.opinions, newOpinion]
        });
      } else {
        // If max reached, replace the last one
        updateOpinion(caseData.opinions.length - 1, newOpinion);
      }
    } else if (type === "report") {
      onChange({
        ...caseData,
        primaryCondition: data.primaryCondition || caseData.primaryCondition,
        patientAge: data.patientInfo?.age || caseData.patientAge,
        comorbidities: Array.from(new Set([...caseData.comorbidities, ...(data.background ? [data.background] : [])])),
        symptoms: Array.from(new Set([...caseData.symptoms, ...(data.keyFindings || [])]))
      });
    }
  };

  return (
    <section className="panel input-panel">
      <DocumentUploadPanel onExtractionComplete={handleExtractionComplete} />
      <div className="section-title-row">
        <h2>Case Intake</h2>
        <p>Capture 2-5 clinical opinions for conflict analysis</p>
      </div>

      <div className="field-grid case-grid">
        <label>
          Case Label
          <input
            value={caseData.caseLabel ?? ""}
            onChange={(event) => onChange({ ...caseData, caseLabel: event.target.value })}
            placeholder="e.g., Complex breast lesion"
          />
        </label>

        <label>
          Primary Condition
          <input
            value={caseData.primaryCondition}
            onChange={(event) => onChange({ ...caseData, primaryCondition: event.target.value })}
            placeholder="e.g., Severe migraine with visual aura"
          />
        </label>

        <label>
          Patient Age
          <input
            type="number"
            min={0}
            max={120}
            value={caseData.patientAge ?? ""}
            onChange={(event) => {
              const raw = event.target.value;
              onChange({
                ...caseData,
                patientAge: raw === "" ? null : Number(raw)
              });
            }}
          />
        </label>
      </div>

      <div className="field-grid case-grid">
        <label>
          Comorbidities
          <textarea
            rows={2}
            value={caseData.comorbidities.join("\n")}
            onChange={(event) =>
              onChange({
                ...caseData,
                comorbidities: toLines(event.target.value)
              })
            }
            placeholder="Diabetes\nHypertension"
          />
        </label>

        <label>
          Symptoms
          <textarea
            rows={2}
            value={caseData.symptoms.join("\n")}
            onChange={(event) =>
              onChange({
                ...caseData,
                symptoms: toLines(event.target.value)
              })
            }
            placeholder="Headache\nDizziness"
          />
        </label>
      </div>

      <div className="opinion-toolbar">
        <h3>Doctor Opinions</h3>
        <button
          type="button"
          className="button ghost"
          disabled={caseData.opinions.length >= MAX_OPINIONS}
          onClick={addOpinion}
        >
          + Add Opinion
        </button>
      </div>

      <div className="opinion-stack">
        {caseData.opinions.map((opinion, index) => (
          <OpinionCard
            key={`opinion-${index}`}
            index={index}
            opinion={opinion}
            canRemove={caseData.opinions.length > MIN_OPINIONS}
            onChange={(nextOpinion) => updateOpinion(index, nextOpinion)}
            onRemove={() => removeOpinion(index)}
          />
        ))}
      </div>

      <div className="action-row">
        <button type="button" className="button ghost" onClick={onLoadDemo}>
          Load Demo
        </button>
        <button type="button" className="button ghost" onClick={onReset}>
          Reset
        </button>
        <button type="button" className="button ghost" disabled={isSaving} onClick={onSave}>
          {isSaving ? "Saving..." : "Save Case"}
        </button>
        <button type="button" className="button primary" disabled={isAnalyzing} onClick={onAnalyze}>
          {isAnalyzing ? "Analyzing..." : "Run AI Analysis"}
        </button>
      </div>
    </section>
  );
}

