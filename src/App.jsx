import { useState, useEffect, useCallback, useRef } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area,
} from "recharts";

/* ───────────────────────────────────────────────────────────────
   GLOBAL FONT & CSS KEYFRAMES
─────────────────────────────────────────────────────────────── */
const GLOBAL_STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root { height: 100%; }
  body { font-family: 'Plus Jakarta Sans', sans-serif; background: #f0f4f8; }
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #c7d2de; border-radius: 3px; }

  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes fadeSlideUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes shimmer {
    0%   { background-position: -600px 0; }
    100% { background-position: 600px 0; }
  }
  @keyframes tickerScroll {
    0%   { transform: translateX(100%); }
    100% { transform: translateX(-100%); }
  }
  @keyframes pulse-ring {
    0%   { box-shadow: 0 0 0 0 rgba(239,68,68,0.45); }
    70%  { box-shadow: 0 0 0 10px rgba(239,68,68,0); }
    100% { box-shadow: 0 0 0 0 rgba(239,68,68,0); }
  }
  @keyframes blink {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.3; }
  }
  @keyframes slideInLeft {
    from { opacity: 0; transform: translateX(-20px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  .card-enter { animation: fadeSlideUp 0.38s cubic-bezier(0.16,1,0.3,1) both; }
  .card-enter-1 { animation-delay: 0.05s; }
  .card-enter-2 { animation-delay: 0.10s; }
  .card-enter-3 { animation-delay: 0.15s; }
  .card-enter-4 { animation-delay: 0.20s; }
  .shimmer-row {
    background: linear-gradient(90deg, #f0f4f8 25%, #e2e8ef 50%, #f0f4f8 75%);
    background-size: 600px 100%;
    animation: shimmer 1.4s infinite;
    border-radius: 6px;
  }
`;

/* ───────────────────────────────────────────────────────────────
   CONSTANTS & MOCK DATA
─────────────────────────────────────────────────────────────── */
const CREDENTIALS = [{ email: "doctor@aura.com", password: "password123", name: "Dr. Priya Sharma", role: "Senior Physician" }];

const MEDICINES = [
  { id: 1, name: "Aspirin",       reviews: 420, suitability: 92, rating: 4.5, risk: "LOW",    effects: ["mild nausea", "stomach upset"] },
  { id: 2, name: "Ibuprofen",     reviews: 567, suitability: 88, rating: 4.3, risk: "LOW",    effects: ["heartburn", "dizziness"] },
  { id: 3, name: "Paracetamol",   reviews: 389, suitability: 95, rating: 4.8, risk: "LOW",    effects: ["rare rash", "nausea"] },
  { id: 4, name: "Metformin",     reviews: 210, suitability: 81, rating: 4.1, risk: "MEDIUM", effects: ["diarrhea", "nausea", "fatigue"] },
  { id: 5, name: "Lisinopril",    reviews: 173, suitability: 76, rating: 3.9, risk: "MEDIUM", effects: ["dry cough", "dizziness"] },
  { id: 6, name: "Warfarin",      reviews: 56,  suitability: 62, rating: 3.8, risk: "HIGH",   effects: ["bleeding risk", "bruising"] },
];

const RISK_PIE = [
  { name: "Low",    value: 3, color: "#22c55e" },
  { name: "Medium", value: 2, color: "#f59e0b" },
  { name: "High",   value: 1, color: "#ef4444" },
];

const SENTIMENT_TREND = [
  { date: "Mon", positive: 30, neutral: 44, negative: 26 },
  { date: "Tue", positive: 28, neutral: 41, negative: 31 },
  { date: "Wed", positive: 36, neutral: 39, negative: 25 },
  { date: "Thu", positive: 22, neutral: 37, negative: 41 },
  { date: "Fri", positive: 41, neutral: 35, negative: 24 },
  { date: "Sat", positive: 46, neutral: 37, negative: 17 },
  { date: "Sun", positive: 39, neutral: 43, negative: 18 },
];

const BAR_DATA = MEDICINES.map(m => ({ name: m.name.slice(0, 4), reviews: m.reviews }));

const SYMPTOM_DATA = [
  { name: "Headache", count: 42 }, { name: "Fever", count: 38 },
  { name: "Nausea", count: 29 },   { name: "Fatigue", count: 55 },
  { name: "Dizziness", count: 21 },{ name: "Chest", count: 14 },
];

const SAMPLE_TEXTS = [
  { label: "Severe headache after medication", text: "I've had a severe splitting headache for the past 6 hours after taking my new blood pressure medication. The pain is unbearable, and I feel like I'm going to vomit. My vision is slightly blurred." },
  { label: "Mild fever since morning",          text: "Woke up with a mild fever this morning, around 99.5°F. Feeling a bit tired and have a slight sore throat. Took some Tylenol and drinking plenty of fluids." },
  { label: "Feeling dizzy and nauseous",        text: "I've been feeling dizzy and nauseous since yesterday. The room spins when I stand up. Also experiencing some chest tightness and shortness of breath." },
];

const MOCK_ANALYSIS = {
  severe: { symptoms: ["severe headache","nausea","blurred vision","medication reaction"], sentiment: "negative", risk_level: "HIGH",   confidence: 94, reason: ["Multiple severe symptoms detected simultaneously","Strongly negative sentiment signals acute distress","Blurred vision + headache matches hypertensive crisis","Post-medication onset suggests adverse drug reaction"] },
  mild:   { symptoms: ["mild fever","fatigue","sore throat"],                              sentiment: "neutral",  risk_level: "LOW",    confidence: 87, reason: ["Symptoms are mild and localized","Neutral sentiment indicates manageable condition","Patient is self-managing appropriately","No red-flag symptoms detected"] },
  dizzy:  { symptoms: ["dizziness","nausea","chest tightness","shortness of breath"],      sentiment: "negative", risk_level: "MEDIUM", confidence: 79, reason: ["Combination of dizziness and chest tightness requires monitoring","Respiratory symptoms elevate risk tier","Negative sentiment indicates patient distress","Pattern resembles early cardiovascular event"] },
};

const FALLBACK_UPDATES = [
  { emoji: "🦠", type: "Outbreak",  text: "Influenza A(H3N2) cases spiking 34% across northern regions — hospitalizations rising sharply." },
  { emoji: "📈", type: "Trend",     text: "Antibiotic-resistant UTI reports rising 22% in urban clinics over the past two weeks." },
  { emoji: "⚠️", type: "Warning",  text: "Ibuprofen overuse linked to increased GI bleeding risk in patients over 60 — dose review advised." },
  { emoji: "💊", type: "Drug",      text: "Metformin XR batch #7741 recalled due to NDMA impurity exceeding FDA thresholds." },
  { emoji: "📈", type: "Trend",     text: "Dengue fever cases rising 41% in South Asian urban districts — vector control urgently needed." },
];

const RISK_CFG = {
  HIGH:   { color: "#ef4444", bg: "#fef2f2", border: "#fecaca", text: "#dc2626", icon: "⚠", pulse: true },
  MEDIUM: { color: "#f59e0b", bg: "#fffbeb", border: "#fde68a", text: "#d97706", icon: "◉", pulse: false },
  LOW:    { color: "#22c55e", bg: "#f0fdf4", border: "#bbf7d0", text: "#16a34a", icon: "✓", pulse: false },
};

const UPDATE_COLORS = { "🦠": "#8b5cf6", "📈": "#0ea5e9", "⚠️": "#f59e0b", "💊": "#10b981" };
const UPDATE_BG     = { "🦠": "#f5f3ff", "📈": "#f0f9ff", "⚠️": "#fffbeb", "💊": "#f0fdf4" };
const UPDATE_BORDER = { "🦠": "#ddd6fe", "📈": "#bae6fd", "⚠️": "#fde68a", "💊": "#bbf7d0" };

/* ───────────────────────────────────────────────────────────────
   ANTHROPIC API — AI HEALTH UPDATES
─────────────────────────────────────────────────────────────── */
async function fetchAIHealthUpdates() {
  const prompt = `You are an AI-powered health intelligence engine.
Analyze data aggregated from multiple sources such as:
- News articles
- Public health reports
- Government datasets
- Social media trends

Your goal is to generate real-time "Health Updates" that provide actionable insights, not raw data.
Focus on identifying:
1. Emerging diseases or outbreaks
2. Sudden increases or spikes in health-related issues
3. Drug or medicine warnings, recalls, or side effects
4. Public health risks or safety alerts

Guidelines:
- Keep each update concise (1–2 lines max)
- Make insights clear, specific, and impactful
- Use trend indicators like "rising", "spiking", "declining"
- Avoid generic statements
- Prioritize relevance and urgency

Output format:
- Return 4 to 5 updates
- Each update must start with an emoji indicator:
  📈 for rising trends
  ⚠️ for warnings
  🦠 for diseases/outbreaks
  💊 for medicines/drugs

Do NOT include explanations, metadata, or extra text. Only return the formatted updates, one per line.`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  const data = await res.json();
  const raw = (data.content || []).map(b => b.text || "").join("\n");
  const lines = raw.split("\n").map(l => l.trim()).filter(l => l.length > 4 && /^[📈⚠️🦠💊]/.test(l));
  if (!lines.length) throw new Error("No updates");

  const typeMap = { "📈": "Trend", "⚠️": "Warning", "🦠": "Outbreak", "💊": "Drug" };
  return lines.map(line => {
    const emoji = [...line].find(c => "📈⚠️🦠💊".includes(c)) || "📈";
    return { emoji, type: typeMap[emoji] || "Update", text: line.replace(/^[📈⚠️🦠💊]\s*/, "").trim() };
  });
}

function getMockAnalysis(text) {
  const t = text.toLowerCase();
  if (t.includes("severe") || t.includes("blurred") || t.includes("unbearable")) return MOCK_ANALYSIS.severe;
  if (t.includes("mild") || t.includes("sore throat") || t.includes("tylenol")) return MOCK_ANALYSIS.mild;
  return MOCK_ANALYSIS.dizzy;
}

/* ───────────────────────────────────────────────────────────────
   TINY REUSABLE ATOMS
─────────────────────────────────────────────────────────────── */
const CARD = { background: "#fff", borderRadius: "16px", border: "1px solid #e8eef4", boxShadow: "0 2px 12px rgba(15,23,42,0.06)", overflow: "hidden" };

function Badge({ label, color, bg, border }) {
  return (
    <span style={{ background: bg, border: `1px solid ${border}`, color, borderRadius: "8px", padding: "3px 10px", fontSize: "11px", fontWeight: "600", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.04em" }}>
      {label}
    </span>
  );
}

function StatCard({ label, value, sub, accent, delay = "" }) {
  return (
    <div className={`card-enter ${delay}`} style={{ ...CARD, padding: "18px 20px", borderLeft: `3px solid ${accent}` }}>
      <div style={{ fontSize: "11px", color: "#94a3b8", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "6px" }}>{label}</div>
      <div style={{ fontSize: "26px", fontWeight: "800", color: "#0f172a", fontFamily: "'JetBrains Mono', monospace", lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: "12px", color: "#64748b", marginTop: "5px" }}>{sub}</div>
    </div>
  );
}

function Spinner({ size = 18, color = "#6366f1" }) {
  return <span style={{ display: "inline-block", width: size, height: size, border: `2px solid ${color}30`, borderTopColor: color, borderRadius: "50%", animation: "spin 0.75s linear infinite" }} />;
}

function ShimmerBlock({ h = 14, w = "100%", mb = 10 }) {
  return <div className="shimmer-row" style={{ height: h, width: w, marginBottom: mb }} />;
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "10px 14px", boxShadow: "0 8px 24px rgba(15,23,42,0.12)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div style={{ fontSize: "11px", color: "#94a3b8", marginBottom: "5px", fontWeight: "600" }}>{label}</div>
      {payload.map((p, i) => <div key={i} style={{ fontSize: "13px", color: p.color, fontFamily: "'JetBrains Mono', monospace", fontWeight: "500" }}>{p.name}: {p.value}</div>)}
    </div>
  );
};

/* ───────────────────────────────────────────────────────────────
   LIVE TICKER
─────────────────────────────────────────────────────────────── */
function LiveTicker({ updates }) {
  if (!updates.length) return null;
  const text = updates.map(u => `${u.emoji} ${u.text}`).join("    ·    ");
  return (
    <div style={{ background: "#0f172a", borderBottom: "1px solid rgba(99,102,241,0.3)", height: "32px", overflow: "hidden", display: "flex", alignItems: "center", position: "relative" }}>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "80px", background: "linear-gradient(to right, #0f172a, transparent)", zIndex: 2 }} />
      <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "80px", background: "linear-gradient(to left, #0f172a, transparent)", zIndex: 2 }} />
      <div style={{ display: "flex", alignItems: "center", gap: "6px", position: "absolute", left: "80px" }}>
        <span style={{ fontSize: "9px", fontWeight: "700", color: "#f59e0b", background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.4)", borderRadius: "4px", padding: "1px 6px", letterSpacing: "0.08em", fontFamily: "'JetBrains Mono', monospace", animation: "blink 1.5s infinite" }}>LIVE</span>
      </div>
      <div style={{ whiteSpace: "nowrap", animation: "tickerScroll 38s linear infinite", fontSize: "12px", color: "#94a3b8", fontFamily: "'Plus Jakarta Sans', sans-serif", paddingLeft: "120px" }}>
        {text}
      </div>
    </div>
  );
}

/* ───────────────────────────────────────────────────────────────
   NAVBAR
─────────────────────────────────────────────────────────────── */
function Navbar({ page, setPage, user, onLogout, updates }) {
  const [dropdown, setDropdown] = useState(false);
  const NAV = ["Dashboard", "Medicines", "Reviews", "Analytics", "Updates", "Profile", "Settings"];

  return (
    <>
      <nav style={{ background: "linear-gradient(135deg, #0f172a 0%, #1a2540 60%, #0f172a 100%)", borderBottom: "1px solid rgba(99,102,241,0.25)", padding: "0 28px", height: "60px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 200, boxShadow: "0 4px 32px rgba(99,102,241,0.12)" }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "11px", cursor: "pointer" }} onClick={() => setPage("Dashboard")}>
          <div style={{ width: "34px", height: "34px", borderRadius: "9px", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px", fontWeight: "800", color: "#fff", boxShadow: "0 0 14px rgba(99,102,241,0.5)", fontFamily: "'JetBrains Mono', monospace" }}>A</div>
          <div>
            <div style={{ fontSize: "18px", fontWeight: "800", color: "#fff", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.14em", lineHeight: 1 }}>AURA</div>
            <div style={{ fontSize: "9px", color: "rgba(148,163,184,0.7)", letterSpacing: "0.07em", textTransform: "uppercase" }}>Health Signal Intelligence</div>
          </div>
        </div>

        {/* Nav Items */}
        <div style={{ display: "flex", gap: "2px" }}>
          {NAV.slice(0, 5).map(n => (
            <button key={n} onClick={() => setPage(n)} style={{ background: page === n ? "rgba(99,102,241,0.18)" : "transparent", border: page === n ? "1px solid rgba(99,102,241,0.35)" : "1px solid transparent", color: page === n ? "#a5b4fc" : "rgba(148,163,184,0.75)", padding: "5px 13px", borderRadius: "8px", fontSize: "13px", fontWeight: page === n ? "600" : "400", cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif", transition: "all 0.15s", position: "relative" }}>
              {n}
              {n === "Updates" && updates.length > 0 && (
                <span style={{ position: "absolute", top: "3px", right: "3px", width: "6px", height: "6px", background: "#ef4444", borderRadius: "50%", animation: "blink 1.5s infinite" }} />
              )}
            </button>
          ))}
        </div>

        {/* User */}
        <div style={{ position: "relative" }}>
          <button onClick={() => setDropdown(!dropdown)} style={{ display: "flex", alignItems: "center", gap: "9px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: "6px 12px", cursor: "pointer", color: "#e2e8f0" }}>
            <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: "700", color: "#fff" }}>
              {user.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
            </div>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: "12px", fontWeight: "600" }}>{user.name.split(" ").slice(0, 2).join(" ")}</div>
              <div style={{ fontSize: "10px", color: "rgba(148,163,184,0.7)" }}>{user.role}</div>
            </div>
            <span style={{ fontSize: "10px", opacity: 0.5 }}>▼</span>
          </button>
          {dropdown && (
            <div style={{ position: "absolute", right: 0, top: "calc(100% + 8px)", background: "#fff", borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 12px 40px rgba(15,23,42,0.15)", minWidth: "160px", overflow: "hidden", zIndex: 300 }}>
              {[["👤 Profile", "Profile"], ["⚙️ Settings", "Settings"]].map(([label, pg]) => (
                <button key={pg} onClick={() => { setPage(pg); setDropdown(false); }} style={{ display: "block", width: "100%", padding: "11px 16px", textAlign: "left", border: "none", background: "none", fontSize: "13px", color: "#374151", cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: "500" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
                  onMouseLeave={e => e.currentTarget.style.background = "none"}>
                  {label}
                </button>
              ))}
              <div style={{ height: "1px", background: "#f1f5f9", margin: "2px 0" }} />
              <button onClick={() => { onLogout(); setDropdown(false); }} style={{ display: "block", width: "100%", padding: "11px 16px", textAlign: "left", border: "none", background: "none", fontSize: "13px", color: "#ef4444", cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: "500" }}
                onMouseEnter={e => e.currentTarget.style.background = "#fef2f2"}
                onMouseLeave={e => e.currentTarget.style.background = "none"}>
                🚪 Logout
              </button>
            </div>
          )}
        </div>
      </nav>
      <LiveTicker updates={updates} />
    </>
  );
}

/* ───────────────────────────────────────────────────────────────
   AUTH PAGES
─────────────────────────────────────────────────────────────── */
function AuthPage({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "doctor@aura.com", password: "password123", confirm: "", role: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = async () => {
    setError(""); setLoading(true);
    await new Promise(r => setTimeout(r, 700));
    setLoading(false);

    if (!form.email || !form.password) { setError("Please fill in all fields."); return; }
    if (mode === "signup") {
      if (!form.name) { setError("Please enter your name."); return; }
      if (form.password !== form.confirm) { setError("Passwords don't match."); return; }
      onLogin({ name: form.name || "Dr. User", email: form.email, role: form.role || "Physician" });
      return;
    }
    const match = CREDENTIALS.find(c => c.email === form.email && c.password === form.password);
    if (!match) { setError("Invalid email or password."); return; }
    onLogin(match);
  };

  const inputStyle = { width: "100%", padding: "11px 14px", border: "1.5px solid #e2e8f0", borderRadius: "10px", fontSize: "14px", fontFamily: "'Plus Jakarta Sans', sans-serif", background: "#f9fafb", color: "#1e293b", outline: "none", transition: "border-color 0.2s" };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div style={{ width: "420px", background: "#fff", borderRadius: "20px", padding: "36px", boxShadow: "0 24px 64px rgba(0,0,0,0.35)" }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "28px", justifyContent: "center" }}>
          <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "17px", fontWeight: "800", color: "#fff", fontFamily: "'JetBrains Mono', monospace" }}>A</div>
          <div>
            <div style={{ fontSize: "22px", fontWeight: "800", color: "#0f172a", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.12em" }}>AURA</div>
            <div style={{ fontSize: "10px", color: "#94a3b8", letterSpacing: "0.06em", textTransform: "uppercase" }}>Health Signal Intelligence</div>
          </div>
        </div>

        <div style={{ fontSize: "20px", fontWeight: "700", color: "#0f172a", marginBottom: "20px", textAlign: "center" }}>
          {mode === "login" ? "Welcome back" : "Create account"}
        </div>

        {error && <div style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", borderRadius: "9px", padding: "10px 14px", fontSize: "13px", marginBottom: "16px", fontWeight: "500" }}>{error}</div>}

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {mode === "signup" && (
            <>
              <input placeholder="Full name" value={form.name} onChange={set("name")} style={inputStyle} onFocus={e => e.target.style.borderColor = "#6366f1"} onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
              <input placeholder="Role / Specialty" value={form.role} onChange={set("role")} style={inputStyle} onFocus={e => e.target.style.borderColor = "#6366f1"} onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
            </>
          )}
          <input placeholder="Email" type="email" value={form.email} onChange={set("email")} style={inputStyle} onFocus={e => e.target.style.borderColor = "#6366f1"} onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
          <input placeholder="Password" type="password" value={form.password} onChange={set("password")} style={inputStyle} onFocus={e => e.target.style.borderColor = "#6366f1"} onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
          {mode === "signup" && <input placeholder="Confirm password" type="password" value={form.confirm} onChange={set("confirm")} style={inputStyle} onFocus={e => e.target.style.borderColor = "#6366f1"} onBlur={e => e.target.style.borderColor = "#e2e8f0"} />}
        </div>

        <button onClick={submit} style={{ width: "100%", marginTop: "20px", padding: "13px", borderRadius: "11px", border: "none", background: "linear-gradient(135deg, #4f46e5, #7c3aed)", color: "#fff", fontSize: "14px", fontWeight: "700", cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif", boxShadow: "0 4px 18px rgba(99,102,241,0.45)", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", transition: "opacity 0.2s" }}
          onMouseEnter={e => e.currentTarget.style.opacity = "0.92"}
          onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
          {loading ? <><Spinner size={16} color="#fff" /> Processing…</> : (mode === "login" ? "Sign In" : "Create Account")}
        </button>

        <div style={{ textAlign: "center", marginTop: "16px", fontSize: "13px", color: "#64748b" }}>
          {mode === "login" ? <>No account? <button onClick={() => { setMode("signup"); setError(""); }} style={{ color: "#6366f1", background: "none", border: "none", cursor: "pointer", fontWeight: "600", fontSize: "13px" }}>Create one</button></> : <>Have an account? <button onClick={() => { setMode("login"); setError(""); }} style={{ color: "#6366f1", background: "none", border: "none", cursor: "pointer", fontWeight: "600", fontSize: "13px" }}>Sign in</button></>}
        </div>

        {mode === "login" && <div style={{ textAlign: "center", marginTop: "12px", fontSize: "11px", color: "#94a3b8" }}>Demo: doctor@aura.com / password123</div>}
      </div>
    </div>
  );
}

/* ───────────────────────────────────────────────────────────────
   DASHBOARD PAGE
─────────────────────────────────────────────────────────────── */
function DashboardPage({ updates, updatesLoading }) {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [visible, setVisible] = useState(false);

  const analyze = async (t) => {
    setAnalyzing(true); setVisible(false); setResult(null);
    await new Promise(r => setTimeout(r, 1400));
    setResult(getMockAnalysis(t)); setAnalyzing(false);
    setTimeout(() => setVisible(true), 40);
  };

  const cfg = result ? RISK_CFG[result.risk_level] : null;
  const sentimentColor = { negative: "#ef4444", neutral: "#f59e0b", positive: "#22c55e" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
      {/* Stat Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px" }}>
        <StatCard label="Analyses Today" value="1,284" sub="↑ 8.2% from yesterday" accent="#6366f1" delay="card-enter-1" />
        <StatCard label="High Risk Flagged" value="39" sub="Requires immediate review" accent="#ef4444" delay="card-enter-2" />
        <StatCard label="Avg Confidence" value="91.4%" sub="Model accuracy score" accent="#22c55e" delay="card-enter-3" />
        <StatCard label="AI Updates" value={updatesLoading ? "…" : updates.length} sub="Live intelligence alerts" accent="#f59e0b" delay="card-enter-4" />
      </div>

      {/* Main 2-col */}
      <div style={{ display: "grid", gridTemplateColumns: "380px 1fr", gap: "18px", alignItems: "start" }}>
        {/* Input Panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={CARD} className="card-enter">
            <div style={{ padding: "16px 20px 12px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a" }}>Patient Signal Input</div>
                <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "2px" }}>Clinical notes or patient-reported text</div>
              </div>
              <Badge label="NLP v3.2" color="#0369a1" bg="#f0f9ff" border="#bae6fd" />
            </div>
            <div style={{ padding: "14px 20px" }}>
              <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Enter patient text or social media post…"
                style={{ width: "100%", height: "150px", border: "1.5px solid #e2e8f0", borderRadius: "10px", padding: "12px 14px", fontSize: "13.5px", color: "#1e293b", background: "#fafafa", resize: "none", outline: "none", fontFamily: "'Plus Jakarta Sans', sans-serif", lineHeight: 1.6, boxSizing: "border-box", transition: "border-color 0.2s" }}
                onFocus={e => e.target.style.borderColor = "#6366f1"} onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
              <div style={{ marginTop: "10px" }}>
                <div style={{ fontSize: "10px", color: "#94a3b8", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "7px" }}>Quick samples</div>
                {SAMPLE_TEXTS.map((s, i) => (
                  <button key={i} onClick={() => setText(s.text)} style={{ display: "flex", width: "100%", alignItems: "center", gap: "7px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "7px", padding: "7px 10px", textAlign: "left", fontSize: "12px", color: "#475569", cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif", marginBottom: "5px", transition: "all 0.15s" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "#eef2ff"; e.currentTarget.style.color = "#4f46e5"; e.currentTarget.style.borderColor = "#c7d2fe"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "#f8fafc"; e.currentTarget.style.color = "#475569"; e.currentTarget.style.borderColor = "#e2e8f0"; }}>
                    <span style={{ opacity: 0.4, fontSize: "10px" }}>↗</span>{s.label}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ padding: "0 20px 18px" }}>
              <button onClick={() => text.trim() && analyze(text)} disabled={analyzing || !text.trim()} style={{ width: "100%", padding: "13px", borderRadius: "11px", border: "none", background: text.trim() && !analyzing ? "linear-gradient(135deg, #4f46e5, #7c3aed)" : "#e2e8f0", color: text.trim() && !analyzing ? "#fff" : "#94a3b8", fontSize: "13.5px", fontWeight: "700", cursor: text.trim() && !analyzing ? "pointer" : "not-allowed", fontFamily: "'Plus Jakarta Sans', sans-serif", boxShadow: text.trim() && !analyzing ? "0 4px 18px rgba(99,102,241,0.4)" : "none", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", transition: "all 0.2s" }}>
                {analyzing ? <><Spinner size={15} color="#fff" /> Analyzing Signal…</> : "⚡ Analyze Health Signal"}
              </button>
            </div>
          </div>

          {/* AI Updates mini panel */}
          <div style={{ ...CARD, padding: "16px 18px" }} className="card-enter">
            <div style={{ fontSize: "12px", fontWeight: "700", color: "#0f172a", marginBottom: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ width: "7px", height: "7px", background: "#ef4444", borderRadius: "50%", display: "inline-block", animation: "blink 1.5s infinite" }} />
              Live AI Intelligence
            </div>
            {updatesLoading ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {[1, 2, 3].map(i => <ShimmerBlock key={i} h={32} mb={0} />)}
              </div>
            ) : updates.slice(0, 3).map((u, i) => (
              <div key={i} style={{ background: UPDATE_BG[u.emoji] || "#f8fafc", border: `1px solid ${UPDATE_BORDER[u.emoji] || "#e2e8f0"}`, borderRadius: "8px", padding: "8px 11px", marginBottom: "6px", fontSize: "11.5px", color: "#374151", lineHeight: 1.45 }}>
                <span style={{ marginRight: "5px" }}>{u.emoji}</span>{u.text}
              </div>
            ))}
          </div>
        </div>

        {/* Result Panel */}
        <div>
          {analyzing ? (
            <div style={CARD}>
              <div style={{ padding: "24px" }}>
                <div style={{ display: "flex", gap: "12px", marginBottom: "18px" }}>
                  <ShimmerBlock h={48} w="48px" mb={0} />
                  <div style={{ flex: 1 }}>
                    <ShimmerBlock h={20} w="55%" mb={8} />
                    <ShimmerBlock h={14} w="38%" mb={0} />
                  </div>
                </div>
                {[100, 80, 90, 70].map((w, i) => <ShimmerBlock key={i} h={13} w={`${w}%`} />)}
              </div>
            </div>
          ) : !result ? (
            <div style={{ ...CARD, padding: "56px 24px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "12px", border: "2px dashed #e2e8f0", background: "#fafbfc", minHeight: "340px" }}>
              <div style={{ fontSize: "44px", opacity: 0.15 }}>◎</div>
              <div style={{ fontSize: "14px", color: "#94a3b8", textAlign: "center", lineHeight: 1.6 }}>Enter patient text and click<br /><strong style={{ color: "#6366f1" }}>Analyze Health Signal</strong> to begin</div>
            </div>
          ) : (
            <div style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(14px)", transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)", display: "flex", flexDirection: "column", gap: "14px" }}>
              {/* Risk card */}
              <div style={{ ...CARD, border: `1px solid ${cfg.border}`, boxShadow: `0 4px 24px ${cfg.color}20` }}>
                <div style={{ background: cfg.bg, padding: "18px 22px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${cfg.border}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    <div style={{ width: "50px", height: "50px", borderRadius: "13px", background: cfg.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", color: "#fff", animation: result.risk_level === "HIGH" ? "pulse-ring 2s infinite" : "none" }}>{cfg.icon}</div>
                    <div>
                      <div style={{ fontSize: "10px", color: cfg.text, fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.1em" }}>Risk Assessment</div>
                      <div style={{ fontSize: "28px", fontWeight: "800", color: cfg.text, fontFamily: "'JetBrains Mono', monospace", lineHeight: 1.1 }}>{result.risk_level}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "10px", color: "#94a3b8" }}>Confidence</div>
                    <div style={{ fontSize: "26px", fontWeight: "800", color: "#0f172a", fontFamily: "'JetBrains Mono', monospace" }}>{result.confidence}%</div>
                    <div style={{ width: "80px", height: "4px", background: "#e2e8f0", borderRadius: "2px", marginTop: "5px" }}>
                      <div style={{ width: `${result.confidence}%`, height: "100%", background: cfg.color, borderRadius: "2px", transition: "width 0.8s ease" }} />
                    </div>
                  </div>
                </div>
                <div style={{ padding: "16px 22px" }}>
                  <div style={{ marginBottom: "14px" }}>
                    <div style={{ fontSize: "10px", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "7px" }}>Detected Symptoms</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                      {result.symptoms.map((s, i) => <Badge key={i} label={`◦ ${s}`} color="#0369a1" bg="#f0f9ff" border="#bae6fd" />)}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: "10px", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "7px" }}>Sentiment Analysis</div>
                    <Badge label={result.sentiment.toUpperCase()} color={sentimentColor[result.sentiment]} bg={`${sentimentColor[result.sentiment]}18`} border={`${sentimentColor[result.sentiment]}44`} />
                  </div>
                </div>
              </div>
              {/* Explanation */}
              <div style={{ ...CARD, padding: "16px 22px" }}>
                <div style={{ fontSize: "13px", fontWeight: "700", color: "#0f172a", marginBottom: "13px", display: "flex", alignItems: "center", gap: "7px" }}>◈ Why this result?</div>
                {result.reason.map((r, i) => (
                  <div key={i} style={{ display: "flex", gap: "11px", alignItems: "flex-start", marginBottom: "9px" }}>
                    <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", color: "#fff", fontWeight: "700", flexShrink: 0, marginTop: "1px", fontFamily: "'JetBrains Mono', monospace" }}>{i + 1}</div>
                    <span style={{ fontSize: "13px", color: "#475569", lineHeight: 1.5 }}>{r}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Analytics Strip */}
      <div style={{ ...CARD, overflow: "hidden" }} className="card-enter">
        <div style={{ padding: "16px 22px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a" }}>Analytics Overview</div>
            <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "2px" }}>Last 7 days · 248 analyses processed</div>
          </div>
          <Badge label="↑ 12.4% vs last week" color="#16a34a" bg="#f0fdf4" border="#bbf7d0" />
        </div>
        <div style={{ padding: "22px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "24px" }}>
          <div>
            <div style={{ fontSize: "11px", fontWeight: "700", color: "#475569", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "14px" }}>Symptom Frequency</div>
            <ResponsiveContainer width="100%" height={170}>
              <BarChart data={SYMPTOM_DATA} barCategoryGap="32%">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div>
            <div style={{ fontSize: "11px", fontWeight: "700", color: "#475569", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "14px" }}>Risk Distribution</div>
            <ResponsiveContainer width="100%" height={140}>
              <PieChart>
                <Pie data={RISK_PIE} cx="50%" cy="50%" innerRadius={44} outerRadius={66} paddingAngle={3} dataKey="value">
                  {RISK_PIE.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginTop: "6px" }}>
              {RISK_PIE.map(d => <div key={d.name} style={{ display: "flex", alignItems: "center", gap: "4px" }}><div style={{ width: "8px", height: "8px", borderRadius: "2px", background: d.color }} /><span style={{ fontSize: "11px", color: "#64748b" }}>{d.name}</span></div>)}
            </div>
          </div>
          <div>
            <div style={{ fontSize: "11px", fontWeight: "700", color: "#475569", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "14px" }}>Sentiment Trend</div>
            <ResponsiveContainer width="100%" height={170}>
              <AreaChart data={SENTIMENT_TREND}>
                <defs>
                  <linearGradient id="pg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} /><stop offset="95%" stopColor="#22c55e" stopOpacity={0} /></linearGradient>
                  <linearGradient id="ng" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} /><stop offset="95%" stopColor="#ef4444" stopOpacity={0} /></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="positive" stroke="#22c55e" strokeWidth={2} fill="url(#pg)" name="Positive" />
                <Area type="monotone" dataKey="neutral" stroke="#f59e0b" strokeWidth={2} fill="none" strokeDasharray="4 3" name="Neutral" />
                <Area type="monotone" dataKey="negative" stroke="#ef4444" strokeWidth={2} fill="url(#ng)" name="Negative" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────────────────────────────────────────────
   MEDICINES PAGE
─────────────────────────────────────────────────────────────── */
function MedicinesPage() {
  const [search, setSearch] = useState("");
  const filtered = MEDICINES.filter(m => m.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px" }}>
        <StatCard label="Total Medicines" value="6" sub="In current database" accent="#6366f1" delay="card-enter-1" />
        <StatCard label="Safe to Use" value="3" sub="LOW risk medicines" accent="#22c55e" delay="card-enter-2" />
        <StatCard label="Total Reviews" value="1,815" sub="Across all medicines" accent="#f59e0b" delay="card-enter-3" />
      </div>

      <div style={CARD} className="card-enter">
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a" }}>Medicine Database</div>
          <input placeholder="Search medicines…" value={search} onChange={e => setSearch(e.target.value)} style={{ padding: "7px 12px", border: "1.5px solid #e2e8f0", borderRadius: "9px", fontSize: "13px", fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#1e293b", background: "#f9fafb", outline: "none", width: "200px" }} onFocus={e => e.target.style.borderColor = "#6366f1"} onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                {["Medicine", "Reviews", "Suitability", "Rating", "Risk Status"].map(h => (
                  <th key={h} style={{ padding: "11px 20px", textAlign: "left", fontSize: "11px", fontWeight: "700", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.07em", borderBottom: "1px solid #f1f5f9" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((m, i) => {
                const cfg = RISK_CFG[m.risk];
                return (
                  <tr key={m.id} style={{ borderBottom: "1px solid #f8fafc", transition: "background 0.15s", cursor: "pointer" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <td style={{ padding: "13px 20px", fontSize: "14px", fontWeight: "600", color: "#0f172a" }}>{m.name}</td>
                    <td style={{ padding: "13px 20px", fontSize: "13px", color: "#475569", fontFamily: "'JetBrains Mono', monospace" }}>{m.reviews.toLocaleString()}</td>
                    <td style={{ padding: "13px 20px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <div style={{ width: "70px", height: "5px", background: "#e2e8f0", borderRadius: "3px" }}>
                          <div style={{ width: `${m.suitability}%`, height: "100%", background: cfg.color, borderRadius: "3px" }} />
                        </div>
                        <span style={{ fontSize: "12px", fontWeight: "600", color: cfg.text, fontFamily: "'JetBrains Mono', monospace" }}>{m.suitability}%</span>
                      </div>
                    </td>
                    <td style={{ padding: "13px 20px", fontSize: "13px", color: "#f59e0b", fontFamily: "'JetBrains Mono', monospace" }}>{"★".repeat(Math.round(m.rating))} {m.rating}</td>
                    <td style={{ padding: "13px 20px" }}>
                      <Badge label={m.risk === "LOW" ? "✓ Safe" : m.risk === "MEDIUM" ? "◉ Caution" : "⚠ High Risk"} color={cfg.text} bg={cfg.bg} border={cfg.border} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────────────────────────────────────────────
   REVIEWS PAGE
─────────────────────────────────────────────────────────────── */
function ReviewsPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div style={CARD} className="card-enter">
        <div style={{ padding: "16px 22px", borderBottom: "1px solid #f1f5f9" }}>
          <div style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a" }}>Weekly Review Sentiment Trend</div>
          <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "2px" }}>Positive / Neutral / Negative reviews over 7 days</div>
        </div>
        <div style={{ padding: "20px 22px" }}>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={SENTIMENT_TREND}>
              <defs>
                <linearGradient id="rp" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#22c55e" stopOpacity={0.25} /><stop offset="95%" stopColor="#22c55e" stopOpacity={0} /></linearGradient>
                <linearGradient id="rn" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#ef4444" stopOpacity={0.25} /><stop offset="95%" stopColor="#ef4444" stopOpacity={0} /></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="positive" stroke="#22c55e" strokeWidth={2.5} fill="url(#rp)" name="Positive" />
              <Area type="monotone" dataKey="neutral"  stroke="#f59e0b" strokeWidth={2}   fill="none" strokeDasharray="5 3" name="Neutral" />
              <Area type="monotone" dataKey="negative" stroke="#ef4444" strokeWidth={2}   fill="url(#rn)" name="Negative" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px" }}>
        {MEDICINES.map((m, i) => {
          const cfg = RISK_CFG[m.risk];
          return (
            <div key={m.id} style={{ ...CARD, padding: "18px", borderTop: `3px solid ${cfg.color}`, cursor: "pointer", transition: "transform 0.15s, box-shadow 0.15s" }} className={`card-enter card-enter-${(i % 4) + 1}`}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(15,23,42,0.12)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(15,23,42,0.06)"; }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                <div style={{ fontSize: "15px", fontWeight: "700", color: "#0f172a" }}>{m.name}</div>
                <Badge label={m.risk} color={cfg.text} bg={cfg.bg} border={cfg.border} />
              </div>
              <div style={{ fontSize: "22px", color: "#f59e0b", marginBottom: "8px" }}>{"★".repeat(Math.round(m.rating))}<span style={{ fontSize: "13px", color: "#94a3b8", fontFamily: "'JetBrains Mono', monospace" }}> {m.rating}</span></div>
              <div style={{ fontSize: "11px", color: "#64748b", marginBottom: "10px" }}>Side effects: {m.effects.join(", ")}</div>
              <div style={{ display: "flex", gap: "8px" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "10px", color: "#94a3b8", marginBottom: "3px" }}>Suitable</div>
                  <div style={{ height: "5px", background: "#e2e8f0", borderRadius: "3px" }}><div style={{ width: `${m.suitability}%`, height: "100%", background: "#22c55e", borderRadius: "3px" }} /></div>
                  <div style={{ fontSize: "11px", color: "#22c55e", fontWeight: "600", marginTop: "2px" }}>{m.suitability}%</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "10px", color: "#94a3b8", marginBottom: "3px" }}>Not suitable</div>
                  <div style={{ height: "5px", background: "#e2e8f0", borderRadius: "3px" }}><div style={{ width: `${100 - m.suitability}%`, height: "100%", background: "#ef4444", borderRadius: "3px" }} /></div>
                  <div style={{ fontSize: "11px", color: "#ef4444", fontWeight: "600", marginTop: "2px" }}>{100 - m.suitability}%</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ───────────────────────────────────────────────────────────────
   ANALYTICS PAGE
─────────────────────────────────────────────────────────────── */
function AnalyticsPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px" }}>
        <div style={CARD} className="card-enter card-enter-1">
          <div style={{ padding: "16px 22px", borderBottom: "1px solid #f1f5f9" }}>
            <div style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a" }}>Suitability Distribution</div>
            <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "2px" }}>Risk level breakdown across all medicines</div>
          </div>
          <div style={{ padding: "20px 22px" }}>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={RISK_PIE} cx="50%" cy="50%" outerRadius={88} paddingAngle={4} dataKey="value" label={({ name, value }) => `${name}: ${value}`} labelLine>
                  {RISK_PIE.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={CARD} className="card-enter card-enter-2">
          <div style={{ padding: "16px 22px", borderBottom: "1px solid #f1f5f9" }}>
            <div style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a" }}>Reviews by Medicine</div>
            <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "2px" }}>Total review count per medicine</div>
          </div>
          <div style={{ padding: "20px 22px" }}>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={BAR_DATA} barCategoryGap="35%">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="reviews" fill="#6366f1" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div style={CARD} className="card-enter card-enter-3">
        <div style={{ padding: "16px 22px", borderBottom: "1px solid #f1f5f9" }}>
          <div style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a" }}>7-Day Sentiment Trend</div>
        </div>
        <div style={{ padding: "20px 22px" }}>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={SENTIMENT_TREND}>
              <defs>
                <linearGradient id="ap" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} /><stop offset="95%" stopColor="#6366f1" stopOpacity={0} /></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="positive" stroke="#22c55e" strokeWidth={2} fill="none" name="Positive" />
              <Area type="monotone" dataKey="neutral"  stroke="#f59e0b" strokeWidth={2} fill="none" name="Neutral" />
              <Area type="monotone" dataKey="negative" stroke="#ef4444" strokeWidth={2} fill="none" name="Negative" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────────────────────────────────────────────
   AI HEALTH UPDATES PAGE
─────────────────────────────────────────────────────────────── */
function UpdatesPage({ updates, loading, onRefresh, lastFetched }) {
  const typeCount = { Trend: 0, Warning: 0, Outbreak: 0, Drug: 0 };
  updates.forEach(u => { if (typeCount[u.type] !== undefined) typeCount[u.type]++; });

  const countCards = [
    { label: "Trends", val: typeCount.Trend,    color: "#0ea5e9", bg: "#f0f9ff", border: "#bae6fd" },
    { label: "Warnings",val: typeCount.Warning, color: "#f59e0b", bg: "#fffbeb", border: "#fde68a" },
    { label: "Outbreaks",val: typeCount.Outbreak,color: "#8b5cf6", bg: "#f5f3ff", border: "#ddd6fe" },
    { label: "Drug Alerts",val: typeCount.Drug, color: "#10b981", bg: "#f0fdf4", border: "#bbf7d0" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Header strip */}
      <div style={{ ...CARD, padding: "20px 24px", background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)", border: "none" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "5px" }}>
              <span style={{ width: "8px", height: "8px", background: "#ef4444", borderRadius: "50%", display: "inline-block", animation: "blink 1.5s infinite" }} />
              <span style={{ fontSize: "16px", fontWeight: "800", color: "#fff", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>AI Health Intelligence Feed</span>
              <span style={{ fontSize: "10px", background: "rgba(239,68,68,0.2)", border: "1px solid rgba(239,68,68,0.4)", color: "#fca5a5", borderRadius: "5px", padding: "2px 7px", fontWeight: "600", fontFamily: "'JetBrains Mono', monospace" }}>LIVE</span>
            </div>
            <div style={{ fontSize: "12px", color: "#94a3b8" }}>
              Powered by Claude AI · Analyzing news, health reports, and public data
              {lastFetched && <span> · Last updated {lastFetched}</span>}
            </div>
          </div>
          <button onClick={onRefresh} disabled={loading} style={{ display: "flex", alignItems: "center", gap: "7px", background: "rgba(99,102,241,0.2)", border: "1px solid rgba(99,102,241,0.4)", color: "#a5b4fc", padding: "9px 16px", borderRadius: "9px", cursor: loading ? "not-allowed" : "pointer", fontSize: "13px", fontWeight: "600", fontFamily: "'Plus Jakarta Sans', sans-serif", opacity: loading ? 0.6 : 1, transition: "all 0.15s" }}>
            {loading ? <Spinner size={14} color="#a5b4fc" /> : "↻"} {loading ? "Fetching…" : "Refresh"}
          </button>
        </div>
      </div>

      {/* Type counters */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
        {countCards.map((c, i) => (
          <div key={c.label} style={{ ...CARD, padding: "14px 18px", borderLeft: `3px solid ${c.color}` }} className={`card-enter card-enter-${i + 1}`}>
            <div style={{ fontSize: "10px", color: "#94a3b8", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "5px" }}>{c.label}</div>
            <div style={{ fontSize: "28px", fontWeight: "800", color: c.color, fontFamily: "'JetBrains Mono', monospace" }}>{c.val}</div>
          </div>
        ))}
      </div>

      {/* Feed */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} style={{ ...CARD, padding: "18px 22px" }}>
              <div style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                <ShimmerBlock h={40} w="40px" mb={0} />
                <div style={{ flex: 1 }}>
                  <ShimmerBlock h={16} w="25%" mb={8} />
                  <ShimmerBlock h={13} w="90%" mb={4} />
                  <ShimmerBlock h={13} w="70%" mb={0} />
                </div>
              </div>
            </div>
          ))
        ) : updates.map((u, i) => (
          <div key={i} style={{ ...CARD, padding: "18px 22px", borderLeft: `4px solid ${UPDATE_COLORS[u.emoji] || "#6366f1"}`, background: UPDATE_BG[u.emoji] || "#fff", border: `1px solid ${UPDATE_BORDER[u.emoji] || "#e2e8f0"}`, borderLeft: `4px solid ${UPDATE_COLORS[u.emoji] || "#6366f1"}`, animation: `slideInLeft 0.35s ease both`, animationDelay: `${i * 0.07}s` }}>
            <div style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: `${UPDATE_COLORS[u.emoji] || "#6366f1"}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", flexShrink: 0 }}>{u.emoji}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                  <Badge label={u.type} color={UPDATE_COLORS[u.emoji] || "#6366f1"} bg={`${UPDATE_COLORS[u.emoji]}18` || "#f8fafc"} border={`${UPDATE_COLORS[u.emoji]}40` || "#e2e8f0"} />
                  <span style={{ fontSize: "11px", color: "#94a3b8" }}>AI-generated · Just now</span>
                </div>
                <div style={{ fontSize: "14px", color: "#1e293b", lineHeight: 1.55, fontWeight: "500" }}>{u.text}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: "center", fontSize: "11px", color: "#94a3b8", padding: "4px 0 12px" }}>
        Updates generated by Claude AI (claude-sonnet-4-20250514) · For informational purposes only · Not a substitute for clinical judgment
      </div>
    </div>
  );
}

