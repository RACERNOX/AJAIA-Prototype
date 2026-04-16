# Diligence Engine — Prototype

A lightweight Investment Scouting & Due Diligence prototype built for the Ajaia AI Delivery Lead challenge.

Enter any US-listed stock ticker and get a structured diligence report in under 30 seconds — live market data, recent news, and an AI-generated analysis.

---

## What It Does

- Accepts a stock ticker as input (e.g. AAPL, TSLA, NVDA)
- Fetches live market data via `yfinance` (price, market cap, P/E, revenue, margins, 52w range)
- Pulls recent news headlines via Google News RSS
- Sends both to Gemini 2.0 Flash with a structured prompt
- Returns a 5-section diligence note: Company Snapshot, Metrics Assessment, Recent Developments, Risk Flags, Caution Notes

---

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite + Tailwind CDN |
| Backend | FastAPI + Uvicorn (Python) |
| Market Data | yfinance (free, no key) |
| News | feedparser + Google News RSS (free, no key) |
| AI Synthesis | Gemini 2.0 Flash (Google AI) |

---

## Setup

### Prerequisites

- Python 3.9+
- Node 18+
- A Gemini API key ([get one free at aistudio.google.com](https://aistudio.google.com))

### 1. Backend

```bash
cd prototype/backend
cp .env.example .env
# Edit .env and add your Gemini API key
pip3 install -r requirements.txt
python3 -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

Backend runs at: `http://localhost:8000`

### 2. Frontend

```bash
cd prototype/frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:5173`

### 3. Use It

Open `http://localhost:5173` in your browser, type a ticker (e.g. `AAPL`), and click **Analyze**.

---

## API

```
POST http://localhost:8000/analyze
Content-Type: application/json

{ "ticker": "AAPL" }
```

Returns:
```json
{
  "market_data": { "name": "Apple Inc.", "price": "$...", ... },
  "news": [{ "title": "...", "link": "...", "published": "...", "source": "..." }],
  "summary": "## 1. Company Snapshot\n..."
}
```

---

## Project Structure

```
prototype/
├── backend/
│   ├── main.py          # FastAPI app — data fetching + Gemini synthesis
│   ├── requirements.txt
│   ├── .env             # Your API key (not committed)
│   └── .env.example     # Template
└── frontend/
    ├── src/
    │   ├── App.jsx      # All UI logic — single component
    │   └── index.css
    ├── index.html       # Tailwind CDN loaded here
    └── package.json
```

---

## Assumptions & Limitations

- Covers **US-listed public companies only** (yfinance coverage)
- News quality varies for small-cap or recently listed companies
- AI output requires analyst review — not for direct investment decisions
- No authentication, rate limiting, or persistent storage (prototype scope)

---

## What Would Come Next

- Add SEC EDGAR filing integration (10-K risk factors, 8-K events)
- Structured scoring model for each diligence dimension
- PDF export of the diligence report
- User authentication + report history
- Scheduled monitoring for portfolio of tickers
