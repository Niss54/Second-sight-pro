import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ChevronDown,
  ArrowRight,
  Stethoscope,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Search,
  Sparkles,
  ShieldCheck,
  Building2,
  Activity,
  Flame
} from "lucide-react";

export const StoryHeroSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // ─────────────────────────────────────────────────────────────
  // SCENE OPACITIES & TRANSFORMS (Declared at top, no conditional hooks)
  // ─────────────────────────────────────────────────────────────

  // Top Progress Bar
  const progressBarScale = scrollYProgress;

  // Scene 1: Dr. Mehta's Clinic (0.00 → 0.52)
  const scene1Opacity = useTransform(scrollYProgress, [0.00, 0.03, 0.49, 0.52], [0, 1, 1, 0]);
  const scene1Scale = useTransform(scrollYProgress, [0.00, 0.06], [0.97, 1]);

  // Scene 1 Chat items
  const docBubble1Opacity = useTransform(scrollYProgress, [0.08, 0.12, 0.49, 0.52], [0, 1, 1, 0]);
  const docBubble1Y = useTransform(scrollYProgress, [0.08, 0.12], [18, 0]);

  const patBubble1Opacity = useTransform(scrollYProgress, [0.18, 0.22, 0.49, 0.52], [0, 1, 1, 0]);
  const patBubble1Y = useTransform(scrollYProgress, [0.18, 0.22], [18, 0]);

  const emojiPillOpacity = useTransform(scrollYProgress, [0.22, 0.26, 0.49, 0.52], [0, 1, 1, 0]);
  const emojiPillScale = useTransform(scrollYProgress, [0.22, 0.26], [0.6, 1]);

  // Voice note questions (Scene 1D)
  const docQ1Opacity = useTransform(scrollYProgress, [0.29, 0.32, 0.49, 0.52], [0, 1, 1, 0]);
  const docQ2Opacity = useTransform(scrollYProgress, [0.33, 0.36, 0.49, 0.52], [0, 1, 1, 0]);
  const docQ3Opacity = useTransform(scrollYProgress, [0.37, 0.40, 0.49, 0.52], [0, 1, 1, 0]);

  // Patient reply to all 3 (Scene 1E)
  const patReplyAllOpacity = useTransform(scrollYProgress, [0.41, 0.44, 0.49, 0.52], [0, 1, 1, 0]);

  // Prescription 1 paper card sliding up
  const rxCard1Opacity = useTransform(scrollYProgress, [0.45, 0.47, 0.50, 0.52], [0, 1, 1, 0]);
  const rxCard1Y = useTransform(scrollYProgress, [0.45, 0.49], [35, 0]);
  const rxCard1X = useTransform(scrollYProgress, [0.45, 0.49], [-30, 20]);

  // ─────────────────────────────────────────────────────────────
  // TRANSITION 1: "3 दिन बाद" Dark Emerald & Lime Neon Paint Brush Wipe (0.52 → 0.60)
  // ─────────────────────────────────────────────────────────────
  const trans1BgOpacity = useTransform(scrollYProgress, [0.52, 0.54, 0.585, 0.60], [0, 1, 1, 0]);
  const brushTopLeftX = useTransform(scrollYProgress, [0.52, 0.555, 0.585, 0.60], ["-100%", "0%", "0%", "-100%"]);
  const brushBottomRightX = useTransform(scrollYProgress, [0.52, 0.555, 0.585, 0.60], ["100%", "0%", "0%", "100%"]);
  const trans1TextOpacity = useTransform(scrollYProgress, [0.545, 0.56, 0.585, 0.598], [0, 1, 1, 0]);
  const trans1TextScale = useTransform(scrollYProgress, [0.545, 0.565], [0.88, 1]);

  // ─────────────────────────────────────────────────────────────
  // SCENE 2: Dr. Sharma's Clinic (0.60 → 0.82)
  // ─────────────────────────────────────────────────────────────
  const scene2Opacity = useTransform(scrollYProgress, [0.595, 0.62, 0.81, 0.825], [0, 1, 1, 0]);
  const patBubble2Opacity = useTransform(scrollYProgress, [0.63, 0.67, 0.81, 0.825], [0, 1, 1, 0]);
  const docBubble2Opacity = useTransform(scrollYProgress, [0.69, 0.73, 0.81, 0.825], [0, 1, 1, 0]);
  const rxCard2Opacity = useTransform(scrollYProgress, [0.74, 0.77, 0.81, 0.825], [0, 1, 1, 0]);
  const conflictWarningOpacity = useTransform(scrollYProgress, [0.77, 0.80, 0.81, 0.825], [0, 1, 1, 0]);

  // ─────────────────────────────────────────────────────────────
  // TRANSITION 2: 4-Corner Matte Black & Crimson Wipe (0.82 → 0.87)
  // ─────────────────────────────────────────────────────────────
  const cornerWipeScale = useTransform(scrollYProgress, [0.82, 0.845, 0.87], [0, 1.05, 0]);
  const cornerTextOpacity = useTransform(scrollYProgress, [0.835, 0.845, 0.855], [0, 1, 0]);

  // ─────────────────────────────────────────────────────────────
  // SCENE 3: Patient on Sofa + Phone Mockup + SecondSight (0.87 → 1.00)
  // ─────────────────────────────────────────────────────────────
  const scene3Opacity = useTransform(scrollYProgress, [0.865, 0.885, 1.00], [0, 1, 1]);
  const thought1Opacity = useTransform(scrollYProgress, [0.88, 0.90], [0, 1]);
  const thought2Opacity = useTransform(scrollYProgress, [0.90, 0.92], [0, 1]);

  // Phone Mockup Stages
  const phoneStageAOpacity = useTransform(scrollYProgress, [0.87, 0.885, 0.915, 0.925], [0, 1, 1, 0]);
  const phoneStageBOpacity = useTransform(scrollYProgress, [0.92, 0.93, 0.95, 0.958], [0, 1, 1, 0]);
  const phoneStageCOpacity = useTransform(scrollYProgress, [0.95, 0.958, 0.972, 0.978], [0, 1, 1, 0]);
  const uploadProgressWidth = useTransform(scrollYProgress, [0.954, 0.97], ["10%", "100%"]);
  const phoneStageDOpacity = useTransform(scrollYProgress, [0.972, 0.982, 1.0], [0, 1, 1]);

  // Final Scene CTA
  const scene3CtaOpacity = useTransform(scrollYProgress, [0.955, 0.98], [0, 1]);
  const scene3CtaY = useTransform(scrollYProgress, [0.955, 0.98], [15, 0]);

  return (
    <div className="story-hero-wrapper" ref={containerRef} id="story-journey">
      {/* ─── SECTION HEADER (VISIBLE BEFORE SCROLL LOCK - DARK CINEMA THEME) ─── */}
      <div
        style={{
          textAlign: "center",
          padding: "60px 20px 40px",
          maxWidth: "880px",
          margin: "0 auto",
          position: "relative",
          zIndex: 10
        }}
      >
        <span
          style={{
            fontSize: "0.85rem",
            fontWeight: 800,
            color: "#2dd4bf",
            textTransform: "uppercase",
            letterSpacing: "0.14em",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "6px 16px",
            borderRadius: "999px",
            background: "rgba(20, 184, 166, 0.12)",
            border: "1px solid rgba(20, 184, 166, 0.3)"
          }}
        >
          <Sparkles size={16} />
          The Clinical Dilemma We Solve · Anime Case Study
        </span>
        <h2
          style={{
            fontSize: "clamp(2rem, 4.5vw, 3.2rem)",
            fontWeight: 900,
            margin: "14px 0 14px",
            color: "#ffffff",
            letterSpacing: "-0.025em",
            lineHeight: 1.15
          }}
        >
          Rajan's Dilemma: Two Super-Specialists. <br />
          <span style={{ color: "#f87171", textShadow: "0 0 25px rgba(248,113,113,0.5)" }}>
            Two Clashing Prescriptions.
          </span>{" "}
          Zero Clarity.
        </h2>
        <p
          style={{
            color: "#94a3b8",
            fontSize: "1.05rem",
            maxWidth: "640px",
            margin: "0 auto 20px",
            lineHeight: 1.55
          }}
        >
          Experience the real-life medical labyrinth millions of Indian patients navigate when conflicting opinions put vital health at risk.
        </p>

        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 20px",
            borderRadius: "999px",
            background: "rgba(15, 23, 42, 0.8)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            color: "#cbd5e1",
            fontSize: "0.85rem",
            fontWeight: 600,
            boxShadow: "0 0 20px rgba(0,0,0,0.5)"
          }}
        >
          <ChevronDown size={16} style={{ animation: "bounce 1.5s ease infinite", color: "#2dd4bf" }} />
          <span>Scroll down to enter the anime journey</span>
          <ChevronDown size={16} style={{ animation: "bounce 1.5s ease infinite 0.2s", color: "#2dd4bf" }} />
        </div>
      </div>

      {/* ─── STICKY VIEWPORT CONTAINER (100VH) ─── */}
      <div className="story-sticky-viewport">
        {/* Fixed Top Progress Tracker */}
        <motion.div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "linear-gradient(90deg, #14b8a6, #3b82f6, #f59e0b)",
            scaleX: progressBarScale,
            transformOrigin: "left",
            zIndex: 100,
            boxShadow: "0 0 12px #14b8a6"
          }}
        />

        {/* Ambient Badge indicating Current Scene */}
        <div
          style={{
            position: "absolute",
            bottom: "20px",
            right: "24px",
            zIndex: 45,
            padding: "6px 14px",
            borderRadius: "999px",
            background: "rgba(11, 15, 25, 0.85)",
            backdropFilter: "blur(10px)",
            color: "#ffffff",
            fontSize: "0.78rem",
            fontWeight: 600,
            border: "1px solid rgba(255, 255, 255, 0.15)",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}
        >
          <img
            src="/secondsight-icon.png"
            alt="SecondSight Emblem"
            style={{ width: "16px", height: "16px", objectFit: "contain" }}
          />
          <span
            style={{
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              background: "#4ade80",
              boxShadow: "0 0 10px #4ade80"
            }}
          />
          <span>SecondSight Anime Clinical Journey</span>
        </div>

        {/* ═══════════════════════════════════════════════════════════
            SCENE 1: DR. MEHTA'S CLINIC (ANIME DR IN WHEELCHAIR)
            ═══════════════════════════════════════════════════════════ */}
        <motion.div
          className="story-scene-dark"
          style={{
            position: "absolute",
            inset: 0,
            opacity: scene1Opacity,
            scale: scene1Scale,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "78px 24px 20px",
            zIndex: 10,
            pointerEvents: "none"
          }}
        >
          {/* Clinic Room Header / Environment Info */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              maxWidth: "1140px",
              margin: "0 auto"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  background: "#0d9488",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ffffff",
                  boxShadow: "0 0 15px rgba(13, 148, 136, 0.5)"
                }}
              >
                <Building2 size={20} />
              </div>
              <div>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#2dd4bf", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Scene 1 · Day 01 Consultation
                </span>
                <h4 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800, color: "#ffffff" }}>
                  Mehta Polyclinic & Care Centre
                </h4>
              </div>
            </div>

            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 14px",
                borderRadius: "999px",
                background: "rgba(20, 184, 166, 0.12)",
                border: "1px solid rgba(20, 184, 166, 0.3)",
                fontSize: "0.82rem",
                color: "#2dd4bf",
                fontWeight: 700
              }}
            >
              <Activity size={15} />
              <span>Dr. R. Mehta (MBBS, MD) · Senior Physician</span>
            </div>
          </div>

          {/* Interactive Stage: Anime Dr. Mehta in Wheelchair + Chat Flow */}
          <div
            style={{
              width: "100%",
              maxWidth: "1140px",
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: "1.05fr 1fr",
              gap: "28px",
              alignItems: "center",
              flex: 1
            }}
          >
            {/* Left: High-Definition Anime Character Showcase (Dr. Mehta in Wheelchair) */}
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "275px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              {/* Anime Character Showcase Card */}
              <div
                className="story-anime-card"
                style={{
                  width: "360px",
                  height: "260px",
                  border: "2px solid rgba(20, 184, 166, 0.45)",
                  boxShadow: "0 10px 40px rgba(13, 148, 136, 0.35)",
                  position: "relative"
                }}
              >
                <img
                  src="/images/story/dr_mehta.jpg"
                  alt="Dr. Mehta Anime Character in Wheelchair"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />

                {/* Cyberpunk HUD Badge Overlay */}
                <div
                  style={{
                    position: "absolute",
                    bottom: "10px",
                    left: "12px",
                    right: "12px",
                    padding: "8px 12px",
                    borderRadius: "10px",
                    background: "rgba(11, 19, 34, 0.85)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(20, 184, 166, 0.4)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                >
                  <div>
                    <div style={{ fontSize: "0.8rem", fontWeight: 800, color: "#ffffff" }}>
                      Dr. R. Mehta, MD
                    </div>
                    <div style={{ fontSize: "0.68rem", color: "#2dd4bf", fontWeight: 600 }}>
                      ♿ Advanced Wheelchair Care Unit
                    </div>
                  </div>
                  <div
                    style={{
                      padding: "4px 8px",
                      borderRadius: "6px",
                      background: "rgba(20, 184, 166, 0.2)",
                      fontSize: "0.65rem",
                      fontWeight: 700,
                      color: "#5eead4"
                    }}
                  >
                    Vitals Normal
                  </div>
                </div>
              </div>

              {/* Animated Floating Prescription Card from Dr. Mehta */}
              <motion.div
                style={{
                  position: "absolute",
                  bottom: "30px",
                  right: "-20px",
                  opacity: rxCard1Opacity,
                  x: rxCard1X,
                  y: rxCard1Y,
                  zIndex: 25
                }}
              >
                <div
                  style={{
                    background: "#0f172a",
                    border: "2px solid #14b8a6",
                    borderRadius: "12px",
                    padding: "12px 16px",
                    width: "250px",
                    boxShadow: "0 10px 30px rgba(20, 184, 166, 0.4)",
                    transform: "rotate(-3deg)"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px dashed rgba(255,255,255,0.2)", paddingBottom: "6px" }}>
                    <span style={{ fontSize: "1.1rem", fontWeight: 900, color: "#2dd4bf", fontFamily: "serif" }}>Rx</span>
                    <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#94a3b8" }}>Dr. Mehta · Rx #1</span>
                  </div>
                  <div style={{ marginTop: "8px", fontSize: "0.76rem", color: "#f8fafc", lineHeight: 1.45 }}>
                    <strong style={{ color: "#2dd4bf" }}>1. Azithromycin 250mg</strong> (1-0-0 x 5d)<br />
                    <strong>2. Paracetamol 500mg</strong> (SOS fever)<br />
                    <strong>3. ORS Electrolyte</strong> (Ad libitum)
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right: Scroll-Driven Animated Chat Conversation */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "14px",
                position: "relative",
                minHeight: "310px",
                justifyContent: "center"
              }}
            >
              {/* Doctor Bubble 1 */}
              <motion.div
                className="story-chat-bubble-doc"
                style={{
                  opacity: docBubble1Opacity,
                  y: docBubble1Y
                }}
              >
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    background: "#0d9488",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                    fontSize: "0.78rem",
                    flexShrink: 0
                  }}
                >
                  Dr
                </div>
                <div>
                  <div style={{ fontSize: "0.72rem", color: "#2dd4bf", fontWeight: 700, marginBottom: "2px" }}>
                    Dr. Mehta (MD)
                  </div>
                  <span>Aiye Rajan ji, bataiye kya takleef hai aapko? 🩺</span>
                </div>
              </motion.div>

              {/* Patient Reply 1 + Floating Symptoms */}
              <motion.div
                className="story-chat-bubble-patient"
                style={{
                  alignSelf: "flex-end",
                  opacity: patBubble1Opacity,
                  y: patBubble1Y
                }}
              >
                <div>
                  <div style={{ fontSize: "0.72rem", color: "#fbbf24", fontWeight: 700, marginBottom: "2px", textAlign: "right" }}>
                    Rajan (Patient)
                  </div>
                  <span>Doctor sahab, 4 din se tez bukhaar hai aur sar mein bohot dard hai. Neend bhi nahi aa rahi 😓</span>
                </div>
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    background: "#d97706",
                    color: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                    fontSize: "0.78rem",
                    flexShrink: 0
                  }}
                >
                  R
                </div>
              </motion.div>

              {/* Floating Symptom Pills */}
              <motion.div
                style={{
                  alignSelf: "flex-end",
                  display: "flex",
                  gap: "8px",
                  opacity: emojiPillOpacity,
                  scale: emojiPillScale
                }}
              >
                <span style={{ background: "rgba(15, 23, 42, 0.8)", border: "1px solid rgba(251, 191, 36, 0.4)", color: "#fef3c7", padding: "4px 10px", borderRadius: "999px", fontSize: "0.82rem", fontWeight: 600 }}>
                  🤒 High Fever (101.4°F)
                </span>
                <span style={{ background: "rgba(15, 23, 42, 0.8)", border: "1px solid rgba(239, 68, 68, 0.4)", color: "#fee2e2", padding: "4px 10px", borderRadius: "999px", fontSize: "0.82rem", fontWeight: 600 }}>
                  ⚡ Frontal Headache
                </span>
                <span style={{ background: "rgba(15, 23, 42, 0.8)", border: "1px solid rgba(59, 130, 246, 0.4)", color: "#dbeafe", padding: "4px 10px", borderRadius: "999px", fontSize: "0.82rem", fontWeight: 600 }}>
                  💊 No Prior Meds
                </span>
              </motion.div>

              {/* Scene 1D: Doctor 3 Voice Questions (Audio Waveform Style) */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {/* Voice Question 1 */}
                <motion.div
                  className="story-chat-bubble-doc"
                  style={{ opacity: docQ1Opacity, padding: "8px 14px", maxWidth: "330px" }}
                >
                  <svg width="60" height="18" viewBox="0 0 60 18" style={{ flexShrink: 0, marginTop: "2px" }}>
                    {[4, 8, 14, 18, 12, 6, 14, 18, 10, 6, 16, 8].map((h, i) => (
                      <rect key={i} x={i * 5} y={(18 - h) / 2} width="3" height={h} rx="1.5" fill="#4ade80" />
                    ))}
                  </svg>
                  <span style={{ fontSize: "0.82rem" }}>Bukhar kitna rehta hai? 99 se upar? 🌡️</span>
                </motion.div>

                {/* Voice Question 2 */}
                <motion.div
                  className="story-chat-bubble-doc"
                  style={{ opacity: docQ2Opacity, padding: "8px 14px", maxWidth: "330px" }}
                >
                  <svg width="60" height="18" viewBox="0 0 60 18" style={{ flexShrink: 0, marginTop: "2px" }}>
                    {[8, 14, 18, 10, 6, 16, 12, 8, 18, 14, 6, 10].map((h, i) => (
                      <rect key={i} x={i * 5} y={(18 - h) / 2} width="3" height={h} rx="1.5" fill="#4ade80" />
                    ))}
                  </svg>
                  <span style={{ fontSize: "0.82rem" }}>Koi aur dawa le rahe ho? Ya allergy hai?</span>
                </motion.div>

                {/* Voice Question 3 */}
                <motion.div
                  className="story-chat-bubble-doc"
                  style={{ opacity: docQ3Opacity, padding: "8px 14px", maxWidth: "330px" }}
                >
                  <svg width="60" height="18" viewBox="0 0 60 18" style={{ flexShrink: 0, marginTop: "2px" }}>
                    {[6, 10, 16, 14, 18, 8, 12, 16, 10, 8, 14, 6].map((h, i) => (
                      <rect key={i} x={i * 5} y={(18 - h) / 2} width="3" height={h} rx="1.5" fill="#4ade80" />
                    ))}
                  </svg>
                  <span style={{ fontSize: "0.82rem" }}>Khana kha pa rahe ho thoda bahut?</span>
                </motion.div>
              </div>

              {/* Scene 1E: Patient Reply to all 3 */}
              <motion.div
                className="story-chat-bubble-patient"
                style={{
                  alignSelf: "flex-end",
                  opacity: patReplyAllOpacity,
                  maxWidth: "350px",
                  fontSize: "0.84rem"
                }}
              >
                <div>
                  "Haan doctor sahab, 101°F tak chala jata hai. Pehle se koi dawa nahi chal rahi. Khana bilkul hazam nahi hota."
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* ═══════════════════════════════════════════════════════════
            TRANSITION 1: "3 दिन बाद" DARK EMERALD & NEON LIME BRUSH WIPE (0.52 → 0.60)
            Matching nissh.info curved dark sweep with lime edge
            ═══════════════════════════════════════════════════════════ */}
        <motion.div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 50,
            pointerEvents: "none",
            opacity: trans1BgOpacity
          }}
        >
          {/* Top-Left Diagonal Dark Organic Brush Sweep */}
          <motion.div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "120vw",
              height: "120vh",
              x: brushTopLeftX,
              zIndex: 51
            }}
          >
            <svg
              viewBox="0 0 1000 800"
              preserveAspectRatio="none"
              style={{ width: "100%", height: "100%" }}
            >
              <defs>
                <linearGradient id="emeraldDarkBrush" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#064e3b" />
                  <stop offset="60%" stopColor="#022c22" />
                  <stop offset="100%" stopColor="#05080e" />
                </linearGradient>
              </defs>
              <path
                d="M 0,0 L 1000,0 L 1000,280 C 820,380 720,240 560,420 C 400,600 240,490 0,680 Z"
                fill="url(#emeraldDarkBrush)"
                stroke="#4ade80"
                strokeWidth="4"
              />
            </svg>
          </motion.div>

          {/* Bottom-Right Complementary Brush Sweep */}
          <motion.div
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              width: "120vw",
              height: "120vh",
              x: brushBottomRightX,
              zIndex: 52
            }}
          >
            <svg
              viewBox="0 0 1000 800"
              preserveAspectRatio="none"
              style={{ width: "100%", height: "100%" }}
            >
              <path
                d="M 1000,800 L 0,800 L 0,520 C 180,420 280,560 440,380 C 600,200 760,310 1000,120 Z"
                fill="url(#emeraldDarkBrush)"
                stroke="#a3e635"
                strokeWidth="4"
              />
            </svg>
          </motion.div>

          {/* Center Dark Fill with Bold Cyberpunk Typography */}
          <motion.div
            style={{
              position: "absolute",
              inset: 0,
              background: "#05080e",
              zIndex: 53,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              padding: "20px",
              opacity: trans1TextOpacity,
              scale: trans1TextScale
            }}
          >
            <span
              style={{
                fontSize: "0.95rem",
                fontWeight: 800,
                color: "#4ade80",
                textTransform: "uppercase",
                letterSpacing: "0.18em",
                marginBottom: "12px",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px"
              }}
            >
              <Flame size={18} color="#f59e0b" />
              Phase 02 · Clinical Escalation
            </span>
            <h1
              style={{
                fontSize: "clamp(3.5rem, 8vw, 6rem)",
                fontWeight: 900,
                color: "#ffffff",
                margin: 0,
                letterSpacing: "-0.03em",
                fontFamily: "Inter, serif",
                textShadow: "0 0 35px rgba(74, 222, 128, 0.4)"
              }}
            >
              3 दिन बाद
            </h1>
            <p
              style={{
                fontSize: "clamp(1.15rem, 2.5vw, 1.6rem)",
                fontWeight: 600,
                color: "#cbd5e1",
                marginTop: "12px",
                fontStyle: "italic"
              }}
            >
              (3 Days Later · Zero Relief · Fever Climbs to 102°F)
            </p>
            <div
              style={{
                marginTop: "24px",
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px 24px",
                borderRadius: "999px",
                background: "rgba(239, 68, 68, 0.15)",
                border: "1.5px solid rgba(239, 68, 68, 0.4)",
                color: "#f87171",
                fontWeight: 700,
                fontSize: "0.95rem",
                boxShadow: "0 0 25px rgba(239, 68, 68, 0.3)"
              }}
            >
              <AlertTriangle size={18} />
              <span>Rajan rushes to a Super-Speciality Hospital for a second opinion...</span>
            </div>
          </motion.div>
        </motion.div>

        {/* ═══════════════════════════════════════════════════════════
            SCENE 2: DR. SHARMA'S CLINIC (ANIME SECOND OPINION CONFLICT)
            ═══════════════════════════════════════════════════════════ */}
        <motion.div
          className="story-scene-dark"
          style={{
            position: "absolute",
            inset: 0,
            opacity: scene2Opacity,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "78px 24px 20px",
            zIndex: 10,
            pointerEvents: "none"
          }}
        >
          {/* Header Scene 2 */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              maxWidth: "1140px",
              margin: "0 auto"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  background: "#2563eb",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ffffff",
                  boxShadow: "0 0 15px rgba(37, 99, 235, 0.5)"
                }}
              >
                <Building2 size={20} />
              </div>
              <div>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#60a5fa", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Scene 2 · Second Opinion Consultation
                </span>
                <h4 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800, color: "#ffffff" }}>
                  Sharma Super-Speciality Hospital
                </h4>
              </div>
            </div>

            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 14px",
                borderRadius: "999px",
                background: "rgba(37, 99, 235, 0.15)",
                border: "1px solid rgba(59, 130, 246, 0.4)",
                fontSize: "0.82rem",
                color: "#93c5fd",
                fontWeight: 700
              }}
            >
              <Activity size={15} />
              <span>Dr. P. Sharma (MD, Internal Med) · OPD-B</span>
            </div>
          </div>

          {/* Scene 2 Stage */}
          <div
            style={{
              width: "100%",
              maxWidth: "1140px",
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: "1.05fr 1fr",
              gap: "28px",
              alignItems: "center",
              flex: 1
            }}
          >
            {/* Left: High-Definition Anime Character Showcase (Dr. Sharma with Holographic Scans) */}
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "275px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              {/* Anime Character Showcase Card */}
              <div
                className="story-anime-card"
                style={{
                  width: "360px",
                  height: "260px",
                  border: "2px solid rgba(59, 130, 246, 0.5)",
                  boxShadow: "0 10px 40px rgba(37, 99, 235, 0.35)",
                  position: "relative"
                }}
              >
                <img
                  src="/images/story/dr_sharma.jpg"
                  alt="Dr. Sharma Anime Specialist Doctor"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />

                {/* Cyberpunk HUD Badge Overlay */}
                <div
                  style={{
                    position: "absolute",
                    bottom: "10px",
                    left: "12px",
                    right: "12px",
                    padding: "8px 12px",
                    borderRadius: "10px",
                    background: "rgba(11, 19, 34, 0.85)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(59, 130, 246, 0.4)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                >
                  <div>
                    <div style={{ fontSize: "0.8rem", fontWeight: 800, color: "#ffffff" }}>
                      Dr. P. Sharma, MD
                    </div>
                    <div style={{ fontSize: "0.68rem", color: "#60a5fa", fontWeight: 600 }}>
                      ⚡ Super-Specialist Diagnostics
                    </div>
                  </div>
                  <div
                    style={{
                      padding: "4px 8px",
                      borderRadius: "6px",
                      background: "rgba(59, 130, 246, 0.2)",
                      fontSize: "0.65rem",
                      fontWeight: 700,
                      color: "#93c5fd"
                    }}
                  >
                    Room 04
                  </div>
                </div>
              </div>

              {/* Prescription 2 Card Sliding Up */}
              <motion.div
                style={{
                  position: "absolute",
                  bottom: "30px",
                  right: "-20px",
                  opacity: rxCard2Opacity,
                  zIndex: 25
                }}
              >
                <div
                  style={{
                    background: "#0f172a",
                    border: "2px solid #2563eb",
                    borderRadius: "12px",
                    padding: "12px 16px",
                    width: "250px",
                    boxShadow: "0 10px 30px rgba(37, 99, 235, 0.4)",
                    transform: "rotate(3deg)"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px dashed rgba(255,255,255,0.2)", paddingBottom: "6px" }}>
                    <span style={{ fontSize: "1.1rem", fontWeight: 900, color: "#60a5fa", fontFamily: "serif" }}>Rx</span>
                    <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#94a3b8" }}>Dr. Sharma · Rx #2</span>
                  </div>
                  <div style={{ marginTop: "8px", fontSize: "0.76rem", color: "#f8fafc", lineHeight: 1.45 }}>
                    <strong style={{ color: "#f87171" }}>1. Cefixime 200mg (Antibiotic)</strong><br />
                    <strong>2. Widal Panel + Complete Hemogram</strong><br />
                    <strong>3. ORS + Zinc Electrolytes</strong>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right: Scene 2 Chat Exchange & Conflict Alert */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "14px",
                position: "relative",
                minHeight: "310px",
                justifyContent: "center"
              }}
            >
              {/* Patient Explains Medicine Failed */}
              <motion.div
                className="story-chat-bubble-patient"
                style={{
                  alignSelf: "flex-end",
                  opacity: patBubble2Opacity,
                  maxWidth: "350px"
                }}
              >
                <div>
                  <div style={{ fontSize: "0.72rem", color: "#fbbf24", fontWeight: 700, marginBottom: "2px", textAlign: "right" }}>
                    Rajan (Patient)
                  </div>
                  <span>Doctor sahab, 3 din pehle Dr. Mehta se mila tha. Unki dawa se koi aaram nahi mila. Tabiyat aur bigad rahi hai 😔</span>
                </div>
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    background: "#d97706",
                    color: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                    fontSize: "0.78rem",
                    flexShrink: 0
                  }}
                >
                  R
                </div>
              </motion.div>

              {/* Dr. Sharma Response */}
              <motion.div
                className="story-chat-bubble-doc"
                style={{
                  opacity: docBubble2Opacity,
                  maxWidth: "370px",
                  borderColor: "rgba(59, 130, 246, 0.4)"
                }}
              >
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    background: "#2563eb",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                    fontSize: "0.78rem",
                    flexShrink: 0
                  }}
                >
                  Dr
                </div>
                <div>
                  <div style={{ fontSize: "0.72rem", color: "#93c5fd", fontWeight: 700, marginBottom: "2px" }}>
                    Dr. Sharma (Internal Medicine)
                  </div>
                  <span>
                    "Dekhta hun... Lagta hai Typhoid ke symptoms hain. Mehta ji ka prescription galat nahi tha, par incomplete tha. Main Cefixime add karta hun aur ek blood test bhi chahiye."
                  </span>
                </div>
              </motion.div>

              {/* High Risk Conflict Notification Badge with Red Neon Pulse */}
              <motion.div
                style={{
                  opacity: conflictWarningOpacity,
                  background: "rgba(220, 38, 38, 0.12)",
                  border: "1.5px solid #ef4444",
                  borderRadius: "14px",
                  padding: "12px 18px",
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  animation: "redAlertPulse 2s infinite"
                }}
              >
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    background: "#dc2626",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#ffffff",
                    flexShrink: 0,
                    boxShadow: "0 0 15px rgba(220, 38, 38, 0.6)"
                  }}
                >
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <h5 style={{ margin: 0, fontSize: "0.92rem", fontWeight: 800, color: "#f87171" }}>
                    Prescription Conflict Detected!
                  </h5>
                  <p style={{ margin: "3px 0 0", fontSize: "0.8rem", color: "#cbd5e1", lineHeight: 1.4 }}>
                    Azithromycin (Macrolide) vs Cefixime (Cephalosporin) without antibiotic cessation protocol or culture verification.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* ═══════════════════════════════════════════════════════════
            TRANSITION 2: 4-CORNER MATTE BLACK & CRIMSON WIPE (0.82 → 0.87)
            ═══════════════════════════════════════════════════════════ */}
        <div style={{ position: "absolute", inset: 0, zIndex: 60, pointerEvents: "none" }}>
          {/* Top-Left Wedge */}
          <motion.div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "60vw",
              height: "60vh",
              background: "#05080e",
              clipPath: "polygon(0 0, 100% 0, 0 100%)",
              scale: cornerWipeScale,
              transformOrigin: "top left",
              boxShadow: "0 0 40px rgba(239, 68, 68, 0.4)"
            }}
          />
          {/* Top-Right Wedge */}
          <motion.div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: "60vw",
              height: "60vh",
              background: "#05080e",
              clipPath: "polygon(100% 0, 100% 100%, 0 0)",
              scale: cornerWipeScale,
              transformOrigin: "top right",
              boxShadow: "0 0 40px rgba(239, 68, 68, 0.4)"
            }}
          />
          {/* Bottom-Left Wedge */}
          <motion.div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              width: "60vw",
              height: "60vh",
              background: "#05080e",
              clipPath: "polygon(0 0, 0 100%, 100% 100%)",
              scale: cornerWipeScale,
              transformOrigin: "bottom left",
              boxShadow: "0 0 40px rgba(239, 68, 68, 0.4)"
            }}
          />
          {/* Bottom-Right Wedge */}
          <motion.div
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              width: "60vw",
              height: "60vh",
              background: "#05080e",
              clipPath: "polygon(100% 0, 100% 100%, 0 100%)",
              scale: cornerWipeScale,
              transformOrigin: "bottom right",
              boxShadow: "0 0 40px rgba(239, 68, 68, 0.4)"
            }}
          />

          {/* Center Darkness Text */}
          <motion.div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              padding: "20px",
              opacity: cornerTextOpacity,
              zIndex: 65
            }}
          >
            <h2
              style={{
                fontSize: "clamp(2rem, 5vw, 3.8rem)",
                fontWeight: 900,
                color: "#ffffff",
                letterSpacing: "-0.02em",
                margin: 0,
                textShadow: "0 0 30px rgba(239, 68, 68, 0.6)"
              }}
            >
              Two Clashing Prescriptions. Zero Consensus.
            </h2>
            <p style={{ color: "#94a3b8", fontSize: "1.15rem", marginTop: "12px", maxWidth: "560px" }}>
              Who is right? Who should Rajan trust? Taking both could trigger antimicrobial resistance or drug toxicity.
            </p>
          </motion.div>
        </div>

        {/* ═══════════════════════════════════════════════════════════
            SCENE 3: PATIENT HOME + SECOND SIGHT SOLUTION (0.87 → 1.00)
            Matching media_1790280284357.png (Anime character scratching head)
            ═══════════════════════════════════════════════════════════ */}
        <motion.div
          className="story-scene-dark"
          style={{
            position: "absolute",
            inset: 0,
            opacity: scene3Opacity,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "78px 24px 16px",
            zIndex: 10
          }}
        >
          {/* Header Scene 3 */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              maxWidth: "1140px",
              margin: "0 auto"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  background: "#0d9488",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ffffff",
                  boxShadow: "0 0 15px rgba(13, 148, 136, 0.5)"
                }}
              >
                <Sparkles size={20} />
              </div>
              <div>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#2dd4bf", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Scene 3 · AI Clinical Resolution
                </span>
                <h4 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800, color: "#ffffff" }}>
                  Rajan's Living Room → SecondSight Pro
                </h4>
              </div>
            </div>

            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 14px",
                borderRadius: "999px",
                background: "rgba(20, 184, 166, 0.15)",
                border: "1px solid rgba(20, 184, 166, 0.35)",
                color: "#2dd4bf",
                fontSize: "0.82rem",
                fontWeight: 700
              }}
            >
              <ShieldCheck size={16} />
              <span>Evidence-Based AI Reconciliation</span>
            </div>
          </div>

          {/* Main Stage: Left 55% Anime Patient on Sofa scratching head, Right 45% Smartphone Mockup */}
          <div
            style={{
              width: "100%",
              maxWidth: "1140px",
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: "1.15fr 0.85fr",
              gap: "28px",
              alignItems: "center",
              flex: 1
            }}
          >
            {/* Left: Anime Patient on Sofa Scratching Head + Thought Bubbles */}
            <div style={{ position: "relative", width: "100%", height: "265px", display: "flex", alignItems: "center", gap: "20px" }}>
              {/* Anime Character Showcase Card */}
              <div
                className="story-anime-card"
                style={{
                  width: "250px",
                  height: "250px",
                  border: "2px solid rgba(251, 191, 36, 0.4)",
                  boxShadow: "0 10px 40px rgba(251, 191, 36, 0.25)",
                  position: "relative",
                  flexShrink: 0
                }}
              >
                <img
                  src="/images/story/rajan_patient.jpg"
                  alt="Anime Patient Rajan Scratching Head"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />

                {/* Badge Overlay */}
                <div
                  style={{
                    position: "absolute",
                    bottom: "8px",
                    left: "10px",
                    right: "10px",
                    padding: "6px 10px",
                    borderRadius: "8px",
                    background: "rgba(11, 19, 34, 0.85)",
                    backdropFilter: "blur(8px)",
                    border: "1px solid rgba(251, 191, 36, 0.4)",
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    color: "#fef08a",
                    textAlign: "center"
                  }}
                >
                  Rajan · Confused & In Pain 😕
                </div>
              </div>

              {/* Manga Thought Bubbles Floating Beside Head */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  flex: 1,
                  zIndex: 20
                }}
              >
                {/* Thought 1 */}
                <motion.div
                  className="story-thought-bubble"
                  style={{ opacity: thought1Opacity }}
                >
                  <p style={{ margin: 0, fontWeight: 600, lineHeight: 1.45, fontSize: "0.85rem" }}>
                    "Dr. Mehta ne Azithromycin di... Dr. Sharma ne Cefixime 😕 Dono alag bata rahe hain... Kaun sahi hai?"
                  </p>
                </motion.div>

                {/* Thought 2 */}
                <motion.div
                  className="story-thought-bubble"
                  style={{ opacity: thought2Opacity }}
                >
                  <p style={{ margin: 0, fontWeight: 600, lineHeight: 1.45, fontSize: "0.85rem" }}>
                    "Dono antibiotics ek saath lun ya band kar dun? 🤔 Kahi side effect na ho jaae... AI se verify karta hu!"
                  </p>
                </motion.div>
              </div>
            </div>

            {/* Right: Sleek Smartphone Mockup with 4 Dynamic Stages */}
            <div style={{ display: "flex", justifyContent: "center", position: "relative" }}>
              <div className="story-phone-mockup">
                {/* Phone Notch & Top Status Bar */}
                <div
                  style={{
                    height: "28px",
                    background: "#030712",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0 18px",
                    fontSize: "0.68rem",
                    color: "#94a3b8",
                    borderBottom: "1px solid rgba(255,255,255,0.08)",
                    flexShrink: 0
                  }}
                >
                  <span>9:41</span>
                  <div
                    style={{
                      width: "60px",
                      height: "14px",
                      background: "#000000",
                      borderRadius: "999px"
                    }}
                  />
                  <span>5G • 98%</span>
                </div>

                {/* Phone Screen Display Area (Cyber AMOLED Dark Display) */}
                <div
                  style={{
                    position: "relative",
                    flex: 1,
                    overflow: "hidden",
                    background: "#0b1320"
                  }}
                >
                  {/* ── STAGE A: GOOGLE SEARCH (0.87 → 0.92) ── */}
                  <motion.div
                    style={{
                      position: "absolute",
                      inset: 0,
                      opacity: phoneStageAOpacity,
                      padding: "16px 12px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                      background: "#090d16"
                    }}
                  >
                    {/* Google Logo & Search Box */}
                    <div style={{ textAlign: "center", marginBottom: "4px" }}>
                      <span style={{ fontSize: "1.2rem", fontWeight: 800 }}>
                        <span style={{ color: "#4285F4" }}>G</span>
                        <span style={{ color: "#EA4335" }}>o</span>
                        <span style={{ color: "#FBBC05" }}>o</span>
                        <span style={{ color: "#4285F4" }}>g</span>
                        <span style={{ color: "#34A853" }}>l</span>
                        <span style={{ color: "#EA4335" }}>e</span>
                      </span>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "8px 10px",
                        borderRadius: "999px",
                        border: "1px solid rgba(255,255,255,0.15)",
                        background: "#131d2e",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
                        fontSize: "0.72rem",
                        color: "#f8fafc"
                      }}
                    >
                      <Search size={14} color="#38bdf8" />
                      <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        conflicting doctor prescription india...
                      </span>
                    </div>

                    {/* Google Results */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "4px" }}>
                      {/* Highlighted SecondSight Pro Result */}
                      <div
                        style={{
                          padding: "10px",
                          borderRadius: "10px",
                          border: "1.5px solid #14b8a6",
                          background: "rgba(20, 184, 166, 0.12)",
                          boxShadow: "0 0 15px rgba(20, 184, 166, 0.2)"
                        }}
                      >
                        <span style={{ fontSize: "0.62rem", color: "#2dd4bf", fontWeight: 700 }}>secondsight.pro</span>
                        <h6 style={{ margin: "2px 0 3px", fontSize: "0.78rem", color: "#60a5fa", fontWeight: 700 }}>
                          SecondSight Pro — Reconcile Conflicting Prescriptions
                        </h6>
                        <p style={{ margin: 0, fontSize: "0.66rem", color: "#cbd5e1", lineHeight: 1.3 }}>
                          India's 1st AI Clinical Reconciliation engine. Reconcile two doctor opinions against ICMR protocols.
                        </p>
                      </div>

                      {/* Generic Fake Results */}
                      <div style={{ padding: "8px 10px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.06)" }}>
                        <span style={{ fontSize: "0.58rem", color: "#64748b" }}>healthforum.in</span>
                        <div style={{ height: "8px", width: "80%", background: "#334155", borderRadius: "4px", margin: "4px 0" }} />
                        <div style={{ height: "6px", width: "95%", background: "#1e293b", borderRadius: "4px" }} />
                      </div>
                    </div>
                  </motion.div>

                  {/* ── STAGE B: SECONDSIGHT WEB APP INTERFACE (0.92 → 0.958) ── */}
                  <motion.div
                    style={{
                      position: "absolute",
                      inset: 0,
                      opacity: phoneStageBOpacity,
                      display: "flex",
                      flexDirection: "column",
                      background: "#090d16"
                    }}
                  >
                    {/* App Header */}
                    <div
                      style={{
                        padding: "10px 12px",
                        background: "#0d9488",
                        color: "#ffffff",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        boxShadow: "0 0 15px rgba(13, 148, 136, 0.4)"
                      }}
                    >
                      <Stethoscope size={16} />
                      <span style={{ fontWeight: 800, fontSize: "0.82rem" }}>SecondSight Pro</span>
                    </div>

                    <div style={{ padding: "12px", display: "flex", flexDirection: "column", gap: "10px", flex: 1 }}>
                      <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#f8fafc" }}>
                        Upload 2 Prescriptions to Compare:
                      </span>

                      {/* Dropzone 1 */}
                      <div
                        style={{
                          border: "1.5px dashed #14b8a6",
                          borderRadius: "10px",
                          padding: "12px",
                          textAlign: "center",
                          background: "#0f172a"
                        }}
                      >
                        <FileText size={18} color="#2dd4bf" style={{ margin: "0 auto 4px" }} />
                        <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "#cbd5e1" }}>Dr. Mehta · Rx #1</span>
                        <div style={{ fontSize: "0.58rem", color: "#64748b" }}>Ready for upload</div>
                      </div>

                      {/* Dropzone 2 */}
                      <div
                        style={{
                          border: "1.5px dashed #3b82f6",
                          borderRadius: "10px",
                          padding: "12px",
                          textAlign: "center",
                          background: "#0f172a"
                        }}
                      >
                        <FileText size={18} color="#60a5fa" style={{ margin: "0 auto 4px" }} />
                        <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "#cbd5e1" }}>Dr. Sharma · Rx #2</span>
                        <div style={{ fontSize: "0.58rem", color: "#64748b" }}>Ready for upload</div>
                      </div>
                    </div>
                  </motion.div>

                  {/* ── STAGE C: UPLOADING CARDS + PROGRESS BAR (0.95 → 0.978) ── */}
                  <motion.div
                    style={{
                      position: "absolute",
                      inset: 0,
                      opacity: phoneStageCOpacity,
                      display: "flex",
                      flexDirection: "column",
                      background: "#090d16"
                    }}
                  >
                    <div
                      style={{
                        padding: "10px 12px",
                        background: "#0d9488",
                        color: "#ffffff",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px"
                      }}
                    >
                      <Stethoscope size={16} />
                      <span style={{ fontWeight: 800, fontSize: "0.82rem" }}>Analyzing Cases...</span>
                    </div>

                    <div style={{ padding: "12px", display: "flex", flexDirection: "column", gap: "10px", flex: 1 }}>
                      {/* Prescription 1 Tag */}
                      <div
                        style={{
                          padding: "8px 10px",
                          borderRadius: "8px",
                          background: "#0f172a",
                          border: "1px solid #10b981",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between"
                        }}
                      >
                        <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "#f8fafc" }}>Dr. Mehta · Rx #1</div>
                        <CheckCircle2 size={14} color="#10b981" />
                      </div>

                      {/* Prescription 2 Tag */}
                      <div
                        style={{
                          padding: "8px 10px",
                          borderRadius: "8px",
                          background: "#0f172a",
                          border: "1px solid #10b981",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between"
                        }}
                      >
                        <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "#f8fafc" }}>Dr. Sharma · Rx #2</div>
                        <CheckCircle2 size={14} color="#10b981" />
                      </div>

                      {/* Progress Bar */}
                      <div style={{ marginTop: "14px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.68rem", fontWeight: 700, color: "#2dd4bf", marginBottom: "4px" }}>
                          <span>ICMR Cross-Verification</span>
                          <span>AI Engine Active</span>
                        </div>
                        <div style={{ height: "6px", width: "100%", background: "#1e293b", borderRadius: "999px", overflow: "hidden" }}>
                          <motion.div
                            style={{
                              height: "100%",
                              width: uploadProgressWidth,
                              background: "linear-gradient(90deg, #14b8a6, #3b82f6)"
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* ── STAGE D: SECONDSIGHT CONFLICT RESULT CARD (0.972 → 1.00) ── */}
                  <motion.div
                    style={{
                      position: "absolute",
                      inset: 0,
                      opacity: phoneStageDOpacity,
                      display: "flex",
                      flexDirection: "column",
                      background: "#090d16",
                      padding: "10px"
                    }}
                  >
                    {/* Verdict Card */}
                    <div
                      style={{
                        background: "#0f172a",
                        borderRadius: "12px",
                        border: "1px solid rgba(239, 68, 68, 0.4)",
                        padding: "12px",
                        boxShadow: "0 0 20px rgba(239, 68, 68, 0.2)",
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px"
                      }}
                    >
                      {/* Conflict Score Badge */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "6px 10px",
                          borderRadius: "8px",
                          background: "rgba(220, 38, 38, 0.2)",
                          border: "1px solid rgba(220, 38, 38, 0.4)"
                        }}
                      >
                        <span style={{ fontSize: "0.72rem", fontWeight: 800, color: "#f87171" }}>Conflict Risk: 84/100</span>
                        <AlertTriangle size={14} color="#f87171" />
                      </div>

                      {/* Clinical Finding */}
                      <div style={{ fontSize: "0.68rem", color: "#f8fafc", lineHeight: 1.35 }}>
                        <strong style={{ color: "#fbbf24" }}>⚠️ Redundant Antibiotics:</strong><br />
                        Azithromycin + Cefixime dual administration has no clinical indication without positive culture.
                      </div>

                      {/* ICMR Guideline */}
                      <div
                        style={{
                          padding: "6px 8px",
                          borderRadius: "6px",
                          background: "rgba(37, 99, 235, 0.15)",
                          border: "1px solid rgba(59, 130, 246, 0.35)",
                          fontSize: "0.62rem",
                          color: "#93c5fd"
                        }}
                      >
                        <strong>ICMR Fever Protocol 2023:</strong><br />
                        Step-down monotherapy recommended. Order Widal & CBC before second antibiotic.
                      </div>

                      {/* Green Toast */}
                      <div
                        style={{
                          padding: "6px 8px",
                          borderRadius: "6px",
                          background: "rgba(16, 185, 129, 0.15)",
                          border: "1px solid rgba(16, 185, 129, 0.4)",
                          color: "#4ade80",
                          fontSize: "0.65rem",
                          fontWeight: 700,
                          display: "flex",
                          alignItems: "center",
                          gap: "6px"
                        }}
                      >
                        <CheckCircle2 size={13} />
                        <span>Reconciliation Plan Ready</span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Call-to-Action Bar for Scene 3 */}
          <motion.div
            style={{
              opacity: scene3CtaOpacity,
              y: scene3CtaY,
              textAlign: "center",
              paddingTop: "8px",
              borderTop: "1px solid rgba(255, 255, 255, 0.1)"
            }}
          >
            <h3
              style={{
                fontSize: "clamp(1.15rem, 2.2vw, 1.5rem)",
                fontWeight: 800,
                color: "#ffffff",
                margin: "0 0 4px"
              }}
            >
              Confused like Rajan? Get Clinical Clarity in 60 Seconds.
            </h3>
            <p
              style={{
                color: "#94a3b8",
                fontSize: "0.88rem",
                margin: "0 auto 10px",
                maxWidth: "580px"
              }}
            >
              Upload both prescriptions. Our AI reconciles drug interactions against ICMR & WHO protocols instantly.
            </p>
            <Link
              to="/case/new"
              className="button primary neo-cta"
              style={{
                padding: "10px 28px",
                fontSize: "0.96rem",
                borderRadius: "999px",
                fontWeight: 700,
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                textDecoration: "none",
                background: "linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)",
                color: "#ffffff",
                boxShadow: "0 0 25px rgba(20, 184, 166, 0.5)"
              }}
            >
              <span>Analyze My Prescriptions Now</span>
              <ArrowRight size={17} />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};
