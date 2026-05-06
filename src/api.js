import axios from 'axios';

// Backend API base URL - Update this with your backend URL
const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to handle errors
api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

// Add response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// AURA Pipeline Endpoints
export const auraAPI = {
  // Analyze text for sentiment, risk, entities
  analyzeText: (text) => api.post('/api/analyze', { text }),
  
  // Batch analysis
  batchAnalyze: (texts) => api.post('/api/batch-analyze', { texts }),
  
  // Get risk assessment
  getRiskAssessment: (text) => api.post('/api/risk-assess', { text }),
  
  // Extract entities
  extractEntities: (text) => api.post('/api/entities', { text }),
  
  // Get sentiment analysis
  getSentiment: (text) => api.post('/api/sentiment', { text }),
  
  // Get alerts
  getAlerts: (riskLevel = 'HIGH') => api.get(`/api/alerts?risk=${riskLevel}`),
  
  // Get report/summary
  getReport: () => api.get('/api/report'),
};

// Patient Management Endpoints
export const patientAPI = {
  // Get all patients
  getPatients: () => api.get('/api/patients'),
  
  // Get patient by ID
  getPatient: (id) => api.get(`/api/patients/${id}`),
  
  // Add patient
  addPatient: (data) => api.post('/api/patients', data),
  
  // Update patient
  updatePatient: (id, data) => api.put(`/api/patients/${id}`, data),
  
  // Delete patient
  deletePatient: (id) => api.delete(`/api/patients/${id}`),
  
  // Get patient analysis
  getPatientAnalysis: (id) => api.get(`/api/patients/${id}/analysis`),
};

// Health Status Endpoints
export const healthAPI = {
  // Get system health
  getHealth: () => api.get('/api/health'),
  
  // Get statistics
  getStats: () => api.get('/api/stats'),
};

export default api;
