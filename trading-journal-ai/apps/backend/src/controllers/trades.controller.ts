import { Request, Response, NextFunction } from 'express';
import { TradeService } from '../services/trade.service';

const tradeService = new TradeService();

export const createTrade = async (req: Request, res: Response, next: NextFunction) => {
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
};

export const getTrades = async (req: Request, res: Response, next: NextFunction) => {
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
};

export const getTradeById = async (req: Request, res: Response, next: NextFunction) => {
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
};

export const updateTrade = async (req: Request, res: Response, next: NextFunction) => {
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
};

export const deleteTrade = async (req: Request, res: Response, next: NextFunction) => {
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
};

export const getTradeStats = async (req: Request, res: Response, next: NextFunction) => {
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
};

export const getMarketData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { symbols } = req.query;
    
    if (!symbols || typeof symbols !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Symbols parameter is required'
      });
    }

    const symbolList = symbols.split(',').map(s => s.trim().toUpperCase());
    const vnSymbols = symbolList.filter(s => 
      ['FPT', 'VCB', 'HPG', 'VHM', 'VNM', 'TCB', 'MSN', 'VIC', 'CTG', 'BID'].includes(s)
    );

    if (vnSymbols.length === 0) {
      return res.json({
        success: true,
        data: {
          marketData: [],
          alerts: [],
          overview: {
            totalSymbols: 0,
            gainers: [],
            losers: [],
            highVolatility: [],
            lastUpdated: new Date().toISOString(),
            marketSentiment: 'neutral'
          }
        },
        message: 'No Vietnamese stocks found in symbols'
      });
    }

    // Execute Python script for VN stocks
    const { exec } = require('child_process');
    const path = require('path');
    
    const scriptPath = path.join(__dirname, '../../scripts/vn_stocks_simple.py');
    const command = `python "${scriptPath}" "${vnSymbols.join(',')}"`;

    exec(command, { timeout: 30000 }, (error: any, stdout: string, stderr: string) => {
      if (error) {
        console.error('VN stocks script error:', error);
        return res.status(500).json({
          success: false,
          error: 'Failed to fetch Vietnamese stock data'
        });
      }

      try {
        const marketData = JSON.parse(stdout);
        res.json({
          success: true,
          data: marketData,
          message: 'Vietnamese market data retrieved successfully'
        });
      } catch (parseError) {
        console.error('Failed to parse VN stocks data:', parseError);
        res.status(500).json({
          success: false,
          error: 'Failed to parse market data'
        });
      }
    });
  } catch (error) {
    next(error);
  }
};
