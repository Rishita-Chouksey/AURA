import { useState, useEffect, useRef, useCallback } from "react";
import {
  BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer,
  XAxis, YAxis, Tooltip,
} from "recharts";

// ─── MEDICINE DATABASE ────────────────────────────────────────────────────────
const MEDICINE_DB = [
  { id: 1, name: "Paracetamol", brand: "Calpol / Dolo 650", category: "Analgesic", uses: ["fever", "headache", "body pain", "cold", "flu", "toothache"], dosage: "500–1000mg every 4–6 hrs", sideEffects: ["liver damage (overdose)", "rash", "nausea"], risk: "LOW", rating: 4.6, reviews: 1240, manufacturer: "GSK", sentiment: "POSITIVE" },
  { id: 2, name: "Ibuprofen", brand: "Brufen / Advil", category: "NSAID", uses: ["fever", "headache", "inflammation", "arthritis", "menstrual pain", "toothache", "muscle pain"], dosage: "200–400mg every 4–6 hrs", sideEffects: ["stomach upset", "GI bleeding", "kidney issues"], risk: "LOW", rating: 4.3, reviews: 980, manufacturer: "Abbott", sentiment: "POSITIVE" },
  { id: 3, name: "Aspirin", brand: "Ecosprin", category: "NSAID", uses: ["fever", "headache", "blood clot prevention", "heart attack prevention", "pain"], dosage: "75–325mg daily", sideEffects: ["bleeding", "stomach ulcer", "tinnitus"], risk: "MEDIUM", rating: 4.0, reviews: 760, manufacturer: "Bayer", sentiment: "NEUTRAL" },
  { id: 4, name: "Diclofenac", brand: "Voveran", category: "NSAID", uses: ["joint pain", "arthritis", "back pain", "inflammation", "muscle pain"], dosage: "50mg 2–3 times/day", sideEffects: ["stomach pain", "headache", "dizziness", "GI bleeding"], risk: "MEDIUM", rating: 4.1, reviews: 540, manufacturer: "Novartis", sentiment: "POSITIVE" },
  { id: 5, name: "Naproxen", brand: "Naprosyn", category: "NSAID", uses: ["arthritis", "muscle pain", "menstrual cramps", "gout", "headache"], dosage: "250–500mg twice/day", sideEffects: ["stomach upset", "heartburn", "drowsiness"], risk: "LOW", rating: 4.0, reviews: 420, manufacturer: "Roche", sentiment: "NEUTRAL" },
  { id: 6, name: "Tramadol", brand: "Tramal", category: "Opioid Analgesic", uses: ["severe pain", "post-surgical pain", "chronic pain"], dosage: "50–100mg every 4–6 hrs", sideEffects: ["dizziness", "nausea", "constipation", "dependence"], risk: "HIGH", rating: 3.6, reviews: 310, manufacturer: "Grunenthal", sentiment: "NEGATIVE" },
  { id: 7, name: "Codeine", brand: "Codinex", category: "Opioid Analgesic", uses: ["moderate pain", "cough", "diarrhea"], dosage: "15–60mg every 4 hrs", sideEffects: ["constipation", "drowsiness", "dependence", "nausea"], risk: "HIGH", rating: 3.4, reviews: 220, manufacturer: "Various", sentiment: "NEGATIVE" },
  { id: 8, name: "Mefenamic Acid", brand: "Ponstan", category: "NSAID", uses: ["menstrual pain", "mild pain", "headache", "dental pain"], dosage: "500mg 3 times/day", sideEffects: ["diarrhea", "stomach upset", "dizziness"], risk: "LOW", rating: 4.2, reviews: 480, manufacturer: "Pfizer", sentiment: "POSITIVE" },
  { id: 9, name: "Amoxicillin", brand: "Mox / Trimox", category: "Antibiotic", uses: ["bacterial infection", "throat infection", "ear infection", "pneumonia", "UTI"], dosage: "250–500mg 3 times/day", sideEffects: ["diarrhea", "rash", "nausea"], risk: "LOW", rating: 4.5, reviews: 870, manufacturer: "GSK", sentiment: "POSITIVE" },
  { id: 10, name: "Azithromycin", brand: "Zithromax / Azee", category: "Antibiotic", uses: ["respiratory infection", "pneumonia", "STI", "skin infection", "ear infection", "COVID treatment"], dosage: "500mg once/day for 3–5 days", sideEffects: ["nausea", "diarrhea", "abdominal pain"], risk: "LOW", rating: 4.6, reviews: 1100, manufacturer: "Pfizer", sentiment: "POSITIVE" },
  { id: 11, name: "Ciprofloxacin", brand: "Ciplox", category: "Antibiotic", uses: ["UTI", "diarrhea", "typhoid", "skin infection", "bone infection"], dosage: "250–500mg twice/day", sideEffects: ["tendon damage", "dizziness", "nausea", "photosensitivity"], risk: "MEDIUM", rating: 4.0, reviews: 590, manufacturer: "Cipla", sentiment: "NEUTRAL" },
  { id: 12, name: "Doxycycline", brand: "Vibramycin", category: "Antibiotic", uses: ["acne", "malaria prevention", "chlamydia", "Lyme disease", "respiratory infection"], dosage: "100mg twice/day", sideEffects: ["photosensitivity", "nausea", "esophageal irritation"], risk: "LOW", rating: 4.1, reviews: 430, manufacturer: "Pfizer", sentiment: "NEUTRAL" },
  { id: 13, name: "Metronidazole", brand: "Flagyl", category: "Antibiotic", uses: ["bacterial vaginosis", "amoeba infection", "dental infection", "C. diff"], dosage: "400–500mg 3 times/day", sideEffects: ["metallic taste", "nausea", "dark urine"], risk: "LOW", rating: 3.9, reviews: 380, manufacturer: "Sanofi", sentiment: "NEUTRAL" },
  { id: 14, name: "Cephalexin", brand: "Keflex", category: "Antibiotic", uses: ["skin infection", "UTI", "ear infection", "bone infection"], dosage: "250–500mg 4 times/day", sideEffects: ["diarrhea", "nausea", "stomach upset"], risk: "LOW", rating: 4.2, reviews: 340, manufacturer: "Shionogi", sentiment: "POSITIVE" },
  { id: 15, name: "Levofloxacin", brand: "Levaquin", category: "Antibiotic", uses: ["pneumonia", "sinusitis", "UTI", "prostatitis"], dosage: "500mg once/day", sideEffects: ["tendon rupture", "QT prolongation", "dizziness"], risk: "HIGH", rating: 3.8, reviews: 280, manufacturer: "J&J", sentiment: "NEUTRAL" },
  { id: 16, name: "Clarithromycin", brand: "Biaxin", category: "Antibiotic", uses: ["pneumonia", "strep throat", "H. pylori", "skin infection"], dosage: "250–500mg twice/day", sideEffects: ["diarrhea", "nausea", "taste disturbance"], risk: "LOW", rating: 4.1, reviews: 300, manufacturer: "Abbott", sentiment: "POSITIVE" },
  { id: 17, name: "Clindamycin", brand: "Dalacin", category: "Antibiotic", uses: ["dental abscess", "skin infection", "anaerobic infection", "MRSA"], dosage: "150–450mg 4 times/day", sideEffects: ["C. diff colitis", "diarrhea", "nausea"], risk: "MEDIUM", rating: 3.9, reviews: 250, manufacturer: "Pfizer", sentiment: "NEUTRAL" },
  { id: 18, name: "Co-amoxiclav", brand: "Augmentin", category: "Antibiotic", uses: ["sinusitis", "pneumonia", "UTI", "skin infection", "ear infection"], dosage: "625mg 3 times/day", sideEffects: ["diarrhea", "nausea", "rash"], risk: "LOW", rating: 4.3, reviews: 620, manufacturer: "GSK", sentiment: "POSITIVE" },
  { id: 19, name: "Acyclovir", brand: "Zovirax", category: "Antiviral", uses: ["herpes", "chickenpox", "shingles", "cold sores"], dosage: "200–800mg 5 times/day", sideEffects: ["nausea", "headache", "kidney issues (IV)"], risk: "LOW", rating: 4.3, reviews: 410, manufacturer: "GSK", sentiment: "POSITIVE" },
  { id: 20, name: "Oseltamivir", brand: "Tamiflu", category: "Antiviral", uses: ["influenza", "flu", "flu prevention"], dosage: "75mg twice/day for 5 days", sideEffects: ["nausea", "vomiting", "headache"], risk: "LOW", rating: 4.0, reviews: 560, manufacturer: "Roche", sentiment: "POSITIVE" },
  { id: 21, name: "Favipiravir", brand: "FabiFlu", category: "Antiviral", uses: ["COVID-19", "influenza", "viral fever"], dosage: "1800mg twice Day 1, then 800mg twice/day", sideEffects: ["increased uric acid", "diarrhea", "nausea"], risk: "MEDIUM", rating: 3.8, reviews: 340, manufacturer: "Glenmark", sentiment: "NEUTRAL" },
  { id: 22, name: "Fluconazole", brand: "Diflucan", category: "Antifungal", uses: ["vaginal yeast infection", "oral thrush", "ringworm", "fungal meningitis"], dosage: "50–400mg/day", sideEffects: ["nausea", "headache", "liver toxicity"], risk: "LOW", rating: 4.4, reviews: 480, manufacturer: "Pfizer", sentiment: "POSITIVE" },
  { id: 23, name: "Clotrimazole", brand: "Canesten", category: "Antifungal", uses: ["ringworm", "athlete's foot", "vaginal thrush", "jock itch"], dosage: "Apply twice/day topically", sideEffects: ["burning", "skin irritation", "redness"], risk: "LOW", rating: 4.3, reviews: 560, manufacturer: "Bayer", sentiment: "POSITIVE" },
  { id: 24, name: "Amlodipine", brand: "Norvasc", category: "Calcium Channel Blocker", uses: ["high blood pressure", "hypertension", "angina", "chest pain"], dosage: "5–10mg once/day", sideEffects: ["ankle swelling", "flushing", "dizziness"], risk: "LOW", rating: 4.3, reviews: 720, manufacturer: "Pfizer", sentiment: "POSITIVE" },
  { id: 25, name: "Lisinopril", brand: "Zestril", category: "ACE Inhibitor", uses: ["high blood pressure", "heart failure", "diabetic kidney disease"], dosage: "10–40mg once/day", sideEffects: ["dry cough", "dizziness", "hyperkalemia"], risk: "LOW", rating: 4.2, reviews: 680, manufacturer: "AstraZeneca", sentiment: "POSITIVE" },
  { id: 26, name: "Metoprolol", brand: "Lopressor", category: "Beta Blocker", uses: ["hypertension", "heart failure", "angina", "arrhythmia", "migraine prevention"], dosage: "25–200mg once or twice/day", sideEffects: ["fatigue", "cold hands", "dizziness", "bradycardia"], risk: "LOW", rating: 4.1, reviews: 520, manufacturer: "Novartis", sentiment: "POSITIVE" },
  { id: 27, name: "Losartan", brand: "Cozaar", category: "ARB", uses: ["hypertension", "diabetic kidney disease", "heart failure"], dosage: "25–100mg once/day", sideEffects: ["dizziness", "hyperkalemia", "kidney issues"], risk: "LOW", rating: 4.2, reviews: 580, manufacturer: "Merck", sentiment: "POSITIVE" },
  { id: 28, name: "Atorvastatin", brand: "Lipitor", category: "Statin", uses: ["high cholesterol", "cholesterol", "cardiovascular prevention"], dosage: "10–80mg once/day", sideEffects: ["muscle pain", "liver toxicity", "GI upset"], risk: "LOW", rating: 4.3, reviews: 890, manufacturer: "Pfizer", sentiment: "POSITIVE" },
  { id: 29, name: "Warfarin", brand: "Coumadin", category: "Anticoagulant", uses: ["blood clot prevention", "DVT", "atrial fibrillation", "stroke prevention"], dosage: "Individualized (INR-guided)", sideEffects: ["bleeding", "bruising", "drug interactions"], risk: "HIGH", rating: 3.5, reviews: 290, manufacturer: "BMS", sentiment: "NEGATIVE" },
  { id: 30, name: "Metformin", brand: "Glucophage", category: "Antidiabetic", uses: ["diabetes", "type 2 diabetes", "high blood sugar", "PCOS"], dosage: "500–2000mg/day with meals", sideEffects: ["GI upset", "nausea", "vitamin B12 deficiency"], risk: "LOW", rating: 4.4, reviews: 1050, manufacturer: "Merck", sentiment: "POSITIVE" },
  { id: 31, name: "Insulin Glargine", brand: "Lantus", category: "Insulin", uses: ["diabetes", "type 1 diabetes", "type 2 diabetes"], dosage: "Individualized SC injection once/day", sideEffects: ["hypoglycemia", "injection site reactions", "weight gain"], risk: "MEDIUM", rating: 4.3, reviews: 540, manufacturer: "Sanofi", sentiment: "POSITIVE" },
  { id: 32, name: "Empagliflozin", brand: "Jardiance", category: "SGLT2 Inhibitor", uses: ["type 2 diabetes", "heart failure", "diabetic kidney disease"], dosage: "10–25mg once/day", sideEffects: ["UTI", "genital yeast infection", "DKA (rare)"], risk: "LOW", rating: 4.2, reviews: 320, manufacturer: "Boehringer", sentiment: "POSITIVE" },
  { id: 33, name: "Salbutamol", brand: "Ventolin", category: "Bronchodilator", uses: ["asthma", "wheezing", "COPD", "breathlessness", "bronchospasm"], dosage: "100–200mcg inhaler every 4–6 hrs PRN", sideEffects: ["tremor", "palpitations", "headache"], risk: "LOW", rating: 4.6, reviews: 980, manufacturer: "GSK", sentiment: "POSITIVE" },
  { id: 34, name: "Budesonide", brand: "Pulmicort", category: "Inhaled Corticosteroid", uses: ["asthma", "COPD", "wheezing", "allergic rhinitis"], dosage: "200–800mcg/day inhaled", sideEffects: ["oral thrush", "hoarseness", "adrenal suppression (high dose)"], risk: "LOW", rating: 4.3, reviews: 560, manufacturer: "AstraZeneca", sentiment: "POSITIVE" },
  { id: 35, name: "Cetirizine", brand: "Zyrtec", category: "Antihistamine", uses: ["allergy", "hay fever", "urticaria", "sneezing", "itching", "seasonal allergy", "rhinitis"], dosage: "10mg once/day", sideEffects: ["drowsiness", "dry mouth", "headache"], risk: "LOW", rating: 4.5, reviews: 1120, manufacturer: "UCB", sentiment: "POSITIVE" },
  { id: 36, name: "Loratadine", brand: "Claritin", category: "Antihistamine", uses: ["allergy", "hay fever", "urticaria", "sneezing", "seasonal allergy"], dosage: "10mg once/day", sideEffects: ["headache", "dry mouth", "fatigue"], risk: "LOW", rating: 4.4, reviews: 880, manufacturer: "Bayer", sentiment: "POSITIVE" },
  { id: 37, name: "Fexofenadine", brand: "Allegra", category: "Antihistamine", uses: ["allergy", "seasonal allergy", "urticaria", "hay fever", "sneezing"], dosage: "120–180mg once/day", sideEffects: ["headache", "nausea", "dizziness"], risk: "LOW", rating: 4.3, reviews: 650, manufacturer: "Sanofi", sentiment: "POSITIVE" },
  { id: 38, name: "Omeprazole", brand: "Prilosec", category: "PPI", uses: ["acid reflux", "heartburn", "GERD", "peptic ulcer", "stomach ulcer"], dosage: "20–40mg once/day", sideEffects: ["headache", "nausea", "hypomagnesemia (long term)"], risk: "LOW", rating: 4.5, reviews: 1050, manufacturer: "AstraZeneca", sentiment: "POSITIVE" },
  { id: 39, name: "Pantoprazole", brand: "Protonix", category: "PPI", uses: ["acid reflux", "GERD", "peptic ulcer", "heartburn", "stomach acid"], dosage: "40mg once/day", sideEffects: ["headache", "diarrhea", "nausea"], risk: "LOW", rating: 4.4, reviews: 820, manufacturer: "Pfizer", sentiment: "POSITIVE" },
  { id: 40, name: "Ondansetron", brand: "Zofran", category: "Antiemetic", uses: ["nausea", "vomiting", "chemotherapy nausea", "post-op nausea"], dosage: "4–8mg 3 times/day", sideEffects: ["constipation", "headache", "QT prolongation"], risk: "LOW", rating: 4.5, reviews: 730, manufacturer: "GSK", sentiment: "POSITIVE" },
  { id: 41, name: "Sertraline", brand: "Zoloft", category: "SSRI", uses: ["depression", "anxiety", "OCD", "PTSD", "panic disorder"], dosage: "50–200mg once/day", sideEffects: ["nausea", "insomnia", "sexual dysfunction", "suicidal ideation (young)"], risk: "MEDIUM", rating: 4.0, reviews: 820, manufacturer: "Pfizer", sentiment: "POSITIVE" },
  { id: 42, name: "Escitalopram", brand: "Lexapro", category: "SSRI", uses: ["depression", "anxiety", "generalized anxiety", "panic disorder"], dosage: "10–20mg once/day", sideEffects: ["nausea", "insomnia", "drowsiness", "sexual dysfunction"], risk: "LOW", rating: 4.1, reviews: 680, manufacturer: "Lundbeck", sentiment: "POSITIVE" },
  { id: 43, name: "Alprazolam", brand: "Xanax", category: "Benzodiazepine", uses: ["anxiety", "panic disorder", "social anxiety"], dosage: "0.25–0.5mg 3 times/day", sideEffects: ["dependence", "drowsiness", "cognitive impairment", "withdrawal"], risk: "HIGH", rating: 4.0, reviews: 560, manufacturer: "Pfizer", sentiment: "NEUTRAL" },
  { id: 44, name: "Zolpidem", brand: "Ambien", category: "Hypnotic", uses: ["insomnia", "sleep disorder", "difficulty sleeping"], dosage: "5–10mg at bedtime", sideEffects: ["next-day drowsiness", "sleepwalking", "dependence", "hallucinations"], risk: "MEDIUM", rating: 3.9, reviews: 470, manufacturer: "Sanofi", sentiment: "NEUTRAL" },
  { id: 45, name: "Gabapentin", brand: "Neurontin", category: "Anticonvulsant", uses: ["neuropathic pain", "seizure", "shingles pain", "fibromyalgia", "restless leg syndrome"], dosage: "300–3600mg/day in divided doses", sideEffects: ["dizziness", "drowsiness", "weight gain", "edema"], risk: "LOW", rating: 4.0, reviews: 590, manufacturer: "Pfizer", sentiment: "NEUTRAL" },
  { id: 46, name: "Sumatriptan", brand: "Imitrex", category: "Triptan", uses: ["migraine", "cluster headache", "severe headache"], dosage: "25–100mg at onset, repeat after 2 hrs", sideEffects: ["chest tightness", "dizziness", "flushing"], risk: "MEDIUM", rating: 4.4, reviews: 520, manufacturer: "GSK", sentiment: "POSITIVE" },
  { id: 47, name: "Levothyroxine", brand: "Synthroid", category: "Thyroid Hormone", uses: ["hypothyroidism", "thyroid deficiency", "fatigue", "weight gain"], dosage: "25–200mcg once/day on empty stomach", sideEffects: ["palpitations", "insomnia", "sweating (overdose)"], risk: "LOW", rating: 4.5, reviews: 870, manufacturer: "Abbott", sentiment: "POSITIVE" },
  { id: 48, name: "Isotretinoin", brand: "Accutane", category: "Retinoid", uses: ["severe acne", "cystic acne", "nodular acne"], dosage: "0.5–1mg/kg/day for 15–20 weeks", sideEffects: ["birth defects (teratogenic)", "dry skin/lips", "mood changes", "liver toxicity"], risk: "HIGH", rating: 4.3, reviews: 520, manufacturer: "Roche", sentiment: "POSITIVE" },
  { id: 49, name: "Vitamin D3", brand: "Cholecalciferol", category: "Vitamin", uses: ["vitamin D deficiency", "bone pain", "osteoporosis", "immune support"], dosage: "1000–4000IU/day", sideEffects: ["hypercalcemia (high dose)", "nausea", "weakness"], risk: "LOW", rating: 4.5, reviews: 980, manufacturer: "Various", sentiment: "POSITIVE" },
  { id: 50, name: "ORS / Electrolyte Solution", brand: "Electral", category: "Rehydration", uses: ["diarrhea", "dehydration", "gastroenteritis", "vomiting"], dosage: "200ml after each loose stool", sideEffects: ["hypernatremia (excess use)"], risk: "LOW", rating: 4.7, reviews: 1100, manufacturer: "WHO formula", sentiment: "POSITIVE" },
  { id: 51, name: "Prednisolone", brand: "Deltacortril", category: "Corticosteroid", uses: ["asthma", "inflammation", "allergic reaction", "lupus", "arthritis", "COPD"], dosage: "5–60mg/day", sideEffects: ["weight gain", "osteoporosis", "hyperglycemia", "immunosuppression"], risk: "MEDIUM", rating: 4.0, reviews: 520, manufacturer: "Pfizer", sentiment: "NEUTRAL" },
  { id: 52, name: "Melatonin", brand: "Circadin", category: "Hypnotic", uses: ["insomnia", "jet lag", "sleep disorder", "shift work"], dosage: "0.5–5mg at bedtime", sideEffects: ["drowsiness", "headache", "dizziness"], risk: "LOW", rating: 4.2, reviews: 780, manufacturer: "Various", sentiment: "POSITIVE" },
  { id: 53, name: "Vitamin C", brand: "Ascorbic Acid", category: "Vitamin", uses: ["vitamin C deficiency", "scurvy", "immune support", "cold prevention", "wound healing"], dosage: "65–2000mg/day", sideEffects: ["diarrhea (high dose)", "kidney stones (very high dose)"], risk: "LOW", rating: 4.5, reviews: 870, manufacturer: "Various", sentiment: "POSITIVE" },
  { id: 54, name: "Sildenafil", brand: "Viagra", category: "PDE5 Inhibitor", uses: ["erectile dysfunction", "pulmonary hypertension"], dosage: "25–100mg 1 hr before activity", sideEffects: ["headache", "flushing", "visual disturbance", "hypotension"], risk: "LOW", rating: 4.4, reviews: 690, manufacturer: "Pfizer", sentiment: "POSITIVE" },
  { id: 55, name: "Hyoscine Butylbromide", brand: "Buscopan", category: "Anticholinergic", uses: ["abdominal cramps", "IBS", "stomach spasm", "ureteric colic"], dosage: "10–20mg 3 times/day", sideEffects: ["dry mouth", "blurred vision", "tachycardia"], risk: "LOW", rating: 4.3, reviews: 540, manufacturer: "Boehringer", sentiment: "POSITIVE" },
  { id: 56, name: "Amoxicillin", brand: "Mox / Trimox", category: "Antibiotic", uses: ["bacterial infection", "throat infection", "ear infection", "pneumonia", "UTI"], dosage: "250–500mg 3 times/day", sideEffects: ["diarrhea", "rash", "nausea"], risk: "LOW", rating: 4.5, reviews: 870, manufacturer: "GSK", sentiment: "POSITIVE" },
  { id: 57, name: "Furosemide", brand: "Lasix", category: "Diuretic", uses: ["heart failure", "edema", "hypertension", "kidney disease"], dosage: "20–80mg once/day", sideEffects: ["electrolyte imbalance", "dehydration", "hearing loss (high dose)"], risk: "MEDIUM", rating: 3.9, reviews: 360, manufacturer: "Sanofi", sentiment: "NEUTRAL" },
  { id: 58, name: "Loperamide", brand: "Imodium", category: "Antidiarrheal", uses: ["diarrhea", "traveler's diarrhea", "IBS diarrhea"], dosage: "2–4mg initially, 2mg after each loose stool", sideEffects: ["constipation", "abdominal cramps", "dizziness"], risk: "LOW", rating: 4.4, reviews: 640, manufacturer: "J&J", sentiment: "POSITIVE" },
  { id: 59, name: "Domperidone", brand: "Motilium", category: "Antiemetic", uses: ["nausea", "vomiting", "gastroparesis", "bloating"], dosage: "10mg 3 times/day", sideEffects: ["dry mouth", "cardiac arrhythmia (rare)", "drowsiness"], risk: "MEDIUM", rating: 4.0, reviews: 490, manufacturer: "J&J", sentiment: "NEUTRAL" },
  { id: 60, name: "Albendazole", brand: "Zentel", category: "Anthelmintic", uses: ["worm infestation", "roundworm", "tapeworm", "hookworm", "pinworm"], dosage: "400mg single dose", sideEffects: ["nausea", "abdominal pain", "liver enzyme elevation"], risk: "LOW", rating: 4.3, reviews: 340, manufacturer: "GSK", sentiment: "POSITIVE" },
];

