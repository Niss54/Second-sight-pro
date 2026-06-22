import { useState, useRef } from "react";
import type { ReconciliationOutput, UiBlock } from "../types";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react";

interface ReconciliationPanelProps {
  analysis: ReconciliationOutput | null;
  onCopySummary: () => void;
}

export function ReconciliationPanel({ analysis, onCopySummary }: ReconciliationPanelProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [showWhatsAppPreview, setShowWhatsAppPreview] = useState(false);
  const panelRef = useRef<HTMLElement>(null);

  const handleExportPDF = async () => {
    if (!panelRef.current) return;
    setIsExporting(true);
    try {
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

  const buildWhatsAppText = () => {
    if (!analysis) return "";
    const hindiSummary = analysis.multilingual_output?.hindi;
    const hinglishSummary = analysis.multilingual_output?.hinglish;

    const englishSection =
      `*🔬 SecondSight Pro — Doctor Opinion Analysis*\n\n` +
      `*Conflict Score:* ${analysis.conflict_score}\n` +
      `*Agreement Level:* ${analysis.agreement_score}\n` +
      `*Confidence:* ${analysis.confidence_level?.toUpperCase() ?? "—"}\n\n` +
      `*Summary:*\n${analysis.summary}\n\n`;

    const hindiSection = hindiSummary && hindiSummary.length > 10 ? `*हिंदी में सारांश:*\n${hindiSummary}\n\n` : "";
    const hinglishSection = hinglishSummary && hinglishSummary.length > 10 ? `*Hinglish:* ${hinglishSummary}\n\n` : "";
    
    const footer = `──────────────────\n_⚠️ ${analysis.safety_disclaimer}_\n_SecondSight Pro — AI-powered medical second opinion reconciliation_`;
    return englishSection + hindiSection + hinglishSection + footer;
  };

  const handleShareWhatsApp = () => {
    if (!analysis) return;
    setShowWhatsAppPreview(true);
  };

  const confirmWhatsAppSend = () => {
    const fullText = buildWhatsAppText();
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(fullText)}`;
    window.open(whatsappUrl, "_blank");
    setShowWhatsAppPreview(false);
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
      case "green": return "ui-block ui-block-green";
      case "yellow": return "ui-block ui-block-yellow";
      case "red": return "ui-block ui-block-red";
      default: return "ui-block";
    }
  };

  const extractScore = (scoreStr: string) => {
    const match = scoreStr.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  };

  const getScoreColor = (score: number) => {
    if (score > 66) return { color: "#ef4444", gradientId: "grad-red", start: "#f87171", end: "#dc2626" };
    if (score >= 35) return { color: "#f59e0b", gradientId: "grad-amber", start: "#fbbf24", end: "#d97706" };
    return { color: "#0d7c73", gradientId: "grad-teal", start: "#2dd4bf", end: "#0f766e" };
  };

  const scoreValue = extractScore(analysis.conflict_score);
  const theme = getScoreColor(scoreValue);
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scoreValue / 100) * circumference;

  return (
    <section className="panel result-panel premium-glass" ref={panelRef}>
      <div className="section-title-row" style={{ borderBottom: "1px solid var(--line)", paddingBottom: "16px", marginBottom: "24px" }}>
        <h2 style={{ fontSize: "1.8rem", letterSpacing: "-0.03em" }}>Reconciliation Engine Output</h2>
        <p style={{ opacity: 0.8 }}>Premium medical conflict analysis and explainability</p>
      </div>

      {scoreValue >= 70 && (
        <div className="emergency-alert-banner" style={{
          display: 'flex', gap: '16px', background: 'linear-gradient(to right, #fef2f2, #fff)', border: '1px solid #fca5a5',
          padding: '16px 20px', borderRadius: '12px', marginBottom: '24px', alignItems: 'flex-start',
          boxShadow: '0 8px 20px rgba(220, 38, 38, 0.1)'
        }}>
          <AlertTriangle color="#dc2626" size={28} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <h3 style={{ color: '#991b1b', margin: '0 0 4px', fontSize: '1.05rem', fontWeight: 700 }}>
              Critical Alert: Immediate Specialist Consultation Required
            </h3>
            <p style={{ color: '#b91c1c', margin: 0, fontSize: '0.9rem', lineHeight: 1.5 }}>
              The conflicting medical opinions present a severe risk (Conflict Score: {scoreValue}%). Do not proceed with self-medication or assume either treatment is safe without consulting a higher-level specialist or visiting an emergency department immediately.
            </p>
          </div>
        </div>
      )}

      <div className="reconciliation-summary">
        <div className="conflict-score-banner premium-score-banner">
          <div className="score-gauge-container">
            <svg width="120" height="120" viewBox="0 0 100 100" style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.1))" }}>
              <defs>
                <linearGradient id="grad-red" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f87171" />
                  <stop offset="100%" stopColor="#dc2626" />
                </linearGradient>
                <linearGradient id="grad-amber" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fbbf24" />
                  <stop offset="100%" stopColor="#d97706" />
                </linearGradient>
                <linearGradient id="grad-teal" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2dd4bf" />
                  <stop offset="100%" stopColor="#0f766e" />
                </linearGradient>
              </defs>
              <circle cx="50" cy="50" r={radius} fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="10" />
              <circle
                cx="50" cy="50" r={radius}
                fill="none" stroke={`url(#${theme.gradientId})`} strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
                style={{ transition: "stroke-dashoffset 2s cubic-bezier(0.22, 1, 0.36, 1)" }}
              />
            </svg>
            <div className="gauge-text" style={{ color: theme.color, textShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
              {scoreValue}<span style={{ fontSize: '0.5em', opacity: 0.8 }}>%</span>
            </div>
          </div>
          
          <div className="score-details">
            <p className="meta-label">Overall Conflict Score</p>
            <p className="risk-score" style={{ color: theme.color }}>
              {analysis.conflict_score.split('(')[0].trim()}
            </p>
            <div className="score-pills">
              <span className="meta-pill premium-pill">Agrmt: <strong>{analysis.agreement_score}</strong></span>
              <span className="meta-pill premium-pill">Conf: <strong>{analysis.confidence_level}</strong></span>
            </div>
          </div>
        </div>
        <div className="summary-text">
          <p><strong>Summary:</strong> {analysis.summary}</p>
        </div>
      </div>

      {analysis.comparison_table && (
        <div className="comparison-table-container" style={{ marginBottom: "24px", background: "var(--card)", borderRadius: "12px", border: "1px solid var(--line)", overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--line)", background: "var(--bg-1)" }}>
            <h3 style={{ margin: 0, fontSize: "1.1rem", color: "var(--ink-900)" }}>Side-by-Side Opinion Comparison</h3>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ background: "rgba(0,0,0,0.02)", borderBottom: "1px solid var(--line)" }}>
                <th style={{ padding: "12px 20px", color: "var(--ink-500)", fontWeight: 600, fontSize: "0.85rem", width: "15%" }}>Category</th>
                <th style={{ padding: "12px 20px", color: "var(--ink-500)", fontWeight: 600, fontSize: "0.85rem", width: "15%", textAlign: "center" }}>Status</th>
                <th style={{ padding: "12px 20px", color: "var(--ink-500)", fontWeight: 600, fontSize: "0.85rem", width: "70%" }}>Key Differences (Dr. A vs Dr. B)</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(analysis.comparison_table).map(([category, data]) => {
                let Icon = CheckCircle2;
                let iconColor = "var(--teal)";
                let statusText = "Agreement";
                
                if (data.status === "partial_agreement") {
                  Icon = AlertTriangle;
                  iconColor = "var(--amber)";
                  statusText = "Partial Agreement";
                } else if (data.status === "direct_contradiction") {
                  Icon = XCircle;
                  iconColor = "var(--danger)";
                  statusText = "Contradiction";
                }

                return (
                  <tr key={category} style={{ borderBottom: "1px solid var(--line)" }}>
                    <td style={{ padding: "16px 20px", fontWeight: 600, textTransform: "capitalize", color: "var(--ink-900)", verticalAlign: "top" }}>
                      {category}
                    </td>
                    <td style={{ padding: "16px 20px", textAlign: "center", verticalAlign: "top" }}>
                      <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                        <Icon size={22} color={iconColor} />
                        <span style={{ fontSize: "0.7rem", color: iconColor, fontWeight: 600 }}>{statusText}</span>
                      </div>
                    </td>
                    <td style={{ padding: "16px 20px", verticalAlign: "top" }}>
                      <ul style={{ margin: 0, paddingLeft: "20px", fontSize: "0.9rem", color: "var(--ink-700)", lineHeight: 1.6 }}>
                        {data.notes.map((note, i) => (
                          <li key={i} style={{ marginBottom: i === data.notes.length - 1 ? 0 : "8px" }}>
                            {note}
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

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
        <p>Safety notice: {analysis.safety_disclaimer}</p>
        {analysis.manual_correction_required && (
          <p className="warning-text">Manual correction flow triggered due to low confidence.</p>
        )}
      </div>

      {/* WhatsApp Preview Modal */}
      {showWhatsAppPreview && (
        <div className="wa-overlay" onClick={() => setShowWhatsAppPreview(false)}>
          <div className="wa-modal" onClick={(e) => e.stopPropagation()}>
            <div className="wa-modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#25D366", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, fontSize: "1.1rem" }}>W</div>
                <div>
                  <div style={{ fontWeight: 700, color: "#111" }}>WhatsApp Share Preview</div>
                  <div style={{ fontSize: "0.75rem", color: "#667" }}>This is what your contact will receive</div>
                </div>
              </div>
              <button onClick={() => setShowWhatsAppPreview(false)} style={{ background: "none", border: "none", fontSize: "1.4rem", cursor: "pointer", color: "#666", padding: "4px" }}>✕</button>
            </div>

            <div className="wa-chat-bg">
              <div className="wa-bubble">
                <div className="wa-bubble-text">
                  <p style={{ margin: "0 0 8px", fontWeight: 700 }}>🔬 SecondSight Pro — Doctor Opinion Analysis</p>
                  <p style={{ margin: "0 0 4px" }}><strong>Conflict Score:</strong> {analysis.conflict_score}</p>
                  <p style={{ margin: "0 0 4px" }}><strong>Agreement Level:</strong> {analysis.agreement_score}</p>
                  <p style={{ margin: "0 0 10px" }}><strong>Confidence:</strong> {analysis.confidence_level?.toUpperCase() ?? "—"}</p>
                  <p style={{ margin: "0 0 4px", fontWeight: 600 }}>Summary:</p>
                  <p style={{ margin: "0 0 12px" }}>{analysis.summary}</p>
                  {analysis.multilingual_output?.hindi && analysis.multilingual_output.hindi.length > 10 && (
                    <>
                      <p style={{ margin: "0 0 4px", fontWeight: 600 }}>हिंदी में सारांश:</p>
                      <p style={{ margin: "0 0 12px" }}>{analysis.multilingual_output.hindi}</p>
                    </>
                  )}
                  <div style={{ borderTop: "1px solid rgba(0,0,0,0.1)", paddingTop: "8px", marginTop: "8px", fontSize: "0.75rem", color: "#555", fontStyle: "italic" }}>
                    ⚠️ {analysis.safety_disclaimer}
                  </div>
                </div>
                <div className="wa-bubble-meta">
                  <span>{new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</span>
                  <span style={{ color: "#53bdeb" }}>✓✓</span>
                </div>
              </div>
            </div>

            <div className="wa-modal-footer">
              <button onClick={() => setShowWhatsAppPreview(false)} className="button ghost" style={{ flex: 1 }}>Cancel</button>
              <button onClick={confirmWhatsAppSend} className="button" style={{ flex: 2, backgroundColor: "#25D366", color: "white", borderColor: "#25D366", fontWeight: 700 }}>Open in WhatsApp →</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .premium-glass {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.6);
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.04);
        }
        html.dark .premium-glass {
          background: rgba(30, 41, 59, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .premium-score-banner {
          background: linear-gradient(135deg, var(--bg-0) 0%, var(--bg-1) 100%) !important;
          border: 1px solid var(--line-strong) !important;
          box-shadow: inset 0 2px 4px rgba(255,255,255,0.5), 0 4px 12px rgba(0,0,0,0.03) !important;
        }
        html.dark .premium-score-banner {
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.05), 0 4px 12px rgba(0,0,0,0.2) !important;
        }
        .premium-pill {
          background: rgba(255,255,255,0.8) !important;
          border: 1px solid var(--line-strong) !important;
          box-shadow: 0 2px 5px rgba(0,0,0,0.02);
          backdrop-filter: blur(4px);
        }
        html.dark .premium-pill {
          background: rgba(15, 23, 42, 0.6) !important;
        }
        .reconciliation-summary { display: flex; gap: 20px; margin-bottom: 24px; flex-wrap: wrap; }
        .conflict-score-banner {
          background: var(--bg-1); border: 1px solid var(--line-strong); padding: 24px 28px;
          border-radius: 16px; flex: 1; min-width: 320px; display: flex; align-items: center; gap: 24px;
        }
        .score-gauge-container { position: relative; width: 120px; height: 120px; flex-shrink: 0; }
        .gauge-text {
          position: absolute; top: 0; left: 0; right: 0; bottom: 0; display: flex; align-items: center;
          justify-content: center; font-size: 2rem; font-weight: 800; font-family: "ui-serif", Georgia, serif; letter-spacing: -0.02em;
        }
        .score-details { display: flex; flex-direction: column; }
        .conflict-score-banner .meta-label {
          font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: var(--ink-500); margin: 0 0 6px; font-weight: 700;
        }
        .conflict-score-banner .risk-score {
          font-size: 2rem; font-weight: 800; margin: 0 0 12px; font-family: ui-serif, Georgia, serif; letter-spacing: -0.02em;
        }
        .score-pills { display: flex; gap: 10px; flex-wrap: wrap; }
        .meta-pill {
          font-size: 11.5px; background: white; border: 1px solid var(--line); padding: 5px 12px; border-radius: 20px; color: var(--ink-700); font-weight: 500;
        }
        .summary-text {
          flex: 2; min-width: 240px; background: var(--card); border: 1px solid var(--line); padding: 16px 18px;
          border-radius: var(--radius-md); color: var(--ink-700); font-size: 14px; line-height: 1.65;
        }
        .visual-explanation-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 14px; margin-bottom: 24px; }
        .ui-block { padding: 16px 18px; border-radius: var(--radius-md); border-left: 4px solid transparent; background: var(--card); border: 1px solid var(--line); box-shadow: var(--shadow-sm); }
        .ui-block h3 { margin: 0 0 10px; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--ink-500); }
        .ui-block ul { margin: 0; padding-left: 18px; }
        .ui-block li { margin-bottom: 6px; font-size: 13px; color: var(--ink-700); line-height: 1.5; }
        .ui-block-green { border-left: 4px solid var(--teal) !important; background: rgba(13, 124, 115, 0.05) !important; }
        .ui-block-green h3 { color: var(--teal); }
        .ui-block-yellow { border-left: 4px solid var(--amber) !important; background: rgba(199, 120, 29, 0.05) !important; }
        .ui-block-yellow h3 { color: var(--amber); }
        .ui-block-red { border-left: 4px solid var(--danger) !important; background: rgba(181, 67, 56, 0.05) !important; }
        .ui-block-red h3 { color: var(--danger); }
        .multilingual-card { margin-bottom: 20px; background: var(--bg-1); }
        .multilingual-card p { font-size: 13px; color: var(--ink-700); line-height: 1.6; margin: 0 0 8px; }
        .multilingual-card p:last-child { margin-bottom: 0; }
        .warning-text { color: var(--danger); font-weight: 600; font-size: 13px; margin-top: 8px; }
        .citations-section { margin-bottom: 20px; background: var(--card); padding: 18px 20px; border-radius: var(--radius-md); border: 1px solid var(--line); }
        .citations-section h3 { margin: 0 0 14px; color: var(--ink-900); font-size: 14px; font-weight: 600; }
        .citations-list { display: flex; flex-direction: column; gap: 10px; }
        .citation-card { background: var(--bg-0); border-left: 3px solid var(--teal); padding: 12px 14px; border-radius: 0 var(--radius-sm) var(--radius-sm) 0; }
        .citation-card h4 { margin: 0 0 6px; color: var(--teal); font-size: 13px; font-weight: 600; }
        .citation-card p { margin: 0 0 6px; font-size: 12px; color: var(--ink-500); font-style: italic; line-height: 1.5; }
        .citation-link { font-size: 12px; color: var(--teal); text-decoration: none; font-weight: 500; }
        .citation-link:hover { text-decoration: underline; }
        .pdf-export-mode .no-print { display: none !important; }

        /* WhatsApp Preview Modal CSS */
        .wa-overlay {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.6); backdrop-filter: blur(4px);
          display: flex; align-items: center; justify-content: center;
          z-index: 1000; padding: 20px;
        }
        .wa-modal {
          background: white; border-radius: 16px; width: 100%; max-width: 440px;
          overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.2);
          display: flex; flex-direction: column;
        }
        .wa-modal-header {
          background: #f0f2f5; padding: 12px 16px; display: flex;
          align-items: center; justify-content: space-between; border-bottom: 1px solid #e9edef;
        }
        .wa-chat-bg {
          background-color: #efeae2;
          background-image: url("https://static.whatsapp.net/rsrc.php/v3/yl/r/r_QPEkMNWc.png");
          padding: 24px 16px; flex: 1; display: flex; flex-direction: column;
        }
        .wa-bubble {
          background: #d9fdd3; border-radius: 8px; padding: 8px;
          box-shadow: 0 1px 0.5px rgba(11,20,26,.13);
          align-self: flex-end; max-width: 90%; position: relative;
          border-top-right-radius: 0;
        }
        .wa-bubble::before {
          content: ""; position: absolute; top: 0; right: -8px;
          width: 0; height: 0; border-top: 0px solid transparent;
          border-bottom: 12px solid transparent; border-left: 12px solid #d9fdd3;
        }
        .wa-bubble-text {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          font-size: 14.2px; line-height: 1.4; color: #111b21;
        }
        .wa-bubble-meta {
          display: flex; justify-content: flex-end; align-items: center; gap: 4px;
          font-size: 11px; color: #667781; margin-top: 4px;
        }
        .wa-modal-footer {
          background: white; padding: 16px; display: flex; gap: 12px;
          border-top: 1px solid #e9edef;
        }
      `}</style>
    </section>
  );
}
