import { Router } from 'express';
import { registerUser, getUserProfile, updateUserProfile } from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router: Router = Router();

// Public routes
router.post('/register', registerUser);

// Protected routes
router.get('/profile', authMiddleware, getUserProfile);
router.put('/profile', authMiddleware, updateUserProfile);

export default router;