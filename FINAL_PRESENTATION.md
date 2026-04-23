# 🚀 HireForge AI — Final Presentation

**An AI-Powered Resume Screening & Candidate Ranking System**

> *"We built a system that doesn't just read resumes — it understands them, the way a human recruiter would."*

---

## 1. The Problem We Are Solving

Every company today is drowning in resumes. A single software role can receive **500 to 2000 applications**. Recruiters have roughly **6 seconds** to scan each one. At this scale, two things always fail:

1. **Human bias** — recruiters unconsciously favor familiar names, colleges, or backgrounds.
2. **Keyword-based ATS tools** — existing systems just hunt for words like "React" or "Python" and throw away resumes that don't match exactly. They have zero understanding of meaning.

### The Real Failure Mode

Imagine a job description that says: *"We want a competitive programmer."*

Now compare two candidates:

- **Candidate A**: "Solved 300+ DSA problems, 2-Star on CodeChef"
- **Candidate B**: "Solved 1000+ problems, 3-Star CodeChef (1636), Codeforces Specialist (1563)"

Any human recruiter can instantly tell Candidate B is the stronger programmer. But a traditional ATS? Both resumes contain the words "competitive programming", "LeetCode", "DSA" — so both look equally good to a keyword scanner.

**This is the gap we are solving. Our system understands *proficiency*, not just *presence* of keywords.**

---

## 2. The Core Idea — Two Brains, Not One

We realized no single AI technique can solve this problem alone. So we built a system with **two brains working together**:

### Brain 1 — The Fast Filter (Embeddings)
Good at reading meaning quickly. Filters thousands of resumes down to the top 10 in a second.

### Brain 2 — The Deep Reasoner (Large Language Model)
Slow but smart. Reads those top 10 like a human recruiter and ranks them based on actual skill level.

This two-stage pipeline is called **"Retrieve-then-Rerank"** — it's the same architecture modern search engines like Perplexity, Google, and advanced RAG systems use. We applied it to recruiting.

---

## 3. How AI Actually Works in Our System (Theory)

### 3.1 What Are Embeddings? (The First Brain)

Every resume and job description is first converted into a **mathematical representation of meaning** — called an *embedding*.

Think of it like this:
- Imagine a giant 384-dimensional map
- Every resume is placed as a dot on this map
- Resumes about similar topics naturally cluster near each other
- The Job Description is also placed as a dot on this map
- The closest resumes to the JD are our strongest candidates (geometrically)

This mapping is done by a model called **MiniLM** — a distilled cousin of BERT. It was trained on billions of sentences, so it learned how different words and concepts relate to each other. When we feed it "I built a REST API in FastAPI", it knows this is closer to "Developed backend services in Python" than it is to "Painted landscapes in oil".

**The magic:** We never told MiniLM what "backend development" means. It learned that from context, by reading the entire internet. Our system just uses that learned understanding.

We measure closeness between two dots using **cosine similarity** — basically, the angle between the two directions on this map. Small angle = similar meaning. Big angle = different meaning.

### 3.2 Why Embeddings Alone Fail

Embeddings are great at **topic matching** but terrible at **proficiency grading**.

Example: MiniLM reads "2-Star CodeChef" and "3-Star CodeChef" and thinks they mean roughly the same thing — both are about competitive programming. It has no internal concept that 3 stars > 2 stars. It doesn't understand *ratings*, *numbers*, or *hierarchies*.

So while embeddings can tell us "these 10 resumes are all about competitive programmers", they cannot tell us **which of those 10 is the strongest**. We need something that can *reason*.

That's where Brain 2 comes in.

### 3.3 The Large Language Model (The Second Brain)

We use **Llama 3.3 70B** — an open-weight large language model with 70 billion parameters. Think of it as a highly intelligent reader who has absorbed most of the internet and can reason about text the way a human does.

We send it a carefully crafted instruction like:

> "You are an expert technical recruiter. Here is a job description and 10 candidate resumes. Rank them from best to worst, using the following rules:
> - For competitive programming roles, Codeforces ratings matter: Grandmaster > Master > Expert > Specialist > Newbie.
> - CodeChef stars matter: 7★ > 6★ > 5★ > 4★ > 3★ > 2★.
> - Number of problems solved matters: 1000+ beats 300+.
> - Ignore how the resume is visually framed. Scan the entire document, including the Achievements section at the bottom.
> - Give each candidate a score from 0 to 100 with a one-line reason."

Llama reads each resume as if it were a human recruiter sitting at a desk. It notices *exact numbers*, *ratings*, and *ranks*. Then it returns a ranked list with human-readable explanations.

