export type AssetType = 'stock' | 'forex' | 'crypto' | 'futures' | 'options';
export type TradeSide = 'buy' | 'sell' | 'long' | 'short';
export type TradeStatus = 'open' | 'closed' | 'cancelled';

export interface Trade {
  id?: string;
  userId: string;
  accountId: string;
  assetType: AssetType;
  symbol: string;
  side: TradeSide;
  status?: TradeStatus;
  size: number;
  entryPrice: number;
  entryDateTime: Date;
  exitPrice?: number;
  exitDateTime?: Date;
  stopLoss?: number;
  takeProfit?: number;
  commission?: number;
  fees?: number;
  swap?: number;
  pnl?: number;
  pnlPercent?: number;
  tags?: string[];
  strategyId?: string;
  notes?: string;
  screenshots?: string[];
  timezone: string;
  currency: string;
  riskRewardRatio?: number;
  rMultiple?: number;
  legs?: TradeLeg[]; // For options/futures
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface TradeLeg {
  id: string;
  legType: 'call' | 'put' | 'future';
  side: 'buy' | 'sell';
  strike?: number;
  expiryDate?: Date;
  quantity: number;
  premium?: number;
}

export interface TradeTag {
  id: string;
  name: string;
  color: string;
  userId: string;
  description?: string;
  createdAt: Date;
}

export interface Strategy {
  id: string;
  userId: string;
  name: string;
  description: string;
  rules: StrategyRule[];
  tags?: string[];
  winRate?: number;
  avgReturn?: number;
  isActive: boolean;
  backtestResults?: BacktestResult;
  createdAt: Date;
  updatedAt: Date;
}

export interface StrategyRule {
  id: string;
  type: 'entry' | 'exit' | 'risk';
  condition: string;
  indicator?: string;
  operator: 'gt' | 'lt' | 'eq' | 'gte' | 'lte' | 'between';
  value: number | string | [number, number];
  timeframe?: string;
}

export interface BacktestResult {
  totalTrades: number;
  winRate: number;
  profitFactor: number;
  sharpeRatio: number;
  maxDrawdown: number;
  avgReturn: number;
  period: {
    start: Date;
    end: Date;
  };
}