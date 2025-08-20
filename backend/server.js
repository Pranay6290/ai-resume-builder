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
const port = 4000;

app.use(cors());
app.use(express.json());

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
