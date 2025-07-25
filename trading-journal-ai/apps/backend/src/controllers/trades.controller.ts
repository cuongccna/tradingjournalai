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
