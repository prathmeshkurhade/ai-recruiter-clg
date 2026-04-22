<div align="center">
  <img src="https://img.shields.io/badge/Status-Beta-purple" alt="Beta">
  <img src="https://img.shields.io/badge/Python-3.10+-blue" alt="Python">
  <img src="https://img.shields.io/badge/React-18-cyan" alt="React">
  <img src="https://img.shields.io/badge/Database-PostgreSQL-blue" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/LLM-Groq%20Llama%203.3%2070B-orange" alt="Groq">
  <h1>HireForge AI : The Ethical Kinetic OS</h1>
  <p>An AI-powered recruitment platform that combines semantic vector matching with LLM-based reasoning to rank candidates the way a human recruiter would — understanding proficiency levels, not just keyword hits.</p>
</div>

---

## 🎯 The Problem We Solve

Traditional Applicant Tracking Systems (ATS) rely on keyword matching. They can tell if a resume mentions "competitive programming" but cannot tell whether a candidate is a *beginner* or a *Codeforces Grandmaster*. This causes real recruiters to miss strong candidates and over-rank weak ones.

**Example of the failure mode:**
- Candidate A: "Solved 300+ DSA problems, 2-Star CodeChef"
- Candidate B: "Solved 1000+ problems, 3-Star CodeChef (1636), Codeforces Specialist (1563)"

A keyword/embedding model sees both as "competitive programmers" and often ranks them incorrectly. **HireForge AI fixes this** by adding an LLM reasoning layer on top of embeddings.

---

## 🧠 The Hybrid Ranking Architecture (Two-Stage Pipeline)

We combine the **speed of embeddings** with the **reasoning of LLMs** in a two-stage flow:

```
┌──────────────────────────────────────────────────────────────┐
│   STAGE 0: INGESTION                                         │
│   Recruiter uploads JD + candidate PDFs                      │
│   → pdfplumber extracts raw text                             │
│   → NLP processor extracts skills (variant-aware)            │
└────────────────────────────┬─────────────────────────────────┘
                             ▼
┌──────────────────────────────────────────────────────────────┐
│   STAGE 1: FAST SEMANTIC FILTER  (local, free, ~1 sec)       │
│   • all-MiniLM-L6-v2 → 384-dim embedding per resume + JD     │
│   • cosine similarity (rescaled 0.20-0.65 → 0-1)             │
│   • keyword skill-match ratio (canonical + substring + regex)│
│   • combined = 0.6 * semantic + 0.4 * skill_ratio            │
│   • √ curve to spread scores into intuitive range            │
│   • keep TOP 10 candidates for Stage 2                       │
└────────────────────────────┬─────────────────────────────────┘
                             ▼
┌──────────────────────────────────────────────────────────────┐
│   STAGE 2: LLM RE-RANK  (Groq Llama 3.3 70B, ~1 sec)         │
│   • ONE batched API call with JD + all 10 shortlisted resumes│
│   • Prompt asks: score 0-100 + one-line reason per candidate │
│   • LLM reasons about:                                       │
│       - Codeforces rating (Specialist > Newbie)              │
│       - CodeChef stars (3★ > 2★)                             │
│       - Problems solved (1000+ > 300+)                       │
│       - Project depth, internship quality, stack relevance   │
│   • Returns strict JSON → parsed and normalized to 0-1 scale │
└────────────────────────────┬─────────────────────────────────┘
                             ▼
┌──────────────────────────────────────────────────────────────┐
│   STAGE 3: SCORE FUSION                                      │
│   final_score = 0.9 * llm_score + 0.1 * embedding_score      │
│   • LLM drives the ranking (human-like judgment)             │
│   • Embedding kept as a safety-net signal + fallback         │
│   • llm_reason stored alongside score for explainability     │
└────────────────────────────┬─────────────────────────────────┘
                             ▼
┌──────────────────────────────────────────────────────────────┐
│   STAGE 4: ETHICAL LAYER                                     │
│   • If identity_masking ON → scrub name/email/phone          │
│   • Unmask automatically when candidate is Fast-Tracked      │
│   • All actions logged in Synaptic Audit Log                 │
└──────────────────────────────────────────────────────────────┘
```

**Graceful degradation:** If the Groq API is down or quota is hit, Stage 2 is skipped silently and the system falls back to embedding-only ranking — the app never breaks.

---

## ⚡ Core Engineering Features

