import { useState } from "react";

const API = "http://localhost:8000";

const SUGGESTIONS = ["AAPL", "TSLA", "NVDA", "MSFT", "AMZN", "META", "GOOGL"];

function Pill({ children, color = "slate" }) {
  const map = {
    indigo: "bg-indigo-500/10 text-indigo-300 border-indigo-500/20",
    emerald: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
    red: "bg-red-500/10 text-red-300 border-red-500/20",
    amber: "bg-amber-500/10 text-amber-300 border-amber-500/20",
    slate: "bg-slate-700/40 text-slate-300 border-slate-600/30",
    violet: "bg-violet-500/10 text-violet-300 border-violet-500/20",
  };
  return (
    <span className={`inline-flex items-center border text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full ${map[color]}`}>
      {children}
    </span>
  );
}

function StatCard({ label, value, sub, accent }) {
  const accents = {
    indigo: "from-indigo-500/10 to-transparent border-indigo-500/20 hover:border-indigo-500/40",
    violet: "from-violet-500/10 to-transparent border-violet-500/20 hover:border-violet-500/40",
    emerald: "from-emerald-500/10 to-transparent border-emerald-500/20 hover:border-emerald-500/40",
    amber: "from-amber-500/10 to-transparent border-amber-500/20 hover:border-amber-500/40",
    cyan: "from-cyan-500/10 to-transparent border-cyan-500/20 hover:border-cyan-500/40",
    slate: "from-slate-700/30 to-transparent border-slate-700/40 hover:border-slate-600/60",
  };
  return (
    <div className={`bg-gradient-to-b ${accents[accent || "slate"]} border rounded-xl p-4 transition-all duration-200`}>
      <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 mb-2">{label}</p>
      <p className="text-xl font-bold text-white leading-none">{value}</p>
      {sub && <p className="text-xs text-slate-500 mt-1.5">{sub}</p>}
    </div>
  );
}

function SectionCard({ tag, label, tagColor = "indigo", children }) {
  const [open, setOpen] = useState(true);
  const tagColors = {
    indigo: "text-indigo-400 border-indigo-500/30 bg-indigo-500/10",
    violet: "text-violet-400 border-violet-500/30 bg-violet-500/10",
    emerald: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
    red: "text-red-400 border-red-500/30 bg-red-500/10",
    amber: "text-amber-400 border-amber-500/30 bg-amber-500/10",
  };
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-800/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border ${tagColors[tagColor]}`}>
            {tag}
          </span>
          <span className="text-sm font-semibold text-slate-200">{label}</span>
        </div>
        <svg
          className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="border-t border-slate-800 px-6 py-5">
          {children}
        </div>
      )}
    </div>
  );
}

function NewsRow({ article, index }) {
  return (
    <a
      href={article.link}
      target="_blank"
      rel="noreferrer"
      className="group flex items-start gap-4 py-4 border-b border-slate-800/60 last:border-0 hover:bg-slate-800/30 rounded-xl px-3 -mx-3 transition-all"
    >
      <span className="text-xs font-mono font-bold text-slate-700 w-6 flex-shrink-0 mt-0.5 text-right">
        {String(index + 1).padStart(2, "0")}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-300 leading-snug group-hover:text-white transition-colors line-clamp-2">
          {article.title}
        </p>
        <div className="flex items-center gap-2 mt-1.5">
          {article.source && (
            <span className="text-xs font-medium text-slate-500">{article.source}</span>
          )}
          {article.source && article.published && !isNaN(new Date(article.published)) && (
            <span className="text-slate-700">·</span>
          )}
          {article.published && !isNaN(new Date(article.published)) && (
            <span className="text-xs text-slate-600">
              {new Date(article.published).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </span>
          )}
        </div>
      </div>
      <svg className="w-4 h-4 text-slate-700 group-hover:text-indigo-400 transition-colors flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
      </svg>
    </a>
  );
}

function DiligenceSection({ heading, body }) {
  const isRisk = /risk|red flag|caution/i.test(heading);
  const rawBullets = body.split("\n").filter(l => /^[-•*]\s/.test(l.trim()));
  const nonEmpty = body.split("\n").filter(l => l.trim());
  const isBulletList = rawBullets.length > 0 && rawBullets.length === nonEmpty.length;
  const clean = heading.replace(/^\d+\.\s*/, "").trim();

  return (
    <div className={`rounded-xl border p-5 ${isRisk ? "bg-red-950/30 border-red-900/50" : "bg-slate-800/30 border-slate-700/40"}`}>
      <div className="flex items-center gap-2 mb-3">
        {isRisk ? (
          <svg className="w-3.5 h-3.5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
        ) : (
          <svg className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        )}
        <p className={`text-xs font-bold uppercase tracking-widest ${isRisk ? "text-red-400" : "text-indigo-400"}`}>{clean}</p>
      </div>
      {isBulletList ? (
        <ul className="space-y-2.5">
          {rawBullets.map((b, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${isRisk ? "bg-red-500" : "bg-indigo-500"}`} />
              <span className="text-sm text-slate-300 leading-snug">{b.replace(/^[-•*]\s*/, "")}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{body}</p>
      )}
    </div>
  );
}

