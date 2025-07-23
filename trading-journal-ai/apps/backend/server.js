const express = require('express');
const cors = require('cors');
const path = require('path');

// Load environment variables
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

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
    environment: process.env.NODE_ENV || 'development'
  });
});

// Test API route
app.get('/api/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Backend API is working!',
    timestamp: new Date().toISOString()
  });
});

// Mock trades endpoints for testing
app.get('/api/trades', (req, res) => {
  res.json({
    success: true,
    data: [
      {
        id: '1',
        symbol: 'AAPL',
        assetType: 'stock',
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
        assetType: 'stock',
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
    message: 'Trades retrieved successfully'
  });
});

app.post('/api/trades', (req, res) => {
  const trade = {
    id: Date.now().toString(),
    ...req.body,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  res.status(201).json({
    success: true,
    data: trade,
    message: 'Trade created successfully'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 CORS Origin: ${process.env.CORS_ORIGIN || 'http://localhost:3000'}`);
});
