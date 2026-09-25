# IMPLEMENTATION PROMPT: StoryHeroSection — Scroll-Driven Patient Journey Cinematic

## Context
This is for the SecondSight Pro frontend (Vite + React + TypeScript + Framer Motion v12).
The app solves **conflicting doctor opinions** in India by using AI to reconcile prescriptions.
Design tokens are in `App.css` root vars: `--teal`, `--ink-900`, `--ink-700`, `--sky`, `--bg-0`, `--card`, `--line`, etc.

## Task
Create a new file: `frontend/src/components/StoryHeroSection.tsx`

Then in `frontend/src/pages/HomePage.tsx`:
- Import `StoryHeroSection`
- Place it **between** the HERO SECTION closing `</section>` (line ~273) and the MARQUEE TICKER section
- DO NOT remove or modify the existing hero section — keep it as-is
- The story section becomes "Section 1.5" in the page flow

---

## Component Specification

### Scroll Architecture
Use a **tall sticky scroll container** pattern:
```tsx
const ref = useRef<HTMLDivElement>(null);
const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
```
The outer wrapper is `height: 800vh` (very tall, so user spends time scrolling through the story).
Inside is `position: sticky; top: 0; height: 100vh; overflow: hidden`.
`scrollYProgress` (0→1) drives the entire narrative using `useTransform`.

Divide 0→1 into named segments:
```
0.00 → 0.12  : SCENE 1A — Doctor's room revealed, Dr. Mehta at desk
0.12 → 0.22  : SCENE 1B — Doctor's first chat message appears
0.22 → 0.32  : SCENE 1C — Patient's reply with symptom emojis
0.32 → 0.44  : SCENE 1D — Doctor sends 3 questions together (with sound-wave bubbles)
0.44 → 0.52  : SCENE 1E — Patient replies to all 3, Doctor writes prescription
0.52 → 0.60  : TRANSITION 1 — "3 दिन बाद" brush paint wipe animation
0.60 → 0.68  : SCENE 2A — Second clinic, Dr. Sharma revealed
0.68 → 0.76  : SCENE 2B — Patient says Mehta's medicines did nothing
0.76 → 0.82  : SCENE 2C — Dr. Sharma writes different prescription
0.82 → 0.87  : TRANSITION 2 — 4-corner black wipe (close + open)
0.87 → 1.00  : SCENE 3 — Patient alone on sofa, phone search → SecondSight
```

---

## SVG Character Illustrations

All characters are **inline SVG**, drawn programmatically in React. Do not use external images.

