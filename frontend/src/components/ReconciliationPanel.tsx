import type { ReconciliationOutput, UiBlock } from "../types";

interface ReconciliationPanelProps {
  analysis: ReconciliationOutput | null;
  onCopySummary: () => void;
}

export function ReconciliationPanel({ analysis, onCopySummary }: ReconciliationPanelProps) {
  if (!analysis) {
    return (
      <section className="panel result-panel">
        <div className="section-title-row">
          <h2>Reconciliation Output</h2>
          <p>Run analysis to compare medical opinions</p>
        </div>
        <div className="empty-state">
          <p>No analysis yet. Add doctor opinions and click "Run AI Analysis".</p>
        </div>
      </section>
    );
  }

  const getBlockClassName = (color: string) => {
    switch (color) {
      case "green":
        return "ui-block ui-block-green";
      case "yellow":
        return "ui-block ui-block-yellow";
      case "red":
        return "ui-block ui-block-red";
      default:
        return "ui-block";
    }
  };

  return (
    <section className="panel result-panel">
      <div className="section-title-row">
        <h2>Reconciliation Engine Output</h2>
        <p>Premium medical conflict analysis and explainability</p>
      </div>

      <div className="reconciliation-summary">
        <div className="conflict-score-banner">
          <p className="meta-label">Overall Conflict Score</p>
          <p className="risk-score">{analysis.conflict_score}</p>
          <p className="risk-tier">Agreement: {analysis.agreement_score}</p>
          <p className="confidence">Confidence: {analysis.confidence_level}</p>
        </div>
        <div className="summary-text">
          <p><strong>Summary:</strong> {analysis.summary}</p>
        </div>
      </div>

      <div className="visual-explanation-grid">
        {analysis.visual_explanation_blocks.map((block: UiBlock, idx: number) => (
          <div key={`block-${idx}`} className={getBlockClassName(block.color)}>
            <h3>{block.title}</h3>
            <ul>
              {block.items.map((item, i) => (
                <li key={`item-${i}`}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="result-card multilingual-card">
        <h3>Multilingual Support</h3>
        <p><strong>English:</strong> {analysis.multilingual_output.english}</p>
        <p><strong>Hindi:</strong> {analysis.multilingual_output.hindi}</p>
        <p><strong>Hinglish:</strong> {analysis.multilingual_output.hinglish}</p>
      </div>

      <div className="result-footer">
        <button type="button" className="button ghost" onClick={onCopySummary}>
          Copy Executive Summary
        </button>
        <p>
          Safety notice: {analysis.safety_disclaimer}
        </p>
        {analysis.manual_correction_required && (
          <p className="warning-text">Manual correction flow triggered due to low confidence.</p>
        )}
      </div>

      <style>{`
        .reconciliation-summary {
          display: flex;
          gap: 16px;
          margin-bottom: 24px;
        }
        .conflict-score-banner {
          background: #1a1f2e;
          padding: 16px;
          border-radius: 8px;
          flex: 1;
        }
        .summary-text {
          flex: 2;
          background: #f8fafc;
          padding: 16px;
          border-radius: 8px;
          color: #334155;
          font-size: 1rem;
        }
        .visual-explanation-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 24px;
        }
        .ui-block {
          padding: 16px;
          border-radius: 8px;
          border-left: 4px solid transparent;
          background-color: #ffffff;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .ui-block h3 {
          margin-top: 0;
          font-size: 1.1rem;
          margin-bottom: 12px;
        }
        .ui-block ul {
          margin: 0;
          padding-left: 20px;
        }
        .ui-block li {
          margin-bottom: 6px;
        }
        .ui-block-green {
          border-left-color: #10b981;
          background-color: #ecfdf5;
        }
        .ui-block-yellow {
          border-left-color: #f59e0b;
          background-color: #fffbeb;
        }
        .ui-block-red {
          border-left-color: #ef4444;
          background-color: #fef2f2;
        }
        .multilingual-card {
          margin-bottom: 24px;
          background: #f1f5f9;
        }
        .warning-text {
          color: #ef4444;
          font-weight: bold;
          margin-top: 8px;
        }
      `}</style>
    </section>
  );
}
