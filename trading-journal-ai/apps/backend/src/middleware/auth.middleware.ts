import { Request, Response, NextFunction } from 'express';
import { auth } from '../config/firebase';

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // TEMPORARY: Skip authentication for testing
    console.log('⚠️ TEMPORARY: Skipping authentication for testing');
    (req as any).user = {
      uid: 'test-user-123',
      email: 'test@example.com'
    };
    return next();

    // Original auth code (commented for testing)
    /*
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }

    // Verify Firebase token
    const decodedToken = await auth.verifyIdToken(token);
    
    req.user = decodedToken;

    next();
    */
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(403).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};