const CATEGORY_COUNTS = {};
const SYMPTOM_COUNTS = {};
MEDICINE_DB.forEach(m => {
  CATEGORY_COUNTS[m.category] = (CATEGORY_COUNTS[m.category] || 0) + 1;
  m.uses.forEach(u => { SYMPTOM_COUNTS[u] = (SYMPTOM_COUNTS[u] || 0) + 1; });
});

const TOP_CATEGORIES = Object.entries(CATEGORY_COUNTS).sort((a, b) => b[1] - a[1]).slice(0, 8);
const TOP_SYMPTOMS = Object.entries(SYMPTOM_COUNTS).sort((a, b) => b[1] - a[1]).slice(0, 12);
const RISK_COLORS = { LOW: "#059669", MEDIUM: "#d97706", HIGH: "#dc2626" };

function riskBadge(risk) {
  const styles = {
    LOW: { bg: "#ecfdf5", color: "#065f46", label: "✓ Safe" },
    MEDIUM: { bg: "#fffbeb", color: "#92400e", label: "◉ Caution" },
    HIGH: { bg: "#fef2f2", color: "#991b1b", label: "⚠ High Risk" },
  };
  const s = styles[risk];
  return (
    <span style={{ background: s.bg, color: s.color, padding: "2px 9px", borderRadius: 20, fontSize: 11, fontWeight: 700, letterSpacing: "0.3px" }}>
      {s.label}
    </span>
  );
}

