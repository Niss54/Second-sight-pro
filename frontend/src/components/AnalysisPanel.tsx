import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { FullAnalysisResponse } from "../types";
import { riskBandClass, riskTierLabel } from "../utils/format";

interface AnalysisPanelProps {
  analysis: FullAnalysisResponse | null;
  onCopySummary: () => void;
}

export function AnalysisPanel({ analysis, onCopySummary }: AnalysisPanelProps) {
  if (!analysis) {
    return (
      <section className="panel result-panel">
        <div className="section-title-row">
          <h2>Analysis Output</h2>
          <p>Run analysis to view conflict and triage intelligence</p>
        </div>
        <div className="empty-state">
          <p>No analysis yet. Add doctor opinions and click "Run AI Analysis".</p>
        </div>
      </section>
    );
  }

  const metricData = [
    {
      label: "Diagnosis",
      value: Math.round(analysis.ruleAnalysis.metrics.diagnosisAlignment * 100)
    },
    {
      label: "Treatment",
      value: Math.round(analysis.ruleAnalysis.metrics.treatmentAlignment * 100)
    },
    {
      label: "Medication",
      value: Math.round(analysis.ruleAnalysis.metrics.medicationConsistency * 100)
    },
    {
      label: "Urgency",
      value: Math.round(analysis.ruleAnalysis.metrics.urgencyAgreement * 100)
    },
    {
      label: "Testing",
      value: Math.round(analysis.ruleAnalysis.metrics.testAlignment * 100)
    }
  ];

  const contributionData = analysis.riskModel.contributions.map((item) => ({
    feature: item.feature,
    impact: Number((item.impact * 10).toFixed(2))
  }));

  return (
    <section className="panel result-panel">
      <div className="section-title-row">
        <h2>Analysis Output</h2>
        <p>LLM + heuristic engine summary for decision support</p>
      </div>

      <div className={riskBandClass(analysis.finalRiskTier)}>
        <div>
          <p className="meta-label">Final Conflict Risk</p>
          <p className="risk-score">{analysis.finalScore}/100</p>
          <p className="risk-tier">{riskTierLabel(analysis.finalRiskTier)}</p>
        </div>
        <div className="risk-subscores">
          <p>Rule Score: {analysis.ruleAnalysis.conflictScore}/100</p>
          <p>ML Score: {analysis.riskModel.modelScore}/100</p>
          <p>LLM Mode: {analysis.aiInsight.status}</p>
        </div>
      </div>

      <div className="metric-grid">
        {metricData.map((metric) => (
          <article key={metric.label} className="metric-card">
            <p>{metric.label} Alignment</p>
            <strong>{metric.value}%</strong>
          </article>
        ))}
      </div>

      <div className="chart-wrap">
        <h3>Alignment Overview</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={metricData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="label" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Bar dataKey="value" fill="#0f7a73" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-wrap">
        <h3>Model Feature Impact</h3>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={contributionData} layout="vertical" margin={{ left: 16, right: 16 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis type="category" dataKey="feature" width={150} />
            <Tooltip />
            <Bar dataKey="impact" fill="#a64d2a" radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <p className="model-note">{analysis.riskModel.summary}</p>
      </div>

      <div className="split-grid">
        <div className="result-card">
          <h3>Key Findings</h3>
          <ul>
            {analysis.ruleAnalysis.findings.map((item, index) => (
              <li key={`finding-${index}`}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="result-card">
          <h3>Recommended Actions</h3>
          <ol>
            {analysis.ruleAnalysis.recommendedActions.map((item, index) => (
              <li key={`action-${index}`}>{item}</li>
            ))}
          </ol>
        </div>
      </div>

      <div className="result-card">
        <h3>AI Specialist Prep</h3>
        <p className="meta-label">Executive Summary</p>
        <p>{analysis.aiInsight.executiveSummary}</p>
        <p className="meta-label">Patient-Friendly Summary</p>
        <p>{analysis.aiInsight.patientSummary}</p>
        <p className="meta-label">Triage Advice</p>
        <p>{analysis.aiInsight.triageAdvice}</p>

        <h4>Conversation Script</h4>
        <ul>
          {analysis.aiInsight.conversationScript.map((item, index) => (
            <li key={`script-${index}`}>{item}</li>
          ))}
        </ul>

        <h4>Specialist Questions</h4>
        <ul>
          {analysis.ruleAnalysis.specialistQuestions.map((item, index) => (
            <li key={`question-${index}`}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="result-footer">
        <button type="button" className="button ghost" onClick={onCopySummary}>
          Copy Executive Summary
        </button>
        <p>
          Generated: {new Date(analysis.generatedAt).toLocaleString()} | Safety notice: this tool does not
          provide diagnosis or prescription.
        </p>
      </div>
    </section>
  );
}
