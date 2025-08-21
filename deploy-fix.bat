@echo off
echo 🚀 Deploying CORS and Authentication Fixes
echo ==========================================

echo 📝 Changes Applied:
echo ✅ Enhanced CORS configuration with explicit OPTIONS handling
echo ✅ Fixed frontend auth header from Bearer to x-auth-token
echo ✅ Added comprehensive debugging and logging
echo ✅ Increased axios timeout for Render cold starts
echo ✅ Added explicit OPTIONS route handlers
echo.

echo 📦 Building and testing locally...
cd frontend
call npm run build
if errorlevel 1 (
    echo ❌ Frontend build failed
    pause
    exit /b 1
)
cd ..

echo ✅ Frontend build successful!
echo.

echo 🔍 Running backend tests...
node test-backend.js

echo.
echo 🎯 Ready to deploy!
echo.
echo 📝 Next Steps:
echo 1. Push code to GitHub: git add . && git commit -m "Fix: CORS and auth issues" && git push
echo 2. Redeploy backend service on Render
echo 3. Redeploy frontend service on Render
echo 4. Test login/signup functionality
echo.
echo 🔧 Environment Variables to Verify in Render:
echo.
echo Backend Service:
echo - NODE_ENV=production
echo - JWT_SECRET=hexa123
echo - MONGO_URI=mongodb+srv://fukrainsaan0707:resume123@cluster0.mlha9ew.mongodb.net/RESUME
echo - GEMINI_API_KEY=AIzaSyCWM-kQL3SFV32HcaEtGSjbfbqDEvorI5o
echo - CORS_ORIGIN=https://ai-resume-builder-2-pqet.onrender.com
echo - FRONTEND_URL=https://ai-resume-builder-2-pqet.onrender.com
echo.
echo Frontend Service:
echo - VITE_API_BASE_URL=https://ai-resume-builder-5qok.onrender.com
echo - NODE_ENV=production
echo.
pause
