import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, Mic, PauseCircle, Send, Sparkles, Volume2, VolumeX } from "lucide-react";
import type { ReconciliationOutput, PatientCaseInput, VoiceAssistantResponse } from "../types";
import { askFollowupQuestion, speakMedicalSummary } from "../services/api";

type TranscriptRole = "assistant" | "user" | "system";

type SpeechRecognitionLike = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((event: {
    results: ArrayLike<{
      0: { transcript: string };
      isFinal: boolean;
    }>;
  }) => void) | null;
  onend: (() => void) | null;
};

interface TranscriptItem {
  id: string;
  role: TranscriptRole;
  text: string;
}

interface VoiceAssistantPanelProps {
  caseData: PatientCaseInput;
  analysis: ReconciliationOutput | null;
  onStatusChange?: (message: string, tone?: "info" | "success" | "error") => void;
}

function uid(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function splitIntoChunks(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function useSpeechRecognition() {
  const [supported] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    const browserWindow = window as Window & {
      webkitSpeechRecognition?: new () => SpeechRecognitionLike;
      SpeechRecognition?: new () => SpeechRecognitionLike;
    };

    return Boolean(browserWindow.SpeechRecognition || browserWindow.webkitSpeechRecognition);
  });

  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
  }, []);

  const start = useCallback(
    (onResult: (text: string, interim: boolean) => void, onEnd?: () => void) => {
      const SpeechRecognitionCtor =
        (window as Window & {
          webkitSpeechRecognition?: new () => SpeechRecognitionLike;
          SpeechRecognition?: new () => SpeechRecognitionLike;
        }).SpeechRecognition ??
        (window as Window & {
          webkitSpeechRecognition?: new () => SpeechRecognitionLike;
          SpeechRecognition?: new () => SpeechRecognitionLike;
        }).webkitSpeechRecognition;

      if (!SpeechRecognitionCtor) {
        return false;
      }

      const recognition = new SpeechRecognitionCtor();
      recognition.lang = "en-US";
      recognition.interimResults = true;
      recognition.continuous = false;

      recognition.onresult = (event) => {
        const results = Array.from(event.results);
        const transcript = results.map((result) => result[0]?.transcript ?? "").join(" ").trim();
        const isFinal = event.results[event.results.length - 1]?.isFinal ?? false;
        onResult(transcript, !isFinal);
      };

      recognition.onend = () => {
        recognitionRef.current = null;
        onEnd?.();
      };

      recognition.start();
      recognitionRef.current = recognition;
      return true;
    },
    []
  );

  return { supported, start, stop };
}

