import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, BrainCircuit, Mic, ShieldCheck } from "lucide-react";

export const HomePage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{ paddingBottom: "60px" }}
    >
      {/* 1. Hero Section */}
      <section className="home-section" style={{ paddingTop: "60px", paddingBottom: "60px", borderBottom: "none", overflow: "hidden", textAlign: "center" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", padding: "0 20px" }}>
          
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6, ease: "easeOut" }} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <h1 style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", margin: "0 0 24px", lineHeight: "1.1", fontFamily: "ui-serif, Georgia, serif", letterSpacing: "-0.03em", color: "var(--ink-900)" }}>
              Conflicting Opinions. <br/>
              <span style={{ color: "var(--teal)" }}>Resolved by AI.</span>
            </h1>
            <p style={{ fontSize: "1.2rem", margin: "0 auto 40px", color: "var(--ink-700)", lineHeight: "1.6", maxWidth: "650px" }}>
              SecondSight Pro is the first medical voice assistant that ingests conflicting prescriptions and explains them to patients using WHO-grounded RAG.
            </p>
            
            <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
              <Link to="/case/new" className="button primary" style={{ padding: "18px 36px", fontSize: "1.1rem", borderRadius: "999px", fontWeight: 600 }}>
                Start Triage / New Case
              </Link>
              <Link to="/dashboard" className="button ghost" style={{ padding: "18px 36px", fontSize: "1.1rem", borderRadius: "999px", fontWeight: 600, border: "2px solid var(--line)" }}>
                View Dashboard
              </Link>
            </div>
          </motion.div>

        </div>
      </section>

      {/* 2. Feature Section */}
      <section className="home-section">
        <h2 className="home-section-title">Core Capabilities</h2>
        <div className="feature-grid">
          <motion.div className="feature-card" whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
            <BrainCircuit size={40} color="var(--sky)" style={{ marginBottom: "16px" }} />
            <h3>LLM Conflict Resolution</h3>
            <p>Our proprietary engine calculates a "Conflict Score" between Doctor A and Doctor B, instantly summarizing where they agree and disagree.</p>
          </motion.div>
          <motion.div className="feature-card" whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
            <ShieldCheck size={40} color="var(--teal)" style={{ marginBottom: "16px" }} />
            <h3>RAG Evidence Grounding</h3>
            <p>We don't hallucinate. Every recommendation is cross-referenced via pgvector against real WHO clinical guidelines with visual confidence badges.</p>
          </motion.div>
          <motion.div className="feature-card" whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
            <Mic size={40} color="var(--amber)" style={{ marginBottom: "16px" }} />
            <h3>LiveKit Voice Agent</h3>
            <p>Patients don't want to read complex medical jargon. They can talk to our WebRTC-powered voice assistant in English or Hindi in real-time.</p>
          </motion.div>
        </div>
      </section>

      {/* 3. Unique Section (Comparison) */}
      <section className="home-section">
        <h2 className="home-section-title">Why We Are Different</h2>
        <div className="comparison-table-wrapper">
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Feature / Platform</th>
                <th>Generic LLMs (ChatGPT)</th>
                <th>Traditional Telemed Apps</th>
                <th style={{ color: "var(--teal)" }}>SecondSight Pro 🚀</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Conflict Resolution</strong></td>
                <td>❌ Gets confused / agrees with prompt</td>
                <td>❌ Connects you to more doctors</td>
                <td>✅ Computationally reconciles opposing opinions</td>
              </tr>
              <tr>
                <td><strong>Medical Evidence (RAG)</strong></td>
                <td>❌ Hallucinates treatments</td>
                <td>❌ Manual checking by doctors</td>
                <td>✅ Grounded directly in WHO Guidelines</td>
              </tr>
              <tr>
                <td><strong>Real-time Voice</strong></td>
                <td>🟡 Native App Only</td>
                <td>✅ Human doctor calls</td>
                <td>✅ Low-latency AI Voice Assistant via WebRTC</td>
              </tr>
              <tr>
                <td><strong>One-Click WhatsApp Share</strong></td>
                <td>❌ Copy-paste</td>
                <td>🟡 App-dependent</td>
                <td>✅ Instant Executive Summary deep-link</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 4. FAQ Section */}
      <section className="home-section">
        <h2 className="home-section-title">Frequently Asked Questions</h2>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <FAQItem question="Is my medical data safe?" answer="Yes. We do not store patient-identifying data long term. Case histories are anonymized, and Supabase Row-Level Security (RLS) protects all data." />
          <FAQItem question="How does the AI resolve conflicts?" answer="It uses a multi-step LangChain prompt. First, it extracts structured data (Diagnosis, Treatment). Then, it compares vectors to find contradictions, finally grounding its final opinion on WHO data via pgvector." />
          <FAQItem question="Can the Voice Assistant speak Hindi?" answer="Yes! We use Sarvam AI's Indic models integrated with LiveKit to provide ultra-fast, interruptible conversational voice in both English and Hindi/Hinglish." />
          <FAQItem question="Does this replace my doctor?" answer="Absolutely not. SecondSight Pro is a 'co-pilot' for patients. It explains complex situations and generates 'Questions to ask your specialist', but it does not prescribe medicine." />
        </div>
      </section>
    </motion.div>
  );
};

const FAQItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="faq-item">
      <button className="faq-question" onClick={() => setIsOpen(!isOpen)}>
        {question}
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={20} color="var(--ink-500)" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="faq-answer">{answer}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
