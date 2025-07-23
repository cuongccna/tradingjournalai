import { Request, Response, NextFunction } from 'express';
import { auth } from '../config/firebase';
import { UserService } from '../services/user.service';

const userService = new UserService();

export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, displayName } = req.body;

    // Create user in Firebase Auth
    const firebaseUser = await auth.createUser({
      email,
      password,
      displayName,
    });

    // Create user profile in database
    const userData = UserService.createUserFromAuth(firebaseUser, { displayName });
    const userProfile = await userService.createUser(userData);

    res.status(201).json({
      success: true,
      data: {
        user: userProfile,
        firebaseUid: firebaseUser.uid
      },
      message: 'User registered successfully',
    });
  } catch (error) {
    console.error('Registration error:', error);
    next(error);
  }
};

export const getUserProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const uid = req.user!.uid;

    // Get user from database
    const user = await userService.getUserById(uid);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found',
      });
    }

    res.json({
      success: true,
      data: user,
      message: 'User profile retrieved successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const uid = req.user!.uid;
    const { displayName } = req.body;

    // Update Firebase user
    await auth.updateUser(uid, { displayName });

    // Update user in database
    await userService.updateUser(uid, { displayName });

    res.json({
      success: true,
      message: 'Profile updated successfully',
    });
  } catch (error) {
    next(error);
  }
};