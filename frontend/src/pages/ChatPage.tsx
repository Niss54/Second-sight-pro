import React, { useState, useRef, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Sparkles, Plus, Search, Mic, ArrowUp, Square, Loader2 } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { askFollowupQuestion } from "../services/api";
import type { PatientCaseInput, VoiceAssistantResponse } from "../types";

/* ─── types ─── */
interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  citations?: VoiceAssistantResponse["citations"];
  timestamp: Date;
}

interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
}

/* ─── default case context for standalone chat ─── */
const DEFAULT_CASE: PatientCaseInput = {
  caseLabel: "Patient Chat Session",
  primaryCondition: "General Medical Query",
  patientAge: 35,
  comorbidities: [],
  symptoms: [],
  opinions: [
    {
      doctorName: "AI Medical Assistant",
      specialty: "General Medicine",
      urgency: "routine",
      diagnosis: "Awaiting patient query",
      treatment: "Will provide evidence-based guidance",
      prescriptions: [],
      tests: [],
      notes: "Patient seeking medical guidance via chat.",
    },
  ],
};

/* ─── suggestion prompts ─── */
const SUGGESTIONS = [
  {
    emoji: "🩺",
    title: "Explain my diagnosis",
    desc: "Upload reports and I'll explain them simply.",
    prompt: "Can you explain common medical diagnoses in simple Hindi and English? I want to understand what doctors usually mean.",
  },
  {
    emoji: "⚖️",
    title: "Compare opinions",
    desc: "Doctor A vs Doctor B: Where do they disagree?",
    prompt: "How should I compare two different doctor opinions? What questions should I ask each doctor?",
  },
  {
    emoji: "🗣️",
    title: "Hindi mein samjhao",
    desc: "मुझे हिंदी में समझाइए मेरी बीमारी के बारे में।",
    prompt: "Mujhe Hindi mein samjhao ki agar kisi ko high blood pressure ho toh kya karna chahiye? Kya diet leni chahiye?",
  },
  {
    emoji: "❓",
    title: "Questions for Doctor",
    desc: "Generate smart questions for your next consult.",
    prompt: "Generate a list of important questions I should ask my doctor during my next appointment about managing a chronic condition.",
  },
];

