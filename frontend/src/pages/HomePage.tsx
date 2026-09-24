import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  BrainCircuit,
  Mic,
  ShieldCheck,
  Stethoscope,
  ArrowRight,
  FileText,
  Volume2,
  HeartPulse,
  Activity,
  Flame
} from "lucide-react";
import { AmbientParticles } from "../components/AmbientParticles";
import { SpinningStar, WobblySmiley, HandDrawnUnderline, NeoPill } from "../components/InteractiveStickers";
import { MarqueeTicker } from "../components/MarqueeTicker";
import { MotionCardDeck } from "../components/MotionCardDeck";

export const HomePage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      style={{ paddingBottom: "70px" }}
    >
      {/* ─── 1. HERO SECTION ─── */}
      <section className="home-hero-section" style={{ position: "relative", overflow: "hidden" }}>
        {/* Ambient Pulsing Particles matching nissh.info */}
        <AmbientParticles count={20} />

        {/* Playful Stickers matching nissh.info */}
        <div
          className="hero-sticker-left"
          style={{
            position: "absolute",
            top: "24px",
            left: "24px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            zIndex: 2,
            pointerEvents: "none"
          }}
        >
          <SpinningStar size={34} color="var(--color-orange, #f5693c)" />
          <NeoPill label="Clinical Diff Engine" theme="yellow" tilt={-4} />
        </div>

        <div
          className="hero-sticker-right"
          style={{
            position: "absolute",
            top: "24px",
            right: "24px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            zIndex: 2,
            pointerEvents: "none"
          }}
        >
          <NeoPill label="Zero Hallucination" theme="green" tilt={3} />
          <WobblySmiley size={36} />
        </div>

        <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 20px", textAlign: "center", position: "relative", zIndex: 1 }}>
          
          {/* Trust Badge */}
          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "7px 18px", borderRadius: "999px", background: "rgba(13, 124, 115, 0.09)", border: "1.5px solid rgba(13, 124, 115, 0.25)", color: "var(--teal)", fontSize: "0.85rem", fontWeight: 700, marginBottom: "24px" }}
            data-cursor="guidelines"
          >
            <ShieldCheck size={16} />
            <span>Grounded in ICMR 2022 & WHO Guidelines · Ayushman Bharat ABDM Ready</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{
              fontSize: "clamp(2.4rem, 5.5vw, 4.2rem)",
              margin: "0 0 20px",
              lineHeight: 1.15,
              fontWeight: 800,
              letterSpacing: "-0.03em",
              color: "var(--ink-900)"
            }}
          >
            Conflicting Doctor Opinions? <br />
            <span style={{ position: "relative", display: "inline-block" }}>
              <span style={{
                background: "linear-gradient(135deg, var(--teal), #2563eb)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}>
                Reconciled
              </span>
              <HandDrawnUnderline color="var(--color-orange, #f5693c)" />
            </span>{" "}
            <span>by Clinical AI.</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              fontSize: "1.15rem",
              margin: "0 auto 36px",
              color: "var(--ink-700)",
              lineHeight: 1.65,
              maxWidth: "720px"
            }}
          >
            In India, patients regularly consult 2–4 doctors and get contradictory prescriptions. SecondSight Pro computationally scores conflicts, detects dangerous drug interactions, cross-references ICMR/WHO protocols, and explains findings in Hindi and English.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap", marginBottom: "44px" }}
          >
            <Link
              to="/case/new"
              className="button primary neo-cta"
              data-cursor="start case"
              style={{
                padding: "16px 34px",
                fontSize: "1.05rem",
                borderRadius: "999px",
                fontWeight: 700,
                display: "inline-flex",
                alignItems: "center",
                gap: "10px"
              }}
            >
              <span>Analyze Conflicting Case</span>
              <ArrowRight size={18} />
            </Link>

            <Link
              to="/chat"
              className="button ghost neo-cta"
              data-cursor="voice ai"
              style={{
                padding: "16px 28px",
                fontSize: "1.05rem",
                borderRadius: "999px",
                fontWeight: 700,
                border: "2px solid #111111",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px"
              }}
            >
              <Mic size={18} color="var(--teal)" />
              <span>Voice AI Copilot</span>
            </Link>

            <Link
              to="/doctor"
              className="button ghost neo-cta"
              data-cursor="doctor queue"
              style={{
                padding: "16px 24px",
                fontSize: "1.05rem",
                borderRadius: "999px",
                fontWeight: 700,
                border: "2px solid #111111",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px"
              }}
            >
              <Activity size={18} color="var(--sky)" />
              <span>Doctor Portal</span>
            </Link>
          </motion.div>

          {/* Demo Case Quick-Jump Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: "10px",
              padding: "12px 18px",
              borderRadius: "16px",
              background: "var(--card)",
              border: "1px solid var(--line)",
              maxWidth: "840px",
              margin: "0 auto"
            }}
          >
            <span style={{ fontSize: "0.82rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--ink-500)", display: "flex", alignItems: "center", gap: "5px" }}>
              <Flame size={14} color="#f59e0b" />
              <span>Live India Demos:</span>
            </span>

            <Link
              to="/case/new"
              className="demo-pill"
              data-cursor="diabetes demo"
              style={{
                fontSize: "0.85rem",
                padding: "5px 12px",
                borderRadius: "999px",
                background: "rgba(13, 124, 115, 0.08)",
                color: "var(--teal)",
                textDecoration: "none",
                fontWeight: 600,
                border: "1px solid rgba(13, 124, 115, 0.2)"
              }}
            >
              Diabetes: Metformin vs Sulfonylurea (ICMR)
            </Link>

            <Link
              to="/case/new"
              className="demo-pill"
              data-cursor="danger demo"
              style={{
                fontSize: "0.85rem",
                padding: "5px 12px",
                borderRadius: "999px",
                background: "rgba(181, 67, 56, 0.08)",
                color: "#b54338",
                textDecoration: "none",
                fontWeight: 600,
                border: "1px solid rgba(181, 67, 56, 0.2)"
              }}
            >
              HTN: ACE + ARB Conflict (WHO Danger)
            </Link>

            <Link
              to="/case/new"
              className="demo-pill"
              data-cursor="imaging demo"
              style={{
                fontSize: "0.85rem",
                padding: "5px 12px",
                borderRadius: "999px",
                background: "rgba(37, 99, 235, 0.08)",
                color: "#2563eb",
                textDecoration: "none",
                fontWeight: 600,
                border: "1px solid rgba(37, 99, 235, 0.2)"
              }}
            >
              Breast Lesion (Discordant Imaging)
            </Link>
          </motion.div>

        </div>
      </section>

      {/* ─── KINETIC MARQUEE TICKER (Double track) ─── */}
      <section style={{ margin: "32px 0 20px" }}>
        <MarqueeTicker />
      </section>

      {/* ─── INTERACTIVE FANNING MOTION CARDS DECK ─── */}
      <section style={{ margin: "20px 0 60px" }}>
        <MotionCardDeck />
      </section>

      {/* ─── 2. CORE CAPABILITIES (4 CARDS) ─── */}
      <section className="home-section" style={{ marginTop: "40px" }}>
        <div style={{ textAlign: "center", maxWidth: "680px", margin: "0 auto 40px" }}>
          <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--teal)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Engineered For Clinical Trust
          </span>
          <h2 style={{ fontSize: "2.2rem", fontWeight: 700, margin: "8px 0 14px", color: "var(--ink-900)" }}>
            Four Pillars of Medical Reconciliation
          </h2>
          <p style={{ color: "var(--ink-500)", fontSize: "1rem", lineHeight: 1.6 }}>
            Designed specifically for India's healthcare landscape where patients face conflicting opinions and fragmented medical records.
          </p>
        </div>

        <div className="feature-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
          
          <motion.div className="feature-card" whileHover={{ y: -6 }} transition={{ duration: 0.25 }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(37, 99, 235, 0.1)", display: "grid", placeItems: "center", marginBottom: "18px" }}>
              <BrainCircuit size={26} color="#2563eb" />
            </div>
            <h3 style={{ fontSize: "1.25rem", margin: "0 0 10px", color: "var(--ink-900)", fontWeight: 700 }}>
              Conflict Scoring Engine
            </h3>
            <p style={{ color: "var(--ink-700)", fontSize: "0.95rem", lineHeight: 1.6, margin: 0 }}>
              Calculates a mathematical 0–100% Conflict Severity Score comparing diagnoses, drug mechanisms, dosages, and urgency across up to 5 doctor prescriptions.
            </p>
          </motion.div>

          <motion.div className="feature-card" whileHover={{ y: -6 }} transition={{ duration: 0.25 }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(13, 124, 115, 0.1)", display: "grid", placeItems: "center", marginBottom: "18px" }}>
              <ShieldCheck size={26} color="var(--teal)" />
            </div>
            <h3 style={{ fontSize: "1.25rem", margin: "0 0 10px", color: "var(--ink-900)", fontWeight: 700 }}>
              ICMR & WHO pgvector RAG
            </h3>
            <p style={{ color: "var(--ink-700)", fontSize: "0.95rem", lineHeight: 1.6, margin: 0 }}>
              Zero hallucination policy. Every finding quotes official guidelines from ICMR 2022/2023, WHO Essential Medicines, and National Health Portal India with paragraph citations.
            </p>
          </motion.div>

          <motion.div className="feature-card" whileHover={{ y: -6 }} transition={{ duration: 0.25 }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(245, 158, 11, 0.1)", display: "grid", placeItems: "center", marginBottom: "18px" }}>
              <Mic size={26} color="#f59e0b" />
            </div>
            <h3 style={{ fontSize: "1.25rem", margin: "0 0 10px", color: "var(--ink-900)", fontWeight: 700 }}>
              Bhashini & Sarvam Indic Voice
            </h3>
            <p style={{ color: "var(--ink-700)", fontSize: "0.95rem", lineHeight: 1.6, margin: 0 }}>
              Patients can speak in Hindi or English using Govt of India's Bhashini STT, and listen to natural Indic-accented audio summaries synthesized via Sarvam AI.
            </p>
          </motion.div>

          <motion.div className="feature-card" whileHover={{ y: -6 }} transition={{ duration: 0.25 }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(139, 92, 246, 0.1)", display: "grid", placeItems: "center", marginBottom: "18px" }}>
              <HeartPulse size={26} color="#8b5cf6" />
            </div>
            <h3 style={{ fontSize: "1.25rem", margin: "0 0 10px", color: "var(--ink-900)", fontWeight: 700 }}>
              ABDM & WhatsApp Action Plan
            </h3>
            <p style={{ color: "var(--ink-700)", fontSize: "0.95rem", lineHeight: 1.6, margin: 0 }}>
              Includes Ayushman Bharat ABHA Health ID support, one-click family WhatsApp formatted share, downloadable clinical PDF summary, and doctor triage portal.
            </p>
          </motion.div>

        </div>
      </section>

      {/* ─── 3. INTERACTIVE HOW IT WORKS TIMELINE ─── */}
      <section className="home-section" style={{ marginTop: "60px" }}>
        <div style={{ textAlign: "center", maxWidth: "680px", margin: "0 auto 40px" }}>
          <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--teal)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Step-by-Step Triage
          </span>
          <h2 style={{ fontSize: "2.2rem", fontWeight: 700, margin: "8px 0 14px", color: "var(--ink-900)" }}>
            How SecondSight Pro Works
          </h2>
          <p style={{ color: "var(--ink-500)", fontSize: "1rem", lineHeight: 1.6 }}>
            From conflicting prescriptions to clear clinical direction in under 60 seconds.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px" }}>
          {[
            {
              step: "01",
              title: "Input Opinions",
              desc: "Enter doctor prescriptions or upload handwritten Rx / Lab PDFs using OCR.",
              icon: <FileText size={22} color="var(--teal)" />
            },
            {
              step: "02",
              title: "Algorithmic Diff",
              desc: "AI identifies diagnostic divergence, dosage discrepancies, and drug interactions.",
              icon: <BrainCircuit size={22} color="#2563eb" />
            },
            {
              step: "03",
              title: "Evidence Retrieval",
              desc: "Matches case against pgvector database of ICMR & WHO medical guidelines.",
              icon: <ShieldCheck size={22} color="#8b5cf6" />
            },
            {
              step: "04",
              title: "Voice & Action Plan",
              desc: "Receive clear next steps, doctor questions, Hindi voice summary, and WhatsApp report.",
              icon: <Volume2 size={22} color="#f59e0b" />
            }
          ].map((item, idx) => (
            <div
              key={idx}
              style={{
                background: "var(--card)",
                border: "1px solid var(--line)",
                borderRadius: "18px",
                padding: "24px 20px",
                position: "relative",
                transition: "all 0.25s ease"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: "var(--bg-1)", display: "grid", placeItems: "center" }}>
                  {item.icon}
                </div>
                <span style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--ink-300)" }}>
                  {item.step}
                </span>
              </div>
              <h4 style={{ fontSize: "1.1rem", fontWeight: 700, margin: "0 0 8px", color: "var(--ink-900)" }}>
                {item.title}
              </h4>
              <p style={{ fontSize: "0.9rem", color: "var(--ink-500)", lineHeight: 1.55, margin: 0 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 4. COMPETITIVE COMPARISON MATRIX ─── */}
      <section className="home-section" style={{ marginTop: "60px" }}>
        <div style={{ textAlign: "center", maxWidth: "680px", margin: "0 auto 40px" }}>
          <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--teal)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            The Competitive Edge
          </span>
          <h2 style={{ fontSize: "2.2rem", fontWeight: 700, margin: "8px 0 14px", color: "var(--ink-900)" }}>
            Why Standard Tools Fall Short
          </h2>
          <p style={{ color: "var(--ink-500)", fontSize: "1rem", lineHeight: 1.6 }}>
            Generic AI sycophantically agrees with user prompts. Telemedicine just books another appointment. SecondSight Pro solves the conflict.
          </p>
        </div>

        <div className="comparison-table-wrapper" style={{ overflowX: "auto" }}>
          <table className="comparison-table" style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0 }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: "16px 20px" }}>Feature / Capability</th>
                <th style={{ textAlign: "center", padding: "16px" }}>Generic AI (ChatGPT)</th>
                <th style={{ textAlign: "center", padding: "16px" }}>Telemedicine Apps</th>
                <th style={{ textAlign: "center", padding: "16px", background: "rgba(13, 124, 115, 0.12)", color: "var(--teal)", borderRadius: "12px 12px 0 0" }}>
                  SecondSight Pro 🩺
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  feat: "Multi-Doctor Conflict Scoring",
                  chatgpt: "❌ Hallucinates or hedges vaguely",
                  telemed: "❌ Recommends 3rd doctor",
                  pro: "✅ Algorithmic 0–100% Conflict Score"
                },
                {
                  feat: "ICMR & WHO Guideline Evidence",
                  chatgpt: "❌ Unverified web citations",
                  telemed: "❌ Manual doctor search",
                  pro: "✅ pgvector RAG with official PDF citations"
                },
                {
                  feat: "Dangerous Drug Combination Flag",
                  chatgpt: "🟡 Inconsistent warnings",
                  telemed: "❌ Only flags single prescription",
                  pro: "✅ Identifies ACE+ARB, Triple Whammy AKI"
                },
                {
                  feat: "Bhashini Hindi Voice Input",
                  chatgpt: "❌ Poor Indic accents / paid",
                  telemed: "❌ English text only",
                  pro: "✅ Free Govt of India Bhashini STT"
                },
                {
                  feat: "Sarvam AI Indic Speech Output",
                  chatgpt: "❌ Robotic generic voice",
                  telemed: "❌ None",
                  pro: "✅ Natural Hindi/Hinglish Voice TTS"
                },
                {
                  feat: "WhatsApp One-Click Sharing",
                  chatgpt: "❌ Copy paste only",
                  telemed: "🟡 Proprietary app only",
                  pro: "✅ Instant formatted family deep-link"
                },
                {
                  feat: "Doctor Review Portal with Triage",
                  chatgpt: "❌ None",
                  telemed: "🟡 Basic appointment calendar",
                  pro: "✅ Priority queue sorted by conflict severity"
                }
              ].map((row, idx) => (
                <tr key={idx}>
                  <td style={{ padding: "14px 20px", fontWeight: 600, color: "var(--ink-900)" }}>
                    {row.feat}
                  </td>
                  <td style={{ textAlign: "center", padding: "14px", color: "var(--ink-700)" }}>
                    {row.chatgpt}
                  </td>
                  <td style={{ textAlign: "center", padding: "14px", color: "var(--ink-700)" }}>
                    {row.telemed}
                  </td>
                  <td style={{ textAlign: "center", padding: "14px", fontWeight: 700, color: "var(--teal)", background: "rgba(13, 124, 115, 0.04)" }}>
                    {row.pro}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ─── 5. ACCORDION FAQ SECTION ─── */}
      <section className="home-section" style={{ marginTop: "60px" }}>
        <div style={{ textAlign: "center", maxWidth: "680px", margin: "0 auto 36px" }}>
          <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--teal)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Clear Answers
          </span>
          <h2 style={{ fontSize: "2.2rem", fontWeight: 700, margin: "8px 0 14px", color: "var(--ink-900)" }}>
            Frequently Asked Questions
          </h2>
        </div>

        <div style={{ maxWidth: "820px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "12px" }}>
          <FAQItem
            question="Is SecondSight Pro meant to replace my consulting doctor?"
            answer="No, absolutely not. SecondSight Pro acts as an intelligent clinical co-pilot. When two doctors give opposing advice, it clarifies what the differences mean, identifies hazardous drug interactions, references official ICMR/WHO guidelines, and generates targeted questions for your specialist."
          />
          <FAQItem
            question="How does the conflict scoring engine evaluate disagreements?"
            answer="Our algorithm extracts structured diagnoses, proposed interventions, drug classes, dosages, and urgency flags. It then computes weighted vector distance and cross-references an automated contradiction rule-matrix to output an agreement score and safety rating."
          />
          <FAQItem
            question="Can rural or elderly patients use voice input in Hindi?"
            answer="Yes! SecondSight Pro integrates the Government of India's Bhashini speech-to-text API (ULCA), allowing patients to speak naturally in Hindi. The system synthesizes Indian-accented Hindi/Hinglish audio via Sarvam AI so anyone can listen without reading complex English reports."
          />
          <FAQItem
            question="How is patient privacy protected under ABDM guidelines?"
            answer="Patient cases are protected with Supabase Row-Level Security (RLS). Identifying markers are anonymized, and cases can link to Ayushman Bharat Digital Mission (ABDM) ABHA health accounts securely without third-party data tracking."
          />
        </div>
      </section>

      {/* ─── 6. BOTTOM CALL TO ACTION BANNER ─── */}
      <section style={{ marginTop: "70px" }}>
        <div
          style={{
            background: "linear-gradient(135deg, rgba(13, 124, 115, 0.12), rgba(37, 99, 235, 0.12))",
            border: "1.5px solid rgba(13, 124, 115, 0.25)",
            borderRadius: "24px",
            padding: "48px 32px",
            textAlign: "center",
            maxWidth: "960px",
            margin: "0 auto",
            boxShadow: "var(--shadow-md)"
          }}
        >
          <h2 style={{ fontSize: "2rem", fontWeight: 800, margin: "0 0 14px", color: "var(--ink-900)" }}>
            Ready to Reconcile Conflicting Opinions?
          </h2>
          <p style={{ color: "var(--ink-700)", fontSize: "1.05rem", maxWidth: "600px", margin: "0 auto 28px", lineHeight: 1.6 }}>
            Load one of our pre-built Indian clinical cases or upload your own prescriptions to see the conflict scoring engine in action.
          </p>
          <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              to="/case/new"
              className="button primary neo-cta"
              data-cursor="start case"
              style={{
                padding: "16px 36px",
                fontSize: "1rem",
                borderRadius: "999px",
                fontWeight: 700,
                display: "inline-flex",
                alignItems: "center",
                gap: "8px"
              }}
            >
              <Stethoscope size={18} />
              <span>Launch Case Reconciler</span>
            </Link>

            <Link
              to="/doctor"
              className="button ghost neo-cta"
              data-cursor="doctor queue"
              style={{
                padding: "16px 28px",
                fontSize: "1rem",
                borderRadius: "999px",
                fontWeight: 700,
                border: "2px solid #111111",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px"
              }}
            >
              <Activity size={18} color="var(--teal)" />
              <span>Doctor Review Queue</span>
            </Link>
          </div>
        </div>
      </section>

    </motion.div>
  );
};

const FAQItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div
      style={{
        background: "var(--card)",
        border: "1px solid var(--line)",
        borderRadius: "14px",
        overflow: "hidden",
        transition: "border-color 0.2s ease"
      }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: "100%",
          padding: "18px 20px",
          background: "none",
          border: "none",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer",
          textAlign: "left",
          fontSize: "1.02rem",
          fontWeight: 600,
          color: "var(--ink-900)"
        }}
      >
        <span>{question}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.25 }}>
          <ChevronDown size={20} color="var(--ink-500)" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <div
              style={{
                padding: "0 20px 18px",
                fontSize: "0.95rem",
                color: "var(--ink-700)",
                lineHeight: 1.65,
                borderTop: "1px solid var(--line)"
              }}
            >
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
