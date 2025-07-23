import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: 'Backend server is running!'
  });
});

// Auth routes
app.post('/api/auth/register', (req: Request, res: Response) => {
  const { email, password, displayName } = req.body;
  
  console.log('📝 Registration request:', { email, displayName });
  
  // For now, just return success (Firebase handles the actual registration)
  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      uid: `user-${Date.now()}`,
      email,
      displayName,
      planId: 'free',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  });
});

app.get('/api/auth/profile', (req: Request, res: Response) => {
  console.log('👤 Profile request from:', req.headers.authorization || 'No token');
  
  // Mock profile response
  res.json({
    success: true,
    data: {
      uid: 'user-123',
      email: 'user@example.com',
      displayName: 'Test User',
      planId: 'free',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  });
});

app.put('/api/auth/profile', (req: Request, res: Response) => {
  console.log('✏️ Profile update:', req.body);
  
  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: req.body
  });
});

// Trades routes
app.get('/api/trades', (req: Request, res: Response) => {
  console.log('📊 Trades list request');
  
  res.json({
    success: true,
    data: [],
    total: 0
  });
});

app.post('/api/trades', (req: Request, res: Response) => {
  console.log('💰 New trade:', req.body);
  
  res.status(201).json({
    success: true,
    message: 'Trade created successfully',
    data: { 
      id: `trade-${Date.now()}`, 
      ...req.body,
      createdAt: new Date()
    }
  });
});

app.get('/api/trades/stats', (req: Request, res: Response) => {
  console.log('📈 Stats request');
  
  res.json({
    success: true,
    data: {
      totalTrades: 0,
      totalPnL: 0,
      winRate: 0,
      avgWin: 0,
      avgLoss: 0
    }
  });
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error('❌ Error:', err.stack);
  res.status(500).json({
    success: false,
    error: 'Something went wrong!'
  });
});

// 404 handler
app.use('*', (req: Request, res: Response) => {
  console.log('❓ Route not found:', req.method, req.originalUrl);
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
  console.log(`📝 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 API base URL: http://localhost:${PORT}/api`);
  console.log(`🌍 CORS enabled for: ${process.env.CORS_ORIGIN || 'http://localhost:3000'}`);
});

export default app;