This is called **LLM-as-a-re-ranker** — a design pattern where we use embeddings for speed, then use an LLM for judgment.

### 3.4 Blending Both Scores

Once we have scores from both brains, we blend them:

**Final Score = 90% × LLM Judgment + 10% × Embedding Similarity**

The LLM dominates because it has actual understanding. The embedding is kept as a small safety net — if the LLM API ever fails or is slow, the system silently falls back to embedding-only ranking, and the product still works. No broken UI.

### 3.5 Why Retrieve-then-Rerank? (The Architecture Choice)

Why not just send all 2000 resumes to the LLM every time?

Because:
- **Cost** — every LLM call uses tokens. Sending 2000 resumes at once = expensive, slow, and wasteful.
- **Context windows** — even huge LLMs can't fit unlimited text.
- **Speed** — users want results in seconds, not minutes.

So we use embeddings — which are essentially free and instant — to filter down to the **top 10 strongest candidates semantically**. Only those 10 go to the LLM. One API call. One ranked output. Cheap and fast.

This is exactly how Perplexity, Glean, and modern enterprise search tools are built.

---

## 4. The Data Journey — From PDF Upload to Ranked List

Let me walk you through what happens when a recruiter uploads a resume.

### Step 1: Ingestion
- Recruiter drags a PDF into the dashboard.
- Our parser (`pdfplumber`) tears through the unstructured PDF and extracts clean text.
- We then run regex + NLP passes to pull out the email, phone, and skills.

### Step 2: Embedding Generation
- The cleaned text is fed into MiniLM.
- Out comes a 384-number vector — the resume's "meaning signature".
- This vector is stored in the database, attached to the resume.

### Step 3: Job Description Processing
- When a recruiter creates a Job Description, the same thing happens — it gets embedded.
- The JD now lives on the same 384-dimensional map as the resumes.

### Step 4: Retrieval (Stage 1)
- When the recruiter clicks **"Generate Neural Map"**, the system asks:
  *"Which 10 resumes are closest to this JD on the meaning map?"*
- Computed using cosine similarity. Takes under a second, even for thousands of resumes.

### Step 5: Re-ranking (Stage 2)
- Those top 10 resumes (as raw text, not embeddings) + the JD are packed into a single prompt.
- Prompt is sent to Llama 3.3 70B via Groq.
- Llama returns a JSON list: each candidate gets a score out of 100 and a one-line explanation.

### Step 6: Score Fusion & Display
- LLM score and embedding score are blended (90/10).
- Ranked list is stored in the database.
- Frontend displays the ranked candidates with their match percentage **and** the human-readable explanation from the LLM.

This explanation — *"Strongest CP profile: Leetcode Knight 1861, 3-Star CodeChef 1730, Codeforces Specialist 1448"* — is the **Explainable AI** layer. Recruiters don't have to trust a mysterious score. They see *why*.

---

## 5. Why This Is Real Intelligence, Not Just Buzzwords

Let me give you the actual proof. We tested our system with three real resumes for a "we want competitive programmer" job:

| Candidate | Real Credentials | Old System (Embeddings Only) | Our New System (Hybrid) |
|-----------|------------------|------------------------------|------------------------|
| **Atharv** | 2★ CodeChef, 300+ problems | #1 (wrong) | #3 (correct) |
| **Prathmesh** | Specialist 1563, 3★ 1636, 1000+ problems | #2 | #1 |
| **Aditya** | Specialist 1448, 3★ 1730, Knight 1861, Codemania finalist | #3 (wrong) | #2 |

The old system ranked Atharv first — because his resume is *framed* around CP keywords and his profile summary says "competitive programmer" at the top. Embeddings are fooled by framing.

The new system correctly ranks Atharv last — because when you look at the actual *numbers*, he's the weakest. Prathmesh and Aditya both have Codeforces Specialist ratings. Atharv doesn't. Prathmesh and Aditya have 3-Star on CodeChef. Atharv has 2-Star.

**The LLM didn't just match keywords. It reasoned.**

---

## 6. The Ethical AI Layer — Identity Masking

Even with perfect matching, bias creeps in through names, genders, and emails. A recruiter might unconsciously favor a candidate based on a familiar-sounding name.

So we built a **Zero-Bias Identity Scrubber** that runs at the response level:
- Real names become `CANDIDATE_VECTOR_8241`
- Phone numbers become `[REDACTED]`
- Emails are masked
- Gender pronouns are neutralized

