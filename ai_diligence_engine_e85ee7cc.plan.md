---
name: AI Diligence Engine
overview: Build exactly what is asked — 5 delivery docs + 1 working prototype + README + AI note — using FastAPI backend + React frontend with Gemini synthesis, within 4 hours.
todos:
  - id: setup
    content: "Setup: create docs/ and prototype/ folders, install 4 dependencies, create .env.example"
    status: pending
  - id: docs
    content: "Docs: write single delivery-plan.md with all 5 required sections"
    status: pending
  - id: prototype
    content: "Prototype: build prototype/app.py — data fetch + Gemini synthesis + Streamlit UI"
    status: pending
  - id: readme-note
    content: "Wrap-up: write prototype/README.md and docs/ai-workflow-note.md"
    status: pending
  - id: video
    content: "Video: record 5-8 min unlisted YouTube walkthrough and submit Drive link"
    status: pending
isProject: false
---

# AI Delivery Lead Challenge — Stripped-Down 4-Hour Plan

## Deliverables Checklist (exactly what is asked)

- Architecture overview
- Phased delivery plan
- Dependency / risk view
- Launch readiness checklist
- Executive/client status update
- Rough working prototype
- AI workflow note
- Walkthrough video (YouTube link)

---

## Stack

**Backend (Python):**

- `fastapi` + `uvicorn` — single `/analyze` endpoint
- `yfinance` — market data + company info (free, no key)
- `feedparser` — Google News RSS headlines (free, no key)
- `google-generativeai` — Gemini 1.5 Flash synthesis (your credits)

**Frontend (React):**

- Vite + React — `npm create vite@latest`
- Single `App.jsx` component, Tailwind CDN for styling
- No external UI library — keep it simple

**Cut:** Streamlit, SEC EDGAR, any database, any scraping beyond RSS.

---

## Time Budget (240 min)

- Setup (Vite init + pip install): **15 min**
- Part 1 docs (all 5 sections, one file): **45 min**
- Backend `main.py` (FastAPI + data + Gemini): **45 min**
- Frontend `App.jsx` (React UI): **45 min**
- README + AI workflow note: **10 min**
- Video + Drive upload + submit: **30 min**
- Buffer: **50 min**

---

## File Output (everything goes in Drive)

```
Ajaia-Submission/
├── docs/
│   ├── delivery-plan.md     ← all 5 Part 1 sections in one file
│   └── ai-workflow-note.md
└── prototype/
    ├── backend/
    │   ├── main.py          ← FastAPI app, one /analyze POST endpoint
    │   ├── requirements.txt
    │   └── .env.example
    └── frontend/
        ├── src/
        │   └── App.jsx      ← single React component, all UI here
        ├── index.html
        └── package.json
```

---

## Part 1 — `docs/delivery-plan.md` (45 min)

Five sections, one markdown file, no fluff:

**Section 1 — Architecture** (text diagram, not a drawing tool):

```
[Input: Ticker]
    ↓
[Ingestion]
  yfinance     → price, market cap, P/E, sector, 52w range
  Google News  → 5 recent headlines
    ↓
[Synthesis — Gemini 1.5 Flash]
  Single structured prompt → diligence note
    ↓
[Output — Streamlit]
  Snapshot | Metrics | News | Risk Flags | Diligence Summary
    ↓
[Human Review]
  Analyst validates before any downstream use
```

**Section 2 — Delivery Phases:** 6 phases with week ranges (Discovery → Validation → MVP → QA → Pilot → Scale)

**Section 3 — Dependencies & Risks:** 6–7 bullets (yfinance instability, hallucination, news quality, stakeholder drift, compliance)

**Section 4 — Launch Readiness Checklist:** 8–9 checkboxes (data tested, LLM quality reviewed, latency <30s, error handling, stakeholder sign-off, runbook exists)

**Section 5 — Executive Status Update:** ~150 words, plain English, no jargon

---

## Part 2 — Prototype (90 min total)

### Backend — `prototype/backend/main.py` (45 min)

FastAPI, one endpoint:

```python
# POST /analyze  { "ticker": "AAPL" }
# returns JSON: { market_data, news, summary }

get_market_data(ticker)   # yfinance → price, market cap, P/E, sector, 52w range
get_news(company_name)    # feedparser Google News RSS → 5 headlines
synthesize(data, news)    # one Gemini call → structured diligence string
```

**One Gemini call per run:**

```
You are a financial diligence analyst. Produce a structured note with:
1. Company Snapshot
2. Financial Metrics Assessment
3. Recent Developments
4. Risk Factors & Red Flags
5. Diligence Notes / Caution Flags

[MARKET DATA] {data}
[RECENT NEWS] {news}
```

### Frontend — `prototype/frontend/src/App.jsx` (45 min)

Single React component, clean minimal layout:

- Ticker input + Analyze button
- Loading spinner while fetching
- 5 result cards: Snapshot | Metrics | News | Risk Flags | Diligence Summary
- Tailwind CDN for styling, no component library
- `fetch('http://localhost:8000/analyze', { method: 'POST', body: ... })`

---

## Part 3 — README + AI Note (10 min)

`README.md`: run backend (`uvicorn main:app`), run frontend (`npm run dev`), open browser

`ai-workflow-note.md`: 1 short paragraph — tools used, what AI generated, what decisions were yours

---

## Part 4 — Video (30 min)

5–8 min unlisted YouTube. Cover:

- Architecture (point at the text diagram in the doc)
- Live prototype demo with 1 ticker (e.g. AAPL)
- Delivery phases rationale
- What you prioritised / cut due to time
- What you'd build next

