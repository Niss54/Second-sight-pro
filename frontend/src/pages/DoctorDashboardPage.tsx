import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  RefreshCw,
  Search,
  ChevronRight,
  Activity,
  FileText,
  ShieldCheck
} from "lucide-react";
import { listCases } from "../services/api";
import type { CaseSummary } from "../types";

// Helper: extract numeric conflict score from strings like "High conflict (75%)"
// or from raw numbers. Returns 0–100.
function extractConflictScore(raw: string | number | undefined | null): number {
  if (raw === null || raw === undefined) return 0;
  if (typeof raw === "number") return Math.round(raw * 100);
  // Try to match "75%" or "(75%)" pattern
  const percentMatch = raw.match(/(\d+(?:\.\d+)?)\s*%/);
  if (percentMatch) return Math.round(Number(percentMatch[1]));
  // Try plain number string
  const numMatch = raw.match(/^\d+(?:\.\d+)?$/);
  if (numMatch) {
    const n = Number(numMatch[0]);
    // If it looks like 0–1 range, multiply by 100
    return n <= 1 ? Math.round(n * 100) : Math.round(n);
  }
  // Keyword fallback
  const lower = String(raw).toLowerCase();
  if (lower.includes("high")) return 75;
  if (lower.includes("moderate")) return 45;
  if (lower.includes("low")) return 20;
  return 0;
}

function conflictLabel(score: number): { label: string; color: string; bg: string } {
  if (score >= 66) return { label: "High Conflict", color: "#b54338", bg: "rgba(181,67,56,0.1)" };
  if (score >= 35) return { label: "Moderate", color: "#c7781d", bg: "rgba(199,120,29,0.1)" };
  return { label: "Low", color: "#0d7c73", bg: "rgba(13,124,115,0.1)" };
}

type FilterTab = "all" | "high" | "review" | "abdm";

