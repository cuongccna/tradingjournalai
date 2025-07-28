import { Router } from 'express';
import { TradeService } from '../services/trade.service';
import { authMiddleware } from '../middleware/auth.middleware';
import { validateTrade } from '../validators/trade.validator';
import { 
  createTrade, 
  getTradeById, 
  getTrades, 
  updateTrade, 
  deleteTrade, 
  getTradeStats,
  getMarketData 
} from '../controllers/trades.controller';

const router: Router = Router();
const tradeService = new TradeService();

// Apply authentication middleware to all trade routes
router.use(authMiddleware);

// Vietnamese market data
router.get('/market-data', getMarketData);

// Create a new trade
router.post('/', validateTrade, async (req, res, next) => {
  try {
    const userId = req.user!.uid;
    const tradeData = { ...req.body, userId };
    
    const trade = await tradeService.createTrade(tradeData);
    res.status(201).json({
      success: true,
      data: trade,
      message: 'Trade created successfully'
    });
  } catch (error) {
    next(error);
  }
});

// Get all trades for the authenticated user
router.get('/', async (req, res, next) => {
  try {
    const userId = req.user!.uid;
    const { status, limit, offset } = req.query;
    
    const options: any = {};
    if (status && typeof status === 'string') {
      options.status = status as 'open' | 'closed' | 'all';
    }
    if (limit && typeof limit === 'string') {
      options.limit = parseInt(limit, 10);
    }
    if (offset && typeof offset === 'string') {
      options.offset = parseInt(offset, 10);
    }

    const trades = await tradeService.getTrades(userId, options);
    res.json({
      success: true,
      data: trades,
      message: 'Trades retrieved successfully'
    });
  } catch (error) {
    next(error);
  }
});

// Get a specific trade by ID
router.get('/:id', async (req, res, next) => {
  try {
    const userId = req.user!.uid;
    const tradeId = req.params.id;

    const trade = await tradeService.getTradeById(tradeId, userId);
    
    if (!trade) {
      return res.status(404).json({
        success: false,
        message: 'Trade not found'
      });
    }

    res.json({
      success: true,
      data: trade,
      message: 'Trade retrieved successfully'
    });
  } catch (error) {
    next(error);
  }
});

// Update a trade
router.put('/:id', validateTrade, async (req, res, next) => {
  try {
    const userId = req.user!.uid;
    const tradeId = req.params.id;
    const updateData = req.body;

    // Don't allow updating userId
    delete updateData.userId;

    const trade = await tradeService.updateTrade(tradeId, userId, updateData);
    res.json({
      success: true,
      data: trade,
      message: 'Trade updated successfully'
    });
  } catch (error) {
    next(error);
  }
});

// Delete a trade
router.delete('/:id', async (req, res, next) => {
  try {
    const userId = req.user!.uid;
    const tradeId = req.params.id;

    await tradeService.deleteTrade(tradeId, userId);
    res.json({
      success: true,
      message: 'Trade deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

// Get trade statistics
router.get('/stats/summary', async (req, res, next) => {
  try {
    const userId = req.user!.uid;
    const stats = await tradeService.getTradeStats(userId);
    
    res.json({
      success: true,
      data: stats,
      message: 'Trade statistics retrieved successfully'
    });
  } catch (error) {
    next(error);
  }
});

export default router;