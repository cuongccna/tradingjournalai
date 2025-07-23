import { Router } from 'express';
import { UserService } from '../services/user.service';
import { authMiddleware } from '../middleware/auth.middleware';

const router: Router = Router();
const userService = new UserService();

// Apply authentication middleware to all user routes
router.use(authMiddleware);

// Get current user profile
router.get('/profile', async (req, res, next) => {
  try {
    const userId = req.user!.uid;
    const user = await userService.getUserById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user,
      message: 'User profile retrieved successfully'
    });
  } catch (error) {
    next(error);
  }
});

// Update user profile
router.put('/profile', async (req, res, next) => {
  try {
    const userId = req.user!.uid;
    const updateData = req.body;

    // Don't allow updating sensitive fields
    delete updateData.id;
    delete updateData.email;
    delete updateData.createdAt;

    const user = await userService.updateUser(userId, updateData);
    res.json({
      success: true,
      data: user,
      message: 'User profile updated successfully'
    });
  } catch (error) {
    next(error);
  }
});

// Update user settings
router.put('/settings', async (req, res, next) => {
  try {
    const userId = req.user!.uid;
    const settings = req.body;

    const user = await userService.updateUserSettings(userId, settings);
    res.json({
      success: true,
      data: user.settings,
      message: 'User settings updated successfully'
    });
  } catch (error) {
    next(error);
  }
});

// Create or update user (called after Firebase Auth registration)
router.post('/', async (req, res, next) => {
  try {
    const firebaseUser = req.user!;
    const additionalData = req.body;

    // Check if user already exists
    let user = await userService.getUserById(firebaseUser.uid);
    
    if (!user) {
      // Create new user
      const userData = UserService.createUserFromAuth(firebaseUser, additionalData);
      user = await userService.createUser(userData);
    }

    res.status(201).json({
      success: true,
      data: user,
      message: 'User created/updated successfully'
    });
  } catch (error) {
    next(error);
  }
});

// Delete user account
router.delete('/', async (req, res, next) => {
  try {
    const userId = req.user!.uid;
    await userService.deleteUser(userId);
    
    res.json({
      success: true,
      message: 'User account deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

export default router;
