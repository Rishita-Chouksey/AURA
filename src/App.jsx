import { useState, useEffect, useCallback, useRef } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, LineChart, Line, RadarChart, Radar, PolarGrid, PolarAngleAxis,
} from "recharts";

/* ─── IMPORT YOUR medicinedb.js exports (inline for portability) ─── */
// In your project: import { MEDICINES_DB, MEDICINE_CATEGORIES, TOTAL_REVIEWS, LOW_COUNT, MEDIUM_COUNT, HIGH_COUNT, RISK_PIE_DATA, SYMPTOM_FREQ_DATA, CATEGORY_DATA } from './medicinedb.js';
// Below is a representative slice used directly in the component — replace with the import above for full 60+ medicines.

const MEDICINE_CATEGORIES = [
  "Pain & Inflammation","Cardiovascular","Antibiotics","Diabetes",
  "Respiratory","Mental Health","Gastrointestinal","Anticoagulants",
  "Hormonal","Oncology","Neurological","Immunosuppressants",
];

const MEDICINES_DB = [
  { id:1, category:"Pain & Inflammation", name:"Paracetamol", genericName:"Acetaminophen", reviews:6210, suitability:95, rating:4.8, risk:"LOW", manufacturer:"Various (generic)", approved:1955, dosage:"325–1000 mg every 4–6 hours", description:"Safe analgesic and antipyretic. First-line for mild to moderate pain, safe in pregnancy.", symptoms:["headache","toothache","fever","mild to moderate pain","cold symptoms"], effects:["rare rash","nausea at high doses","liver toxicity (overdose)"], contraindications:["severe liver disease","chronic heavy alcohol use"], interactions:["warfarin (high doses)","alcohol","isoniazid"], sentiment:"positive" },
  { id:2, category:"Pain & Inflammation", name:"Ibuprofen", genericName:"Ibuprofen", reviews:5670, suitability:87, rating:4.3, risk:"LOW", manufacturer:"Various (generic)", approved:1969, dosage:"200–800 mg every 4–6 hours", description:"NSAID for pain, fever, and inflammation. Available OTC and prescription.", symptoms:["headache","dental pain","menstrual cramps","arthritis","back pain","fever"], effects:["heartburn","stomach pain","dizziness","fluid retention"], contraindications:["third trimester pregnancy","severe renal impairment","active GI bleeding"], interactions:["aspirin","warfarin","lithium","ACE inhibitors"], sentiment:"positive" },
  { id:3, category:"Pain & Inflammation", name:"Aspirin", genericName:"Acetylsalicylic Acid", reviews:4820, suitability:91, rating:4.5, risk:"LOW", manufacturer:"Bayer AG", approved:1899, dosage:"75–325 mg once daily", description:"NSAID for pain relief, fever reduction, and antiplatelet therapy.", symptoms:["headache","mild pain","fever","inflammation","platelet aggregation prevention"], effects:["stomach irritation","mild nausea","GI upset","rare: tinnitus"], contraindications:["active peptic ulcer","hemophilia","children under 12"], interactions:["warfarin (increased bleeding)","ibuprofen","alcohol"], sentiment:"positive" },
  { id:4, category:"Pain & Inflammation", name:"Diclofenac", genericName:"Diclofenac Sodium", reviews:1890, suitability:79, rating:3.9, risk:"MEDIUM", manufacturer:"Novartis", approved:1974, dosage:"50 mg two or three times daily", description:"Potent NSAID. Higher cardiovascular risk than other NSAIDs.", symptoms:["osteoarthritis","rheumatoid arthritis","ankylosing spondylitis","post-op pain"], effects:["GI ulceration","elevated liver enzymes","headache","dizziness","cardiovascular events"], contraindications:["coronary artery disease","active peptic ulcer","severe hepatic impairment"], interactions:["cyclosporine","methotrexate","digoxin","lithium"], sentiment:"neutral" },
  { id:5, category:"Pain & Inflammation", name:"Tramadol", genericName:"Tramadol HCl", reviews:980, suitability:65, rating:3.5, risk:"HIGH", manufacturer:"Grünenthal", approved:1995, dosage:"50–100 mg every 4–6 hours", description:"Opioid analgesic for moderate to severe pain. Carries addiction potential.", symptoms:["moderate to severe pain","chronic pain","post-operative pain","neuropathic pain"], effects:["dizziness","nausea","constipation","sweating","seizure risk","dependence"], contraindications:["MAOI use within 14 days","severe respiratory depression","epilepsy"], interactions:["SSRIs (serotonin syndrome)","MAOIs","alcohol","benzodiazepines"], sentiment:"negative" },
  { id:6, category:"Cardiovascular", name:"Lisinopril", genericName:"Lisinopril", reviews:3270, suitability:82, rating:4.1, risk:"MEDIUM", manufacturer:"AstraZeneca / Merck", approved:1987, dosage:"5–40 mg once daily", description:"ACE inhibitor for hypertension, heart failure, and post-MI cardioprotection.", symptoms:["hypertension","heart failure","post-MI management","diabetic nephropathy"], effects:["dry cough","hyperkalemia","hypotension","dizziness","angioedema (rare)"], contraindications:["bilateral renal artery stenosis","history of angioedema","pregnancy"], interactions:["potassium supplements","NSAIDs","diuretics","lithium"], sentiment:"positive" },
  { id:7, category:"Cardiovascular", name:"Atorvastatin", genericName:"Atorvastatin Calcium", reviews:4120, suitability:88, rating:4.4, risk:"LOW", manufacturer:"Pfizer (Lipitor)", approved:1996, dosage:"10–80 mg once daily", description:"Statin for hypercholesterolemia and cardiovascular risk reduction.", symptoms:["hypercholesterolemia","cardiovascular risk","mixed dyslipidemia"], effects:["myopathy","elevated liver enzymes","diabetes risk","headache","GI upset"], contraindications:["active liver disease","pregnancy","breastfeeding"], interactions:["gemfibrozil","niacin","cyclosporine","clarithromycin"], sentiment:"positive" },
  { id:8, category:"Cardiovascular", name:"Warfarin", genericName:"Warfarin Sodium", reviews:1240, suitability:62, rating:3.6, risk:"HIGH", manufacturer:"Bristol-Myers Squibb (Coumadin)", approved:1954, dosage:"2–10 mg daily (INR-adjusted)", description:"Vitamin K antagonist anticoagulant. Narrow therapeutic index requires INR monitoring.", symptoms:["DVT","PE","atrial fibrillation","mechanical heart valves","stroke prevention"], effects:["bleeding risk","bruising","haematuria","intracranial haemorrhage"], contraindications:["active bleeding","pregnancy","severe hepatic impairment","non-compliant patients"], interactions:["aspirin","NSAIDs","amiodarone","fluconazole","rifampicin","many antibiotics"], sentiment:"negative" },
  { id:9, category:"Antibiotics", name:"Amoxicillin", genericName:"Amoxicillin Trihydrate", reviews:5120, suitability:89, rating:4.4, risk:"LOW", manufacturer:"GlaxoSmithKline", approved:1972, dosage:"250–500 mg every 8 hours", description:"Broad-spectrum penicillin antibiotic for respiratory, urinary, and skin infections.", symptoms:["ear infection","throat infection","UTI","pneumonia","skin infection"], effects:["diarrhea","nausea","rash","hypersensitivity","thrush"], contraindications:["penicillin allergy","mononucleosis"], interactions:["warfarin","oral contraceptives","allopurinol","methotrexate"], sentiment:"positive" },
  { id:10, category:"Antibiotics", name:"Azithromycin", genericName:"Azithromycin Dihydrate", reviews:4350, suitability:86, rating:4.3, risk:"LOW", manufacturer:"Pfizer (Zithromax)", approved:1991, dosage:"500 mg day 1, then 250 mg days 2–5", description:"Macrolide antibiotic for respiratory and STI infections.", symptoms:["respiratory infection","pneumonia","chlamydia","gonorrhea","skin infections"], effects:["GI upset","diarrhea","QT prolongation","hearing changes (rare)","hepatotoxicity"], contraindications:["QT prolongation","hepatic impairment","hypersensitivity"], interactions:["antacids","warfarin","digoxin","cyclosporine"], sentiment:"positive" },
  { id:11, category:"Antibiotics", name:"Ciprofloxacin", genericName:"Ciprofloxacin HCl", reviews:2890, suitability:78, rating:4.0, risk:"MEDIUM", manufacturer:"Bayer AG (Cipro)", approved:1987, dosage:"250–750 mg twice daily", description:"Fluoroquinolone antibiotic for UTIs, respiratory, and GI infections.", symptoms:["UTI","diarrhea","typhoid","anthrax","respiratory infections"], effects:["tendon rupture","peripheral neuropathy","QT prolongation","photosensitivity"], contraindications:["tendon disorders","myasthenia gravis","fluoroquinolone allergy"], interactions:["antacids","warfarin","NSAIDs","theophylline"], sentiment:"neutral" },
  { id:12, category:"Antibiotics", name:"Doxycycline", genericName:"Doxycycline Hyclate", reviews:3210, suitability:84, rating:4.1, risk:"LOW", manufacturer:"Vibramycin/Pfizer", approved:1967, dosage:"100 mg twice daily", description:"Tetracycline antibiotic for acne, malaria prevention, and various infections.", symptoms:["acne","malaria prevention","STIs","respiratory infections","Lyme disease"], effects:["photosensitivity","GI upset","esophageal irritation","dental discoloration (children)"], contraindications:["children under 8","pregnancy","esophageal disorders"], interactions:["antacids","iron","warfarin","oral contraceptives"], sentiment:"positive" },
  { id:13, category:"Diabetes", name:"Metformin", genericName:"Metformin HCl", reviews:5890, suitability:88, rating:4.4, risk:"LOW", manufacturer:"Various (generic)", approved:1994, dosage:"500–2000 mg daily with meals", description:"First-line biguanide for type 2 diabetes. Also used off-label for PCOS and weight management.", symptoms:["type 2 diabetes","PCOS","insulin resistance","pre-diabetes"], effects:["diarrhea","nausea","fatigue","vitamin B12 deficiency","lactic acidosis (rare)"], contraindications:["severe renal impairment (eGFR <30)","hepatic failure","contrast media use"], interactions:["alcohol","iodinated contrast","cimetidine","carbonic anhydrase inhibitors"], sentiment:"positive" },
  { id:14, category:"Diabetes", name:"Glipizide", genericName:"Glipizide", reviews:1540, suitability:76, rating:3.9, risk:"MEDIUM", manufacturer:"Pfizer (Glucotrol)", approved:1984, dosage:"5–40 mg daily", description:"Sulfonylurea stimulating pancreatic insulin secretion for T2D.", symptoms:["type 2 diabetes","postprandial hyperglycemia"], effects:["hypoglycemia","weight gain","GI upset","rash","photosensitivity"], contraindications:["type 1 diabetes","ketoacidosis","sulfonamide allergy","severe renal/hepatic impairment"], interactions:["fluconazole","NSAIDs","alcohol","beta-blockers (mask hypoglycemia)"], sentiment:"neutral" },
  { id:15, category:"Respiratory", name:"Salbutamol", genericName:"Albuterol", reviews:4230, suitability:91, rating:4.5, risk:"LOW", manufacturer:"GlaxoSmithKline (Ventolin)", approved:1968, dosage:"100 mcg 2 puffs every 4–6 hours PRN", description:"Short-acting beta-2 agonist bronchodilator for acute asthma and COPD.", symptoms:["asthma attack","COPD exacerbation","exercise-induced bronchospasm","wheeze"], effects:["tachycardia","tremor","hypokalaemia","headache","anxiety"], contraindications:["hypersensitivity to sympathomimetics","cardiac arrhythmias"], interactions:["beta-blockers (antagonism)","diuretics (hypokalaemia)","MAOIs"], sentiment:"positive" },
  { id:16, category:"Mental Health", name:"Sertraline", genericName:"Sertraline HCl", reviews:4870, suitability:81, rating:4.1, risk:"MEDIUM", manufacturer:"Pfizer (Zoloft)", approved:1991, dosage:"50–200 mg once daily", description:"SSRI antidepressant for depression, OCD, PTSD, panic disorder, and social anxiety.", symptoms:["major depression","OCD","PTSD","panic disorder","social anxiety disorder","PMDD"], effects:["nausea","insomnia","diarrhea","sexual dysfunction","weight changes","serotonin syndrome (rare)"], contraindications:["MAOIs within 14 days","pimozide","linezolid","methylene blue"], interactions:["MAOIs","pimozide","tramadol","NSAIDs (bleeding risk)","warfarin"], sentiment:"positive" },
  { id:17, category:"Gastrointestinal", name:"Omeprazole", genericName:"Omeprazole", reviews:3980, suitability:87, rating:4.3, risk:"LOW", manufacturer:"AstraZeneca (Prilosec)", approved:1989, dosage:"20–40 mg once daily", description:"PPI reducing gastric acid for GERD, peptic ulcers, and H. pylori eradication.", symptoms:["GERD","peptic ulcer","H. pylori eradication","NSAID-induced ulcer prevention","Zollinger-Ellison syndrome"], effects:["headache","diarrhea","nausea","vitamin B12 deficiency","hypomagnesaemia (long-term)"], contraindications:["rilpivirine co-administration","hypersensitivity to PPIs"], interactions:["clopidogrel (reduced effect)","methotrexate","digoxin","atazanavir"], sentiment:"positive" },
  { id:18, category:"Anticoagulants", name:"Apixaban", genericName:"Apixaban", reviews:2340, suitability:83, rating:4.2, risk:"MEDIUM", manufacturer:"Bristol-Myers Squibb/Pfizer (Eliquis)", approved:2012, dosage:"5 mg twice daily (2.5 mg in select patients)", description:"Direct Xa inhibitor for VTE prevention, DVT/PE treatment, and AF stroke prevention.", symptoms:["atrial fibrillation","DVT treatment","PE treatment","VTE prophylaxis (hip/knee)"], effects:["bleeding","bruising","anaemia","nausea","hypersensitivity"], contraindications:["active bleeding","antiphospholipid syndrome","severe hepatic impairment"], interactions:["ketoconazole","rifampicin","P-gp inhibitors","antiplatelet agents"], sentiment:"positive" },
  { id:19, category:"Hormonal", name:"Levothyroxine", genericName:"Levothyroxine Sodium", reviews:5120, suitability:90, rating:4.5, risk:"LOW", manufacturer:"AbbVie (Synthroid)", approved:1961, dosage:"25–200 mcg once daily (TSH-guided)", description:"Thyroid hormone replacement for hypothyroidism. Dose adjusted by TSH monitoring.", symptoms:["hypothyroidism","myxoedema coma","TSH suppression in thyroid cancer"], effects:["tachycardia","insomnia","tremor","osteoporosis (if over-treated)","angina"], contraindications:["thyrotoxicosis","uncorrected adrenal insufficiency","recent MI"], interactions:["antacids (reduced absorption)","warfarin","phenytoin","rifampicin","calcium"], sentiment:"positive" },
  { id:20, category:"Neurological", name:"Gabapentin", genericName:"Gabapentin", reviews:2890, suitability:74, rating:3.8, risk:"MEDIUM", manufacturer:"Pfizer (Neurontin)", approved:1993, dosage:"300–1200 mg three times daily", description:"Anticonvulsant for epilepsy, neuropathic pain, and off-label use for anxiety and RLS.", symptoms:["neuropathic pain","partial seizures","postherpetic neuralgia","restless legs syndrome"], effects:["dizziness","somnolence","ataxia","oedema","weight gain","dependence potential"], contraindications:["hypersensitivity to gabapentin"], interactions:["opioids (respiratory depression)","alcohol","antacids (reduced absorption)","morphine (increased gabapentin)"], sentiment:"neutral" },
  { id:21, category:"Immunosuppressants", name:"Prednisolone", genericName:"Prednisolone", reviews:1890, suitability:72, rating:3.7, risk:"MEDIUM", manufacturer:"Various (generic)", approved:1955, dosage:"5–60 mg daily (condition-dependent)", description:"Systemic corticosteroid for inflammatory, autoimmune, and allergic conditions.", symptoms:["asthma","rheumatoid arthritis","inflammatory bowel disease","severe allergy","nephrotic syndrome"], effects:["hyperglycemia","weight gain","osteoporosis","adrenal suppression","mood changes","infection risk"], contraindications:["systemic fungal infection","live vaccines in high dose","hypersensitivity"], interactions:["NSAIDs","antidiabetics","vaccines","warfarin","CYP3A4 inducers"], sentiment:"neutral" },
  { id:22, category:"Oncology", name:"Tamoxifen", genericName:"Tamoxifen Citrate", reviews:1420, suitability:77, rating:3.9, risk:"MEDIUM", manufacturer:"AstraZeneca (Nolvadex)", approved:1977, dosage:"20 mg once daily for 5–10 years", description:"SERM for hormone receptor-positive breast cancer treatment and prevention.", symptoms:["breast cancer (ER+)","breast cancer prevention (high-risk)","gynecomastia","infertility"], effects:["hot flushes","vaginal discharge","thromboembolism","endometrial cancer risk","mood changes"], contraindications:["pregnancy","personal history of DVT/PE without anticoagulation","concurrent warfarin (generally avoided)"], interactions:["warfarin","CYP2D6 inhibitors (paroxetine)","rifampicin","aminoglutethimide"], sentiment:"neutral" },
];

