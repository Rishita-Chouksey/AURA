# AURA Backend Integration Guide

## Overview
This frontend is now connected to the AURA backend for analyzing medical text data for sentiment, risk levels, and entity extraction.

## Backend Repository
Your team's backend: https://github.com/SHREYA08006/AURA

## Setup Instructions

### 1. Environment Configuration
The `.env.local` file has been created with the backend URL. Update it if needed:

```
REACT_APP_BACKEND_URL=http://localhost:5000
```

Change the URL based on where your backend is running (local development, staging, production).

### 2. Starting the Backend
Before running the frontend, ensure your backend is running:

```bash
# Clone the backend if not done yet
git clone https://github.com/SHREYA08006/AURA.git

# Install dependencies and run (follow the backend's README)
cd AURA
pip install -r requirements.txt
python app.py  # or whatever the startup command is
```

The backend should be accessible at `http://localhost:5000` (or your configured URL).

### 3. Running the Frontend
```bash
npm run dev
```

The frontend will connect to your backend via the API service.

## API Service Usage

### Available API Functions

#### AURA Analysis Functions
```javascript
import { auraAPI } from './api';

// Analyze single text
const result = await auraAPI.analyzeText("Text to analyze");

// Batch analysis
const results = await auraAPI.batchAnalyze(["text1", "text2"]);

// Get risk assessment
const risk = await auraAPI.getRiskAssessment("Text with side effects");

// Extract entities (drugs, symptoms, etc.)
const entities = await auraAPI.extractEntities("Text content");

// Get sentiment analysis
const sentiment = await auraAPI.getSentiment("Text");

// Get alerts
const alerts = await auraAPI.getAlerts('HIGH');

// Get report
const report = await auraAPI.getReport();
```

#### Patient Management Functions
```javascript
import { patientAPI } from './api';

// Get all patients
const patients = await patientAPI.getPatients();

// Get single patient
const patient = await patientAPI.getPatient('P-0041');

// Add new patient
const newPatient = await patientAPI.addPatient({
  name: 'John Doe',
  age: 35,
  symptoms: ['headache', 'fever']
});

// Update patient
const updated = await patientAPI.updatePatient('P-0041', {
  status: 'Monitoring'
});

// Delete patient
await patientAPI.deletePatient('P-0041');

// Get patient analysis
const analysis = await patientAPI.getPatientAnalysis('P-0041');
```

#### Health Check
```javascript
import { healthAPI } from './api';

// Check backend health
const health = await healthAPI.getHealth();

// Get statistics
const stats = await healthAPI.getStats();
```

### Using the useAPI Hook in Components

```javascript
import { useAPI } from './hooks/useAPI';
import { auraAPI } from './api';

function MyComponent() {
  const { loading, error, data, request } = useAPI();

  const handleAnalyze = async () => {
    try {
      const result = await request(auraAPI.analyzeText, "Sample text");
      console.log('Analysis result:', result);
    } catch (err) {
      console.error('Analysis failed:', err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <button onClick={handleAnalyze}>Analyze</button>
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
}
```

## Frontend Features

### Light Theme
✓ UI converted to light theme with better readability
✓ Updated colors: light background (#f8fafc), dark text (#1e293b)
✓ Professional appearance suitable for healthcare dashboard

### Patient Monitoring
- Real-time risk assessment
- Sentiment analysis of patient feedback
- Entity extraction for drugs and symptoms
- Alert system for high-risk cases
- Patient statistics and reporting

## Backend Expected Response Format

The backend should return responses in this format:

```json
{
  "status": "success",
  "data": {
    "sentiment": "NEGATIVE",
    "risk_level": "HIGH",
    "risk_score": 2,
    "entities": [
      {"text": "headache", "label": "SYMPTOM"},
      {"text": "nausea", "label": "SYMPTOM"}
    ]
  },
  "message": "Analysis complete"
}
```

## Troubleshooting

### Backend Connection Issues
1. Ensure backend is running on the configured URL
2. Check CORS settings on backend (should allow requests from frontend)
3. Verify `.env.local` has correct `REACT_APP_BACKEND_URL`
4. Check browser console for detailed error messages

### CORS Errors
If you see CORS errors, the backend needs to handle CORS:
```python
# Backend should include CORS headers or use Flask-CORS
from flask_cors import CORS
CORS(app)
```

## Next Steps
1. ✓ Backend integrated
2. ✓ Light theme applied
3. Replace mock data with real backend calls
4. Update components to use `auraAPI` functions
5. Implement real-time updates
6. Add authentication if needed

## Support
For backend issues, refer to: https://github.com/SHREYA08006/AURA
