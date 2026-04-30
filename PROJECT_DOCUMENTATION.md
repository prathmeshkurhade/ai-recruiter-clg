# Final Project Report: AI-Powered Resume Screening & Job Matching System

## 1. Abstract / Executive Summary
The AI-Powered Resume Screening & Job Matching System is an advanced, automated talent acquisition platform designed to revolutionize how recruiters parse, evaluate, and shortlist candidates. Traditional Applicant Tracking Systems (ATS) rely heavily on exact keyword matching, often missing highly qualified candidates due to synonym mismatches or formatting variations. 

This project introduces a **Two-Stage Semantic Matching Pipeline**. It first utilizes **Transformer-based embeddings (MiniLM)** to calculate the cosine similarity between resumes and job descriptions (semantic meaning). It then employs a state-of-the-art **Large Language Model (LLM via Groq Llama-3.3-70b)** to holistically re-rank the top candidates based on contextual reasoning, experience depth, and specific role rubrics. 

Furthermore, the platform integrates an industry-first **Ethical AI Engine** that features Identity Masking, Zero-Bias Evaluation, and Real-time Audit Logging to promote fair and unbiased hiring practices.

---

## 2. Introduction

### 2.1 Problem Statement
Modern recruiters are overwhelmed by the volume of applications per job posting. Manual screening is time-consuming, prone to human error, and heavily influenced by unconscious biases. Existing ATS solutions use brittle keyword filters, rejecting candidates who possess the right skills but phrase them differently (e.g., "Machine Learning" vs. "ML"). 

### 2.2 Objectives
1. **Automate Data Extraction:** Parse PDF and DOCX resumes seamlessly to extract raw text, contact information, and technical skills.
2. **Semantic Matching:** Implement vector embeddings to understand the contextual meaning of resumes and job descriptions rather than relying on exact word matches.
3. **Intelligent Re-ranking:** Use an advanced LLM to act as a virtual Senior Recruiter, evaluating top candidates against role-specific rubrics.
4. **Promote Ethical Hiring:** Build features to actively mask Personally Identifiable Information (PII) to eliminate gender, racial, and demographic biases from the initial screening phase.

---

## 3. System Architecture & Methodology

The system follows a modern client-server architecture with an integrated AI pipeline.

### High-Level Architecture Flow
1. **Client Layer (React.js):** Recruiter dashboard for job creation, candidate uploading, and results visualization (Spatial Talent Map).
2. **API Layer (FastAPI):** Handles routing, authentication, and orchestrates the AI services.
3. **AI/ML Layer (Python):** 
    - Text Extraction (`pdfplumber`, `python-docx`)
    - NLP Processing & Skill Extraction (Regex & Dictionary mapping)
    - Embedding Generation (`sentence-transformers`)
    - Intelligent Re-ranking (`Groq API`)
4. **Data Layer (PostgreSQL/SQLAlchemy):** Stores user data, job embeddings, resume vectors, and audit logs.

### 3.1 The Two-Stage AI Pipeline

**Stage 1: Semantic Filtering (Vector Math & Skill Check)**
- The Job Description (JD) and parsed Resumes are converted into 384-dimensional dense vectors using the `all-MiniLM-L6-v2` transformer model.
- **Cosine Similarity** is calculated between the JD vector and Resume vectors to determine semantic closeness.
- Simultaneously, a keyword-based skill extraction maps missing and matching skills.
- A combined score (Semantic Score + Skill Match Ratio) is generated.

**Stage 2: LLM-Based Re-ranking**
- The top *N* candidates from Stage 1 are sent to the Groq LLM API.
- The LLM acts with a highly specific persona ("world-class technical recruiter") and evaluates the raw resume text against the JD using role-specific rubrics (e.g., valuing Codeforces ratings for Algorithmic SWEs, or production scale metrics for Backend Engineers).
- The LLM returns a decisive score (0-100) and a single-sentence reasoning.
- The final candidate score is a weighted blend of the Stage 1 Embedding Score and Stage 2 LLM Score.

---

## 4. Implementation Details & Tech Stack

### 4.1 Frontend Technology
- **Framework:** React.js via Vite for lightning-fast HMR and building.
- **Styling:** Tailwind CSS to construct a modern, dark-themed, "cyberpunk" aesthetic.
- **Animations:** Framer Motion for fluid transitions, expanding vector panels, and progress bars.
- **Icons:** Lucide React for consistent UI iconography.

