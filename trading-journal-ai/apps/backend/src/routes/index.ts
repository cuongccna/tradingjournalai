import { Router } from 'express';
import authRoutes from './auth.routes';
import tradesRoutes from './trades.routes';
import { authMiddleware } from '../middleware/auth.middleware';

const router: Router = Router();

// Public routes
router.use('/auth', authRoutes);

// Protected routes
router.use('/trades', authMiddleware, tradesRoutes);

export default router;