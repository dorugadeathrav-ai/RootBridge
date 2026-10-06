import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

interface JwtPayload {
  userId: string;
  role: string;
}

// Protected routes middleware
export const protect = async (req: Request, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];
      
      const secret = process.env.JWT_SECRET || 'fallback_secret';
      
      // Verify token
      const decoded = jwt.verify(token, secret) as JwtPayload;

      // Get user from the token
      const user = await User.findById(decoded.userId).select('-passwordHash');
      
      if (!user) {
         res.status(401).json({ message: 'Not authorized, user not found' });
         return;
      }
      
      req.user = user;
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Role-based authorization middleware
export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
       res.status(403).json({ 
        message: `User role ${req.user?.role} is not authorized to access this route` 
      });
       return;
    }
    next();
  };
};
