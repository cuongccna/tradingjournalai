import { db } from '../config/firebase';
import { Trade, TradeStats } from '../types';

export class TradeService {
  private tradesCollection = db.collection('trades');
  private statsCollection = db.collection('trade_stats');

  async createTrade(tradeData: Omit<Trade, 'id' | 'createdAt' | 'updatedAt'>): Promise<Trade> {
    try {
      const now = new Date();
      const trade: Omit<Trade, 'id'> = {
        ...tradeData,
        createdAt: now,
        updatedAt: now
      };

      const docRef = await this.tradesCollection.add(trade);
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

      // Order by creation date (newest first)
      query = query.orderBy('createdAt', 'desc');

      if (options?.limit) {
        query = query.limit(options.limit);
      }

      if (options?.offset) {
        query = query.offset(options.offset);
      }

      const snapshot = await query.get();
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Trade));
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