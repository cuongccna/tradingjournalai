import { initializeApp, cert, ServiceAccount, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getAuth, Auth } from 'firebase-admin/auth';

let app: App;
let db: Firestore;
let auth: Auth;

const initializeFirebaseAdmin = () => {
  if (!app) {
    // Check if required environment variables are set
    if (!process.env.FIREBASE_PROJECT_ID || 
        !process.env.FIREBASE_PRIVATE_KEY || 
        !process.env.FIREBASE_CLIENT_EMAIL) {
      console.warn('Firebase Admin credentials not configured. Skipping initialization.');
      return { app: null, db: null, auth: null };
    }

    const serviceAccount: ServiceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID!,
      privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
    };

    app = initializeApp({
      credential: cert(serviceAccount),
    });

    db = getFirestore(app);
    auth = getAuth(app);

    // Settings for Firestore
    db.settings({
      ignoreUndefinedProperties: true,
    });
  }

  return { app, db, auth };
};

// Initialize on import
const firebase = initializeFirebaseAdmin();

export { firebase as default, db, auth };