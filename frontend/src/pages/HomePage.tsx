import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export const HomePage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4 }}
    >
      <header className="hero" style={{ marginTop: "40px" }}>
        <div>
          <p className="eyebrow">Medical Voice Assistant</p>
          <h1 style={{ fontSize: "clamp(3rem, 6vw, 5rem)", marginTop: "12px" }}>SecondSight Pro</h1>
          <p style={{ fontSize: "1.2rem", marginTop: "16px", maxWidth: "800px" }}>
            A premium voice-first medical assistant that explains conflicting second opinions with calm,
            evidence-grounded guidance directly from WHO Clinical Guidelines.
          </p>
          <div className="hero-badges" style={{ marginTop: "24px" }}>
            <span>RAG Grounded</span>
            <span>Realtime Audio WebRTC</span>
            <span>LiveKit & Sarvam AI</span>
            <span>OpenAI GPT-4o</span>
          </div>
          
          <div style={{ marginTop: "48px", display: "flex", gap: "16px" }}>
            <Link to="/case/new" className="button primary" style={{ padding: "16px 32px", fontSize: "1.1rem" }}>
              Start Triage / New Case
            </Link>
            <Link to="/dashboard" className="button ghost" style={{ padding: "16px 32px", fontSize: "1.1rem" }}>
              View History
            </Link>
          </div>
        </div>
      </header>
    </motion.div>
  );
};
