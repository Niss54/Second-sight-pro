import { useState, useRef } from "react";
import type { ReconciliationOutput, UiBlock } from "../types";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface ReconciliationPanelProps {
  analysis: ReconciliationOutput | null;
  onCopySummary: () => void;
}

export function ReconciliationPanel({ analysis, onCopySummary }: ReconciliationPanelProps) {
  const [isExporting, setIsExporting] = useState(false);
  const panelRef = useRef<HTMLElement>(null);

  const handleExportPDF = async () => {
    if (!panelRef.current) return;
    setIsExporting(true);
    try {
      // Temporarily add a class to hide buttons during export
      panelRef.current.classList.add("pdf-export-mode");
      
      const canvas = await html2canvas(panelRef.current, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("Medical_Reconciliation_Report.pdf");
      
      panelRef.current.classList.remove("pdf-export-mode");
    } catch (error) {
      console.error("PDF Export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleShareWhatsApp = () => {
    if (!analysis) return;

    // Use Hindi summary if available (multilingual_output may have it)
    const hindiSummary = analysis.multilingual_output?.hindi;
    const hinglishSummary = analysis.multilingual_output?.hinglish;

    // Top citation if available
    const topCitation =
      analysis.citations && analysis.citations.length > 0
        ? analysis.citations[0]
        : null;

    // Build English section
    const englishSection =
      `*🔬 SecondSight Pro — Doctor Opinion Analysis*\n\n` +
      `*Conflict Score:* ${analysis.conflict_score}\n` +
      `*Agreement Level:* ${analysis.agreement_score}\n` +
      `*Confidence:* ${analysis.confidence_level?.toUpperCase() ?? "—"}\n\n` +
      `*Summary:*\n${analysis.summary}\n\n` +
      (analysis.disagreement_reason.length > 0
        ? `*Why doctors disagree:*\n` +
          analysis.disagreement_reason
            .slice(0, 3)
            .map((r, i) => `${i + 1}. ${r}`)
            .join("\n") +
          "\n\n"
        : "") +
      (analysis.specialist_questions.length > 0
        ? `*Questions to ask your specialist:*\n` +
          analysis.specialist_questions
            .slice(0, 4)
            .map((q) => `• ${q}`)
            .join("\n") +
          "\n\n"
        : "") +
      (topCitation
        ? `*Medical Evidence:*\n_${topCitation.source}: ${topCitation.title}_\n\n`
        : "");

    // Build Hindi section (add only if available and non-empty)
    const hindiSection =
      hindiSummary && hindiSummary.length > 10
        ? `*हिंदी में सारांश:*\n${hindiSummary}\n\n`
        : "";

    // Hinglish (brief)
    const hinglishSection =
      hinglishSummary && hinglishSummary.length > 10
        ? `*Hinglish:* ${hinglishSummary}\n\n`
        : "";

    const footer =
      `──────────────────\n` +
      `_⚠️ ${analysis.safety_disclaimer}_\n` +
      `_SecondSight Pro — AI-powered medical second opinion reconciliation_`;

    const fullText = englishSection + hindiSection + hinglishSection + footer;

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(fullText)}`;
    window.open(whatsappUrl, "_blank");
  };

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
    <section className="panel result-panel" ref={panelRef}>
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

      {analysis.citations && analysis.citations.length > 0 && (
        <div className="citations-section">
          <h3>Medical Evidence Citations (RAG)</h3>
          <div className="citations-list">
            {analysis.citations.map((citation, idx) => (
              <div key={`citation-${idx}`} className="citation-card">
                <div className="citation-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <h4 style={{ margin: 0 }}>{citation.title || citation.source}</h4>
                  <span className="confidence-badge" style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '12px', background: citation.confidence > 0.8 ? '#dcfce7' : citation.confidence > 0.5 ? '#fef08a' : '#fee2e2', color: citation.confidence > 0.8 ? '#166534' : citation.confidence > 0.5 ? '#854d0e' : '#991b1b', fontWeight: 600 }}>
                    Confidence: {Math.round(citation.confidence * 100)}%
                  </span>
                </div>
                <p>"{citation.snippet}"</p>
                {citation.reference && (
                  <a href={citation.reference} target="_blank" rel="noopener noreferrer" className="citation-link">
                    Read Source
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="result-footer no-print">
        <div style={{ display: "flex", gap: "12px", marginBottom: "12px", flexWrap: "wrap" }}>
          <button type="button" className="button ghost" onClick={onCopySummary}>
            Copy Summary
          </button>
          <button type="button" className="button primary" onClick={handleExportPDF} disabled={isExporting}>
            {isExporting ? "Generating PDF..." : "Export to PDF"}
          </button>
          <button type="button" className="button" style={{ backgroundColor: "#25D366", color: "white", borderColor: "#25D366" }} onClick={handleShareWhatsApp}>
            Share via WhatsApp
          </button>
        </div>
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
          flex-wrap: wrap;
        }
        .conflict-score-banner {
          background: var(--bg-1);
          border: 1px solid var(--line-strong);
          padding: 18px 20px;
          border-radius: var(--radius-md);
          flex: 1;
          min-width: 180px;
        }
        .conflict-score-banner .meta-label {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--ink-500);
          margin: 0 0 6px;
          font-weight: 600;
        }
        .conflict-score-banner .risk-score {
          font-size: 1.3rem;
          font-weight: 700;
          color: var(--ink-900);
          margin: 0 0 4px;
          font-family: ui-serif, Georgia, serif;
        }
        .conflict-score-banner .risk-tier,
        .conflict-score-banner .confidence {
          font-size: 12px;
          color: var(--ink-500);
          margin: 2px 0 0;
        }
        .summary-text {
          flex: 2;
          min-width: 240px;
          background: var(--card);
          border: 1px solid var(--line);
          padding: 16px 18px;
          border-radius: var(--radius-md);
          color: var(--ink-700);
          font-size: 14px;
          line-height: 1.65;
        }
        .visual-explanation-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 14px;
          margin-bottom: 24px;
        }
        .ui-block {
          padding: 16px 18px;
          border-radius: var(--radius-md);
          border-left: 4px solid transparent;
          background: var(--card);
          border: 1px solid var(--line);
          box-shadow: var(--shadow-sm);
        }
        .ui-block h3 {
          margin: 0 0 10px;
          font-size: 13px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--ink-500);
        }
        .ui-block ul {
          margin: 0;
          padding-left: 18px;
        }
        .ui-block li {
          margin-bottom: 6px;
          font-size: 13px;
          color: var(--ink-700);
          line-height: 1.5;
        }
        .ui-block-green {
          border-left: 4px solid var(--teal) !important;
          background: rgba(13, 124, 115, 0.05) !important;
        }
        .ui-block-green h3 { color: var(--teal); }
        .ui-block-yellow {
          border-left: 4px solid var(--amber) !important;
          background: rgba(199, 120, 29, 0.05) !important;
        }
        .ui-block-yellow h3 { color: var(--amber); }
        .ui-block-red {
          border-left: 4px solid var(--danger) !important;
          background: rgba(181, 67, 56, 0.05) !important;
        }
        .ui-block-red h3 { color: var(--danger); }
        .multilingual-card {
          margin-bottom: 20px;
          background: var(--bg-1);
        }
        .multilingual-card p {
          font-size: 13px;
          color: var(--ink-700);
          line-height: 1.6;
          margin: 0 0 8px;
        }
        .multilingual-card p:last-child { margin-bottom: 0; }
        .warning-text {
          color: var(--danger);
          font-weight: 600;
          font-size: 13px;
          margin-top: 8px;
        }
        .citations-section {
          margin-bottom: 20px;
          background: var(--card);
          padding: 18px 20px;
          border-radius: var(--radius-md);
          border: 1px solid var(--line);
        }
        .citations-section h3 {
          margin: 0 0 14px;
          color: var(--ink-900);
          font-size: 14px;
          font-weight: 600;
        }
        .citations-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .citation-card {
          background: var(--bg-0);
          border-left: 3px solid var(--teal);
          padding: 12px 14px;
          border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
        }
        .citation-card h4 {
          margin: 0 0 6px;
          color: var(--teal);
          font-size: 13px;
          font-weight: 600;
        }
        .citation-card p {
          margin: 0 0 6px;
          font-size: 12px;
          color: var(--ink-500);
          font-style: italic;
          line-height: 1.5;
        }
        .citation-link {
          font-size: 12px;
          color: var(--teal);
          text-decoration: none;
          font-weight: 500;
        }
        .citation-link:hover { text-decoration: underline; }
        .pdf-export-mode .no-print { display: none !important; }
      `}</style>
    </section>
  );
}
