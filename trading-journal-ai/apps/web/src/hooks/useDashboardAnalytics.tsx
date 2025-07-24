'use client';

import { useState, useEffect, useMemo } from 'react';
import { api } from '@/lib/api';
import { Trade } from '../../../../packages/shared/src/types';

export interface DashboardAnalytics {
  totalTrades: number;
  openTrades: number;
  closedTrades: number;
  activePositions: number; // Add this field
  totalPnL: number;
  totalVolume: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  averageWin: number;
  averageLoss: number;
  profitFactor: number;
  maxDrawdown: number;
  bestTrade: number;
  worstTrade: number;
  recentTrades: Trade[];
  pnlOverTime: Array<{ date: string; pnl: number; cumulative: number }>;
  assetTypeDistribution: Array<{ name: string; value: number; trades: number }>;
  monthlyPerformance: Array<{ month: string; pnl: number; trades: number }>;
}

export const useDashboardAnalytics = () => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch trades from API
  useEffect(() => {
    const fetchTrades = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await api.trades.list();
        
        if (Array.isArray(response)) {
          setTrades(response);
        } else {
          setTrades([]);
        }
      } catch (error) {
        console.error('Error fetching trades:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch data');
        setTrades([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTrades();
  }, []);

  // Calculate analytics from trades data
  const analytics = useMemo((): DashboardAnalytics => {
    if (!trades.length) {
      return {
        totalTrades: 0,
        openTrades: 0,
        closedTrades: 0,
        activePositions: 0,
        totalPnL: 0,
        totalVolume: 0,
        winningTrades: 0,
        losingTrades: 0,
        winRate: 0,
        averageWin: 0,
        averageLoss: 0,
        profitFactor: 0,
        maxDrawdown: 0,
        bestTrade: 0,
        worstTrade: 0,
        recentTrades: [],
        pnlOverTime: [],
        assetTypeDistribution: [],
        monthlyPerformance: [],
      };
    }

    // Basic calculations - support both uppercase and lowercase status values
    const closedTrades = trades.filter(trade => 
      (trade.status?.toLowerCase() === 'closed') && trade.pnl !== undefined
    );
    const openTrades = trades.filter(trade => 
      trade.status?.toLowerCase() === 'open'
    );
    
    const totalPnL = closedTrades.reduce((sum, trade) => sum + (trade.pnl || 0), 0);
    // Support both 'size' and 'quantity' field names
    const totalVolume = trades.reduce((sum, trade) => {
      const quantity = (trade as any).size || (trade as any).quantity || 0;
      return sum + (quantity * trade.entryPrice);
    }, 0);

    // Win/Loss calculations
    const winningTrades = closedTrades.filter(trade => (trade.pnl || 0) > 0);
    const losingTrades = closedTrades.filter(trade => (trade.pnl || 0) < 0);
    const winRate = closedTrades.length > 0 ? (winningTrades.length / closedTrades.length) * 100 : 0;

    const averageWin = winningTrades.length > 0 
      ? winningTrades.reduce((sum, trade) => sum + (trade.pnl || 0), 0) / winningTrades.length 
      : 0;

    const averageLoss = losingTrades.length > 0 
      ? Math.abs(losingTrades.reduce((sum, trade) => sum + (trade.pnl || 0), 0) / losingTrades.length)
      : 0;

    const profitFactor = averageLoss > 0 ? averageWin / averageLoss : 0;

    // Best and worst trades
    const bestTrade = closedTrades.length > 0 
      ? Math.max(...closedTrades.map(trade => trade.pnl || 0))
      : 0;

    const worstTrade = closedTrades.length > 0 
      ? Math.min(...closedTrades.map(trade => trade.pnl || 0))
      : 0;

    // Max drawdown calculation
    const sortedTrades = [...closedTrades].sort((a, b) => {
      // Safe date parsing with validation
      const dateValueA = (a as any).entryDateTime || (a as any).entryDate || Date.now();
      const dateValueB = (b as any).entryDateTime || (b as any).entryDate || Date.now();
      
      const dateA = new Date(dateValueA);
      const dateB = new Date(dateValueB);
      
      // Check if dates are valid
      if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
        return 0; // Keep original order if dates are invalid
      }
      
      return dateA.getTime() - dateB.getTime();
    });

    let maxDrawdown = 0;
    let peak = 0;
    let runningPnL = 0;

    sortedTrades.forEach(trade => {
      runningPnL += trade.pnl || 0;
      if (runningPnL > peak) {
        peak = runningPnL;
      }
      const drawdown = peak - runningPnL;
      if (drawdown > maxDrawdown) {
        maxDrawdown = drawdown;
      }
    });

    // P&L over time
    const pnlOverTime = sortedTrades.map((trade, index) => {
      const cumulative = sortedTrades.slice(0, index + 1).reduce((sum, t) => sum + (t.pnl || 0), 0);
      
      // Safe date parsing
      const dateValue = (trade as any).entryDateTime || (trade as any).entryDate || Date.now();
      const tradeDate = new Date(dateValue);
      
      if (isNaN(tradeDate.getTime())) {
        tradeDate.setTime(Date.now()); // Fallback to current time
      }
      
      return {
        date: tradeDate.toISOString().split('T')[0],
        pnl: trade.pnl || 0,
        cumulative
      };
    });

    // Asset type distribution
    const assetTypes = trades.reduce((acc, trade) => {
      const type = trade.assetType || 'Unknown';
      if (!acc[type]) {
        acc[type] = { count: 0, volume: 0 };
      }
      acc[type].count++;
      // Support both 'size' and 'quantity' field names  
      const quantity = (trade as any).size || (trade as any).quantity || 0;
      acc[type].volume += quantity * trade.entryPrice;
      return acc;
    }, {} as Record<string, { count: number; volume: number }>);

    const assetTypeDistribution = Object.entries(assetTypes).map(([name, data]) => ({
      name,
      value: (data as { count: number; volume: number }).volume,
      trades: (data as { count: number; volume: number }).count
    }));

    // Monthly performance
    const monthlyData = closedTrades.reduce((acc, trade) => {
      // Safe date parsing
      const dateValue = (trade as any).entryDateTime || (trade as any).entryDate || Date.now();
      const tradeDate = new Date(dateValue);
      
      if (isNaN(tradeDate.getTime())) {
        tradeDate.setTime(Date.now()); // Fallback to current time
      }
      
      const month = tradeDate.toISOString().slice(0, 7); // YYYY-MM
      if (!acc[month]) {
        acc[month] = { pnl: 0, trades: 0 };
      }
      acc[month].pnl += trade.pnl || 0;
      acc[month].trades++;
      return acc;
    }, {} as Record<string, { pnl: number; trades: number }>);

    const monthlyPerformance = Object.entries(monthlyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, data]) => ({
        month,
        pnl: (data as { pnl: number; trades: number }).pnl,
        trades: (data as { pnl: number; trades: number }).trades
      }));

    // Recent trades (last 5)
    const recentTrades = [...trades]
      .sort((a, b) => {
        // Safe date parsing for recent trades sorting
        const dateValueA = (a as any).entryDateTime || (a as any).entryDate || Date.now();
        const dateValueB = (b as any).entryDateTime || (b as any).entryDate || Date.now();
        
        const dateA = new Date(dateValueA);
        const dateB = new Date(dateValueB);
        
        // Check if dates are valid
        if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
          return 0; // Keep original order if dates are invalid
        }
        
        return dateB.getTime() - dateA.getTime(); // Most recent first
      })
      .slice(0, 5);

    const result = {
      totalTrades: trades.length,
      openTrades: openTrades.length,
      closedTrades: closedTrades.length,
      activePositions: openTrades.length, // Same as openTrades
      totalPnL,
      totalVolume,
      winningTrades: winningTrades.length,
      losingTrades: losingTrades.length,
      winRate,
      averageWin,
      averageLoss,
      profitFactor,
      maxDrawdown,
      bestTrade,
      worstTrade,
      recentTrades,
      pnlOverTime,
      assetTypeDistribution,
      monthlyPerformance,
    };

    return result;
  }, [trades]);

  const refreshData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.trades.list();
      
      if (Array.isArray(response)) {
        setTrades(response);
      } else {
        setTrades([]);
      }
    } catch (error) {
      console.error('Refresh error:', error);
      setError(error instanceof Error ? error.message : 'Failed to refresh data');
    } finally {
      setLoading(false);
    }
  };

  return {
    analytics,
    loading,
    error,
    refetch: refreshData, // Alias for compatibility
  };
};
