# AI-Based Resume Analyzer - Recruiter Portal 🚀

A premium, recruiter-grade SaaS full-stack web application designed for high-fidelity resume parsing, ATS scoring, Jaccard-keyword alignments, and conversational AI career advising.

## ✨ Core Highlights & Technical Architecture

1. **Hybrid Database Resilience**: Connects to MongoDB out of the box. If no connection URI is supplied or if MongoDB is offline, it dynamically registers a local JSON file database (`local_db.json`). This ensures zero-setup immediate evaluation, while remaining 100% production-ready for MongoDB.
2. **Dual AI/NLP Orchestrator**: Supports Google Gemini (`gemini-1.5-flash`) and OpenAI API keys. If API keys are omitted in `.env`, the server automatically falls back to a custom, high-fidelity offline heuristic NLP parser that scans regex dictionaries and scores formatting, skills, projects, and keywords.
3. **Vanilla CSS Glassmorphism**: Designed with modern CSS variables, soft neon HSL glow states, glassmorphic cards, smooth springy hover responses, and an Obsidian Dark Mode default with a togglable Light Theme.
4. **Chatbot Career Advisor**: Built-in career coaching chatbot. Candidates or recruiters can ask context-aware questions about resume upgrades, action verbs, project optimizations, and formatting resolutions.

---

## 📂 System Structure

```text
aiTools/
├── backend/
│   ├── config/          # db connection & AI clients setup
│   ├── controllers/     # auth, resume analysis & chat controllers
│   ├── middleware/      # jwt verification & multer upload middlewares
│   ├── models/          # hybrid mongoose schema & local JSON fallbacks
│   ├── routes/          # backend routing paths
│   └── utils/           # pdf-parse, mammoth docx, local NLP & AI parsers
└── frontend/
    ├── public/
    └── src/
        ├── components/  # sidebar, radial gauges, chat coach, dragzone
        ├── context/     # global Theme & Auth providers
        ├── pages/       # stunning dashboards & signup grids
        └── styles/      # obsidian variables, global resets & widgets
```

---

## ⚡ Setup & Run Guidelines

### Prerequisites
- **Node.js** (v18.x or modern LTS recommended)
- **NPM** (v10.x or modern standard)
- **MongoDB** (Optional - fallbacks to local file database automatically)

### 1. Bootstrapping the Backend
1. Open a terminal and navigate to the `backend/` directory:
   ```bash
   cd backend
   ```
2. Setup your local configuration file:
   ```bash
   cp .env.example .env
   ```
   *(Optional: Enter your `GEMINI_API_KEY` or `OPENAI_API_KEY` to unlock premium LLM features).*
3. Install dependencies and start:
   ```bash
   npm install
   npm run dev
   ```
   *The backend will boot on http://localhost:5000.*

### 2. Bootstrapping the Frontend
1. Open a new terminal and navigate to the `frontend/` directory:
   ```bash
   cd frontend
   ```
2. Install packages and start the Vite server:
   ```bash
   npm install
   npm run dev
   ```
   *Vite will boot the premium recruiter panel on http://localhost:3000.*

---

## 🧩 Environment Variables Config (`backend/.env`)

```ini
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ai_resume_analyzer
JWT_SECRET=your_jwt_signing_key

# Active these to swap the local NLP heuristics with premium LLM audits:
GEMINI_API_KEY=
OPENAI_API_KEY=
```

---

## 🚀 Key Features Walkthrough

1. **Dashboard Overview**: View general statistics, historical line graphs representing score variances, and click-to-load recent submissions.
2. **Resume Upload**: Paste a target Job Description and drag and drop a PDF/DOCX file. Watch real-time structural processing animations.
3. **Score Breakdown**: Isolate granular metrics measuring ATS compliance, grammar, experience metrics, and design.
4. **Keyword Match**: Inspect what terms successfully aligned with the job description and what key skills are missing.
5. **Suggestions Feed**: Swap weak phrasing with quantitative achievement wording and look over recommended action verbs.
6. **Career Advisor Coach**: Open the float-in coaching panel in the bottom-right and ask: *"How can I improve my technical projects segment?"*
7. **Visual Settings**: Swap visual skins between Obsidian Dark and Paper Light, enter a custom Gemini key dynamically, and query server diagnostics.
