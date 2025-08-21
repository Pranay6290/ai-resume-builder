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

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
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

// default route
app.get('/', (req, res) => {
  res.send('API WORKING');
});

// ✅ only ONE listen
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
