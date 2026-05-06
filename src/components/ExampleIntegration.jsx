/**
 * Example Component: PatientAnalysisExample.jsx
 * This shows how to integrate backend API calls into React components
 * 
 * Copy this pattern to update existing components to use real backend data
 */

import { useState, useEffect } from 'react';
import { auraAPI, patientAPI } from '../api';
import { useAPI } from '../hooks/useAPI';

export const PatientAnalysisExample = ({ patientId }) => {
  const { loading, error, data: analysis, request } = useAPI();
  const [patient, setPatient] = useState(null);

  // Fetch patient and analysis on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get patient details
        const patientData = await request(patientAPI.getPatient, patientId);
        setPatient(patientData);

        // Get patient analysis
        await request(patientAPI.getPatientAnalysis, patientId);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      }
    };

    if (patientId) {
      fetchData();
    }
  }, [patientId, request]);

  // Example: Analyze patient symptoms
  const handleAnalyzeSymptoms = async () => {
    try {
      if (patient?.symptoms?.length) {
        const symptomText = patient.symptoms.join(' ');
        await request(auraAPI.analyzeText, symptomText);
      }
    } catch (err) {
      console.error('Analysis failed:', err);
    }
  };

  if (loading) {
    return <div className="loading">Fetching patient data...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="patient-analysis">
      <h2>Patient Analysis</h2>

      {patient && (
        <div className="patient-info">
          <p>Name: {patient.name}</p>
          <p>Age: {patient.age}</p>
          <p>Risk Level: {patient.risk}</p>
        </div>
      )}

      {analysis && (
        <div className="analysis-results">
          <h3>Analysis Results</h3>
          <pre>{JSON.stringify(analysis, null, 2)}</pre>
        </div>
      )}

      <button onClick={handleAnalyzeSymptoms} disabled={loading}>
        {loading ? 'Analyzing...' : 'Analyze Symptoms'}
      </button>
    </div>
  );
};

// Example: Batch Analysis Component
export const BatchAnalysisExample = () => {
  const { loading, error, data: results, request } = useAPI();
  const [texts, setTexts] = useState([]);

  const handleBatchAnalyze = async () => {
    try {
      await request(auraAPI.batchAnalyze, texts);
    } catch (err) {
      console.error('Batch analysis failed:', err);
    }
  };

  return (
    <div className="batch-analysis">
      <h2>Batch Analysis</h2>
      
      <textarea
        placeholder="Enter texts separated by newlines..."
        value={texts.join('\n')}
        onChange={(e) => setTexts(e.target.value.split('\n'))}
        disabled={loading}
      />

      <button onClick={handleBatchAnalyze} disabled={loading || texts.length === 0}>
        {loading ? 'Analyzing...' : 'Analyze All'}
      </button>

      {error && <p className="error">{error}</p>}

      {results && (
        <div className="results">
          <h3>Results</h3>
          {results.map((result, idx) => (
            <div key={idx} className="result-item">
              <p>Risk Level: {result.risk_level}</p>
              <p>Sentiment: {result.sentiment}</p>
              <p>Risk Score: {result.risk_score}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Example: Alerts Component
export const AlertsExample = () => {
  const { loading, error, data: alerts, request } = useAPI();

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        await request(auraAPI.getAlerts, 'HIGH');
      } catch (err) {
        console.error('Failed to fetch alerts:', err);
      }
    };

    fetchAlerts();
    
    // Refresh alerts every 30 seconds
    const interval = setInterval(fetchAlerts, 30000);
    return () => clearInterval(interval);
  }, [request]);

  if (loading) return <div>Loading alerts...</div>;
  if (error) return <div>Error loading alerts: {error}</div>;

  return (
    <div className="alerts-container">
      <h2>High Risk Alerts ({alerts?.length || 0})</h2>
      {alerts && alerts.map((alert, idx) => (
        <div key={idx} className="alert-item">
          <span className="alert-icon">⚠️</span>
          <p>{alert.text}</p>
          <p className="risk-score">Risk Score: {alert.risk_score}</p>
        </div>
      ))}
    </div>
  );
};