### 4.2 Backend Technology
- **Framework:** FastAPI, chosen for its high performance, asynchronous support, and auto-generated Swagger UI.
- **Database:** PostgreSQL (with Neon serverless) managed via SQLAlchemy ORM.
- **Migrations:** Alembic for database schema version control.
- **Authentication:** JWT (JSON Web Tokens) with bcrypt password hashing for secure session management.

### 4.3 Machine Learning & AI
- **Sentence-Transformers:** `all-MiniLM-L6-v2` runs locally to generate embeddings. Chosen for its balance of speed (fast CPU inference) and accuracy (trained on 1B+ sentence pairs).
- **LLM Engine:** Groq API running `llama-3.3-70b-versatile` for ultra-low latency, high-reasoning candidate evaluations.
- **NLP:** Custom Regex and dictionary mappings to normalize skills (e.g., mapping "React.js" and "ReactJS" to the canonical "react").

---

## 5. Innovative & Key Features

### 5.1 Ethical AI & Identity Masking
To counter unconscious bias, the system includes an **Ethical Settings Console**. 
- **Identity Masking:** When enabled, candidate names, emails, and phone numbers are scrubbed and replaced with neural placeholders (e.g., `CANDIDATE_VECTOR_1042`). 
- **Aggressive PII Redaction:** The raw text is regex-scrubbed to hide emails and names from the recruiter until they explicitly choose to "Fast Track" the candidate.

### 5.2 Real-Time Audit Logging
Every critical action—from uploading a resume to generating embeddings and scrubbing PII—is logged in an immutable `audit_logs` table. This provides a transparent tracking mechanism for compliance and system monitoring.

### 5.3 Candidate Neural Dossier & Spatial Talent Map
Instead of a boring list of candidates, the UI presents a **Spatial Talent Map**. Recruiters can click into a candidate's "Neural Dossier" to see:
- A breakdown of Semantic Distance.
- A Vector Activation Graph (showing explicitly matched vs. missing skills).
- The LLM's concrete reasoning for the candidate's rank.
- A secure "Synaptic Log" for the recruiter to leave private notes.

---

## 6. Database Schema Design

The system utilizes a relational database to maintain data integrity:

1. **`users`**: Stores recruiter accounts, hashed passwords, and company details.
2. **`job_descriptions`**: Stores job parameters, required skills, and the generated 384-float job embedding.
3. **`resumes`**: Stores candidate raw text, extracted JSON data (email, phone), the candidate embedding vector, and the recruiter's decision node (e.g., `AWAITING_REVIEW`).
4. **`match_results`**: Links Jobs and Resumes. Stores similarity scores, skill matches, LLM scores, and LLM reasoning.
5. **`audit_logs`**: Tracks timestamped events (e.g., `Embeddings Generated`, `PII Scrubber Triggered`).
6. **`user_settings`**: Stores recruiter preferences for the Ethical AI toggles (Identity Masking, Zero-Knowledge, Bias Suppression).

---

## 7. Limitations & Future Scope

### Current Limitations
- **Token Limits:** The local MiniLM model truncates text after ~256 tokens. Extremely long resumes may lose trailing data during Stage 1 embedding generation.
- **Skill Normalization Constraints:** The current skill extraction relies on a hardcoded dictionary map. It may miss obscure or brand-new frameworks.
- **Complex Resume Formats:** Highly visual PDFs (e.g., two-column layouts with complex graphics) may yield scrambled raw text, degrading matching accuracy.

### Future Enhancements
- **Agentic Resume Parsing:** Replace `pdfplumber` with a Vision-Language Model (VLM) that can "read" the visual layout of a resume to extract structured data flawlessly.
- **Vector Database Integration:** Migrate from storing embeddings in PostgreSQL JSON arrays to a dedicated Vector DB (like Pinecone, Qdrant, or pgvector) for scalable similarity searches across millions of resumes.
- **Interview Generation:** Use the LLM to dynamically generate personalized technical interview questions based on the candidate's specific "missing skills" or weak points identified during ranking.
- **Integration Ecosystem:** Build Webhooks and APIs to integrate directly with platforms like LinkedIn, Greenhouse, and Workday.

---

## 8. Conclusion

The AI-Powered Resume Screening & Job Matching System successfully demonstrates the application of modern Natural Language Processing and Large Language Models to the recruitment domain. By moving beyond primitive keyword searches to deep semantic understanding and holistic LLM reasoning, the platform dramatically reduces time-to-hire. More importantly, its baked-in Ethical AI features prove that automation in HR can simultaneously increase efficiency while actively combating human bias.
