# 🚀 HireForge AI — Final Presentation Master Script

## 📝 Presentation Script (Divided by Speaker)

### 🎤 Speaker 1: Atharv Lalage (Introduction, Literature Survey & The Core Problem)

**[Slide 1: Title & Introduction]**
"Good morning respected professors, panel members, and everyone present. We are excited to present our final year project: **HireForge AI**, an AI-Powered Resume Screening and Job Matching System. I am Atharv Lalage, and joining me are my teammates Prathmesh and Harshal. Today, we want to show you how we solved one of the most broken processes in the tech industry: hiring."

**[Slide 2: Literature Survey & The Problem with Current ATS]**
"During our literature survey, we reviewed papers by *Reimers and Gurevych (2019)* on Sentence-BERT, and *Roy et al. (2020)* on resume parsing. We found a massive gap. Current Applicant Tracking Systems rely almost entirely on exact keyword matching. 

A software role can easily get over a thousand applications, giving recruiters roughly 6 seconds to scan each one. This leads to two major failures:
1. **Unconscious Human Bias** – As highlighted by *Raghavan et al.*, demographics often heavily influence manual screening.
2. **Brittle Keyword Filters** – A traditional ATS looks for words, not proficiency. It cannot tell the difference between a candidate who simply wrote 'Solved DSA problems' and a candidate who is a 'Codeforces Specialist with a 1500 rating'. It measures the *presence* of a keyword, not the actual *proficiency*. Our system bridges this exact gap."

---

### 🎤 Speaker 2: Prathmesh (Technical Architecture & The Mathematical Model)

**[Slide 3: Our Solution - The 'Retrieve-then-Rerank' Pipeline]**
"Thank you, Atharv. Inspired by *Nogueira and Cho's* research on two-stage retrieval architectures, we realized no single AI model can do this efficiently. So we built our 'Two Brains' pipeline.

The **First Brain is the Fast Filter**. We use a transformer embedding model called MiniLM to convert resumes and Job Descriptions into 384-dimensional mathematical vectors. 
Our Stage 1 Mathematical Model computes a combined score using:
`Stage 1 Score = √ (0.6 × Semantic Cosine Score + 0.4 × BM25Okapi Skill Ratio)`.
Applying the square-root curve normalization spreads values into an intuitive distribution, preventing score clustering. It instantly filters thousands of resumes down to the top 10."

**[Slide 4: The LLM Re-ranker]**
"But embeddings alone can't grade proficiency—they don't know a 3-star rating beats a 2-star rating. That’s where the **Second Brain** comes in. 

The top 10 resumes are sent to an advanced Large Language Model—Llama 3.3 70B via the Groq API. We prompt it to act as an expert technical recruiter to evaluate numbers, scale of projects, and metrics. 
The final fusion formula is: 
`Final Score = 0.9 × (LLM Score) + 0.1 × (Stage 1 Score)`. 
The LLM also generates a one-line human-readable explanation for *why* it ranked someone higher, making our system transparent and explainable."

---

### 🎤 Speaker 3: Harshal (Ethical AI, Experimental Results & Conclusion)

**[Slide 5: The Ethical AI Layer & Identity Masking]**
"Thank you, Prathmesh. While our pipeline finds the best skills, we also needed to fix the bias in hiring. We built an **Ethical AI Engine** directly into the backend middleware.

Before a recruiter sees the ranked results on our React dashboard, our backend scrubs all Personally Identifiable Information. Names are replaced with Neural IDs like 'CANDIDATE_VECTOR_8241'. The recruiter's first impression is based *purely* on merit. Only when they 'Fast-Track' a candidate does the system unmask their identity, logging it securely in an immutable Synaptic Audit Log."

**[Slide 6: Experimental Results, Ablation Study & Conclusion]**
"To validate our architecture, we conducted an Ablation Study. We tested the system using purely traditional keywords, pure LLM, and our hybrid model. Our hybrid approach achieved a peak **NDCG@10 of 0.94**, massively outperforming keyword methods which scored around 0.61. We found that the 90/10 weight ratio provided the optimal balance, where the embedding acts as a critical stability floor for the LLM's deep reasoning.

To conclude, **HireForge AI doesn't just read resumes; it understands them.** We built a system that thinks like a human recruiter but processes at the speed of a machine, with fairness built-in by default. Thank you. We are now open for questions and would love to show you a live demo."

---

## 🎯 Expected Q&A from External Examiners

**1. "You mentioned BM25Okapi and Cosine Similarity in Stage 1. Why use both?"**
* **Answer:** "Cosine similarity on the 384-dimensional MiniLM embeddings gives us the deep *contextual meaning* (e.g., knowing 'Machine Learning' is related to 'Data Science'). BM25Okapi is a probabilistic ranking function we use for the exact *skill canonicalization ratio*. Combining them ensures we don't miss semantic relationships while heavily weighting the presence of required hard skills."

**2. "Why the Square Root normalization in Stage 1?"**
* **Answer:** "In our testing, dense embeddings tend to cluster in the [0.20, 0.65] cosine similarity range. If we just mapped that directly, all candidates would look like a '50% match'. By applying a square-root curve transformation, we spread the distribution out, making the scores much more intuitive and readable for recruiters."

**3. "In your ablation study, why did pure LLM (weight 1.0) perform worse than the 90/10 Hybrid (0.94 NDCG)?"**
* **Answer:** "While LLMs are brilliant at reasoning, they can sometimes 'hallucinate' or get distracted by the prompt formatting. By retaining 10% of the vector embedding score, we anchor the LLM to pure mathematical semantic relevance. The embedding acts as a 'stability floor', resulting in our highest NDCG@10 score of 0.94."

**4. "Which research papers did you base your architecture on?"**
* **Answer:** "We grounded our work on three main pillars: (1) *Reimers and Gurevych (2019)* for the Sentence-BERT embedding logic, (2) *Nogueira and Cho (2020)* who proved that two-stage 'retrieve-then-rerank' is vastly superior to single-pass systems, and (3) *Raghavan et al. (2020)* on algorithmic hiring bias, which inspired our architectural identity masking."

**5. "How do you ensure data privacy and ethical compliance?"**
* **Answer:** "Our Ethical AI Layer scrubs PII at the middleware level before the response ever reaches the React Redux state. The frontend never caches real identities. For LLM processing, we use enterprise API endpoints where data is strictly excluded from model training."

---

## 💡 Top Tips for the Presentation

1. **The "Show, Don't Tell" Rule:** During the demo, show the exact test case from your report: **Atharv vs. Prathmesh vs. Aditya**. Demonstrate how the Embedding-only approach ranked Atharv #1 (because of CP keywords), but the Hybrid LLM approach correctly ranked Prathmesh #1 because it reasoned that a *Specialist (1563)* is better than a *2-Star* rating.
2. **Defend the Math Confidently:** If asked about the `0.6 / 0.4` or `0.9 / 0.1` weights, confidently state that these were derived empirically through your Ablation Study (referenced in your research paper). Examiners love empirically backed parameters.
3. **Handle Errors Gracefully:** If an error pops up during the live demo (e.g., Groq API timeout), immediately pivot and explain your "Graceful Degradation" feature. Point out how the system silently fell back to Stage 1 embedding scores without breaking the UI. That turns a bug into an architectural feature!
4. **Body Language & Handoffs:** When passing the baton to the next speaker, look at them and use their name. It shows great team coordination.
5. **Highlight the "Why":** Teachers love technical complexity, but they love *real-world problem solving* even more. Emphasize the **Identity Masking** and **Proficiency Reasoning**—it proves you are thinking about social impact and edge cases, not just writing code.
