"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
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
        trade: Object.assign({ id: Date.now().toString() }, trade)
    });
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
