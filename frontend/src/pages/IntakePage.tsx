import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CaseFormPanel } from "../components/CaseFormPanel";
import { VoiceAssistantPanel } from "../components/VoiceAssistantPanel";
import { ReconciliationPanel } from "../components/ReconciliationPanel";
import { ToastContainer, type ToastType } from "../components/ToastContainer";
import { createBlankCase, ALL_DEMO_CASES } from "../constants/caseTemplates";
import { analyzeCase, createCase, updateCase } from "../services/api";
import type { PatientCaseInput, ReconciliationOutput } from "../types";

export const IntakePage: React.FC = () => {
  const [caseData, setCaseData] = useState<PatientCaseInput>(() => createBlankCase());
  const [analysis, setAnalysis] = useState<ReconciliationOutput | null>(null);
  const [activeCaseId, setActiveCaseId] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toasts, setToasts] = useState<ToastType[]>([]);
  const [demoCaseIndex, setDemoCaseIndex] = useState(0);

  const topRisk = useMemo(() => analysis ? `${analysis.conflict_score}` : "No active analysis", [analysis]);

  const notify = (message: string, tone: "info" | "success" | "error" = "info") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, tone }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  };

  const removeToast = (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id));

  const validateCaseData = (): boolean => {
    if (!caseData.primaryCondition.trim()) {
      notify("Primary condition is required before analysis.", "error");
      return false;
    }
    const invalidOpinion = caseData.opinions.find(
      (o) => !o.doctorName.trim() || !o.specialty.trim() || !o.diagnosis.trim() || !o.treatment.trim()
    );
    if (invalidOpinion) {
      notify("Each opinion needs doctor name, specialty, diagnosis, and treatment.", "error");
      return false;
    }
    return true;
  };

  const handleAnalyze = async () => {
    if (!validateCaseData()) return;
    setIsAnalyzing(true);
    try {
      const nextAnalysis = await analyzeCase(caseData);
      setAnalysis(nextAnalysis);
      notify("Analysis completed successfully.", "success");
    } catch {
      notify("Analysis failed. Please verify API server and input payload.", "error");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSave = async () => {
    if (!validateCaseData()) return;
    setIsSaving(true);
    try {
      const saved = activeCaseId ? await updateCase(activeCaseId, caseData) : await createCase(caseData);
      setActiveCaseId(saved.id);
      setAnalysis(saved.analysis);
      notify(activeCaseId ? "Case updated." : "Case saved.", "success");
    } catch {
      notify("Save failed. Please retry.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setCaseData(createBlankCase());
    setAnalysis(null);
    setActiveCaseId(null);
    notify("Form reset. You can start a new case.", "info");
  };

  const handleLoadDemo = () => {
    const nextIndex = demoCaseIndex % ALL_DEMO_CASES.length;
    const nextCase = ALL_DEMO_CASES[nextIndex];
    setCaseData(nextCase);
    setAnalysis(null);
    setActiveCaseId(null);
    setDemoCaseIndex(nextIndex + 1);
    notify(
      `Demo ${nextIndex + 1}/${ALL_DEMO_CASES.length} loaded: "${nextCase.caseLabel}". Click again to cycle to next demo.`,
      "info"
    );
  };

  const handleCopySummary = async () => {
    if (!analysis) return notify("Run analysis first.", "error");
    const lines = [
      `SecondSight Executive Summary`,
      `Case: ${caseData.caseLabel || "Untitled case"}`,
      `Condition: ${caseData.primaryCondition}`,
      `Final Conflict Score: ${analysis.conflict_score}`,
      `Summary: ${analysis.summary}`,
    ];
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      notify("Executive summary copied.", "success");
    } catch {
      notify("Clipboard access failed.", "error");
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.3 }}>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      
      <section className="top-meta" style={{ marginBottom: "16px" }}>
        <article>
          <p>Active Case</p>
          <strong>{caseData.caseLabel || "Unsaved case"}</strong>
        </article>
        <article>
          <p>Case ID</p>
          <strong>{activeCaseId || "Not saved"}</strong>
        </article>
        <article>
          <p>Risk Snapshot</p>
          <strong>{topRisk}</strong>
        </article>
      </section>

      <div className="content-grid">
        <CaseFormPanel
          caseData={caseData}
          onChange={setCaseData}
          onAnalyze={handleAnalyze}
          onSave={handleSave}
          onReset={handleReset}
          onLoadDemo={handleLoadDemo}
          isAnalyzing={isAnalyzing}
          isSaving={isSaving}
        />
        <div className="right-stack">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ margin: 0, fontSize: "1.1rem" }}>Patient Interactions</h3>
            <Link to="/chat" className="button primary" style={{ textDecoration: "none", display: "inline-flex", gap: "8px", alignItems: "center" }}>
              Open Patient Chat UI 💬
            </Link>
          </div>
          <VoiceAssistantPanel caseData={caseData} analysis={analysis} onStatusChange={notify} />
          <ReconciliationPanel analysis={analysis} onCopySummary={handleCopySummary} />
        </div>
      </div>
    </motion.div>
  );
};
