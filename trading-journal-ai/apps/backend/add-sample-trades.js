// Script to add sample trades to Firebase for testing
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

async function addSampleTrades() {
  const sampleTrades = [
    {
      userId: 'test-user-id',
      symbol: 'BTCUSD',
      assetType: 'crypto',
      side: 'buy',
      quantity: 1.5,
      entryPrice: 45000,
      exitPrice: 47000,
      entryDate: '2025-07-20T10:00:00Z',
      exitDate: '2025-07-22T15:30:00Z',
      status: 'closed',
      pnl: 3000,
      notes: 'Strong bullish breakout',
      strategy: 'Momentum Trading',
      tags: ['crypto', 'swing'],
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    },
    {
      userId: 'test-user-id',
      symbol: 'EURUSD',
      assetType: 'forex',
      side: 'sell',
      quantity: 100000,
      entryPrice: 1.0850,
      exitPrice: 1.0820,
      entryDate: '2025-07-21T08:30:00Z',
      exitDate: '2025-07-21T18:45:00Z',
      status: 'closed',
      pnl: 300,
      notes: 'ECB dovish sentiment',
      strategy: 'News Trading',
      tags: ['forex', 'day-trade'],
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    },
    {
      userId: 'test-user-id',
      symbol: 'AAPL',
      assetType: 'stock',
      side: 'buy',
      quantity: 100,
      entryPrice: 180.50,
      entryDate: '2025-07-23T14:30:00Z',
      status: 'open',
      notes: 'Earnings play - good fundamentals',
      strategy: 'Earnings Play',
      tags: ['stocks', 'earnings'],
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }
  ];

  try {
    for (const trade of sampleTrades) {
      const docRef = await db.collection('trades').add(trade);
      console.log('✅ Added trade:', docRef.id, trade.symbol);
    }
    console.log('🎉 All sample trades added successfully!');
  } catch (error) {
    console.error('❌ Error adding trades:', error);
  } finally {
    process.exit(0);
  }
}

addSampleTrades();