export const ChatPage: React.FC = () => {
  const { theme } = useTheme();

  /* ─── state ─── */
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  /* ─── refs ─── */
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  /* ─── auto-scroll ─── */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  /* ─── send message ─── */
  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isLoading) return;

      const userMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "user",
        text: text.trim(),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setIsLoading(true);

      try {
        const response = await askFollowupQuestion(DEFAULT_CASE, text.trim());

        const assistantMsg: ChatMessage = {
          id: crypto.randomUUID(),
          role: "assistant",
          text: response.text,
          citations: response.citations,
          timestamp: new Date(),
        };

        setMessages((prev) => {
          const updated = [...prev, assistantMsg];

          // Save to session history
          const sessionId = activeSessionId || crypto.randomUUID();
          if (!activeSessionId) setActiveSessionId(sessionId);

          setSessions((prevSessions) => {
            const existing = prevSessions.find((s) => s.id === sessionId);
            if (existing) {
              return prevSessions.map((s) =>
                s.id === sessionId ? { ...s, messages: updated } : s
              );
            }
            return [
              {
                id: sessionId,
                title: text.trim().slice(0, 40) + (text.length > 40 ? "…" : ""),
                messages: updated,
                createdAt: new Date(),
              },
              ...prevSessions,
            ];
          });

          return updated;
        });
      } catch (err: any) {
        const errorMsg: ChatMessage = {
          id: crypto.randomUUID(),
          role: "assistant",
          text:
            err?.response?.status === 503
              ? "⚠️ AI service is currently unavailable. Please check that OPENAI_API_KEY or GROQ_API_KEY is configured in backend/.env"
              : `⚠️ Something went wrong: ${err?.message || "Unknown error"}. Please try again.`,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMsg]);
      } finally {
        setIsLoading(false);
        inputRef.current?.focus();
      }
    },
    [isLoading, activeSessionId]
  );

  /* ─── new chat ─── */
  const startNewChat = () => {
    setMessages([]);
    setActiveSessionId(null);
    setInput("");
    inputRef.current?.focus();
  };

  /* ─── load session ─── */
  const loadSession = (session: ChatSession) => {
    setMessages(session.messages);
    setActiveSessionId(session.id);
  };

  /* ─── mic recording (Bhashini STT) ─── */
  const toggleRecording = async () => {
    if (isRecording) {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });

        // Convert to base64
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64 = (reader.result as string).split(",")[1];
          if (!base64) return;

          setIsLoading(true);
          try {
            const resp = await fetch("http://localhost:8080/api/voice/transcribe", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ audioBase64: base64, languageCode: "hi-IN" }),
            });
            const data = await resp.json();
            if (data.ok && data.transcript) {
              setInput(data.transcript);
              // Auto-send the transcribed text
              await sendMessage(data.transcript);
            } else {
              setInput("🎤 Voice input failed — please type your question");
            }
          } catch {
            setInput("🎤 Voice service unavailable — please type your question");
          } finally {
            setIsLoading(false);
          }
        };
        reader.readAsDataURL(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch {
      alert("Microphone access denied. Please allow mic access in your browser.");
    }
  };

  const hasMessages = messages.length > 0;

  return (
    <div className={`chat-layout ${theme === "dark" ? "dark" : ""}`}>
      {/* ── Sidebar ── */}
      <aside className="chat-sidebar">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
          <Link to="/" style={{ textDecoration: "none", color: "var(--ink-900)" }}>
            <h1 style={{ fontSize: "1.2rem", margin: 0, fontFamily: "ui-serif, Georgia, serif" }}>
              <span style={{ color: "var(--teal)" }}>Second</span>Sight
            </h1>
          </Link>
          <button className="button ghost" style={{ padding: "6px" }} onClick={startNewChat}>
            <Plus size={20} />
          </button>
        </div>

        <button
          className="button ghost"
          onClick={startNewChat}
          style={{
            justifyContent: "flex-start",
            padding: "10px 16px",
            marginBottom: "16px",
            borderRadius: "12px",
            border: "1px solid var(--line)",
          }}
        >
          <Plus size={16} /> New chat
        </button>

        <div style={{ position: "relative", marginBottom: "24px" }}>
          <Search size={14} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--ink-500)" }} />
          <input
            type="text"
            placeholder="Search chats..."
            style={{
              width: "100%",
              padding: "8px 12px 8px 32px",
              borderRadius: "8px",
              border: "1px solid var(--line)",
              background: "transparent",
              color: "var(--ink-900)",
              fontSize: "0.85rem",
            }}
          />
        </div>

        {/* Session list */}
        <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "4px" }}>
          {sessions.length === 0 ? (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "var(--ink-500)", opacity: 0.5 }}>
              <Sparkles size={24} style={{ marginBottom: "8px" }} />
              <span style={{ fontSize: "0.8rem" }}>Your conversations will appear here</span>
            </div>
          ) : (
            sessions.map((session) => (
              <button
                key={session.id}
                onClick={() => loadSession(session)}
                style={{
                  background: session.id === activeSessionId ? "rgba(13, 124, 115, 0.1)" : "transparent",
                  border: "none",
                  borderRadius: "8px",
                  padding: "10px 12px",
                  textAlign: "left",
                  cursor: "pointer",
                  color: "var(--ink-900)",
                  fontSize: "0.85rem",
                  transition: "background 0.2s",
                }}
              >
                {session.title}
              </button>
            ))
          )}
        </div>

        <div style={{ marginTop: "auto", display: "flex", alignItems: "center", gap: "12px", padding: "12px", borderRadius: "12px", background: "rgba(13, 124, 115, 0.05)" }}>
          <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "var(--teal)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "0.8rem" }}>
            AI
          </div>
          <div>
            <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--ink-900)" }}>Voice Assistant</div>
            <div style={{ fontSize: "0.75rem", color: "var(--ink-500)" }}>
              {isLoading ? "Thinking..." : "Ready for triage"}
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main Chat Area ── */}
      <main className="chat-main">
        <header className="chat-header">
          <div style={{ fontWeight: 600, color: "var(--ink-900)" }}>
            {hasMessages ? "Patient Triage Chat" : "New Patient Triage"}
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              className="button ghost"
              onClick={toggleRecording}
              style={{
                color: isRecording ? "white" : "var(--teal)",
                borderColor: isRecording ? "var(--danger)" : "var(--teal)",
                background: isRecording ? "var(--danger)" : "rgba(13, 124, 115, 0.1)",
                animation: isRecording ? "pulse 1.5s ease-in-out infinite" : "none",
              }}
            >
              {isRecording ? <Square size={16} /> : <Mic size={16} />}
              {isRecording ? "Stop Recording" : "Voice Input"}
            </button>
          </div>
        </header>

        {/* Messages area OR hero */}
        {!hasMessages ? (
          <div className="chat-hero">
            <div className="chat-logo-orb">
              <Sparkles size={32} />
            </div>
            <h2 style={{ fontSize: "2rem", margin: "0 0 8px", color: "var(--ink-900)" }}>How can I help you?</h2>
            <p style={{ color: "var(--ink-500)", fontSize: "0.95rem" }}>
              Discuss symptoms, compare second opinions, or prepare for your next visit.
            </p>

            <div className="chat-suggestion-grid">
              {SUGGESTIONS.map((s, i) => (
                <div
                  key={i}
                  className="chat-suggestion-pill"
                  onClick={() => sendMessage(s.prompt)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage(s.prompt)}
                >
                  <span className="chat-suggestion-title">
                    {s.emoji} {s.title}
                  </span>
                  <span className="chat-suggestion-desc">{s.desc}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="chat-messages-area">
            {messages.map((msg) => (
              <div key={msg.id} className={`chat-bubble-row ${msg.role}`}>
                {msg.role === "assistant" && (
                  <div className="chat-avatar">
                    <Sparkles size={16} />
                  </div>
                )}
                <div className={`chat-bubble ${msg.role}`}>
                  <div className="chat-bubble-text">{msg.text}</div>
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="chat-citations">
                      <span className="chat-citations-label">📚 Sources:</span>
                      {msg.citations.map((c, i) => (
                        <span key={i} className="chat-citation-chip">
                          {c.source}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="chat-bubble-time">
                    {msg.timestamp.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="chat-bubble-row assistant">
                <div className="chat-avatar">
                  <Sparkles size={16} />
                </div>
                <div className="chat-bubble assistant">
                  <div className="chat-typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Input bar */}
        <div className="chat-input-container">
          <div className="chat-input-wrapper">
            <button
              className={`chat-input-btn ${isRecording ? "recording" : ""}`}
              onClick={toggleRecording}
              title={isRecording ? "Stop recording" : "Start voice input"}
            >
              {isRecording ? <Square size={20} /> : <Mic size={20} />}
            </button>
            <input
              ref={inputRef}
              className="chat-input"
              placeholder={isRecording ? "🎤 Listening... speak now" : "Message SecondSight AI..."}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage(input);
                }
              }}
              disabled={isLoading || isRecording}
            />
            <button
              className={`chat-input-btn ${input.trim() ? "primary" : ""}`}
              disabled={!input.trim() || isLoading}
              onClick={() => sendMessage(input)}
            >
              {isLoading ? <Loader2 size={20} className="spin" /> : <ArrowUp size={20} />}
            </button>
          </div>
          <div className="chat-disclaimer">
            SecondSight AI can make mistakes. Please verify important medical information independently.
          </div>
        </div>
      </main>
    </div>
  );
};
