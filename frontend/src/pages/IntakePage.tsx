import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CaseFormPanel } from "../components/CaseFormPanel";
import { ReconciliationPanel } from "../components/ReconciliationPanel";
import { ToastContainer, type ToastType } from "../components/ToastContainer";
import { createBlankCase, ALL_DEMO_CASES } from "../constants/caseTemplates";
import { analyzeCase, createCase, updateCase } from "../services/api";
import type { PatientCaseInput, ReconciliationOutput } from "../types";
import {
  MessageSquare,
  AlertTriangle,
  Activity,
  FileCheck
} from "lucide-react";

export const IntakePage: React.FC = () => {
  const [caseData, setCaseData] = useState<PatientCaseInput>(() => createBlankCase());
  const [analysis, setAnalysis] = useState<ReconciliationOutput | null>(null);
  const [activeCaseId, setActiveCaseId] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toasts, setToasts] = useState<ToastType[]>([]);
  const [demoCaseIndex, setDemoCaseIndex] = useState(0);
  const [autoLoaded, setAutoLoaded] = useState(false);

  // Auto-load initial demo case
  useEffect(() => {
    if (!autoLoaded) {
      setCaseData(ALL_DEMO_CASES[0]);
      setDemoCaseIndex(1);
      setAutoLoaded(true);
    }
  }, [autoLoaded]);

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
      notify("Clinical analysis completed successfully.", "success");
    } catch {
      notify("Analysis failed. Please verify API server and inputs.", "error");
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
      notify(activeCaseId ? "Case updated successfully." : "Case saved to database.", "success");
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
    notify("Form reset. You can enter a new patient case.", "info");
  };

  const handleLoadDemo = () => {
    const nextIndex = demoCaseIndex % ALL_DEMO_CASES.length;
    const nextCase = ALL_DEMO_CASES[nextIndex];
    setCaseData(nextCase);
    setAnalysis(null);
    setActiveCaseId(null);
    setDemoCaseIndex(nextIndex + 1);
    notify(
      `Demo Case ${nextIndex + 1}/${ALL_DEMO_CASES.length}: "${nextCase.caseLabel}" loaded.`,
      "info"
    );
  };

  const handleCopySummary = async () => {
    if (!analysis) return notify("Run analysis first.", "error");
    const lines = [
      `SecondSight Pro Clinical Reconciliation Report`,
      `Case: ${caseData.caseLabel || "Untitled case"}`,
      `Condition: ${caseData.primaryCondition}`,
      `Conflict Score: ${analysis.conflict_score}`,
      `Agreement Score: ${analysis.agreement_score}`,
      `\nExecutive Summary:\n${analysis.summary}`,
    ];
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      notify("Executive summary copied to clipboard.", "success");
    } catch {
      notify("Clipboard access failed.", "error");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.3 }}
      style={{ paddingBottom: "40px" }}
    >
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* Top Meta Status Strip */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "14px",
          marginBottom: "24px"
        }}
      >
        <div
          style={{
            background: "var(--card)",
            border: "1px solid var(--line)",
            borderRadius: "16px",
            padding: "16px 20px",
            display: "flex",
            alignItems: "center",
            gap: "14px",
            boxShadow: "var(--shadow-sm)"
          }}
        >
          <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "rgba(13, 124, 115, 0.1)", display: "grid", placeItems: "center", color: "var(--teal)" }}>
            <FileCheck size={20} />
          </div>
          <div>
            <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--ink-500)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Active Case
            </span>
            <div style={{ fontSize: "1rem", fontWeight: 700, color: "var(--ink-900)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "220px" }}>
              {caseData.caseLabel || "New Clinical Case"}
            </div>
          </div>
        </div>

        <div
          style={{
            background: "var(--card)",
            border: "1px solid var(--line)",
            borderRadius: "16px",
            padding: "16px 20px",
            display: "flex",
            alignItems: "center",
            gap: "14px",
            boxShadow: "var(--shadow-sm)"
          }}
        >
          <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "rgba(37, 99, 235, 0.1)", display: "grid", placeItems: "center", color: "#2563eb" }}>
            <Activity size={20} />
          </div>
          <div>
            <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--ink-500)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Database Sync
            </span>
            <div style={{ fontSize: "0.95rem", fontWeight: 700, color: activeCaseId ? "var(--teal)" : "var(--ink-700)" }}>
              {activeCaseId ? `Saved (#${activeCaseId.substring(0, 8)})` : "Unsaved Local Draft"}
            </div>
          </div>
        </div>

        <div
          style={{
            background: "var(--card)",
            border: "1px solid var(--line)",
            borderRadius: "16px",
            padding: "16px 20px",
            display: "flex",
            alignItems: "center",
            gap: "14px",
            boxShadow: "var(--shadow-sm)"
          }}
        >
          <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: analysis ? "rgba(239, 68, 68, 0.1)" : "rgba(100, 116, 139, 0.1)", display: "grid", placeItems: "center", color: analysis ? "#ef4444" : "var(--ink-500)" }}>
            <AlertTriangle size={20} />
          </div>
          <div>
            <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--ink-500)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Conflict Severity
            </span>
            <div style={{ fontSize: "0.95rem", fontWeight: 700, color: analysis ? "var(--ink-900)" : "var(--ink-500)" }}>
              {analysis ? analysis.conflict_score : "Awaiting Analysis"}
            </div>
          </div>
        </div>

        <div
          style={{
            background: "linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(37, 99, 235, 0.1))",
            border: "1px solid rgba(139, 92, 246, 0.25)",
            borderRadius: "16px",
            padding: "16px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px"
          }}
        >
          <div>
            <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#8b5cf6", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Patient Voice Copilot
            </span>
            <div style={{ fontSize: "0.92rem", fontWeight: 600, color: "var(--ink-900)" }}>
              Ask in Hindi or English
            </div>
          </div>
          <Link
            to="/chat"
            className="button primary"
            style={{
              padding: "8px 16px",
              fontSize: "0.85rem",
              borderRadius: "999px",
              fontWeight: 700,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px"
            }}
          >
            <MessageSquare size={14} />
            <span>Chat</span>
          </Link>
        </div>
      </section>

      {/* Main 2-Column Grid */}
      <div className="content-grid" style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: "24px", alignItems: "start" }}>
        
        {/* Left: Input Form */}
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

        {/* Right: Reconciliation Output */}
        <div className="right-stack" style={{ position: "sticky", top: "80px" }}>
          <ReconciliationPanel analysis={analysis} onCopySummary={handleCopySummary} />
        </div>

      </div>
    </motion.div>
  );
};
