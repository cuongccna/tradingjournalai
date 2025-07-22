import { Request, Response, NextFunction } from 'express';
import { TradeService } from '../services/trade.service';
import { AuthRequest } from '../middleware/auth.middleware';
import { AppError } from '../middleware/error.middleware';
import { TradeSide } from '@trading-journal/shared';

const tradeService = new TradeService();

// Helper function to calculate P&L based on trade side
function calculatePnL(
  entryPrice: number, 
  exitPrice: number, 
  size: number, 
  side: TradeSide,
  commission?: number,
  fees?: number,
  swap?: number
): { pnl: number; pnlPercent: number } {
  let pnl = 0;
  
  // Calculate gross P&L based on trade side
  switch (side) {
    case 'buy':
    case 'long':
      // Long position: profit when exit price > entry price
      pnl = (exitPrice - entryPrice) * size;
      break;
    case 'sell':
    case 'short':
      // Short position: profit when exit price < entry price
      pnl = (entryPrice - exitPrice) * size;
      break;
    default:
      throw new AppError(`Invalid trade side: ${side}`, 400);
  }
  
  // Subtract costs
  const totalCosts = (commission || 0) + (fees || 0) + (swap || 0);
  pnl -= totalCosts;
  
  // Calculate percentage P&L
  const pnlPercent = (pnl / (entryPrice * size)) * 100;
  
  return { pnl, pnlPercent };
}

export class TradesController {
  async createTrade(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const tradeData = {
        ...req.body,
        userId: req.user!.uid,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Validate required fields
      if (!tradeData.side) {
        throw new AppError('Trade side is required', 400);
      }

      if (!['buy', 'sell', 'long', 'short'].includes(tradeData.side)) {
        throw new AppError('Invalid trade side. Must be buy, sell, long, or short', 400);
      }

      // Calculate P&L if exit price exists
      if (tradeData.exitPrice && tradeData.entryPrice && tradeData.size) {
        const { pnl, pnlPercent } = calculatePnL(
          tradeData.entryPrice,
          tradeData.exitPrice,
          tradeData.size,
          tradeData.side,
          tradeData.commission,
          tradeData.fees,
          tradeData.swap
        );
        
        tradeData.pnl = pnl;
        tradeData.pnlPercent = pnlPercent;
        tradeData.status = 'closed';
      } else {
        tradeData.status = 'open';
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

      // Validate and parse dates with error handling
      let parsedStartDate: Date | undefined;
      let parsedEndDate: Date | undefined;

      if (startDate) {
        parsedStartDate = new Date(startDate as string);
        if (isNaN(parsedStartDate.getTime())) {
          throw new AppError('Invalid startDate format. Please use ISO 8601 format.', 400);
        }
      }

      if (endDate) {
        parsedEndDate = new Date(endDate as string);
        if (isNaN(parsedEndDate.getTime())) {
          throw new AppError('Invalid endDate format. Please use ISO 8601 format.', 400);
        }
      }

      // Validate pagination parameters
      const pageNum = Number(page);
      const limitNum = Number(limit);

      if (isNaN(pageNum) || pageNum < 1) {
        throw new AppError('Invalid page number. Must be a positive integer.', 400);
      }

      if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
        throw new AppError('Invalid limit. Must be between 1 and 100.', 400);
      }

      // Validate sort order
      if (sortOrder !== 'asc' && sortOrder !== 'desc') {
        throw new AppError('Invalid sortOrder. Must be "asc" or "desc".', 400);
      }

      const filters = {
        userId: req.user!.uid,
        accountId: accountId as string,
        assetType: assetType as string,
        startDate: parsedStartDate,
        endDate: parsedEndDate,
      };

      const trades = await tradeService.findAllWithPagination(filters, {
        page: pageNum,
        limit: limitNum,
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

      // Use current trade data as fallback for calculation
      const entryPrice = updateData.entryPrice ?? trade.entryPrice;
      const exitPrice = updateData.exitPrice ?? trade.exitPrice;
      const size = updateData.size ?? trade.size;
      const side = updateData.side ?? trade.side;
      const commission = updateData.commission ?? trade.commission;
      const fees = updateData.fees ?? trade.fees;
      const swap = updateData.swap ?? trade.swap;

      // Recalculate P&L if we have the necessary data
      if (exitPrice && entryPrice && size && side) {
        const { pnl, pnlPercent } = calculatePnL(
          entryPrice,
          exitPrice,
          size,
          side,
          commission,
          fees,
          swap
        );
        
        updateData.pnl = pnl;
        updateData.pnlPercent = pnlPercent;
        updateData.status = 'closed';
      } else if (!exitPrice) {
        // If exit price is removed, mark as open
        updateData.status = 'open';
        updateData.pnl = undefined;
        updateData.pnlPercent = undefined;
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

      // Validate and parse dates with error handling
      let parsedStartDate: Date | undefined;
      let parsedEndDate: Date | undefined;

      if (startDate) {
        parsedStartDate = new Date(startDate as string);
        if (isNaN(parsedStartDate.getTime())) {
          throw new AppError('Invalid startDate format. Please use ISO 8601 format.', 400);
        }
      }

      if (endDate) {
        parsedEndDate = new Date(endDate as string);
        if (isNaN(parsedEndDate.getTime())) {
          throw new AppError('Invalid endDate format. Please use ISO 8601 format.', 400);
        }
      }

      // Validate date range
      if (parsedStartDate && parsedEndDate && parsedStartDate > parsedEndDate) {
        throw new AppError('startDate cannot be after endDate', 400);
      }

      const stats = await tradeService.calculateStats(req.user!.uid, {
        accountId: accountId as string,
        startDate: parsedStartDate,
        endDate: parsedEndDate,
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