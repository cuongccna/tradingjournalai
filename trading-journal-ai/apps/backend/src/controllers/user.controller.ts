import { Request, Response } from 'express';
import { db } from '../config/firebase';

interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  language?: 'en' | 'vi';
  timezone?: string;
  currency?: string;
  theme?: 'light' | 'dark';
  notifications?: {
    email: boolean;
    push: boolean;
    tradeAlerts: boolean;
  };
  preferences?: {
    defaultAssetType?: string;
    defaultStrategy?: string;
    riskLevel?: 'low' | 'medium' | 'high';
  };
  createdAt: string;
  updatedAt: string;
}

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.uid;

    const userDoc = await db.collection('users').doc(userId).get();

    if (!userDoc.exists) {
      // Create default profile if doesn't exist
      const defaultProfile: Partial<UserProfile> = {
        uid: userId,
        email: (req as any).user.email,
        language: 'vi', // Default to Vietnamese
        timezone: 'Asia/Ho_Chi_Minh',
        currency: 'VND',
        theme: 'light',
        notifications: {
          email: true,
          push: true,
          tradeAlerts: true
        },
        preferences: {
          riskLevel: 'medium'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await db.collection('users').doc(userId).set(defaultProfile);

      return res.status(200).json({
        success: true,
        data: defaultProfile,
        message: 'Default profile created'
      });
    }

    const profile = userDoc.data() as UserProfile;

    res.status(200).json({
      success: true,
      data: profile,
      message: 'Profile retrieved successfully'
    });

  } catch (error) {
    console.error('Error getting user profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user profile',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.uid;
    const updates = req.body;

    // Validate allowed fields
    const allowedFields = [
      'displayName',
      'language', 
      'timezone',
      'currency',
      'theme',
      'notifications',
      'preferences'
    ];

    const filteredUpdates: any = {};
    Object.keys(updates).forEach(key => {
      if (allowedFields.includes(key)) {
        filteredUpdates[key] = updates[key];
      }
    });

    // Add updated timestamp
    filteredUpdates.updatedAt = new Date().toISOString();

    // Update profile in Firestore
    await db.collection('users').doc(userId).update(filteredUpdates);

    // Get updated profile
    const updatedDoc = await db.collection('users').doc(userId).get();
    const updatedProfile = updatedDoc.data() as UserProfile;

    res.status(200).json({
      success: true,
      data: updatedProfile,
      message: 'Profile updated successfully'
    });

  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user profile',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
