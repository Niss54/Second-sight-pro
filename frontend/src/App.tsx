import { useCallback, useEffect, useMemo, useState } from "react";
import "./App.css";
import { ReconciliationPanel } from "./components/ReconciliationPanel";
import { CaseFormPanel } from "./components/CaseFormPanel";
import { CaseHistoryPanel } from "./components/CaseHistoryPanel";
import { VoiceAssistantPanel } from "./components/VoiceAssistantPanel";
import { StatusBanner } from "./components/StatusBanner";
import { createBlankCase, demoCase } from "./constants/caseTemplates";
import {
  analyzeCase,
  createCase,
  deleteCase,
  getCaseById,
  listCases,
  reanalyzeCase,
  updateCase
} from "./services/api";
import type { CaseSummary, ReconciliationOutput, PatientCaseInput } from "./types";

function App() {
  const [caseData, setCaseData] = useState<PatientCaseInput>(() => createBlankCase());
  const [analysis, setAnalysis] = useState<ReconciliationOutput | null>(null);
  const [caseList, setCaseList] = useState<CaseSummary[]>([]);
  const [activeCaseId, setActiveCaseId] = useState<string | null>(null);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);

  const [statusMessage, setStatusMessage] = useState<string>("");
  const [statusTone, setStatusTone] = useState<"info" | "success" | "error">("info");

  const topRisk = useMemo(() => {
    if (!analysis) {
      return "No active analysis";
    }

    return `${analysis.conflict_score}`;
  }, [analysis]);

  const notify = useCallback((message: string, tone: "info" | "success" | "error" = "info") => {
    setStatusMessage(message);
    setStatusTone(tone);
  }, []);

  const refreshCases = useCallback(async () => {
    setIsHistoryLoading(true);
    try {
      const next = await listCases();
      setCaseList(next);
    } catch {
      notify("Could not load case history. Check if backend is running.", "error");
    } finally {
      setIsHistoryLoading(false);
    }
  }, [notify]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void refreshCases();
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [refreshCases]);

  const validateCaseData = (): boolean => {
    if (!caseData.primaryCondition.trim()) {
      notify("Primary condition is required before analysis.", "error");
      return false;
    }

    const invalidOpinion = caseData.opinions.find(
      (opinion) =>
        !opinion.doctorName.trim() ||
        !opinion.specialty.trim() ||
        !opinion.diagnosis.trim() ||
        !opinion.treatment.trim()
    );

    if (invalidOpinion) {
      notify(
        "Each opinion needs doctor name, specialty, diagnosis, and treatment before analysis.",
        "error"
      );
      return false;
    }

    return true;
  };

  const handleAnalyze = async () => {
    if (!validateCaseData()) {
      return;
    }

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
    if (!validateCaseData()) {
      return;
    }

    setIsSaving(true);

    try {
      const saved = activeCaseId
        ? await updateCase(activeCaseId, caseData)
        : await createCase(caseData);

      setActiveCaseId(saved.id);
      setAnalysis(saved.analysis);
      notify(activeCaseId ? "Case updated." : "Case saved.", "success");
      await refreshCases();
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
    setCaseData(demoCase);
    setAnalysis(null);
    setActiveCaseId(null);
    notify("Demo case loaded. Run analysis or save.", "info");
  };

  const handleOpenCase = async (id: string) => {
    try {
      const selected = await getCaseById(id);
      setActiveCaseId(selected.id);
      setCaseData(selected.input);
      setAnalysis(selected.analysis);
      notify("Case loaded.", "success");
    } catch {
      notify("Could not open selected case.", "error");
    }
  };

  const handleDeleteCase = async (id: string) => {
    try {
      await deleteCase(id);
      if (activeCaseId === id) {
        setActiveCaseId(null);
      }
      notify("Case deleted.", "success");
      await refreshCases();
    } catch {
      notify("Delete failed.", "error");
    }
  };

  const handleReanalyzeCase = async (id: string) => {
    try {
      const refreshed = await reanalyzeCase(id);
      await refreshCases();

      if (activeCaseId === id) {
        setAnalysis(refreshed.analysis);
        setCaseData(refreshed.input);
      }

      notify("Case reanalyzed with latest engine.", "success");
    } catch {
      notify("Reanalysis failed.", "error");
    }
  };

  const handleCopySummary = async () => {
    if (!analysis) {
      notify("Run analysis first to copy summary.", "error");
      return;
    }

    const lines = [
      `SecondSight Executive Summary`,
      `Case: ${caseData.caseLabel || "Untitled case"}`,
      `Condition: ${caseData.primaryCondition}`,
      `Final Conflict Score: ${analysis.conflict_score}`,
      `Agreement Score: ${analysis.agreement_score}`,
      ``,
      `Summary: ${analysis.summary}`,
      ``,
      `Disagreement Reasons:`,
      ...analysis.disagreement_reason.map((item, index) => `${index + 1}. ${item}`),
      ``,
      `Specialist Questions:`,
      ...analysis.specialist_questions.map((item, index) => `${index + 1}. ${item}`)
    ];

    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      notify("Executive summary copied to clipboard.", "success");
    } catch {
      notify("Clipboard access failed in this browser context.", "error");
    }
  };

  return (
    <div className="app-shell">
      <div className="ambient-bg" aria-hidden="true" />

      <header className="hero">
        <p className="eyebrow">Medical Voice Assistant</p>
        <h1>SecondSight Pro</h1>
        <p>
          A premium voice-first medical assistant that explains conflicting second opinions with calm,
          evidence-grounded guidance.
        </p>
        <div className="hero-badges">
          <span>Voice Controls</span>
          <span>Audio Visualizer</span>
          <span>Realtime Interaction</span>
          <span>Medically Responsible</span>
        </div>
      </header>

      <StatusBanner message={statusMessage} tone={statusTone} />

      <section className="top-meta">
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

      <main className="content-grid">
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
          <VoiceAssistantPanel
            caseData={caseData}
            analysis={analysis}
            onStatusChange={notify}
          />
          <ReconciliationPanel analysis={analysis} onCopySummary={handleCopySummary} />
          <CaseHistoryPanel
            cases={caseList}
            activeCaseId={activeCaseId}
            isLoading={isHistoryLoading}
            onRefresh={refreshCases}
            onOpen={handleOpenCase}
            onDelete={handleDeleteCase}
            onReanalyze={handleReanalyzeCase}
          />
        </div>
      </main>

      <footer className="footnote">
        <p>
          This platform supports understanding conflicting medical opinions and does not replace
          licensed medical care. If symptoms are urgent or worsening, seek emergency help immediately.
        </p>
      </footer>
    </div>
  );
}

export default App;