function DiligenceSummary({ text }) {
  if (!text) return <p className="text-sm text-slate-500">No summary available.</p>;
  const sections = text.split(/^##\s+/m).filter(Boolean);
  return (
    <div className="space-y-3">
      {sections.map((block, i) => {
        const lines = block.trim().split("\n");
        const heading = lines[0].trim();
        const body = lines.slice(1).join("\n").trim();
        return <DiligenceSection key={i} heading={heading} body={body} />;
      })}
    </div>
  );
}

export default function App() {
  const [ticker, setTicker] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  async function analyze(t) {
    const val = (t || ticker).trim();
    if (!val) return;
    if (t) setTicker(t);
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch(`${API}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticker: val }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || `Request failed (${res.status})`);
      }
      setResult(await res.json());
    } catch (e) {
      setError(e.message || "Something went wrong. Check the ticker and try again.");
    } finally {
      setLoading(false);
    }
  }

  const md = result?.market_data;
  const pos = md?.change_pct && !md.change_pct.startsWith("-") && md.change_pct !== "N/A";
  const neg = md?.change_pct?.startsWith("-");

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Nav */}
      <nav className="border-b border-slate-800/60 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <span className="font-bold text-sm text-white">Diligence Engine</span>
            <span className="hidden sm:block text-slate-700">·</span>
            <span className="hidden sm:block text-xs text-slate-500">Ajaia AI Scouting Platform</span>
          </div>
          <Pill color="slate">Prototype</Pill>
        </div>
      </nav>

      {/* Hero search */}
      <div className="relative border-b border-slate-800/60 overflow-hidden">
        {/* background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-600/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-5xl mx-auto px-6 py-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2">Investment Scouting</p>
          <h1 className="text-3xl font-bold text-white mb-1">Instant Diligence Report</h1>
          <p className="text-slate-400 text-sm mb-7">Enter any publicly traded US ticker to generate a real-time analysis</p>

          <div className="flex gap-3 max-w-xl">
            <div className="flex-1 flex items-center bg-slate-900 border border-slate-700 rounded-xl px-4 gap-3 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500/30 transition-all">
              <svg className="w-4 h-4 text-slate-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={ticker}
                onChange={e => setTicker(e.target.value.toUpperCase())}
                onKeyDown={e => e.key === "Enter" && !loading && analyze()}
                placeholder="Enter ticker… e.g. AAPL"
                className="flex-1 bg-transparent py-3.5 text-white placeholder-slate-600 font-mono font-semibold tracking-wider text-sm focus:outline-none"
              />
            </div>
            <button
              onClick={() => analyze()}
              disabled={loading || !ticker.trim()}
              className="bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 disabled:opacity-30 disabled:cursor-not-allowed text-white text-sm font-semibold px-6 rounded-xl transition-all shadow-lg shadow-indigo-500/20"
            >
              {loading ? (
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
              ) : "Analyze →"}
            </button>
          </div>

          {error && (
            <div className="mt-3 max-w-xl flex items-center gap-2.5 bg-red-950/60 border border-red-800/50 rounded-xl px-4 py-3 text-sm text-red-300">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          <div className="mt-5 flex items-center gap-2 flex-wrap">
            <span className="text-xs text-slate-600">Try:</span>
            {SUGGESTIONS.map(t => (
              <button
                key={t}
                onClick={() => analyze(t)}
                disabled={loading}
                className="text-xs font-mono font-semibold text-slate-500 hover:text-white border border-slate-800 hover:border-slate-600 bg-slate-900/50 hover:bg-slate-800 rounded-lg px-3 py-1.5 transition-all disabled:opacity-40"
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="max-w-5xl mx-auto px-6 py-20 flex flex-col items-center gap-5">
          <div className="relative w-14 h-14">
            <div className="absolute inset-0 rounded-full border-2 border-slate-800" />
            <div className="absolute inset-0 rounded-full border-2 border-t-indigo-500 border-r-indigo-500/30 animate-spin" />
            <div className="absolute inset-2 rounded-full border border-violet-500/20 animate-pulse" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-slate-300">Generating diligence report…</p>
            <p className="text-xs text-slate-600 mt-1">Fetching market data · Scanning news · Running AI analysis</p>
          </div>
        </div>
      )}

      {/* Results */}
      {result && !loading && (
        <div className="max-w-5xl mx-auto px-6 py-6 space-y-4">

          {/* Company hero */}
          <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
            <div className="relative">
              <div className="flex items-start justify-between gap-4 mb-5">
                <div>
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <h2 className="text-2xl font-bold text-white">{md.name}</h2>
                    <Pill color="indigo">{md.ticker}</Pill>
                    <Pill color="slate">{md.sector}</Pill>
                  </div>
                  <p className="text-sm text-slate-500">{md.industry} · {md.country}</p>
                  {md.description && (
                    <p className="mt-2 text-sm text-slate-400 leading-relaxed max-w-2xl line-clamp-2">{md.description}</p>
                  )}
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-4xl font-bold text-white tracking-tight">{md.price}</p>
                  <div className={`inline-flex items-center gap-1.5 mt-1 text-sm font-semibold px-2.5 py-1 rounded-lg ${pos ? "bg-emerald-500/10 text-emerald-400" : neg ? "bg-red-500/10 text-red-400" : "bg-slate-800 text-slate-400"}`}>
                    {pos ? "▲" : neg ? "▼" : "—"} {md.change_pct}
                    <span className="text-[10px] font-normal opacity-60">today</span>
                  </div>
                </div>
              </div>

              {/* Mini metrics strip */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-5 border-t border-slate-800">
                <StatCard label="Market Cap" value={md.market_cap} accent="indigo" />
                <StatCard label="P/E Ratio" value={md.pe_ratio} sub="trailing" accent="violet" />
                <StatCard label="Revenue" value={md.revenue} sub="annual" accent="cyan" />
                <StatCard label="52w Range" value={`${md.week_52_low}`} sub={`High: ${md.week_52_high}`} accent="emerald" />
                <StatCard label="Analyst Consensus" value={md.analyst_rating} accent="amber" />
              </div>
            </div>
          </div>

          {/* Detailed metrics */}
          <SectionCard tag="Metrics" label="Financial Snapshot" tagColor="indigo">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              <StatCard label="Market Cap" value={md.market_cap} accent="indigo" />
              <StatCard label="P/E (Trailing)" value={md.pe_ratio} accent="violet" />
              <StatCard label="P/E (Forward)" value={md.forward_pe} accent="violet" />
              <StatCard label="Revenue" value={md.revenue} accent="cyan" />
              <StatCard label="Profit Margin" value={md.profit_margin} accent="emerald" />
              <StatCard label="Debt / Equity" value={md.debt_to_equity} accent="amber" />
              <StatCard label="52-Week Low" value={md.week_52_low} accent="slate" />
              <StatCard label="52-Week High" value={md.week_52_high} accent="slate" />
              <StatCard label="Analyst Rating" value={md.analyst_rating} accent="emerald" />
            </div>
          </SectionCard>

          {/* News */}
          <SectionCard tag="News" label="Recent Coverage" tagColor="violet">
            {result.news.length > 0 ? (
              <div className="divide-y divide-slate-800/0">
                {result.news.map((a, i) => <NewsRow key={i} article={a} index={i} />)}
              </div>
            ) : (
              <p className="text-sm text-slate-500">No recent news found for this ticker.</p>
            )}
          </SectionCard>

          {/* AI Summary */}
          <SectionCard tag="AI Analysis" label="Diligence Summary" tagColor="emerald">
            <div className="mb-4 flex items-start gap-3 bg-amber-500/5 border border-amber-500/15 rounded-xl px-4 py-3">
              <svg className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xs text-amber-300/80 leading-relaxed">
                AI-generated output based on public data. Requires analyst validation before any investment or business decision.
              </p>
            </div>
            <DiligenceSummary text={result.summary} />
          </SectionCard>

        </div>
      )}

      {/* Empty state */}
      {!result && !loading && !error && (
        <div className="max-w-5xl mx-auto px-6 py-24 flex flex-col items-center text-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-2">
            <svg className="w-7 h-7 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="text-slate-400 font-medium">Enter a ticker above to get started</p>
          <p className="text-sm text-slate-600">Aggregates live market data, news, and AI analysis into one diligence report</p>
        </div>
      )}

      <footer className="border-t border-slate-800/60 mt-8">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <p className="text-xs text-slate-600">Diligence Engine · Ajaia LLC · Prototype · Not financial advice</p>
          <p className="text-xs text-slate-700">Powered by yfinance · Google News · Gemini 2.0</p>
        </div>
      </footer>
    </div>
  );
}
