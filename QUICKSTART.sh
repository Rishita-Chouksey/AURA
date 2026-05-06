#!/bin/bash
# AURA Dashboard - Quick Start Commands
# Copy and paste these commands to get started quickly

# ================================
# 1. SET UP BACKEND
# ================================
echo "Step 1: Setting up backend..."

# Clone backend repository (if not already done)
cd ..
git clone https://github.com/SHREYA08006/AURA.git

# Navigate to backend
cd AURA

# Install Python dependencies
pip install -r requirements.txt

# Start the backend (runs on http://localhost:5000)
python app.py

# Keep terminal open - backend must stay running

# ================================
# In a NEW terminal:
# 2. SET UP FRONTEND
# ================================
echo "Step 2: Setting up frontend..."

# Navigate to Auradashboard directory
cd ../Auradashboard

# Install Node dependencies (already done, but just in case)
npm install

# (Optional) Check that .env.local is configured correctly
# cat .env.local  # Should show REACT_APP_BACKEND_URL=http://localhost:5000

# Start development server (runs on http://localhost:5173)
npm run dev

# ================================
# 3. ACCESS DASHBOARD
# ================================
echo "Step 3: Open dashboard..."
echo "Open browser to: http://localhost:5173"

# ================================
# For Production Build
# ================================
echo "To build for production:"
echo "npm run build"
echo "Output files will be in: dist/"

# ================================
# Common Commands
# ================================
echo "
Common Commands:
  npm run dev       - Start development server
  npm run build     - Build for production
  npm run preview   - Preview production build
  npm run lint      - Run ESLint

Backend Status:
  Check: curl http://localhost:5000/health
"
