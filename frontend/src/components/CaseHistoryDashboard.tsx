import React, { useState, useMemo } from "react";
import type { CaseSummary } from "../types";
import { formatDate } from "../utils/format";
import { Search, FolderOpen, RefreshCw, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

// Extract numeric 0–100 score from strings like "High conflict (75%)" or raw numbers
function extractScore(raw: string | number | undefined | null): number {
  if (raw === null || raw === undefined) return 0;
  if (typeof raw === "number") return raw <= 1 ? Math.round(raw * 100) : Math.round(raw);
  const percentMatch = String(raw).match(/(\d+(?:\.\d+)?)\s*%/);
  if (percentMatch) return Math.round(Number(percentMatch[1]));
  const lower = String(raw).toLowerCase();
  if (lower.includes("high")) return 75;
  if (lower.includes("moderate")) return 45;
  if (lower.includes("low")) return 20;
  return 0;
}

interface CaseHistoryDashboardProps {
  cases: CaseSummary[];
  activeCaseId: string | null;
  isLoading: boolean;
  onRefresh: () => void;
  onOpen: (id: string) => void;
  onDelete: (id: string) => void;
  onReanalyze: (id: string) => void;
}

export const CaseHistoryDashboard: React.FC<CaseHistoryDashboardProps> = ({
  cases,
  activeCaseId,
  isLoading,
  onRefresh,
  onOpen,
  onDelete,
  onReanalyze
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCases = useMemo(() => {
    if (!searchQuery.trim()) return cases;
    const lowerQuery = searchQuery.toLowerCase();
    return cases.filter((c) =>
      (c.caseLabel && c.caseLabel.toLowerCase().includes(lowerQuery)) ||
      (c.primaryCondition && c.primaryCondition.toLowerCase().includes(lowerQuery))
    );
  }, [cases, searchQuery]);

  return (
    <div className="panel dashboard-panel">
      <div className="dashboard-header">
        <div>
          <h2 style={{ fontFamily: "ui-serif, Georgia, serif", fontSize: "1.8rem", margin: "0 0 4px" }}>
            Case History Dashboard
          </h2>
          <p style={{ color: "var(--ink-500)", margin: 0, fontSize: "0.95rem" }}>
            Search, resume, and manage previously saved patient cases.
          </p>
        </div>
        <div className="dashboard-controls">
          <div className="search-bar">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search by Patient Name or Condition..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button onClick={onRefresh} className="button ghost" disabled={isLoading}>
            <RefreshCw size={18} className={isLoading ? "spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      <div className="table-container">
        {isLoading && cases.length === 0 ? (
          <div className="empty-state">Loading history...</div>
        ) : filteredCases.length === 0 ? (
          <div
            style={{
              padding: "60px 24px",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "12px"
            }}
          >
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "16px",
                background: "rgba(13,124,115,0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "4px"
              }}
            >
              <FolderOpen size={28} style={{ color: "var(--teal)", opacity: 0.7 }} />
            </div>
            <p style={{ margin: 0, fontWeight: 600, color: "var(--ink-700)", fontSize: "1.05rem" }}>
              {searchQuery ? "No cases match your search" : "No cases saved yet"}
            </p>
            <p style={{ margin: 0, color: "var(--ink-500)", fontSize: "14px", maxWidth: "320px" }}>
              {searchQuery
                ? `Try a different search term for "${searchQuery}"`
                : "Create a new case from the Active Case tab. Add two or more doctor opinions to run AI conflict analysis."}
            </p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Patient / Case Label</th>
                <th>Primary Condition</th>
                <th>Conflict Score</th>
                <th>Opinions</th>
                <th>Last Updated</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCases.map((item, index) => {
                const scoreNum = extractScore(item.finalScore);
                const scoreClass = scoreNum >= 66 ? "high" : scoreNum >= 35 ? "moderate" : "low";
                
                return (
                  <motion.tr 
                    key={item.id} 
                    className={activeCaseId === item.id ? "active-row" : ""}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                  >
                    <td>
                      <strong>{item.caseLabel || "Untitled"}</strong>
                      {activeCaseId === item.id && <span className="active-badge">Active</span>}
                      {/* Show ABDM badge if case has ABHA ID */}
                      {(item as any).abha_id && (
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            background: "#EBF7F1",
                            color: "#1A5F3C",
                            fontSize: "10px",
                            fontWeight: 600,
                            borderRadius: "4px",
                            padding: "2px 6px",
                            marginLeft: "6px",
                            border: "1px solid #B7E4CC",
                            letterSpacing: "0.03em",
                            verticalAlign: "middle"
                          }}
                        >
                          ABDM
                        </span>
                      )}
                    </td>
                    <td>{item.primaryCondition || "N/A"}</td>
                    <td>
                      <span className={`score-badge ${scoreClass}`}>
                        {scoreNum > 0 ? `${scoreNum}%` : (item.finalScore || "--")}
                      </span>
                    </td>
                    <td>{item.opinionsCount}</td>
                    <td className="muted-cell">{formatDate(item.updatedAt)}</td>
                    <td className="actions-cell">
                    <button onClick={() => onOpen(item.id)} className="button primary sm" title="Resume Case">
                      <FolderOpen size={16} /> Resume
                    </button>
                    <button onClick={() => onReanalyze(item.id)} className="button ghost sm" title="Reanalyze with current AI Engine">
                      <RefreshCw size={16} />
                    </button>
                    <button onClick={() => onDelete(item.id)} className="button danger sm" title="Delete Case">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </motion.tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
