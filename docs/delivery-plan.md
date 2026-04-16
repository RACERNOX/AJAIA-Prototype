# Investment Scouting & Diligence Engine — Delivery Plan

**Client/Initiative:** Ajaia Internal AI Workflow — Investment Scouting & Diligence Engine  
**Author:** Shubham Solanki  
**Date:** April 2026

---

## 1. Solution Architecture

### Overview

The system accepts a public company ticker or name, aggregates data from two public sources, synthesizes it via an LLM, and presents a structured diligence report through a web UI.

### Architecture Diagram

```
┌──────────────────────────────────────────────────────┐
│                   User Interface                     │
│          React Web App (Vite + Tailwind)             │
│    [ Ticker Input ] → [ Analyze Button ]             │
└────────────────────┬─────────────────────────────────┘
                     │ POST /analyze
                     ▼
┌──────────────────────────────────────────────────────┐
│                  API Layer                           │
│             FastAPI (Python)                         │
│              POST /analyze                           │
└────┬──────────────────────┬───────────────────────── ┘
     │                      │
     ▼                      ▼
┌──────────────┐   ┌─────────────────────┐
│  yfinance    │   │  Google News RSS     │
│  (no key)    │   │  via feedparser      │
│              │   │  (no key)            │
│ · Price      │   │ · 5 recent headlines │
│ · Market Cap │   │ · Publish dates      │
│ · P/E Ratio  │   │ · Source URLs        │
│ · Sector     │   └─────────────────────┘
│ · 52w Range  │
│ · Revenue    │
└──────┬───────┘
       │
       └────────────────────┐
                            ▼
              ┌─────────────────────────┐
              │  Synthesis Layer        │
              │  Gemini 1.5 Flash API   │
              │                         │
              │  Single structured      │
              │  prompt → diligence     │
              │  note (5 sections)      │
              └────────────┬────────────┘
                           │
                           ▼
              ┌─────────────────────────┐
              │  Output (React UI)      │
              │                         │
              │  · Company Snapshot     │
              │  · Financial Metrics    │
              │  · Recent News          │
              │  · Risk Flags           │
              │  · Diligence Summary    │
              └────────────┬────────────┘
                           │
                           ▼
              ┌─────────────────────────┐
              │  Human Review Point     │
              │                         │
              │  Analyst validates LLM  │
              │  output before any      │
              │  downstream use         │
              └─────────────────────────┘
```

### Component Notes

| Component | Technology | Rationale |
|-----------|-----------|-----------|
| Frontend | React + Vite + Tailwind CDN | Fast to build, clean UI, easy to demo |
| API Layer | FastAPI + Uvicorn | Lightweight Python server, async-ready |
| Market Data | yfinance | Free, no API key, covers all US public companies |
| News | feedparser + Google News RSS | Free, no key, real-time headlines |
| Synthesis | Gemini 1.5 Flash | Fast, cost-effective, strong instruction-following |

---

## 2. Delivery Phases

| Phase | Name | Timeline | Key Activities |
|-------|------|----------|----------------|
| 1 | Discovery & Alignment | Week 1–2 | Stakeholder interviews, define success criteria, agree on output format, confirm data source access |
| 2 | Data & Source Validation | Week 2–3 | Spike on all data sources, measure coverage across ticker types, identify gaps for small-cap / international companies |
| 3 | Prototype / MVP Build | Week 3–6 | Build ingestion pipeline, Gemini synthesis integration, basic web UI, internal demo to stakeholders |
| 4 | Internal QA & Calibration | Week 6–7 | Analyst review of 20–30 sample reports, tune risk flag logic, hallucination audit, latency benchmarking |
| 5 | Pilot Launch | Week 8–10 | 2–3 internal users on monitored rollout, structured feedback loop, weekly check-ins |
| 6 | Iteration & Scale | Week 10+ | Expand data sources, harden infrastructure, add scheduling/batch runs, define KPIs and tracking |

### Phase Gate Criteria

