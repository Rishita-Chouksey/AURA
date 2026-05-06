
# AURA - Agentic Unified Risk Analyzer

A modern, responsive dashboard for monitoring and analyzing medical data using the AURA system.

## 🎨 Features

- **Light Theme UI**: Clean, professional light interface for better readability
- **Real-time Analytics**: Sentiment analysis, risk detection, and entity extraction
- **Patient Monitoring**: Track patient risk levels and health status
- **Backend Integration**: Connected to the AURA Python backend
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Interactive Charts**: Visualize medical data with Recharts
- **Alert System**: Real-time alerts for high-risk cases

## 🚀 Quick Start

### Installation

1. **Clone this repository**
```bash
git clone <this-repo-url>
cd Auradashboard
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure backend URL**
Edit `.env.local` and set your backend URL:
```
REACT_APP_BACKEND_URL=http://localhost:5000
```

4. **Start the development server**
```bash
npm run dev
```

## 🎞️ The dashboard is available at

For local host :- `http://localhost:5173`

Deployed link :- `https://darling-lamington-f0efcb.netlify.app/`

## 📚 Project Structure

```
Auradashboard/
├── src/
│   ├── components/         # Reusable React components
│   ├── hooks/             # Custom React hooks (useAPI)
│   ├── api.js             # Backend API service
│   ├── App.jsx            # Main dashboard component
│   ├── App.css            # App styles
│   ├── main.jsx           # Entry point
│   └── index.css          # Global styles
├── public/                 # Static files
├── .env.local             # Environment configuration
├── package.json           # Dependencies
├── vite.config.js         # Vite configuration
└── BACKEND_INTEGRATION.md # Backend integration guide
```

## 🔗 Backend Integration

The dashboard is fully integrated with the AURA backend. See [BACKEND_INTEGRATION.md](./BACKEND_INTEGRATION.md) for:
- Setup instructions
- API endpoint documentation
- Usage examples
- Troubleshooting guide

### Backend Repository
https://github.com/SHREYA08006/AURA

## 🎯 Key Technologies

- **React 19**: UI framework
- **Vite**: Fast build tool and dev server
- **Recharts**: Chart visualization
- **Axios**: HTTP client for backend calls
- **Modern CSS**: Light theme with smooth animations

## 📖 Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run ESLint
npm lint
```

## 🛠️ API Usage

Import and use the API service in your components:

```javascript
import { auraAPI } from './api';
import { useAPI } from './hooks/useAPI';

function MyComponent() {
  const { loading, data, request } = useAPI();

  const handleAnalyze = async () => {
    const result = await request(auraAPI.analyzeText, "Patient feedback");
  };

  return <button onClick={handleAnalyze}>Analyze</button>;
}
```

## 🚨 Alerts

Real-time alert system for high-risk patient cases:
- ⚠️ HIGH RISK: Immediate attention required
- ◉ MEDIUM RISK: Monitor closely
- ✓ LOW RISK: Stable status

## 📊 Dashboard Sections

- **Patient List**: View all monitored patients
- **Risk Overview**: Risk distribution visualization
- **Sentiment Analysis**: Analyze patient feedback sentiment
- **Alerts**: High-risk case alerts
- **Statistics**: Key metrics and KPIs

## 📝 License

This project is part of the AURA medical analysis system.
