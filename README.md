# SecondSight Pro 🩺🎤
**Winner's Choice for Healthcare AI Hackathons**

SecondSight Pro is a premium, voice-first medical assistant that uses AI to analyze and reconcile conflicting medical second opinions. It provides evidence-grounded guidance, helping patients understand complex medical advice through a simple, interactive UI.

![SecondSight Pro](frontend/public/vite.svg)

## 🚀 Key Features

1. **LLM Opinion Reconciliation Engine** 🧠
   - Parses multiple doctor prescriptions (via OCR/Vision).
   - Generates a "Conflict Score" between different medical opinions.
   - Highlights areas of agreement vs. disagreement (e.g. Surgery vs. Physiotherapy).

2. **Medical Voice Assistant (LiveKit WebRTC)** 🎙️
   - Real-time voice interaction with the AI.
   - Speak in Hindi/Hinglish/English.
   - Asks relevant follow-up questions to the user.

3. **RAG Evidence Grounding (pgvector)** 📚
   - Backed by real medical corpora (WHO Guidelines).
   - Dynamically searches Vector Databases to cite sources.
   - Renders "Confidence Scores" directly in the UI for medical safety.

4. **One-Click WhatsApp Share** 📱
   - Doctors can instantly share the "Executive Summary" directly to a patient's WhatsApp.
   - Generates a beautifully formatted text report with Conflict Scores, Summaries, and actionable questions.
   - Zero-friction communication without requiring backend API setups.

5. **Premium "Glassmorphism" UI** ✨
   - State-of-the-art React frontend with staggered Framer Motion micro-animations.
   - Built to impress judges instantly with sleek dashboard views, smooth page transitions, and PDF exports.

## 🛠 Tech Stack
- **Frontend**: React (Vite), TypeScript, Framer Motion, Axios, CSS Modules
- **Backend**: Node.js, Express, TypeScript, LangChain
- **AI/ML**: OpenAI (GPT-4o), Sarvam AI (Indic TTS/STT)
- **Real-time Voice**: LiveKit Components
- **Database**: Supabase (PostgreSQL + pgvector + Auth)

## 📦 Setup Instructions

1. **Clone & Install**
   ```bash
   git clone https://github.com/Niss54/Second-sight-pro.git
   cd Second-sight-pro
   npm run install-all
   ```

2. **Environment Setup**
   Ensure your `.env` variables in `backend/.env` are set:
   ```env
   OPENAI_API_KEY=your_key
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_key
   LIVEKIT_API_KEY=your_key
   LIVEKIT_API_SECRET=your_secret
   ```

3. **Run the App**
   ```bash
   # Run both frontend and backend concurrently
   npm run dev
   ```

## 🏆 Hackathon Winning Edge
What makes SecondSight Pro stand out? 
Instead of being a generic "AI Chatbot", it specifically tackles the **Second Opinion Paradox** (when two doctors give opposing advice). By offering a Voice-First UI and strictly citing WHO guidelines via RAG, it addresses both **Accessibility** (Indic languages) and **Medical Hallucinations** (RAG + Safety Disclaimers).