export const DoctorDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [cases, setCases] = useState<CaseSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [error, setError] = useState<string | null>(null);

  const loadCases = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await listCases();
      const sorted = [...data].sort((a, b) => {
        return extractConflictScore(b.finalScore) - extractConflictScore(a.finalScore);
      });
      setCases(sorted);
    } catch {
      setError("Could not load cases. Is the backend running?");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCases();
  }, [loadCases]);

  // Derived stats
  const stats = useMemo(() => {
    const total = cases.length;
    const highConflict = cases.filter((c) => extractConflictScore(c.finalScore) >= 66).length;
    const needsReview = cases.filter((c) => extractConflictScore(c.finalScore) >= 35).length;
    const complex = cases.filter((c) => (c.opinionsCount ?? 0) >= 3).length;
    return { total, highConflict, needsReview, complex };
  }, [cases]);

  // Filtered cases
  const filteredCases = useMemo(() => {
    let result = cases;
    if (activeTab === "high") result = result.filter((c) => extractConflictScore(c.finalScore) >= 66);
    else if (activeTab === "review") result = result.filter((c) => extractConflictScore(c.finalScore) >= 35);
    else if (activeTab === "abdm") result = result.filter((c) => (c.opinionsCount ?? 0) >= 3);

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          (c.caseLabel ?? "").toLowerCase().includes(q) ||
          (c.primaryCondition ?? "").toLowerCase().includes(q)
      );
    }
    return result;
  }, [cases, activeTab, searchQuery]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
    >
      {/* ── Page Header ── */}
      <div
        style={{
          marginBottom: "28px",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "16px"
        }}
      >
        <div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(13,124,115,0.1)",
              color: "var(--teal)",
              fontSize: "12px",
              fontWeight: 600,
              padding: "4px 12px",
              borderRadius: "999px",
              marginBottom: "10px",
              letterSpacing: "0.05em"
            }}
          >
            <ShieldCheck size={13} />
            DOCTOR REVIEW PORTAL
          </div>
          <h1
            style={{
              fontFamily: "ui-serif, Georgia, serif",
              fontSize: "2rem",
              margin: "0 0 6px",
              letterSpacing: "-0.03em",
              color: "var(--ink-900)"
            }}
          >
            Clinical Review Queue
          </h1>
          <p style={{ color: "var(--ink-500)", margin: 0, fontSize: "0.95rem" }}>
            Cases sorted by conflict severity. High-conflict cases appear first.
          </p>
        </div>
        <button
          onClick={loadCases}
          disabled={isLoading}
          className="button ghost"
          style={{ display: "flex", alignItems: "center", gap: "8px", height: "40px" }}
        >
          <RefreshCw size={15} className={isLoading ? "spin" : ""} />
          Refresh
        </button>
      </div>

      {/* ── Stats Row ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: "14px",
          marginBottom: "28px"
        }}
      >
        {[
          { icon: <FileText size={20} />, label: "Total Cases", value: stats.total, color: "var(--teal)", bg: "rgba(13,124,115,0.08)" },
          { icon: <AlertTriangle size={20} />, label: "High Conflict", value: stats.highConflict, color: "var(--danger)", bg: "rgba(181,67,56,0.08)" },
          { icon: <Clock size={20} />, label: "Needs Review", value: stats.needsReview, color: "var(--amber)", bg: "rgba(199,120,29,0.08)" },
          { icon: <Activity size={20} />, label: "Multi-Opinion", value: stats.complex, color: "var(--sky, #2563eb)", bg: "rgba(37,99,235,0.08)" }
        ].map((stat) => (
          <div
            key={stat.label}
            style={{
              background: "var(--card)",
              border: "1px solid var(--line)",
              borderRadius: "var(--radius-md)",
              padding: "18px 20px",
              backdropFilter: "blur(16px)",
              display: "flex",
              alignItems: "center",
              gap: "14px",
              boxShadow: "var(--shadow-sm)"
            }}
          >
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "12px",
                background: stat.bg,
                color: stat.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0
              }}
            >
              {stat.icon}
            </div>
            <div>
              <p style={{ margin: "0 0 2px", fontSize: "11px", fontWeight: 600, color: "var(--ink-500)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                {stat.label}
              </p>
              <p style={{ margin: 0, fontSize: "1.6rem", fontWeight: 700, color: "var(--ink-900)", fontFamily: "ui-serif, Georgia, serif", lineHeight: 1 }}>
                {stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Filter Tabs + Search ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "14px",
          marginBottom: "18px",
          flexWrap: "wrap"
        }}
      >
        <div style={{ display: "flex", gap: "6px" }}>
          {(
            [
              { key: "all", label: "All Cases" },
              { key: "high", label: "🔴 High Conflict" },
              { key: "review", label: "🟡 Needs Review" },
              { key: "abdm", label: "Multi-Opinion" }
            ] as { key: FilterTab; label: string }[]
          ).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: "7px 14px",
                borderRadius: "999px",
                border: activeTab === tab.key ? "1.5px solid var(--teal)" : "1px solid var(--line-strong)",
                background: activeTab === tab.key ? "rgba(13,124,115,0.1)" : "var(--card)",
                color: activeTab === tab.key ? "var(--teal)" : "var(--ink-500)",
                fontWeight: activeTab === tab.key ? 600 : 500,
                fontSize: "13px",
                cursor: "pointer",
                transition: "all 0.2s ease",
                backdropFilter: "blur(8px)"
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            background: "var(--card)",
            border: "1px solid var(--line-strong)",
            borderRadius: "var(--radius-sm)",
            padding: "8px 14px",
            backdropFilter: "blur(16px)",
            minWidth: "220px"
          }}
        >
          <Search size={15} style={{ color: "var(--ink-300)", flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Search condition or case..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              border: "none",
              background: "transparent",
              outline: "none",
              fontSize: "13px",
              color: "var(--ink-900)",
              width: "100%"
            }}
          />
        </div>
      </div>

      {/* ── Case Queue ── */}
      <div
        style={{
          background: "var(--card)",
          border: "1px solid var(--line)",
          borderRadius: "var(--radius-lg)",
          backdropFilter: "blur(20px)",
          overflow: "hidden",
          boxShadow: "var(--shadow-md)"
        }}
      >
        {error && (
          <div
            style={{
              padding: "20px 24px",
              color: "var(--danger)",
              background: "rgba(181,67,56,0.06)",
              fontSize: "14px",
              borderBottom: "1px solid var(--line)"
            }}
          >
            {error}
          </div>
        )}

        {isLoading && filteredCases.length === 0 ? (
          <div style={{ padding: "60px 24px", textAlign: "center", color: "var(--ink-500)" }}>
            <RefreshCw size={28} style={{ animation: "spin 1s linear infinite", marginBottom: "12px", opacity: 0.5 }} />
            <p style={{ margin: 0 }}>Loading clinical queue...</p>
          </div>
        ) : filteredCases.length === 0 ? (
          <div style={{ padding: "60px 24px", textAlign: "center" }}>
            <CheckCircle size={36} style={{ color: "var(--teal)", marginBottom: "12px", opacity: 0.6 }} />
            <p style={{ margin: "0 0 6px", color: "var(--ink-700)", fontWeight: 600, fontSize: "1rem" }}>
              Queue is clear
            </p>
            <p style={{ margin: 0, color: "var(--ink-500)", fontSize: "14px" }}>
              {searchQuery
                ? "No cases match your search."
                : activeTab !== "all"
                ? "No cases match this filter."
                : "No cases saved yet. Create one from the Active Case tab."}
            </p>
          </div>
        ) : (
          <div>
            {/* Table header */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1.5fr 140px 80px 120px 100px",
                gap: "12px",
                padding: "12px 24px",
                background: "var(--bg-1, rgba(0,0,0,0.03))",
                borderBottom: "1px solid var(--line)",
                fontSize: "11px",
                fontWeight: 600,
                color: "var(--ink-400, var(--ink-500))",
                textTransform: "uppercase",
                letterSpacing: "0.06em"
              }}
            >
              <span>Patient / Case</span>
              <span>Primary Condition</span>
              <span>Conflict Score</span>
              <span>Opinions</span>
              <span>Last Updated</span>
              <span style={{ textAlign: "right" }}>Action</span>
            </div>

            {/* Case rows */}
            {filteredCases.map((c, index) => {
              const score = extractConflictScore(c.finalScore);
              const conf = conflictLabel(score);
              const dateStr = c.updatedAt
                ? new Date(c.updatedAt).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                  })
                : "—";

              return (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.04, duration: 0.25 }}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "2fr 1.5fr 140px 80px 120px 100px",
                    gap: "12px",
                    padding: "16px 24px",
                    borderBottom: "1px solid var(--line)",
                    alignItems: "center",
                    transition: "background 0.15s ease",
                    cursor: "default"
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.background = "rgba(13,124,115,0.04)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.background = "transparent";
                  }}
                >
                  {/* Case label */}
                  <div>
                    <p style={{ margin: "0 0 3px", fontWeight: 600, color: "var(--ink-900)", fontSize: "14px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {c.caseLabel || "Untitled Case"}
                    </p>
                    <p style={{ margin: 0, fontSize: "11px", color: "var(--ink-400, var(--ink-500))", fontFamily: "monospace", letterSpacing: "0.02em" }}>
                      ID: {c.id.slice(0, 8)}…
                    </p>
                  </div>

                  {/* Primary condition */}
                  <div style={{ fontSize: "13px", color: "var(--ink-700)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {c.primaryCondition || "Not specified"}
                  </div>

                  {/* Conflict score + bar */}
                  <div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "5px" }}>
                      <span style={{ fontSize: "11px", fontWeight: 600, color: conf.color, background: conf.bg, padding: "2px 8px", borderRadius: "999px" }}>
                        {conf.label}
                      </span>
                      <span style={{ fontSize: "13px", fontWeight: 700, color: conf.color }}>
                        {score}%
                      </span>
                    </div>
                    <div style={{ height: "4px", background: "var(--line)", borderRadius: "999px", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${score}%`, background: conf.color, borderRadius: "999px", transition: "width 0.6s ease" }} />
                    </div>
                  </div>

                  {/* Opinions count */}
                  <div style={{ textAlign: "center", fontSize: "15px", fontWeight: 700, color: "var(--ink-700)" }}>
                    {c.opinionsCount ?? "—"}
                    <p style={{ margin: 0, fontSize: "10px", color: "var(--ink-400, var(--ink-500))", fontWeight: 400 }}>doctors</p>
                  </div>

                  {/* Date */}
                  <div style={{ fontSize: "12px", color: "var(--ink-500)" }}>{dateStr}</div>

                  {/* Action */}
                  <div style={{ textAlign: "right" }}>
                    <button
                      onClick={() => navigate(`/case/new?id=${c.id}`)}
                      className="button primary sm"
                      style={{ display: "inline-flex", alignItems: "center", gap: "5px", fontSize: "12px", padding: "7px 14px" }}
                    >
                      Review
                      <ChevronRight size={13} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Footer note ── */}
      <p style={{ textAlign: "center", color: "var(--ink-300)", fontSize: "12px", marginTop: "24px" }}>
        SecondSight Pro — Doctor Review Portal · Cases are sorted by conflict score (highest first)
        · Conflict scores are AI-generated and do not replace clinical judgment
      </p>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .spin { animation: spin 1s linear infinite; }
      `}</style>
    </motion.div>
  );
};
