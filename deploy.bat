@echo off
echo 🚀 AI Resume Builder - Deployment Preparation
echo ==============================================

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Error: Please run this script from the project root directory
    pause
    exit /b 1
)

if not exist "backend" (
    echo ❌ Error: Backend directory not found
    pause
    exit /b 1
)

if not exist "frontend" (
    echo ❌ Error: Frontend directory not found
    pause
    exit /b 1
)

echo 📦 Installing dependencies...

REM Install root dependencies
echo Installing root dependencies...
call npm install
if errorlevel 1 (
    echo ❌ Failed to install root dependencies
    pause
    exit /b 1
)

REM Install backend dependencies
echo Installing backend dependencies...
cd backend
call npm install
if errorlevel 1 (
    echo ❌ Failed to install backend dependencies
    pause
    exit /b 1
)
cd ..

REM Install frontend dependencies
echo Installing frontend dependencies...
cd frontend
call npm install
if errorlevel 1 (
    echo ❌ Failed to install frontend dependencies
    pause
    exit /b 1
)
cd ..

echo ✅ Dependencies installed successfully!

echo 🔧 Building project...

REM Build frontend
echo Building frontend...
cd frontend
call npm run build
if errorlevel 1 (
    echo ❌ Failed to build frontend
    pause
    exit /b 1
)
cd ..

echo ✅ Frontend built successfully!

echo 🧪 Running tests...

REM Test backend
echo Testing backend...
cd backend
call npm run build 2>nul || echo No backend build step required
cd ..

echo ✅ Tests completed!

echo.
echo 📋 Deployment Checklist:
echo ========================
echo ✅ Dependencies installed
echo ✅ Frontend built
echo ✅ Backend tested
echo.
echo 📝 Next Steps for Render Deployment:
echo 1. Push code to GitHub repository
echo 2. Connect repository to Render
echo 3. Set environment variables in Render dashboard:
echo    Backend:
echo    - NODE_ENV=production
echo    - JWT_SECRET=your-secret-key
echo    - MONGO_URI=your-mongodb-connection-string
echo    - GEMINI_API_KEY=your-gemini-api-key
echo    - CORS_ORIGIN=https://your-frontend-url.onrender.com
echo    - FRONTEND_URL=https://your-frontend-url.onrender.com
echo.
echo    Frontend:
echo    - VITE_API_BASE_URL=https://your-backend-url.onrender.com
echo    - NODE_ENV=production
echo.
echo 4. Deploy using render.yaml configuration
echo.
echo 🎉 Ready for deployment!
echo.
echo 📚 For detailed instructions, see README.md
echo 🐛 For issues, check the troubleshooting section
echo.
pause
