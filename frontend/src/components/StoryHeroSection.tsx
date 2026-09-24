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
  Building2
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
  // TRANSITION 1: "3 दिन बाद" Paint Brush Wipe (0.52 → 0.60)
  // ─────────────────────────────────────────────────────────────
  const trans1BgOpacity = useTransform(scrollYProgress, [0.52, 0.54, 0.585, 0.60], [0, 1, 1, 0]);
  const brushTopLeftX = useTransform(scrollYProgress, [0.52, 0.555, 0.585, 0.60], ["-100%", "0%", "0%", "-100%"]);
  const brushBottomRightX = useTransform(scrollYProgress, [0.52, 0.555, 0.585, 0.60], ["100%", "0%", "0%", "100%"]);
  const trans1TextOpacity = useTransform(scrollYProgress, [0.55, 0.565, 0.585, 0.598], [0, 1, 1, 0]);
  const trans1TextScale = useTransform(scrollYProgress, [0.55, 0.57], [0.88, 1]);

  // ─────────────────────────────────────────────────────────────
  // SCENE 2: Dr. Sharma's Clinic (0.60 → 0.82)
  // ─────────────────────────────────────────────────────────────
  const scene2Opacity = useTransform(scrollYProgress, [0.595, 0.62, 0.81, 0.825], [0, 1, 1, 0]);
  const patBubble2Opacity = useTransform(scrollYProgress, [0.63, 0.67, 0.81, 0.825], [0, 1, 1, 0]);
  const docBubble2Opacity = useTransform(scrollYProgress, [0.69, 0.73, 0.81, 0.825], [0, 1, 1, 0]);
  const rxCard2Opacity = useTransform(scrollYProgress, [0.74, 0.77, 0.81, 0.825], [0, 1, 1, 0]);
  const conflictWarningOpacity = useTransform(scrollYProgress, [0.77, 0.80, 0.81, 0.825], [0, 1, 1, 0]);

  // ─────────────────────────────────────────────────────────────
  // TRANSITION 2: 4-Corner Black Wipe (0.82 → 0.87)
  // ─────────────────────────────────────────────────────────────
  const cornerWipeScale = useTransform(scrollYProgress, [0.82, 0.845, 0.87], [0, 1.05, 0]);
  const cornerTextOpacity = useTransform(scrollYProgress, [0.835, 0.845, 0.855], [0, 1, 0]);

  // ─────────────────────────────────────────────────────────────
  // SCENE 3: Patient on Sofa + Phone Mockup + SecondSight (0.87 → 1.00)
  // ─────────────────────────────────────────────────────────────
  const scene3Opacity = useTransform(scrollYProgress, [0.865, 0.885, 1.00], [0, 1, 1]);
  const thought1Opacity = useTransform(scrollYProgress, [0.88, 0.90], [0, 1]);
  const thought2Opacity = useTransform(scrollYProgress, [0.90, 0.92], [0, 1]);
  const qMarksOpacity = useTransform(scrollYProgress, [0.88, 0.91], [0, 1]);

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
      {/* ─── SECTION HEADER (VISIBLE BEFORE SCROLL LOCK) ─── */}
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
            color: "var(--teal)",
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            display: "inline-flex",
            alignItems: "center",
            gap: "6px"
          }}
        >
          <Sparkles size={16} />
          The Clinical Dilemma We Solve
        </span>
        <h2
          style={{
            fontSize: "clamp(2rem, 4.5vw, 3.2rem)",
            fontWeight: 800,
            margin: "12px 0 14px",
            color: "var(--ink-900)",
            letterSpacing: "-0.025em",
            lineHeight: 1.15
          }}
        >
          Rajan's Journey: Two Renowned Doctors. <br />
          <span style={{ color: "#b54338" }}>Two Clashing Prescriptions.</span> Zero Clarity.
        </h2>
        <p
          style={{
            color: "var(--ink-700)",
            fontSize: "1.05rem",
            maxWidth: "640px",
            margin: "0 auto 20px",
            lineHeight: 1.55
          }}
        >
          Follow the real-life experience millions of Indian patients face every day when conflicting medical advice puts health at risk.
        </p>

        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 18px",
            borderRadius: "999px",
            background: "var(--bg-2)",
            border: "1px solid var(--line)",
            color: "var(--ink-700)",
            fontSize: "0.85rem",
            fontWeight: 600
          }}
        >
          <ChevronDown size={16} style={{ animation: "bounce 1.5s ease infinite", color: "var(--teal)" }} />
          <span>Scroll down to experience the story</span>
          <ChevronDown size={16} style={{ animation: "bounce 1.5s ease infinite 0.2s", color: "var(--teal)" }} />
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
            background: "linear-gradient(90deg, #0d9488, #2563eb, #fbbf24)",
            scaleX: progressBarScale,
            transformOrigin: "left",
            zIndex: 100
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
            background: "rgba(15, 23, 42, 0.75)",
            backdropFilter: "blur(8px)",
            color: "#ffffff",
            fontSize: "0.78rem",
            fontWeight: 600,
            border: "1px solid rgba(255, 255, 255, 0.15)",
            display: "flex",
            alignItems: "center",
            gap: "6px"
          }}
        >
          <span
            style={{
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              background: "#4ade80",
              boxShadow: "0 0 8px #4ade80"
            }}
          />
          <span>Interactive Patient Case Study</span>
        </div>

        {/* ═══════════════════════════════════════════════════════════
            SCENE 1: DR. MEHTA'S CLINIC (DOCTOR IN WHEELCHAIR)
            ═══════════════════════════════════════════════════════════ */}
        <motion.div
          className="story-clinic-bg-light"
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
              margin: "0 auto",
              paddingTop: "10px"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  background: "var(--teal)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ffffff"
                }}
              >
                <Building2 size={20} />
              </div>
              <div>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--teal)", textTransform: "uppercase" }}>
                  Scene 1 · Day 1 Consultation
                </span>
                <h4 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800, color: "var(--ink-900)" }}>
                  Mehta Polyclinic & Care Centre
                </h4>
              </div>
            </div>

            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 12px",
                borderRadius: "8px",
                background: "rgba(13, 148, 136, 0.08)",
                border: "1px solid rgba(13, 148, 136, 0.2)",
                fontSize: "0.82rem",
                color: "var(--teal-deep)",
                fontWeight: 600
              }}
            >
              <span>Dr. R. Mehta (MBBS, MD)</span>
              <span style={{ opacity: 0.6 }}>• Room 204</span>
            </div>
          </div>

          {/* Interactive Stage: Doctor Mehta in Wheelchair + Patient + Chat Flow */}
          <div
            style={{
              width: "100%",
              maxWidth: "1140px",
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: "1.1fr 1fr",
              gap: "24px",
              alignItems: "center",
              flex: 1
            }}
          >
            {/* Left: SVG Character Art (Dr. Mehta in Wheelchair at Wooden Desk + Patient) */}
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
              <svg
                viewBox="0 0 520 340"
                style={{ width: "100%", height: "100%", overflow: "visible" }}
              >
                <defs>
                  <linearGradient id="clinicWindow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#e0f2fe" />
                    <stop offset="100%" stopColor="#bae6fd" />
                  </linearGradient>
                  <linearGradient id="woodDesk" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#8B5E3C" />
                    <stop offset="100%" stopColor="#78350F" />
                  </linearGradient>
                  <linearGradient id="goldPlate" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#d97706" />
                  </linearGradient>
                  <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
                    <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.12" />
                  </filter>
                </defs>

                {/* Background Wall Window */}
                <rect x="30" y="30" width="130" height="120" rx="8" fill="url(#clinicWindow)" stroke="#cbd5e1" strokeWidth="3" />
                <line x1="95" y1="30" x2="95" y2="150" stroke="#94a3b8" strokeWidth="2.5" />
                <line x1="30" y1="90" x2="160" y2="90" stroke="#94a3b8" strokeWidth="2.5" />

                {/* Wall Certificate / Diploma */}
                <rect x="210" y="40" width="70" height="50" rx="4" fill="#ffffff" stroke="#94a3b8" strokeWidth="2" />
                <rect x="216" y="46" width="58" height="38" fill="none" stroke="#d97706" strokeWidth="1" strokeDasharray="2,2" />
                <circle cx="245" cy="65" r="7" fill="#f59e0b" />

                {/* Wall Clock */}
                <circle cx="340" cy="55" r="22" fill="#ffffff" stroke="#64748b" strokeWidth="3" />
                <line x1="340" y1="55" x2="340" y2="42" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="340" y1="55" x2="350" y2="55" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="340" cy="55" r="2.5" fill="#1e293b" />

                {/* Floor Line */}
                <line x1="10" y1="285" x2="510" y2="285" stroke="#94a3b8" strokeWidth="2" strokeDasharray="6,4" opacity="0.6" />

                {/* ── DR. MEHTA'S WHEELCHAIR ── */}
                <g id="wheelchair" filter="url(#softShadow)">
                  {/* Wheelchair Backrest */}
                  <rect x="68" y="130" width="12" height="75" rx="4" fill="#1e293b" />
                  {/* Push Handle */}
                  <path d="M 70 135 C 55 130 50 140 45 135" stroke="#475569" strokeWidth="4" strokeLinecap="round" fill="none" />
                  {/* Wheelchair Seat */}
                  <rect x="72" y="195" width="74" height="14" rx="4" fill="#0f172a" />
                  {/* Wheelchair Frame Tubes */}
                  <path d="M 85 200 L 110 240 L 155 240 M 155 240 L 155 270" stroke="#475569" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  <path d="M 75 195 L 110 240" stroke="#64748b" strokeWidth="3" fill="none" />
                  {/* Footrest Plate */}
                  <line x1="145" y1="268" x2="175" y2="268" stroke="#334155" strokeWidth="5" strokeLinecap="round" />

                  {/* Rear Wheel (Large Outer Wheel with Spokes) */}
                  <g>
                    <circle cx="100" cy="228" r="50" stroke="#334155" strokeWidth="7" fill="none" />
                    <circle cx="100" cy="228" r="42" stroke="#64748b" strokeWidth="3" fill="none" />
                    {/* Spokes */}
                    <line x1="100" y1="178" x2="100" y2="278" stroke="#94a3b8" strokeWidth="1.8" />
                    <line x1="50" y1="228" x2="150" y2="228" stroke="#94a3b8" strokeWidth="1.8" />
                    <line x1="65" y1="193" x2="135" y2="263" stroke="#94a3b8" strokeWidth="1.8" />
                    <line x1="65" y1="263" x2="135" y2="193" stroke="#94a3b8" strokeWidth="1.8" />
                    {/* Wheel Hub */}
                    <circle cx="100" cy="228" r="9" fill="#1e293b" />
                    <circle cx="100" cy="228" r="4" fill="#cbd5e1" />
                  </g>

                  {/* Front Caster Wheel */}
                  <circle cx="160" cy="274" r="11" stroke="#334155" strokeWidth="4" fill="#0f172a" />
                  <circle cx="160" cy="274" r="3" fill="#94a3b8" />
                </g>

                {/* ── DR. MEHTA (FIGURE) ── */}
                <g id="dr-mehta">
                  {/* Doctor Torso & White Coat */}
                  <path d="M 98 140 Q 125 130 148 140 L 152 205 L 94 205 Z" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
                  {/* Inner Shirt & Tie */}
                  <path d="M 120 135 L 126 135 L 126 160 L 123 166 L 120 160 Z" fill="#0d9488" />
                  {/* Stethoscope */}
                  <path d="M 114 138 C 114 165 132 165 132 138" stroke="#0f766e" strokeWidth="3" fill="none" strokeLinecap="round" />
                  <circle cx="123" cy="168" r="5" fill="#64748b" stroke="#ffffff" strokeWidth="1.5" />

                  {/* Doctor Head & Features */}
                  <circle cx="124" cy="108" r="22" fill="#C68642" />
                  {/* Hair */}
                  <path d="M 104 104 C 104 88 144 88 144 104 C 144 94 130 84 116 88 Z" fill="#1e293b" />
                  {/* Glasses */}
                  <rect x="114" y="103" width="10" height="7" rx="2" stroke="#334155" strokeWidth="1.5" fill="rgba(255,255,255,0.4)" />
                  <rect x="127" y="103" width="10" height="7" rx="2" stroke="#334155" strokeWidth="1.5" fill="rgba(255,255,255,0.4)" />
                  <line x1="124" y1="106" x2="127" y2="106" stroke="#334155" strokeWidth="1.5" />
                  {/* Kind Smile */}
                  <path d="M 120 119 Q 124 123 128 119" stroke="#78350f" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                </g>

                {/* ── CLINIC DESK & ACCESSORIES ── */}
                <g id="desk" filter="url(#softShadow)">
                  {/* Desk Leg Front */}
                  <rect x="160" y="210" width="12" height="75" fill="#58311a" rx="2" />
                  <rect x="300" y="210" width="12" height="75" fill="#58311a" rx="2" />
                  {/* Desk Modesty Panel */}
                  <rect x="168" y="218" width="136" height="50" fill="#6d4427" opacity="0.9" />
                  {/* Desk Surface */}
                  <rect x="145" y="196" width="180" height="15" rx="3" fill="url(#woodDesk)" />

                  {/* Brass Nameplate: "Dr. R. Mehta" */}
                  <g>
                    <polygon points="175,200 250,200 246,183 179,183" fill="url(#goldPlate)" stroke="#b45309" strokeWidth="1" />
                    <text x="212" y="194" fontSize="7.5" fill="#ffffff" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                      Dr. R. Mehta, MD
                    </text>
                  </g>

                  {/* Pen Stand with Pens */}
                  <rect x="272" y="178" width="14" height="20" rx="3" fill="#334155" />
                  <line x1="275" y1="178" x2="273" y2="168" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="279" y1="178" x2="279" y2="166" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="283" y1="178" x2="284" y2="169" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />

                  {/* Medical File Stack */}
                  <rect x="152" y="190" width="22" height="7" rx="1" fill="#f8fafc" stroke="#cbd5e1" />
                  <rect x="151" y="186" width="24" height="6" rx="1" fill="#0d9488" opacity="0.8" />
                </g>

                {/* ── PATIENT RAJAN (SEATED OPPOSITE) ── */}
                <g id="patient-rajan" filter="url(#softShadow)">
                  {/* Wooden Chair */}
                  <path d="M 370 198 L 415 198 L 415 285 M 372 285 L 372 198 M 415 198 L 415 130" stroke="#78350F" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  <line x1="375" y1="235" x2="415" y2="235" stroke="#8B5E3C" strokeWidth="3" />

                  {/* Patient Torso & Light Blue Kurta */}
                  <path d="M 370 145 Q 392 135 412 145 L 410 210 L 366 210 Z" fill="#a8d5e2" stroke="#7dd3fc" strokeWidth="1.5" />
                  {/* Kurta Neckline */}
                  <line x1="392" y1="140" x2="392" y2="165" stroke="#38bdf8" strokeWidth="2" />
                  <circle cx="392" cy="150" r="1.5" fill="#0284c7" />
                  <circle cx="392" cy="158" r="1.5" fill="#0284c7" />

                  {/* Patient Pants & Shoes */}
                  <rect x="368" y="210" width="40" height="50" rx="3" fill="#334155" />
                  <ellipse cx="380" cy="275" rx="12" ry="6" fill="#1e293b" />
                  <ellipse cx="405" cy="275" rx="12" ry="6" fill="#1e293b" />

                  {/* Patient Head & Worried Expression */}
                  <circle cx="390" cy="112" r="21" fill="#C68642" />
                  {/* Hair */}
                  <path d="M 372 110 C 372 92 410 92 410 110 C 410 98 398 88 384 90 Z" fill="#1e1e24" />
                  {/* Slanted Worried Eyebrows */}
                  <line x1="379" y1="105" x2="387" y2="108" stroke="#1e1e24" strokeWidth="2" strokeLinecap="round" />
                  <line x1="393" y1="108" x2="401" y2="105" stroke="#1e1e24" strokeWidth="2" strokeLinecap="round" />
                  {/* Sad Eyes */}
                  <circle cx="383" cy="112" r="2" fill="#1e1e24" />
                  <circle cx="397" cy="112" r="2" fill="#1e1e24" />
                  {/* Drooping Mouth */}
                  <path d="M 385 125 Q 390 121 395 125" stroke="#78350f" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                  {/* Rosy Fever Cheeks */}
                  <circle cx="379" cy="118" r="3.5" fill="#f87171" opacity="0.6" />
                  <circle cx="401" cy="118" r="3.5" fill="#f87171" opacity="0.6" />
                </g>
              </svg>

              {/* Animated Floating Prescription Card from Dr. Mehta */}
              <motion.div
                style={{
                  position: "absolute",
                  bottom: "90px",
                  left: "40%",
                  opacity: rxCard1Opacity,
                  x: rxCard1X,
                  y: rxCard1Y,
                  zIndex: 25
                }}
              >
                <div
                  style={{
                    background: "#ffffff",
                    border: "2px solid #0d9488",
                    borderRadius: "10px",
                    padding: "10px 14px",
                    width: "230px",
                    boxShadow: "0 10px 25px rgba(13, 148, 136, 0.25)",
                    transform: "rotate(-3deg)"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px dashed #cbd5e1", paddingBottom: "4px" }}>
                    <span style={{ fontSize: "1rem", fontWeight: 900, color: "#0d9488", fontFamily: "serif" }}>Rx</span>
                    <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "#64748b" }}>Dr. Mehta · Rx #1</span>
                  </div>
                  <div style={{ marginTop: "6px", fontSize: "0.74rem", color: "#1e293b", lineHeight: 1.4 }}>
                    <strong>1. Azithromycin 250mg</strong> (1-0-0)<br />
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
                minHeight: "340px",
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
                    width: "30px",
                    height: "30px",
                    borderRadius: "50%",
                    background: "#0d9488",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: "0.75rem",
                    flexShrink: 0
                  }}
                >
                  Dr
                </div>
                <div>
                  <div style={{ fontSize: "0.72rem", color: "#94a3b8", fontWeight: 600, marginBottom: "2px" }}>
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
                  <div style={{ fontSize: "0.72rem", color: "var(--ink-500)", fontWeight: 600, marginBottom: "2px", textAlign: "right" }}>
                    Rajan (Patient)
                  </div>
                  <span>Doctor sahab, 4 din se tez bukhaar hai aur sar mein bohot dard hai. Neend bhi nahi aa rahi 😓</span>
                </div>
                <div
                  style={{
                    width: "30px",
                    height: "30px",
                    borderRadius: "50%",
                    background: "#f59e0b",
                    color: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: "0.75rem",
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
                <span style={{ background: "var(--card)", border: "1px solid var(--line)", padding: "3px 8px", borderRadius: "999px", fontSize: "0.85rem" }}>
                  🤒 High Fever
                </span>
                <span style={{ background: "var(--card)", border: "1px solid var(--line)", padding: "3px 8px", borderRadius: "999px", fontSize: "0.85rem" }}>
                  🌡️ 101°F Temp
                </span>
                <span style={{ background: "var(--card)", border: "1px solid var(--line)", padding: "3px 8px", borderRadius: "999px", fontSize: "0.85rem" }}>
                  🤕 Severe Headache
                </span>
              </motion.div>

              {/* Scene 1D: Doctor 3 Voice Questions (Audio Waveform Style) */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {/* Voice Question 1 */}
                <motion.div
                  className="story-chat-bubble-doc"
                  style={{ opacity: docQ1Opacity, padding: "8px 14px", maxWidth: "310px" }}
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
                  style={{ opacity: docQ2Opacity, padding: "8px 14px", maxWidth: "310px" }}
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
                  style={{ opacity: docQ3Opacity, padding: "8px 14px", maxWidth: "310px" }}
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
                  maxWidth: "340px",
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
            TRANSITION 1: "3 दिन बाद" PAINT BRUSH WIPE (0.52 → 0.60)
            Matching nissh.info organic wavy sweep (media_1790281970668.png)
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
          {/* Top-Left Diagonal Organic Curved Brush Sweep */}
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
              <path
                d="M 0,0 L 1000,0 L 1000,280 C 820,380 720,240 560,420 C 400,600 240,490 0,680 Z"
                fill="#FFF3DC"
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
                fill="#FFF3DC"
              />
            </svg>
          </motion.div>

          {/* Full Screen Saffron-Cream Fill with Bold Typography */}
          <motion.div
            style={{
              position: "absolute",
              inset: 0,
              background: "#FFF3DC",
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
                fontSize: "0.9rem",
                fontWeight: 800,
                color: "#d97706",
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                marginBottom: "8px"
              }}
            >
              Phase 2: Escalation
            </span>
            <h1
              style={{
                fontSize: "clamp(3rem, 8vw, 5.5rem)",
                fontWeight: 900,
                color: "#1a1a2e",
                margin: 0,
                letterSpacing: "-0.03em",
                fontFamily: "Inter, serif"
              }}
            >
              3 दिन बाद
            </h1>
            <p
              style={{
                fontSize: "clamp(1.1rem, 2.5vw, 1.6rem)",
                fontWeight: 600,
                color: "#475569",
                marginTop: "10px",
                fontStyle: "italic"
              }}
            >
              (3 Days Later · No Relief · Fever Persisting)
            </p>
            <div
              style={{
                marginTop: "20px",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 20px",
                borderRadius: "999px",
                background: "rgba(220, 38, 38, 0.1)",
                border: "1px solid rgba(220, 38, 38, 0.25)",
                color: "#dc2626",
                fontWeight: 700,
                fontSize: "0.9rem"
              }}
            >
              <AlertTriangle size={16} />
              <span>Rajan visits a second specialist for a second opinion...</span>
            </div>
          </motion.div>
        </motion.div>

        {/* ═══════════════════════════════════════════════════════════
            SCENE 2: DR. SHARMA'S CLINIC (SECOND OPINION CONFLICT)
            ═══════════════════════════════════════════════════════════ */}
        <motion.div
          className="story-clinic-bg-light"
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
              margin: "0 auto",
              paddingTop: "10px"
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
                  color: "#ffffff"
                }}
              >
                <Building2 size={20} />
              </div>
              <div>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#2563eb", textTransform: "uppercase" }}>
                  Scene 2 · Second Opinion Consultation
                </span>
                <h4 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800, color: "var(--ink-900)" }}>
                  Sharma Super-Speciality Hospital
                </h4>
              </div>
            </div>

            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 12px",
                borderRadius: "8px",
                background: "rgba(37, 99, 235, 0.08)",
                border: "1px solid rgba(37, 99, 235, 0.2)",
                fontSize: "0.82rem",
                color: "#2563eb",
                fontWeight: 600
              }}
            >
              <span>Dr. P. Sharma (MD, Internal Med)</span>
              <span style={{ opacity: 0.6 }}>• OPD-B</span>
            </div>
          </div>

          {/* Scene 2 Stage */}
          <div
            style={{
              width: "100%",
              maxWidth: "1140px",
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: "1.1fr 1fr",
              gap: "24px",
              alignItems: "center",
              flex: 1
            }}
          >
            {/* Left: SVG Character Art (Dr. Sharma at Modern Desk with Office Chair + Rajan) */}
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
              <svg
                viewBox="0 0 520 340"
                style={{ width: "100%", height: "100%", overflow: "visible" }}
              >
                <defs>
                  <linearGradient id="modernWindow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#eff6ff" />
                    <stop offset="100%" stopColor="#dbeafe" />
                  </linearGradient>
                  <linearGradient id="officeDesk" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#475569" />
                    <stop offset="100%" stopColor="#334155" />
                  </linearGradient>
                  <linearGradient id="bluePlate" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#2563eb" />
                    <stop offset="100%" stopColor="#1d4ed8" />
                  </linearGradient>
                </defs>

                {/* Window */}
                <rect x="40" y="30" width="120" height="110" rx="6" fill="url(#modernWindow)" stroke="#93c5fd" strokeWidth="2.5" />
                <line x1="100" y1="30" x2="100" y2="140" stroke="#93c5fd" strokeWidth="2" />
                <line x1="40" y1="85" x2="160" y2="85" stroke="#93c5fd" strokeWidth="2" />

                {/* Floor Line */}
                <line x1="10" y1="285" x2="510" y2="285" stroke="#94a3b8" strokeWidth="2" strokeDasharray="6,4" opacity="0.6" />

                {/* ── DR. SHARMA'S MODERN OFFICE CHAIR ── */}
                <g id="office-chair">
                  <rect x="75" y="115" width="16" height="85" rx="5" fill="#1e293b" />
                  <rect x="70" y="196" width="70" height="12" rx="3" fill="#0f172a" />
                  {/* Chrome Star Base */}
                  <line x1="105" y1="208" x2="105" y2="248" stroke="#94a3b8" strokeWidth="6" />
                  <line x1="105" y1="248" x2="70" y2="278" stroke="#64748b" strokeWidth="4.5" strokeLinecap="round" />
                  <line x1="105" y1="248" x2="140" y2="278" stroke="#64748b" strokeWidth="4.5" strokeLinecap="round" />
                </g>

                {/* ── DR. SHARMA (FIGURE) ── */}
                <g id="dr-sharma">
                  {/* Doctor Torso & Lab Coat */}
                  <path d="M 98 135 Q 124 126 148 135 L 150 205 L 94 205 Z" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
                  <path d="M 120 132 L 126 132 L 126 160 L 120 160 Z" fill="#2563eb" />
                  {/* Stethoscope */}
                  <path d="M 112 135 C 112 165 130 165 130 135" stroke="#2563eb" strokeWidth="3" fill="none" strokeLinecap="round" />
                  <circle cx="121" cy="165" r="5" fill="#64748b" stroke="#ffffff" strokeWidth="1.5" />

                  {/* Lighter Complexion Skin (#E8C99A) */}
                  <circle cx="124" cy="104" r="22" fill="#E8C99A" />
                  {/* Hair */}
                  <path d="M 104 100 C 104 84 144 84 144 100 C 144 90 128 80 114 84 Z" fill="#0f172a" />
                  {/* Spectacles */}
                  <rect x="114" y="99" width="10" height="7" rx="2" stroke="#2563eb" strokeWidth="1.5" fill="rgba(255,255,255,0.4)" />
                  <rect x="127" y="99" width="10" height="7" rx="2" stroke="#2563eb" strokeWidth="1.5" fill="rgba(255,255,255,0.4)" />
                  <line x1="124" y1="102" x2="127" y2="102" stroke="#2563eb" strokeWidth="1.5" />
                  {/* Neutral Stern Expression */}
                  <line x1="120" y1="116" x2="128" y2="116" stroke="#5c3818" strokeWidth="2" strokeLinecap="round" />
                </g>

                {/* ── MODERN CLINIC DESK & LAPTOP ── */}
                <g id="desk-sharma">
                  <rect x="160" y="210" width="12" height="75" fill="#334155" rx="2" />
                  <rect x="300" y="210" width="12" height="75" fill="#334155" rx="2" />
                  <rect x="168" y="220" width="136" height="48" fill="#1e293b" opacity="0.8" />
                  <rect x="145" y="196" width="180" height="15" rx="3" fill="url(#officeDesk)" />

                  {/* Modern Laptop */}
                  <polygon points="230,196 265,196 260,178 235,178" fill="#94a3b8" />
                  <rect x="236" y="180" width="22" height="14" fill="#0f172a" />

                  {/* Nameplate: "Dr. P. Sharma" */}
                  <polygon points="175,200 250,200 246,183 179,183" fill="url(#bluePlate)" stroke="#1d4ed8" strokeWidth="1" />
                  <text x="212" y="194" fontSize="7.5" fill="#ffffff" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                    Dr. P. Sharma, MD
                  </text>
                </g>

                {/* ── PATIENT RAJAN (TIRED & WEARY) ── */}
                <g id="patient-rajan-2">
                  <path d="M 370 198 L 415 198 L 415 285 M 372 285 L 372 198 M 415 198 L 415 130" stroke="#78350F" strokeWidth="5" strokeLinecap="round" fill="none" />
                  <path d="M 368 145 Q 390 135 412 145 L 410 210 L 366 210 Z" fill="#a8d5e2" stroke="#7dd3fc" strokeWidth="1.5" />
                  <rect x="368" y="210" width="40" height="50" rx="3" fill="#334155" />
                  <ellipse cx="380" cy="275" rx="12" ry="6" fill="#1e293b" />
                  <ellipse cx="405" cy="275" rx="12" ry="6" fill="#1e293b" />

                  <circle cx="390" cy="112" r="21" fill="#C68642" />
                  <path d="M 372 110 C 372 92 410 92 410 110 C 410 98 398 88 384 90 Z" fill="#1e1e24" />
                  {/* Very Tired Drooping Eyes */}
                  <line x1="380" y1="113" x2="386" y2="114" stroke="#1e1e24" strokeWidth="2.5" />
                  <line x1="394" y1="114" x2="400" y2="113" stroke="#1e1e24" strokeWidth="2.5" />
                  <path d="M 386 126 Q 390 122 394 126" stroke="#78350f" strokeWidth="2" fill="none" />
                </g>
              </svg>

              {/* Prescription 2 Card Sliding Up */}
              <motion.div
                style={{
                  position: "absolute",
                  bottom: "90px",
                  left: "40%",
                  opacity: rxCard2Opacity,
                  zIndex: 25
                }}
              >
                <div
                  style={{
                    background: "#ffffff",
                    border: "2px solid #2563eb",
                    borderRadius: "10px",
                    padding: "10px 14px",
                    width: "230px",
                    boxShadow: "0 10px 25px rgba(37, 99, 235, 0.25)",
                    transform: "rotate(3deg)"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px dashed #cbd5e1", paddingBottom: "4px" }}>
                    <span style={{ fontSize: "1rem", fontWeight: 900, color: "#2563eb", fontFamily: "serif" }}>Rx</span>
                    <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "#64748b" }}>Dr. Sharma · Rx #2</span>
                  </div>
                  <div style={{ marginTop: "6px", fontSize: "0.74rem", color: "#1e293b", lineHeight: 1.4 }}>
                    <strong style={{ color: "#dc2626" }}>1. Cefixime 200mg (Antibiotic)</strong><br />
                    <strong>2. Widal Test + CBC Blood Panel</strong><br />
                    <strong>3. ORS + Vitamin Zinc</strong>
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
                minHeight: "340px",
                justifyContent: "center"
              }}
            >
              {/* Patient Explains Medicine Failed */}
              <motion.div
                className="story-chat-bubble-patient"
                style={{
                  alignSelf: "flex-end",
                  opacity: patBubble2Opacity,
                  maxWidth: "340px"
                }}
              >
                <div>
                  <div style={{ fontSize: "0.72rem", color: "var(--ink-500)", fontWeight: 600, marginBottom: "2px", textAlign: "right" }}>
                    Rajan (Patient)
                  </div>
                  <span>Doctor sahab, 3 din pehle Dr. Mehta se mila tha. Unki dawa se koi aaram nahi mila. Tabiyat aur bigad rahi hai 😔</span>
                </div>
                <div
                  style={{
                    width: "30px",
                    height: "30px",
                    borderRadius: "50%",
                    background: "#f59e0b",
                    color: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: "0.75rem",
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
                  maxWidth: "360px",
                  background: "#0f172a"
                }}
              >
                <div
                  style={{
                    width: "30px",
                    height: "30px",
                    borderRadius: "50%",
                    background: "#2563eb",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: "0.75rem",
                    flexShrink: 0
                  }}
                >
                  Dr
                </div>
                <div>
                  <div style={{ fontSize: "0.72rem", color: "#93c5fd", fontWeight: 600, marginBottom: "2px" }}>
                    Dr. Sharma (Internal Medicine)
                  </div>
                  <span>
                    "Dekhta hun... Lagta hai Typhoid ke symptoms hain. Mehta ji ka prescription galat nahi tha, par incomplete tha. Main Cefixime add karta hun aur ek blood test bhi chahiye."
                  </span>
                </div>
              </motion.div>

              {/* High Risk Conflict Notification Badge */}
              <motion.div
                style={{
                  opacity: conflictWarningOpacity,
                  background: "rgba(220, 38, 38, 0.08)",
                  border: "1.5px solid #dc2626",
                  borderRadius: "14px",
                  padding: "12px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  boxShadow: "0 6px 20px rgba(220, 38, 38, 0.15)"
                }}
              >
                <div
                  style={{
                    width: "34px",
                    height: "34px",
                    borderRadius: "50%",
                    background: "#dc2626",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#ffffff",
                    flexShrink: 0
                  }}
                >
                  <AlertTriangle size={18} />
                </div>
                <div>
                  <h5 style={{ margin: 0, fontSize: "0.88rem", fontWeight: 800, color: "#dc2626" }}>
                    Prescription Conflict Created!
                  </h5>
                  <p style={{ margin: "2px 0 0", fontSize: "0.78rem", color: "var(--ink-700)" }}>
                    Azithromycin (Macrolide) vs Cefixime (Cephalosporin) without drug cessation protocol or clinical culture correlation.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* ═══════════════════════════════════════════════════════════
            TRANSITION 2: 4-CORNER BLACK WIPE (0.82 → 0.87)
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
              background: "#0a0a0a",
              clipPath: "polygon(0 0, 100% 0, 0 100%)",
              scale: cornerWipeScale,
              transformOrigin: "top left"
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
              background: "#0a0a0a",
              clipPath: "polygon(100% 0, 100% 100%, 0 0)",
              scale: cornerWipeScale,
              transformOrigin: "top right"
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
              background: "#0a0a0a",
              clipPath: "polygon(0 0, 0 100%, 100% 100%)",
              scale: cornerWipeScale,
              transformOrigin: "bottom left"
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
              background: "#0a0a0a",
              clipPath: "polygon(100% 0, 100% 100%, 0 100%)",
              scale: cornerWipeScale,
              transformOrigin: "bottom right"
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
                fontSize: "clamp(2rem, 5vw, 3.6rem)",
                fontWeight: 900,
                color: "#ffffff",
                letterSpacing: "-0.02em",
                margin: 0
              }}
            >
              Clashing Diagnoses. Zero Consensus.
            </h2>
            <p style={{ color: "#94a3b8", fontSize: "1.1rem", marginTop: "10px", maxWidth: "540px" }}>
              Who is right? Who should Rajan trust? Taking both could be dangerous.
            </p>
          </motion.div>
        </div>

        {/* ═══════════════════════════════════════════════════════════
            SCENE 3: PATIENT HOME + SECOND SIGHT SOLUTION (0.87 → 1.00)
            Matching media_1790280284357.png (head scratch + question marks)
            ═══════════════════════════════════════════════════════════ */}
        <motion.div
          className="story-home-bg-light"
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
                  background: "var(--teal)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ffffff"
                }}
              >
                <Sparkles size={20} />
              </div>
              <div>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--teal)", textTransform: "uppercase" }}>
                  Scene 3 · AI Resolution
                </span>
                <h4 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800, color: "var(--ink-900)" }}>
                  Rajan's Living Room → SecondSight Pro
                </h4>
              </div>
            </div>

            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 12px",
                borderRadius: "999px",
                background: "rgba(13, 148, 136, 0.1)",
                color: "var(--teal)",
                fontSize: "0.8rem",
                fontWeight: 700
              }}
            >
              <ShieldCheck size={16} />
              <span>Evidence-Based Reconciliation</span>
            </div>
          </div>

          {/* Main Stage: Left 55% Patient on Sofa scratching head, Right 45% Smartphone Mockup */}
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
            {/* Left: Patient on Sofa Scratching Head (matching media_1790280284357.png) + Thought Bubbles */}
            <div style={{ position: "relative", width: "100%", height: "265px", display: "flex", alignItems: "center" }}>
              {/* SVG Character on Sofa */}
              <svg
                viewBox="0 0 460 330"
                style={{ width: "100%", height: "100%", overflow: "visible" }}
              >
                <defs>
                  <linearGradient id="sofaFabric" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0f766e" />
                    <stop offset="100%" stopColor="#115e59" />
                  </linearGradient>
                  <linearGradient id="cushionGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#14b8a6" />
                    <stop offset="100%" stopColor="#0d9488" />
                  </linearGradient>
                </defs>

                {/* Living Room Window & Curtain */}
                <rect x="20" y="25" width="100" height="90" rx="4" fill="#fef08a" opacity="0.4" stroke="#e2e8f0" strokeWidth="2" />
                <path d="M 15 20 Q 25 70 15 120" stroke="#f59e0b" strokeWidth="6" fill="none" strokeLinecap="round" />
                <path d="M 125 20 Q 115 70 125 120" stroke="#f59e0b" strokeWidth="6" fill="none" strokeLinecap="round" />

                {/* Floor */}
                <line x1="10" y1="275" x2="450" y2="275" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="6,4" />

                {/* ── COZY LIVING ROOM SOFA ── */}
                <g id="sofa">
                  {/* Sofa Backrest */}
                  <rect x="50" y="145" width="220" height="70" rx="14" fill="url(#sofaFabric)" />
                  {/* Left Armrest */}
                  <rect x="35" y="175" width="30" height="60" rx="12" fill="#134e4a" />
                  {/* Right Armrest */}
                  <rect x="245" y="175" width="30" height="60" rx="12" fill="#134e4a" />
                  {/* Plush Seat Cushions */}
                  <rect x="62" y="198" width="94" height="35" rx="10" fill="url(#cushionGrad)" />
                  <rect x="156" y="198" width="94" height="35" rx="10" fill="url(#cushionGrad)" />
                  {/* Sofa Legs */}
                  <line x1="55" y1="235" x2="45" y2="272" stroke="#78350f" strokeWidth="6" strokeLinecap="round" />
                  <line x1="255" y1="235" x2="265" y2="272" stroke="#78350f" strokeWidth="6" strokeLinecap="round" />
                </g>

                {/* ── RAJAN SCRATCHING HEAD (EXACT REFERENCE: media_1790280284357.png) ── */}
                <g id="rajan-confused">
                  {/* Torso with Blue Patterned Kurta/Sweater */}
                  <path d="M 122 155 Q 150 142 178 155 L 175 225 L 118 225 Z" fill="#0284c7" stroke="#0369a1" strokeWidth="2" />
                  {/* Kurta Collar detail */}
                  <path d="M 135 155 Q 150 168 165 155" fill="none" stroke="#bae6fd" strokeWidth="3" />

                  {/* Right Arm Holding Phone in Lap */}
                  <path d="M 124 165 L 105 210 L 128 215" stroke="#0284c7" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  {/* Mini Smartphone in hand */}
                  <rect x="122" y="202" width="16" height="26" rx="3" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />

                  {/* Left Arm Bent UPWARDS to scratch head (matching reference image!) */}
                  <path d="M 175 165 L 205 130 L 174 102" stroke="#0284c7" strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  {/* Hand on Head */}
                  <circle cx="174" cy="102" r="8" fill="#C68642" />

                  {/* Patient Head */}
                  <circle cx="150" cy="115" r="24" fill="#C68642" />
                  {/* Hair */}
                  <path d="M 128 112 C 128 88 172 88 172 112 C 172 98 158 86 142 88 Z" fill="#1e1e24" />

                  {/* Confused Facial Expression (Open mouth "O", asymmetric eyebrows) */}
                  <line x1="138" y1="106" x2="147" y2="111" stroke="#1e1e24" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="153" y1="109" x2="162" y2="105" stroke="#1e1e24" strokeWidth="2.5" strokeLinecap="round" />
                  <circle cx="143" cy="116" r="2.5" fill="#1e1e24" />
                  <circle cx="157" cy="116" r="2.5" fill="#1e1e24" />
                  {/* Round "O" mouth */}
                  <ellipse cx="150" cy="126" rx="3.5" ry="4.5" fill="#78350f" />
                  {/* Red Confused Blush */}
                  <circle cx="138" cy="122" r="3.5" fill="#f87171" opacity="0.7" />
                  <circle cx="162" cy="122" r="3.5" fill="#f87171" opacity="0.7" />
                </g>

                {/* ── FLOATING YELLOW QUESTION MARKS (media_1790280284357.png) ── */}
                <motion.g id="yellow-question-marks" style={{ opacity: qMarksOpacity }}>
                  {/* Question Mark 1 (Left) */}
                  <g style={{ animation: "questionFloat 2.2s ease-in-out infinite" }}>
                    <text x="80" y="80" fontSize="36" fontWeight="900" fill="#eab308" fontFamily="sans-serif">?</text>
                  </g>
                  {/* Question Mark 2 (Top Center) */}
                  <g style={{ animation: "questionFloat 2.6s ease-in-out infinite 0.4s" }}>
                    <text x="140" y="55" fontSize="42" fontWeight="900" fill="#facc15" fontFamily="sans-serif">?</text>
                  </g>
                  {/* Question Mark 3 (Right) */}
                  <g style={{ animation: "questionFloat 2.4s ease-in-out infinite 0.8s" }}>
                    <text x="215" y="75" fontSize="38" fontWeight="900" fill="#eab308" fontFamily="sans-serif">?</text>
                  </g>
                </motion.g>
              </svg>

              {/* Thought Bubbles Overlaying Patient Head */}
              <div
                style={{
                  position: "absolute",
                  top: "10px",
                  left: "210px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  zIndex: 20
                }}
              >
                {/* Thought 1 */}
                <motion.div
                  className="story-thought-bubble"
                  style={{ opacity: thought1Opacity }}
                >
                  <p style={{ margin: 0, fontWeight: 600, lineHeight: 1.4 }}>
                    "Dr. Mehta ne Azithromycin di... Dr. Sharma ne Cefixime 😕 Dono alag bol rahe hain... Kaun sahi hai?"
                  </p>
                </motion.div>

                {/* Thought 2 */}
                <motion.div
                  className="story-thought-bubble"
                  style={{ opacity: thought2Opacity }}
                >
                  <p style={{ margin: 0, fontWeight: 600, lineHeight: 1.4 }}>
                    "Dono antibiotics ek saath lun ya band kar dun? 🤔 Koi cross-check karne ka tareeqa hai kya?"
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
                    background: "#090d16",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0 18px",
                    fontSize: "0.68rem",
                    color: "#94a3b8",
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
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

                {/* Phone Screen Display Area */}
                <div
                  style={{
                    position: "relative",
                    flex: 1,
                    overflow: "hidden",
                    background: "#ffffff"
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
                      background: "#ffffff"
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
                        border: "1px solid #dfe1e5",
                        background: "#ffffff",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                        fontSize: "0.72rem",
                        color: "#1e293b"
                      }}
                    >
                      <Search size={14} color="#94a3b8" />
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
                          border: "1.5px solid #0d9488",
                          background: "rgba(13, 148, 136, 0.05)"
                        }}
                      >
                        <span style={{ fontSize: "0.62rem", color: "#0d9488", fontWeight: 700 }}>secondsight.pro</span>
                        <h6 style={{ margin: "2px 0 3px", fontSize: "0.78rem", color: "#1d4ed8", fontWeight: 700 }}>
                          SecondSight Pro — Reconcile Conflicting Prescriptions
                        </h6>
                        <p style={{ margin: 0, fontSize: "0.66rem", color: "#475569", lineHeight: 1.3 }}>
                          India's 1st AI Clinical Reconciliation engine. Reconcile two doctor opinions against ICMR protocols.
                        </p>
                      </div>

                      {/* Generic Fake Results */}
                      <div style={{ padding: "8px 10px", borderRadius: "8px", border: "1px solid #f1f5f9" }}>
                        <span style={{ fontSize: "0.58rem", color: "#64748b" }}>healthforum.in</span>
                        <div style={{ height: "8px", width: "80%", background: "#cbd5e1", borderRadius: "4px", margin: "4px 0" }} />
                        <div style={{ height: "6px", width: "95%", background: "#e2e8f0", borderRadius: "4px" }} />
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
                      background: "#f8fafc"
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
                        gap: "6px"
                      }}
                    >
                      <Stethoscope size={16} />
                      <span style={{ fontWeight: 800, fontSize: "0.82rem" }}>SecondSight Pro</span>
                    </div>

                    <div style={{ padding: "12px", display: "flex", flexDirection: "column", gap: "10px", flex: 1 }}>
                      <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#0f172a" }}>
                        Upload 2 Prescriptions to Compare:
                      </span>

                      {/* Dropzone 1 */}
                      <div
                        style={{
                          border: "1.5px dashed #0d9488",
                          borderRadius: "10px",
                          padding: "12px",
                          textAlign: "center",
                          background: "#ffffff"
                        }}
                      >
                        <FileText size={18} color="#0d9488" style={{ margin: "0 auto 4px" }} />
                        <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "#334155" }}>Doctor #1 Prescription</span>
                        <div style={{ fontSize: "0.58rem", color: "#94a3b8" }}>Ready for upload</div>
                      </div>

                      {/* Dropzone 2 */}
                      <div
                        style={{
                          border: "1.5px dashed #2563eb",
                          borderRadius: "10px",
                          padding: "12px",
                          textAlign: "center",
                          background: "#ffffff"
                        }}
                      >
                        <FileText size={18} color="#2563eb" style={{ margin: "0 auto 4px" }} />
                        <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "#334155" }}>Doctor #2 Prescription</span>
                        <div style={{ fontSize: "0.58rem", color: "#94a3b8" }}>Ready for upload</div>
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
                      background: "#f8fafc"
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
                          background: "#ffffff",
                          border: "1px solid #10b981",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between"
                        }}
                      >
                        <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "#0f172a" }}>Dr. Mehta · Rx #1</div>
                        <CheckCircle2 size={14} color="#10b981" />
                      </div>

                      {/* Prescription 2 Tag */}
                      <div
                        style={{
                          padding: "8px 10px",
                          borderRadius: "8px",
                          background: "#ffffff",
                          border: "1px solid #10b981",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between"
                        }}
                      >
                        <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "#0f172a" }}>Dr. Sharma · Rx #2</div>
                        <CheckCircle2 size={14} color="#10b981" />
                      </div>

                      {/* Progress Bar */}
                      <div style={{ marginTop: "14px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.68rem", fontWeight: 700, color: "#0d9488", marginBottom: "4px" }}>
                          <span>ICMR Cross-Verification</span>
                          <span>AI Engine Active</span>
                        </div>
                        <div style={{ height: "6px", width: "100%", background: "#e2e8f0", borderRadius: "999px", overflow: "hidden" }}>
                          <motion.div
                            style={{
                              height: "100%",
                              width: uploadProgressWidth,
                              background: "linear-gradient(90deg, #0d9488, #2563eb)"
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
                      background: "#f8fafc",
                      padding: "10px"
                    }}
                  >
                    {/* Verdict Card */}
                    <div
                      style={{
                        background: "#ffffff",
                        borderRadius: "12px",
                        border: "1px solid #e2e8f0",
                        padding: "12px",
                        boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
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
                          background: "rgba(220, 38, 38, 0.08)",
                          border: "1px solid rgba(220, 38, 38, 0.2)"
                        }}
                      >
                        <span style={{ fontSize: "0.72rem", fontWeight: 800, color: "#dc2626" }}>Conflict Risk: 84/100</span>
                        <AlertTriangle size={14} color="#dc2626" />
                      </div>

                      {/* Clinical Finding */}
                      <div style={{ fontSize: "0.68rem", color: "#1e293b", lineHeight: 1.35 }}>
                        <strong>⚠️ Redundant Antibiotics:</strong><br />
                        Azithromycin + Cefixime dual administration has no clinical indication without positive culture.
                      </div>

                      {/* ICMR Guideline */}
                      <div
                        style={{
                          padding: "6px 8px",
                          borderRadius: "6px",
                          background: "#eff6ff",
                          border: "1px solid #bfdbfe",
                          fontSize: "0.62rem",
                          color: "#1d4ed8"
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
                          background: "#ecfdf5",
                          border: "1px solid #a7f3d0",
                          color: "#059669",
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
              borderTop: "1px solid var(--line)"
            }}
          >
            <h3
              style={{
                fontSize: "clamp(1.15rem, 2.2vw, 1.5rem)",
                fontWeight: 800,
                color: "var(--ink-900)",
                margin: "0 0 4px"
              }}
            >
              Confused like Rajan? Get Clinical Clarity in 60 Seconds.
            </h3>
            <p
              style={{
                color: "var(--ink-700)",
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
                background: "var(--teal)",
                color: "#ffffff",
                boxShadow: "0 8px 24px rgba(13, 148, 136, 0.3)"
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