### 1. Hybrid Semantic + LLM Matching Engine
Stage 1 uses `all-MiniLM-L6-v2` (384-dim) + `cosine_similarity` to cheaply score every resume locally. Stage 2 sends only the top 10 to **Groq Llama 3.3 70B** in a single batched prompt for reasoning-based re-ranking. Final score blends both (90% LLM / 10% embedding) so the LLM's judgment drives the ranking while embeddings act as a fallback.

The LLM prompt includes an **explicit proficiency hierarchy** (Codeforces Grandmaster > Master > Expert > Specialist > Pupil > Newbie; CodeChef 7★ > 6★ > ... > 1★; Leetcode Guardian > Knight) and explicitly instructs the model to **ignore resume framing** and scan the entire document — so a candidate who buries their CP achievements at the bottom still ranks correctly.

### 2. Explainable AI — LLM Reasoning Surface
Every ranked candidate comes with a human-readable `llm_reason` field ("Strongest CP profile: Codeforces Specialist 1563 + 1000+ problems solved"). Recruiters can see *why* the system ranked each candidate — no black-box scoring.

### 3. Zero-Bias Identity Scrubber (Ethical AI Layer)
When `identity_masking` is toggled, names become `CANDIDATE_VECTOR_8241`, emails/phones are redacted via regex + NLP passes, and gender pronouns get replaced with neutral tokens — **before Redux state ingestion**. This happens as a response-interception middleware so the frontend never even caches real identities.

### 4. The Holographic Neural Dossier
A sliding, Framer-Motion-powered dynamic component (`CandidateDossier.jsx`) for one-click routing between decision nodes: `AWAITING_REVIEW` → `ENGAGE_FAST_TRACK` → `REJECTED`. Fast-tracking a candidate automatically unmasks their identity and triggers an async `PATCH` to NeonDB.

### 5. Chaos Parsing Pipeline
`pdfplumber` ingestion layer handles nested, unstructured PDFs and maps chaotic text into clean JSON schemas ready for embedding and LLM consumption.

### 6. Synaptic Audit Log
Every ranking run, candidate state change, and masking toggle emits an `AuditLog` row so actions are traceable — important for compliance.

---

## 🧩 Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | FastAPI, SQLAlchemy, Alembic, Pydantic |
| Auth | JWT (python-jose), bcrypt |
| Database | NeonDB (PostgreSQL), JSON columns for embeddings + skill_matches |
| NLP / Embeddings | sentence-transformers (`all-MiniLM-L6-v2`), scikit-learn (cosine) |
| LLM Re-ranker | **Groq API — Llama 3.3 70B Versatile** (14,400 req/day free tier) |
| Document Parsing | pdfplumber, python-docx |
| Frontend | Vite, React 18, TailwindCSS, Framer Motion, Lucide React |

---

## 🗂 Project Structure

```
mpnew/
├── backend/
│   ├── app/
│   │   ├── main.py                  # FastAPI entry
│   │   ├── config.py                # Pydantic settings (loads .env)
│   │   ├── database.py              # SQLAlchemy session
│   │   ├── models/                  # User, Job, Resume, MatchResult, AuditLog, Settings
│   │   ├── schemas/                 # Pydantic request/response schemas
│   │   ├── routers/
│   │   │   ├── auth.py              # Register / login / JWT
│   │   │   ├── jobs.py              # JD CRUD + embedding on create
│   │   │   ├── resumes.py           # Upload + parse + embed
│   │   │   ├── matching.py          # POST /run → two-stage ranking
│   │   │   └── settings.py          # identity_masking toggle
│   │   ├── services/
│   │   │   ├── resume_parser.py     # pdfplumber + regex extraction
│   │   │   ├── nlp_processor.py     # Skill canonicalization
│   │   │   ├── embedding_service.py # MiniLM wrapper + preprocessing
│   │   │   ├── matching_service.py  # Stage 1 + Stage 2 orchestration
│   │   │   └── llm_ranker.py        # Groq batched re-ranker (NEW)
│   │   └── utils/
│   │       ├── dependencies.py      # get_current_user
│   │       └── masking.py           # Identity scrub
│   ├── alembic/versions/            # DB migrations
│   ├── requirements.txt
│   └── .env                         # DB url, JWT key, GROQ_API_KEY
├── frontend/
│   └── src/
│       ├── components/
│       │   └── CandidateDossier.jsx # Holographic dossier UI
│       └── pages/                   # Dashboard, Job view, Results
└── README.md
```

---

