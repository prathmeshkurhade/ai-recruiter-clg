# AI-Powered Resume Screening & Job Matching System

An intelligent recruitment tool that uses **NLP and transformer-based semantic embeddings** to automatically parse, match, and rank candidate resumes against job descriptions — replacing manual keyword-based filtering with AI-powered semantic understanding.

## How It Works

1. **Recruiter creates a job description** → system generates a semantic embedding (384-dim vector) using MiniLM
2. **Recruiter uploads resumes (PDF/DOCX)** → system parses text, extracts skills/email/phone, generates embeddings
3. **Recruiter clicks "Run Matching"** → system computes cosine similarity between JD and each resume, ranks candidates, shows matched/missing skills

The AI model (`all-MiniLM-L6-v2`) runs **locally** — no API keys needed, no external AI service calls.

> For detailed technical documentation (how embeddings work, cosine similarity math, architecture deep-dive), see [`PROJECT_DOCUMENTATION.md`](./PROJECT_DOCUMENTATION.md)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js (Vite) |
| Backend | FastAPI (Python) |
| Database | PostgreSQL (Neon - serverless) |
| ML Model | Sentence-Transformers (`all-MiniLM-L6-v2`) — runs locally |
| Similarity | scikit-learn (cosine similarity) |
| Resume Parsing | pdfplumber (PDF), python-docx (DOCX) |
| Auth | JWT + bcrypt |

## Prerequisites

- **Python 3.10+**
- **Node.js 18+**
- **PostgreSQL database** (we use [Neon](https://neon.tech) — free serverless Postgres)

## Setup & Run

### 1. Clone the repo

```bash
git clone https://github.com/your-username/ai-resume-screener.git
cd ai-resume-screener
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate it
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux

# Install dependencies
pip install -r requirements.txt
```

### 3. Database Setup

1. Go to [neon.tech](https://neon.tech) and create a free project
2. Copy the connection string from the Neon dashboard
3. Create your `.env` file:

```bash
cp .env.example .env
```

4. Paste your Neon connection string and set a JWT secret in `.env`:

```env
DATABASE_URL=postgresql://user:password@ep-your-project.region.aws.neon.tech/dbname?sslmode=require
JWT_SECRET_KEY=any-random-string-here
```

5. Run database migrations:

```bash
alembic revision --autogenerate -m "initial"
alembic upgrade head
```

### 4. Start the Backend

```bash
uvicorn app.main:app --reload
```

Backend runs at **http://localhost:8000**
API docs at **http://localhost:8000/docs**

> **Note:** The first time you upload resumes or create a job, the MiniLM model (~80 MB) will download automatically. This is a one-time download — it gets cached locally.

### 5. Frontend Setup (new terminal)

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

Frontend runs at **http://localhost:5173**

## Usage

1. **Sign up** — create a recruiter account
2. **Create a Job Description** — add title, description, required skills (comma-separated), experience level
3. **Upload Resumes** — go to the job detail page, upload PDF/DOCX files (supports bulk upload)
4. **Run Matching** — click "Run Matching" to see ranked candidates with similarity scores and skill breakdowns

## Project Structure

```
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI entry point + CORS
│   │   ├── config.py            # Settings (DB URL, JWT, model name)
│   │   ├── database.py          # SQLAlchemy engine + session
│   │   ├── models/              # ORM models (User, Job, Resume, MatchResult)
│   │   ├── schemas/             # Pydantic request/response schemas
│   │   ├── routers/
│   │   │   ├── auth.py          # Signup/Login (JWT)
│   │   │   ├── jobs.py          # Job description CRUD
│   │   │   ├── resumes.py       # Resume upload + auto-parsing
│   │   │   └── matching.py      # Run matching + get ranked results
│   │   ├── services/
│   │   │   ├── auth_service.py       # Password hashing + JWT
│   │   │   ├── resume_parser.py      # PDF/DOCX text extraction
│   │   │   ├── nlp_processor.py      # Skill extraction (100+ skills with variants)
│   │   │   ├── embedding_service.py  # MiniLM embedding generation
│   │   │   └── matching_service.py   # Cosine similarity + skill matching
│   │   └── utils/
│   │       └── dependencies.py  # Auth middleware
│   ├── requirements.txt
│   ├── alembic.ini
│   └── .env.example
├── frontend/
│   └── src/
│       ├── pages/               # Login, Dashboard, JobForm, JobDetail
│       ├── services/api.js      # Axios client with auth interceptor
│       └── context/             # Auth state management
├── PROJECT_DOCUMENTATION.md     # Detailed AI/ML documentation
└── README.md
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Create account |
| POST | `/api/auth/login` | Login (returns JWT) |
| POST | `/api/jobs/` | Create job description |
| GET | `/api/jobs/` | List your jobs |
| GET | `/api/jobs/{id}` | Get job details |
| PUT | `/api/jobs/{id}` | Update job |
| DELETE | `/api/jobs/{id}` | Delete job |
| POST | `/api/resumes/{job_id}/upload` | Upload resumes (PDF/DOCX) |
| GET | `/api/resumes/{job_id}` | List resumes for a job |
| POST | `/api/matching/{job_id}/run` | Run AI matching |
| GET | `/api/matching/{job_id}/results` | Get ranked results |

## Team

- Harshal Kale (Roll: 35124)
- Prathmesh Kurhade (Roll: 35135)
- Atharv Lalage (Roll: 35136)

**Guide:** Ms. S. C. Nahatkar
**Academic Year:** 2025-26, Semester II, Batch L13
