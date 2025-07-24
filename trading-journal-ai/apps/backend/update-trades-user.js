// Script to update existing trades with real user IDs
const admin = require('firebase-admin');
require('dotenv').config();

// Initialize Firebase Admin
const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function updateTradesForUser() {
  try {
    // First, let's see what users exist and what trades we have
    const tradesSnapshot = await db.collection('trades').get();
    console.log('📊 Current trades:');
    
    tradesSnapshot.forEach(doc => {
      const data = doc.data();
      console.log(`- ${doc.id}: ${data.symbol} (userId: ${data.userId})`);
    });

    // List Firebase Auth users
    console.log('\n👥 Firebase Auth Users:');
    const listUsersResult = await admin.auth().listUsers(10);
    listUsersResult.users.forEach(user => {
      console.log(`- ${user.uid}: ${user.email} (${user.displayName || 'No name'})`);
    });

    // If you want to update trades to a specific user, uncomment this:
    /*
    const targetUserId = 'REPLACE_WITH_REAL_USER_ID';
    const batch = db.batch();
    
    tradesSnapshot.forEach(doc => {
      const ref = db.collection('trades').doc(doc.id);
      batch.update(ref, { userId: targetUserId });
    });
    
    await batch.commit();
    console.log(`✅ Updated all trades to userId: ${targetUserId}`);
    */

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    process.exit(0);
  }
}

updateTradesForUser();
