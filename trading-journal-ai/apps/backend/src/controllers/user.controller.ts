import { Request, Response } from 'express';
import { db } from '../config/firebase-admin';

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
  apiKeys?: {
    alphaVantageApiKey?: string;
    newsApiKey?: string;
    polygonApiKey?: string;
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
      'preferences',
      'apiKeys'
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

export const updateUserApiKeys = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.uid;
    const { alphaVantageApiKey, newsApiKey, polygonApiKey } = req.body;

    // Prepare API keys object (only include non-empty keys)
    const apiKeys: any = {};
    if (alphaVantageApiKey && alphaVantageApiKey.trim()) {
      apiKeys.alphaVantageApiKey = alphaVantageApiKey.trim();
    }
    if (newsApiKey && newsApiKey.trim()) {
      apiKeys.newsApiKey = newsApiKey.trim();
    }
    if (polygonApiKey && polygonApiKey.trim()) {
      apiKeys.polygonApiKey = polygonApiKey.trim();
    }

    // Update user profile with API keys
    const updateData = {
      apiKeys,
      updatedAt: new Date().toISOString()
    };

    // Use set with merge to create document if it doesn't exist
    await db.collection('users').doc(userId).set(updateData, { merge: true });

    res.status(200).json({
      success: true,
      message: 'API keys updated successfully',
      data: {
        hasAlphaVantage: !!apiKeys.alphaVantageApiKey,
        hasNewsApi: !!apiKeys.newsApiKey,
        hasPolygon: !!apiKeys.polygonApiKey
      }
    });

  } catch (error) {
    console.error('Error updating user API keys:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update API keys',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getUserApiKeys = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.uid;

    const userDoc = await db.collection('users').doc(userId).get();
    
    if (!userDoc.exists) {
      return res.status(200).json({
        success: true,
        data: {
          hasAlphaVantage: false,
          hasNewsApi: false,
          hasPolygon: false
        }
      });
    }

    const profile = userDoc.data() as UserProfile;
    const apiKeys = profile.apiKeys || {};

    // Return status only (don't expose actual keys for security)
    res.status(200).json({
      success: true,
      data: {
        hasAlphaVantage: !!apiKeys.alphaVantageApiKey,
        hasNewsApi: !!apiKeys.newsApiKey,
        hasPolygon: !!apiKeys.polygonApiKey
      }
    });

  } catch (error) {
    console.error('Error getting user API keys:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get API keys status',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
