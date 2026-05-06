@echo off
REM AURA Dashboard - Quick Start Commands for Windows
REM Copy and paste these commands to get started quickly

echo.
echo ================================
echo Step 1: SETUP BACKEND
echo ================================
echo.
echo Clone backend repository (if not already done):
echo   cd ..
echo   git clone https://github.com/SHREYA08006/AURA.git
echo.
echo Navigate to backend:
echo   cd AURA
echo.
echo Install Python dependencies:
echo   pip install -r requirements.txt
echo.
echo Start the backend (runs on http://localhost:5000):
echo   python app.py
echo.
echo IMPORTANT: Keep this terminal window open - backend must stay running!
echo.

echo ================================
echo Step 2: SETUP FRONTEND (New Terminal)
echo ================================
echo.
echo Navigate to Auradashboard directory:
echo   cd ..\Auradashboard
echo.
echo Install Node dependencies (already done, but just in case):
echo   npm install
echo.
echo Start development server (runs on http://localhost:5173):
echo   npm run dev
echo.

echo ================================
echo Step 3: ACCESS DASHBOARD
echo ================================
echo.
echo Open your browser to: http://localhost:5173
echo.

echo ================================
echo Common Commands
echo ================================
echo.
echo npm run dev       - Start development server
echo npm run build     - Build for production
echo npm run preview   - Preview production build
echo npm run lint      - Run ESLint
echo.

echo ================================
echo Configuration
echo ================================
echo.
echo Backend URL is configured in: .env.local
echo Default: REACT_APP_BACKEND_URL=http://localhost:5000
echo.
echo If backend is on different port, update .env.local accordingly
echo.

echo ================================
echo Troubleshooting
echo ================================
echo.
echo If backend connection fails:
echo   1. Ensure backend is running and accessible
echo   2. Check .env.local has correct REACT_APP_BACKEND_URL
echo   3. Check browser console for errors
echo   4. Verify CORS is enabled in backend
echo.

pause
