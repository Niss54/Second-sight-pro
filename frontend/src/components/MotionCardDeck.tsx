import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, CheckCircle2, ShieldAlert, ArrowRight } from "lucide-react";

export const MotionCardDeck: React.FC = () => {
  const [activeCard, setActiveCard] = useState<number | null>(null);

  return (
    <div className="motion-cards-container" data-cursor="fan out">
      <div className="motion-cards-header">
        <span className="neo-badge neo-badge--yellow">Interactive Clinical Showcase</span>
        <h2 className="motion-cards-headline">
          How Conflicts Look & How SecondSight <em>Reconciles</em> Them.
        </h2>
        <p className="motion-cards-subheadline">
          Hover to inspect the fanning opinion cards, conflict detection alerts, and ICMR evidence reconciliation.
        </p>
      </div>

      <div className="motion-cards-stage">
        {/* Floating Labels matching nissh.info */}
        <div className="motion-floating-tag motion-floating-tag--pink">
          <span>⚡ dual blockade caught</span>
        </div>
        <div className="motion-floating-tag motion-floating-tag--orange">
          <span>🔬 icmr 2023 verified</span>
        </div>
        <div className="motion-floating-tag motion-floating-tag--green">
          <span>🎙️ hindi voice explain</span>
        </div>
        <div className="motion-floating-tag motion-floating-tag--blue">
          <span>🛡️ abdm abha ready</span>
        </div>

        {/* 4 Overlapping Cards */}
        <div className="motion-cards-fan">
          {/* Card 1: Doctor A */}
          <div
            className={`fan-card fan-card--1 ${activeCard === 1 ? "is-focused" : ""}`}
            onMouseEnter={() => setActiveCard(1)}
            onMouseLeave={() => setActiveCard(null)}
            data-cursor="Doctor A"
          >
            <div className="fan-card-header">
              <span className="fan-card-pill fan-card-pill--blue">Doctor Opinion #1</span>
              <span className="fan-card-status">Routine</span>
            </div>
            <div className="fan-card-doctor">
              <h4>Dr. A. K. Sharma</h4>
              <p>Cardiologist · Apollo Lucknow</p>
            </div>
            <div className="fan-card-body">
              <div className="fan-card-row">
                <span className="fan-card-label">Diagnosis:</span>
                <span className="fan-card-val">Stage 1 Essential HTN</span>
              </div>
              <div className="fan-card-row">
                <span className="fan-card-label">Prescription:</span>
                <span className="fan-card-val rx-val">Ramipril 5mg (ACEi)</span>
              </div>
              <div className="fan-card-row">
                <span className="fan-card-label">Follow-up:</span>
                <span className="fan-card-val">Routine in 4 weeks</span>
              </div>
            </div>
            <div className="fan-card-footer">
              <span className="fan-card-tag">Mono-therapy</span>
            </div>
          </div>

          {/* Card 2: Doctor B */}
          <div
            className={`fan-card fan-card--2 ${activeCard === 2 ? "is-focused" : ""}`}
            onMouseEnter={() => setActiveCard(2)}
            onMouseLeave={() => setActiveCard(null)}
            data-cursor="Doctor B"
          >
            <div className="fan-card-header">
              <span className="fan-card-pill fan-card-pill--orange">Doctor Opinion #2</span>
              <span className="fan-card-status status-urgent">Urgent</span>
            </div>
            <div className="fan-card-doctor">
              <h4>Dr. Sunita Verma</h4>
              <p>Internal Medicine · Medanta</p>
            </div>
            <div className="fan-card-body">
              <div className="fan-card-row">
                <span className="fan-card-label">Diagnosis:</span>
                <span className="fan-card-val">Grade 2 HTN + Nephropathy</span>
              </div>
              <div className="fan-card-row">
                <span className="fan-card-label">Prescription:</span>
                <span className="fan-card-val rx-val">Losartan 50mg (ARB)</span>
              </div>
              <div className="fan-card-row">
                <span className="fan-card-label">Follow-up:</span>
                <span className="fan-card-val">Urgent in 5 days</span>
              </div>
            </div>
            <div className="fan-card-footer">
              <span className="fan-card-tag tag-urgent">Conflicting Urgency</span>
            </div>
          </div>

          {/* Card 3: AI Conflict Engine */}
          <div
            className={`fan-card fan-card--3 ${activeCard === 3 ? "is-focused" : ""}`}
            onMouseEnter={() => setActiveCard(3)}
            onMouseLeave={() => setActiveCard(null)}
            data-cursor="Hazard Alert"
          >
            <div className="fan-card-header">
              <span className="fan-card-pill fan-card-pill--danger">Conflict Engine</span>
              <span className="fan-card-score">Score: 84 / 100</span>
            </div>
            <div className="fan-card-doctor">
              <h4 style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--danger, #b54338)" }}>
                <ShieldAlert size={18} /> Drug Interaction Hazard
              </h4>
              <p>Dual Renin-Angiotensin Blockade</p>
            </div>
            <div className="fan-card-alert-box">
              <AlertTriangle size={16} />
              <span>
                <strong>Warning:</strong> Combining Ramipril (ACEi) + Losartan (ARB) causes acute kidney hypotension & hyperkalemia.
              </span>
            </div>
            <div className="fan-card-footer">
              <span className="fan-card-tag tag-danger">High Clinical Discrepancy</span>
            </div>
          </div>

          {/* Card 4: ICMR Synthesis */}
          <div
            className={`fan-card fan-card--4 ${activeCard === 4 ? "is-focused" : ""}`}
            onMouseEnter={() => setActiveCard(4)}
            onMouseLeave={() => setActiveCard(null)}
            data-cursor="ICMR Synthesis"
          >
            <div className="fan-card-header">
              <span className="fan-card-pill fan-card-pill--green">Reconciled Plan</span>
              <span className="fan-card-source">ICMR 2023</span>
            </div>
            <div className="fan-card-doctor">
              <h4 style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--teal, #0d7c73)" }}>
                <CheckCircle2 size={18} /> Safe Recommendation
              </h4>
              <p>Grounded in ICMR Hypertension Guidelines</p>
            </div>
            <div className="fan-card-body">
              <div className="fan-card-row">
                <span className="fan-card-label">Action:</span>
                <span className="fan-card-val" style={{ color: "#065f46", fontWeight: 700 }}>
                  Discontinue Losartan immediately
                </span>
              </div>
              <div className="fan-card-row">
                <span className="fan-card-label">Recommended:</span>
                <span className="fan-card-val">Ramipril 5mg + Amlodipine 5mg</span>
              </div>
              <div className="fan-card-row">
                <span className="fan-card-label">Next Step:</span>
                <span className="fan-card-val">Spot Urine Albumin-to-Creatinine</span>
              </div>
            </div>
            <div className="fan-card-footer">
              <Link to="/case/new" className="fan-card-cta" data-cursor="Try Demo">
                Try Live Case Reconciliation <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
