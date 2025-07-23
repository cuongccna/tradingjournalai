import { db, auth } from '../config/firebase';
import { User } from '../types';

export class UserService {
  private usersCollection = db.collection('users');

  async createUser(userData: Omit<User, 'createdAt' | 'updatedAt'>): Promise<User> {
    try {
      const now = new Date();
      const user: User = {
        ...userData,
        createdAt: now,
        updatedAt: now
      };

      await this.usersCollection.doc(user.id).set(user);
      return user;
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('Failed to create user');
    }
  }

  async getUserById(userId: string): Promise<User | null> {
    try {
      const doc = await this.usersCollection.doc(userId).get();
      
      if (!doc.exists) {
        return null;
      }

      return doc.data() as User;
    } catch (error) {
      console.error('Error getting user by ID:', error);
      throw new Error('Failed to get user');
    }
  }

  async updateUser(userId: string, updateData: Partial<User>): Promise<User> {
    try {
      const userDoc = this.usersCollection.doc(userId);
      const user = await userDoc.get();

      if (!user.exists) {
        throw new Error('User not found');
      }

      const userData = user.data() as User;
      const updatedUser = {
        ...updateData,
        updatedAt: new Date()
      };

      await userDoc.update(updatedUser);

      return {
        ...userData,
        ...updatedUser
      };
    } catch (error) {
      console.error('Error updating user:', error);
      throw new Error('Failed to update user');
    }
  }

  async updateUserSettings(userId: string, settings: Partial<User['settings']>): Promise<User> {
    try {
      const userDoc = this.usersCollection.doc(userId);
      const user = await userDoc.get();

      if (!user.exists) {
        throw new Error('User not found');
      }

      const userData = user.data() as User;
      const updatedSettings = {
        ...userData.settings,
        ...settings
      };

      const updatedUser = {
        settings: updatedSettings,
        updatedAt: new Date()
      };

      await userDoc.update(updatedUser);

      return {
        ...userData,
        ...updatedUser
      };
    } catch (error) {
      console.error('Error updating user settings:', error);
      throw new Error('Failed to update user settings');
    }
  }

  async deleteUser(userId: string): Promise<void> {
    try {
      // Delete user document from Firestore
      await this.usersCollection.doc(userId).delete();

      // Delete user from Firebase Auth
      await auth.deleteUser(userId);

      // Note: You might also want to delete related data like trades
      // This can be done using batch operations or Cloud Functions
    } catch (error) {
      console.error('Error deleting user:', error);
      throw new Error('Failed to delete user');
    }
  }

  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const snapshot = await this.usersCollection.where('email', '==', email).limit(1).get();
      
      if (snapshot.empty) {
        return null;
      }

      return snapshot.docs[0].data() as User;
    } catch (error) {
      console.error('Error getting user by email:', error);
      throw new Error('Failed to get user by email');
    }
  }

  // Helper method to create default user settings
  static createDefaultSettings(): User['settings'] {
    return {
      currency: 'USD',
      timezone: 'America/New_York',
      language: 'en',
      notifications: {
        email: true,
        push: false,
        trades: true,
        analysis: false
      }
    };
  }

  // Helper method to create user from Firebase Auth user
  static createUserFromAuth(firebaseUser: any, additionalData?: Partial<User>): Omit<User, 'createdAt' | 'updatedAt'> {
    return {
      id: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName || undefined,
      photoURL: firebaseUser.photoURL || undefined,
      planId: 'free',
      settings: UserService.createDefaultSettings(),
      ...additionalData
    };
  }
}