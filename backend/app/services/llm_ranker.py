"""LLM-based candidate re-ranker using Groq (Llama 3.3 70B).

Takes a shortlist of candidates (pre-filtered by embedding similarity) and asks
the LLM to rank them holistically — reasoning about quantities, ratings, and
proficiency levels that embedding models cannot capture.
"""

import json
import logging
import re

from groq import Groq

from app.config import settings

logger = logging.getLogger(__name__)

_client: Groq | None = None


def _get_client() -> Groq:
    global _client
    if _client is None:
        if not settings.GROQ_API_KEY:
            raise RuntimeError("GROQ_API_KEY is not set")
        _client = Groq(api_key=settings.GROQ_API_KEY)
    return _client


def _build_prompt(job_description: str, job_skills: list[str], candidates: list[dict]) -> str:
    skills_line = ", ".join(job_skills) if job_skills else "(none specified)"

    candidate_blocks = []
    for c in candidates:
        text = (c.get("raw_text") or "").strip()
        if len(text) > 6000:
            text = text[:6000] + "\n...[truncated]"
        candidate_blocks.append(
            f"--- CANDIDATE id={c['id']} ---\n{text}\n--- END CANDIDATE {c['id']} ---"
        )
    candidates_text = "\n\n".join(candidate_blocks)

    return f"""You are a world-class technical recruiter with 15+ years of experience evaluating engineering candidates across every modern specialization. You rank candidates with the rigor of a FAANG hiring committee: evidence-based, skeptical of keyword stuffing, and attentive to signals that separate senior talent from surface-level fit.

JOB DESCRIPTION:
{job_description}

REQUIRED SKILLS: {skills_line}

CANDIDATES:
{candidates_text}

=========================================================================
CORE INSTRUCTIONS
=========================================================================

STEP 1 — CLASSIFY THE ROLE.
Before ranking, identify the PRIMARY role archetype the JD is asking for. Examples:
  - Competitive Programmer / Algorithm-heavy SWE
  - Backend Engineer / Distributed Systems
  - Full-Stack Developer (Web)
  - Frontend / UI Engineer
  - Mobile Engineer (iOS / Android / React Native / Flutter)
  - ML Engineer / Data Scientist / Research Engineer
  - Data Engineer / Analytics Engineer
  - DevOps / SRE / Platform / Cloud Engineer
  - Security Engineer / AppSec / Red Team / SOC Analyst
  - Embedded / Firmware / Hardware Engineer
  - Game Developer
  - QA / SDET / Test Automation
  - Blockchain / Smart Contract Engineer
  - AI/LLM Application Engineer (RAG, agents, prompt eng)

If the JD is ambiguous (e.g., "software engineer"), infer from the required skills and projects emphasized.

STEP 2 — APPLY THE RUBRIC FOR THAT ROLE (below). Ignore credentials that are irrelevant to the role archetype. A Codeforces Grandmaster is irrelevant for a Frontend role unless the JD specifies algorithmic depth.

STEP 3 — SCAN THE ENTIRE RESUME. Check Profile, Experience, Projects, Skills, Achievements, Certifications, Publications, and Extracurricular sections. Strong candidates often bury their best credentials at the bottom. Raw numbers beat framing.

STEP 4 — RANK DECISIVELY. Spread scores across the 0–100 range. Identical scores are almost never correct. Great candidate: 80–95. Solid match: 65–80. Average: 50–65. Weak: 30–50. Poor fit: 0–30.

=========================================================================
ROLE-SPECIFIC RUBRICS
=========================================================================

─── COMPETITIVE PROGRAMMING / ALGORITHMIC SWE ───
Evaluate on these axes (compare candidates axis-by-axis):
  Codeforces rating: Legendary Grandmaster > Int'l Grandmaster > Grandmaster (2400+) > International Master (2300+) > Master (2100+) > Candidate Master (1900+) > Expert (1600+) > Specialist (1400+) > Pupil (1200+) > Newbie > unrated
  CodeChef stars: 7★ (>2500) > 6★ (2200-2499) > 5★ (2000-2199) > 4★ (1800-1999) > 3★ (1600-1799) > 2★ (1400-1599) > 1★ (<1400)
  LeetCode: Guardian (top 3%) > Knight (top 10%) > unrated; problems solved: 1500+ > 1000+ > 500+ > 300+ > 100+
  AtCoder: Red (2800+) > Orange > Yellow > Blue > Cyan > Green > Brown > Gray
  Contest finals / medals: ICPC World Finalist > Regionalist > Google Kick Start round winner > Meta Hacker Cup Round 3+ > local college contest wins
  Problem-solving depth: consistent multi-platform activity beats one-platform grinding
IGNORE: unrelated frameworks, web projects, design skills. ONLY algorithmic signal matters.

─── BACKEND / DISTRIBUTED SYSTEMS ───
Strong signals (higher weight):
  - Production scale evidence ("X RPS", "X million users", "99.99% uptime", "P99 latency Xms")
  - Deep DB expertise: sharding, replication, query optimization, indexing strategies, transaction isolation levels
  - Distributed systems primitives: consensus (Raft/Paxos), CAP reasoning, eventual consistency, idempotency, retries
  - Message queues used in production: Kafka, RabbitMQ, SQS, Kinesis, NATS, BullMQ
  - Caching layers: Redis (with cluster mode / sentinel), Memcached, CDN strategies
  - Observability: structured logs, Prometheus/Grafana, OpenTelemetry, distributed tracing
  - Concurrency: threading/asyncio/coroutines, race condition handling, deadlock analysis
  - Framework depth: FastAPI, Spring Boot, Gin, Express with production tuning
  - Language proficiency relevant to backend: Go, Java, Python, Rust, Node.js, C++
Weak signals (low weight): CRUD tutorial projects, "REST API" alone without context, localhost-only demos.

─── FULL-STACK DEVELOPER (WEB) ───
Strong signals:
  - Balance: real projects with both frontend AND backend depth, not 90% one side
  - Production deployments with real users (not just localhost)
  - Modern stacks: Next.js + Node/FastAPI + Postgres, Remix, MERN, T3 stack, SvelteKit
  - Auth flows (JWT, OAuth, session mgmt), payment integrations (Stripe), third-party APIs
  - Understanding of performance (Lighthouse scores, code splitting, lazy loading)
  - State management depth: Redux, Zustand, React Query, SWR
  - SSR/SSG understanding, hydration issues, SEO considerations
Weak signals: only tutorial clones (Twitter clone, Netflix clone) without extension.

─── FRONTEND / UI ENGINEER ───
Strong signals:
  - Production React/Vue/Angular/Svelte depth; component architecture
  - Modern tooling: Vite, Webpack config, Turbopack, bundler understanding
  - Performance: lazy loading, code splitting, memoization, React Profiler usage, Core Web Vitals
  - Accessibility (WCAG AA/AAA, ARIA, keyboard nav, screen reader testing)
  - Design systems, Storybook, tokenization, theming
  - CSS depth: Tailwind, CSS-in-JS, Grid/Flexbox mastery, animation (Framer Motion, GSAP)
  - TypeScript depth (generics, conditional types)
  - Testing: Jest, React Testing Library, Playwright, Cypress
Weak signals: mentioning HTML/CSS/JS without modern framework depth.

─── MOBILE ENGINEER ───
Strong signals:
  - Shipped apps on App Store / Play Store (bonus: download counts, ratings)
  - Native depth: Swift/SwiftUI (iOS), Kotlin/Jetpack Compose (Android)
  - Cross-platform: React Native (bridging, reanimated) or Flutter (widget tree, platform channels)
  - Push notifications, deep linking, offline-first, background tasks
  - Mobile-specific performance work (jank, 60fps, battery usage)
  - MVVM/MVI/Clean Architecture patterns
  - CI/CD with Fastlane, Xcode Cloud, Bitrise
Weak signals: "built an app in college" with no store link.

─── ML ENGINEER / DATA SCIENTIST / AI RESEARCHER ───
Strong signals (tiered):
  Tier S: First-author publications at top venues (NeurIPS, ICML, ICLR, ACL, CVPR, EMNLP, KDD); Kaggle Grandmaster
  Tier A: Kaggle Master / Gold medals; PhD/MS thesis in ML; production ML systems with measurable impact
  Tier B: Kaggle Silver/Bronze; deployed ML models to production with monitoring; deep framework expertise
  Tier C: Multiple trained-from-scratch models (not just loaded pretrained); understanding of training dynamics
  Tier D: Only sklearn-style projects, tutorial notebooks
Framework depth: PyTorch / JAX / training loops > TensorFlow > Keras > sklearn
Domain specialization signals (match to JD): NLP (transformers, tokenization, RLHF), CV (CNNs, diffusion, ViT), RL (policy gradients, PPO), Tabular (XGBoost, LightGBM), Time-series (Prophet, N-BEATS), Recommendation (two-tower, matrix factorization)
Math depth: linear algebra, optimization, probability, statistics — evidenced through coursework, projects, or papers
MLOps: experiment tracking (Weights & Biases, MLflow), serving (TorchServe, Triton, vLLM), feature stores (Feast)

─── DATA ENGINEER / ANALYTICS ENGINEER ───
Strong signals:
  - Pipeline orchestration: Airflow, Dagster, Prefect, Luigi
  - Warehouse expertise: Snowflake, BigQuery, Redshift, Databricks
  - Transformation: dbt (models, tests, docs), Spark (PySpark/Scala), Flink
  - Streaming: Kafka, Kinesis, Pulsar
  - Data modeling: star/snowflake schemas, SCD Type 2, Kimball/Inmon methodologies
  - Columnar formats: Parquet, ORC, Delta, Iceberg, Hudi
  - SQL depth: window functions, CTEs, query optimization, partitioning
  - Data quality: Great Expectations, Soda, Monte Carlo
Weak signals: only pandas scripts, CSV file processing.

─── DEVOPS / SRE / PLATFORM / CLOUD ───
Strong signals (certifications tiered):
  AWS: Solutions Architect Professional / DevOps Engineer Pro > Solutions Architect Associate > Cloud Practitioner
  GCP: Professional Cloud Architect > Associate Cloud Engineer
  Azure: Solutions Architect Expert > Administrator Associate
  Kubernetes: CKS > CKA > CKAD
  HashiCorp: Terraform Associate, Vault Associate
Core signals:
  - IaC depth: Terraform modules, Pulumi, CloudFormation at scale
  - Kubernetes in production (not just 'kubectl run'): operators, CRDs, Helm charts, service mesh (Istio/Linkerd)
  - CI/CD pipelines with complexity: GitHub Actions, GitLab CI, Jenkins, ArgoCD, Flux
  - Observability stack: Prometheus + Grafana + Loki + Tempo, Datadog, New Relic
  - Incident response experience, SLO/SLI definition, error budgets, blameless postmortems
  - Network/security: VPC design, IAM policies, WAF, Zero Trust, mTLS
  - Container depth: Docker, containerd, image layer optimization, distroless
Weak signals: only mentioning "deployed to AWS" without specifics.

─── SECURITY ENGINEER / APPSEC / OFFENSIVE SECURITY ───
Strong signals:
  - Certifications: OSCP/OSCE/OSEP > CEH; GPEN/GXPN (SANS); CISSP (management track)
  - CTF rankings: top 100 on CTFtime, DEFCON quals, PicoCTF high scores, TryHackMe / HackTheBox Pro / Elite
  - CVEs published (bonus for scored/named CVEs), bug bounty earnings, Hall of Fame mentions (Google VRP, Meta BBP)
  - Tools mastery: Burp Suite Pro, Metasploit, nmap, Ghidra, IDA Pro, Wireshark
  - Specialization depth: web (OWASP Top 10 deep dives), binary exploitation, mobile, cloud, network
  - Research publications or talks at DEFCON/Black Hat/local conferences
  - Red Team / Purple Team experience in real engagements
Weak signals: "interested in cybersecurity" with only intro course completion.

─── EMBEDDED / FIRMWARE / HARDWARE ───
Strong signals: C/C++ for constrained systems, RTOS (FreeRTOS, Zephyr), microcontroller experience (ARM Cortex, AVR, ESP32), protocol depth (I2C, SPI, UART, CAN), PCB design, FPGA (Verilog/VHDL), driver development, bare-metal programming, low-level debugging (JTAG, oscilloscope usage).

─── GAME DEVELOPER ───
Strong signals: Unity or Unreal depth, shipped games (itch.io / Steam / mobile stores), graphics programming (shaders, HLSL/GLSL), game engine internals, game physics, multiplayer networking, game jams (Ludum Dare participation), procedural generation, AI pathfinding.

─── QA / SDET / TEST AUTOMATION ───
Strong signals: framework building (not just writing tests), Selenium/Playwright/Cypress at scale, API test automation (REST Assured, Karate), performance testing (JMeter, k6, Locust), CI integration, flakiness analysis, test strategy design, ISTQB certification.

─── BLOCKCHAIN / SMART CONTRACTS ───
Strong signals: Solidity depth, Foundry/Hardhat fluency, deployed contracts on mainnet (not just testnet), security audit experience, DeFi protocol understanding, zero-knowledge proofs, EIP authorship, Ethereum / Solana / Cosmos ecosystem depth.

─── AI/LLM APPLICATION ENGINEER ───
Strong signals: RAG pipelines with production-grade retrieval (hybrid search, reranking), agent frameworks (LangGraph, CrewAI, AutoGen), LLM evaluation (ragas, promptfoo), vector DB expertise (Qdrant, Pinecone, Weaviate, pgvector), prompt engineering patterns (few-shot, CoT, tree-of-thoughts), fine-tuning experience (LoRA, QLoRA), inference optimization (vLLM, quantization), observability for LLM apps (LangSmith, Helicone).

=========================================================================
UNIVERSAL CROSS-ROLE SIGNALS (apply on top of role rubric)
=========================================================================

POSITIVE SIGNALS:
  + Quantified impact ("reduced latency by 40%", "served 1M users", "cut costs by $X")
  + Tier-1 company/internship (FAANG, top startups, reputable product companies) > Tier-2 > service companies > no internship
  + Strong CGPA from a reputable institution when role is new-grad focused (>8.5 = strong, 7.5-8.5 = solid, <7.5 = caveat)
  + Open-source contributions (esp. to well-known repos), GitHub star counts
  + Technical blog posts, conference talks, published papers
  + Leadership of technical initiatives (tech lead, team of N, mentoring)
  + Continuous growth trajectory across roles
  + Relevant coursework and certifications matching the role

NEGATIVE SIGNALS:
  - Keyword stuffing without supporting project evidence
  - Only tutorial clones with no original extension
  - No production/deployed evidence for a senior role
  - Generic skills list ("Good communication, teamwork") dominating over technical substance
  - Gaps that contradict JD requirements

=========================================================================
RANKING PHILOSOPHY
=========================================================================

- Trust evidence, distrust claims. "Expert in X" without project evidence is weaker than a project demonstrating X without the label.
- Depth beats breadth. One rigorously executed project is more valuable than ten shallow ones.
- Recency matters. 2024-2025 work > 2020 work for most roles (esp. frontend, ML).
- Quantified impact beats unquantified claims.
- Ignore aesthetic framing of the resume — focus on substance.
- If two candidates seem equal, break ties on: (1) depth in the single most critical JD skill, (2) relevant internship/production evidence, (3) impact metrics.
- Be decisive. Avoid lazy "everyone gets 75".

=========================================================================
OUTPUT FORMAT — RETURN ONLY VALID JSON
=========================================================================

No markdown. No code fences. No commentary. Just this:

{{
  "rankings": [
    {{
      "id": <candidate_id>,
      "score": <integer 0-100>,
      "reason": "<one sentence citing the SPECIFIC top 1-2 signals that drove this score, using role-appropriate vocabulary (ratings for CP, scale numbers for backend, model depth for ML, certifications for DevOps, etc.)>"
    }}
  ]
}}

Include EVERY candidate. Sort by score descending. Be decisive and spread scores meaningfully."""


