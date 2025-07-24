'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useMemo } from 'react';

interface Trade {
  id: string;
  symbol: string;
  assetType: 'STOCK' | 'FOREX' | 'CRYPTO' | 'FUTURES' | 'OPTIONS';
  side: 'BUY' | 'SELL';
  quantity: number;
  entryPrice: number;
  exitPrice?: number;
  entryDate: string;
  exitDate?: string;
  pnl?: number;
  fees?: number;
  status: 'OPEN' | 'CLOSED';
  strategy?: string;
  notes?: string;
  tags?: string[];
}

interface DashboardAnalytics {
  totalPnL: number;
  totalTrades: number;
  winRate: number;
  activePositions: number;
  totalVolume: number;
  winningTrades: number;
  losingTrades: number;
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

interface AIInsight {
  type: 'success' | 'warning' | 'info' | 'danger';
  title: string;
  message: string;
  icon: string;
  priority: number;
}

interface AIInsightsProps {
  analytics: DashboardAnalytics;
}

export const AIInsights = ({ analytics }: AIInsightsProps) => {
  const insights = useMemo((): AIInsight[] => {
    const insights: AIInsight[] = [];

    // Win streak detection
    const recentWins = analytics.recentTrades
      .filter(trade => trade.status === 'CLOSED' && trade.pnl)
      .slice(0, 10)
      .reduce((streak, trade) => {
        if (trade.pnl! > 0) return streak + 1;
        return 0;
      }, 0);

    if (recentWins >= 3) {
      insights.push({
        type: 'success',
        title: `${recentWins}-Trade Winning Streak!`,
        message: `You're on fire! ${recentWins} consecutive winning trades. Great risk management!`,
        icon: '🔥',
        priority: 1
      });
    }

    // Risk management alerts
    const assetConcentration = analytics.assetTypeDistribution.reduce((max, asset) => {
      const percentage = (asset.trades / analytics.totalTrades) * 100;
      return percentage > max.percentage ? { name: asset.name, percentage } : max;
    }, { name: '', percentage: 0 });

    if (assetConcentration.percentage > 70) {
      insights.push({
        type: 'warning',
        title: 'High Concentration Risk',
        message: `${assetConcentration.percentage.toFixed(1)}% of trades in ${assetConcentration.name}. Consider diversification.`,
        icon: '⚠️',
        priority: 2
      });
    }

    // Profit factor analysis
    if (analytics.profitFactor > 2) {
      insights.push({
        type: 'success',
        title: 'Excellent Profit Factor',
        message: `Profit factor of ${analytics.profitFactor.toFixed(2)} indicates strong trading edge.`,
        icon: '🎯',
        priority: 3
      });
    } else if (analytics.profitFactor < 1) {
      insights.push({
        type: 'danger',
        title: 'Profit Factor Below 1.0',
        message: `Current profit factor: ${analytics.profitFactor.toFixed(2)}. Review your strategy.`,
        icon: '🚨',
        priority: 1
      });
    }

    // Win rate insights
    if (analytics.winRate > 60) {
      insights.push({
        type: 'success',
        title: 'High Win Rate Detected',
        message: `${analytics.winRate.toFixed(1)}% win rate is excellent. Focus on position sizing.`,
        icon: '🏆',
        priority: 2
      });
    } else if (analytics.winRate < 40) {
      insights.push({
        type: 'warning',
        title: 'Low Win Rate Alert',
        message: `${analytics.winRate.toFixed(1)}% win rate. Consider refining entry criteria.`,
        icon: '📉',
        priority: 2
      });
    }

    // Drawdown alerts
    if (analytics.maxDrawdown > Math.abs(analytics.totalPnL) * 0.2) {
      insights.push({
        type: 'danger',
        title: 'High Drawdown Risk',
        message: `Max drawdown of $${analytics.maxDrawdown.toLocaleString()} is significant. Review risk management.`,
        icon: '⬇️',
        priority: 1
      });
    }

    // Trading frequency
    const avgTradesPerDay = analytics.totalTrades / 30; // Assuming last 30 days
    if (avgTradesPerDay > 5) {
      insights.push({
        type: 'info',
        title: 'High Trading Frequency',
        message: `${avgTradesPerDay.toFixed(1)} trades/day. Ensure quality over quantity.`,
        icon: '📊',
        priority: 3
      });
    }

    // Best performing strategy
    const strategies = analytics.recentTrades
      .filter(trade => trade.strategy && trade.status === 'CLOSED' && trade.pnl)
      .reduce((acc, trade) => {
        const strategy = trade.strategy!;
        if (!acc[strategy]) {
          acc[strategy] = { pnl: 0, count: 0 };
        }
        acc[strategy].pnl += trade.pnl!;
        acc[strategy].count += 1;
        return acc;
      }, {} as Record<string, { pnl: number; count: number }>);

    const bestStrategy = Object.entries(strategies).reduce((best, [name, data]) => {
      const avgPnL = data.pnl / data.count;
      return avgPnL > best.avgPnL ? { name, avgPnL, count: data.count } : best;
    }, { name: '', avgPnL: 0, count: 0 });

    if (bestStrategy.name && bestStrategy.count >= 3) {
      insights.push({
        type: 'info',
        title: 'Top Performing Strategy',
        message: `"${bestStrategy.name}" averaging $${bestStrategy.avgPnL.toFixed(0)} per trade (${bestStrategy.count} trades).`,
        icon: '💡',
        priority: 3
      });
    }

    // Recent performance trend
    const last5Trades = analytics.recentTrades
      .filter(trade => trade.status === 'CLOSED' && trade.pnl)
      .slice(0, 5);
    
    if (last5Trades.length >= 5) {
      const recentPnL = last5Trades.reduce((sum, trade) => sum + (trade.pnl || 0), 0);
      if (recentPnL > 0) {
        insights.push({
          type: 'success',
          title: 'Strong Recent Performance',
          message: `Last 5 trades generated $${recentPnL.toLocaleString()} profit.`,
          icon: '📈',
          priority: 2
        });
      }
    }

    // Sort by priority and return top insights
    return insights.sort((a, b) => a.priority - b.priority).slice(0, 4);
  }, [analytics]);

  const getInsightStyle = (type: string) => {
    const styles = {
      success: 'bg-green-50 border-green-200 text-green-800',
      warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      info: 'bg-blue-50 border-blue-200 text-blue-800',
      danger: 'bg-red-50 border-red-200 text-red-800'
    };
    return styles[type as keyof typeof styles] || styles.info;
  };

  const getIconColor = (type: string) => {
    const colors = {
      success: 'text-green-600',
      warning: 'text-yellow-600',
      info: 'text-blue-600',
      danger: 'text-red-600'
    };
    return colors[type as keyof typeof colors] || colors.info;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🤖 AI Insights
        </CardTitle>
        <CardDescription>Smart recommendations based on your trading patterns</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              <div className="text-3xl mb-2">🤖</div>
              <p>AI analysis in progress...</p>
              <p className="text-sm">More insights will appear as you trade more</p>
            </div>
          ) : (
            insights.map((insight, index) => (
              <div 
                key={index}
                className={`p-4 rounded-lg border transition-all hover:shadow-md ${getInsightStyle(insight.type)}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`text-xl ${getIconColor(insight.type)}`}>
                    {insight.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">{insight.title}</h4>
                    <p className="text-sm opacity-90">{insight.message}</p>
                  </div>
                </div>
              </div>
            ))
          )}
          
          {/* Action buttons */}
          <div className="pt-4 border-t">
            <div className="flex gap-2">
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors">
                📊 View Detailed Analysis
              </button>
              <span className="text-gray-300">|</span>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors">
                🎯 Get Trading Recommendations
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
