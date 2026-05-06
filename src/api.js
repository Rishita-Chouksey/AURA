/**
 * AURA API Service
 * Centralised API layer — swap BASE_URL when your Flask backend is running.
 */
import axios from "axios";

const BASE_URL = import.meta.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 12000,
  headers: { "Content-Type": "application/json" },
});

/* ── Interceptors ─────────────────────────────────────────── */
client.interceptors.response.use(
  r => r.data,
  err => {
    const msg = err.response?.data?.message || err.message || "Request failed";
    return Promise.reject(new Error(msg));
  }
);

/* ── AURA Analysis API ────────────────────────────────────── */
export const auraAPI = {
  /** Analyze a single text string */
  analyzeText: (text) => client.post("/api/analyze", { text }),

  /** Batch analyze multiple texts */
  batchAnalyze: (texts) => client.post("/api/batch-analyze", { texts }),

  /** Full risk assessment for a given text */
  getRiskAssessment: (text) => client.post("/api/risk-assess", { text }),

  /** Named-entity extraction (drugs, symptoms, conditions) */
  extractEntities: (text) => client.post("/api/entities", { text }),

  /** Sentiment analysis */
  getSentiment: (text) => client.post("/api/sentiment", { text }),

  /** Fetch alerts filtered by risk level */
  getAlerts: (riskLevel = "HIGH") =>
    client.get("/api/alerts", { params: { risk_level: riskLevel } }),

  /** Download/view report */
  getReport: () => client.get("/api/report"),
};

/* ── Patient Management API ───────────────────────────────── */
export const patientAPI = {
  getPatients: () => client.get("/api/patients"),
  getPatient: (id) => client.get(`/api/patients/${id}`),
  addPatient: (payload) => client.post("/api/patients", payload),
  updatePatient: (id, payload) => client.put(`/api/patients/${id}`, payload),
  deletePatient: (id) => client.delete(`/api/patients/${id}`),
  getPatientAnalysis: (id) => client.get(`/api/patients/${id}/analysis`),
};

/* ── Health & Stats API ───────────────────────────────────── */
export const healthAPI = {
  getHealth: () => client.get("/health"),
  getStats: () => client.get("/api/stats"),
};

/* ── Anthropic AI Health Updates (called directly from browser) ─ */
export async function fetchAIHealthUpdates() {
  const prompt = `You are an AI-powered health intelligence engine.
Analyze data aggregated from multiple sources such as news articles, public health reports,
government datasets, and social media trends.
Generate real-time "Health Updates" that provide actionable insights, not raw data.

Guidelines:
- Keep each update concise (1–2 lines max)
- Use trend indicators like "rising", "spiking", "declining"
- Avoid generic statements — be specific and urgent
- Return exactly 5 updates, one per line
- Each update must start with an emoji:
  📈 for rising trends
  ⚠️ for warnings
  🦠 for diseases/outbreaks
  💊 for medicines/drugs

Return ONLY the formatted updates. No explanations, headers, or extra text.`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) throw new Error(`Anthropic API error: ${res.status}`);
  const data = await res.json();

  const raw = (data.content || []).map(b => b.text || "").join("\n");
  const lines = raw
    .split("\n")
    .map(l => l.trim())
    .filter(l => l.length > 5 && /^[📈⚠️🦠💊]/.test(l));

  if (!lines.length) throw new Error("No valid updates returned");

  const typeMap = { "📈": "Trend", "⚠️": "Warning", "🦠": "Outbreak", "💊": "Drug" };
  return lines.map(line => {
    const emoji = [...line].find(c => "📈⚠️🦠💊".includes(c)) || "📈";
    return {
      emoji,
      type: typeMap[emoji] || "Update",
      text: line.replace(/^[📈⚠️🦠💊]\s*/, "").trim(),
    };
  });
}