def _extract_json(text: str) -> dict:
    text = text.strip()
    if text.startswith("```"):
        text = re.sub(r"^```(?:json)?\s*", "", text)
        text = re.sub(r"\s*```$", "", text)
    match = re.search(r"\{.*\}", text, re.DOTALL)
    if not match:
        raise ValueError(f"No JSON object found in LLM response: {text[:200]}")
    return json.loads(match.group(0))


def rerank_with_llm(
    job_description: str,
    job_skills: list[str],
    candidates: list[dict],
) -> dict[int, dict]:
    """Call Groq to rank candidates. Returns dict keyed by candidate id.

    Each value: {"score": 0-1 float, "reason": str}.
    On any failure, returns an empty dict so the caller can fall back to embeddings.
    """
    if not candidates:
        return {}

    try:
        client = _get_client()
    except RuntimeError as e:
        logger.warning("LLM rerank skipped: %s", e)
        return {}

    prompt = _build_prompt(job_description, job_skills, candidates)

    try:
        response = client.chat.completions.create(
            model=settings.GROQ_MODEL,
            messages=[
                {"role": "system", "content": "You are an expert technical recruiter. Always respond with valid JSON only."},
                {"role": "user", "content": prompt},
            ],
            temperature=0.2,
            response_format={"type": "json_object"},
        )
        raw = response.choices[0].message.content or ""
        data = _extract_json(raw)
    except Exception as e:
        logger.exception("LLM rerank failed: %s", e)
        return {}

    out: dict[int, dict] = {}
    for entry in data.get("rankings", []):
        try:
            cid = int(entry["id"])
            score = float(entry["score"]) / 100.0
            score = max(0.0, min(1.0, score))
            out[cid] = {"score": score, "reason": str(entry.get("reason", ""))[:500]}
        except (KeyError, TypeError, ValueError):
            continue
    return out