## 🔑 Key API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/register` | Create recruiter account |
| POST | `/api/auth/login` | Issue JWT |
| POST | `/api/jobs/` | Create JD (auto-generates embedding) |
| POST | `/api/resumes/upload/{job_id}` | Upload PDF → parse → embed |
| **POST** | **`/api/matching/{job_id}/run`** | **Trigger two-stage ranking (Stage 1 + Stage 2 LLM)** |
| GET | `/api/matching/{job_id}/results` | Fetch ranked list with `llm_score` + `llm_reason` |
| PATCH | `/api/resumes/{id}/decision` | Move candidate node (Fast-Track / Reject) |
| PATCH | `/api/settings/` | Toggle identity masking |

---

## 🗄 Database Schema (Key Tables)

**`match_results`** (stores ranking outcomes):
```
id, job_id, resume_id, similarity_score (final fused score),
skill_matches (JSON), llm_score (Float, NEW), llm_reason (Text, NEW),
created_at
```

**`resumes`**: `raw_text`, `parsed_data`, `embedding` (JSON 384-dim), `decision_node`
**`job_descriptions`**: `description`, `required_skills` (JSON), `embedding`
**`audit_logs`**: `recruiter_id`, `action`, `entity_ref`, `status`, `timestamp`

---

## ⚙️ Installation & Setup

### 1. Clone & enter the repo
```bash
git clone https://github.com/prathmeshkurhade/ai-recruiter-clg
cd mpnew
```

### 2. Backend
```bash
cd backend
python -m venv venv
# Windows: venv\Scripts\activate
# Mac/Linux: source venv/bin/activate
pip install -r requirements.txt
```

Create `backend/.env`:
```env
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
JWT_SECRET_KEY=your-secret-key
GROQ_API_KEY=gsk_your_groq_key_here
GROQ_MODEL=llama-3.3-70b-versatile
LLM_RERANK_TOP_N=10
LLM_WEIGHT=0.9
EMBEDDING_WEIGHT=0.1
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

Get a free Groq API key at [console.groq.com/keys](https://console.groq.com/keys) (no credit card required).

Run migrations + start server:
```bash
alembic upgrade head
uvicorn app.main:app --reload --port 8000
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173`.

---

## 🎤 Presentation Talking Points

**Opening hook (30 sec):**
> "Traditional ATS can tell if a resume mentions 'competitive programming' but not whether the candidate solved 10 problems or 10,000. We built a system that reasons about candidates the way a human recruiter would — combining vector embeddings for speed with an LLM for judgment."

**Why the hybrid matters (from real test data):**

| Candidate | CP Credentials | Embedding-only rank | Hybrid (LLM) rank |
|-----------|----------------|---------------------|-------------------|
| Prathmesh | Specialist(1563), 3★(1636), 1000+ problems | #2 ❌ | #1 ✅ |
| Aditya | Specialist(1448), 3★(1730), Knight(1861), Codemania finalist | #3 ❌ | #2 ✅ |
| Atharv | 2★ CodeChef, 300+ problems | #1 ❌ | #3 ✅ |

The embedding model ranked the weakest CP candidate first because his *resume was framed around CP keywords*, while stronger candidates buried their achievements at the bottom. The LLM fixed it by reasoning about raw credentials.

**Live demo flow:**
1. Show the JD: *"we want competitive programmer"*
2. Upload two resumes: one strong CP profile (Specialist, 1000+ problems), one weaker (2-Star, 300+)
3. Click **"Generate Neural Map"**
4. Show that the stronger candidate ranks higher
5. Expand the `llm_reason` — the model *explains* why
6. Toggle **identity masking** → names become `CANDIDATE_VECTOR_*`
7. Fast-Track a candidate → identity auto-unmasks

**Technical highlights to mention:**
- Two-stage pipeline: embeddings filter → LLM re-ranks
- Batched LLM call (all candidates in ONE prompt) keeps API usage at 1 call per ranking
- Graceful fallback — if LLM fails, embedding-only ranking still works
- Free tier sustainable: Groq = 14,400 req/day (≈14,400 job rankings/day)
- Ethical AI layer intercepts at the response level, not client-side

**If asked "why not OpenAI / Gemini":**
- Groq Llama 3.3 70B is open-weight, fast (~500ms), and has a genuinely usable free tier
- Architecture is provider-agnostic — swapping to Claude / GPT-4 is a 20-line change in `llm_ranker.py`

---

## 🔒 License

MIT License. Built as an advanced AI architecture portfolio project.
