import { BaseService } from '@trading-journal/database';
import { Trade, TradeStats, TradeMetric } from '@trading-journal/shared';

interface TradeFilters {
  userId: string;
  accountId?: string;
  assetType?: string;
  startDate?: Date;
  endDate?: Date;
}

interface PaginationOptions {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export class TradeService extends BaseService<Trade> {
  constructor() {
    super('trades');
  }

  async findAllWithPagination(
    filters: TradeFilters,
    options: PaginationOptions
  ): Promise<PaginatedResult<Trade>> {
    const { page, limit, sortBy, sortOrder } = options;
    const offset = (page - 1) * limit;

    // Build query
    let query = this.collection.where('userId', '==', filters.userId);

    if (filters.accountId) {
      query = query.where('accountId', '==', filters.accountId);
    }

    if (filters.assetType) {
      query = query.where('assetType', '==', filters.assetType);
    }

    if (filters.startDate) {
      query = query.where('entryDateTime', '>=', filters.startDate);
    }

    if (filters.endDate) {
      query = query.where('entryDateTime', '<=', filters.endDate);
    }

    // Get total count
    const countSnapshot = await query.count().get();
    const total = countSnapshot.data().count;

    // Apply sorting and pagination
    query = query.orderBy(sortBy, sortOrder).limit(limit).offset(offset);

    const snapshot = await query.get();
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Trade[];

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async calculateStats(userId: string, filters: Partial<TradeFilters>): Promise<TradeStats> {
    const trades = await this.findAll((ref) => {
      let query = ref.where('userId', '==', userId);

      if (filters.accountId) {
        query = query.where('accountId', '==', filters.accountId);
      }

      if (filters.startDate) {
        query = query.where('entryDateTime', '>=', filters.startDate);
      }

      if (filters.endDate) {
        query = query.where('entryDateTime', '<=', filters.endDate);
      }

      return query.orderBy('entryDateTime', 'asc');
    });

    // Filter closed trades
    const closedTrades = trades.filter(t => t.exitPrice !== undefined && t.pnl !== undefined);
    const winningTrades = closedTrades.filter(t => t.pnl! > 0);
    const losingTrades = closedTrades.filter(t => t.pnl! < 0);
    const breakEvenTrades = closedTrades.filter(t => t.pnl === 0);

    // Basic stats
    const totalPnL = closedTrades.reduce((sum, t) => sum + (t.pnl || 0), 0);
    const totalWins = winningTrades.reduce((sum, t) => sum + (t.pnl || 0), 0);
    const totalLosses = Math.abs(losingTrades.reduce((sum, t) => sum + (t.pnl || 0), 0));

    // Calculate percentage P&L
    const totalPnLPercent = closedTrades.reduce((sum, t) => sum + (t.pnlPercent || 0), 0);
    const averagePnLPercent = closedTrades.length > 0 ? totalPnLPercent / closedTrades.length : 0;

    // Find best and worst trades
    const bestTradeData = winningTrades.length > 0 
      ? winningTrades.reduce((best, current) => (current.pnl! > best.pnl! ? current : best))
      : null;
    
    const worstTradeData = losingTrades.length > 0
      ? losingTrades.reduce((worst, current) => (current.pnl! < worst.pnl! ? current : worst))
      : null;

    // Create TradeMetric objects
    const bestTrade: TradeMetric = bestTradeData ? {
      tradeId: bestTradeData.id || '',
      symbol: bestTradeData.symbol,
      pnl: bestTradeData.pnl!,
      pnlPercent: bestTradeData.pnlPercent || 0,
      date: bestTradeData.exitDateTime || bestTradeData.entryDateTime,
    } : {
      tradeId: '',
      symbol: '',
      pnl: 0,
      pnlPercent: 0,
      date: new Date(),
    };

    const worstTrade: TradeMetric = worstTradeData ? {
      tradeId: worstTradeData.id || '',
      symbol: worstTradeData.symbol,
      pnl: worstTradeData.pnl!,
      pnlPercent: worstTradeData.pnlPercent || 0,
      date: worstTradeData.exitDateTime || worstTradeData.entryDateTime,
    } : {
      tradeId: '',
      symbol: '',
      pnl: 0,
      pnlPercent: 0,
      date: new Date(),
    };

    // Calculate streaks
    const { maxWins, maxLosses, currentStreak } = this.calculateStreaks(closedTrades);

    // Calculate drawdown
    const { maxDrawdown, maxDrawdownPercent } = this.calculateDrawdown(closedTrades);

    // Calculate ratios
    const returns = closedTrades.map(t => t.pnlPercent || 0);
    const sharpeRatio = this.calculateSharpeRatio(returns);
    const sortinoRatio = this.calculateSortinoRatio(returns);
    const calmarRatio = totalPnL / (maxDrawdown || 1);

    // Calculate R-Multiple
    const rMultiples = this.calculateRMultiples(closedTrades);
    const rMultipleAverage = rMultiples.length > 0 
      ? rMultiples.reduce((a, b) => a + b, 0) / rMultiples.length 
      : 0;

    // Calculate additional metrics
    const payoffRatio = (winningTrades.length > 0 && losingTrades.length > 0) 
      ? (totalWins / winningTrades.length) / (totalLosses / losingTrades.length) 
      : 0;

    // Calculate average holding time in hours
    const averageHoldingTime = closedTrades.length > 0 
      ? closedTrades.reduce((sum, t) => {
          if (t.exitDateTime && t.entryDateTime) {
            return sum + (t.exitDateTime.getTime() - t.entryDateTime.getTime()) / (1000 * 60 * 60);
          }
          return sum;
        }, 0) / closedTrades.length
      : 0;

    // Calculate Kelly percentage
    const kellyPercentage = winningTrades.length > 0 && losingTrades.length > 0
      ? ((winningTrades.length / closedTrades.length) * payoffRatio - (losingTrades.length / closedTrades.length)) / payoffRatio
      : 0;

    return {
      totalTrades: trades.length,
      openTrades: trades.length - closedTrades.length,
      closedTrades: closedTrades.length,
      winningTrades: winningTrades.length,
      losingTrades: losingTrades.length,
      breakEvenTrades: breakEvenTrades.length,
      winRate: closedTrades.length > 0 ? (winningTrades.length / closedTrades.length) * 100 : 0,
      totalPnL,
      totalPnLPercent,
      averagePnL: closedTrades.length > 0 ? totalPnL / closedTrades.length : 0,
      averagePnLPercent,
      bestTrade,
      worstTrade,
      averageWin: winningTrades.length > 0 ? totalWins / winningTrades.length : 0,
      averageLoss: losingTrades.length > 0 ? totalLosses / losingTrades.length : 0,
      profitFactor: totalLosses > 0 ? totalWins / totalLosses : 0,
      expectancy: closedTrades.length > 0 ? totalPnL / closedTrades.length : 0,
      payoffRatio,
      sharpeRatio,
      sortinoRatio,
      calmarRatio,
      maxDrawdown,
      maxDrawdownPercent,
      maxConsecutiveWins: maxWins,
      maxConsecutiveLosses: maxLosses,
      currentStreak,
      averageHoldingTime,
      rMultipleAverage,
      kellyPercentage,
    };
  }

  private calculateStreaks(trades: Trade[]): { maxWins: number; maxLosses: number; currentStreak: number } {
    let maxWins = 0;
    let maxLosses = 0;
    let currentWins = 0;
    let currentLosses = 0;
    let currentStreak = 0;

    for (const trade of trades) {
      if (trade.pnl! > 0) {
        currentWins++;
        currentLosses = 0;
        maxWins = Math.max(maxWins, currentWins);
        currentStreak = currentWins;
      } else {
        currentLosses++;
        currentWins = 0;
        maxLosses = Math.max(maxLosses, currentLosses);
        currentStreak = -currentLosses;
      }
    }

    return { maxWins, maxLosses, currentStreak };
  }

  private calculateDrawdown(trades: Trade[]): { maxDrawdown: number; maxDrawdownPercent: number } {
    let peak = 0;
    let maxDrawdown = 0;
    let maxDrawdownPercent = 0;
    let equity = 0;

    for (const trade of trades) {
      equity += trade.pnl || 0;
      if (equity > peak) {
        peak = equity;
      }
      const drawdown = peak - equity;
      const drawdownPercent = peak > 0 ? (drawdown / peak) * 100 : 0;
      
      if (drawdown > maxDrawdown) {
        maxDrawdown = drawdown;
        maxDrawdownPercent = drawdownPercent;
      }
    }

    return { maxDrawdown, maxDrawdownPercent };
  }

  private calculateSharpeRatio(returns: number[], riskFreeRate: number = 0): number {
    if (returns.length === 0) return 0;
    
    const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
    const stdDev = Math.sqrt(
      returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length
    );
    
    return stdDev > 0 ? (avgReturn - riskFreeRate) / stdDev : 0;
  }

  private calculateSortinoRatio(returns: number[], targetReturn: number = 0): number {
    if (returns.length === 0) return 0;
    
    const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
    const downside = returns.filter(r => r < targetReturn);
    
    if (downside.length === 0) return 0;
    
    const downsideDeviation = Math.sqrt(
      downside.reduce((sum, r) => sum + Math.pow(r - targetReturn, 2), 0) / downside.length
    );
    
    return downsideDeviation > 0 ? (avgReturn - targetReturn) / downsideDeviation : 0;
  }

  private calculateRMultiples(trades: Trade[]): number[] {
    return trades
      .filter(t => t.stopLoss && t.entryPrice && t.pnl)
      .map(t => {
        const risk = Math.abs(t.entryPrice! - t.stopLoss!) * t.size!;
        return risk > 0 ? t.pnl! / risk : 0;
      });
  }
}