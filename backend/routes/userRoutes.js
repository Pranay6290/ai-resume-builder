import express from 'express';
import { registerUser , loginUser , getUserProfile } from '../controllers/UserController.js';
import { protect } from '../middleware/authMiddleware.js';

const userRouter = express.Router();

// Explicit OPTIONS handlers for CORS preflight
userRouter.options('/register', (req, res) => {
  res.status(200).end();
});

userRouter.options('/login', (req, res) => {
  res.status(200).end();
});

userRouter.options('/profile', (req, res) => {
  res.status(200).end();
});

// Auth routes
userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);

//protected route as token will be required
userRouter.get('/profile', protect, getUserProfile);

export default userRouter;