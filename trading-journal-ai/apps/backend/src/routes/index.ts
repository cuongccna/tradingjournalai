import { Router } from 'express';
import authRoutes from './auth.routes';
import tradesRoutes from './trades.routes';
import accountsRoutes from './accounts.routes';
import analyticsRoutes from './analytics.routes';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.use('/auth', authRoutes);

// Protected routes
router.use('/trades', authMiddleware, tradesRoutes);
router.use('/accounts', authMiddleware, accountsRoutes);
router.use('/analytics', authMiddleware, analyticsRoutes);

export default router;