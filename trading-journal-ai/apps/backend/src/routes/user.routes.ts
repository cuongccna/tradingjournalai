import { Router } from 'express';
import { getUserProfile, updateUserProfile, updateUserApiKeys, getUserApiKeys } from '../controllers/user.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router: Router = Router();

// Apply auth middleware to all user routes
router.use(authMiddleware);

// GET /api/user/profile - Get user profile
router.get('/profile', getUserProfile);

// PATCH /api/user/profile - Update user profile  
router.patch('/profile', updateUserProfile);

// POST /api/user/api-keys - Update user API keys
router.post('/api-keys', updateUserApiKeys);

// GET /api/user/api-keys - Get user API keys status
router.get('/api-keys', getUserApiKeys);

export default router;
