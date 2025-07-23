import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));
app.use(compression());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Auth routes
app.post('/api/auth/register', (req: Request, res: Response) => {
  const { email, password, displayName } = req.body;
  
  // For now, just return success (Firebase handles the actual registration)
  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      uid: 'temp-uid',
      email,
      displayName
    }
  });
});

app.get('/api/auth/profile', (req: Request, res: Response) => {
  // Mock profile response
  res.json({
    success: true,
    data: {
      uid: 'temp-uid',
      email: 'user@example.com',
      displayName: 'User',
      planId: 'free',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  });
});

app.put('/api/auth/profile', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: req.body
  });
});

// Trades routes
app.get('/api/trades', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: [],
    total: 0
  });
});

app.post('/api/trades', (req: Request, res: Response) => {
  res.status(201).json({
    success: true,
    message: 'Trade created successfully',
    data: { id: 'temp-trade-id', ...req.body }
  });
});

app.get('/api/trades/stats', (req: Request, res: Response) => {
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
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Something went wrong!'
  });
});

// 404 handler
app.use('*', (req: Request, res: Response) => {
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
});

export default app;