/* ───────────────────────────────────────────────────────────────
   PROFILE PAGE
─────────────────────────────────────────────────────────────── */
function ProfilePage({ user, setUser }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user.name, email: user.email, role: user.role });

  const save = () => { setUser({ ...user, ...form }); setEditing(false); };
  const cancel = () => { setForm({ name: user.name, email: user.email, role: user.role }); setEditing(false); };

  const inputStyle = { width: "100%", padding: "10px 13px", border: "1.5px solid #e2e8f0", borderRadius: "9px", fontSize: "13.5px", fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#1e293b", background: "#f9fafb", outline: "none" };

  return (
    <div style={{ maxWidth: "560px", margin: "0 auto" }}>
      <div style={CARD} className="card-enter">
        <div style={{ padding: "28px 28px 20px", display: "flex", flexDirection: "column", alignItems: "center", borderBottom: "1px solid #f1f5f9" }}>
          <div style={{ width: "72px", height: "72px", borderRadius: "50%", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", fontWeight: "800", color: "#fff", marginBottom: "14px", boxShadow: "0 4px 18px rgba(99,102,241,0.3)" }}>
            {user.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
          </div>
          {!editing ? (
            <>
              <div style={{ fontSize: "19px", fontWeight: "700", color: "#0f172a" }}>{user.name}</div>
              <div style={{ fontSize: "13px", color: "#94a3b8", marginTop: "4px" }}>{user.role}</div>
              <div style={{ fontSize: "13px", color: "#6366f1", marginTop: "2px" }}>{user.email}</div>
            </>
          ) : null}
        </div>
        <div style={{ padding: "22px 28px" }}>
          {editing ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div><div style={{ fontSize: "11px", color: "#94a3b8", fontWeight: "600", marginBottom: "5px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Full Name</div><input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={inputStyle} onFocus={e => e.target.style.borderColor = "#6366f1"} onBlur={e => e.target.style.borderColor = "#e2e8f0"} /></div>
              <div><div style={{ fontSize: "11px", color: "#94a3b8", fontWeight: "600", marginBottom: "5px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Email</div><input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} style={inputStyle} onFocus={e => e.target.style.borderColor = "#6366f1"} onBlur={e => e.target.style.borderColor = "#e2e8f0"} /></div>
              <div><div style={{ fontSize: "11px", color: "#94a3b8", fontWeight: "600", marginBottom: "5px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Role / Specialty</div><input value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} style={inputStyle} onFocus={e => e.target.style.borderColor = "#6366f1"} onBlur={e => e.target.style.borderColor = "#e2e8f0"} /></div>
              <div style={{ display: "flex", gap: "10px", marginTop: "6px" }}>
                <button onClick={save} style={{ flex: 1, padding: "11px", borderRadius: "10px", border: "none", background: "linear-gradient(135deg, #4f46e5, #7c3aed)", color: "#fff", fontSize: "13.5px", fontWeight: "700", cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Save Changes</button>
                <button onClick={cancel} style={{ flex: 1, padding: "11px", borderRadius: "10px", border: "1px solid #e2e8f0", background: "#fff", color: "#475569", fontSize: "13.5px", fontWeight: "600", cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Cancel</button>
              </div>
            </div>
          ) : (
            <button onClick={() => setEditing(true)} style={{ width: "100%", padding: "11px", borderRadius: "10px", border: "1.5px solid #6366f1", background: "#fff", color: "#6366f1", fontSize: "13.5px", fontWeight: "700", cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif", transition: "all 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.background = "#eef2ff"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#fff"; }}>
              ✏ Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────────────────────────────────────────────
   SETTINGS PAGE
─────────────────────────────────────────────────────────────── */
function SettingsPage() {
  const [settings, setSettings] = useState({ emailHigh: true, weeklyReview: false, shareData: false, twoFA: true });
  const toggle = k => setSettings(s => ({ ...s, [k]: !s[k] }));

  const Toggle = ({ k }) => (
    <div onClick={() => toggle(k)} style={{ width: "42px", height: "22px", borderRadius: "11px", background: settings[k] ? "#6366f1" : "#d1d5db", cursor: "pointer", position: "relative", transition: "background 0.2s", flexShrink: 0 }}>
      <div style={{ position: "absolute", width: "18px", height: "18px", background: "#fff", borderRadius: "50%", top: "2px", left: settings[k] ? "22px" : "2px", transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.15)" }} />
    </div>
  );

  const Section = ({ title, items }) => (
    <div style={CARD} className="card-enter">
      <div style={{ padding: "14px 22px", borderBottom: "1px solid #f1f5f9", fontSize: "14px", fontWeight: "700", color: "#0f172a" }}>{title}</div>
      <div style={{ padding: "6px 0" }}>
        {items.map(item => (
          <div key={item.k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 22px", borderBottom: "1px solid #f8fafc" }}>
            <div>
              <div style={{ fontSize: "13.5px", fontWeight: "600", color: "#0f172a" }}>{item.label}</div>
              <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "2px" }}>{item.sub}</div>
            </div>
            <Toggle k={item.k} />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "16px" }}>
      <Section title="🔔 Notifications" items={[
        { k: "emailHigh", label: "Email Alerts for High-Risk Medicines", sub: "Receive email when HIGH risk is detected" },
        { k: "weeklyReview", label: "Weekly Medicine Review Summary", sub: "Weekly digest of all medicine reviews" },
      ]} />
      <Section title="🔒 Privacy & Security" items={[
        { k: "shareData", label: "Share Anonymous Usage Data", sub: "Help improve AURA with anonymized analytics" },
        { k: "twoFA", label: "Two-Factor Authentication", sub: "Add an extra layer of account security" },
      ]} />
    </div>
  );
}

/* ───────────────────────────────────────────────────────────────
   ROOT APP
─────────────────────────────────────────────────────────────── */
export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("Dashboard");
  const [updates, setUpdates] = useState([]);
  const [updatesLoading, setUpdatesLoading] = useState(false);
  const [lastFetched, setLastFetched] = useState(null);

  const loadUpdates = useCallback(async () => {
    setUpdatesLoading(true);
    try {
      const data = await fetchAIHealthUpdates();
      setUpdates(data);
      setLastFetched(new Date().toLocaleTimeString());
    } catch {
      setUpdates(FALLBACK_UPDATES);
      setLastFetched(new Date().toLocaleTimeString() + " (cached)");
    }
    setUpdatesLoading(false);
  }, []);

  useEffect(() => { if (user) loadUpdates(); }, [user]);

  if (!user) return (
    <>
      <style>{GLOBAL_STYLE}</style>
      <AuthPage onLogin={u => { setUser(u); setPage("Dashboard"); }} />
    </>
  );

  const PAGES = {
    Dashboard: <DashboardPage updates={updates} updatesLoading={updatesLoading} />,
    Medicines:  <MedicinesPage />,
    Reviews:    <ReviewsPage />,
    Analytics:  <AnalyticsPage />,
    Updates:    <UpdatesPage updates={updates} loading={updatesLoading} onRefresh={loadUpdates} lastFetched={lastFetched} />,
    Profile:    <ProfilePage user={user} setUser={setUser} />,
    Settings:   <SettingsPage />,
  };

  return (
    <>
      <style>{GLOBAL_STYLE}</style>
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Navbar page={page} setPage={setPage} user={user} onLogout={() => setUser(null)} updates={updates} />
        <div style={{ flex: 1, padding: "24px 28px 32px", maxWidth: "1320px", width: "100%", margin: "0 auto", boxSizing: "border-box" }}>
          {PAGES[page] || PAGES.Dashboard}
        </div>
        <footer style={{ textAlign: "center", padding: "12px", fontSize: "11px", color: "#94a3b8", borderTop: "1px solid #e8eef4", background: "#fff" }}>
          AURA v2.0 · AI-Powered Health Signal Intelligence · For clinical decision support only
        </footer>
      </div>
    </>
  );
}