import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles, MessageSquare, Plus, Search, Paperclip, Mic, ArrowUp } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

export const ChatPage: React.FC = () => {
  const [input, setInput] = useState("");
  const { theme } = useTheme();

  return (
    <div className={`chat-layout ${theme === "dark" ? "dark" : ""}`}>
      {/* Sidebar */}
      <aside className="chat-sidebar">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
          <Link to="/" style={{ textDecoration: "none", color: "var(--ink-900)" }}>
            <h1 style={{ fontSize: "1.2rem", margin: 0, fontFamily: "ui-serif, Georgia, serif" }}>
              <span style={{ color: "var(--teal)" }}>Second</span>Sight
            </h1>
          </Link>
          <button className="button ghost" style={{ padding: "6px" }}><Plus size={20} /></button>
        </div>

        <button className="button ghost" style={{ justifyContent: "flex-start", padding: "10px 16px", marginBottom: "16px", borderRadius: "12px", border: "1px solid var(--line)" }}>
          <Plus size={16} /> New chat
        </button>

        <div style={{ position: "relative", marginBottom: "24px" }}>
          <Search size={14} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--ink-500)" }} />
          <input 
            type="text" 
            placeholder="Search chats..." 
            style={{ width: "100%", padding: "8px 12px 8px 32px", borderRadius: "8px", border: "1px solid var(--line)", background: "transparent", color: "var(--ink-900)", fontSize: "0.85rem" }} 
          />
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "var(--ink-500)", opacity: 0.5 }}>
          <Sparkles size={24} style={{ marginBottom: "8px" }} />
          <span style={{ fontSize: "0.8rem" }}>Your conversations will appear here</span>
        </div>

        <div style={{ marginTop: "auto", display: "flex", alignItems: "center", gap: "12px", padding: "12px", borderRadius: "12px", background: "rgba(13, 124, 115, 0.05)" }}>
          <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "var(--teal)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "0.8rem" }}>
            AI
          </div>
          <div>
            <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--ink-900)" }}>Voice Assistant</div>
            <div style={{ fontSize: "0.75rem", color: "var(--ink-500)" }}>Ready for triage</div>
          </div>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="chat-main">
        <header className="chat-header">
          <div style={{ fontWeight: 600, color: "var(--ink-900)" }}>New Patient Triage</div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button className="button ghost" style={{ color: "var(--teal)", borderColor: "var(--teal)", background: "rgba(13, 124, 115, 0.1)" }}>
              <Mic size={16} /> Voice Call
            </button>
            <button className="button ghost">English</button>
          </div>
        </header>

        <div className="chat-hero">
          <div className="chat-logo-orb">
            <Sparkles size={32} />
          </div>
          <h2 style={{ fontSize: "2rem", margin: "0 0 8px", color: "var(--ink-900)" }}>How can I help you?</h2>
          <p style={{ color: "var(--ink-500)", fontSize: "0.95rem" }}>Discuss symptoms, compare second opinions, or prepare for your next visit.</p>

          <div className="chat-suggestion-grid">
            <div className="chat-suggestion-pill">
              <span className="chat-suggestion-title">🩺 Explain my diagnosis</span>
              <span className="chat-suggestion-desc">Upload reports and I'll explain them simply.</span>
            </div>
            <div className="chat-suggestion-pill">
              <span className="chat-suggestion-title">⚖️ Compare opinions</span>
              <span className="chat-suggestion-desc">Doctor A vs Doctor B: Where do they disagree?</span>
            </div>
            <div className="chat-suggestion-pill">
              <span className="chat-suggestion-title">🗣️ LiveKit Voice</span>
              <span className="chat-suggestion-desc">Tap the mic to talk to me in Hindi or English.</span>
            </div>
            <div className="chat-suggestion-pill">
              <span className="chat-suggestion-title">❓ Questions for Doctor</span>
              <span className="chat-suggestion-desc">Generate smart questions for your next consult.</span>
            </div>
          </div>
        </div>

        <div className="chat-input-container">
          <div className="chat-input-wrapper">
            <button className="chat-input-btn"><Paperclip size={20} /></button>
            <input 
              className="chat-input" 
              placeholder="Message SecondSight AI..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setInput("");
                }
              }}
            />
            <button className="chat-input-btn"><Mic size={20} /></button>
            <button className={`chat-input-btn ${input ? 'primary' : ''}`} disabled={!input}><ArrowUp size={20} /></button>
          </div>
          <div className="chat-disclaimer">
            SecondSight AI can make mistakes. Please verify important medical information independently.
          </div>
        </div>
      </main>
    </div>
  );
};