### Character: Dr. Mehta (Scene 1)
- Sitting in a **wheelchair** (two large rear wheels visible, small front wheel, armrests)
- Wearing white doctor coat (fill: #ffffff, stroke: #e2e8f0), stethoscope draped around neck
- Male face, medium-brown Indian skin tone (#C68642), dark black hair
- **Name plate on the desk** in front of him: a small rectangular SVG element with text "Dr. R. Mehta" and a tiny stethoscope icon
- Desk is a wooden rectangle (#8B5E3C), with a cup of pens, a file stack, and the nameplate
- Overall SVG viewBox: "0 0 420 360", positioned left-of-center in the scene

### Character: Patient (Scenes 1 & 2)
- Sitting in a simple wooden chair, hands on lap
- Slightly hunched, looking unwell/worried
- Wearing casual kurta (light blue #a8d5e2 fill), dark pants
- Indian male, dark hair, slightly tired expression
- Positioned right-of-center in the scene

### Character: Dr. Sharma (Scene 2)
- Sitting in a normal office chair (no wheelchair)
- Lighter complexion (#E8C99A), white coat
- Different nameplate: "Dr. P. Sharma"
- Slightly younger looking, different desk layout
- This doctor has a subtle light blue-white color wash to differentiate them from Dr. Mehta

### Character: Patient on Sofa (Scene 3)
- Same patient, now sitting on a comfortable sofa (teal/dark, like a waiting room couch)
- Holding a phone in hand (right hand, phone screen visible)
- Thought bubble above head with two smaller circles leading up to it (classic cartoon thought bubble)
- Expression: confused, slightly stressed

---

## Scene Backgrounds

### Scenes 1 & 2: Doctor's Office
```
background: linear-gradient(180deg, #f8fffe 0%, #edf7f5 100%)
```
Draw a simple room: floor line near bottom, back wall with a window (SVG rect with crosshatch), a plant in corner, a clock on wall.

### Scene 3: Patient's Home
```
background: linear-gradient(180deg, #fef9f0 0%, #fef3e2 100%)
```
Draw a sofa, a window with curtains, warmer tone.

---

## Chat Message Bubbles (Scenes 1 & 2)

Render as absolutely-positioned animated `div` elements over the scene.

**Doctor bubble** (left side of chat area):
```css
background: #1a1a2e;
color: white;
border-radius: 18px 18px 18px 4px;
padding: 12px 16px;
max-width: 320px;
font-size: 0.92rem;
box-shadow: 0 4px 14px rgba(0,0,0,0.15);
```
Has a small avatar circle on the left: teal background, "Dr" initials.

**Patient bubble** (right side):
```css
background: #ffffff;
color: var(--ink-900);
border: 1px solid var(--line);
border-radius: 18px 18px 4px 18px;
padding: 12px 16px;
max-width: 300px;
```
Has a small avatar circle on the right: amber/orange background, patient icon.

Use `framer-motion` `AnimatePresence` + `initial={{ opacity: 0, y: 20 }}` → `animate={{ opacity: 1, y: 0 }}` for each bubble appearing.

**Emoji reaction tags** (appear above/beside patient bubbles):
Small floating pills with emojis: `🤒` `🌡️` `😓` `💊` `🤕`
Each pill: `background: white; border-radius: 999px; padding: 4px 10px; font-size: 1.1rem; box-shadow: 0 2px 8px rgba(0,0,0,0.1)`
Float in with a slight bounce (`spring` transition, `stiffness: 300, damping: 15`).

**Sound-wave / Voice-note style bubbles** (Scene 1D — when doctor asks 3 questions):
These 3 messages appear together with a distinctive "voice note" visual inside each bubble.
Inside each doctor bubble, instead of just text, render:
```tsx
// SVG waveform bars — like WhatsApp voice note
<svg width="80" height="24" viewBox="0 0 80 24">
  {[3,6,10,14,18,12,8,16,10,6,14,10,8,16,12,6].map((h, i) => (
    <rect key={i} x={i * 5} y={(24-h)/2} width="3" height={h} rx="1.5"
      fill="#4ade80" opacity="0.85" />
  ))}
</svg>
```
Below the waveform SVG, show the actual question text in small font.
The 3 bubbles stack vertically with a 200ms stagger between each appearance.

**Prescription animation** (Scene 1E end):
When doctor "writes prescription", show a small animated element that looks like a paper being written:
- A white card that slides up from the desk
- On it, animate 3 horizontal lines drawing themselves left-to-right using SVG `stroke-dashoffset` from full length → 0 (keyframes), each line with 300ms delay
- A small "Rx" symbol at top left of the card
- This card then "floats" to the patient's side

---

## TRANSITION 1: "3 दिन बाद" Paint Brush Wipe (scrollProgress 0.52–0.60)

This is the most complex animation. Implement as an absolutely-positioned full-screen overlay div with `pointer-events: none; z-index: 50`.

**Implementation approach using Framer Motion:**

Create a canvas-style overlay using SVG clipPath or CSS clip-path animated via `scrollYProgress`.

The visual: As if someone is painting the screen with a wide paintbrush — the paint color is a warm saffron-cream (`#FFF3DC`) with a slightly rough, brush-stroke edge.

**Phase A (progress 0.52 → 0.56): Two brushes paint INWARD simultaneously:**

Brush Stroke 1 — Starting from TOP-LEFT corner:
- First stroke: a wide horizontal band sweeps from x=0 to x=50% of screen width, along the TOP EDGE. This is a thick (~80px tall) brush stroke that starts at left and expands rightward. Duration in scroll: 0.52–0.54
- Second stroke: from the LEFT EDGE, a wide vertical band (80px wide) sweeps downward from y=0 to y=50% of screen height. Duration in scroll: 0.54–0.56

Brush Stroke 2 — Starting from BOTTOM-RIGHT corner (simultaneously with Stroke 1):
- First stroke: wide horizontal band from x=100% sweeps leftward to x=50%, along the BOTTOM EDGE. Progress: 0.52–0.54
- Second stroke: from RIGHT EDGE, vertical band sweeps upward from y=100% to y=50%. Progress: 0.54–0.56

Implement each stroke as an absolutely-positioned div:
```tsx
// Top edge left-to-right brush:
<motion.div style={{
  position: "absolute", top: 0, left: 0,
  height: "80px", width: useTransform(scrollYProgress, [0.52, 0.54], ["0%", "50%"]),
  background: "linear-gradient(180deg, #FFF3DC 60%, rgba(255,243,220,0) 100%)",
  transformOrigin: "left",
  zIndex: 51
}} />
// Left edge top-to-bottom brush:
<motion.div style={{
  position: "absolute", top: 0, left: 0,
  width: "80px", height: useTransform(scrollYProgress, [0.54, 0.56], ["0%", "50%"]),
  background: "linear-gradient(90deg, #FFF3DC 60%, rgba(255,243,220,0) 100%)",
  zIndex: 51
}} />
// etc. for bottom-right corner...
```

**Phase B (progress 0.56 → 0.58): Center fill**
A center div fades in to fill the remaining unpainted middle:
```tsx
opacity: useTransform(scrollYProgress, [0.56, 0.575], [0, 1])
```
background: `#FFF3DC`

**Phase C (progress 0.575 → 0.585): "3 दिन बाद" text appears**
Large centered text, black ink, with a subtle handwritten-style font if available (else bold serif):
```tsx
<motion.div style={{
  position: "absolute", inset: 0, display: "flex",
  flexDirection: "column", alignItems: "center", justifyContent: "center",
  opacity: useTransform(scrollYProgress, [0.575, 0.585], [0, 1])
}}>
  <span style={{ fontSize: "clamp(2.5rem, 8vw, 5rem)", fontWeight: 800,
    color: "#1a1a2e", letterSpacing: "-0.02em" }}>3 दिन बाद</span>
  <span style={{ fontSize: "1rem", color: "#64748b", marginTop: "8px" }}>
    (3 Days Later...)
  </span>
</motion.div>
```

**Phase D (progress 0.585 → 0.60): REVERSE — brushes retract back to corners**
All the paint strokes reverse back: width/height goes back to 0, same speed as entry. Use the same `useTransform` calls but with [0.585, 0.60] mapping back to ["50%", "0%"]. The center fill also fades back out.

---

## TRANSITION 2: 4-Corner Black Wipe (scrollProgress 0.82–0.87)

Four black triangular/rectangular wedges slide in from each corner simultaneously, then slide back out.

Use 4 divs with CSS `clip-path` triangles:
```tsx
// Top-left black wedge
const tlScale = useTransform(scrollYProgress, [0.82, 0.845, 0.87], [0, 1, 0]);

<motion.div style={{
  position: "absolute", top: 0, left: 0,
  width: "60%", height: "60%",
  background: "#0a0a0a",
  clipPath: "polygon(0 0, 100% 0, 0 100%)",
  scale: tlScale,
  transformOrigin: "top left",
  zIndex: 60
}} />
// Bottom-right
<motion.div style={{
  position: "absolute", bottom: 0, right: 0,
  width: "60%", height: "60%",
  background: "#0a0a0a",
  clipPath: "polygon(100% 0, 100% 100%, 0 100%)",
  scale: tlScale,  // same keyframes
  transformOrigin: "bottom right",
  zIndex: 60
}} />
// Top-right
<motion.div style={{
  position: "absolute", top: 0, right: 0,
  width: "60%", height: "60%",
  background: "#0a0a0a",
  clipPath: "polygon(100% 0, 100% 100%, 0 0)",
  scale: tlScale,
  transformOrigin: "top right",
  zIndex: 60
}} />
// Bottom-left
<motion.div style={{
  position: "absolute", bottom: 0, left: 0,
  width: "60%", height: "60%",
  background: "#0a0a0a",
  clipPath: "polygon(0 0, 100% 100%, 0 100%)",
  scale: tlScale,
  transformOrigin: "bottom left",
  zIndex: 60
}} />
```
At peak (0.845), all four wedges meet at center making screen appear black. Then they recede back to 0 by 0.87.

---

## Scene 3: Patient + Phone + SecondSight (scrollProgress 0.87–1.00)

### Layout
Split layout:
- Left 55%: Patient character on sofa + thought bubbles + animations
- Right 45%: Large phone mockup showing SecondSight Pro app

### Patient Thought Bubbles
Two thought bubbles (small circles → bigger circle → main bubble):
Use classic comic-book style. Animate them in at progress 0.89:

Bubble 1 (fades in first):
> "Dr. Mehta ki dawa se kuch farak nahi pada... 😕"

Bubble 2 (fades in 200ms after):
> "Dr. Sharma ne alag hi dawa di 🤔... Kaun sahi hai?"

Both styled with:
```css
background: white;
border: 2px solid #e2e8f0;
border-radius: 20px;
padding: 14px 18px;
font-size: 0.88rem;
color: var(--ink-700);
box-shadow: 0 4px 20px rgba(0,0,0,0.08);
position: absolute;
```
The 3 small circles leading to bubble are small divs (12px, 8px, 6px) with the same white fill.

### Phone Mockup (Right Side)
A large phone frame SVG/div (~260px × 520px):
```css
width: 260px;
height: 520px;
background: #1a1a2e;
border-radius: 40px;
border: 3px solid #334155;
box-shadow: 0 30px 80px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.05);
position: relative;
overflow: hidden;
```
Inside the phone: a small notch at top, a status bar strip.

The phone content changes in sub-stages:

**Sub-stage A (0.87–0.90): Phone shows Google search**
Display inside the phone screen a simplified Google-like interface:
- White search bar with Google logo (colored G)
- Patient is typing: animate text appearing character by character: "doctor conflict prescription india..."
- Below: 3 fake search result items (gray lines)
- Then one result highlights in teal: "SecondSight Pro — Reconcile conflicting..."

**Sub-stage B (0.90–0.94): SecondSight website appears on phone**
Screen transitions (cross-fade) to show the SecondSight Pro interface:
- Teal header bar with "SecondSight Pro" logo (small stethoscope + text)
- Main card: "Upload Your Prescriptions"
- Two upload slots visible

**Sub-stage C (0.94–0.97): Patient uploads 2 prescription images**
Animate two small "prescription card" thumbnails sliding up into the upload slots:
- Each card: white, slightly rotated, with "Rx" stamp in corner
- First card labeled "Dr. R. Mehta — Rx #1"  
- Second card labeled "Dr. P. Sharma — Rx #2"
- A progress bar fills after both are "uploaded": `0% → 100%` in 0.5s

**Sub-stage D (0.97–1.00): AI answer appears on phone**
The screen shows a scrollable result card inside the phone:
```
🔍 Conflict Score: 78/100
⚠️ Drug Interaction Detected
✅ ICMR 2023 Guideline Found
📋 Recommended Action Plan ready
```
Each line fades in sequentially.

A green "Analysis Complete" toast pops from the bottom of the phone.

---

## Scene 3 Conclusion CTA (scrollProgress ~0.97–1.00)

Below/outside the phone area, a large CTA fades in:

```tsx
<motion.div style={{ opacity: useTransform(scrollYProgress, [0.97, 1.0], [0, 1]) }}>
  <h3 style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 800, color: "var(--ink-900)" }}>
    Confused like Rajan? Get clarity in 60 seconds.
  </h3>
  <p style={{ color: "var(--ink-700)", fontSize: "1rem", marginBottom: "20px" }}>
    Upload both prescriptions. AI reconciles. No more guessing.
  </p>
  <Link to="/case/new" className="button primary neo-cta" style={{
    padding: "16px 36px", fontSize: "1.05rem", borderRadius: "999px",
    fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "10px"
  }}>
    <span>Analyze My Case Now</span>
    <ArrowRight size={18} />
  </Link>
</motion.div>
```

---

## Scroll Progress Indicator

Add a fixed thin progress bar at the top of the sticky viewport (only visible when this section is active):
```tsx
<motion.div style={{
  position: "absolute", top: 0, left: 0, right: 0, height: "3px",
  background: "linear-gradient(90deg, var(--teal), #2563eb)",
  scaleX: scrollYProgress, transformOrigin: "left",
  zIndex: 100
}} />
```

Also add a small "scene indicator" bottom-right (only visible while scrolling through this section):
```tsx
// Show current scene name, e.g. "Scene 1 — Dr. Mehta's Clinic"
```
Use `useTransform` to map scrollYProgress to a string index, then display in small text.

---

## Section Header (ABOVE the sticky scroll area)

Before the sticky container, add a section label visible when user first reaches this area:
```tsx
<div style={{ textAlign: "center", padding: "60px 20px 40px" }}>
  <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--teal)",
    textTransform: "uppercase", letterSpacing: "0.1em" }}>
    The Problem We Solve
  </span>
  <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 800,
    margin: "10px 0 0", color: "var(--ink-900)", letterSpacing: "-0.02em" }}>
    Rajan's Story — One Patient, Two Doctors, Zero Clarity
  </h2>
  <p style={{ color: "var(--ink-500)", fontSize: "1rem", marginTop: "12px",
    maxWidth: "600px", margin: "12px auto 0" }}>
    Scroll to follow what happens when you get conflicting prescriptions in India.
  </p>
  <div style={{ marginTop: "20px", display: "flex", alignItems: "center",
    justifyContent: "center", gap: "8px", color: "var(--ink-400)", fontSize: "0.85rem" }}>
    <ChevronDown size={16} style={{ animation: "bounce 1.5s ease infinite" }} />
    <span>Scroll to begin the story</span>
    <ChevronDown size={16} style={{ animation: "bounce 1.5s ease infinite 0.2s" }} />
  </div>
</div>
```

---

## Chat Content (exact text to use)

### Scene 1 — Dr. Mehta's Clinic

**Doctor bubble 1:**
"Aiye, bataiye kya takleef hai aapko? 🩺"

**Patient reply 1:** (with floating emojis: 🤒🌡️😓)
"Doctor sahab, 4 din se bukhaar hai, sir dard bhi bahut hai. Neend nahi aa rahi."

**Doctor 3 questions (Scene 1D) — voice note style bubbles:**
Q1: "Bukhar kitna rehta hai? 99 se upar? 🌡️"
Q2: "Koi aur dawa le rahe ho? Ya allergy hai kisi cheez se?"
Q3: "Khana kha pa rahe ho thoda?"

**Patient reply to all 3:**
"Haan, 101 tak chala jata hai. Koi dawa nahi le raha. Khana bahut kam kha raha hun, nausea hoti hai."

**Prescription line:** (on paper card)
"Rx: Paracetamol 500mg / Azithromycin 250mg / ORS Sachets / Rest 3 days"

---

### Scene 2 — Dr. Sharma's Clinic

**Patient bubble 1:**
"Doctor, 3 din pehle Dr. Mehta se mila tha. Unki dawa se kuch farak nahi aaya. Tabiyat abhi bhi kharab hai 😔"

**Doctor Sharma response:**
"Dekhta hun... Lagta hai Typhoid ke symptoms hain. Mehta ji ka prescription galat nahi tha, par incomplete tha. Main Cefixime add karta hun aur ek blood test bhi chahiye."

**Prescription line (Dr. Sharma):**
"Rx: Cefixime 200mg / Widal Test + CBC / ORS + Electrolyte powder"

---

### Scene 3 — Patient's Thoughts & Search

**Thought bubble 1:**
"Dr. Mehta ne Azithromycin di... Dr. Sharma ne Cefixime 😕 Dono alag bataa rahe hain... Kaun sahi hai?"

**Thought bubble 2:**
"Pata nahi kisi ki bhi dawa sun lun... Ya phir koi aur option dhundun 🤔"

**Google search text (animated typing):**
"conflicting doctor prescription india help"

**SecondSight result in Google:**
"SecondSight Pro — Reconcile conflicting medical opinions with AI • Free Analysis"

---

## Animation Details & Implementation Notes

1. **All `useTransform` calls** must be at the top of the component (React hooks rules). Calculate all transform values upfront, do NOT call `useTransform` inside render loops or conditional blocks.

2. **Framer Motion imports** needed:
```tsx
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef } from "react";
```

3. **For the chat bubbles**, use a helper: `const isVisible = (progress: number, start: number) => progress >= start`. But since this is scroll-driven (not time-based), use `useTransform` to map opacity:
```tsx
const bubble1Opacity = useTransform(scrollYProgress, [0.12, 0.15], [0, 1]);
```

4. **Bounce keyframe** for the chevrons in the header: add to App.css:
```css
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(6px); }
}
```
(Check if it already exists first — don't duplicate.)

5. **Mobile responsive**: 
   - Below 768px, the scene layout stacks vertically; chat bubbles get smaller (font-size: 0.82rem)
   - Phone mockup shrinks to 200×400px on mobile
   - SVG characters shrink proportionally

6. **Performance**: Use `will-change: transform` on the main sticky container. Add `transform: translateZ(0)` to the heavy animated elements.

7. **Reduced motion**: Wrap all animations in:
```tsx
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
// If true, skip transitions — just show final states
```

8. **TypeScript**: All props typed, no `any`. The component takes no props: `export const StoryHeroSection: React.FC = () => { ... }`

---

## File Modification — HomePage.tsx

Add after the Hero Section closes (around line 274, after `</section>` of `home-hero-section`) and BEFORE the MarqueeTicker section:

```tsx
import { StoryHeroSection } from "../components/StoryHeroSection";

// ... inside the motion.div return:

{/* ─── HERO SECTION (existing, unchanged) ─── */}
<section className="home-hero-section" ...>
  ...existing code...
</section>

{/* ─── STORY HERO: Patient Journey Cinematic ─── */}
<StoryHeroSection />

{/* ─── KINETIC MARQUEE TICKER (existing) ─── */}
<section style={{ margin: "32px 0 20px" }}>
  <MarqueeTicker />
</section>
```

The old hero section must remain **completely unchanged**.

---

## Quality Checklist Before Submitting

- [ ] Scroll progress from 0 to 1 drives ALL animations correctly (test by scrolling slowly)
- [ ] No React hooks violations (no conditional hook calls)
- [ ] All `useTransform` values are memoized / declared at top of component
- [ ] SVG characters render cleanly at all viewport sizes
- [ ] Chat bubbles appear in correct scroll order
- [ ] Transition 1 (brush paint) animates in fast and reverses cleanly
- [ ] Transition 2 (4-corner black wipe) animates in and out
- [ ] Phone mockup shows correct sub-stages
- [ ] CTA at end is visible and links to `/case/new`
- [ ] Component builds without TypeScript errors
- [ ] No layout shift — the sticky container does not affect page flow outside its wrapper
