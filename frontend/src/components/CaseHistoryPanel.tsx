import type { CaseSummary } from "../types";
import { formatDate, riskTierLabel } from "../utils/format";

interface CaseHistoryPanelProps {
  cases: CaseSummary[];
  activeCaseId: string | null;
  isLoading: boolean;
  onRefresh: () => void;
  onOpen: (id: string) => void;
  onDelete: (id: string) => void;
  onReanalyze: (id: string) => void;
}

export function CaseHistoryPanel({
  cases,
  activeCaseId,
  isLoading,
  onRefresh,
  onOpen,
  onDelete,
  onReanalyze
}: CaseHistoryPanelProps) {
  return (
    <section className="panel history-panel">
      <div className="section-title-row">
        <h2>Case History</h2>
        <button type="button" className="button ghost" onClick={onRefresh}>
          Refresh
        </button>
      </div>

      {isLoading ? <p className="meta-label">Loading saved cases...</p> : null}

      {cases.length === 0 ? (
        <div className="empty-state">
          <p>No saved cases yet. Save one from intake panel.</p>
        </div>
      ) : (
        <div className="history-list">
          {cases.map((item) => (
            <article
              key={item.id}
              className={`history-item${activeCaseId === item.id ? " active" : ""}`}
            >
              <div>
                <h4>{item.caseLabel}</h4>
                <p>{item.primaryCondition}</p>
                <small>
                  {riskTierLabel(item.finalRiskTier)} ({item.finalScore}/100) | {item.opinionsCount} opinions
                </small>
                <small>Updated: {formatDate(item.updatedAt)}</small>
              </div>

              <div className="history-actions">
                <button type="button" className="button ghost" onClick={() => onOpen(item.id)}>
                  Open
                </button>
                <button type="button" className="button ghost" onClick={() => onReanalyze(item.id)}>
                  Reanalyze
                </button>
                <button type="button" className="button danger" onClick={() => onDelete(item.id)}>
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