export function VoiceAssistantPanel({ caseData, analysis, onStatusChange }: VoiceAssistantPanelProps) {
  const [question, setQuestion] = useState("");
  const [transcript, setTranscript] = useState<TranscriptItem[]>([
    {
      id: uid("system"),
      role: "system",
      text: "Voice assistant ready. Start with a spoken summary or ask a follow-up question."
    }
  ]);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [isLoadingFollowup, setIsLoadingFollowup] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceResponse, setVoiceResponse] = useState<VoiceAssistantResponse | null>(null);
  const [liveText, setLiveText] = useState("");

  const recognition = useSpeechRecognition();

  const medicalModeLabel = useMemo(() => {
    if (!analysis) {
      return "No analysis yet";
    }

    return `Conflict Score · ${analysis.conflict_score}`;
  }, [analysis]);

  const appendTranscript = useCallback((role: TranscriptRole, text: string) => {
    setTranscript((current) => [...current, { id: uid(role), role, text }]);
  }, []);

  const speakChunks = useCallback(async (text: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      return;
    }

    window.speechSynthesis.cancel();
    setIsSpeaking(true);

    const chunks = splitIntoChunks(text);
    for (const chunk of chunks) {
      await new Promise<void>((resolve) => {
        const utterance = new SpeechSynthesisUtterance(chunk);
        utterance.rate = 0.93;
        utterance.pitch = 0.96;
        utterance.volume = 1;
        utterance.onend = () => resolve();
        utterance.onerror = () => resolve();
        window.speechSynthesis.speak(utterance);
      });
    }

    setIsSpeaking(false);
  }, []);

  const interruptSpeech = useCallback(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    recognition.stop();
    setIsSpeaking(false);
    setIsListening(false);
    onStatusChange?.("Voice output interrupted.", "info");
  }, [onStatusChange, recognition]);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      recognition.stop();
    };
  }, [recognition]);

  const handleSpeakSummary = useCallback(async () => {
    if (!analysis) {
      onStatusChange?.("Run analysis first to generate a spoken summary.", "error");
      return;
    }

    setIsLoadingSummary(true);
    try {
      const result = await speakMedicalSummary(caseData, analysis);
      setVoiceResponse(result);
      appendTranscript("assistant", result.text);
      onStatusChange?.("Spoken summary ready.", "success");
      await speakChunks(result.text);
    } catch {
      onStatusChange?.("Could not generate the spoken summary.", "error");
    } finally {
      setIsLoadingSummary(false);
    }
  }, [analysis, appendTranscript, caseData, onStatusChange, speakChunks]);

  const handleAskFollowup = useCallback(async () => {
    if (!question.trim()) {
      onStatusChange?.("Type or dictate a follow-up question first.", "error");
      return;
    }

    appendTranscript("user", question.trim());
    setIsLoadingFollowup(true);

    try {
      const result = await askFollowupQuestion(caseData, question.trim(), analysis ?? undefined);
      setVoiceResponse(result);
      appendTranscript("assistant", result.text);
      setQuestion("");
      onStatusChange?.("Follow-up answered.", "success");
      await speakChunks(result.text);
    } catch {
      onStatusChange?.("Could not answer the follow-up question.", "error");
    } finally {
      setIsLoadingFollowup(false);
    }
  }, [analysis, appendTranscript, caseData, onStatusChange, question, speakChunks]);

  const toggleListening = useCallback(() => {
    if (isListening) {
      recognition.stop();
      setIsListening(false);
      onStatusChange?.("Listening stopped.", "info");
      return;
    }

    const started = recognition.start(
      (text, interim) => {
        setLiveText(text);
        if (!interim) {
          setQuestion(text);
        }
      },
      () => {
        setIsListening(false);
      }
    );

    if (!started) {
      onStatusChange?.("Speech recognition is not supported in this browser.", "error");
      return;
    }

    setLiveText("");
    setIsListening(true);
    onStatusChange?.("Listening for your question...", "info");
  }, [isListening, onStatusChange, recognition]);

  const metricRows = useMemo(() => {
    if (!analysis) {
      return [
        { label: "Diagnosis", value: 0 },
        { label: "Treatment", value: 0 },
        { label: "Medication", value: 0 },
        { label: "Urgency", value: 0 }
      ];
    }

    return [
      { label: "Diagnosis", value: analysis.comparison_table.diagnosis.agreement },
      { label: "Treatment", value: analysis.comparison_table.treatment.agreement },
      { label: "Medication", value: analysis.comparison_table.medicine.agreement },
      { label: "Urgency", value: analysis.comparison_table.urgency.agreement }
    ];
  }, [analysis]);

  const visualizerBars = useMemo(() => Array.from({ length: 12 }, (_, index) => index), []);

  return (
    <section className="voice-panel glass-panel">
      <div className="voice-header">
        <div>
          <p className="eyebrow">Medical Voice Assistant</p>
          <h2>Speak the reconciliation, calmly</h2>
          <p className="voice-subtitle">
            Clean, premium voice UI for SecondSight Pro. Short spoken summaries, safe follow-ups, and
            interruption handling for real-time use.
          </p>
        </div>
        <div className="voice-status">
          <span>{medicalModeLabel}</span>
          <span>{isSpeaking ? "Speaking" : isListening ? "Listening" : "Standby"}</span>
        </div>
      </div>

      <div className="voice-stage">
        <div className="audio-orb-wrap">
          <div className={`audio-orb ${isSpeaking ? "speaking" : isListening ? "listening" : ""}`}>
            {voiceResponse ? <Sparkles size={22} /> : <Mic size={22} />}
          </div>
          <div className="audio-visualizer" aria-hidden="true">
            {visualizerBars.map((index) => (
              <span
                key={index}
                style={{
                  animationDelay: `${index * 70}ms`
                }}
                className={isSpeaking ? "bar speaking" : isListening ? "bar listening" : "bar idle"}
              />
            ))}
          </div>
        </div>

        <div className="voice-summary-card">
          <p className="meta-label">Live assistant response</p>
          <h3>{analysis ? "Ready to speak your case summary" : "Waiting for a completed analysis"}</h3>
          <p className="voice-summary-text">
            {voiceResponse?.text ||
              "Press Speak Summary to hear a calm, medically responsible explanation. Then ask a follow-up to clarify one detail at a time."}
          </p>

          <div className="voice-actions">
            <button
              type="button"
              className="button primary"
              onClick={handleSpeakSummary}
              disabled={isLoadingSummary || !analysis}
            >
              {isLoadingSummary ? "Generating..." : "Speak Summary"}
            </button>
            <button
              type="button"
              className="button ghost"
              onClick={toggleListening}
              disabled={isLoadingFollowup || !recognition.supported}
            >
              {isListening ? <VolumeX size={16} /> : <Mic size={16} />}
              {isListening ? "Stop Listening" : "Start Listening"}
            </button>
            <button type="button" className="button ghost" onClick={interruptSpeech}>
              <PauseCircle size={16} />
              Interrupt
            </button>
          </div>
        </div>
      </div>

      <div className="voice-grid">
        <div className="voice-chat-card">
          <div className="section-title-row">
            <div>
              <h3>Ask a follow-up question</h3>
              <p>Calm, short-form answers with medical safety guardrails.</p>
            </div>
            <button type="button" className="button ghost" onClick={() => setTranscript((current) => current.slice(0, 1))}>
              Clear
            </button>
          </div>

          <textarea
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="Example: Why are the doctors disagreeing about surgery?"
            rows={4}
          />
          {liveText ? <p className="live-caption">Heard: {liveText}</p> : null}

          <div className="voice-actions compact">
            <button type="button" className="button primary" onClick={handleAskFollowup} disabled={isLoadingFollowup}>
              {isLoadingFollowup ? "Answering..." : "Ask Follow-up"}
              <Send size={16} />
            </button>
            <button type="button" className="button ghost" onClick={() => setQuestion(voiceResponse?.followUpPhrases[0] ?? "")}>
              Use Suggested Prompt
            </button>
          </div>
        </div>

        <div className="voice-metrics-card">
          <div className="section-title-row">
            <div>
              <h3>Real-time alignment</h3>
              <p>Useful when speaking the case out loud.</p>
            </div>
          </div>

          <div className="voice-metric-list">
            {metricRows.map((metric) => (
              <article key={metric.label}>
                <span>{metric.label}</span>
                <strong>{metric.value}%</strong>
              </article>
            ))}
          </div>

          <div className="voice-note">
            <AlertTriangle size={16} />
            <p>
              This assistant supports understanding conflicting medical opinions and does not replace
              licensed medical care.
            </p>
          </div>

          <div className="citation-stack">
            <p className="meta-label">Trusted evidence in the spoken response</p>
            {voiceResponse?.citations.length ? (
              voiceResponse.citations.slice(0, 3).map((citation) => (
                <article key={citation.id} className="citation-pill">
                  <strong>{citation.source}</strong>
                  <span>{citation.title}</span>
                </article>
              ))
            ) : (
              <p className="muted-copy">Citations will appear here after a voice summary or follow-up answer.</p>
            )}
          </div>
        </div>
      </div>

      <div className="transcript-card">
        <div className="section-title-row">
          <div>
            <h3>Realtime transcript</h3>
            <p>Short, readable, and easy to interrupt.</p>
          </div>
        </div>

        <div className="transcript-list">
          {transcript.map((item) => (
            <article key={item.id} className={`transcript-item ${item.role}`}>
              <span>{item.role}</span>
              <p>{item.text}</p>
            </article>
          ))}
        </div>

        <div className="safety-strip">
          <Volume2 size={16} />
          <p>
            Voice style: calm, empathetic, medically responsible. Designed for patients comparing
            conflicting opinions.
          </p>
        </div>
      </div>
    </section>
  );
}
