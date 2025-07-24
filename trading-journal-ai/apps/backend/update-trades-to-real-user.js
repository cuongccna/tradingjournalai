// Script to update trades for authenticated user
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

async function updateTradesForRealUser() {
  try {
    // Use the first user from your Firebase Auth
    const targetUserId = 'dpOopoc88GV4I65Kq5Fh8PDcf522'; // cuong.vhcc@gmail.com
    
    // Get trades with test-user-id
    const tradesSnapshot = await db.collection('trades')
      .where('userId', '==', 'test-user-id')
      .get();

    if (tradesSnapshot.empty) {
      console.log('❌ No trades found with test-user-id');
      return;
    }

    console.log(`📊 Found ${tradesSnapshot.size} trades to update`);

    // Update trades in batch
    const batch = db.batch();
    
    tradesSnapshot.forEach(doc => {
      console.log(`- Updating ${doc.data().symbol} (${doc.id})`);
      const ref = db.collection('trades').doc(doc.id);
      batch.update(ref, { userId: targetUserId });
    });
    
    await batch.commit();
    console.log(`✅ Updated all trades to userId: ${targetUserId}`);
    console.log(`👤 User: cuong.vhcc@gmail.com`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    process.exit(0);
  }
}

updateTradesForRealUser();
