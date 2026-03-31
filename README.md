<div align="center">
  <img src="https://img.shields.io/badge/Status-Beta-purple" alt="Beta">
  <img src="https://img.shields.io/badge/Python-3.10+-blue" alt="Python">
  <img src="https://img.shields.io/badge/React-18-cyan" alt="React">
  <img src="https://img.shields.io/badge/Database-PostgreSQL-blue" alt="PostgreSQL">
  <h1>HireForge AI : The Ethical Kinetic OS</h1>
  <p>An open-source, AI-driven recruitment platform built with Semantic Vector similarity matching and an active Zero-Bias Identity Scrubber.</p>
</div>

---

## 🚀 The Architecture
Most Applicant Tracking Systems (ATS) use simple boolean keyword scrapers to parse resumes. **HireForge AI** completely re-engineers this pipeline using **Deep NLP** and **HuggingFace SentenceTransformers** to map candidates conceptually onto a multi-dimensional spatial grid, allowing recruiters to discover tangential skills that standard scanners miss.

Additionally, we designed the entire frontend layer around **Kinetic UI/UX** principles (Framer Motion, Glassmorphism) and built an interception layer that systematically enforces Ethical AI compliance by scrubbing identifiers before they ever reach the frontend cache.

## ⚡ Core Engineering Features

### 1. Generative Semantic Matching Engine
The backend doesn't search for the word `"React"`. It converts resumes and Job Descriptions into a dense `384-dimensional` array using `all-MiniLM-L6-v2`. It then utilizes `cosine_similarity` to calculate the mathematical distance between a candidate's *intent* and the job requirements, assigning a flawless semantic match percentage.

### 2. Zero-Bias Identity Injection (NLP Masking)
Implicit bias destroys fair sourcing. When the `identity_masking` setting is toggled, our backend physically intercepts the HTTP response payloads. Using complex deep-regex and NLP scrub passes, the AI securely masks real names (e.g., replacing with `CANDIDATE_VECTOR_8241`), telephone networks, emails, and gender pronouns with `[REDACTED_SECURE_COMMS]` before Redux state ingestion.

### 3. The Holographic Neural Dossier
We rejected the sluggishness of traditional Kanban boards. Recruiters interact via a sliding, dynamic component (`CandidateDossier.jsx`) that allows one-click routing to nodes like `AWAITING_REVIEW` or `ENGAGE_FAST_TRACK`. Moving a candidate to Fast-Track automatically securely unmasks their true identity without a page reload. It also features a **Synaptic Log** that performs asynchronous `PATCH` saves to the NeonDB Postgres cluster.

### 4. Chaos Parsing Pipeline
Utilizing PDF extraction ecosystems (`pdfplumber`), the ingestion mesh tears through unstructured nested PDFs and natively maps chaotic text into pristine JSON schemas. 

---

## 🛠 Tech Stack

- **Backend (Python)**: `FastAPI`, `SQLAlchemy`, `Alembic`, `SentenceTransformers`, `PyJWT`
- **Database**: `NeonDB` (PostgreSQL), `PostGIS` Vector extensions (simulated)
- **Frontend (JavaScript)**: `Vite`, `React 18`, `TailwindCSS`
- **Animation UX**: `Framer Motion`, `Lucide React`

---

## ⚙️ Installation & Operation (Local Environment)

### 1. Clone the Matrix
```bash
git clone https://github.com/your-username/hireforge-ai.git
cd hireforge-ai
```

### 2. Booting the Backend (FastAPI Core)
The backend pipeline requires Python 3.9+. We highly recommend creating a virtual environment.
```bash
cd backend
python -m venv venv
# Windows: venv\\Scripts\\activate
# Mac/Linux: source venv/bin/activate

pip install -r requirements.txt
```
Make sure you generate a `.env` file containing your `DATABASE_URL` (NeonDB) and your JWT `SECRET_KEY`.
```bash
# Run the uvicorn server mapping
uvicorn app.main:app --reload --port 8000
```

### 3. Booting the Frontend (React OS)
Open a new terminal session.
```bash
cd frontend
npm install
npm run dev
```
Navigate to `http://localhost:5173` to interact with the Neural Dossier Interface.

---

## 🔒 License & Open Source
This project is open-source and released under the **MIT License**. It was constructed as an advanced AI Architecture portfolio piece. Contributions and pull requests are highly encouraged to expand the capabilities of the Generative Vector Engine.
