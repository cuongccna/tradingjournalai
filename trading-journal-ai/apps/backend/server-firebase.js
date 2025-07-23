const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

// Load environment variables
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Firebase Admin
let db;
try {
  // Check if required environment variables are set
  if (!process.env.FIREBASE_PROJECT_ID || 
      !process.env.FIREBASE_PRIVATE_KEY || 
      !process.env.FIREBASE_CLIENT_EMAIL) {
    console.warn('⚠️  Firebase Admin credentials not configured. Using mock data.');
    db = null;
  } else {
    // Clean and format the private key properly
    const privateKey = process.env.FIREBASE_PRIVATE_KEY
      .replace(/\\n/g, '\n')  // Replace literal \n with actual newlines
      .replace(/"/g, '');     // Remove quotes if any

    const serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: privateKey,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    };

    console.log('🔑 Initializing Firebase with Project ID:', process.env.FIREBASE_PROJECT_ID);
    console.log('📧 Client Email:', process.env.FIREBASE_CLIENT_EMAIL);
    console.log('🔐 Private Key Length:', privateKey.length);

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    db = admin.firestore();
    console.log('✅ Firebase Admin initialized successfully');
  }
} catch (error) {
  console.error('❌ Firebase Admin initialization failed:', error.message);
  console.error('Full error:', error);
  db = null;
}

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    firebase: db ? 'connected' : 'mock'
  });
});

// Get trades from Firebase or mock data
app.get('/api/trades', async (req, res) => {
  try {
    if (db) {
      // Get trades from Firebase
      const tradesRef = db.collection('trades');
      const snapshot = await tradesRef.orderBy('createdAt', 'desc').get();
      
      const trades = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        trades.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate?.() || data.createdAt,
          updatedAt: data.updatedAt?.toDate?.() || data.updatedAt
        });
      });

      res.json({
        success: true,
        data: trades,
        message: `${trades.length} trades retrieved from Firebase`,
        source: 'firebase'
      });
    } else {
      // Fallback to mock data
      res.json({
        success: true,
        data: [
          {
            id: '1',
            symbol: 'AAPL',
            assetType: 'stocks',
            side: 'buy',
            quantity: 100,
            entryPrice: 150.50,
            exitPrice: 155.25,
            entryDate: '2025-01-15',
            exitDate: '2025-01-20',
            pnl: 475.00,
            status: 'closed',
            strategy: 'Momentum Trading',
            notes: 'Strong earnings report',
            tags: ['tech', 'earnings'],
            createdAt: new Date('2025-01-15'),
            updatedAt: new Date('2025-01-20')
          },
          {
            id: '2',
            symbol: 'TSLA',
            assetType: 'stocks',
            side: 'buy',
            quantity: 50,
            entryPrice: 220.00,
            entryDate: '2025-01-22',
            status: 'open',
            strategy: 'Swing Trading',
            notes: 'Technical breakout pattern',
            tags: ['tech', 'ev'],
            createdAt: new Date('2025-01-22'),
            updatedAt: new Date('2025-01-22')
          }
        ],
        message: 'Mock trades retrieved (Firebase not configured)',
        source: 'mock'
      });
    }
  } catch (error) {
    console.error('Error fetching trades:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch trades',
      message: error.message
    });
  }
});

// Create trade in Firebase or mock response
app.post('/api/trades', async (req, res) => {
  try {
    const tradeData = {
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    if (db) {
      // Save to Firebase
      const docRef = await db.collection('trades').add(tradeData);
      const newTrade = {
        id: docRef.id,
        ...tradeData
      };

      res.status(201).json({
        success: true,
        data: newTrade,
        message: 'Trade created successfully in Firebase',
        source: 'firebase'
      });
    } else {
      // Mock response
      const newTrade = {
        id: Date.now().toString(),
        ...tradeData
      };

      res.status(201).json({
        success: true,
        data: newTrade,
        message: 'Trade created successfully (mock)',
        source: 'mock'
      });
    }
  } catch (error) {
    console.error('Error creating trade:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create trade',
      message: error.message
    });
  }
});

// Get trade by ID
app.get('/api/trades/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (db) {
      const doc = await db.collection('trades').doc(id).get();
      
      if (!doc.exists) {
        return res.status(404).json({
          success: false,
          error: 'Trade not found'
        });
      }

      const trade = {
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt,
        updatedAt: doc.data().updatedAt?.toDate?.() || doc.data().updatedAt
      };

      res.json({
        success: true,
        data: trade,
        source: 'firebase'
      });
    } else {
      // Mock response
      res.json({
        success: true,
        data: {
          id,
          symbol: 'MOCK',
          assetType: 'stocks',
          side: 'buy',
          quantity: 1,
          entryPrice: 100,
          status: 'open',
          strategy: 'Mock Strategy',
          notes: 'Mock trade',
          tags: [],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        source: 'mock'
      });
    }
  } catch (error) {
    console.error('Error fetching trade:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch trade',
      message: error.message
    });
  }
});

// Update trade
app.put('/api/trades/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = {
      ...req.body,
      updatedAt: new Date()
    };

    if (db) {
      await db.collection('trades').doc(id).update(updateData);
      
      const updatedDoc = await db.collection('trades').doc(id).get();
      const trade = {
        id: updatedDoc.id,
        ...updatedDoc.data(),
        createdAt: updatedDoc.data().createdAt?.toDate?.() || updatedDoc.data().createdAt,
        updatedAt: updatedDoc.data().updatedAt?.toDate?.() || updatedDoc.data().updatedAt
      };

      res.json({
        success: true,
        data: trade,
        message: 'Trade updated successfully',
        source: 'firebase'
      });
    } else {
      // Mock response
      res.json({
        success: true,
        data: {
          id,
          ...updateData
        },
        message: 'Trade updated successfully (mock)',
        source: 'mock'
      });
    }
  } catch (error) {
    console.error('Error updating trade:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update trade',
      message: error.message
    });
  }
});

// Delete trade
app.delete('/api/trades/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (db) {
      await db.collection('trades').doc(id).delete();
      
      res.json({
        success: true,
        message: 'Trade deleted successfully',
        source: 'firebase'
      });
    } else {
      // Mock response
      res.json({
        success: true,
        message: 'Trade deleted successfully (mock)',
        source: 'mock'
      });
    }
  } catch (error) {
    console.error('Error deleting trade:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete trade',
      message: error.message
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 CORS Origin: ${process.env.CORS_ORIGIN || 'http://localhost:3000'}`);
  console.log(`🔥 Firebase: ${db ? 'Connected' : 'Mock Mode'}`);
  
  if (!db) {
    console.log('💡 To connect to Firebase, set these environment variables:');
    console.log('   - FIREBASE_PROJECT_ID');
    console.log('   - FIREBASE_PRIVATE_KEY');
    console.log('   - FIREBASE_CLIENT_EMAIL');
  }
}).on('error', (err) => {
  console.error('❌ Server error:', err);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});
