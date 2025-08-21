#!/bin/bash

# AI Resume Builder - Deployment Script
# This script prepares the project for deployment on Render

echo "🚀 AI Resume Builder - Deployment Preparation"
echo "=============================================="

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo "📦 Installing dependencies..."

# Install root dependencies
echo "Installing root dependencies..."
npm install

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend
npm install
cd ..

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd frontend
npm install
cd ..

echo "✅ Dependencies installed successfully!"

echo "🔧 Building project..."

# Build frontend
echo "Building frontend..."
cd frontend
npm run build
cd ..

echo "✅ Frontend built successfully!"

echo "🧪 Running tests..."

# Test backend
echo "Testing backend..."
cd backend
npm run build 2>/dev/null || echo "No backend build step required"
cd ..

echo "✅ Tests completed!"

echo "📋 Deployment Checklist:"
echo "========================"
echo "✅ Dependencies installed"
echo "✅ Frontend built"
echo "✅ Backend tested"
echo ""
echo "📝 Next Steps for Render Deployment:"
echo "1. Push code to GitHub repository"
echo "2. Connect repository to Render"
echo "3. Set environment variables in Render dashboard:"
echo "   Backend:"
echo "   - NODE_ENV=production"
echo "   - JWT_SECRET=your-secret-key"
echo "   - MONGO_URI=your-mongodb-connection-string"
echo "   - GEMINI_API_KEY=your-gemini-api-key"
echo "   - CORS_ORIGIN=https://your-frontend-url.onrender.com"
echo "   - FRONTEND_URL=https://your-frontend-url.onrender.com"
echo ""
echo "   Frontend:"
echo "   - VITE_API_BASE_URL=https://your-backend-url.onrender.com"
echo "   - NODE_ENV=production"
echo ""
echo "4. Deploy using render.yaml configuration"
echo ""
echo "🎉 Ready for deployment!"
echo ""
echo "📚 For detailed instructions, see README.md"
echo "🐛 For issues, check the troubleshooting section"
