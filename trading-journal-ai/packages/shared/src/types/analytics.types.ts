import { AssetType } from './trade.types';

export interface TradeStats {
  totalTrades: number;
  openTrades: number;
  closedTrades: number;
  winningTrades: number;
  losingTrades: number;
  breakEvenTrades: number;
  winRate: number;
  totalPnL: number;
  totalPnLPercent: number;
  averagePnL: number;
  averagePnLPercent: number;
  bestTrade: TradeMetric;
  worstTrade: TradeMetric;
  averageWin: number;
  averageLoss: number;
  profitFactor: number;
  expectancy: number;
  payoffRatio: number;
  sharpeRatio: number;
  sortinoRatio: number;
  calmarRatio: number;
  maxDrawdown: number;
  maxDrawdownPercent: number;
  maxConsecutiveWins: number;
  maxConsecutiveLosses: number;
  currentStreak: number;
  averageHoldingTime: number;
  rMultipleAverage: number;
  kellyPercentage: number;
}

export interface TradeMetric {
  tradeId: string;
  symbol: string;
  pnl: number;
  pnlPercent: number;
  date: Date;
}

export interface PerformanceMetrics {
  daily: TimeSeriesData[];
  weekly: TimeSeriesData[];
  monthly: TimeSeriesData[];
  yearly: TimeSeriesData[];
  cumulative: TimeSeriesData[];
}

export interface TimeSeriesData {
  date: Date;
  value: number;
  pnl: number;
  pnlPercent: number;
  trades: number;
  volume: number;
}

export interface AssetAllocation {
  assetType: AssetType;
  count: number;
  percentage: number;
  pnl: number;
  winRate: number;
}