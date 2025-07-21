import { Request, Response, NextFunction } from 'express';
import { auth } from '@trading-journal/database';
import { AppError } from './error.middleware';

export interface AuthRequest extends Request {
  user?: {
    uid: string;
    email: string;
  };
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];
    
    if (!token) {
      throw new AppError('No token provided', 401);
    }

    const decodedToken = await auth.verifyIdToken(token);
    
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email || '',
    };

    next();
  } catch (error) {
    next(new AppError('Invalid or expired token', 401));
  }
};