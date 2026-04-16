# AI Workflow Note

**Candidate:** Shubham Solanki  
**Challenge:** AI Delivery Lead Technical Challenge — Ajaia LLC

---

## Tools Used

- **Cursor (Claude Sonnet)** — primary coding assistant throughout the build
- **Gemini 2.0 Flash** — embedded in the prototype as the synthesis engine

---

## How I Used AI

**Cursor accelerated:**
- Scaffolding the FastAPI backend structure and Pydantic models
- Writing the initial `yfinance` data extraction and field mapping
- Drafting the Streamlit-to-React migration decision (I switched to React mid-plan)
- Generating the `MarkdownSummary` JSX component for parsing Gemini's structured output
- Writing the delivery plan document structure and section templates

**Gemini 2.0 Flash is used inside the prototype itself** to synthesize raw market data and news into a structured 5-section diligence note. The prompt design — what sections to include, the instruction to be direct and non-generic, the constraint to base risk flags specifically on the data provided — was my own decision.

---

## What Was Mine

- **Architecture decisions:** Choosing FastAPI over Flask, React over Streamlit, single-prompt Gemini call over multiple calls, feedparser over NewsAPI
- **Prompt engineering:** The structure and tone of the Gemini synthesis prompt — specifically the directive to avoid generic risk factors and base findings on the actual data provided
- **Error handling strategy:** Identifying the five failure modes (invalid ticker, yfinance crash, Gemini timeout, bad JSON error body, invalid date rendering) and deciding how each should degrade gracefully
- **Scope decisions:** What to cut (SEC EDGAR, database, auth) and what to keep given the 4-hour constraint
- **Delivery plan content:** Phase gate criteria, the risk/mitigation table, launch readiness thresholds — these reflect my own delivery experience and judgment
- **Debugging:** Resolving the Gemini model name mismatch (`gemini-1.5-flash` not available on this key → `gemini-2.0-flash`), fixing operator precedence bug in the ticker validation check

---

## What AI Accelerated vs. What It Could Not Replace

AI significantly reduced the time spent on boilerplate — data model definitions, CORS setup, CSS layout patterns, markdown parsing logic. Without it, the prototype would have taken 3+ hours instead of ~90 minutes.

What AI could not replace: deciding what the right architecture was for a 4-hour prototype, knowing which error cases actually matter in a financial data context, writing the delivery plan with realistic phase timelines and risk assessments grounded in actual delivery experience, and making the tradeoff calls on scope.

The AI was a force multiplier on execution. The judgment layer was entirely mine.
