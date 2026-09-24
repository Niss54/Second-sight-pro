import type { PatientCaseInput } from "../types";
import { toLines } from "../utils/format";
import { OpinionCard } from "./OpinionCard";
import { DocumentUploadPanel } from "./DocumentUploadPanel";
import {
  Plus,
  Play,
  RotateCcw,
  Save,
  CheckCircle2,
  Sparkles,
  Loader2
} from "lucide-react";

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
        specialty: "General Medicine",
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
        updateOpinion(caseData.opinions.length - 1, newOpinion);
      }
    } else if (type === "report") {
      onChange({
        ...caseData,
        primaryCondition: data.diagnosis || data.primaryCondition || caseData.primaryCondition,
        patientAge: data.patientInfo?.age || caseData.patientAge,
        comorbidities: Array.from(new Set([...caseData.comorbidities, ...(data.report_type ? [data.report_type] : []), ...(data.background ? [data.background] : [])])),
        symptoms: Array.from(new Set([...caseData.symptoms, ...(data.observations || []), ...(data.keyFindings || [])]))
      });
    }
  };

  return (
    <section className="panel input-panel" style={{ borderRadius: "20px", background: "var(--card)", border: "1px solid var(--line)", padding: "28px", boxShadow: "var(--shadow-sm)" }}>
      
      {/* OCR Document Uploader */}
      <DocumentUploadPanel onExtractionComplete={handleExtractionComplete} />

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px", marginTop: "24px", marginBottom: "20px" }}>
        <div>
          <h2 style={{ fontSize: "1.45rem", fontWeight: 700, margin: "0 0 6px", color: "var(--ink-900)" }}>
            Case Intake & Prescriptions
          </h2>
          <p style={{ margin: 0, color: "var(--ink-500)", fontSize: "0.92rem" }}>
            Add 2 to 5 contradictory clinical opinions to trigger automated reconciliation
          </p>
        </div>

        <button
          type="button"
          onClick={onLoadDemo}
          className="button ghost"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "0.85rem",
            padding: "8px 14px",
            borderRadius: "999px",
            border: "1px solid var(--teal)",
            color: "var(--teal)",
            fontWeight: 600
          }}
        >
          <Sparkles size={15} />
          <span>Cycle Demo Cases</span>
        </button>
      </div>

      {/* Case Demographics Grid */}
      <div className="field-grid case-grid" style={{ marginBottom: "16px" }}>
        <label>
          <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--ink-700)", marginBottom: "4px", display: "block" }}>
            Case Identifier / Label
          </span>
          <input
            value={caseData.caseLabel ?? ""}
            onChange={(event) => onChange({ ...caseData, caseLabel: event.target.value })}
            placeholder="e.g., Uncontrolled Type 2 Diabetes vs Renal Sparing"
          />
        </label>

        <label>
          <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--ink-700)", marginBottom: "4px", display: "block" }}>
            Primary Medical Condition *
          </span>
          <input
            value={caseData.primaryCondition}
            onChange={(event) => onChange({ ...caseData, primaryCondition: event.target.value })}
            placeholder="e.g., Severe Hypertension with Peripheral Edema"
          />
        </label>

        <label>
          <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--ink-700)", marginBottom: "4px", display: "block" }}>
            Patient Age
          </span>
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
            placeholder="e.g., 54"
          />
        </label>

        {/* ABHA ID */}
        <label>
          <span style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px", fontSize: "0.85rem", fontWeight: 600, color: "var(--ink-700)" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#1A5F3C",
                color: "#fff",
                fontSize: "10px",
                fontWeight: 700,
                borderRadius: "4px",
                padding: "2px 6px",
                letterSpacing: "0.03em"
              }}
            >
              ABDM
            </span>
            <span>ABHA Health ID</span>
            <span style={{ fontSize: "11px", color: "var(--ink-300)", fontWeight: 400 }}>(Optional)</span>
          </span>
          <input
            id="abha-id-input"
            type="text"
            value={caseData.abha_id ?? ""}
            onChange={(e) =>
              onChange({ ...caseData, abha_id: e.target.value || undefined })
            }
            placeholder="14-digit ABHA or user@abdm"
            maxLength={50}
            style={{ fontFamily: "monospace", letterSpacing: "0.03em" }}
          />
          {caseData.abha_id && (
            <p
              style={{
                fontSize: "11px",
                color: "#1A5F3C",
                margin: "4px 0 0",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                fontWeight: 500
              }}
            >
              <CheckCircle2 size={12} />
              <span>ABHA ID linked — case stored with ABDM registry</span>
            </p>
          )}
        </label>
      </div>

      {/* Comorbidities & Symptoms */}
      <div className="field-grid case-grid" style={{ marginBottom: "24px" }}>
        <label>
          <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--ink-700)", marginBottom: "4px", display: "block" }}>
            Pre-existing Comorbidities (One per line)
          </span>
          <textarea
            rows={2}
            value={caseData.comorbidities.join("\n")}
            onChange={(event) =>
              onChange({
                ...caseData,
                comorbidities: toLines(event.target.value)
              })
            }
            placeholder="Type 2 Diabetes (10 yrs)&#10;Mild Renal Impairment"
          />
        </label>

        <label>
          <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--ink-700)", marginBottom: "4px", display: "block" }}>
            Reported Symptoms (One per line)
          </span>
          <textarea
            rows={2}
            value={caseData.symptoms.join("\n")}
            onChange={(event) =>
              onChange({
                ...caseData,
                symptoms: toLines(event.target.value)
              })
            }
            placeholder="Frequent urination&#10;Dizziness and headache"
          />
        </label>
      </div>

      {/* Opinions Section Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingBottom: "12px",
          borderBottom: "1px solid var(--line)",
          marginBottom: "18px"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <h3 style={{ fontSize: "1.15rem", fontWeight: 700, margin: 0, color: "var(--ink-900)" }}>
            Doctor Opinions
          </h3>
          <span
            style={{
              background: "rgba(13, 124, 115, 0.12)",
              color: "var(--teal)",
              fontSize: "0.8rem",
              fontWeight: 700,
              padding: "2px 8px",
              borderRadius: "999px"
            }}
          >
            {caseData.opinions.length} / {MAX_OPINIONS} Opinions
          </span>
        </div>

        <button
          type="button"
          className="button ghost"
          disabled={caseData.opinions.length >= MAX_OPINIONS}
          onClick={addOpinion}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "0.85rem",
            padding: "6px 14px",
            borderRadius: "999px",
            fontWeight: 600
          }}
        >
          <Plus size={15} />
          <span>Add Doctor Opinion</span>
        </button>
      </div>

      {/* Opinion Cards Stack */}
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

      {/* Bottom Sticky Action Toolbar */}
      <div
        className="action-row"
        style={{
          display: "flex",
          gap: "12px",
          justifyContent: "flex-end",
          alignItems: "center",
          flexWrap: "wrap",
          paddingTop: "20px",
          marginTop: "16px",
          borderTop: "1px solid var(--line)"
        }}
      >
        <button
          type="button"
          className="button ghost"
          onClick={onReset}
          style={{ display: "inline-flex", alignItems: "center", gap: "6px", borderRadius: "999px", padding: "10px 18px" }}
        >
          <RotateCcw size={15} />
          <span>Reset</span>
        </button>

        <button
          type="button"
          className="button ghost"
          disabled={isSaving}
          onClick={onSave}
          style={{ display: "inline-flex", alignItems: "center", gap: "6px", borderRadius: "999px", padding: "10px 20px" }}
        >
          {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          <span>{isSaving ? "Saving..." : "Save Case"}</span>
        </button>

        <button
          type="button"
          className="button primary"
          disabled={isAnalyzing}
          onClick={onAnalyze}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            borderRadius: "999px",
            padding: "12px 28px",
            fontSize: "1rem",
            fontWeight: 700,
            boxShadow: "0 6px 20px rgba(13, 124, 115, 0.25)"
          }}
        >
          {isAnalyzing ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              <span>Reconciling Opinions...</span>
            </>
          ) : (
            <>
              <Play size={18} />
              <span>Run AI Analysis</span>
            </>
          )}
        </button>
      </div>

    </section>
  );
}