function Stars({ rating }) {
  return (
    <span style={{ color: "#f59e0b", fontSize: 12 }}>
      {"★".repeat(Math.round(rating))}{"☆".repeat(5 - Math.round(rating))}
      <span style={{ color: "#94a3b8", marginLeft: 4, fontSize: 11 }}>{rating.toFixed(1)}</span>
    </span>
  );
}

function searchMedicines(query, filters) {
  let results = MEDICINE_DB.filter(m => {
    if (filters.category && m.category !== filters.category) return false;
    if (filters.risk && m.risk !== filters.risk) return false;
    if (!query.trim()) return true;
    const q = query.toLowerCase().trim();
    return (
      m.name.toLowerCase().includes(q) ||
      (m.brand && m.brand.toLowerCase().includes(q)) ||
      m.category.toLowerCase().includes(q) ||
      m.uses.some(u => u.includes(q)) ||
      (m.manufacturer && m.manufacturer.toLowerCase().includes(q))
    );
  });
  if (query.trim()) {
    const q = query.toLowerCase().trim();
    results = results.map(m => {
      let score = 0;
      if (m.name.toLowerCase().startsWith(q)) score += 100;
      else if (m.name.toLowerCase().includes(q)) score += 60;
      if (m.uses.some(u => u === q)) score += 80;
      else if (m.uses.some(u => u.includes(q))) score += 40;
      score += m.reviews / 1000;
      return { ...m, score };
    });
    results.sort((a, b) => b.score - a.score);
  }
  return results;
}

