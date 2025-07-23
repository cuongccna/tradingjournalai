import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Trading Journal API is running!' });
});

// Auth routes
app.post('/api/auth/register', (req, res) => {
  const { email, password, name } = req.body;
  
  // Mock registration
  res.json({
    success: true,
    message: 'User registered successfully',
    user: {
      id: '123',
      email,
      name
    }
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Mock login
  res.json({
    success: true,
    message: 'Login successful',
    token: 'mock-jwt-token',
    user: {
      id: '123',
      email,
      name: 'Test User'
    }
  });
});

app.get('/api/auth/profile', (req, res) => {
  // Mock profile
  res.json({
    success: true,
    user: {
      id: '123',
      email: 'test@example.com',
      name: 'Test User'
    }
  });
});

// Trades routes
app.get('/api/trades', (req, res) => {
  // Mock trades
  res.json({
    success: true,
    trades: [
      {
        id: '1',
        symbol: 'AAPL',
        type: 'buy',
        quantity: 10,
        price: 150.00,
        date: '2024-01-15',
        pnl: 100.50
      }
    ]
  });
});

app.post('/api/trades', (req, res) => {
  const trade = req.body;
  
  // Mock create trade
  res.json({
    success: true,
    message: 'Trade created successfully',
    trade: {
      id: Date.now().toString(),
      ...trade
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
