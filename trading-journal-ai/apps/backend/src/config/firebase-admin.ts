import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin SDK
let firebaseApp;

if (getApps().length === 0) {
  // In development, you might use a service account key file
  // In production, this would be configured through environment variables
  firebaseApp = initializeApp({
    // Add your Firebase project configuration here
    projectId: process.env.FIREBASE_PROJECT_ID || 'your-project-id',
  });
} else {
  firebaseApp = getApps()[0];
}

export const db = getFirestore(firebaseApp);
