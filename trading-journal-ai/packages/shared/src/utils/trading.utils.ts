import { Trade, TradeStats } from '../types';

export const calculatePnL = (
  entryPrice: number,
  exitPrice: number,
  size: number,
  side: 'buy' | 'sell' | 'long' | 'short'
): number => {
  const isLong = side === 'buy' || side === 'long';
  return isLong 
    ? (exitPrice - entryPrice) * size
    : (entryPrice - exitPrice) * size;
};

export const calculatePnLPercent = (
  entryPrice: number,
  exitPrice: number,
  side: 'buy' | 'sell' | 'long' | 'short'
): number => {
  const isLong = side === 'buy' || side === 'long';
  return isLong
    ? ((exitPrice - entryPrice) / entryPrice) * 100
    : ((entryPrice - exitPrice) / entryPrice) * 100;
};

export const calculateRiskRewardRatio = (
  entryPrice: number,
  stopLoss: number,
  takeProfit: number,
  side: 'buy' | 'sell' | 'long' | 'short'
): number => {
  const isLong = side === 'buy' || side === 'long';
  const risk = Math.abs(entryPrice - stopLoss);
  const reward = Math.abs(takeProfit - entryPrice);
  
  return risk > 0 ? reward / risk : 0;
};

export const calculateRMultiple = (
  pnl: number,
  entryPrice: number,
  stopLoss: number,
  size: number
): number => {
  const risk = Math.abs(entryPrice - stopLoss) * size;
  return risk > 0 ? pnl / risk : 0;
};

export const calculateKellyPercentage = (winRate: number, avgWin: number, avgLoss: number): number => {
  if (avgLoss === 0) return 0;
  const b = avgWin / avgLoss;
  const p = winRate / 100;
  const q = 1 - p;
  const kelly = (p * b - q) / b;
  return Math.max(0, Math.min(kelly * 100, 25)); // Cap at 25% for safety
};