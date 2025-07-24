import { db } from '../config/firebase';
import { Trade, TradeStats } from '../types';

export class TradeService {
  private tradesCollection = db.collection('trades');
  private statsCollection = db.collection('trade_stats');

  async createTrade(tradeData: Omit<Trade, 'id' | 'createdAt' | 'updatedAt'>): Promise<Trade> {
    try {
      const now = new Date();
      
      // Calculate P&L if exitPrice is provided
      let pnl = tradeData.pnl;
      if (tradeData.exitPrice && pnl === undefined) {
        const calculatedPnL = TradeService.calculatePnL(tradeData as Trade);
        if (calculatedPnL !== null) {
          pnl = calculatedPnL;
        }
      }
      
      // Determine status if not provided
      const status = tradeData.status || (tradeData.exitPrice ? 'closed' : 'open');
      
      const trade: Omit<Trade, 'id'> = {
        ...tradeData,
        pnl: pnl || undefined, // Only set if not undefined
        status,
        createdAt: now,
        updatedAt: now
      };

      // Remove undefined values before saving to Firestore
      const cleanTrade = Object.fromEntries(
        Object.entries(trade).filter(([_, value]) => value !== undefined)
      );

      const docRef = await this.tradesCollection.add(cleanTrade);
      const createdTrade = { id: docRef.id, ...trade };

      // Update user's trade statistics
      await this.updateTradeStats(trade.userId);

      return createdTrade;
    } catch (error) {
      console.error('Error creating trade:', error);
      throw new Error('Failed to create trade');
    }
  }

  async getTrades(userId: string, options?: {
    status?: 'open' | 'closed' | 'all';
    limit?: number;
    offset?: number;
  }): Promise<Trade[]> {
    try {
      let query = this.tradesCollection.where('userId', '==', userId);

      if (options?.status && options.status !== 'all') {
        query = query.where('status', '==', options.status);
      }

      // TEMPORARY: Remove orderBy to avoid index requirement
      // query = query.orderBy('createdAt', 'desc');

      if (options?.limit) {
        query = query.limit(options.limit);
      }

      if (options?.offset) {
        query = query.offset(options.offset);
      }

      const snapshot = await query.get();
      const trades = snapshot.docs.map(doc => {
        const tradeData = doc.data() as Omit<Trade, 'id'>;
        const trade: Trade = {
          id: doc.id,
          ...tradeData
        };
        
        // Calculate P&L if not already calculated
        if (trade.exitPrice && trade.pnl === undefined) {
          const calculatedPnL = TradeService.calculatePnL(trade);
          if (calculatedPnL !== null) {
            trade.pnl = calculatedPnL;
          }
        }
        
        // Determine status if not set
        if (!trade.status) {
          trade.status = trade.exitPrice ? 'closed' : 'open';
        }
        
        return trade;
      });
      
      return trades;
    } catch (error) {
      console.error('Error getting trades:', error);
      throw new Error('Failed to get trades');
    }
  }

  async getTradeById(tradeId: string, userId: string): Promise<Trade | null> {
    try {
      const doc = await this.tradesCollection.doc(tradeId).get();
      
      if (!doc.exists) {
        return null;
      }

      const trade = { id: doc.id, ...doc.data() } as Trade;
      
      // Verify ownership
      if (trade.userId !== userId) {
        throw new Error('Unauthorized access to trade');
      }

      return trade;
    } catch (error) {
      console.error('Error getting trade by ID:', error);
      throw new Error('Failed to get trade');
    }
  }

