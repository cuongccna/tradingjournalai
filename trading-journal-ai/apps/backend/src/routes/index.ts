import { Router } from 'express';
import authRoutes from './auth.routes';
import tradesRoutes from './trades.routes';
import usersRoutes from './users.routes';
import userRoutes from './user.routes';
import { newsRoutes } from './news.routes';
import marketRoutes from './market.routes';

const router: Router = Router();

// Public routes
router.use('/auth', authRoutes);

// Protected routes
router.use('/trades', tradesRoutes);
router.use('/users', usersRoutes);
router.use('/user', userRoutes);
router.use('/news', newsRoutes);
router.use('/market', marketRoutes);

export default router;