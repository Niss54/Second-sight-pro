import type { DoctorOpinionInput } from "../types";
import { linesToText, toLines } from "../utils/format";
import { Stethoscope, Trash2, AlertCircle, Pill, FlaskConical, FileText } from "lucide-react";

interface OpinionCardProps {
  index: number;
  opinion: DoctorOpinionInput;
  canRemove: boolean;
  onChange: (next: DoctorOpinionInput) => void;
  onRemove: () => void;
}

export function OpinionCard({ index, opinion, canRemove, onChange, onRemove }: OpinionCardProps) {
  const getDoctorAccent = (idx: number) => {
    const accents = [
      { color: "var(--teal)", bg: "rgba(13, 124, 115, 0.08)", border: "rgba(13, 124, 115, 0.25)", label: "Doctor A (Primary)" },
      { color: "#2563eb", bg: "rgba(37, 99, 235, 0.08)", border: "rgba(37, 99, 235, 0.25)", label: "Doctor B (Second Opinion)" },
      { color: "#8b5cf6", bg: "rgba(139, 92, 246, 0.08)", border: "rgba(139, 92, 246, 0.25)", label: "Doctor C (Specialist)" },
      { color: "#f59e0b", bg: "rgba(245, 158, 11, 0.08)", border: "rgba(245, 158, 11, 0.25)", label: "Doctor D (Consultant)" },
      { color: "#ec4899", bg: "rgba(236, 72, 153, 0.08)", border: "rgba(236, 72, 153, 0.25)", label: "Doctor E" }
    ];
    return accents[idx % accents.length];
  };

  const accent = getDoctorAccent(index);

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case "emergency":
        return { label: "Emergency", bg: "rgba(239, 68, 68, 0.12)", color: "#ef4444", dot: "#ef4444" };
      case "urgent":
        return { label: "Urgent (24–48h)", bg: "rgba(245, 158, 11, 0.12)", color: "#f59e0b", dot: "#f59e0b" };
      case "soon":
        return { label: "Soon (days)", bg: "rgba(59, 130, 246, 0.12)", color: "#3b82f6", dot: "#3b82f6" };
      default:
        return { label: "Routine", bg: "rgba(34, 197, 94, 0.12)", color: "#22c55e", dot: "#22c55e" };
    }
  };

  const urgencyStyle = getUrgencyBadge(opinion.urgency);

  return (
    <article
      className="opinion-card"
      style={{
        borderTop: `3px solid ${accent.color}`,
        borderRadius: "16px",
        background: "var(--card)",
        border: "1px solid var(--line)",
        boxShadow: "var(--shadow-sm)",
        padding: "20px",
        marginBottom: "16px",
        transition: "all 0.2s ease"
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              background: accent.bg,
              color: accent.color,
              display: "grid",
              placeItems: "center"
            }}
          >
            <Stethoscope size={18} />
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 700, color: "var(--ink-900)" }}>
              {opinion.doctorName || `Doctor ${String.fromCharCode(65 + index)}`}
            </h4>
            <span style={{ fontSize: "0.8rem", color: accent.color, fontWeight: 600 }}>
              {accent.label}
            </span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {/* Urgency Badge */}
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "4px 10px",
              borderRadius: "999px",
              background: urgencyStyle.bg,
              color: urgencyStyle.color,
              fontSize: "0.8rem",
              fontWeight: 600
            }}
          >
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: urgencyStyle.dot }} />
            {urgencyStyle.label}
          </span>

          {canRemove && (
            <button
              type="button"
              onClick={onRemove}
              title="Remove this doctor opinion"
              style={{
                background: "none",
                border: "none",
                color: "var(--ink-300)",
                cursor: "pointer",
                padding: "6px",
                borderRadius: "6px",
                display: "grid",
                placeItems: "center",
                transition: "all 0.15s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#ef4444";
                e.currentTarget.style.background = "rgba(239, 68, 68, 0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--ink-300)";
                e.currentTarget.style.background = "none";
              }}
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Grid: Doctor Name, Specialty, Urgency */}
      <div className="field-grid" style={{ marginBottom: "14px" }}>
        <label>
          <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--ink-700)", marginBottom: "4px", display: "block" }}>
            Doctor Name
          </span>
          <input
            value={opinion.doctorName}
            onChange={(event) => onChange({ ...opinion, doctorName: event.target.value })}
            placeholder="e.g. Dr. Rajesh Sharma, MD"
            style={{ width: "100%" }}
          />
        </label>

        <label>
          <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--ink-700)", marginBottom: "4px", display: "block" }}>
            Specialty
          </span>
          <input
            value={opinion.specialty}
            onChange={(event) => onChange({ ...opinion, specialty: event.target.value })}
            placeholder="e.g. Endocrinologist / Cardiologist"
            style={{ width: "100%" }}
          />
        </label>

        <label>
          <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--ink-700)", marginBottom: "4px", display: "block" }}>
            Urgency Assessment
          </span>
          <select
            value={opinion.urgency}
            onChange={(event) =>
              onChange({
                ...opinion,
                urgency: event.target.value as DoctorOpinionInput["urgency"]
              })
            }
            style={{ width: "100%" }}
          >
            <option value="routine">Routine (Elective)</option>
            <option value="soon">Soon (Days)</option>
            <option value="urgent">Urgent (24–48 Hours)</option>
            <option value="emergency">Emergency (Immediate)</option>
          </select>
        </label>
      </div>

      {/* Diagnosis */}
      <label style={{ display: "block", marginBottom: "14px" }}>
        <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--ink-700)", marginBottom: "4px", display: "flex", alignItems: "center", gap: "6px" }}>
          <AlertCircle size={14} color="var(--teal)" />
          <span>Doctor's Diagnosis & Findings</span>
        </span>
        <textarea
          rows={2}
          value={opinion.diagnosis}
          onChange={(event) => onChange({ ...opinion, diagnosis: event.target.value })}
          placeholder="e.g., Uncontrolled Type 2 Diabetes with peripheral neuropathy risk (HbA1c 9.2%)"
          style={{ width: "100%" }}
        />
      </label>

      {/* Treatment Plan */}
      <label style={{ display: "block", marginBottom: "14px" }}>
        <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--ink-700)", marginBottom: "4px", display: "flex", alignItems: "center", gap: "6px" }}>
          <FileText size={14} color="#2563eb" />
          <span>Recommended Treatment Plan</span>
        </span>
        <textarea
          rows={2}
          value={opinion.treatment}
          onChange={(event) => onChange({ ...opinion, treatment: event.target.value })}
          placeholder="e.g., Immediate switch to combination therapy. Strict dietary monitoring."
          style={{ width: "100%" }}
        />
      </label>

      {/* Prescriptions & Diagnostic Tests */}
      <div className="field-grid" style={{ marginBottom: "14px" }}>
        <label>
          <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--ink-700)", marginBottom: "4px", display: "flex", alignItems: "center", gap: "6px" }}>
            <Pill size={14} color="#f59e0b" />
            <span>Prescriptions (One per line)</span>
          </span>
          <textarea
            rows={2}
            value={linesToText(opinion.prescriptions)}
            onChange={(event) => onChange({ ...opinion, prescriptions: toLines(event.target.value) })}
            placeholder="Metformin 1000mg BD&#10;Glimepiride 2mg OD"
            style={{ width: "100%", fontFamily: "monospace", fontSize: "0.88rem" }}
          />
        </label>

        <label>
          <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--ink-700)", marginBottom: "4px", display: "flex", alignItems: "center", gap: "6px" }}>
            <FlaskConical size={14} color="#8b5cf6" />
            <span>Ordered Tests / Scans</span>
          </span>
          <textarea
            rows={2}
            value={linesToText(opinion.tests)}
            onChange={(event) => onChange({ ...opinion, tests: toLines(event.target.value) })}
            placeholder="HbA1c test&#10;Kidney Function Test (KFT)"
            style={{ width: "100%", fontFamily: "monospace", fontSize: "0.88rem" }}
          />
        </label>
      </div>

      {/* Clinical Notes */}
      <label style={{ display: "block" }}>
        <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--ink-500)", marginBottom: "4px", display: "block" }}>
          Additional Clinical Notes / Patient History
        </span>
        <input
          value={opinion.notes ?? ""}
          onChange={(event) => onChange({ ...opinion, notes: event.target.value })}
          placeholder="e.g., Patient warned of hypoglycemia symptoms; advised blood sugar log"
          style={{ width: "100%", fontSize: "0.88rem" }}
        />
      </label>
    </article>
  );
}
