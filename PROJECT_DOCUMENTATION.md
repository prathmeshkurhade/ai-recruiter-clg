# AI-Powered Resume Screening & Job Matching System — Technical Documentation

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [System Architecture](#2-system-architecture)
3. [The AI/ML Pipeline — How It Actually Works](#3-the-aiml-pipeline--how-it-actually-works)
4. [Step-by-Step Data Flow](#4-step-by-step-data-flow)
5. [Code Walkthrough](#5-code-walkthrough)
6. [Tech Stack Explained](#6-tech-stack-explained)
7. [API Endpoints](#7-api-endpoints)
8. [Database Schema](#8-database-schema)
9. [Frontend Structure](#9-frontend-structure)
10. [Limitations & Future Scope](#10-limitations--future-scope)

---

## 1. Project Overview

This system replaces manual resume screening with an AI-powered pipeline. A recruiter creates a job description, uploads candidate resumes (PDF/DOCX), and the system automatically:

- Parses resumes into raw text
- Extracts structured info (email, phone, skills)
- Converts both the job description and resumes into numerical vectors (embeddings) using a transformer model
- Computes how similar each resume is to the job description
- Ranks candidates by relevance and shows which skills matched or are missing

The key innovation over traditional ATS (Applicant Tracking Systems) is **semantic matching** — the system understands meaning, not just keywords. A resume mentioning "React.js development" will match a JD asking for "frontend engineering" even though the exact words differ.

---

## 2. System Architecture

```
[React Frontend — Recruiter Dashboard]
        |
        | HTTP requests (REST API)
        v
[FastAPI Backend]
        |
        |--- Auth Service (JWT login/signup)
        |--- Resume Parser (pdfplumber / python-docx)
        |--- NLP Processor (skill extraction, text cleaning)
        |--- Embedding Service (Sentence-Transformers / MiniLM)
        |--- Matching Service (Cosine Similarity + Skill Matching)
        |
        v
[PostgreSQL Database — Neon (serverless)]
        |
        |--- users (recruiter accounts)
        |--- job_descriptions (JDs + their embeddings)
        |--- resumes (parsed text + extracted data + embeddings)
        |--- match_results (similarity scores + skill breakdowns)
```

Everything runs in a single Python process. There's no separate ML microservice — the AI model loads directly inside the FastAPI app.

---

## 3. The AI/ML Pipeline — How It Actually Works

This is the core of the project. Let's break down every concept.

### 3.1 What Are Embeddings?

An **embedding** is a list of numbers (a vector) that represents the *meaning* of a piece of text. The model we use (`all-MiniLM-L6-v2`) converts any text into a vector of **384 floating-point numbers**.

Example:
```
Input:  "3 years experience in Python and machine learning"
Output: [0.0234, -0.0891, 0.1456, ..., 0.0312]  (384 numbers)
```

**Why 384 numbers?** That's the dimensionality the MiniLM model was trained with. Each number captures some aspect of meaning — one dimension might loosely represent "technical skill level," another "experience duration," etc. The exact meaning of each dimension isn't human-interpretable, but the model learns these during training.

**Key property:** Texts with similar meanings produce vectors that are close together in 384-dimensional space. Texts with different meanings produce vectors that are far apart.

```
"Python developer with ML experience"    → [0.12, -0.05, 0.33, ...]
"Machine learning engineer using Python"  → [0.11, -0.04, 0.31, ...]  ← very similar!
"Professional chef with 10 years"         → [-0.42, 0.18, -0.09, ...] ← very different!
```

### 3.2 The Model: all-MiniLM-L6-v2

| Property | Value |
|----------|-------|
| **Full name** | all-MiniLM-L6-v2 |
| **Type** | Transformer (BERT-family) |
| **Architecture** | 6-layer MiniLM (distilled from larger models) |
| **Output dimension** | 384 |
| **Max input tokens** | 256 tokens (~200 words) |
| **Size** | ~80 MB |
| **Speed** | ~14,000 sentences/sec on GPU, ~100/sec on CPU |
| **Training data** | 1 billion+ sentence pairs from the internet |
| **Runs locally** | Yes — no API calls, no API key needed |
| **Cost** | Free and open source |

**How was it trained?**

The model was trained using **contrastive learning** on massive datasets of sentence pairs. During training:

1. It sees pairs of sentences that mean the same thing (positive pairs) and pairs that don't (negative pairs)
2. It learns to push similar sentences' vectors closer together and dissimilar ones farther apart
3. After billions of examples, it develops a general understanding of semantic similarity

**Why MiniLM and not full BERT or GPT?**

- Full BERT: 110M parameters, slower, not optimized for sentence similarity
- GPT-3/4: Requires API calls, costs money, overkill for this task
- MiniLM: 22M parameters, specifically trained for sentence similarity, runs fast on CPU, free

### 3.3 Cosine Similarity — How We Compare Vectors

Once we have embedding vectors for the JD and each resume, we need to measure how similar they are. We use **cosine similarity**.

**The formula:**

```
                    A · B           Σ(Ai × Bi)
cos(θ) = ——————————————————— = ————————————————————
              ||A|| × ||B||     √Σ(Ai²) × √Σ(Bi²)
```

Where:
- `A` = job description embedding (384 numbers)
- `B` = resume embedding (384 numbers)
- `A · B` = dot product (multiply corresponding numbers and sum them)
- `||A||` = magnitude of A (square root of sum of squares)

**What the score means:**

| Score | Interpretation |
|-------|---------------|
| 1.0 | Identical meaning (perfect match) |
| 0.7 - 0.9 | Strong semantic match |
| 0.4 - 0.7 | Moderate match — some relevant overlap |
| 0.1 - 0.4 | Weak match — mostly unrelated |
| 0.0 | Completely unrelated |
| -1.0 | Opposite meaning (rare in practice) |

**Why cosine similarity instead of Euclidean distance?**

Cosine similarity measures the *angle* between vectors, not the *distance*. This means it focuses on the direction (meaning) regardless of magnitude (text length). A short resume and a long resume about the same topic will have similar cosine scores, even though their Euclidean distance might be large.

**Concrete example in our code:**

```python
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

job_vec = np.array(job_embedding).reshape(1, -1)      # shape: (1, 384)
resume_vec = np.array(resume_embedding).reshape(1, -1) # shape: (1, 384)
score = cosine_similarity(job_vec, resume_vec)[0][0]    # single float: 0.0 to 1.0
```

### 3.4 Skill Matching — The Explainability Layer

Cosine similarity gives a single number, but recruiters want to know *why* a candidate ranked high or low. That's where skill matching comes in.

The system maintains a list of ~40 common tech skills. For each resume:

1. Scan the resume text for known skills (keyword matching)
2. Compare found skills against the JD's required skills
3. Produce a breakdown: which skills matched, which are missing, and a match ratio

```python
# Example output for a resume:
{
    "matched": ["python", "react", "sql"],
    "missing": ["kubernetes", "aws"],
    "match_ratio": 0.6  # 3 out of 5 required skills found
}
```

This is simpler than the embedding-based matching but provides clear, human-readable explanations.

### 3.5 Why Both Embeddings AND Skill Matching?

| Approach | Strengths | Weaknesses |
|----------|-----------|------------|
| **Embeddings (cosine similarity)** | Understands synonyms, context, related concepts | Black-box — hard to explain the score |
| **Skill matching (keyword)** | Clear, explainable, actionable | Misses synonyms, can't understand context |

By combining both, we get the best of both worlds:
- **Ranking** is driven by semantic similarity (the smart part)
- **Explanation** is driven by skill matching (the transparent part)

---

## 4. Step-by-Step Data Flow

### Flow 1: Recruiter Creates a Job Description

```
Recruiter fills form (title, description, skills, experience level)
    ↓
POST /api/jobs → jobs router
    ↓
Job saved to DB with all fields
    ↓
Job description text → MiniLM model → 384-dim embedding vector
    ↓
Embedding stored in job_descriptions.embedding column (as JSON array)
```

**File:** `backend/app/routers/jobs.py` (create_job function)

### Flow 2: Recruiter Uploads Resumes

```
Recruiter selects PDF/DOCX files → uploads to frontend
    ↓
POST /api/resumes/{job_id}/upload → resumes router
    ↓
For each file:
    ↓
    1. Save file to backend/uploads/{job_id}/
    ↓
    2. Parse PDF/DOCX → extract raw text
       (pdfplumber for PDF, python-docx for DOCX)
    ↓
    3. Extract structured data from text:
       - Email (regex: user@domain.com pattern)
       - Phone (regex: 10-15 digit patterns)
       - Skills (keyword matching against known skills list)
    ↓
    4. Raw text → MiniLM model → 384-dim embedding vector
    ↓
    5. Save to DB: file_name, file_path, raw_text, parsed_data (JSON), embedding (JSON)
```

**Files:**
- `backend/app/routers/resumes.py` (upload_resumes function)
- `backend/app/services/resume_parser.py` (PDF/DOCX parsing)
- `backend/app/services/nlp_processor.py` (skill extraction)
- `backend/app/services/embedding_service.py` (embedding generation)

### Flow 3: Recruiter Runs Matching

```
Recruiter clicks "Run Matching" button
    ↓
POST /api/matching/{job_id}/run → matching router
    ↓
Load JD embedding from DB (384 floats)
Load all resume embeddings for this job from DB
    ↓
For each resume:
    ↓
    1. Cosine similarity: compare JD embedding vs resume embedding → score (0.0 to 1.0)
    ↓
    2. Skill matching: compare JD required_skills vs skills found in resume text
       → { matched: [...], missing: [...], match_ratio: 0.X }
    ↓
Sort all resumes by similarity_score descending
    ↓
Save results to match_results table
    ↓
Return ranked list to frontend:
[
  { rank: 1, resume_id: 5, score: 0.82, matched: ["python","react"], missing: ["aws"] },
  { rank: 2, resume_id: 3, score: 0.71, matched: ["python"], missing: ["react","aws"] },
  ...
]
```

**Files:**
- `backend/app/routers/matching.py` (run_matching function)
- `backend/app/services/matching_service.py` (rank_candidates, compute_similarity, compute_skill_match)

---

## 5. Code Walkthrough

### 5.1 Resume Parsing (`backend/app/services/resume_parser.py`)

**PDF parsing** uses `pdfplumber` — it opens the PDF, iterates through each page, and extracts text. Unlike simple PDF readers, pdfplumber handles multi-column layouts and tables reasonably well.

**DOCX parsing** uses `python-docx` — it reads the XML structure of .docx files and extracts paragraph text.

**Info extraction** uses regex patterns:
- Email: `[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}`
- Phone: `[\+]?[\d\s\-\(\)]{10,15}`

### 5.2 Embedding Service (`backend/app/services/embedding_service.py`)

```python
from sentence_transformers import SentenceTransformer

_model = None  # Global variable — model loads only once

def get_model():
    global _model
    if _model is None:
        _model = SentenceTransformer("all-MiniLM-L6-v2")  # ~80MB download first time
    return _model

def generate_embedding(text: str) -> list[float]:
    model = get_model()
    embedding = model.encode(text)      # numpy array of 384 floats
    return embedding.tolist()           # convert to plain Python list for JSON storage
```

**Lazy loading:** The model is loaded into memory only when the first embedding is requested. After that, it stays in memory for all subsequent requests. This avoids a 5-10 second startup delay.

**What `model.encode(text)` does internally:**
1. Tokenizes the text (splits into subword tokens using WordPiece tokenizer)
2. Passes tokens through 6 transformer layers (self-attention + feed-forward)
3. Takes the output of all tokens and applies mean pooling (averages them)
4. Returns the 384-dimensional vector

### 5.3 Matching Service (`backend/app/services/matching_service.py`)

```python
from sklearn.metrics.pairwise import cosine_similarity

def compute_similarity(job_embedding, resume_embedding):
    # Reshape to 2D arrays (required by sklearn)
    job_vec = np.array(job_embedding).reshape(1, -1)
    resume_vec = np.array(resume_embedding).reshape(1, -1)
    score = cosine_similarity(job_vec, resume_vec)[0][0]
    return float(score)

def rank_candidates(job_embedding, job_skills, resumes):
    results = []
    for resume in resumes:
        sim_score = compute_similarity(job_embedding, resume["embedding"])
        skill_match = compute_skill_match(job_skills, resume["raw_text"])
        results.append({
            "resume_id": resume["id"],
            "similarity_score": round(sim_score, 4),
            "skill_matches": skill_match,
        })
    results.sort(key=lambda x: x["similarity_score"], reverse=True)
    return results
```

### 5.4 NLP Processor (`backend/app/services/nlp_processor.py`)

The skill extraction is keyword-based — it checks if known skill names appear in the resume text. This is intentionally simple and transparent:

```python
COMMON_SKILLS = ["python", "java", "javascript", "react", "sql", ...]

def extract_skills(text):
    text_lower = text.lower()
    return [skill for skill in COMMON_SKILLS if skill in text_lower]
```

---

## 6. Tech Stack Explained

| Component | Technology | Why |
|-----------|-----------|-----|
| **Backend framework** | FastAPI | Async-capable, auto-generates API docs, type-safe with Pydantic |
| **Frontend** | React.js (Vite) | Component-based UI, fast dev with hot reload |
| **Database** | PostgreSQL on Neon | Serverless, free tier, standard SQL, supports JSON columns for embeddings |
| **ORM** | SQLAlchemy | Python's most mature ORM, handles connection pooling |
| **Migrations** | Alembic | Auto-generates migration scripts from model changes |
| **Auth** | JWT (python-jose + bcrypt) | Stateless auth, no session storage needed |
| **PDF parsing** | pdfplumber | Better than PyPDF2 for complex layouts, handles tables |
| **DOCX parsing** | python-docx | Standard library for .docx files |
| **ML model** | Sentence-Transformers (MiniLM) | Free, local, fast, optimized for semantic similarity |
| **Similarity math** | scikit-learn (cosine_similarity) | Industry-standard, efficient numpy-based computation |
| **HTTP client** | Axios | Promise-based, interceptors for auth tokens |
| **Routing** | React Router | Standard SPA routing |

---

## 7. API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Create recruiter account |
| POST | `/api/auth/login` | Login, returns JWT token |

### Job Descriptions
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/jobs/` | Create JD (auto-generates embedding) |
| GET | `/api/jobs/` | List all JDs for current recruiter |
| GET | `/api/jobs/{id}` | Get single JD |
| PUT | `/api/jobs/{id}` | Update JD |
| DELETE | `/api/jobs/{id}` | Delete JD |

### Resumes
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/resumes/{job_id}/upload` | Upload resumes (auto-parses + generates embeddings) |
| GET | `/api/resumes/{job_id}` | List resumes for a job |

### Matching
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/matching/{job_id}/run` | Run matching — computes scores, returns ranked list |
| GET | `/api/matching/{job_id}/results` | Get previously computed results |

All endpoints except signup/login require a JWT token in the `Authorization: Bearer <token>` header.

---

## 8. Database Schema

### users
| Column | Type | Description |
|--------|------|-------------|
| id | Integer (PK) | Auto-increment |
| email | String (unique) | Recruiter email |
| hashed_password | String | bcrypt hash |
| full_name | String | Recruiter name |
| company | String (nullable) | Company name |
| created_at | DateTime | Account creation time |

### job_descriptions
| Column | Type | Description |
|--------|------|-------------|
| id | Integer (PK) | Auto-increment |
| recruiter_id | Integer (FK → users) | Who created this JD |
| title | String | Job title |
| description | Text | Full job description text |
| required_skills | JSON | List of skill strings: `["python", "react"]` |
| experience_level | String (nullable) | e.g., "2-5 years" |
| qualifications | Text (nullable) | Required qualifications |
| embedding | JSON | 384-float vector from MiniLM |
| created_at | DateTime | Creation time |
| updated_at | DateTime | Last update time |

### resumes
| Column | Type | Description |
|--------|------|-------------|
| id | Integer (PK) | Auto-increment |
| job_id | Integer (FK → job_descriptions) | Which job this resume is for |
| file_name | String | Original filename |
| file_path | String | Server storage path |
| raw_text | Text | Full extracted text from PDF/DOCX |
| parsed_data | JSON | `{email, phone, skills}` |
| embedding | JSON | 384-float vector from MiniLM |
| created_at | DateTime | Upload time |

### match_results
| Column | Type | Description |
|--------|------|-------------|
| id | Integer (PK) | Auto-increment |
| job_id | Integer (FK → job_descriptions) | Job matched against |
| resume_id | Integer (FK → resumes) | Resume that was scored |
| similarity_score | Float | Cosine similarity (0.0 to 1.0) |
| skill_matches | JSON | `{matched: [...], missing: [...], match_ratio: 0.X}` |
| created_at | DateTime | When matching was run |

---

## 9. Frontend Structure

```
frontend/src/
├── App.jsx              # Routes + AuthProvider wrapper
├── context/
│   └── AuthContext.jsx   # JWT token state management
├── services/
│   └── api.js           # Axios instance with auth interceptor
└── pages/
    ├── Login.jsx        # Signup/Login toggle form
    ├── Dashboard.jsx    # List of all JDs, create new
    ├── JobForm.jsx      # Create job description form
    └── JobDetail.jsx    # View JD, upload resumes, run matching, see ranked results
```

**Auth flow:** On login, the JWT token is stored in `localStorage`. The Axios interceptor automatically attaches it to every API request. The `AuthContext` provides `isAuthenticated`, `login()`, and `logout()` to all components. Protected routes redirect to login if no token exists.

---

## 10. Limitations & Future Scope

### Current Limitations
- **Token limit:** MiniLM truncates text after ~256 tokens (~200 words). Long resumes may lose information from the end
- **Skill extraction:** Keyword-based only — won't catch synonyms like "JS" for "JavaScript" or "ML" for "Machine Learning"
- **Resume formatting:** Heavily formatted PDFs (tables, columns, graphics) may not parse cleanly
- **Single score:** Ranking uses only semantic similarity; doesn't factor in years of experience or education level
- **No candidate identity:** System doesn't extract candidate names reliably
- **English only:** No multilingual support

### Future Improvements
- Use a larger model (e.g., `all-mpnet-base-v2`, 768 dimensions) for better accuracy
- Add NER (Named Entity Recognition) using spaCy for extracting names, companies, degrees
- Weighted scoring: combine semantic similarity + skill match ratio + experience match
- Multilingual support with multilingual sentence transformers
- AI-generated interview questions based on matched profiles
- Integration with job portals (LinkedIn, Naukri)
- Bias detection and fairness metrics
