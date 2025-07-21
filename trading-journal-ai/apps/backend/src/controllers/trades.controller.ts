import { Request, Response, NextFunction } from 'express';
import { TradeService } from '../services/trade.service';
import { AuthRequest } from '../middleware/auth.middleware';
import { AppError } from '../middleware/error.middleware';

const tradeService = new TradeService();

export class TradesController {
  async createTrade(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const tradeData = {
        ...req.body,
        userId: req.user!.uid,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Calculate P&L if exit price exists
      if (tradeData.exitPrice && tradeData.entryPrice && tradeData.size) {
        const pnl = (tradeData.exitPrice - tradeData.entryPrice) * tradeData.size;
        const pnlPercent = ((tradeData.exitPrice - tradeData.entryPrice) / tradeData.entryPrice) * 100;
        
        tradeData.pnl = pnl;
        tradeData.pnlPercent = pnlPercent;
      }

      const trade = await tradeService.create(tradeData);
      
      res.status(201).json({
        success: true,
        data: trade,
      });
    } catch (error) {
      next(error);
    }
  }

  async getTrades(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { 
        accountId, 
        assetType, 
        startDate, 
        endDate,
        page = 1,
        limit = 20,
        sortBy = 'entryDateTime',
        sortOrder = 'desc'
      } = req.query;

      const filters = {
        userId: req.user!.uid,
        accountId: accountId as string,
        assetType: assetType as string,
        startDate: startDate ? new Date(startDate as string) : undefined,
        endDate: endDate ? new Date(endDate as string) : undefined,
      };

      const trades = await tradeService.findAllWithPagination(filters, {
        page: Number(page),
        limit: Number(limit),
        sortBy: sortBy as string,
        sortOrder: sortOrder as 'asc' | 'desc',
      });

      res.json({
        success: true,
        data: trades.data,
        pagination: trades.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  async getTrade(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const trade = await tradeService.findById(req.params.id);
      
      if (!trade) {
        throw new AppError('Trade not found', 404);
      }

      if (trade.userId !== req.user!.uid) {
        throw new AppError('Unauthorized', 403);
      }

      res.json({
        success: true,
        data: trade,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateTrade(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const trade = await tradeService.findById(req.params.id);
      
      if (!trade) {
        throw new AppError('Trade not found', 404);
      }

      if (trade.userId !== req.user!.uid) {
        throw new AppError('Unauthorized', 403);
      }

      const updateData = {
        ...req.body,
        updatedAt: new Date(),
      };

      // Recalculate P&L if prices changed
      if (updateData.exitPrice && updateData.entryPrice && updateData.size) {
        const pnl = (updateData.exitPrice - updateData.entryPrice) * updateData.size;
        const pnlPercent = ((updateData.exitPrice - updateData.entryPrice) / updateData.entryPrice) * 100;
        
        updateData.pnl = pnl;
        updateData.pnlPercent = pnlPercent;
      }

      await tradeService.update(req.params.id, updateData);

      res.json({
        success: true,
        message: 'Trade updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteTrade(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const trade = await tradeService.findById(req.params.id);
      
      if (!trade) {
        throw new AppError('Trade not found', 404);
      }

      if (trade.userId !== req.user!.uid) {
        throw new AppError('Unauthorized', 403);
      }

      await tradeService.delete(req.params.id);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async getTradeStats(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { accountId, startDate, endDate } = req.query;

      const stats = await tradeService.calculateStats(req.user!.uid, {
        accountId: accountId as string,
        startDate: startDate ? new Date(startDate as string) : undefined,
        endDate: endDate ? new Date(endDate as string) : undefined,
      });

      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }
}