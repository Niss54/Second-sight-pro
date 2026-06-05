import type { DoctorOpinionInput } from "../types";
import { linesToText, toLines } from "../utils/format";

interface OpinionCardProps {
  index: number;
  opinion: DoctorOpinionInput;
  canRemove: boolean;
  onChange: (next: DoctorOpinionInput) => void;
  onRemove: () => void;
}

export function OpinionCard({ index, opinion, canRemove, onChange, onRemove }: OpinionCardProps) {
  return (
    <article className="opinion-card">
      <div className="opinion-head">
        <h4>Opinion {index + 1}</h4>
        {canRemove ? (
          <button type="button" className="link-danger" onClick={onRemove}>
            Remove
          </button>
        ) : null}
      </div>

      <div className="field-grid">
        <label>
          Doctor Name
          <input
            value={opinion.doctorName}
            onChange={(event) => onChange({ ...opinion, doctorName: event.target.value })}
            placeholder="Dr. Name"
          />
        </label>

        <label>
          Specialty
          <input
            value={opinion.specialty}
            onChange={(event) => onChange({ ...opinion, specialty: event.target.value })}
            placeholder="e.g., Neurologist"
          />
        </label>

        <label>
          Urgency
          <select
            value={opinion.urgency}
            onChange={(event) =>
              onChange({
                ...opinion,
                urgency: event.target.value as DoctorOpinionInput["urgency"]
              })
            }
          >
            <option value="routine">Routine</option>
            <option value="soon">Soon (days)</option>
            <option value="urgent">Urgent (24-48h)</option>
            <option value="emergency">Emergency</option>
          </select>
        </label>
      </div>

      <label>
        Diagnosis
        <textarea
          rows={3}
          value={opinion.diagnosis}
          onChange={(event) => onChange({ ...opinion, diagnosis: event.target.value })}
          placeholder="Diagnosis / differential / staging"
        />
      </label>

      <label>
        Treatment Plan
        <textarea
          rows={3}
          value={opinion.treatment}
          onChange={(event) => onChange({ ...opinion, treatment: event.target.value })}
          placeholder="Proposed treatment strategy"
        />
      </label>

      <div className="field-grid">
        <label>
          Prescriptions (line separated)
          <textarea
            rows={3}
            value={linesToText(opinion.prescriptions)}
            onChange={(event) => onChange({ ...opinion, prescriptions: toLines(event.target.value) })}
            placeholder="Levothyroxine | 50 mcg daily"
          />
        </label>

        <label>
          Tests / Procedures (line separated)
          <textarea
            rows={3}
            value={linesToText(opinion.tests)}
            onChange={(event) => onChange({ ...opinion, tests: toLines(event.target.value) })}
            placeholder="MRI with contrast"
          />
        </label>
      </div>

      <label>
        Additional Notes
        <textarea
          rows={2}
          value={opinion.notes || ""}
          onChange={(event) => onChange({ ...opinion, notes: event.target.value })}
          placeholder="Optional notes from consultation"
        />
      </label>
    </article>
  );
}

