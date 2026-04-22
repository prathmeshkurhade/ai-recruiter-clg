# 🚀 Final Presentation: HireForge AI
**AI-Powered Resume Screening & Job Matching System**

---

## 📌 1. Project Overview & Problem Statement
*   **The Problem:** Manual resume screening is incredibly time-consuming, prone to human bias, and inefficient. Existing Applicant Tracking Systems (ATS) rely on rigid boolean keyword filtering, completely lacking semantic understanding and providing no explainable context for candidate rankings.
*   **The Solution:** An intelligent recruitment tool where recruiters simply upload job descriptions, and the system automatically parses, matches, and ranks candidate resumes using advanced Natural Language Processing (NLP) and Machine Learning. 
*   **Key Innovation:** Evolving beyond basic keyword scrapers to **Semantic Vector similarity matching**, allowing the discovery of tangential skills and conceptual matches that standard scanners miss.

---

## 🎯 2. Core Objectives
1.  **Iterative Automation:** Fully automate resume screening leveraging AI.
2.  **Intelligent Parsing:** Extract skills and relevant data points natively from unstructured resumes (PDF/DOCX) using deep NLP pipelines.
3.  **Semantic Matching:** Match resumes with job descriptions using complex mathematical semantic similarity, rather than simple keyword intersections.
4.  **Explainable Ranking:** Rank candidates based on a computed relevance score while providing a transparent, explainable skill-match breakdown.
5.  **Ethical Hiring:** Reduce manual effort and inherent implicit bias in top-of-funnel recruitment.

---

## 🏛️ 3. System Architecture (High-Level)
Our architecture follows a streamlined, single-process pipeline where ML logic lives directly within the API framework, eliminating the need for complex, latency-heavy ML microservices.

```text
[ React Frontend — Kinetic Recruiter Dashboard ]
      ⬇ (REST API via Axios)
[ FastAPI Backend (Python) ]
      ├── Auth Service (JWT login/signup)
      ├── Resume Parser (pdfplumber for PDF / python-docx for DOCX)
      ├── NLP Processor (skill extraction, text cleaning)
      ├── Embedding Service (Sentence-Transformers / MiniLM lazy-loaded)
      └── Matching Service (Cosine Similarity Algorithm + Skill Matching)
      ⬇ 
[ PostgreSQL Database — NeonDB (Serverless) ]
```

---

## 🧠 4. The AI/ML Pipeline & Algorithms Used

### 🔹 The Model: `all-MiniLM-L6-v2`
*   **Architecture:** Transformer (BERT-family), specifically a distilled 6-layer MiniLM.
*   **Mechanism:** Generates a dense **384-dimensional vector embedding** that mathematically represents the conceptual meaning of both the Job Description and candidate's raw text.
*   **Why MiniLM?** It is exceptionally fast, occupies only ~80MB, runs locally on CPU without expensive API dependencies, and is heavily optimized for sentence similarity.

### 🔹 The Algorithm: `Cosine Similarity`
*   Measures the mathematical angle between the 384-dimensional Job Description vector and the Resume vector.
*   Prioritizes the *direction* (meaning/intent of words) regardless of the magnitude (document length).
*   Produces a normalized score from **0.0 to 1.0**, where scores closer to 1.0 indicate a flawless semantic match.

### 🔹 The Explainability Layer: `Skill Matching`
*   Since Cosine Similarity functions mostly as a "black box" of dimensions, we layer an explicit keyword extraction parser on top.
*   It references a predefined matrix of skills against the resume text, returning an exact breakdown: `Matched Skills`, `Missing Skills`, and a percentage `Match Ratio` so recruiters understand *why* a candidate ranked highly.

---

## 🔄 5. Step-by-Step Data Flow
1.  **Ingestion & Parsing:** Recruiter uploads raw PDFs. The `Chaos Parsing Pipeline` (via `pdfplumber`) iterates through pages and multi-column layouts to extract raw unstructured text.
2.  **Preprocessing & Zero-Bias Extraction:** Normalization, tokenization, and implicit identity masking (scrubbing names, phone networks, emails via complex regex).
3.  **Embedding Generation:** The clean text is mathematically mapped through the `MiniLM` model to generate its 384-dimensional spatial coordinate.
4.  **Matching & Ranking:** The FastAPI backend calculates the Cosine Similarity between the JD embedding array and the Resume embedding array. It then calculates the explicit skill match logic.
5.  **Rendering:** The frontend renders the Holographic Neural Dossier, displaying a fully ranked dashboard of candidates descending by similarity score.

---

## 🛠️ 6. Technology Stack
*   **Frontend Ecosystem (UI/UX):** React 18, Vite, TailwindCSS (for rapid utility styling), Framer Motion (for Kinetic UI animations and glassmorphism).
*   **Backend Core:** Python 3.9+, FastAPI (Async, Type-safe endpoints), SQLAlchemy (ORM), Alembic (DB Migrations), PyJWT (Stateless Auth).
*   **Machine Learning/NLP Layer:** Hugging Face `SentenceTransformers` (`all-MiniLM-L6-v2`), Scikit-learn (Numpy-based `cosine_similarity`).
*   **Document Ingestion:** `pdfplumber` (advanced PDF structures), `python-docx` (Word documents).
*   **Data Lake / Database:** NeonDB Serverless PostgreSQL (handles JSON columns perfectly for high-dimensional vectors).

---

## 💾 7. Database Schema
Our highly-relational schema utilizes PostgreSQL JSON columns to store the ML arrays dynamically:

*   **`users`**: Manages recruiter accounts (`id`, `email`, `hashed_password` via bcrypt, `company`).
*   **`job_descriptions`**: Stores JDs with their generated dense vector embeddings (`id`, `title`, `description`, `required_skills`, **`embedding`** [JSON: 384-float array]).
*   **`resumes`**: Retains native candidate details (`id`, `job_id` [FK], `file_path`, `raw_text`, `parsed_data` [JSON], **`embedding`** [JSON: 384-float array]).
*   **`match_results`**: Caches previously run matches linking JDs to Resumes (`id`, `job_id` [FK], `resume_id` [FK], `similarity_score` [Float], `skill_matches` [JSON]).

---

## 🚀 8. Architectural Limitations & Future Scope
*   **Context Window Expansion:** MiniLM truncates text after ~256 tokens (~200 words). Future builds will transition to 768-dimensional models (`all-mpnet-base-v2`) for deeper contextual understanding of multi-page resumes.
*   **Advanced NER:** Implementing dedicated Named Entity Recognition (e.g., via `spaCy`) to dynamically and accurately extract complex education and hierarchical employment histories.
*   **Weighted Algorithmic Scoring:** Introducing a complex dynamic weighting system combining the Semantic Score + Explicit Skill Ratio + Experience limits.
*   **Ecosystem Integrations:** Direct API ingestion from LinkedIn or Naukri talent pools rather than localized PDF uploads.
