import { BaseService } from '@trading-journal/database';
import { Trade } from '@trading-journal/shared';

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

interface TradeStats {
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  totalPnL: number;
  averagePnL: number;
  bestTrade: number;
  worstTrade: number;
  profitFactor: number;
  expectancy: number;
  averageWin: number;
  averageLoss: number;
  maxConsecutiveWins: number;
  maxConsecutiveLosses: number;
  currentStreak: number;
  sharpeRatio: number;
  sortinoRatio: number;
  calmarRatio: number;
  maxDrawdown: number;
  maxDrawdownPercent: number;
  rMultipleAverage: number;
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

    // Basic stats
    const totalPnL = closedTrades.reduce((sum, t) => sum + (t.pnl || 0), 0);
    const totalWins = winningTrades.reduce((sum, t) => sum + (t.pnl || 0), 0);
    const totalLosses = Math.abs(losingTrades.reduce((sum, t) => sum + (t.pnl || 0), 0));

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

    return {
      totalTrades: trades.length,
      winningTrades: winningTrades.length,
      losingTrades: losingTrades.length,
      winRate: closedTrades.length > 0 ? (winningTrades.length / closedTrades.length) * 100 : 0,
      totalPnL,
      averagePnL: closedTrades.length > 0 ? totalPnL / closedTrades.length : 0,
      bestTrade: winningTrades.length > 0 ? Math.max(...winningTrades.map(t => t.pnl!)) : 0,
      worstTrade: losingTrades.length > 0 ? Math.min(...losingTrades.map(t => t.pnl!)) : 0,
      profitFactor: totalLosses > 0 ? totalWins / totalLosses : 0,
      expectancy: closedTrades.length > 0 ? totalPnL / closedTrades.length : 0,
      averageWin: winningTrades.length > 0 ? totalWins / winningTrades.length : 0,
      averageLoss: losingTrades.length > 0 ? totalLosses / losingTrades.length : 0,
      maxConsecutiveWins: maxWins,
      maxConsecutiveLosses: maxLosses,
      currentStreak,
      sharpeRatio,
      sortinoRatio,
      calmarRatio,
      maxDrawdown,
      maxDrawdownPercent,
      rMultipleAverage,
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