import os
import feedparser
import yfinance as yf
import google.generativeai as genai
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class AnalyzeRequest(BaseModel):
    ticker: str


def fmt(val, prefix="", suffix="", decimals=2):
    if val is None:
        return "N/A"
    if isinstance(val, (int, float)):
        if val >= 1_000_000_000:
            return f"{prefix}{val/1_000_000_000:.1f}B{suffix}"
        if val >= 1_000_000:
            return f"{prefix}{val/1_000_000:.1f}M{suffix}"
        return f"{prefix}{round(val, decimals)}{suffix}"
    return str(val)


def get_market_data(ticker: str) -> dict:
    try:
        info = yf.Ticker(ticker).info
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Failed to fetch market data: {str(e)}")

    # yfinance returns a near-empty dict (no quoteType) for unknown tickers
    if not info or not info.get("quoteType"):
        raise HTTPException(status_code=404, detail=f"Ticker '{ticker}' not found or has no data.")

    price = info.get("currentPrice") or info.get("regularMarketPrice")
    prev_close = info.get("previousClose") or info.get("regularMarketPreviousClose")
    change_pct = ((price - prev_close) / prev_close * 100) if price and prev_close else None

    # recommendationKey can be explicitly None, not just missing
    raw_rating = info.get("recommendationKey") or "N/A"

    return {
        "name": info.get("longName") or info.get("shortName") or ticker.upper(),
        "ticker": ticker.upper(),
        "sector": info.get("sector") or "N/A",
        "industry": info.get("industry") or "N/A",
        "country": info.get("country") or "N/A",
        "price": fmt(price, prefix="$"),
        "change_pct": fmt(change_pct, suffix="%") if change_pct is not None else "N/A",
        "market_cap": fmt(info.get("marketCap"), prefix="$"),
        "pe_ratio": fmt(info.get("trailingPE")),
        "forward_pe": fmt(info.get("forwardPE")),
        "revenue": fmt(info.get("totalRevenue"), prefix="$"),
        "profit_margin": fmt(info.get("profitMargins"), suffix="%") if info.get("profitMargins") else "N/A",
        "debt_to_equity": fmt(info.get("debtToEquity")),
        "week_52_low": fmt(info.get("fiftyTwoWeekLow"), prefix="$"),
        "week_52_high": fmt(info.get("fiftyTwoWeekHigh"), prefix="$"),
        "analyst_rating": raw_rating.replace("_", " ").title(),
        "description": (info.get("longBusinessSummary") or "")[:500],
    }


def get_news(company_name: str, ticker: str) -> list[dict]:
    try:
        query = f"{company_name} {ticker} stock"
        url = f"https://news.google.com/rss/search?q={query.replace(' ', '+')}&hl=en-US&gl=US&ceid=US:en"
        feed = feedparser.parse(url)
        articles = []
        for entry in feed.entries[:6]:
            articles.append({
                "title": entry.get("title", ""),
                "link": entry.get("link", ""),
                "published": entry.get("published", ""),
                "source": (entry.get("source") or {}).get("title", ""),
            })
        return articles
    except Exception:
        return []  # news is non-critical — return empty list, don't fail the request


def synthesize(market_data: dict, news: list[dict]) -> str:
    news_text = "\n".join(
        f"- {a['title']} ({a['source']}, {a['published'][:16] if a['published'] else 'date unknown'})"
        for a in news
    ) or "No recent news found."

    prompt = f"""You are a senior financial diligence analyst. Based on the data below, write a concise, structured diligence note.

[COMPANY]
Name: {market_data['name']} ({market_data['ticker']})
Sector: {market_data['sector']} | Industry: {market_data['industry']}
Country: {market_data['country']}
Description: {market_data['description']}

[MARKET DATA]
Price: {market_data['price']} ({market_data['change_pct']} today)
Market Cap: {market_data['market_cap']}
P/E (Trailing): {market_data['pe_ratio']} | P/E (Forward): {market_data['forward_pe']}
Revenue: {market_data['revenue']} | Profit Margin: {market_data['profit_margin']}
Debt/Equity: {market_data['debt_to_equity']}
52-Week Range: {market_data['week_52_low']} – {market_data['week_52_high']}
Analyst Consensus: {market_data['analyst_rating']}

[RECENT NEWS]
{news_text}

Write the diligence note in exactly this format — use markdown:

## 1. Company Snapshot
(2–3 sentences: what the company does, its market position, and any notable context)

## 2. Financial Metrics Assessment
(Brief assessment of the key numbers above — valuation, profitability, leverage, momentum)

## 3. Recent Developments
(Summarize the news themes — what is happening around this company right now)

## 4. Risk Factors & Red Flags
(Bullet list of 3–5 risks based on the data and news — be specific, not generic)

## 5. Diligence Notes & Caution Flags
(Overall diligence stance: any significant concerns, unknowns, or reasons for further investigation)

Keep each section concise. Be direct. Do not hedge excessively."""

    try:
        model = genai.GenerativeModel("gemini-2.0-flash")
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"AI synthesis failed: {str(e)}")


@app.post("/analyze")
def analyze(req: AnalyzeRequest):
    ticker = req.ticker.strip().upper()
    if not ticker:
        raise HTTPException(status_code=400, detail="Ticker cannot be empty.")
    market_data = get_market_data(ticker)
    news = get_news(market_data["name"], ticker)
    summary = synthesize(market_data, news)
    return {
        "market_data": market_data,
        "news": news,
        "summary": summary,
    }


@app.get("/")
def root():
    return {"service": "Diligence Engine API", "usage": "POST /analyze with {\"ticker\": \"AAPL\"}"}


@app.get("/health")
def health():
    return {"status": "ok"}