function getSuggestions(query) {
  if (!query || query.length < 2) return [];
  const q = query.toLowerCase();
  const names = MEDICINE_DB.filter(m => m.name.toLowerCase().includes(q)).slice(0, 3).map(m => ({ text: m.name, type: "medicine" }));
  const symptoms = [...new Set(MEDICINE_DB.flatMap(m => m.uses))].filter(u => u.includes(q)).slice(0, 3).map(u => ({ text: u, type: "symptom" }));
  return [...names, ...symptoms].slice(0, 6);
}

// ─── RESPONSIVE HOOK ──────────────────────────────────────────────────────────
function useBreakpoint() {
  const [bp, setBp] = useState(() => {
    if (typeof window === "undefined") return "desktop";
    return window.innerWidth < 768 ? "mobile" : window.innerWidth < 1100 ? "tablet" : "desktop";
  });
  useEffect(() => {
    const handler = () => {
      const w = window.innerWidth;
      setBp(w < 768 ? "mobile" : w < 1100 ? "tablet" : "desktop");
    };
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return bp;
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [query, setQuery] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filters, setFilters] = useState({ category: "", risk: "" });
  const [results, setResults] = useState(MEDICINE_DB);
  const [selected, setSelected] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [history, setHistory] = useState([]);
  const [view, setView] = useState("search");
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const bp = useBreakpoint();
  const ITEMS_PER_PAGE = bp === "mobile" ? 8 : bp === "tablet" ? 9 : 12;
  const inputRef = useRef(null);
  const debounceRef = useRef(null);

  const isMobile = bp === "mobile";
  const isTablet = bp === "tablet";
  const isDesktop = bp === "desktop";

  const t = darkMode ? {
    bg: "#0a0f1e", surface: "#111827", card: "#1a2235", border: "#1e2d45",
    text: "#f0f6ff", subtext: "#7c93b5", accent: "#4f8ef7", input: "#111827",
    accentLight: "#1a2d4e", headerBg: "#0d1526",
  } : {
    bg: "#f0f5ff", surface: "#ffffff", card: "#ffffff", border: "#dce8f8",
    text: "#0d1b2e", subtext: "#6b7d9a", accent: "#2563eb", input: "#ffffff",
    accentLight: "#eff4ff", headerBg: "#ffffff",
  };

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedQ(query), 200);
    setSuggestions(getSuggestions(query));
  }, [query]);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setResults(searchMedicines(debouncedQ, filters));
      setPage(1);
      setLoading(false);
    }, 150);
    return () => clearTimeout(timer);
  }, [debouncedQ, filters]);

  const handleSearch = useCallback((term) => {
    setQuery(term);
    setShowSuggestions(false);
    if (term.trim()) setHistory(h => [term, ...h.filter(x => x !== term)].slice(0, 8));
  }, []);

  const toggleBookmark = useCallback((id) => {
    setBookmarks(b => b.includes(id) ? b.filter(x => x !== id) : [...b, id]);
  }, []);

  const paginatedResults = results.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const totalPages = Math.ceil(results.length / ITEMS_PER_PAGE);
  const categories = [...new Set(MEDICINE_DB.map(m => m.category))].sort();

  const piData = [
    { name: "Safe", value: MEDICINE_DB.filter(m => m.risk === "LOW").length, color: "#059669" },
    { name: "Caution", value: MEDICINE_DB.filter(m => m.risk === "MEDIUM").length, color: "#d97706" },
    { name: "High Risk", value: MEDICINE_DB.filter(m => m.risk === "HIGH").length, color: "#dc2626" },
  ];
  const catData = TOP_CATEGORIES.slice(0, 6).map(([name, count]) => ({ name: name.split(" ")[0], count }));

  // Sidebar content (shared between desktop sidebar and mobile drawer)
  const SidebarContent = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 14, padding: isMobile ? "0 0 80px 0" : 0 }}>
      {/* Search */}
      <div style={{ position: "relative" }}>
        <div style={{ position: "relative" }}>
          <span style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", fontSize: 15, color: t.subtext, pointerEvents: "none" }}>🔍</span>
          <input
            ref={inputRef}
            value={query}
            onChange={e => { setQuery(e.target.value); setShowSuggestions(true); }}
            onKeyDown={e => { if (e.key === "Enter") { handleSearch(query); setShowSuggestions(false); } if (e.key === "Escape") setShowSuggestions(false); }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder="Search medicines, symptoms..."
            style={{ width: "100%", padding: "10px 34px 10px 34px", borderRadius: 10, border: `1.5px solid ${t.border}`, background: t.input, color: t.text, fontFamily: "inherit", fontSize: 13, outline: "none", boxSizing: "border-box", transition: "border-color 0.15s" }}
          />
          {query && (
            <button onClick={() => { setQuery(""); setDebouncedQ(""); }} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: t.subtext, fontSize: 15, padding: 0, lineHeight: 1 }}>✕</button>
          )}
        </div>
        {showSuggestions && suggestions.length > 0 && (
          <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, background: t.surface, border: `1px solid ${t.border}`, borderRadius: 10, boxShadow: "0 8px 24px rgba(0,0,0,0.12)", zIndex: 9999 }}>
            {suggestions.map((s2, i) => (
              <div key={i} onMouseDown={() => handleSearch(s2.text)}
                style={{ padding: "8px 12px", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: t.text, borderBottom: i < suggestions.length - 1 ? `1px solid ${t.border}` : "none" }}
                onMouseEnter={e => e.currentTarget.style.background = t.accentLight}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <span style={{ opacity: 0.6 }}>{s2.type === "medicine" ? "💊" : "🩺"}</span>
                <span>{s2.text}</span>
                <span style={{ marginLeft: "auto", fontSize: 10, background: s2.type === "medicine" ? "#ede9fe" : "#dcfce7", color: s2.type === "medicine" ? "#6d28d9" : "#065f46", padding: "1px 7px", borderRadius: 10, fontWeight: 600 }}>{s2.type}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Filters */}
      <div style={{ background: t.surface, borderRadius: 12, border: `1px solid ${t.border}`, padding: 14 }}>
        <div style={{ fontWeight: 700, fontSize: 12, marginBottom: 10, color: t.text, letterSpacing: "0.5px", textTransform: "uppercase" }}>Filters</div>
        <div style={{ fontSize: 11, color: t.subtext, marginBottom: 4, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.4px" }}>Category</div>
        <select value={filters.category} onChange={e => setFilters(f => ({ ...f, category: e.target.value }))}
          style={{ width: "100%", padding: "7px 9px", borderRadius: 8, border: `1px solid ${t.border}`, background: t.input, color: t.text, fontFamily: "inherit", fontSize: 12, marginBottom: 12, outline: "none" }}>
          <option value="">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <div style={{ fontSize: 11, color: t.subtext, marginBottom: 8, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.4px" }}>Risk Level</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {["", "LOW", "MEDIUM", "HIGH"].map(r => (
            <label key={r} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13, color: t.text }}>
              <input type="radio" name="risk" value={r} checked={filters.risk === r} onChange={() => setFilters(f => ({ ...f, risk: r }))} style={{ accentColor: t.accent }} />
              {r === "" ? "All Risks" : r === "LOW" ? "✓ Safe" : r === "MEDIUM" ? "◉ Caution" : "⚠ High Risk"}
            </label>
          ))}
        </div>
        {(filters.category || filters.risk) && (
          <button onClick={() => setFilters({ category: "", risk: "" })}
            style={{ width: "100%", padding: "6px", marginTop: 10, borderRadius: 7, border: `1px solid ${t.border}`, background: "transparent", color: t.subtext, fontFamily: "inherit", fontSize: 11, cursor: "pointer", transition: "background 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.background = t.accentLight}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
            Clear filters
          </button>
        )}
      </div>

      {/* Recent Searches */}
      {history.length > 0 && (
        <div style={{ background: t.surface, borderRadius: 12, border: `1px solid ${t.border}`, padding: 14 }}>
          <div style={{ fontWeight: 700, fontSize: 12, marginBottom: 10, color: t.text, letterSpacing: "0.5px", textTransform: "uppercase" }}>Recent Searches</div>
          {history.slice(0, 6).map((h, i) => (
            <div key={i} onClick={() => { handleSearch(h); setSidebarOpen(false); }}
              style={{ padding: "5px 0", cursor: "pointer", fontSize: 12, color: t.subtext, display: "flex", alignItems: "center", gap: 6, borderBottom: i < Math.min(history.length, 6) - 1 ? `1px solid ${t.border}` : "none", transition: "color 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.color = t.accent}
              onMouseLeave={e => e.currentTarget.style.color = t.subtext}>
              <span style={{ fontSize: 10 }}>⟳</span> {h}
            </div>
          ))}
          <button onClick={() => setHistory([])} style={{ marginTop: 8, fontSize: 11, color: t.subtext, background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: "inherit" }}>Clear all</button>
        </div>
      )}

      {/* DB Stats */}
      <div style={{ background: t.surface, borderRadius: 12, border: `1px solid ${t.border}`, padding: 14 }}>
        <div style={{ fontWeight: 700, fontSize: 12, marginBottom: 10, color: t.text, letterSpacing: "0.5px", textTransform: "uppercase" }}>Database</div>
        {[
          ["Total Medicines", MEDICINE_DB.length, "#2563eb"],
          ["Safe to Use", MEDICINE_DB.filter(m => m.risk === "LOW").length, "#059669"],
          ["Categories", categories.length, "#d97706"],
          ["Reviews", MEDICINE_DB.reduce((s, m) => s + m.reviews, 0).toLocaleString(), "#7c3aed"],
        ].map(([label, val, col]) => (
          <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7, fontSize: 12 }}>
            <span style={{ color: t.subtext }}>{label}</span>
            <span style={{ fontWeight: 800, color: col }}>{val}</span>
          </div>
        ))}
      </div>

      {/* Top Symptoms */}
      <div style={{ background: t.surface, borderRadius: 12, border: `1px solid ${t.border}`, padding: 14 }}>
        <div style={{ fontWeight: 700, fontSize: 12, marginBottom: 10, color: t.text, letterSpacing: "0.5px", textTransform: "uppercase" }}>Top Symptoms</div>
        {TOP_SYMPTOMS.slice(0, 8).map(([sym, count]) => (
          <div key={sym} onClick={() => { handleSearch(sym); setView("search"); setSidebarOpen(false); }}
            style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 0", cursor: "pointer", borderBottom: `1px solid ${t.border}`, fontSize: 12, transition: "color 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.color = t.accent}
            onMouseLeave={e => e.currentTarget.style.color = t.text}>
            <span style={{ color: t.text }}>{sym}</span>
            <span style={{ background: "#ede9fe", color: "#6d28d9", padding: "1px 7px", borderRadius: 10, fontSize: 10, fontWeight: 700 }}>{count}</span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ width: "100vw", height: "100vh", display: "flex", flexDirection: "column", background: t.bg, color: t.text, fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif", overflow: "hidden", boxSizing: "border-box" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* HEADER */}
      <header style={{ background: t.headerBg, borderBottom: `1px solid ${t.border}`, padding: isMobile ? "0 12px" : "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between", height: isMobile ? 54 : 60, flexShrink: 0, boxShadow: darkMode ? "0 1px 12px rgba(0,0,0,0.4)" : "0 1px 8px rgba(37,99,235,0.07)", zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {isMobile && (
            <button onClick={() => setSidebarOpen(o => !o)} style={{ background: "none", border: "none", cursor: "pointer", color: t.text, fontSize: 20, padding: "4px 6px", marginRight: 2, borderRadius: 6, lineHeight: 1 }}>
              ☰
            </button>
          )}
          <div style={{ background: "linear-gradient(135deg, #1d4ed8, #4f46e5)", width: 32, height: 32, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 16, flexShrink: 0 }}>A</div>
          <span style={{ fontWeight: 800, fontSize: isMobile ? 18 : 21, background: "linear-gradient(135deg, #1d4ed8, #4f46e5)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>AURA</span>
          {!isMobile && <span style={{ color: t.subtext, fontSize: 12, fontWeight: 500 }}>Medical Assistant</span>}
        </div>

        <div style={{ display: "flex", gap: isMobile ? 4 : 6, alignItems: "center" }}>
          {["search", "bookmarks", "insights"].map(v => (
            <button key={v} onClick={() => setView(v)}
              style={{ padding: isMobile ? "5px 10px" : "5px 14px", borderRadius: 20, border: "none", cursor: "pointer", fontFamily: "inherit", fontWeight: 600, fontSize: isMobile ? 11 : 12, background: view === v ? t.accent : "transparent", color: view === v ? "#fff" : t.subtext, transition: "all 0.15s", whiteSpace: "nowrap" }}>
              {v === "search" ? (isMobile ? "🔍" : "🔍 Search") : v === "bookmarks" ? (isMobile ? `🔖${bookmarks.length > 0 ? bookmarks.length : ""}` : `🔖 Saved (${bookmarks.length})`) : (isMobile ? "📊" : "📊 Insights")}
            </button>
          ))}
          <button onClick={() => setDarkMode(d => !d)}
            style={{ padding: isMobile ? "5px 8px" : "5px 12px", borderRadius: 20, border: `1px solid ${t.border}`, cursor: "pointer", fontFamily: "inherit", fontSize: isMobile ? 13 : 12, background: "transparent", color: t.text, marginLeft: 2 }}>
            {darkMode ? "☀️" : "🌙"}
          </button>
        </div>
      </header>

      {/* BODY */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden", position: "relative" }}>

        {/* MOBILE OVERLAY */}
        {isMobile && sidebarOpen && (
          <div onClick={() => setSidebarOpen(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 200 }} />
        )}

        {/* SIDEBAR */}
        {(isDesktop || isTablet) ? (
          <aside style={{ width: isTablet ? 220 : 260, flexShrink: 0, height: "100%", overflowY: "auto", padding: "16px 12px", borderRight: `1px solid ${t.border}`, background: t.surface, boxSizing: "border-box", scrollbarWidth: "thin" }}>
            <SidebarContent />
          </aside>
        ) : (
          <aside style={{ position: "absolute", top: 0, left: sidebarOpen ? 0 : "-105%", width: "82vw", maxWidth: 300, height: "100%", overflowY: "auto", padding: "16px 14px", background: t.surface, zIndex: 300, boxShadow: sidebarOpen ? "4px 0 24px rgba(0,0,0,0.2)" : "none", transition: "left 0.25s cubic-bezier(.4,0,.2,1)", boxSizing: "border-box" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <span style={{ fontWeight: 700, fontSize: 14, color: t.text }}>Filters & Search</span>
              <button onClick={() => setSidebarOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: t.subtext, fontSize: 18 }}>✕</button>
            </div>
            <SidebarContent />
          </aside>
        )}

        {/* MAIN CONTENT */}
        <main style={{ flex: 1, overflowY: "auto", padding: isMobile ? "12px 10px" : "16px 16px", minWidth: 0, scrollbarWidth: "thin" }}>
          {view === "search" && (
            <>
              {/* Top bar */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 6 }}>
                <div>
                  <span style={{ fontWeight: 700, fontSize: 14, color: t.text }}>
                    {loading ? "Searching..." : `${results.length} medicine${results.length !== 1 ? "s" : ""} found`}
                  </span>
                  {query && <span style={{ color: t.subtext, fontSize: 12, marginLeft: 6 }}>for "{query}"</span>}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 11, color: t.subtext }}>Page {page}/{totalPages || 1}</span>
                  <button onClick={() => {
                    const lines = [`AURA Report — ${new Date().toLocaleString()}`, `Query: "${query || "All"}"`, `Results: ${results.length}`, "", ...results.slice(0, 20).map((m, i) => `${i + 1}. ${m.name} (${m.brand}) — ${m.category} — Risk: ${m.risk}\n   ${m.dosage}\n   ${m.uses.join(", ")}\n`)];
                    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([lines.join("\n")], { type: "text/plain" })); a.download = `aura-${Date.now()}.txt`; a.click();
                  }} style={{ padding: "4px 10px", borderRadius: 8, border: `1px solid ${t.accent}`, cursor: "pointer", fontFamily: "inherit", fontSize: 11, background: "transparent", color: t.accent, fontWeight: 600 }}>⬇ Export</button>
                </div>
              </div>

              {/* Loading skeletons */}
              {loading && (
                <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${isMobile ? "100%" : "230px"}, 1fr))`, gap: 12 }}>
                  {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} style={{ background: t.card, borderRadius: 14, height: 170, border: `1px solid ${t.border}`, animation: "auraPulse 1.4s ease-in-out infinite", opacity: 0.6 }}>
                      <style>{`@keyframes auraPulse{0%,100%{opacity:0.6}50%{opacity:0.3}}`}</style>
                    </div>
                  ))}
                </div>
              )}

              {/* Cards Grid */}
              {!loading && (
                <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${isMobile ? "100%" : isTablet ? "200px" : "230px"}, 1fr))`, gap: isMobile ? 10 : 12 }}>
                  {paginatedResults.map(med => (
                    <MedicineCard key={med.id} med={med} t={t} bookmarks={bookmarks} toggleBookmark={toggleBookmark} onClick={() => setSelected(med)} />
                  ))}
                  {paginatedResults.length === 0 && (
                    <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "50px 20px", color: t.subtext }}>
                      <div style={{ fontSize: 44, marginBottom: 10 }}>🔍</div>
                      <div style={{ fontWeight: 700, fontSize: 17, color: t.text, marginBottom: 6 }}>No medicines found</div>
                      <div style={{ fontSize: 13 }}>Try different keywords or clear filters</div>
                    </div>
                  )}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && !loading && (
                <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 20, flexWrap: "wrap" }}>
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                    style={{ padding: "7px 14px", borderRadius: 9, border: `1px solid ${t.border}`, background: "transparent", color: t.text, fontFamily: "inherit", fontSize: 12, cursor: page === 1 ? "default" : "pointer", opacity: page === 1 ? 0.4 : 1 }}>← Prev</button>
                  {Array.from({ length: Math.min(totalPages, isMobile ? 5 : 7) }, (_, i) => i + 1).map(pg => (
                    <button key={pg} onClick={() => setPage(pg)}
                      style={{ padding: "7px 12px", borderRadius: 9, border: "none", background: page === pg ? t.accent : "transparent", color: page === pg ? "#fff" : t.text, fontFamily: "inherit", fontSize: 12, cursor: "pointer", fontWeight: page === pg ? 700 : 400, minWidth: 36 }}>{pg}</button>
                  ))}
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                    style={{ padding: "7px 14px", borderRadius: 9, border: `1px solid ${t.border}`, background: "transparent", color: t.text, fontFamily: "inherit", fontSize: 12, cursor: page === totalPages ? "default" : "pointer", opacity: page === totalPages ? 0.4 : 1 }}>Next →</button>
                </div>
              )}
            </>
          )}

          {view === "bookmarks" && (
            <div>
              <div style={{ fontWeight: 800, fontSize: 17, marginBottom: 16, color: t.text }}>🔖 Saved Medicines ({bookmarks.length})</div>
              {bookmarks.length === 0 ? (
                <div style={{ textAlign: "center", padding: 60, color: t.subtext }}>
                  <div style={{ fontSize: 44, marginBottom: 10 }}>🔖</div>
                  <div style={{ fontWeight: 700, fontSize: 17, color: t.text, marginBottom: 6 }}>No saved medicines</div>
                  <div style={{ fontSize: 13 }}>Tap ♡ on any card to save it here</div>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${isMobile ? "100%" : "230px"}, 1fr))`, gap: 12 }}>
                  {MEDICINE_DB.filter(m => bookmarks.includes(m.id)).map(med => (
                    <MedicineCard key={med.id} med={med} t={t} bookmarks={bookmarks} toggleBookmark={toggleBookmark} onClick={() => setSelected(med)} />
                  ))}
                </div>
              )}
            </div>
          )}

          {view === "insights" && (
            <InsightsPanel t={t} piData={piData} catData={catData} isMobile={isMobile} />
          )}
        </main>

        {/* RIGHT PANEL — desktop only */}
        {isDesktop && (
          <aside style={{ width: 220, flexShrink: 0, height: "100%", overflowY: "auto", padding: "16px 12px", borderLeft: `1px solid ${t.border}`, background: t.surface, boxSizing: "border-box", scrollbarWidth: "thin" }}>
            <div style={{ fontWeight: 700, fontSize: 12, marginBottom: 10, color: t.text, letterSpacing: "0.5px", textTransform: "uppercase" }}>Risk Overview</div>
            <ResponsiveContainer width="100%" height={130}>
              <PieChart>
                <Pie data={piData} cx="50%" cy="50%" innerRadius={30} outerRadius={55} dataKey="value">
                  {piData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 8, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 16 }}>
              {piData.map(d => (
                <span key={d.name} style={{ fontSize: 10, display: "flex", alignItems: "center", gap: 3, color: t.subtext }}>
                  <span style={{ width: 8, height: 8, borderRadius: 2, background: d.color, display: "inline-block" }}></span>{d.name}
                </span>
              ))}
            </div>

            <div style={{ fontWeight: 700, fontSize: 12, marginBottom: 10, color: t.text, letterSpacing: "0.5px", textTransform: "uppercase" }}>Categories</div>
            {TOP_CATEGORIES.slice(0, 8).map(([cat, count]) => (
              <div key={cat} onClick={() => { setFilters(f => ({ ...f, category: cat })); setView("search"); }}
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 0", cursor: "pointer", borderBottom: `1px solid ${t.border}`, fontSize: 11, transition: "color 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.color = t.accent}
                onMouseLeave={e => e.currentTarget.style.color = t.text}>
                <span style={{ flex: 1, paddingRight: 4, color: t.text, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{cat}</span>
                <span style={{ background: "#dbeafe", color: "#1e40af", padding: "1px 6px", borderRadius: 10, fontSize: 10, fontWeight: 700, flexShrink: 0 }}>{count}</span>
              </div>
            ))}
          </aside>
        )}
      </div>

      {/* MODAL */}
      {selected && (
        <div onClick={() => setSelected(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: isMobile ? 10 : 20 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: t.surface, borderRadius: 18, maxWidth: 560, width: "100%", maxHeight: "88vh", overflow: "auto", padding: isMobile ? 18 : 26, position: "relative", boxShadow: "0 24px 64px rgba(0,0,0,0.3)", scrollbarWidth: "thin" }}>
            <button onClick={() => setSelected(null)} style={{ position: "absolute", top: 14, right: 14, background: t.accentLight, border: "none", width: 30, height: 30, borderRadius: "50%", fontSize: 16, cursor: "pointer", color: t.subtext, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>✕</button>

            <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 18 }}>
              <div style={{ width: 50, height: 50, borderRadius: 14, background: "linear-gradient(135deg, #1d4ed8, #4f46e5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>💊</div>
              <div>
                <h2 style={{ margin: "0 0 2px", fontWeight: 800, fontSize: 20, color: t.text }}>{selected.name}</h2>
                <div style={{ color: t.subtext, fontSize: 13 }}>{selected.brand} · {selected.manufacturer}</div>
                <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
                  {riskBadge(selected.risk)}
                  <span style={{ background: "#ede9fe", color: "#5b21b6", padding: "2px 9px", borderRadius: 20, fontSize: 11, fontWeight: 700 }}>{selected.category}</span>
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
              {[["⭐ Rating", <Stars rating={selected.rating} />], ["📋 Reviews", selected.reviews.toLocaleString()], ["💊 Category", selected.category], ["🏭 Maker", selected.manufacturer || "N/A"]].map(([label, val]) => (
                <div key={label} style={{ background: darkMode ? "#0f172a" : "#f8faff", borderRadius: 9, padding: 11, border: `1px solid ${t.border}` }}>
                  <div style={{ fontSize: 11, color: t.subtext, marginBottom: 3 }}>{label}</div>
                  <div style={{ fontWeight: 600, fontSize: 13, color: t.text }}>{val}</div>
                </div>
              ))}
            </div>

            {[["🩺 Used For", selected.uses.join(" · ")], ["💉 Dosage", selected.dosage]].map(([label, val]) => (
              <div key={label} style={{ marginBottom: 13 }}>
                <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 5, color: t.text }}>{label}</div>
                <div style={{ fontSize: 13, color: t.subtext, lineHeight: 1.6, background: darkMode ? "#0a0f1e" : "#f8faff", borderRadius: 9, padding: 11, border: `1px solid ${t.border}` }}>{val}</div>
              </div>
            ))}

            <div style={{ marginBottom: 14 }}>
              <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 7, color: t.text }}>⚠️ Side Effects</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {selected.sideEffects.map((se, i) => (
                  <span key={i} style={{ background: "#fef2f2", color: "#991b1b", padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 500, border: "1px solid #fecaca" }}>{se}</span>
                ))}
              </div>
            </div>

            <div style={{ padding: 13, borderRadius: 10, background: selected.risk === "HIGH" ? "#fef2f2" : selected.risk === "MEDIUM" ? "#fffbeb" : "#ecfdf5", border: `1px solid ${RISK_COLORS[selected.risk]}40`, fontSize: 12, color: t.text, lineHeight: 1.5 }}>
              <strong>⚕️ Clinical Note:</strong>{" "}
              {selected.risk === "HIGH" ? "This medicine requires close medical supervision. Do not self-medicate." : selected.risk === "MEDIUM" ? "Use with caution. Consult your doctor before use." : "Generally safe and well-tolerated. Still consult a healthcare provider."}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── MEDICINE CARD ────────────────────────────────────────────────────────────
function MedicineCard({ med, t, bookmarks, toggleBookmark, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ background: t.card, border: `1px solid ${hovered ? t.accent : t.border}`, borderRadius: 14, padding: 15, cursor: "pointer", transition: "all 0.18s", transform: hovered ? "translateY(-2px)" : "none", boxShadow: hovered ? `0 8px 28px rgba(37,99,235,0.12)` : "0 1px 4px rgba(0,0,0,0.04)", position: "relative", minHeight: 150 }}>
      <button onClick={e => { e.stopPropagation(); toggleBookmark(med.id); }}
        style={{ position: "absolute", top: 12, right: 12, background: bookmarks.includes(med.id) ? "#eff4ff" : "transparent", border: bookmarks.includes(med.id) ? `1px solid ${t.accent}` : "none", borderRadius: 8, width: 28, height: 28, cursor: "pointer", fontSize: 15, color: bookmarks.includes(med.id) ? t.accent : t.subtext, transition: "all 0.15s", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {bookmarks.includes(med.id) ? "♥" : "♡"}
      </button>

      <div style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 10 }}>
        <div style={{ width: 38, height: 38, borderRadius: 10, background: "linear-gradient(135deg, #dbeafe, #ede9fe)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>💊</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: t.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", paddingRight: 30 }}>{med.name}</div>
          <div style={{ color: t.subtext, fontSize: 11, marginTop: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{med.brand}</div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 9 }}>
        {riskBadge(med.risk)}
        <span style={{ background: "#ede9fe", color: "#5b21b6", padding: "2px 9px", borderRadius: 20, fontSize: 11, fontWeight: 600 }}>{med.category}</span>
      </div>

      <div style={{ fontSize: 11, color: t.subtext, marginBottom: 10, lineHeight: 1.5 }}>
        <span style={{ fontWeight: 600, color: t.text }}>For:</span>{" "}
        {med.uses.slice(0, 3).join(", ")}{med.uses.length > 3 ? ` +${med.uses.length - 3}` : ""}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Stars rating={med.rating} />
        <span style={{ fontSize: 10, color: t.subtext }}>{med.reviews.toLocaleString()} reviews</span>
      </div>
    </div>
  );
}

// ─── INSIGHTS PANEL ───────────────────────────────────────────────────────────
function InsightsPanel({ t, piData, catData, isMobile }) {
  const avgRating = (MEDICINE_DB.reduce((s, m) => s + m.rating, 0) / MEDICINE_DB.length).toFixed(1);
  const totalReviews = MEDICINE_DB.reduce((s, m) => s + m.reviews, 0);

  return (
    <div>
      <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 18, color: t.text }}>📊 Database Insights</div>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4,1fr)", gap: 10, marginBottom: 16 }}>
        {[
          ["Total", MEDICINE_DB.length, "💊", "#2563eb"],
          ["Safe", MEDICINE_DB.filter(m => m.risk === "LOW").length, "✓", "#059669"],
          ["Avg Rating", avgRating, "⭐", "#d97706"],
          ["Reviews", (totalReviews / 1000).toFixed(1) + "K", "📋", "#7c3aed"],
        ].map(([label, val, icon, col]) => (
          <div key={label} style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 12, padding: "12px 10px", textAlign: "center" }}>
            <div style={{ fontSize: 20, marginBottom: 3 }}>{icon}</div>
            <div style={{ fontWeight: 800, fontSize: 20, color: col }}>{val}</div>
            <div style={{ fontSize: 11, color: t.subtext, marginTop: 2 }}>{label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 14, marginBottom: 14 }}>
        <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 14, padding: 18 }}>
          <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 14, color: t.text }}>Risk Distribution</div>
          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie data={piData} cx="50%" cy="50%" innerRadius={35} outerRadius={62} dataKey="value" label={({ name, value }) => `${name}: ${value}`} labelLine={false} fontSize={10}>
                {piData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 6 }}>
            {piData.map(d => <span key={d.name} style={{ fontSize: 10, color: t.subtext, display: "flex", alignItems: "center", gap: 3 }}><span style={{ width: 8, height: 8, borderRadius: 2, background: d.color, display: "inline-block" }}></span>{d.name}</span>)}
          </div>
        </div>

        <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 14, padding: 18 }}>
          <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 14, color: t.text }}>Top Categories</div>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={catData} layout="vertical" margin={{ left: 0, right: 10 }}>
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: t.subtext }} width={65} />
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="count" fill="#4f46e5" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 14, padding: 18 }}>
        <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 12, color: t.text }}>Most Covered Symptoms</div>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(3,1fr)", gap: 8 }}>
          {TOP_SYMPTOMS.map(([sym, count]) => (
            <div key={sym} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "5px 0", borderBottom: `1px solid ${t.border}`, fontSize: 12 }}>
              <span style={{ color: t.text, textTransform: "capitalize" }}>{sym}</span>
              <span style={{ fontWeight: 700, color: "#4f46e5", fontSize: 11 }}>{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}