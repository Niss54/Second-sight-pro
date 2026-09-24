import React from "react";

const trackItemsTop = [
  { label: "ICMR 2023 Guidelines", color: "orange", icon: "🏛️" },
  { label: "Dual ACE+ARB Renin Blockade Hazard", color: "pink", icon: "🚨" },
  { label: "Bhashini Indic Voice STT (Govt of India)", color: "green", icon: "🎙️" },
  { label: "Sarvam AI Hindi TTS", color: "blue", icon: "🔊" },
  { label: "Supabase pgvector RAG", color: "yellow", icon: "⚡" },
  { label: "Triple Whammy AKI Prevention", color: "pink", icon: "🛡️" },
  { label: "ABDM Ayushman Bharat Ready", color: "green", icon: "🇮🇳" },
  { label: "Zero Hallucination Guarantee", color: "orange", icon: "✨" },
];

const trackItemsBottom = [
  { label: "Metformin 1st Line T2D (ICMR)", color: "green", icon: "💊" },
  { label: "Spironolactone 4th Line HTN", color: "yellow", icon: "🩺" },
  { label: "Gemini 1.5/2.0 + Groq Instant Failover", color: "orange", icon: "⚡" },
  { label: "AWaRe Antibiotic Stewardship", color: "blue", icon: "🔬" },
  { label: "Doctor Multi-Triage Dashboard", color: "pink", icon: "📋" },
  { label: "Prescription OCR Pipeline", color: "green", icon: "📄" },
  { label: "English · हिन्दी · Hinglish", color: "orange", icon: "🌐" },
  { label: "Verified Clinical Citations", color: "blue", icon: "📚" },
];

export const MarqueeTicker: React.FC = () => {
  return (
    <div className="marquee-banner-container" aria-hidden="true">
      {/* Top Track (Moving Left) */}
      <div className="marquee-row marquee-row--left">
        <div className="marquee-content">
          {[...trackItemsTop, ...trackItemsTop].map((item, idx) => (
            <div key={`top-${idx}`} className={`marquee-badge marquee-badge--${item.color}`}>
              <span className="marquee-icon">{item.icon}</span>
              <span className="marquee-text">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Track (Moving Right) */}
      <div className="marquee-row marquee-row--right">
        <div className="marquee-content">
          {[...trackItemsBottom, ...trackItemsBottom].map((item, idx) => (
            <div key={`bot-${idx}`} className={`marquee-badge marquee-badge--${item.color}`}>
              <span className="marquee-icon">{item.icon}</span>
              <span className="marquee-text">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
