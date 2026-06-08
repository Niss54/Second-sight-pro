import React, { useState, useMemo } from "react";
import type { CaseSummary } from "../types";
import { formatDate } from "../utils/format";
import { Search, FolderOpen, RefreshCw, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

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
          <div className="empty-state">
            {searchQuery ? "No cases found matching your search." : "No saved cases yet. Create one from the Intake tab."}
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
                const scoreNum = item.finalScore ? parseFloat(item.finalScore) : NaN;
                const scoreClass = !isNaN(scoreNum) 
                  ? (scoreNum >= 0.7 ? "high" : scoreNum >= 0.4 ? "moderate" : "low") 
                  : "low";
                
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
                    </td>
                    <td>{item.primaryCondition || "N/A"}</td>
                    <td>
                      <span className={`score-badge ${scoreClass}`}>
                        {!isNaN(scoreNum) ? (scoreNum * 100).toFixed(0) : item.finalScore || "--"}
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
