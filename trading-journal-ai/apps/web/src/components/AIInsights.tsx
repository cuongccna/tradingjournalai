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

    // Strategy Performance Analysis
    const strategyPerformance = analytics.recentTrades.reduce((acc, trade) => {
      if (trade.strategy && trade.status === 'CLOSED' && trade.pnl !== undefined) {
        if (!acc[trade.strategy]) {
          acc[trade.strategy] = { trades: 0, totalPnL: 0, wins: 0 };
        }
        acc[trade.strategy].trades++;
        acc[trade.strategy].totalPnL += trade.pnl;
        if (trade.pnl > 0) acc[trade.strategy].wins++;
      }
      return acc;
    }, {} as Record<string, { trades: number; totalPnL: number; wins: number }>);

    const bestStrategy = Object.entries(strategyPerformance)
      .sort(([,a], [,b]) => b.totalPnL - a.totalPnL)[0];

    if (bestStrategy && bestStrategy[1].trades >= 2) {
      const winRate = (bestStrategy[1].wins / bestStrategy[1].trades) * 100;
      insights.push({
        type: 'success',
        title: `Best Strategy: ${bestStrategy[0]}`,
        message: `"${bestStrategy[0]}" shows ${bestStrategy[1].totalPnL.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} profit with ${winRate.toFixed(1)}% win rate across ${bestStrategy[1].trades} trades.`,
        icon: '🎯',
        priority: 1
      });
    }

    // Tag-based Insights
    const tagAnalysis = analytics.recentTrades.reduce((acc, trade) => {
      if (trade.tags && trade.status === 'CLOSED' && trade.pnl !== undefined) {
        trade.tags.forEach(tag => {
          if (!acc[tag]) {
            acc[tag] = { trades: 0, totalPnL: 0, wins: 0 };
          }
          acc[tag].trades++;
          acc[tag].totalPnL += trade.pnl!;
          if (trade.pnl! > 0) acc[tag].wins++;
        });
      }
      return acc;
    }, {} as Record<string, { trades: number; totalPnL: number; wins: number }>);

    const bestTag = Object.entries(tagAnalysis)
      .filter(([,data]) => data.trades >= 2)
      .sort(([,a], [,b]) => b.totalPnL - a.totalPnL)[0];

    if (bestTag) {
      const winRate = (bestTag[1].wins / bestTag[1].trades) * 100;
      insights.push({
        type: 'info',
        title: `Profitable Tag: #${bestTag[0]}`,
        message: `Trades tagged with "${bestTag[0]}" show strong performance: ${bestTag[1].totalPnL.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} profit, ${winRate.toFixed(1)}% win rate.`,
        icon: '🏷️',
        priority: 2
      });
    }

    // Notes Pattern Analysis
    const commonNotesWords = analytics.recentTrades
      .filter(trade => trade.notes && trade.status === 'CLOSED' && trade.pnl && trade.pnl > 0)
      .map(trade => trade.notes!.toLowerCase().split(/\s+/))
      .flat()
      .filter(word => word.length > 3)
      .reduce((acc, word) => {
        acc[word] = (acc[word] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    const topNoteWord = Object.entries(commonNotesWords)
      .sort(([,a], [,b]) => b - a)[0];

    if (topNoteWord && topNoteWord[1] >= 2) {
      insights.push({
        type: 'info',
        title: `Winning Pattern: "${topNoteWord[0]}"`,
        message: `The word "${topNoteWord[0]}" appears ${topNoteWord[1]} times in profitable trade notes. This might indicate a successful pattern.`,
        icon: '📝',
        priority: 3
      });
    }

    // Win streak detection
    let currentStreak = 0;
    const recentClosedTrades = analytics.recentTrades
      .filter(trade => trade.status === 'CLOSED' && trade.pnl !== undefined)
      .sort((a, b) => new Date(b.entryDate).getTime() - new Date(a.entryDate).getTime());

    for (const trade of recentClosedTrades) {
      if (trade.pnl! > 0) {
        currentStreak++;
      } else {
        break;
      }
    }

    if (currentStreak >= 3) {
      insights.push({
        type: 'success',
        title: `${currentStreak}-Trade Winning Streak!`,
        message: `You're on fire! ${currentStreak} consecutive winning trades. Great momentum!`,
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

    // Advanced Pattern Recognition
    const timeBasedAnalysis = analytics.recentTrades
      .filter(trade => trade.status === 'CLOSED' && trade.pnl !== undefined)
      .reduce((acc, trade) => {
        const hour = new Date(trade.entryDate).getHours();
        const timeSlot = hour < 9 ? 'Pre-Market' : 
                        hour < 12 ? 'Morning' : 
                        hour < 16 ? 'Afternoon' : 'After-Hours';
        
        if (!acc[timeSlot]) {
          acc[timeSlot] = { trades: 0, totalPnL: 0, wins: 0 };
        }
        acc[timeSlot].trades++;
        acc[timeSlot].totalPnL += trade.pnl!;
        if (trade.pnl! > 0) acc[timeSlot].wins++;
        
        return acc;
      }, {} as Record<string, { trades: number; totalPnL: number; wins: number }>);

    const bestTimeSlot = Object.entries(timeBasedAnalysis)
      .filter(([,data]) => data.trades >= 3)
      .sort(([,a], [,b]) => (b.wins/b.trades) - (a.wins/a.trades))[0];

    if (bestTimeSlot) {
      const winRate = (bestTimeSlot[1].wins / bestTimeSlot[1].trades) * 100;
      insights.push({
        type: 'info',
        title: `Optimal Trading Time: ${bestTimeSlot[0]}`,
        message: `${bestTimeSlot[0]} trading shows ${winRate.toFixed(1)}% win rate with ${bestTimeSlot[1].totalPnL.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} total profit.`,
        icon: '⏰',
        priority: 2
      });
    }

    // Risk-Reward Analysis
    const riskRewardTrades = analytics.recentTrades
      .filter(trade => trade.status === 'CLOSED' && trade.pnl !== undefined)
      .map(trade => {
        const risk = Math.abs(trade.entryPrice - (trade.exitPrice || trade.entryPrice));
        const reward = Math.abs(trade.pnl!);
        return { risk, reward, ratio: reward / (risk * trade.quantity) };
      })
      .filter(trade => trade.risk > 0);

    if (riskRewardTrades.length >= 3) {
      const avgRiskReward = riskRewardTrades.reduce((sum, trade) => sum + trade.ratio, 0) / riskRewardTrades.length;
      if (avgRiskReward > 2) {
        insights.push({
          type: 'success',
          title: 'Excellent Risk Management',
          message: `Average risk-reward ratio of ${avgRiskReward.toFixed(2)}:1 indicates strong position sizing discipline.`,
          icon: '⚖️',
          priority: 1
        });
      } else if (avgRiskReward < 1) {
        insights.push({
          type: 'warning',
          title: 'Risk-Reward Needs Attention',
          message: `Current average risk-reward ratio: ${avgRiskReward.toFixed(2)}:1. Consider improving exit strategies.`,
          icon: '⚠️',
          priority: 1
        });
      }
    }

    // Symbol Performance Analysis
    const symbolPerformance = analytics.recentTrades
      .filter(trade => trade.status === 'CLOSED' && trade.pnl !== undefined)
      .reduce((acc, trade) => {
        if (!acc[trade.symbol]) {
          acc[trade.symbol] = { trades: 0, totalPnL: 0, wins: 0 };
        }
        acc[trade.symbol].trades++;
        acc[trade.symbol].totalPnL += trade.pnl!;
        if (trade.pnl! > 0) acc[trade.symbol].wins++;
        return acc;
      }, {} as Record<string, { trades: number; totalPnL: number; wins: number }>);

    const bestSymbol = Object.entries(symbolPerformance)
      .filter(([,data]) => data.trades >= 2)
      .sort(([,a], [,b]) => b.totalPnL - a.totalPnL)[0];

    if (bestSymbol) {
      const winRate = (bestSymbol[1].wins / bestSymbol[1].trades) * 100;
      insights.push({
        type: 'success',
        title: `Top Performer: ${bestSymbol[0]}`,
        message: `${bestSymbol[0]} is your strongest asset with ${bestSymbol[1].totalPnL.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} profit and ${winRate.toFixed(1)}% win rate.`,
        icon: '📊',
        priority: 2
      });
    }

    // Momentum Analysis
    if (analytics.recentTrades.length >= 10) {
      const last10Trades = analytics.recentTrades
        .filter(trade => trade.status === 'CLOSED' && trade.pnl !== undefined)
        .slice(0, 10);
      
      const recentWins = last10Trades.filter(trade => trade.pnl! > 0).length;
      const recentPnL = last10Trades.reduce((sum, trade) => sum + trade.pnl!, 0);
      
      if (recentWins >= 7) {
        insights.push({
          type: 'success',
          title: 'Strong Recent Momentum',
          message: `${recentWins}/10 recent trades profitable with ${recentPnL.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} net gain. Keep the momentum!`,
          icon: '🚀',
          priority: 1
        });
      } else if (recentWins <= 3) {
        insights.push({
          type: 'warning',
          title: 'Recent Struggles Detected',
          message: `Only ${recentWins}/10 recent trades profitable. Consider reviewing your strategy or taking a break.`,
          icon: '📉',
          priority: 1
        });
      }
    }

    // Sort by priority and return top insights
    return insights.sort((a, b) => a.priority - b.priority).slice(0, 6);
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
          🤖 AI Trading Assistant
          <span className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded-full font-normal">
            Live Analysis
          </span>
        </CardTitle>
        <CardDescription>
          AI-powered insights from your trading patterns • {analytics.totalTrades} trades analyzed
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className={`text-xl font-bold ${analytics.totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {analytics.totalPnL.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
              </div>
              <div className="text-xs text-gray-500">Total P&L</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-blue-600">{analytics.winRate.toFixed(1)}%</div>
              <div className="text-xs text-gray-500">Win Rate</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-purple-600">{analytics.profitFactor.toFixed(2)}</div>
              <div className="text-xs text-gray-500">Profit Factor</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-orange-600">{analytics.activePositions}</div>
              <div className="text-xs text-gray-500">Open Trades</div>
            </div>
          </div>

          {/* AI Insights */}
          {insights.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              <div className="text-3xl mb-2">🤖</div>
              <p>AI analysis in progress...</p>
              <p className="text-sm">More insights will appear as you trade more</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {insights.map((insight, index) => (
                <div 
                  key={index}
                  className={`p-4 rounded-lg border transition-all hover:shadow-md ${getInsightStyle(insight.type)}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`text-xl ${getIconColor(insight.type)}`}>
                      {insight.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{insight.title}</h4>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          insight.priority === 1 ? 'bg-red-100 text-red-700' :
                          insight.priority === 2 ? 'bg-yellow-100 text-yellow-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {insight.priority === 1 ? 'High' : insight.priority === 2 ? 'Medium' : 'Low'} Priority
                        </span>
                      </div>
                      <p className="text-sm opacity-90">{insight.message}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Action buttons */}
          <div className="pt-4 border-t">
            <div className="flex flex-wrap gap-2">
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors">
                📊 View Detailed Analysis
              </button>
              <span className="text-gray-300">|</span>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors">
                🎯 Get Trading Recommendations
              </button>
              <span className="text-gray-300">|</span>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors">
                📈 Pattern Recognition
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