  async updateTrade(tradeId: string, userId: string, updateData: Partial<Trade>): Promise<Trade> {
    try {
      const tradeDoc = this.tradesCollection.doc(tradeId);
      const trade = await tradeDoc.get();

      if (!trade.exists) {
        throw new Error('Trade not found');
      }

      const tradeData = trade.data() as Trade;
      if (tradeData.userId !== userId) {
        throw new Error('Unauthorized access to trade');
      }

      const updatedTrade = {
        ...updateData,
        updatedAt: new Date()
      };
      
      // Calculate P&L if exitPrice is being updated
      if (updateData.exitPrice !== undefined) {
        const tempTrade = { ...tradeData, ...updatedTrade } as Trade;
        const calculatedPnL = TradeService.calculatePnL(tempTrade);
        if (calculatedPnL !== null) {
          updatedTrade.pnl = calculatedPnL;
        }
        // Update status when exit price is set
        updatedTrade.status = updateData.exitPrice ? 'closed' : 'open';
      }

      await tradeDoc.update(updatedTrade);

      // Update user's trade statistics
      await this.updateTradeStats(userId);

      return {
        id: tradeId,
        ...tradeData,
        ...updatedTrade
      };
    } catch (error) {
      console.error('Error updating trade:', error);
      throw new Error('Failed to update trade');
    }
  }

  async deleteTrade(tradeId: string, userId: string): Promise<void> {
    try {
      const tradeDoc = this.tradesCollection.doc(tradeId);
      const trade = await tradeDoc.get();

      if (!trade.exists) {
        throw new Error('Trade not found');
      }

      const tradeData = trade.data() as Trade;
      if (tradeData.userId !== userId) {
        throw new Error('Unauthorized access to trade');
      }

      await tradeDoc.delete();

      // Update user's trade statistics
      await this.updateTradeStats(userId);
    } catch (error) {
      console.error('Error deleting trade:', error);
      throw new Error('Failed to delete trade');
    }
  }

  async getTradeStats(userId: string): Promise<TradeStats> {
    try {
      const trades = await this.getTrades(userId);
      
      const stats: TradeStats = {
        userId,
        totalTrades: trades.length,
        openTrades: trades.filter(t => t.status === 'open').length,
        closedTrades: trades.filter(t => t.status === 'closed').length,
        totalPnL: 0,
        winRate: 0,
        avgProfit: 0,
        avgLoss: 0,
        largestWin: 0,
        largestLoss: 0,
        profitFactor: 0,
        updatedAt: new Date()
      };

      const closedTrades = trades.filter(t => t.status === 'closed' && t.pnl !== undefined);
      
      if (closedTrades.length > 0) {
        const pnls = closedTrades.map(t => t.pnl!);
        const profits = pnls.filter(p => p > 0);
        const losses = pnls.filter(p => p < 0);

        stats.totalPnL = pnls.reduce((sum, pnl) => sum + pnl, 0);
        stats.winRate = profits.length / closedTrades.length * 100;
        stats.avgProfit = profits.length > 0 ? profits.reduce((sum, p) => sum + p, 0) / profits.length : 0;
        stats.avgLoss = losses.length > 0 ? Math.abs(losses.reduce((sum, l) => sum + l, 0) / losses.length) : 0;
        stats.largestWin = profits.length > 0 ? Math.max(...profits) : 0;
        stats.largestLoss = losses.length > 0 ? Math.abs(Math.min(...losses)) : 0;
        stats.profitFactor = stats.avgLoss > 0 ? stats.avgProfit / stats.avgLoss : 0;
      }

      return stats;
    } catch (error) {
      console.error('Error calculating trade stats:', error);
      throw new Error('Failed to calculate trade statistics');
    }
  }

  private async updateTradeStats(userId: string): Promise<void> {
    try {
      const stats = await this.getTradeStats(userId);
      await this.statsCollection.doc(userId).set(stats, { merge: true });
    } catch (error) {
      console.error('Error updating trade stats:', error);
    }
  }

  // Helper method to calculate P&L for a trade
  static calculatePnL(trade: Trade): number | null {
    if (!trade.exitPrice) return null;
    
    const multiplier = trade.side === 'buy' ? 1 : -1;
    return (trade.exitPrice - trade.entryPrice) * trade.quantity * multiplier;
  }
}