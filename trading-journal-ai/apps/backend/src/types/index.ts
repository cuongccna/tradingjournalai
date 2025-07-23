export interface Trade {
  id?: string;
  userId: string;
  symbol: string;
  assetType: 'stock' | 'forex' | 'crypto' | 'option' | 'future';
  side: 'buy' | 'sell';
  quantity: number;
  entryPrice: number;
  exitPrice?: number;
  entryDate: string;
  exitDate?: string;
  pnl?: number;
  status: 'open' | 'closed';
  strategy: string;
  notes: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  planId: 'free' | 'pro' | 'premium';
  settings: {
    currency: string;
    timezone: string;
    language: string;
    notifications: {
      email: boolean;
      push: boolean;
      trades: boolean;
      analysis: boolean;
    };
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface TradeStats {
  userId: string;
  totalTrades: number;
  openTrades: number;
  closedTrades: number;
  totalPnL: number;
  winRate: number;
  avgProfit: number;
  avgLoss: number;
  largestWin: number;
  largestLoss: number;
  profitFactor: number;
  updatedAt: Date;
}