const TOTAL_REVIEWS = MEDICINES_DB.reduce((s, m) => s + m.reviews, 0);
const LOW_COUNT = MEDICINES_DB.filter(m => m.risk === "LOW").length;
const MEDIUM_COUNT = MEDICINES_DB.filter(m => m.risk === "MEDIUM").length;
const HIGH_COUNT = MEDICINES_DB.filter(m => m.risk === "HIGH").length;
const RISK_PIE_DATA = [
  { name: "Safe", value: LOW_COUNT, color: "#22c55e" },
  { name: "Caution", value: MEDIUM_COUNT, color: "#f59e0b" },
  { name: "High Risk", value: HIGH_COUNT, color: "#ef4444" },
];
const CATEGORY_DATA = MEDICINE_CATEGORIES.map(cat => {
  const meds = MEDICINES_DB.filter(m => m.category === cat);
  return {
    name: cat.split(" ")[0], fullName: cat,
    count: meds.length,
    avgSuitability: meds.length ? Math.round(meds.reduce((s, m) => s + m.suitability, 0) / meds.length) : 0,
    totalReviews: meds.reduce((s, m) => s + m.reviews, 0),
  };
}).filter(c => c.count > 0);

/* ─── GLOBAL STYLES ─── */
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
  .med-card:hover { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(15,23,42,0.13) !important; }
  .med-card { transition: transform 0.2s, box-shadow 0.2s; }
  .nav-item:hover { background: #eef2ff; color: #4f46e5 !important; }
  .filter-btn:hover { background: #eef2ff !important; border-color: #c7d2fe !important; }
`;

/* ─── CONSTANTS ─── */
const CREDENTIALS = [{ email: "doctor@aura.com", password: "password123", name: "Dr. Priya Sharma", role: "Senior Physician" }];

const RISK_CFG = {
  HIGH:   { color: "#ef4444", bg: "#fef2f2", border: "#fecaca", text: "#dc2626", icon: "⚠", pulse: true, label: "High Risk" },
  MEDIUM: { color: "#f59e0b", bg: "#fffbeb", border: "#fde68a", text: "#d97706", icon: "●", pulse: false, label: "Caution" },
  LOW:    { color: "#22c55e", bg: "#f0fdf4", border: "#bbf7d0", text: "#16a34a", icon: "✓", pulse: false, label: "Safe" },
};

const SENTIMENT_TREND = [
  { date:"Mon", positive:30, neutral:44, negative:26 },
  { date:"Tue", positive:28, neutral:41, negative:31 },
  { date:"Wed", positive:36, neutral:39, negative:25 },
  { date:"Thu", positive:22, neutral:37, negative:41 },
  { date:"Fri", positive:41, neutral:35, negative:24 },
  { date:"Sat", positive:46, neutral:37, negative:17 },
  { date:"Sun", positive:39, neutral:43, negative:18 },
];

const FALLBACK_UPDATES = [
  { emoji:"🦠", type:"Outbreak",  text:"Influenza A(H3N2) cases spiking 34% across northern regions." },
  { emoji:"📈", type:"Trend",     text:"Antibiotic-resistant UTI reports rising 22% in urban clinics." },
  { emoji:"⚠️", type:"Warning",  text:"Ibuprofen overuse linked to increased GI bleeding risk in patients over 60." },
  { emoji:"💊", type:"Drug",      text:"Metformin XR batch #7741 recalled due to NDMA impurity exceeding FDA thresholds." },
  { emoji:"📈", type:"Trend",     text:"Dengue fever cases rising 41% in South Asian urban districts." },
];

const UPDATE_BG     = { "🦠":"#f5f3ff","📈":"#f0f9ff","⚠️":"#fffbeb","💊":"#f0fdf4" };
const UPDATE_BORDER = { "🦠":"#ddd6fe","📈":"#bae6fd","⚠️":"#fde68a","💊":"#bbf7d0" };
const UPDATE_COLOR  = { "🦠":"#8b5cf6","📈":"#0ea5e9","⚠️":"#f59e0b","💊":"#10b981" };

const MOCK_ANALYSIS = {
  severe: { symptoms:["severe headache","nausea","blurred vision","medication reaction"], sentiment:"negative", risk_level:"HIGH", confidence:94, reason:["Multiple severe symptoms detected simultaneously","Strongly negative sentiment signals acute distress","Blurred vision + headache matches hypertensive crisis","Post-medication onset suggests adverse drug reaction"] },
  mild:   { symptoms:["mild fever","fatigue","sore throat"], sentiment:"neutral", risk_level:"LOW", confidence:87, reason:["Symptoms are mild and localized","Neutral sentiment indicates manageable condition","Patient is self-managing appropriately","No red-flag symptoms detected"] },
  dizzy:  { symptoms:["dizziness","nausea","chest tightness","shortness of breath"], sentiment:"negative", risk_level:"MEDIUM", confidence:79, reason:["Combination of dizziness and chest tightness requires monitoring","Respiratory symptoms elevate risk tier","Negative sentiment indicates patient distress","Pattern resembles early cardiovascular event"] },
};

const SAMPLE_TEXTS = [
  { label:"Severe headache after medication", text:"I've had a severe splitting headache for 6 hours after my blood pressure medication. The pain is unbearable, and I feel like I'm going to vomit. My vision is slightly blurred." },
  { label:"Mild fever since morning",          text:"Woke up with a mild fever this morning, around 99.5°F. Feeling a bit tired and have a slight sore throat. Took some Tylenol and drinking fluids." },
  { label:"Feeling dizzy and nauseous",        text:"I've been feeling dizzy and nauseous since yesterday. The room spins when I stand up. Also experiencing chest tightness and shortness of breath." },
];

// Mock social monitoring projects
const INITIAL_PROJECTS = [
  {
    id: 1, name: "Warfarin Safety Watch", status: "active",
    keywords: ["warfarin", "bleeding", "INR", "Coumadin", "blood thinner"],
    sources: [
      { type: "Reddit", subreddits: ["r/pharmacy", "r/medicine", "r/askdocs"], latency: "Real-time", status: "running" },
      { type: "Twitter/X", queries: ["warfarin side effects", "#anticoagulants"], latency: "Daily", status: "running" },
    ],
    signals: 1248, highRisk: 87, lastUpdated: "2 min ago",
    trendData: [12,18,15,22,19,31,28,45,42,38,52,61],
  },
  {
    id: 2, name: "NSAID Adverse Events", status: "active",
    keywords: ["ibuprofen", "diclofenac", "naproxen", "GI bleed", "stomach pain"],
    sources: [
      { type: "Reddit", subreddits: ["r/ChronicPain", "r/ibs"], latency: "Daily", status: "running" },
      { type: "Quora", queries: ["ibuprofen side effects", "NSAID risks"], latency: "Weekly", status: "paused" },
    ],
    signals: 3412, highRisk: 234, lastUpdated: "18 min ago",
    trendData: [45,52,48,63,71,68,82,79,91,88,102,95],
  },
  {
    id: 3, name: "Opioid Dependence Monitor", status: "paused",
    keywords: ["tramadol", "opioid", "addiction", "withdrawal", "dependence"],
    sources: [
      { type: "Reddit", subreddits: ["r/opiates", "r/suboxone"], latency: "Real-time", status: "paused" },
    ],
    signals: 892, highRisk: 156, lastUpdated: "3 hr ago",
    trendData: [8,12,15,11,18,22,19,25,30,27,35,40],
  },
];

/* ─── ANTHROPIC API ─── */
async function fetchAIHealthUpdates() {
  const prompt = `You are an AI-powered health intelligence engine. Generate 5 real-time health updates from aggregated social media, news, and public health data.

Guidelines:
- Keep each update concise (1–2 lines max)
- Use trend indicators like "rising", "spiking", "declining"
- Be specific and urgent

Output format — return ONLY these 5 lines, each starting with an emoji:
📈 for rising trends
⚠️ for warnings
🦠 for diseases/outbreaks
💊 for medicines/drugs

No explanations or extra text.`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:800, messages:[{ role:"user", content:prompt }] }),
  });
  const data = await res.json();
  const raw = (data.content || []).map(b => b.text || "").join("\n");
  const lines = raw.split("\n").map(l => l.trim()).filter(l => l.length > 4 && /^[📈⚠️🦠💊]/.test(l));
  if (!lines.length) throw new Error("No updates");
  const typeMap = { "📈":"Trend","⚠️":"Warning","🦠":"Outbreak","💊":"Drug" };
  return lines.map(line => {
    const emoji = [...line].find(c => "📈⚠️🦠💊".includes(c)) || "📈";
    return { emoji, type: typeMap[emoji] || "Update", text: line.replace(/^[📈⚠️🦠💊]\s*/, "").trim() };
  });
}

async function aiAnalyzeSignal(text) {
  const prompt = `You are AURA, a clinical NLP system. Analyze this health-related text and respond ONLY with valid JSON.

Text: "${text}"

Return exactly this JSON structure:
{
  "symptoms": ["symptom1", "symptom2"],
  "sentiment": "positive" | "neutral" | "negative",
  "risk_level": "LOW" | "MEDIUM" | "HIGH",
  "confidence": 70-99,
  "pii_detected": true | false,
  "entities": [{"text": "entity", "type": "DRUG" | "SYMPTOM" | "CONDITION" | "PERSON" | "LOCATION"}],
  "reason": ["reason1", "reason2", "reason3"]
}`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:1000, messages:[{ role:"user", content:prompt }] }),
  });
  const data = await res.json();
  const raw = (data.content || []).map(b => b.text || "").join("");
  const clean = raw.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}

function getMockAnalysis(text) {
  const t = text.toLowerCase();
  if (t.includes("severe") || t.includes("blurred") || t.includes("unbearable")) return MOCK_ANALYSIS.severe;
  if (t.includes("mild") || t.includes("sore throat") || t.includes("tylenol")) return MOCK_ANALYSIS.mild;
  return MOCK_ANALYSIS.dizzy;
}

/* ─── ATOMS ─── */
const CARD = { background:"#fff", borderRadius:"16px", border:"1px solid #e8eef4", boxShadow:"0 2px 12px rgba(15,23,42,0.06)", overflow:"hidden" };

function Badge({ label, color, bg, border }) {
  return <span style={{ background:bg, border:`1px solid ${border}`, color, borderRadius:"8px", padding:"3px 10px", fontSize:"11px", fontWeight:"600", fontFamily:"'JetBrains Mono', monospace", letterSpacing:"0.04em" }}>{label}</span>;
}
function StatCard({ label, value, sub, accent, delay="" }) {
  return (
    <div className={`card-enter ${delay}`} style={{ ...CARD, padding:"18px 20px", borderLeft:`3px solid ${accent}` }}>
      <div style={{ fontSize:"11px", color:"#94a3b8", fontWeight:"600", textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:"6px" }}>{label}</div>
      <div style={{ fontSize:"26px", fontWeight:"800", color:"#0f172a", fontFamily:"'JetBrains Mono', monospace", lineHeight:1 }}>{value}</div>
      <div style={{ fontSize:"12px", color:"#64748b", marginTop:"5px" }}>{sub}</div>
    </div>
  );
}
function Spinner({ size=18, color="#6366f1" }) {
  return <span style={{ display:"inline-block", width:size, height:size, border:`2px solid ${color}30`, borderTopColor:color, borderRadius:"50%", animation:"spin 0.75s linear infinite" }} />;
}
function ShimmerBlock({ h=14, w="100%", mb=10 }) {
  return <div className="shimmer-row" style={{ height:h, width:w, marginBottom:mb }} />;
}
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:"#fff", border:"1px solid #e2e8f0", borderRadius:"10px", padding:"10px 14px", boxShadow:"0 8px 24px rgba(15,23,42,0.12)" }}>
      <div style={{ fontSize:"11px", color:"#94a3b8", marginBottom:"5px", fontWeight:"600" }}>{label}</div>
      {payload.map((p, i) => <div key={i} style={{ fontSize:"13px", color:p.color, fontFamily:"'JetBrains Mono', monospace", fontWeight:"500" }}>{p.name}: {p.value}</div>)}
    </div>
  );
};

/* ─── LIVE TICKER ─── */
function LiveTicker({ updates }) {
  if (!updates.length) return null;
  const text = updates.map(u => `${u.emoji} ${u.text}`).join("    ·    ");
  return (
    <div style={{ background:"#0f172a", borderBottom:"1px solid rgba(99,102,241,0.3)", height:"32px", overflow:"hidden", display:"flex", alignItems:"center", position:"relative" }}>
      <div style={{ position:"absolute", left:0, top:0, bottom:0, width:"80px", background:"linear-gradient(to right, #0f172a, transparent)", zIndex:2 }} />
      <div style={{ position:"absolute", right:0, top:0, bottom:0, width:"80px", background:"linear-gradient(to left, #0f172a, transparent)", zIndex:2 }} />
      <div style={{ display:"flex", alignItems:"center", gap:"6px", position:"absolute", left:"14px", zIndex:3 }}>
        <span style={{ fontSize:"9px", fontWeight:"700", color:"#f59e0b", background:"rgba(245,158,11,0.15)", border:"1px solid rgba(245,158,11,0.4)", borderRadius:"4px", padding:"1px 6px", letterSpacing:"0.08em", fontFamily:"'JetBrains Mono', monospace", animation:"blink 1.5s infinite" }}>LIVE</span>
      </div>
      <div style={{ whiteSpace:"nowrap", animation:"tickerScroll 38s linear infinite", fontSize:"12px", color:"#94a3b8", paddingLeft:"120px" }}>{text}</div>
    </div>
  );
}

/* ─── NAVBAR ─── */
function Navbar({ page, setPage, user, onLogout, updates }) {
  const [dropdown, setDropdown] = useState(false);
  const NAV = ["Dashboard","Medicines","Social Monitor","Analysis","Analytics","Updates"];

  return (
    <>
      <LiveTicker updates={updates} />
      <nav style={{ background:"#fff", borderBottom:"1px solid #e8eef4", padding:"0 28px", display:"flex", alignItems:"center", height:"56px", position:"sticky", top:0, zIndex:100, boxShadow:"0 1px 8px rgba(15,23,42,0.06)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"8px", marginRight:"32px" }}>
          <div style={{ width:"32px", height:"32px", borderRadius:"9px", background:"linear-gradient(135deg,#4f46e5,#7c3aed)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"16px", color:"#fff", fontWeight:"800" }}>A</div>
          <div>
            <div style={{ fontSize:"16px", fontWeight:"800", background:"linear-gradient(135deg,#4f46e5,#7c3aed)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>AURA</div>
            <div style={{ fontSize:"9px", color:"#94a3b8", fontWeight:"600", letterSpacing:"0.08em", marginTop:"-2px" }}>MEDICAL ASSISTANT</div>
          </div>
        </div>
        <div style={{ display:"flex", gap:"4px", flex:1 }}>
          {NAV.map(n => (
            <button key={n} className="nav-item" onClick={() => setPage(n)} style={{ padding:"6px 12px", borderRadius:"8px", border:"none", background:page===n?"#eef2ff":"transparent", color:page===n?"#4f46e5":"#64748b", fontSize:"13px", fontWeight:page===n?"700":"500", cursor:"pointer", fontFamily:"'Plus Jakarta Sans',sans-serif", transition:"all 0.15s" }}>{n}</button>
          ))}
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
          <button style={{ padding:"7px 16px", borderRadius:"10px", border:"none", background:"linear-gradient(135deg,#4f46e5,#7c3aed)", color:"#fff", fontSize:"13px", fontWeight:"700", cursor:"pointer", fontFamily:"'Plus Jakarta Sans',sans-serif" }}>● Search</button>
          <div style={{ position:"relative" }}>
            <button onClick={() => setDropdown(d => !d)} style={{ display:"flex", alignItems:"center", gap:"8px", padding:"6px 10px", borderRadius:"10px", border:"1px solid #e2e8f0", background:"#f8fafc", cursor:"pointer" }}>
              <div style={{ width:"28px", height:"28px", borderRadius:"50%", background:"linear-gradient(135deg,#4f46e5,#7c3aed)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"12px", color:"#fff", fontWeight:"700" }}>{user?.name?.split(" ").map(w=>w[0]).join("").slice(0,2)}</div>
              <div style={{ textAlign:"left" }}>
                <div style={{ fontSize:"12px", fontWeight:"700", color:"#0f172a" }}>{user?.name?.split(" ")[0]}</div>
                <div style={{ fontSize:"10px", color:"#94a3b8" }}>{user?.role}</div>
              </div>
            </button>
            {dropdown && (
              <div style={{ position:"absolute", right:0, top:"100%", marginTop:"6px", background:"#fff", border:"1px solid #e2e8f0", borderRadius:"12px", boxShadow:"0 12px 32px rgba(15,23,42,0.14)", minWidth:"180px", overflow:"hidden", zIndex:200 }}>
                {[["👤","Profile"],["⚙️","Settings"],["🚪","Logout"]].map(([ic, lbl]) => (
                  <button key={lbl} onClick={() => { setDropdown(false); lbl==="Logout" ? onLogout() : setPage(lbl); }} style={{ display:"flex", alignItems:"center", gap:"10px", width:"100%", padding:"12px 16px", border:"none", background:"none", cursor:"pointer", fontSize:"13.5px", color:"#0f172a", fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:"500", textAlign:"left" }}
                    onMouseEnter={e=>e.currentTarget.style.background="#f8fafc"} onMouseLeave={e=>e.currentTarget.style.background="none"}>
                    {ic} {lbl}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}

/* ─── AUTH PAGE ─── */
function AuthPage({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("doctor@aura.com");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = async () => {
    if (!email || !password || (mode==="signup" && !name)) { setError("Please fill all fields."); return; }
    setLoading(true); setError("");
    await new Promise(r => setTimeout(r, 900));
    if (mode==="login") {
      const found = CREDENTIALS.find(c => c.email===email && c.password===password);
      if (found) onLogin(found); else { setError("Invalid credentials."); setLoading(false); }
    } else {
      onLogin({ email, name, role:"Physician", password });
    }
  };

  const inputStyle = { width:"100%", padding:"11px 14px", border:"1.5px solid #e2e8f0", borderRadius:"10px", fontSize:"13.5px", color:"#1e293b", background:"#fafafa", outline:"none", fontFamily:"'Plus Jakarta Sans',sans-serif", boxSizing:"border-box" };

  return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"linear-gradient(135deg, #eef2ff 0%, #f0fdf4 50%, #fff7ed 100%)" }}>
      <div style={{ ...CARD, width:"100%", maxWidth:"400px", padding:"36px 32px" }}>
        <div style={{ textAlign:"center", marginBottom:"28px" }}>
          <div style={{ width:"52px", height:"52px", borderRadius:"14px", background:"linear-gradient(135deg,#4f46e5,#7c3aed)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"24px", color:"#fff", fontWeight:"800", margin:"0 auto 12px" }}>A</div>
          <div style={{ fontSize:"22px", fontWeight:"800", color:"#0f172a" }}>AURA Platform</div>
          <div style={{ fontSize:"13px", color:"#64748b", marginTop:"4px" }}>{mode==="login" ? "Sign in to your account" : "Create a new account"}</div>
        </div>
        {error && <div style={{ background:"#fef2f2", border:"1px solid #fecaca", borderRadius:"8px", padding:"10px 14px", fontSize:"13px", color:"#dc2626", marginBottom:"16px" }}>{error}</div>}
        {mode==="signup" && (
          <div style={{ marginBottom:"12px" }}>
            <div style={{ fontSize:"11px", color:"#94a3b8", fontWeight:"600", marginBottom:"5px", textTransform:"uppercase", letterSpacing:"0.06em" }}>Full Name</div>
            <input value={name} onChange={e=>setName(e.target.value)} placeholder="Dr. Jane Smith" style={inputStyle} onFocus={e=>e.target.style.borderColor="#6366f1"} onBlur={e=>e.target.style.borderColor="#e2e8f0"} />
          </div>
        )}
        <div style={{ marginBottom:"12px" }}>
          <div style={{ fontSize:"11px", color:"#94a3b8", fontWeight:"600", marginBottom:"5px", textTransform:"uppercase", letterSpacing:"0.06em" }}>Email</div>
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="doctor@aura.com" style={inputStyle} onFocus={e=>e.target.style.borderColor="#6366f1"} onBlur={e=>e.target.style.borderColor="#e2e8f0"} />
        </div>
        <div style={{ marginBottom:"20px" }}>
          <div style={{ fontSize:"11px", color:"#94a3b8", fontWeight:"600", marginBottom:"5px", textTransform:"uppercase", letterSpacing:"0.06em" }}>Password</div>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" style={inputStyle} onFocus={e=>e.target.style.borderColor="#6366f1"} onBlur={e=>e.target.style.borderColor="#e2e8f0"} onKeyDown={e=>e.key==="Enter"&&handle()} />
        </div>
        <button onClick={handle} disabled={loading} style={{ width:"100%", padding:"13px", borderRadius:"11px", border:"none", background:"linear-gradient(135deg,#4f46e5,#7c3aed)", color:"#fff", fontSize:"14px", fontWeight:"700", cursor:"pointer", fontFamily:"'Plus Jakarta Sans',sans-serif", display:"flex", alignItems:"center", justifyContent:"center", gap:"8px" }}>
          {loading ? <><Spinner size={16} color="#fff" /> Processing…</> : (mode==="login" ? "Sign In" : "Create Account")}
        </button>
        <div style={{ textAlign:"center", marginTop:"16px", fontSize:"13px", color:"#64748b" }}>
          {mode==="login" ? <>No account? <button onClick={()=>{setMode("signup");setError("");}} style={{ color:"#6366f1", background:"none", border:"none", cursor:"pointer", fontWeight:"600", fontSize:"13px" }}>Create one</button></> : <>Have an account? <button onClick={()=>{setMode("login");setError("");}} style={{ color:"#6366f1", background:"none", border:"none", cursor:"pointer", fontWeight:"600", fontSize:"13px" }}>Sign in</button></>}
        </div>
        {mode==="login" && <div style={{ textAlign:"center", marginTop:"10px", fontSize:"11px", color:"#94a3b8" }}>Demo: doctor@aura.com / password123</div>}
      </div>
    </div>
  );
}

/* ─── MEDICINE CARD ─── */
function MedicineCard({ med, onClick }) {
  const cfg = RISK_CFG[med.risk];
  const catColors = { "Pain & Inflammation":"#f59e0b","Cardiovascular":"#ef4444","Antibiotics":"#10b981","Diabetes":"#06b6d4","Respiratory":"#3b82f6","Mental Health":"#8b5cf6","Gastrointestinal":"#f97316","Anticoagulants":"#dc2626","Hormonal":"#ec4899","Oncology":"#6366f1","Neurological":"#14b8a6","Immunosuppressants":"#84cc16" };
  const catColor = catColors[med.category] || "#6366f1";

  return (
    <div className="med-card" onClick={()=>onClick(med)} style={{ ...CARD, cursor:"pointer", borderTop:`3px solid ${cfg.color}` }}>
      <div style={{ padding:"16px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"10px" }}>
          <div style={{ width:"42px", height:"42px", borderRadius:"11px", background:`${cfg.color}18`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"20px" }}>💊</div>
          <button onClick={e=>{e.stopPropagation();}} style={{ background:"none", border:"none", cursor:"pointer", color:"#cbd5e1", fontSize:"16px" }}>♡</button>
        </div>
        <div style={{ fontSize:"15px", fontWeight:"700", color:"#0f172a", marginBottom:"2px" }}>{med.name}</div>
        <div style={{ fontSize:"11px", color:"#94a3b8", marginBottom:"10px" }}>{med.genericName}</div>
        <div style={{ display:"flex", gap:"6px", flexWrap:"wrap", marginBottom:"10px" }}>
          <span style={{ padding:"3px 8px", borderRadius:"6px", fontSize:"11px", fontWeight:"600", background:cfg.bg, color:cfg.text, border:`1px solid ${cfg.border}` }}>{cfg.icon} {cfg.label}</span>
          <span style={{ padding:"3px 8px", borderRadius:"6px", fontSize:"11px", fontWeight:"600", background:`${catColor}15`, color:catColor, border:`1px solid ${catColor}30` }}>{med.category.split(" ")[0]}</span>
        </div>
        <div style={{ fontSize:"11.5px", color:"#64748b", lineHeight:1.5, marginBottom:"10px" }}>
          <span style={{ fontWeight:"600", color:"#475569" }}>For: </span>
          {med.symptoms.slice(0,2).join(", ")}{med.symptoms.length>2 ? ` +${med.symptoms.length-2}` : ""}
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", borderTop:"1px solid #f1f5f9", paddingTop:"10px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"4px" }}>
            <span style={{ color:"#f59e0b", fontSize:"12px" }}>{"★".repeat(Math.floor(med.rating))}{"☆".repeat(5-Math.floor(med.rating))}</span>
            <span style={{ fontSize:"11px", color:"#64748b", fontFamily:"'JetBrains Mono',monospace" }}>{med.rating}</span>
          </div>
          <div style={{ fontSize:"11px", color:"#94a3b8", fontFamily:"'JetBrains Mono',monospace" }}>{med.reviews.toLocaleString()} reviews</div>
        </div>
      </div>
    </div>
  );
}

/* ─── MEDICINE DETAIL MODAL ─── */
function MedicineModal({ med, onClose }) {
  if (!med) return null;
  const cfg = RISK_CFG[med.risk];
  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(15,23,42,0.5)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:500, padding:"24px" }}>
      <div onClick={e=>e.stopPropagation()} style={{ ...CARD, width:"100%", maxWidth:"560px", maxHeight:"85vh", overflowY:"auto" }}>
        <div style={{ padding:"20px 24px", borderBottom:"1px solid #f1f5f9", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <div style={{ fontSize:"18px", fontWeight:"800", color:"#0f172a" }}>{med.name}</div>
            <div style={{ fontSize:"12px", color:"#94a3b8" }}>{med.genericName} · {med.manufacturer} · Approved {med.approved}</div>
          </div>
          <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", fontSize:"20px", color:"#94a3b8" }}>✕</button>
        </div>
        <div style={{ padding:"20px 24px", display:"flex", flexDirection:"column", gap:"16px" }}>
          <div style={{ padding:"14px 16px", borderRadius:"10px", background:cfg.bg, border:`1px solid ${cfg.border}`, display:"flex", gap:"12px", alignItems:"center" }}>
            <div style={{ width:"36px", height:"36px", borderRadius:"9px", background:cfg.color, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:"16px" }}>{cfg.icon}</div>
            <div>
              <div style={{ fontSize:"11px", color:cfg.text, fontWeight:"700", textTransform:"uppercase", letterSpacing:"0.08em" }}>Risk Assessment</div>
              <div style={{ fontSize:"16px", fontWeight:"800", color:cfg.text }}>{med.risk} RISK · {med.suitability}% Suitability</div>
            </div>
          </div>
          <div>
            <div style={{ fontSize:"11px", fontWeight:"700", color:"#94a3b8", textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:"6px" }}>Description</div>
            <p style={{ fontSize:"13.5px", color:"#475569", lineHeight:1.6 }}>{med.description}</p>
          </div>
          <div>
            <div style={{ fontSize:"11px", fontWeight:"700", color:"#94a3b8", textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:"6px" }}>Dosage</div>
            <div style={{ fontSize:"13.5px", color:"#0f172a", fontWeight:"600", fontFamily:"'JetBrains Mono',monospace" }}>{med.dosage}</div>
          </div>
          <div>
            <div style={{ fontSize:"11px", fontWeight:"700", color:"#94a3b8", textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:"8px" }}>Symptoms Treated</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:"6px" }}>{med.symptoms.map((s,i) => <Badge key={i} label={s} color="#0369a1" bg="#f0f9ff" border="#bae6fd" />)}</div>
          </div>
          <div>
            <div style={{ fontSize:"11px", fontWeight:"700", color:"#94a3b8", textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:"8px" }}>Side Effects</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:"6px" }}>{med.effects.map((e,i) => <Badge key={i} label={e} color="#d97706" bg="#fffbeb" border="#fde68a" />)}</div>
          </div>
          <div>
            <div style={{ fontSize:"11px", fontWeight:"700", color:"#94a3b8", textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:"8px" }}>Contraindications</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:"6px" }}>{med.contraindications.map((c,i) => <Badge key={i} label={c} color="#dc2626" bg="#fef2f2" border="#fecaca" />)}</div>
          </div>
          <div>
            <div style={{ fontSize:"11px", fontWeight:"700", color:"#94a3b8", textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:"8px" }}>Drug Interactions</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:"6px" }}>{med.interactions.map((i2,i) => <Badge key={i} label={i2} color="#7c3aed" bg="#f5f3ff" border="#ddd6fe" />)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── MEDICINES PAGE ─── */
function MedicinesPage() {
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState("All");
  const [catFilter, setCatFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [selectedMed, setSelectedMed] = useState(null);
  const [savedMeds, setSavedMeds] = useState([]);
  const PER_PAGE = 12;

  const uniqueCats = ["All", ...MEDICINE_CATEGORIES.filter(c => MEDICINES_DB.some(m => m.category === c))];
  const risks = ["All", "LOW", "MEDIUM", "HIGH"];

  const filtered = MEDICINES_DB.filter(m =>
    (riskFilter === "All" || m.risk === riskFilter) &&
    (catFilter === "All" || m.category === catFilter) &&
    (search === "" || m.name.toLowerCase().includes(search.toLowerCase()) || m.symptoms.some(s => s.includes(search.toLowerCase())))
  );
  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const riskBtnColor = (r) => r === riskFilter ? { background: r==="All"?"#4f46e5":RISK_CFG[r]?.color||"#4f46e5", color:"#fff", border:"none" } : {};

  return (
    <div style={{ display:"flex", gap:"20px", height:"calc(100vh - 120px)" }}>
      {/* Sidebar */}
      <div style={{ width:"220px", flexShrink:0, display:"flex", flexDirection:"column", gap:"16px", overflowY:"auto" }}>
        <div style={{ ...CARD, padding:"16px" }}>
          <div style={{ fontSize:"12px", fontWeight:"700", color:"#94a3b8", textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:"10px" }}>Search</div>
          <input value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}} placeholder="Search medicines, symptoms…" style={{ width:"100%", padding:"8px 12px", border:"1.5px solid #e2e8f0", borderRadius:"9px", fontSize:"12px", fontFamily:"'Plus Jakarta Sans',sans-serif", color:"#1e293b", background:"#f9fafb", outline:"none", boxSizing:"border-box" }} onFocus={e=>e.target.style.borderColor="#6366f1"} onBlur={e=>e.target.style.borderColor="#e2e8f0"} />
        </div>

        <div style={{ ...CARD, padding:"16px" }}>
          <div style={{ fontSize:"12px", fontWeight:"700", color:"#94a3b8", textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:"10px" }}>Filters</div>
          <div style={{ fontSize:"11px", fontWeight:"600", color:"#64748b", marginBottom:"6px" }}>RISK LEVEL</div>
          {risks.map(r => (
            <button key={r} className="filter-btn" onClick={()=>{setRiskFilter(r);setPage(1);}} style={{ display:"flex", alignItems:"center", gap:"8px", width:"100%", padding:"7px 8px", borderRadius:"7px", border:"1px solid transparent", background:"transparent", cursor:"pointer", fontSize:"12.5px", fontFamily:"'Plus Jakarta Sans',sans-serif", marginBottom:"4px", transition:"all 0.15s", color:riskFilter===r?"#fff":"#64748b", ...riskBtnColor(r) }}>
              <span style={{ width:"8px", height:"8px", borderRadius:"50%", background:r==="All"?"#6366f1":RISK_CFG[r]?.color||"#6366f1", display:"inline-block", flexShrink:0 }} />
              {r==="All"?"All Risks":r==="LOW"?"✓ Safe":r==="MEDIUM"?"◉ Caution":"⚠ High Risk"}
            </button>
          ))}
        </div>

        <div style={{ ...CARD, padding:"16px" }}>
          <div style={{ fontSize:"12px", fontWeight:"700", color:"#94a3b8", textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:"10px" }}>Database</div>
          {[["Total Medicines", MEDICINES_DB.length.toString(), "#6366f1"],["Safe to Use", LOW_COUNT.toString(), "#22c55e"],["Categories", uniqueCats.length-1+"", "#f59e0b"],["Reviews", TOTAL_REVIEWS.toLocaleString(), "#8b5cf6"]].map(([l,v,c]) => (
            <div key={l} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"7px 0", borderBottom:"1px solid #f8fafc" }}>
              <span style={{ fontSize:"12px", color:"#64748b" }}>{l}</span>
              <span style={{ fontSize:"13px", fontWeight:"700", color:c, fontFamily:"'JetBrains Mono',monospace" }}>{v}</span>
            </div>
          ))}
        </div>

        <div style={{ ...CARD, padding:"16px" }}>
          <div style={{ fontSize:"12px", fontWeight:"700", color:"#94a3b8", textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:"10px" }}>Top Symptoms</div>
          {[["pneumonia",6],["UTI",6],["skin infection",6],["headache",5],["ear infection",5],["heart failure",5],["arthritis",4],["diarrhea",4]].map(([sym, cnt]) => (
            <div key={sym} onClick={()=>{setSearch(sym);setPage(1);}} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"6px 4px", borderBottom:"1px solid #f8fafc", cursor:"pointer" }} onMouseEnter={e=>e.currentTarget.style.background="#f8fafc"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              <span style={{ fontSize:"12px", color:"#475569" }}>{sym}</span>
              <span style={{ fontSize:"11px", fontWeight:"700", color:"#6366f1", background:"#eef2ff", borderRadius:"12px", padding:"1px 8px" }}>{cnt}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main grid */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", gap:"16px", overflowY:"auto" }}>
        {/* Category chips + header */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <div style={{ fontSize:"14px", fontWeight:"700", color:"#0f172a" }}>{filtered.length} medicines found</div>
            <div style={{ fontSize:"11px", color:"#94a3b8" }}>Page {page}/{Math.max(1,totalPages)}</div>
          </div>
          <div style={{ display:"flex", gap:"8px", alignItems:"center" }}>
            <button style={{ padding:"7px 14px", borderRadius:"8px", border:"1px solid #e2e8f0", background:"#fff", fontSize:"12px", fontWeight:"600", color:"#475569", cursor:"pointer", fontFamily:"'Plus Jakarta Sans',sans-serif" }}>↕ Export</button>
          </div>
        </div>

        {/* Category filter scrollable */}
        <div style={{ display:"flex", gap:"6px", overflowX:"auto", paddingBottom:"4px" }}>
          {uniqueCats.map(c => (
            <button key={c} onClick={()=>{setCatFilter(c);setPage(1);}} style={{ padding:"5px 12px", borderRadius:"20px", border:"1.5px solid", borderColor:catFilter===c?"#4f46e5":"#e2e8f0", background:catFilter===c?"#eef2ff":"#fff", color:catFilter===c?"#4f46e5":"#64748b", fontSize:"11.5px", fontWeight:"600", cursor:"pointer", whiteSpace:"nowrap", fontFamily:"'Plus Jakarta Sans',sans-serif", transition:"all 0.15s" }}>{c}</button>
          ))}
        </div>

        {/* Medicine cards grid */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:"14px" }}>
          {paged.map((m, i) => <MedicineCard key={m.id} med={m} onClick={setSelectedMed} />)}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display:"flex", justifyContent:"center", gap:"8px", marginTop:"8px" }}>
            <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1} style={{ padding:"7px 16px", borderRadius:"8px", border:"1px solid #e2e8f0", background:"#fff", fontSize:"13px", cursor:page===1?"not-allowed":"pointer", color:page===1?"#cbd5e1":"#475569", fontFamily:"'Plus Jakarta Sans',sans-serif" }}>← Prev</button>
            {Array.from({length:Math.min(5,totalPages)},(_,i2)=>{
              let pg = page <= 3 ? i2+1 : page+i2-2;
              if (pg < 1 || pg > totalPages) return null;
              return <button key={pg} onClick={()=>setPage(pg)} style={{ padding:"7px 13px", borderRadius:"8px", border:"1px solid", borderColor:pg===page?"#4f46e5":"#e2e8f0", background:pg===page?"#eef2ff":"#fff", color:pg===page?"#4f46e5":"#475569", fontSize:"13px", fontWeight:pg===page?"700":"400", cursor:"pointer", fontFamily:"'Plus Jakarta Sans',sans-serif" }}>{pg}</button>;
            })}
            <button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages} style={{ padding:"7px 16px", borderRadius:"8px", border:"1px solid #e2e8f0", background:"#fff", fontSize:"13px", cursor:page===totalPages?"not-allowed":"pointer", color:page===totalPages?"#cbd5e1":"#475569", fontFamily:"'Plus Jakarta Sans',sans-serif" }}>Next →</button>
          </div>
        )}
      </div>

      {/* Right panel — Risk Overview & Categories */}
      <div style={{ width:"200px", flexShrink:0, display:"flex", flexDirection:"column", gap:"16px" }}>
        <div style={{ ...CARD, padding:"16px" }}>
          <div style={{ fontSize:"12px", fontWeight:"700", color:"#94a3b8", textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:"12px" }}>Risk Overview</div>
          <div style={{ display:"flex", justifyContent:"center", marginBottom:"12px" }}>
            <PieChart width={120} height={120}>
              <Pie data={RISK_PIE_DATA} cx={60} cy={60} innerRadius={35} outerRadius={54} paddingAngle={3} dataKey="value">
                {RISK_PIE_DATA.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
            </PieChart>
          </div>
          {RISK_PIE_DATA.map(d => (
            <div key={d.name} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"4px 0" }}>
              <div style={{ display:"flex", alignItems:"center", gap:"6px" }}>
                <div style={{ width:"8px", height:"8px", borderRadius:"2px", background:d.color, flexShrink:0 }} />
                <span style={{ fontSize:"12px", color:"#64748b" }}>{d.name}</span>
              </div>
              <span style={{ fontSize:"12px", fontWeight:"700", color:"#0f172a", fontFamily:"'JetBrains Mono',monospace" }}>{d.value}</span>
            </div>
          ))}
        </div>

        <div style={{ ...CARD, padding:"16px" }}>
          <div style={{ fontSize:"12px", fontWeight:"700", color:"#94a3b8", textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:"10px" }}>Categories</div>
          {CATEGORY_DATA.map(c => (
            <div key={c.name} onClick={()=>{setCatFilter(c.fullName);setPage(1);}} style={{ padding:"6px 4px", borderBottom:"1px solid #f8fafc", cursor:"pointer", fontSize:"12px", color:catFilter===c.fullName?"#4f46e5":"#475569", fontWeight:catFilter===c.fullName?"700":"400" }}
              onMouseEnter={e=>e.currentTarget.style.color="#4f46e5"} onMouseLeave={e=>e.currentTarget.style.color=catFilter===c.fullName?"#4f46e5":"#475569"}>
              {c.fullName}
            </div>
          ))}
        </div>
      </div>

      {selectedMed && <MedicineModal med={selectedMed} onClose={()=>setSelectedMed(null)} />}
    </div>
  );
}

/* ─── SOCIAL MONITOR PAGE ─── */
function SocialMonitorPage() {
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [view, setView] = useState("list"); // list | create | detail
  const [selected, setSelected] = useState(null);
  const [newProj, setNewProj] = useState({ name:"", keywords:"", sources:[] });
  const [kwInput, setKwInput] = useState("");

  const SOURCE_TYPES = ["Reddit","Twitter/X","Quora","Forums","News API"];
  const LATENCY_OPTS = ["Real-time","Daily","Weekly"];

  const toggleSource = (src) => setNewProj(p => ({ ...p, sources: p.sources.includes(src) ? p.sources.filter(s=>s!==src) : [...p.sources, src] }));

  const createProject = () => {
    const proj = {
      id: Date.now(), name: newProj.name, status:"active",
      keywords: kwInput.split(",").map(k=>k.trim()).filter(Boolean),
      sources: newProj.sources.map(s => ({ type:s, latency:"Daily", status:"running" })),
      signals: 0, highRisk: 0, lastUpdated: "just now",
      trendData: Array.from({length:12}, ()=>Math.floor(Math.random()*30)),
    };
    setProjects(p => [proj, ...p]);
    setView("list"); setNewProj({ name:"", keywords:"", sources:[] }); setKwInput("");
  };

  if (view === "create") return (
    <div style={{ maxWidth:"700px", margin:"0 auto", display:"flex", flexDirection:"column", gap:"20px" }}>
      <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
        <button onClick={()=>setView("list")} style={{ padding:"7px 14px", borderRadius:"8px", border:"1px solid #e2e8f0", background:"#fff", fontSize:"13px", cursor:"pointer", fontFamily:"'Plus Jakarta Sans',sans-serif" }}>← Back</button>
        <div>
          <div style={{ fontSize:"18px", fontWeight:"800", color:"#0f172a" }}>Create Monitoring Project</div>
          <div style={{ fontSize:"12px", color:"#94a3b8" }}>Configure keywords and data sources to monitor</div>
        </div>
      </div>
      <div style={CARD}>
        <div style={{ padding:"20px 24px", borderBottom:"1px solid #f1f5f9", fontSize:"14px", fontWeight:"700", color:"#0f172a" }}>📋 Project Details</div>
        <div style={{ padding:"20px 24px", display:"flex", flexDirection:"column", gap:"16px" }}>
          <div>
            <div style={{ fontSize:"11px", color:"#94a3b8", fontWeight:"600", marginBottom:"6px", textTransform:"uppercase" }}>Project Name</div>
            <input value={newProj.name} onChange={e=>setNewProj(p=>({...p,name:e.target.value}))} placeholder="e.g., Warfarin Adverse Events Monitor" style={{ width:"100%", padding:"10px 14px", border:"1.5px solid #e2e8f0", borderRadius:"9px", fontSize:"13.5px", color:"#1e293b", background:"#fafafa", outline:"none", fontFamily:"'Plus Jakarta Sans',sans-serif", boxSizing:"border-box" }} />
          </div>
          <div>
            <div style={{ fontSize:"11px", color:"#94a3b8", fontWeight:"600", marginBottom:"6px", textTransform:"uppercase" }}>Keywords to Monitor (comma-separated)</div>
            <textarea value={kwInput} onChange={e=>setKwInput(e.target.value)} placeholder="warfarin, bleeding, INR, blood thinner, Coumadin" rows={3} style={{ width:"100%", padding:"10px 14px", border:"1.5px solid #e2e8f0", borderRadius:"9px", fontSize:"13.5px", color:"#1e293b", background:"#fafafa", outline:"none", fontFamily:"'Plus Jakarta Sans',sans-serif", boxSizing:"border-box", resize:"none" }} />
            <div style={{ display:"flex", flexWrap:"wrap", gap:"6px", marginTop:"8px" }}>
              {kwInput.split(",").map(k=>k.trim()).filter(Boolean).map((k,i) => <Badge key={i} label={k} color="#4f46e5" bg="#eef2ff" border="#c7d2fe" />)}
            </div>
          </div>
        </div>
      </div>
      <div style={CARD}>
        <div style={{ padding:"20px 24px", borderBottom:"1px solid #f1f5f9", fontSize:"14px", fontWeight:"700", color:"#0f172a" }}>🌐 Data Sources</div>
        <div style={{ padding:"20px 24px" }}>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"10px" }}>
            {SOURCE_TYPES.map(src => {
              const icons = { "Reddit":"🔴","Twitter/X":"🐦","Quora":"❓","Forums":"💬","News API":"📰" };
              const active = newProj.sources.includes(src);
              return (
                <button key={src} onClick={()=>toggleSource(src)} style={{ padding:"14px 10px", borderRadius:"10px", border:`2px solid ${active?"#4f46e5":"#e2e8f0"}`, background:active?"#eef2ff":"#f9fafb", cursor:"pointer", fontFamily:"'Plus Jakarta Sans',sans-serif", textAlign:"center", transition:"all 0.15s" }}>
                  <div style={{ fontSize:"22px", marginBottom:"4px" }}>{icons[src]}</div>
                  <div style={{ fontSize:"12px", fontWeight:active?"700":"500", color:active?"#4f46e5":"#64748b" }}>{src}</div>
                  {active && <div style={{ fontSize:"10px", color:"#10b981", marginTop:"3px" }}>✓ Selected</div>}
                </button>
              );
            })}
          </div>
          {newProj.sources.length > 0 && (
            <div style={{ marginTop:"16px" }}>
              <div style={{ fontSize:"11px", color:"#94a3b8", fontWeight:"600", marginBottom:"8px", textTransform:"uppercase" }}>Latency Configuration</div>
              {newProj.sources.map(src => (
                <div key={src} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 14px", background:"#f8fafc", borderRadius:"8px", marginBottom:"6px" }}>
                  <span style={{ fontSize:"13px", color:"#0f172a", fontWeight:"600" }}>{src}</span>
                  <div style={{ display:"flex", gap:"6px" }}>
                    {LATENCY_OPTS.map(l => <button key={l} style={{ padding:"4px 10px", borderRadius:"6px", border:"1px solid #e2e8f0", background:"#fff", fontSize:"11px", cursor:"pointer", fontFamily:"'Plus Jakarta Sans',sans-serif", color:"#475569" }}>{l}</button>)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <button onClick={createProject} disabled={!newProj.name || newProj.sources.length===0} style={{ padding:"14px", borderRadius:"11px", border:"none", background:newProj.name&&newProj.sources.length?"linear-gradient(135deg,#4f46e5,#7c3aed)":"#e2e8f0", color:newProj.name&&newProj.sources.length?"#fff":"#94a3b8", fontSize:"14px", fontWeight:"700", cursor:newProj.name&&newProj.sources.length?"pointer":"not-allowed", fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
        🚀 Launch Monitoring Project
      </button>
    </div>
  );

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"20px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div>
          <div style={{ fontSize:"20px", fontWeight:"800", color:"#0f172a" }}>Social Monitoring Projects</div>
          <div style={{ fontSize:"12px", color:"#94a3b8", marginTop:"2px" }}>Configure and monitor social signals for drugs, symptoms, and conditions</div>
        </div>
        <button onClick={()=>setView("create")} style={{ padding:"10px 20px", borderRadius:"10px", border:"none", background:"linear-gradient(135deg,#4f46e5,#7c3aed)", color:"#fff", fontSize:"13px", fontWeight:"700", cursor:"pointer", fontFamily:"'Plus Jakarta Sans',sans-serif" }}>+ New Project</button>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"14px" }}>
        <StatCard label="Active Projects" value={projects.filter(p=>p.status==="active").length.toString()} sub="Currently monitoring" accent="#6366f1" delay="card-enter-1" />
        <StatCard label="Total Signals" value={projects.reduce((s,p)=>s+p.signals,0).toLocaleString()} sub="Collected across all projects" accent="#22c55e" delay="card-enter-2" />
        <StatCard label="High Risk Signals" value={projects.reduce((s,p)=>s+p.highRisk,0).toLocaleString()} sub="Requiring review" accent="#ef4444" delay="card-enter-3" />
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:"14px" }}>
        {projects.map(proj => (
          <div key={proj.id} style={{ ...CARD, cursor:"pointer" }} className="card-enter" onClick={()=>{setSelected(proj);}} onMouseEnter={e=>{e.currentTarget.style.boxShadow="0 6px 24px rgba(15,23,42,0.12)";}} onMouseLeave={e=>{e.currentTarget.style.boxShadow="0 2px 12px rgba(15,23,42,0.06)";}}>
            <div style={{ padding:"16px 22px", display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"8px" }}>
                  <div style={{ fontSize:"16px", fontWeight:"700", color:"#0f172a" }}>{proj.name}</div>
                  <span style={{ padding:"3px 10px", borderRadius:"20px", fontSize:"11px", fontWeight:"600", background:proj.status==="active"?"#f0fdf4":"#f8fafc", color:proj.status==="active"?"#16a34a":"#94a3b8", border:`1px solid ${proj.status==="active"?"#bbf7d0":"#e2e8f0"}` }}>
                    {proj.status==="active" ? "● Active" : "◉ Paused"}
                  </span>
                </div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:"6px", marginBottom:"10px" }}>
                  {proj.keywords.slice(0,5).map((k,i) => <Badge key={i} label={k} color="#4f46e5" bg="#eef2ff" border="#c7d2fe" />)}
                  {proj.keywords.length>5 && <Badge label={`+${proj.keywords.length-5}`} color="#64748b" bg="#f8fafc" border="#e2e8f0" />}
                </div>
                <div style={{ display:"flex", gap:"16px" }}>
                  {proj.sources.map((s,i) => (
                    <div key={i} style={{ display:"flex", alignItems:"center", gap:"5px" }}>
                      <span style={{ width:"6px", height:"6px", borderRadius:"50%", background:s.status==="running"?"#22c55e":"#f59e0b", display:"inline-block" }} />
                      <span style={{ fontSize:"11.5px", color:"#64748b" }}>{s.type} · {s.latency}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ textAlign:"right", display:"flex", flexDirection:"column", gap:"6px" }}>
                <div style={{ fontSize:"24px", fontWeight:"800", color:"#0f172a", fontFamily:"'JetBrains Mono',monospace" }}>{proj.signals.toLocaleString()}</div>
                <div style={{ fontSize:"11px", color:"#94a3b8" }}>signals collected</div>
                <Badge label={`⚠ ${proj.highRisk} High Risk`} color="#dc2626" bg="#fef2f2" border="#fecaca" />
                <div style={{ fontSize:"11px", color:"#94a3b8" }}>Updated {proj.lastUpdated}</div>
              </div>
              <div style={{ width:"120px", height:"48px", marginLeft:"16px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={proj.trendData.map((v,i)=>({i,v}))}>
                    <Line type="monotone" dataKey="v" stroke={proj.status==="active"?"#6366f1":"#cbd5e1"} strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── ANALYSIS PAGE ─── */
function AnalysisPage() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [visible, setVisible] = useState(false);
  const [useAI, setUseAI] = useState(false);

  const analyze = async (t) => {
    setAnalyzing(true); setVisible(false); setResult(null);
    try {
      let r;
      if (useAI) {
        r = await aiAnalyzeSignal(t);
      } else {
        await new Promise(res => setTimeout(res, 1400));
        r = getMockAnalysis(t);
      }
      setResult(r); setAnalyzing(false);
      setTimeout(() => setVisible(true), 40);
    } catch {
      await new Promise(res => setTimeout(res, 1400));
      setResult(getMockAnalysis(t)); setAnalyzing(false);
      setTimeout(() => setVisible(true), 40);
    }
  };

  const cfg = result ? RISK_CFG[result.risk_level] : null;
  const sentimentColor = { negative:"#ef4444", neutral:"#f59e0b", positive:"#22c55e" };

  const TIMELINE_DATA = [
    { date:"Jan", HIGH:12, MEDIUM:45, LOW:89 },
    { date:"Feb", HIGH:18, MEDIUM:52, LOW:92 },
    { date:"Mar", HIGH:15, MEDIUM:48, LOW:78 },
    { date:"Apr", HIGH:29, MEDIUM:61, LOW:85 },
    { date:"May", HIGH:22, MEDIUM:55, LOW:91 },
    { date:"Jun", HIGH:41, MEDIUM:72, LOW:102 },
    { date:"Jul", HIGH:38, MEDIUM:68, LOW:95 },
  ];

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"22px" }}>
      <div style={{ display:"grid", gridTemplateColumns:"380px 1fr", gap:"18px", alignItems:"start" }}>
        {/* Input Panel */}
        <div style={{ display:"flex", flexDirection:"column", gap:"14px" }}>
          <div style={CARD} className="card-enter">
            <div style={{ padding:"16px 20px 12px", borderBottom:"1px solid #f1f5f9", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div>
                <div style={{ fontSize:"14px", fontWeight:"700", color:"#0f172a" }}>Signal Input</div>
                <div style={{ fontSize:"11px", color:"#94a3b8", marginTop:"2px" }}>Clinical notes, social posts, or reviews</div>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
                <span style={{ fontSize:"11px", color:"#94a3b8" }}>AI</span>
                <div onClick={()=>setUseAI(u=>!u)} style={{ width:"36px", height:"19px", borderRadius:"10px", background:useAI?"#6366f1":"#d1d5db", cursor:"pointer", position:"relative", transition:"background 0.2s" }}>
                  <div style={{ position:"absolute", width:"15px", height:"15px", background:"#fff", borderRadius:"50%", top:"2px", left:useAI?"19px":"2px", transition:"left 0.2s", boxShadow:"0 1px 4px rgba(0,0,0,0.15)" }} />
                </div>
              </div>
            </div>
            <div style={{ padding:"14px 20px" }}>
              <textarea value={text} onChange={e=>setText(e.target.value)} placeholder="Enter patient text, medicine review, or social post…"
                style={{ width:"100%", height:"150px", border:"1.5px solid #e2e8f0", borderRadius:"10px", padding:"12px 14px", fontSize:"13.5px", color:"#1e293b", background:"#fafafa", resize:"none", outline:"none", fontFamily:"'Plus Jakarta Sans',sans-serif", lineHeight:1.6, boxSizing:"border-box", transition:"border-color 0.2s" }}
                onFocus={e=>e.target.style.borderColor="#6366f1"} onBlur={e=>e.target.style.borderColor="#e2e8f0"} />
              <div style={{ marginTop:"10px" }}>
                <div style={{ fontSize:"10px", color:"#94a3b8", fontWeight:"600", textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:"7px" }}>Quick samples</div>
                {SAMPLE_TEXTS.map((s, i) => (
                  <button key={i} onClick={()=>setText(s.text)} style={{ display:"flex", width:"100%", alignItems:"center", gap:"7px", background:"#f8fafc", border:"1px solid #e2e8f0", borderRadius:"7px", padding:"7px 10px", textAlign:"left", fontSize:"12px", color:"#475569", cursor:"pointer", fontFamily:"'Plus Jakarta Sans',sans-serif", marginBottom:"5px", transition:"all 0.15s" }}
                    onMouseEnter={e=>{e.currentTarget.style.background="#eef2ff";e.currentTarget.style.color="#4f46e5";e.currentTarget.style.borderColor="#c7d2fe";}}
                    onMouseLeave={e=>{e.currentTarget.style.background="#f8fafc";e.currentTarget.style.color="#475569";e.currentTarget.style.borderColor="#e2e8f0";}}>
                    <span style={{ opacity:0.4, fontSize:"10px" }}>↗</span>{s.label}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ padding:"0 20px 18px" }}>
              <button onClick={()=>text.trim()&&analyze(text)} disabled={analyzing||!text.trim()} style={{ width:"100%", padding:"13px", borderRadius:"11px", border:"none", background:text.trim()&&!analyzing?"linear-gradient(135deg,#4f46e5,#7c3aed)":"#e2e8f0", color:text.trim()&&!analyzing?"#fff":"#94a3b8", fontSize:"13.5px", fontWeight:"700", cursor:text.trim()&&!analyzing?"pointer":"not-allowed", fontFamily:"'Plus Jakarta Sans',sans-serif", display:"flex", alignItems:"center", justifyContent:"center", gap:"8px", transition:"all 0.2s" }}>
                {analyzing ? <><Spinner size={15} color="#fff" /> {useAI?"AI Analyzing…":"Analyzing Signal…"}</> : "⚡ Analyze Health Signal"}
              </button>
            </div>
          </div>
        </div>

        {/* Result Panel */}
        <div>
          {analyzing ? (
            <div style={CARD}><div style={{ padding:"24px" }}>{[100,80,90,70].map((w,i)=><ShimmerBlock key={i} h={13} w={`${w}%`} />)}</div></div>
          ) : !result ? (
            <div style={{ ...CARD, padding:"56px 24px", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"12px", border:"2px dashed #e2e8f0", background:"#fafbfc", minHeight:"340px" }}>
              <div style={{ fontSize:"44px", opacity:0.15 }}>◎</div>
              <div style={{ fontSize:"14px", color:"#94a3b8", textAlign:"center", lineHeight:1.6 }}>Enter text and click<br /><strong style={{ color:"#6366f1" }}>Analyze Health Signal</strong> to begin</div>
            </div>
          ) : (
            <div style={{ opacity:visible?1:0, transform:visible?"translateY(0)":"translateY(14px)", transition:"all 0.4s cubic-bezier(0.16,1,0.3,1)", display:"flex", flexDirection:"column", gap:"14px" }}>
              <div style={{ ...CARD, border:`1px solid ${cfg.border}`, boxShadow:`0 4px 24px ${cfg.color}20` }}>
                <div style={{ background:cfg.bg, padding:"18px 22px", display:"flex", alignItems:"center", justifyContent:"space-between", borderBottom:`1px solid ${cfg.border}` }}>
                  <div style={{ display:"flex", alignItems:"center", gap:"14px" }}>
                    <div style={{ width:"50px", height:"50px", borderRadius:"13px", background:cfg.color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"20px", color:"#fff", animation:result.risk_level==="HIGH"?"pulse-ring 2s infinite":"none" }}>{cfg.icon}</div>
                    <div>
                      <div style={{ fontSize:"10px", color:cfg.text, fontWeight:"700", textTransform:"uppercase", letterSpacing:"0.1em" }}>Risk Assessment</div>
                      <div style={{ fontSize:"28px", fontWeight:"800", color:cfg.text, fontFamily:"'JetBrains Mono',monospace", lineHeight:1.1 }}>{result.risk_level}</div>
                    </div>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <div style={{ fontSize:"10px", color:"#94a3b8" }}>Confidence</div>
                    <div style={{ fontSize:"26px", fontWeight:"800", color:"#0f172a", fontFamily:"'JetBrains Mono',monospace" }}>{result.confidence}%</div>
                    <div style={{ width:"80px", height:"4px", background:"#e2e8f0", borderRadius:"2px", marginTop:"5px" }}>
                      <div style={{ width:`${result.confidence}%`, height:"100%", background:cfg.color, borderRadius:"2px", transition:"width 0.8s ease" }} />
                    </div>
                  </div>
                </div>
                <div style={{ padding:"16px 22px" }}>
                  <div style={{ marginBottom:"14px" }}>
                    <div style={{ fontSize:"10px", fontWeight:"700", color:"#94a3b8", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:"7px" }}>Detected Symptoms / Entities</div>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:"6px" }}>
                      {result.symptoms?.map((s,i) => <Badge key={i} label={`◦ ${s}`} color="#0369a1" bg="#f0f9ff" border="#bae6fd" />)}
                    </div>
                  </div>
                  {result.entities && result.entities.length > 0 && (
                    <div style={{ marginBottom:"14px" }}>
                      <div style={{ fontSize:"10px", fontWeight:"700", color:"#94a3b8", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:"7px" }}>Named Entities</div>
                      <div style={{ display:"flex", flexWrap:"wrap", gap:"6px" }}>
                        {result.entities.map((e,i) => {
                          const entityColors = { DRUG:{ c:"#7c3aed",bg:"#f5f3ff",b:"#ddd6fe" }, SYMPTOM:{ c:"#0369a1",bg:"#f0f9ff",b:"#bae6fd" }, CONDITION:{ c:"#d97706",bg:"#fffbeb",b:"#fde68a" }, PERSON:{ c:"#dc2626",bg:"#fef2f2",b:"#fecaca" }, LOCATION:{ c:"#16a34a",bg:"#f0fdf4",b:"#bbf7d0" } };
                          const ec = entityColors[e.type] || { c:"#64748b",bg:"#f8fafc",b:"#e2e8f0" };
                          return <Badge key={i} label={`${e.text} [${e.type}]`} color={ec.c} bg={ec.bg} border={ec.b} />;
                        })}
                      </div>
                    </div>
                  )}
                  {result.pii_detected && (
                    <div style={{ padding:"8px 12px", borderRadius:"8px", background:"#fef2f2", border:"1px solid #fecaca", marginBottom:"12px", fontSize:"12px", color:"#dc2626", fontWeight:"600" }}>🔒 PII / PHI Detected — Flagged for review. Data masked before storage.</div>
                  )}
                  <div style={{ fontSize:"10px", fontWeight:"700", color:"#94a3b8", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:"7px" }}>Sentiment</div>
                  <Badge label={result.sentiment?.toUpperCase()} color={sentimentColor[result.sentiment]||"#64748b"} bg={`${sentimentColor[result.sentiment]||"#94a3b8"}18`} border={`${sentimentColor[result.sentiment]||"#94a3b8"}44`} />
                </div>
              </div>
              <div style={{ ...CARD, padding:"16px 22px" }}>
                <div style={{ fontSize:"13px", fontWeight:"700", color:"#0f172a", marginBottom:"13px" }}>◈ Explainability — Why this result?</div>
                {result.reason?.map((r, i) => (
                  <div key={i} style={{ display:"flex", gap:"11px", alignItems:"flex-start", marginBottom:"9px" }}>
                    <div style={{ width:"20px", height:"20px", borderRadius:"50%", background:"linear-gradient(135deg,#6366f1,#8b5cf6)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"10px", color:"#fff", fontWeight:"700", flexShrink:0, marginTop:"1px", fontFamily:"'JetBrains Mono',monospace" }}>{i+1}</div>
                    <span style={{ fontSize:"13px", color:"#475569", lineHeight:1.5 }}>{r}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Signal Timeline */}
      <div style={{ ...CARD }} className="card-enter">
        <div style={{ padding:"16px 22px", borderBottom:"1px solid #f1f5f9" }}>
          <div style={{ fontSize:"14px", fontWeight:"700", color:"#0f172a" }}>Signal Trending Timeline</div>
          <div style={{ fontSize:"11px", color:"#94a3b8" }}>Risk level distribution of detected signals over time</div>
        </div>
        <div style={{ padding:"20px 22px" }}>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={TIMELINE_DATA} barCategoryGap="32%">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize:11, fill:"#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize:11, fill:"#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="LOW" name="Low Risk" fill="#22c55e" radius={[4,4,0,0]} stackId="a" />
              <Bar dataKey="MEDIUM" name="Medium Risk" fill="#f59e0b" radius={[0,0,0,0]} stackId="a" />
              <Bar dataKey="HIGH" name="High Risk" fill="#ef4444" radius={[4,4,0,0]} stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

/* ─── DASHBOARD PAGE ─── */
function DashboardPage({ updates, updatesLoading }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"22px" }}>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"14px" }}>
        <StatCard label="Analyses Today" value="1,284" sub="↑ 8.2% from yesterday" accent="#6366f1" delay="card-enter-1" />
        <StatCard label="High Risk Flagged" value="39" sub="Requires immediate review" accent="#ef4444" delay="card-enter-2" />
        <StatCard label="Medicines in DB" value={MEDICINES_DB.length.toString()} sub={`${LOW_COUNT} safe · ${MEDIUM_COUNT} caution · ${HIGH_COUNT} high risk`} accent="#22c55e" delay="card-enter-3" />
        <StatCard label="Live Signals" value={updatesLoading ? "…" : updates.length.toString()} sub="AI intelligence alerts" accent="#f59e0b" delay="card-enter-4" />
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"18px" }}>
        <div style={{ ...CARD }} className="card-enter">
          <div style={{ padding:"14px 20px", borderBottom:"1px solid #f1f5f9", fontSize:"13px", fontWeight:"700", color:"#0f172a" }}>Risk Distribution</div>
          <div style={{ padding:"16px" }}>
            <div style={{ display:"flex", justifyContent:"center" }}>
              <PieChart width={160} height={160}>
                <Pie data={RISK_PIE_DATA} cx={80} cy={80} innerRadius={48} outerRadius={72} paddingAngle={3} dataKey="value">
                  {RISK_PIE_DATA.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
              </PieChart>
            </div>
            {RISK_PIE_DATA.map(d => (
              <div key={d.name} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"4px 8px" }}>
                <div style={{ display:"flex", alignItems:"center", gap:"6px" }}>
                  <div style={{ width:"8px", height:"8px", borderRadius:"2px", background:d.color }} />
                  <span style={{ fontSize:"12px", color:"#64748b" }}>{d.name}</span>
                </div>
                <span style={{ fontSize:"12px", fontWeight:"700", color:"#0f172a", fontFamily:"'JetBrains Mono',monospace" }}>{d.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ ...CARD }} className="card-enter">
          <div style={{ padding:"14px 20px", borderBottom:"1px solid #f1f5f9", fontSize:"13px", fontWeight:"700", color:"#0f172a" }}>Category Overview</div>
          <div style={{ padding:"16px" }}>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={CATEGORY_DATA.slice(0,6)} layout="vertical" barCategoryGap="20%">
                <XAxis type="number" tick={{ fontSize:10, fill:"#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize:10, fill:"#94a3b8" }} axisLine={false} tickLine={false} width={55} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" name="Medicines" fill="#6366f1" radius={[0,4,4,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={{ ...CARD }} className="card-enter">
          <div style={{ padding:"14px 20px", borderBottom:"1px solid #f1f5f9", fontSize:"13px", fontWeight:"700", color:"#0f172a" }}>Sentiment Trend</div>
          <div style={{ padding:"16px" }}>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={SENTIMENT_TREND}>
                <defs>
                  <linearGradient id="pg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} /><stop offset="95%" stopColor="#22c55e" stopOpacity={0} /></linearGradient>
                  <linearGradient id="ng" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} /><stop offset="95%" stopColor="#ef4444" stopOpacity={0} /></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize:10, fill:"#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize:10, fill:"#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="positive" stroke="#22c55e" strokeWidth={2} fill="url(#pg)" name="Positive" />
                <Area type="monotone" dataKey="negative" stroke="#ef4444" strokeWidth={2} fill="url(#ng)" name="Negative" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Live AI Updates mini panel */}
      <div style={{ ...CARD }} className="card-enter">
        <div style={{ padding:"14px 22px", borderBottom:"1px solid #f1f5f9", display:"flex", alignItems:"center", gap:"8px" }}>
          <span style={{ width:"7px", height:"7px", background:"#ef4444", borderRadius:"50%", display:"inline-block", animation:"blink 1.5s infinite" }} />
          <span style={{ fontSize:"14px", fontWeight:"700", color:"#0f172a" }}>Live AI Health Intelligence</span>
        </div>
        <div style={{ padding:"14px 22px", display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:"10px" }}>
          {updatesLoading ? [1,2,3,4,5].map(i=><ShimmerBlock key={i} h={56} mb={0} />) :
           updates.slice(0,5).map((u,i) => (
            <div key={i} style={{ background:UPDATE_BG[u.emoji]||"#f8fafc", border:`1px solid ${UPDATE_BORDER[u.emoji]||"#e2e8f0"}`, borderRadius:"10px", padding:"10px 12px", fontSize:"11.5px", color:"#374151", lineHeight:1.5 }}>
              <div style={{ fontSize:"18px", marginBottom:"4px" }}>{u.emoji}</div>
              <div style={{ fontSize:"10px", fontWeight:"700", color:UPDATE_COLOR[u.emoji]||"#64748b", textTransform:"uppercase", letterSpacing:"0.07em", marginBottom:"3px" }}>{u.type}</div>
              {u.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── ANALYTICS PAGE ─── */
function AnalyticsPage() {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"20px" }}>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"14px" }}>
        <StatCard label="Total Reviews" value={TOTAL_REVIEWS.toLocaleString()} sub="Across all medicines" accent="#6366f1" delay="card-enter-1" />
        <StatCard label="Avg Suitability" value={Math.round(MEDICINES_DB.reduce((s,m)=>s+m.suitability,0)/MEDICINES_DB.length)+"%"} sub="Mean across DB" accent="#22c55e" delay="card-enter-2" />
        <StatCard label="High Risk Meds" value={HIGH_COUNT.toString()} sub="Require extra caution" accent="#ef4444" delay="card-enter-3" />
        <StatCard label="Categories" value={MEDICINE_CATEGORIES.length.toString()} sub="Therapeutic categories" accent="#f59e0b" delay="card-enter-4" />
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"18px" }}>
        <div style={CARD} className="card-enter">
          <div style={{ padding:"16px 22px", borderBottom:"1px solid #f1f5f9" }}>
            <div style={{ fontSize:"14px", fontWeight:"700", color:"#0f172a" }}>Reviews by Category</div>
          </div>
          <div style={{ padding:"20px 22px" }}>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={CATEGORY_DATA} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize:10, fill:"#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize:10, fill:"#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="totalReviews" name="Total Reviews" fill="#6366f1" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div style={CARD} className="card-enter">
          <div style={{ padding:"16px 22px", borderBottom:"1px solid #f1f5f9" }}>
            <div style={{ fontSize:"14px", fontWeight:"700", color:"#0f172a" }}>Avg Suitability by Category</div>
          </div>
          <div style={{ padding:"20px 22px" }}>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={CATEGORY_DATA} layout="vertical" barCategoryGap="20%">
                <XAxis type="number" domain={[0,100]} tick={{ fontSize:10, fill:"#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize:10, fill:"#94a3b8" }} axisLine={false} tickLine={false} width={65} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="avgSuitability" name="Avg Suitability %" fill="#10b981" radius={[0,4,4,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div style={CARD} className="card-enter">
        <div style={{ padding:"16px 22px", borderBottom:"1px solid #f1f5f9" }}>
          <div style={{ fontSize:"14px", fontWeight:"700", color:"#0f172a" }}>Risk Distribution Across All Medicines</div>
        </div>
        <div style={{ padding:"20px 22px", display:"flex", gap:"24px", alignItems:"center" }}>
          <PieChart width={200} height={200}>
            <Pie data={RISK_PIE_DATA} cx={100} cy={100} innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value">
              {RISK_PIE_DATA.map((e,i) => <Cell key={i} fill={e.color} />)}
            </Pie>
          </PieChart>
          <div style={{ flex:1 }}>
            {RISK_PIE_DATA.map(d => (
              <div key={d.name} style={{ display:"flex", alignItems:"center", gap:"12px", marginBottom:"12px" }}>
                <div style={{ width:"12px", height:"12px", borderRadius:"3px", background:d.color, flexShrink:0 }} />
                <div style={{ flex:1 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"4px" }}>
                    <span style={{ fontSize:"13px", fontWeight:"600", color:"#0f172a" }}>{d.name}</span>
                    <span style={{ fontSize:"13px", fontFamily:"'JetBrains Mono',monospace", color:"#64748b" }}>{d.value} medicines</span>
                  </div>
                  <div style={{ height:"6px", background:"#f1f5f9", borderRadius:"3px" }}>
                    <div style={{ width:`${(d.value/MEDICINES_DB.length*100).toFixed(0)}%`, height:"100%", background:d.color, borderRadius:"3px" }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── UPDATES PAGE ─── */
function UpdatesPage({ updates, loading, onRefresh, lastFetched }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"20px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div>
          <div style={{ fontSize:"20px", fontWeight:"800", color:"#0f172a" }}>Live AI Health Intelligence</div>
          <div style={{ fontSize:"12px", color:"#94a3b8", marginTop:"2px" }}>Aggregated signals from news, social media & public health data</div>
          {lastFetched && <div style={{ fontSize:"11px", color:"#94a3b8", marginTop:"3px" }}>Last updated: {lastFetched}</div>}
        </div>
        <button onClick={onRefresh} disabled={loading} style={{ padding:"10px 20px", borderRadius:"10px", border:"1.5px solid #6366f1", background:"#fff", color:"#6366f1", fontSize:"13px", fontWeight:"700", cursor:loading?"not-allowed":"pointer", fontFamily:"'Plus Jakarta Sans',sans-serif", display:"flex", alignItems:"center", gap:"6px" }}>
          {loading ? <><Spinner size={15} color="#6366f1" /> Fetching…</> : "↻ Refresh Updates"}
        </button>
      </div>
      {loading ? (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:"14px" }}>{[1,2,3,4,5].map(i=><div key={i} style={CARD}><div style={{ padding:"20px" }}><ShimmerBlock h={14} w="40%" /><ShimmerBlock h={12} w="100%" /><ShimmerBlock h={12} w="85%" /></div></div>)}</div>
      ) : (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:"14px" }}>
          {updates.map((u,i) => (
            <div key={i} style={{ ...CARD, background:UPDATE_BG[u.emoji]||"#f8fafc", border:`1px solid ${UPDATE_BORDER[u.emoji]||"#e2e8f0"}`, padding:"20px 22px" }} className={`card-enter card-enter-${(i%4)+1}`}>
              <div style={{ display:"flex", gap:"14px" }}>
                <div style={{ fontSize:"28px" }}>{u.emoji}</div>
                <div>
                  <div style={{ fontSize:"11px", fontWeight:"700", color:UPDATE_COLOR[u.emoji]||"#64748b", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:"5px" }}>{u.type}</div>
                  <div style={{ fontSize:"14px", color:"#1e293b", lineHeight:1.6, fontWeight:"500" }}>{u.text}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── PROFILE ─── */
function ProfilePage({ user, setUser }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name:user.name, email:user.email, role:user.role });
  const save = () => { setUser(u=>({...u,...form})); setEditing(false); };
  const cancel = () => { setForm({ name:user.name, email:user.email, role:user.role }); setEditing(false); };
  const inputStyle = { width:"100%", padding:"10px 14px", border:"1.5px solid #e2e8f0", borderRadius:"9px", fontSize:"13.5px", color:"#1e293b", background:"#fafafa", outline:"none", fontFamily:"'Plus Jakarta Sans',sans-serif", boxSizing:"border-box" };
  return (
    <div style={{ maxWidth:"560px", margin:"0 auto" }}>
      <div style={CARD} className="card-enter">
        <div style={{ padding:"32px", textAlign:"center", borderBottom:"1px solid #f1f5f9" }}>
          <div style={{ width:"72px", height:"72px", borderRadius:"50%", background:"linear-gradient(135deg,#4f46e5,#7c3aed)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"26px", color:"#fff", fontWeight:"800", margin:"0 auto 16px" }}>
            {user.name.split(" ").map(w=>w[0]).join("").slice(0,2)}
          </div>
          <div style={{ fontSize:"19px", fontWeight:"700", color:"#0f172a" }}>{user.name}</div>
          <div style={{ fontSize:"13px", color:"#94a3b8", marginTop:"4px" }}>{user.role}</div>
          <div style={{ fontSize:"13px", color:"#6366f1", marginTop:"2px" }}>{user.email}</div>
        </div>
        <div style={{ padding:"22px 28px" }}>
          {editing ? (
            <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
              {[["Full Name","name"],["Email","email"],["Role / Specialty","role"]].map(([lbl,k]) => (
                <div key={k}>
                  <div style={{ fontSize:"11px", color:"#94a3b8", fontWeight:"600", marginBottom:"5px", textTransform:"uppercase" }}>{lbl}</div>
                  <input value={form[k]} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))} style={inputStyle} onFocus={e=>e.target.style.borderColor="#6366f1"} onBlur={e=>e.target.style.borderColor="#e2e8f0"} />
                </div>
              ))}
              <div style={{ display:"flex", gap:"10px", marginTop:"6px" }}>
                <button onClick={save} style={{ flex:1, padding:"11px", borderRadius:"10px", border:"none", background:"linear-gradient(135deg,#4f46e5,#7c3aed)", color:"#fff", fontSize:"13.5px", fontWeight:"700", cursor:"pointer", fontFamily:"'Plus Jakarta Sans',sans-serif" }}>Save Changes</button>
                <button onClick={cancel} style={{ flex:1, padding:"11px", borderRadius:"10px", border:"1px solid #e2e8f0", background:"#fff", color:"#475569", fontSize:"13.5px", fontWeight:"600", cursor:"pointer", fontFamily:"'Plus Jakarta Sans',sans-serif" }}>Cancel</button>
              </div>
            </div>
          ) : (
            <button onClick={()=>setEditing(true)} style={{ width:"100%", padding:"11px", borderRadius:"10px", border:"1.5px solid #6366f1", background:"#fff", color:"#6366f1", fontSize:"13.5px", fontWeight:"700", cursor:"pointer", fontFamily:"'Plus Jakarta Sans',sans-serif" }}>✏ Edit Profile</button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── SETTINGS ─── */
function SettingsPage() {
  const [settings, setSettings] = useState({ emailHigh:true, weeklyReview:false, shareData:false, twoFA:true, piiAlert:true, realtimeCrawl:false });
  const toggle = k => setSettings(s=>({...s,[k]:!s[k]}));
  const Toggle = ({ k }) => (
    <div onClick={()=>toggle(k)} style={{ width:"42px", height:"22px", borderRadius:"11px", background:settings[k]?"#6366f1":"#d1d5db", cursor:"pointer", position:"relative", transition:"background 0.2s", flexShrink:0 }}>
      <div style={{ position:"absolute", width:"18px", height:"18px", background:"#fff", borderRadius:"50%", top:"2px", left:settings[k]?"22px":"2px", transition:"left 0.2s", boxShadow:"0 1px 4px rgba(0,0,0,0.15)" }} />
    </div>
  );
  const sections = [
    { title:"🔔 Notifications", items:[{ k:"emailHigh",label:"Email Alerts for High-Risk Medicines",sub:"Receive email when HIGH risk is detected" },{ k:"weeklyReview",label:"Weekly Medicine Review Summary",sub:"Weekly digest of all medicine reviews" }] },
    { title:"🔒 Privacy & Security", items:[{ k:"shareData",label:"Share Anonymous Usage Data",sub:"Help improve AURA with anonymized analytics" },{ k:"twoFA",label:"Two-Factor Authentication",sub:"Add an extra layer of account security" },{ k:"piiAlert",label:"PII/PHI Auto-Detection Alerts",sub:"Flag and mask personal health info detected in feeds" }] },
    { title:"⚙️ Crawling & Monitoring", items:[{ k:"realtimeCrawl",label:"Enable Real-time Crawler",sub:"Continuous data acquisition from configured sources" }] },
  ];
  return (
    <div style={{ maxWidth:"600px", margin:"0 auto", display:"flex", flexDirection:"column", gap:"16px" }}>
      {sections.map(sec => (
        <div key={sec.title} style={CARD} className="card-enter">
          <div style={{ padding:"14px 22px", borderBottom:"1px solid #f1f5f9", fontSize:"14px", fontWeight:"700", color:"#0f172a" }}>{sec.title}</div>
          <div style={{ padding:"6px 0" }}>
            {sec.items.map(item => (
              <div key={item.k} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px 22px", borderBottom:"1px solid #f8fafc" }}>
                <div>
                  <div style={{ fontSize:"13.5px", fontWeight:"600", color:"#0f172a" }}>{item.label}</div>
                  <div style={{ fontSize:"12px", color:"#94a3b8", marginTop:"2px" }}>{item.sub}</div>
                </div>
                <Toggle k={item.k} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── ROOT APP ─── */
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
    <><style>{GLOBAL_STYLE}</style><AuthPage onLogin={u=>{setUser(u);setPage("Dashboard");}} /></>
  );

  const PAGES = {
    Dashboard:      <DashboardPage updates={updates} updatesLoading={updatesLoading} />,
    Medicines:      <MedicinesPage />,
    "Social Monitor": <SocialMonitorPage />,
    Analysis:       <AnalysisPage />,
    Analytics:      <AnalyticsPage />,
    Updates:        <UpdatesPage updates={updates} loading={updatesLoading} onRefresh={loadUpdates} lastFetched={lastFetched} />,
    Profile:        <ProfilePage user={user} setUser={setUser} />,
    Settings:       <SettingsPage />,
  };

  return (
    <><style>{GLOBAL_STYLE}</style>
      <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column" }}>
        <Navbar page={page} setPage={setPage} user={user} onLogout={()=>setUser(null)} updates={updates} />
        <div style={{ flex:1, padding:"24px 28px 32px", maxWidth:"1400px", width:"100%", margin:"0 auto", boxSizing:"border-box" }}>
          {PAGES[page] || PAGES.Dashboard}
        </div>
        <footer style={{ textAlign:"center", padding:"12px", fontSize:"11px", color:"#94a3b8", borderTop:"1px solid #e8eef4", background:"#fff" }}>
          AURA v3.0 · AI-Powered Health Signal Intelligence · For clinical decision support only
        </footer>
      </div>
    </>
  );
}