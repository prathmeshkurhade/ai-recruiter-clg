# AI/ML Part of the Resume Screening System (Teacher Explanation)

## 1) What the AI part does

This project uses AI to compare:

- Job Description text (what company wants)
- Resume text (what candidate has)

Instead of matching only exact keywords, it uses semantic understanding (meaning-based matching).

Example:

- JD says: frontend engineering
- Resume says: React.js development

Traditional keyword systems may miss this. The AI model can still detect they are related.

---

## 2) Core AI pipeline (simple view)

1. Recruiter creates a job description.
2. Recruiter uploads resumes (PDF/DOCX).
3. System extracts text from files.
4. AI model converts text into embeddings (numeric vectors).
5. System computes cosine similarity between JD vector and each resume vector.
6. System ranks candidates by similarity score.
7. Skill matching layer explains why someone ranked high/low.

---

## 3) What is an embedding?

An embedding is a list of numbers that represents text meaning.

Model used:

- all-MiniLM-L6-v2

Output size:

- 384-dimensional vector (384 floating point numbers)

So each JD and each resume becomes a 384-number vector in semantic space.

High-level idea:

- Similar meaning texts -> vectors are close
- Different meaning texts -> vectors are far

---

## 4) Model details (the AI engine)

Model: all-MiniLM-L6-v2 from sentence-transformers

Why this model was chosen:

- Good semantic similarity performance
- Fast on CPU (practical for college/lab machine)
- Lightweight compared to larger transformer models
- Free and open source
- Runs locally (no paid external API required)

Important specs:

- Architecture: MiniLM (transformer family)
- Layers: 6
- Vector size: 384
- Max input length: around 256 tokens

---

## 5) How similarity is calculated

After vector generation:

- A = JD embedding
- B = Resume embedding

Similarity metric:

- Cosine similarity

Formula:
cos(theta) = (A dot B) / (|A| |B|)

Score interpretation:

- 1.0 -> very strong semantic match
- 0.7 to 0.9 -> strong match
- 0.4 to 0.7 -> moderate match
- below 0.4 -> weak match

Why cosine and not plain distance:

- Cosine checks direction (meaning), not only vector length.
- So a short and long text on same topic can still match well.

---

## 6) Explainability layer: skill matching

AI score alone is a number. Recruiters need explanation.

So the system also runs skill matching:

- Extract known skills from resume text
- Compare with JD required skills
- Return:
  - matched skills
  - missing skills
  - skill match ratio

Example output:

- matched: [python, react, sql]
- missing: [aws, kubernetes]
- ratio: 0.60

This makes result explainable and teacher-friendly.

---

## 7) Why both methods are used together

Embeddings (semantic AI):

- Strength: understands context and synonyms
- Weakness: hard to explain directly

Skill matching (keyword layer):

- Strength: easy to explain
- Weakness: misses semantic relations

Combined approach gives:

- Better ranking quality
- Clear justification for each candidate

---

## 8) Tech stack used in AI/ML part

Backend and AI libraries:

- FastAPI (API framework)
- sentence-transformers (embedding model)
- scikit-learn (cosine similarity)
- NumPy (vector handling)
- pdfplumber (PDF text extraction)
- python-docx (DOCX text extraction)
- Regex + custom NLP logic (email/phone/skills extraction)

Data and storage:

- PostgreSQL (Neon)
- Embeddings stored as JSON arrays

---

## 9) End-to-end data flow with AI

Flow A: Job creation

- Recruiter submits JD
- Backend generates JD embedding
- JD text + embedding saved to database

Flow B: Resume upload

- PDF/DOCX uploaded
- Text parsed and cleaned
- Contact info + skills extracted
- Resume embedding generated
- Resume data + embedding saved

Flow C: Matching

- For each resume:
  - cosine similarity(JD, resume)
  - skill comparison against required skills
- Results sorted descending by similarity
- Ranked list returned to frontend

---

## 10) Current limitations (honest academic points)

- Long text truncation because model input length is limited
- Skill extraction is mostly keyword-based
- Heavily formatted resumes may parse imperfectly
- Single main ranking score; does not deeply weight experience years or degree quality yet
- Mostly English-focused

---

## 11) Future improvements

- Use stronger embedding model (for higher quality matching)
- Add NER for better name/company/degree extraction
- Weighted final score:
  - semantic score
  - skill score
  - experience score
- Multilingual model support
- Fairness and bias analysis metrics

---

## 12) One-minute viva summary (ready to speak)

Our system uses transformer-based semantic embeddings to convert job descriptions and resumes into 384-dimensional vectors. Then it computes cosine similarity to rank resumes by meaning-level relevance, not just exact keywords. To make results explainable, we add a skill-matching layer that shows matched and missing skills. So the system combines AI accuracy with human-readable transparency.
