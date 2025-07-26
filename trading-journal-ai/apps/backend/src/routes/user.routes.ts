import { Router } from 'express';
import { getUserProfile, updateUserProfile } from '../controllers/user.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router: Router = Router();

// Apply auth middleware to all user routes
router.use(authMiddleware);

// GET /api/user/profile - Get user profile
router.get('/profile', getUserProfile);

// PATCH /api/user/profile - Update user profile  
router.patch('/profile', updateUserProfile);

export default router;
