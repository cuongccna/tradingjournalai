import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth as ClientAuth } from 'firebase/auth';
import { getFirestore, Firestore as ClientFirestore } from 'firebase/firestore';

let clientApp: FirebaseApp;
let clientAuth: ClientAuth;
let clientDb: ClientFirestore;

const initializeFirebaseClient = () => {
  if (!clientApp) {
    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    };

    clientApp = initializeApp(firebaseConfig);
    clientAuth = getAuth(clientApp);
    clientDb = getFirestore(clientApp);
  }

  return { clientApp, clientAuth, clientDb };
};

export { initializeFirebaseClient, clientAuth, clientDb };