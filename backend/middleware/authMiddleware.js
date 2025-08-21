import User from '../models/userModels.js';
import jwt from 'jsonwebtoken';

export const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in multiple header formats
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      // Standard Bearer token format
      token = req.headers.authorization.split(' ')[1];
    } else if (req.headers['x-auth-token']) {
      // Custom x-auth-token header format
      token = req.headers['x-auth-token'];
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // attach user to request (without password)
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }

    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    return res.status(401).json({ message: 'Not authorized', error: error.message });
  }
};
