# AI-Powered Resume Screening & Job Matching System

## Project Overview

An intelligent recruitment tool where **recruiters upload job descriptions** and the system automatically **parses, matches, and ranks candidate resumes** using AI/NLP — replacing manual keyword-based filtering with semantic understanding and explainable ranking.

---

## Team & Academic Context

- **Academic Year:** 2025-26, Semester II
- **Batch:** L13
- **Guide:** Ms. S. C. Nahatkar
- **Team Members:**
  - Harshal Kale (Roll: 35124)
  - Prathmesh Kurhade (Roll: 35135)
  - Atharv Lalage (Roll: 35136)

---

## Problem Statement

Manual resume screening is time-consuming, biased, and inefficient. Existing Applicant Tracking Systems (ATS) rely on keyword-based filtering, lack semantic understanding, and provide no explainable ranking — leading to qualified candidates being overlooked and recruiter fatigue.

---

## Core Objectives

1. Automate resume screening using AI
2. Extract skills and relevant info from resumes using NLP
3. Match resumes with job descriptions using semantic similarity (not just keywords)
4. Rank candidates based on a computed relevance score
5. Reduce manual effort and bias in recruitment

---

## Proposed Methodology (Pipeline)

1. **Input:** Recruiter uploads job description; candidate resumes are collected (PDF/DOC)
2. **Parsing:** Convert resume files into structured text (using `pdfplumber`, `python-docx`)
3. **Preprocessing:** Tokenization, normalization, stopword removal, NLP text cleaning
4. **Embedding Generation:** Generate transformer-based semantic embeddings for both resumes and job descriptions (using Sentence-Transformers / MiniLM / OpenAI embeddings)
5. **Matching:** Compute cosine similarity between job description embedding and each resume embedding
6. **Ranking:** Sort candidates by similarity score; provide explainable skill-match breakdown
7. **Output:** Display ranked results through web interface with scores and match details

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React.js |
| **Backend** | FastAPI (Python) — single Python backend handling both API routes and ML logic |
| **NLP Libraries** | Hugging Face Transformers, Sentence-Transformers |
| **ML Approach** | Transformer-based Semantic Embeddings (MiniLM / OpenAI embeddings), Cosine Similarity |
| **Database** | PostgreSQL / MongoDB |
| **File Handling** | pdfplumber, python-docx (PDF/DOC resume parsing) |

---

## System Architecture (High-Level)

```
[React Frontend — Recruiter Dashboard]
    │
    ▼
[FastAPI Backend]
    │
    ├── Auth (Recruiter login/signup)
    ├── Job Description CRUD
    ├── Resume Upload & Bulk Processing
    ├── Resume Parsing (pdfplumber / python-docx)
    ├── NLP Preprocessing (tokenization, normalization)
    ├── Embedding Generation (Sentence-Transformers / MiniLM)
    ├── Cosine Similarity Matching & Ranking
    ├── Skill Extraction & Explainable Scoring
    │
    ▼
[Database: PostgreSQL / MongoDB]
    │
    ├── Resumes (raw + parsed + embeddings)
    ├── Job Descriptions
    ├── Match Results & Scores
    └── Recruiter Accounts
```

> **Note:** Since the entire backend is Python (FastAPI), there's no need for a separate ML microservice. ML logic lives directly in the FastAPI app as service modules.

---

## Key Features to Build (Recruiter-Focused, v1)

### Recruiter Dashboard
- Recruiter signup / login (JWT auth)
- Create / edit / delete job descriptions (title, required skills, experience level, qualifications, description text)
- Upload bulk resumes (PDF/DOC) against a job description
- View ranked candidate list with match scores per job
- Filter/sort candidates by score, skills, experience
- Explainable match breakdown per candidate (which skills matched, which are missing, confidence score)
- Download/export shortlisted candidates

### Resume Processing Pipeline (Backend, Recruiter-Triggered)
- Parse uploaded PDF/DOC into structured text
- Extract: name, email, phone, skills, education, experience, certifications
- Generate semantic embeddings per resume
- Store parsed data + embeddings in DB

### Matching Engine (Backend)
- Generate embedding for job description on creation/update
- On match trigger: compute cosine similarity against all uploaded resume embeddings
- Skill-level matching (exact + semantic skill match)
- Produce ranked list with relevance scores and skill breakdown

---

## Literature & Research Base

1. **"Job Application Selection and Identification: Study of Resume with NLP and ML"** — Amit Pimpalkar et al., IEEE 2023
2. **"Intelligent Resume Parsing Method Based on Deep Learning"** — Y. Liu et al., IEEE CSAI 2020
3. **"Intelligent Resume Evaluation Tool Based on Machine Learning"** — R. Pradeepa et al., IEEE ICERCS 2024
4. **"AI-Powered Resume Screening and Job Matching System for Intelligent Career Guidance"** — K. S. Yadav et al., IJSAT 2025

### Key Techniques from Literature
- TF-IDF Vectorization (baseline)
- Cosine Similarity for ranking
- NLP-based skill extraction
- Transformer-based semantic embeddings (advanced approach chosen for this project)

---

## Limitations to Be Aware Of

- Depends on resume quality and formatting consistency
- Limited to text-based information (no image/video resume support)
- Cannot fully replace human decision-making (decision support tool, not replacement)
- Multilingual support not in v1

---

## Future Scope

- Advanced NLP / deep learning for improved matching
- Multilingual resume and JD support
- AI-based interview question generation from matched profiles
- Integration with job portals (LinkedIn, Naukri, etc.)
- Bias reduction techniques for fair and ethical hiring

---

## Week 1 Progress (Completed)

1. Finalized project domain: AI & Machine Learning
2. Identified real-world problem of manual resume screening
3. Finalized project title
4. Defined problem statement and core objectives
5. Conducted literature survey (NLP resume parsing, ML-based ranking, ATS systems)
6. Identified limitations of existing systems (keyword filtering, no semantic understanding, no explainable ranking)
7. Decided overall tech approach: FastAPI (Python) + React

---

## Development Notes

- **Single Python backend** — FastAPI handles both API routes and ML processing, no separate microservice needed
- For embeddings, start with **`all-MiniLM-L6-v2`** from Sentence-Transformers (free, fast, good quality)
- Resume parsing priority: PDF first (most common format), then DOC/DOCX
- Database choice: PostgreSQL for structured data (recruiters, JDs, scores); MongoDB optional for storing raw parsed resume JSON
- **v1 is recruiter-only** — no candidate-facing portal, no candidate self-signup
- Recruiters upload resumes themselves (bulk upload) — candidates don't interact with the system
- Frontend should be a clean recruiter dashboard with JD management + ranked results view
