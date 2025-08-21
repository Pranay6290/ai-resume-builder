import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { connectDB } from './config/db.js';
import userRouter from './routes/userRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';
import resumeRoutes from './routes/resumeRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 4000;

// Enhanced CORS configuration for production deployment
const corsOptions = {
  origin: function (origin, callback) {
    console.log('CORS Origin Check:', origin); // Debug log

    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:3000',
      'https://localhost:5173',
      'https://localhost:5174',
      process.env.CORS_ORIGIN,
      process.env.FRONTEND_URL,
      // Add your deployed frontend URLs here
      'https://ai-resume-builder-2-pqet.onrender.com',
    ].filter(Boolean); // Remove undefined values

    console.log('Allowed Origins:', allowedOrigins); // Debug log

    if (allowedOrigins.indexOf(origin) !== -1) {
      console.log('✅ CORS: Origin allowed:', origin);
      callback(null, true);
    } else {
      // In development, allow all origins
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ CORS: Development mode - allowing origin:', origin);
        callback(null, true);
      } else {
        console.log('❌ CORS: Origin blocked:', origin);
        callback(new Error('Not allowed by CORS'));
      }
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'x-auth-token',
    'Origin',
    'X-Requested-With',
    'Accept'
  ],
  exposedHeaders: ['x-auth-token']
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Handle preflight requests explicitly
app.options('*', cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// connect db
connectDB();

// routes
app.use('/api/auth', userRouter);   // ✅ now matches frontend expectation
app.use('/api/resumes', resumeRoutes);

// ✅ serve uploads folder correctly
app.use(
  '/uploads',
  express.static(path.join(__dirname, 'uploads'), {
    setHeaders: (res) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
    },
  })
);

// Health check route
app.get('/', (_, res) => {
  res.json({
    message: 'AI Resume Builder API is running!',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API health check
app.get('/health', (_, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Global error handler
app.use((err, _req, res, _next) => {
  console.error('Global error handler:', err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (_, res) => {
  res.status(404).json({
    message: 'Route not found',
    availableRoutes: [
      'GET /',
      'GET /health',
      'POST /api/auth/register',
      'POST /api/auth/login',
      'GET /api/resumes',
      'POST /api/resumes'
    ]
  });
});

// ✅ only ONE listen
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
