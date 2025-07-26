import { Router } from 'express';
import authRoutes from './auth.routes';
import tradesRoutes from './trades.routes';
import usersRoutes from './users.routes';
import userRoutes from './user.routes';

const router: Router = Router();

// Public routes
router.use('/auth', authRoutes);

// Protected routes
router.use('/trades', tradesRoutes);
router.use('/users', usersRoutes);
router.use('/user', userRoutes);

export default router;