This masking happens on the backend, **before** the data reaches the React frontend. So the recruiter's browser never even sees the real identity until they decide to **fast-track** a candidate. Only at that point does our system auto-unmask the identity — a deliberate, logged action.

Result: the *first impression* is purely based on skills, not identity.

---

## 7. Why This Matters (The Big Picture)

Recruiting is one of the highest-stakes, lowest-explained processes in any company. Careers are shaped by 6-second keyword scans. Bias goes unchecked. Strong candidates get filtered out.

Our system changes the game in three ways:

1. **Fairness** — identity masking removes surface-level bias.
2. **Intelligence** — the hybrid pipeline understands proficiency, not just words.
3. **Transparency** — every ranking comes with a reason, so recruiters can audit and trust the AI.

This isn't a demo. This is a working, real-world architecture. The same pattern (retrieve-then-rerank + LLM explanation) powers products like Perplexity, Cohere Rerank, and the internal search engines at Google and Microsoft. We've just adapted it for the hiring world.

---

## 8. Live Demo Flow (What to Show)

1. **Show the job description**: *"we want competitive programmer"*.
2. **Upload three resumes** — Atharv, Prathmesh, Aditya.
3. **Click "Generate Neural Map"** — within seconds, ranked output appears.
4. **Point out** that Prathmesh & Aditya rank above Atharv, even though Atharv's resume looks "CP-heavy" at a glance.
5. **Expand the `llm_reason` field** — show the model's actual explanation: *"Strongest CP profile with Specialist rating and 1000+ problems solved..."*
6. **Toggle identity masking** — watch names turn into `CANDIDATE_VECTOR_*`.
7. **Fast-track a candidate** — identity auto-unmasks, logged in audit trail.
8. **Show the audit log** — every action traceable.

---

## 9. Talking Points for Q&A

**"Is this just ChatGPT?"**
No. ChatGPT is a single general-purpose chatbot. We built a two-stage pipeline where embeddings do fast filtering and a specialized prompt turns an LLM into a recruiter. The logic, architecture, database, and UI are all ours. The LLM is one tool in a larger system.

**"What if the LLM gives a wrong answer?"**
Two safeguards:
- The embedding score is always kept as a 10% baseline — so bizarre LLM outputs get dampened.
- If the LLM fails entirely (network error, quota), we fall back to embedding-only ranking. The system never breaks.

**"Why free APIs? Isn't that unstable?"**
We chose Groq for Llama 3.3 70B because it offers 14,400 free requests per day — more than enough for this scale. The architecture is provider-agnostic; swapping to OpenAI, Anthropic, or self-hosting is a 20-line change.

**"What about privacy?"**
Resumes are stored on our own Postgres (NeonDB). The LLM sees only the text during ranking; it's not retained for training. Masking ensures the frontend never caches real identities.

**"Can it scale?"**
Yes. Stage 1 (embeddings) handles thousands of resumes in under a second. Stage 2 (LLM) always processes only the top 10 regardless of total resumes — so API cost and latency stay constant as the system scales.

**"Why not just train your own model?"**
Two reasons. (1) Training a 70B model from scratch costs millions and takes months. (2) Llama 3.3 is already trained on vastly more data than we could ever collect. We're standing on the shoulders of a giant — using the best open model, then specializing it with smart prompting for our domain.

---

## 10. Closing Line

> *"Traditional ATS tools scan resumes. HireForge AI understands them. We built a system that thinks about candidates the way a human recruiter would, but at the speed of a machine — and with built-in fairness."*

---

## Appendix: Technical Stack (For Reference)

- **Backend**: FastAPI, SQLAlchemy, PostgreSQL (NeonDB)
- **Embedding Model**: all-MiniLM-L6-v2 (384-dim sentence transformer)
- **LLM Reranker**: Groq API — Llama 3.3 70B Versatile
- **Frontend**: React 18, TailwindCSS, Framer Motion
- **Auth**: JWT with bcrypt
- **Parsing**: pdfplumber, python-docx

### One Code Reference — The Heart of the System

The entire two-stage ranking logic lives in about 50 lines of Python in `matching_service.py`:

```python
# Stage 1 — embeddings filter all resumes, keep top 10
stage1.sort(key=lambda x: x["embedding_score"], reverse=True)
shortlist = stage1[:10]

# Stage 2 — send the shortlist to Llama via Groq
llm_scores = rerank_with_llm(job_description, job_skills, shortlist)

# Fuse both scores
final = 0.9 * llm_score + 0.1 * embedding_score
```

That's it. The complexity is in the ideas — not the code.
