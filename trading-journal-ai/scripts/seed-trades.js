const admin = require('firebase-admin');
require('dotenv').config();

// Initialize Firebase Admin
const serviceAccount = {
  type: "service_account",
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: "YOUR_PRIVATE_KEY_ID",
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: "YOUR_CLIENT_ID",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${process.env.FIREBASE_CLIENT_EMAIL}`
};

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: process.env.FIREBASE_PROJECT_ID
  });
}

const db = admin.firestore();

// Sample test data
const sampleTrades = [
  {
    symbol: 'AAPL',
    assetType: 'STOCK',
    side: 'BUY',
    quantity: 100,
    entryPrice: 175.50,
    exitPrice: 182.30,
    entryDate: '2025-01-20T09:30:00Z',
    exitDate: '2025-01-22T15:45:00Z',
    pnl: 680,
    status: 'CLOSED',
    strategy: 'Momentum Trading',
    tags: ['tech', 'earnings-play'],
    notes: 'Strong earnings beat, bought on momentum'
  },
  {
    symbol: 'TSLA',
    assetType: 'STOCK',
    side: 'BUY',
    quantity: 50,
    entryPrice: 245.80,
    exitPrice: 238.90,
    entryDate: '2025-01-18T10:15:00Z',
    exitDate: '2025-01-19T14:20:00Z',
    pnl: -345,
    status: 'CLOSED',
    strategy: 'Swing Trading',
    tags: ['ev', 'volatile'],
    notes: 'Failed breakout, cut losses quickly'
  },
  {
    symbol: 'MSFT',
    assetType: 'STOCK',
    side: 'BUY',
    quantity: 75,
    entryPrice: 425.60,
    exitPrice: 435.20,
    entryDate: '2025-01-15T09:45:00Z',
    exitDate: '2025-01-17T11:30:00Z',
    pnl: 720,
    status: 'CLOSED',
    strategy: 'Blue Chip Growth',
    tags: ['tech', 'dividend'],
    notes: 'Solid support level bounce'
  },
  {
    symbol: 'BTC/USD',
    assetType: 'CRYPTO',
    side: 'BUY',
    quantity: 0.5,
    entryPrice: 95000,
    exitPrice: 98500,
    entryDate: '2025-01-21T08:00:00Z',
    exitDate: '2025-01-23T16:00:00Z',
    pnl: 1750,
    status: 'CLOSED',
    strategy: 'Crypto Momentum',
    tags: ['bitcoin', 'crypto'],
    notes: 'Strong institutional buying pressure'
  },
  {
    symbol: 'GOOGL',
    assetType: 'STOCK',
    side: 'BUY',
    quantity: 30,
    entryPrice: 178.90,
    entryDate: '2025-01-23T10:30:00Z',
    pnl: 0,
    status: 'OPEN',
    strategy: 'Value Play',
    tags: ['tech', 'ai'],
    notes: 'AI earnings catalyst expected'
  },
  {
    symbol: 'EUR/USD',
    assetType: 'FOREX',
    side: 'SELL',
    quantity: 10000,
    entryPrice: 1.0850,
    exitPrice: 1.0820,
    entryDate: '2025-01-19T03:00:00Z',
    exitDate: '2025-01-19T15:30:00Z',
    pnl: 300,
    status: 'CLOSED',
    strategy: 'Currency Scalping',
    tags: ['forex', 'scalp'],
    notes: 'ECB dovish comments'
  },
  {
    symbol: 'NVDA',
    assetType: 'STOCK',
    side: 'BUY',
    quantity: 25,
    entryPrice: 875.40,
    exitPrice: 925.80,
    entryDate: '2025-01-16T09:35:00Z',
    exitDate: '2025-01-18T13:45:00Z',
    pnl: 1260,
    status: 'CLOSED',
    strategy: 'AI Growth',
    tags: ['tech', 'ai', 'earnings'],
    notes: 'AI chip demand surge'
  },
  {
    symbol: 'SPY',
    assetType: 'STOCK',
    side: 'BUY',
    quantity: 200,
    entryPrice: 485.50,
    exitPrice: 478.20,
    entryDate: '2025-01-14T09:30:00Z',
    exitDate: '2025-01-15T10:45:00Z',
    pnl: -1460,
    status: 'CLOSED',
    strategy: 'Index Trading',
    tags: ['etf', 'market'],
    notes: 'Market pullback on inflation data'
  },
  {
    symbol: 'AMZN',
    assetType: 'STOCK',
    side: 'BUY',
    quantity: 40,
    entryPrice: 185.30,
    entryDate: '2025-01-22T11:00:00Z',
    pnl: 0,
    status: 'OPEN',
    strategy: 'E-commerce Recovery',
    tags: ['tech', 'cloud'],
    notes: 'AWS growth acceleration expected'
  },
  {
    symbol: 'GLD',
    assetType: 'FUTURES',
    side: 'BUY',
    quantity: 5,
    entryPrice: 2045.50,
    exitPrice: 2065.80,
    entryDate: '2025-01-17T08:45:00Z',
    exitDate: '2025-01-20T14:30:00Z',
    pnl: 1015,
    status: 'CLOSED',
    strategy: 'Safe Haven',
    tags: ['gold', 'hedge'],
    notes: 'Dollar weakness trade'
  }
];

async function seedDatabase() {
  console.log('🌱 Starting to seed Firebase database with sample trades...');
  
  try {
    const batch = db.batch();
    
    for (const trade of sampleTrades) {
      const docRef = db.collection('trades').doc();
      batch.set(docRef, {
        ...trade,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }
    
    await batch.commit();
    console.log(`✅ Successfully added ${sampleTrades.length} sample trades to Firebase!`);
    
    // Verify the data
    const snapshot = await db.collection('trades').get();
    console.log(`📊 Total trades in database: ${snapshot.size}`);
    
    // Show some statistics
    const closedTrades = sampleTrades.filter(t => t.status === 'CLOSED');
    const totalPnL = closedTrades.reduce((sum, t) => sum + t.pnl, 0);
    const winningTrades = closedTrades.filter(t => t.pnl > 0).length;
    const winRate = (winningTrades / closedTrades.length * 100).toFixed(1);
    
    console.log('\n📈 Sample Data Statistics:');
    console.log(`Total P&L: $${totalPnL.toLocaleString()}`);
    console.log(`Win Rate: ${winRate}%`);
    console.log(`Total Trades: ${sampleTrades.length}`);
    console.log(`Open Positions: ${sampleTrades.filter(t => t.status === 'OPEN').length}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