- **Phase 1 → 2:** Success criteria documented and signed off by primary stakeholder
- **Phase 2 → 3:** At least 2 data sources validated across 20+ tickers with acceptable coverage
- **Phase 3 → 4:** Working prototype reviewed by at least 1 domain expert
- **Phase 4 → 5:** Hallucination rate below threshold, latency under 30s, error handling confirmed
- **Phase 5 → 6:** Pilot feedback documented, at least 2 users confirm output is useful

---

## 3. Dependencies & Risks

### Dependencies

- **yfinance library** — unofficial Yahoo Finance wrapper; no SLA or guaranteed uptime
- **Google News RSS feed** — informal feed, structure can change without notice
- **Gemini API** — requires active billing account and API quota headroom
- **Python 3.9+** runtime environment for backend
- **Node 18+** for frontend build

### Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| yfinance breaks or gets throttled by Yahoo | Medium | High | Abstract data layer; fallback to Alpha Vantage or Polygon.io free tier |
| LLM hallucination on financial figures | High | High | Mandatory human review point; never surface raw LLM output as factual; display source data alongside summary |
| Google News RSS returns irrelevant or low-quality articles | Medium | Medium | Filter by recency (< 30 days); keyword-match company name; log cases where < 3 articles returned |
| Poor data coverage for small-cap or international companies | High | Medium | Clearly state scope as US-listed public companies in v1; expand in later phases |
| No litigation detection beyond news keyword matching | High | Low (prototype) | Flag as known limitation; add SEC EDGAR 8-K parsing and legal news source integration in v2 |
| Stakeholder success criteria drift | Medium | High | Lock definition of "good output" in Phase 1 gate; revisit only at phase boundaries |
| API cost overrun if usage scales unexpectedly | Low | Medium | Set Gemini billing cap; add request rate limiting to FastAPI endpoint |
| Security / compliance if applied to non-public data | Low (v1) | High | Confirm scope is public data only; conduct security review before any expansion |

---

## 4. Launch Readiness Checklist

### Technical Readiness

- [ ] All data sources tested across 50+ tickers including small-cap (< $500M market cap)
- [ ] API error handling confirmed: graceful failure when ticker not found or data unavailable
- [ ] Response latency under 30 seconds for a complete report (p95)
- [ ] CORS configured correctly; frontend communicates with backend without issues
- [ ] Environment variables (API keys) managed securely; no keys hardcoded

### Output Quality

- [ ] LLM output reviewed by at least 2 analysts across 20+ sample reports
- [ ] Factual error rate below 5% on verifiable financial figures (cross-checked against source data)
- [ ] Risk flag section reliably surfaces at least 1 meaningful caution for companies with known issues
- [ ] Output is readable and useful to a non-technical stakeholder without additional explanation

### Process & Governance

- [ ] Stakeholder sign-off on output format and risk flag definitions obtained
- [ ] Human review step documented in user-facing interface (disclaimer added to UI)
- [ ] Runbook written: what to do if backend fails, Gemini API times out, or yfinance returns empty data
- [ ] Monitoring in place: backend logs errors, alerts on repeated failures

### Operational Support

- [ ] README and setup instructions tested by someone other than the author
- [ ] Deployment environment confirmed (local, cloud, or internal server)
- [ ] On-call or support contact defined for pilot period

---

## 5. Executive / Client Status Update

**To:** Ajaia Leadership  
**From:** Shubham Solanki, AI Delivery Lead  
**Re:** Investment Scouting & Diligence Engine — Prototype Update  
**Date:** April 2026

---

We have completed the first working prototype of the Investment Scouting & Diligence Engine. The system currently accepts any publicly traded US company ticker, pulls live market data and recent news, and generates a structured diligence report in under 30 seconds — compressing what would typically take an analyst 2–4 hours of initial research into a near-instant output.

The prototype covers company snapshot, key financial metrics, recent news developments, and an AI-generated risk flag summary. It is running locally and ready for an internal demo.

**What's working:** Data ingestion from two public sources (market data + news), Gemini-powered synthesis, and a clean web interface for non-technical users.

**Key open item:** LLM output quality requires analyst review before any production use. We are scheduling a calibration session with 2–3 domain experts to validate accuracy across a sample set of 20+ companies.

**Next milestone:** Internal QA complete and pilot launch with 2–3 users by end of Week 10.

We are on track. No blockers at this time.
