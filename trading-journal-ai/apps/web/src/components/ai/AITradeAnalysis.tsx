'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useDashboardAnalytics } from '@/hooks/useDashboardAnalytics';
import { useLanguage } from '@/lib/i18n/LanguageProvider';
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Target,
  BarChart3,
  Lightbulb,
  Zap,
  RefreshCw
} from 'lucide-react';

interface AIInsight {
  id: string;
  type: 'pattern' | 'risk' | 'opportunity' | 'performance';
  title: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  actionable: boolean;
  relatedTrades?: string[];
}

interface TradeAnalysis {
  tradeId: string;
  symbol: string;
  aiScore: number;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  riskLevel: 'low' | 'medium' | 'high';
  predictedOutcome: 'profit' | 'loss' | 'breakeven';
  confidence: number;
  reasons: string[];
  recommendations: string[];
}

export default function AITradeAnalysis() {
  const { t } = useLanguage();
  const { analytics, loading: analyticsLoading, error } = useDashboardAnalytics();
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [tradeAnalysis, setTradeAnalysis] = useState<TradeAnalysis[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    if (analytics && !analyticsLoading) {
      generateAIInsights();
    }
  }, [analytics, analyticsLoading]);

  const generateAIInsights = async () => {
    if (!analytics) return;
    
    setLoading(true);
    
    // Generate insights based on real data
    const insights: AIInsight[] = [];
    const tradeAnalysis: TradeAnalysis[] = [];

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
        id: 'strategy-1',
        type: 'pattern',
        title: `Best Strategy: ${bestStrategy[0]}`,
        description: `"${bestStrategy[0]}" shows ${bestStrategy[1].totalPnL.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} profit with ${winRate.toFixed(1)}% win rate across ${bestStrategy[1].trades} trades.`,
        confidence: Math.min(95, 70 + winRate * 0.3),
        impact: bestStrategy[1].totalPnL > 1000 ? 'high' : 'medium',
        actionable: true,
        relatedTrades: analytics.recentTrades.filter(t => t.strategy === bestStrategy[0]).map(t => t.id)
      });
    }

    // Risk concentration analysis
    const assetConcentration = analytics.assetTypeDistribution.reduce((max, asset) => {
      const percentage = (asset.trades / analytics.totalTrades) * 100;
      return percentage > max.percentage ? { name: asset.name, percentage } : max;
    }, { name: '', percentage: 0 });

    if (assetConcentration.percentage > 70) {
      insights.push({
        id: 'risk-1',
        type: 'risk',
        title: 'High Concentration Risk',
        description: `${assetConcentration.percentage.toFixed(1)}% of trades in ${assetConcentration.name}. Consider diversification to reduce portfolio risk.`,
        confidence: 92,
        impact: 'high',
        actionable: true
      });
    }

    // Win rate analysis
    if (analytics.winRate > 60) {
      insights.push({
        id: 'performance-1',
        type: 'performance',
        title: 'Excellent Win Rate',
        description: `${analytics.winRate.toFixed(1)}% win rate is above average. Current strategy is showing strong results.`,
        confidence: 89,
        impact: 'medium',
        actionable: false
      });
    } else if (analytics.winRate < 40) {
      insights.push({
        id: 'opportunity-1',
        type: 'opportunity',
        title: 'Win Rate Improvement Needed',
        description: `${analytics.winRate.toFixed(1)}% win rate suggests room for improvement. Consider refining entry criteria.`,
        confidence: 85,
        impact: 'high',
        actionable: true
      });
    }

    // Profit factor analysis
    if (analytics.profitFactor > 2) {
      insights.push({
        id: 'performance-2',
        type: 'performance',
        title: 'Strong Profit Factor',
        description: `Profit factor of ${analytics.profitFactor.toFixed(2)} indicates excellent risk-reward management.`,
        confidence: 88,
        impact: 'high',
        actionable: false
      });
    } else if (analytics.profitFactor < 1) {
      insights.push({
        id: 'risk-2',
        type: 'risk',
        title: 'Profit Factor Below 1.0',
        description: `Current profit factor: ${analytics.profitFactor.toFixed(2)}. Review strategy to ensure profitability.`,
        confidence: 95,
        impact: 'high',
        actionable: true
      });
    }

    // Generate trade analysis for recent trades
    analytics.recentTrades.slice(0, 5).forEach(trade => {
      let aiScore = 5.0;
      let sentiment: 'bullish' | 'bearish' | 'neutral' = 'neutral';
      let riskLevel: 'low' | 'medium' | 'high' = 'medium';
      let predictedOutcome: 'profit' | 'loss' | 'breakeven' = 'breakeven';
      let confidence = 50;
      const reasons: string[] = [];
      const recommendations: string[] = [];

      // Analyze based on strategy performance
      if (trade.strategy && strategyPerformance[trade.strategy]) {
        const stratData = strategyPerformance[trade.strategy];
        const strategyWinRate = (stratData.wins / stratData.trades) * 100;
        
        if (strategyWinRate > 60) {
          aiScore += 2.0;
          sentiment = 'bullish';
          confidence += 20;
          reasons.push(`Strategy "${trade.strategy}" has ${strategyWinRate.toFixed(1)}% win rate`);
        } else if (strategyWinRate < 40) {
          aiScore -= 1.5;
          sentiment = 'bearish';
          reasons.push(`Strategy "${trade.strategy}" has low ${strategyWinRate.toFixed(1)}% win rate`);
        }
      }

      // Analyze based on actual outcome if closed
      if (trade.status === 'CLOSED' && trade.pnl !== undefined) {
        if (trade.pnl > 0) {
          aiScore += 1.0;
          predictedOutcome = 'profit';
          confidence += 15;
          reasons.push('Trade closed profitably');
        } else {
          aiScore -= 1.0;
          predictedOutcome = 'loss';
          reasons.push('Trade closed at loss');
        }
      }

      // Risk level based on asset type and size
      if (trade.assetType === 'CRYPTO') {
        riskLevel = 'high';
        reasons.push('Crypto assets have high volatility');
        recommendations.push('Monitor closely for price swings');
      } else if (trade.assetType === 'STOCK') {
        riskLevel = 'medium';
        reasons.push('Stock trading with moderate risk');
      }

      // Position sizing recommendations
      const positionValue = trade.quantity * trade.entryPrice;
      if (positionValue > 10000) {
        riskLevel = riskLevel === 'low' ? 'medium' : 'high';
        recommendations.push('Large position - consider partial profit taking');
      }

      // General recommendations
      if (trade.status === 'OPEN') {
        recommendations.push('Set stop loss at -5%');
        recommendations.push('Consider taking profit at +10%');
      }

      tradeAnalysis.push({
        tradeId: trade.id,
        symbol: trade.symbol,
        aiScore: Math.max(1, Math.min(10, aiScore)),
        sentiment,
        riskLevel,
        predictedOutcome,
        confidence: Math.max(10, Math.min(95, confidence)),
        reasons: reasons.length > 0 ? reasons : ['Standard market conditions'],
        recommendations: recommendations.length > 0 ? recommendations : ['Follow your trading plan']
      });
    });

    setInsights(insights);
    setTradeAnalysis(tradeAnalysis);
    setLastUpdated(new Date());
    setLoading(false);
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'pattern': return <BarChart3 className="h-5 w-5" />;
      case 'risk': return <AlertTriangle className="h-5 w-5" />;
      case 'opportunity': return <Target className="h-5 w-5" />;
      case 'performance': return <TrendingUp className="h-5 w-5" />;
      default: return <Brain className="h-5 w-5" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'pattern': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'risk': return 'bg-red-100 text-red-800 border-red-200';
      case 'opportunity': return 'bg-green-100 text-green-800 border-green-200';
      case 'performance': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'bearish': return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <div className="h-4 w-4 bg-gray-400 rounded-full"></div>;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Brain className="h-6 w-6 text-blue-600" />
            {t.ai.tradeAnalysisTitle}
            <Badge className="bg-green-100 text-green-700 ml-2">
              {t.ai.liveData}
            </Badge>
          </h2>
          <p className="text-gray-600 mt-1">
            AI-powered insights from your {analytics?.totalTrades || 0} trades • Real-time analysis
          </p>
        </div>
        <div className="flex items-center gap-4">
          {lastUpdated && (
            <p className="text-sm text-gray-500">
              {t.ai.updated} {lastUpdated.toLocaleTimeString()}
            </p>
          )}
          <Button 
            onClick={generateAIInsights} 
            disabled={loading || analyticsLoading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${(loading || analyticsLoading) ? 'animate-spin' : ''}`} />
            {t.ai.refreshAnalysis}
          </Button>
        </div>
      </div>

      {/* Show loading or error states */}
      {analyticsLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Brain className="h-12 w-12 text-blue-500 animate-pulse mx-auto mb-4" />
            <p className="text-gray-600">{t.ai.loadingTradingData}</p>
          </div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600">{t.ai.errorLoadingData} {error}</p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              {t.ai.retry}
            </Button>
          </div>
        </div>
      ) : !analytics || analytics.totalTrades === 0 ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">{t.ai.noTradesFound}</p>
          </div>
        </div>
      ) : loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Brain className="h-12 w-12 text-blue-500 animate-pulse mx-auto mb-4" />
            <p className="text-gray-600">{t.ai.aiAnalyzing}</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* AI Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                {t.ai.aiInsights}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {insights.map((insight) => (
                  <div key={insight.id} className="p-4 rounded-lg border border-gray-200">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getInsightIcon(insight.type)}
                        <Badge className={getInsightColor(insight.type)}>
                          {insight.type.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">
                          {insight.confidence}% confidence
                        </span>
                        {insight.impact === 'high' && (
                          <Zap className="h-4 w-4 text-orange-500" />
                        )}
                      </div>
                    </div>
                    
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {insight.title}
                    </h4>
                    <p className="text-sm text-gray-600 mb-3">
                      {insight.description}
                    </p>
                    
                    {insight.actionable && (
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          Actionable
                        </Badge>
                        <Button size="sm" variant="ghost" className="text-xs">
                          View Details
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Trade Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-green-500" />
                {t.ai.tradeAnalysis}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tradeAnalysis.map((analysis) => (
                  <div key={analysis.tradeId} className="p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-lg">{analysis.symbol}</h4>
                        {getSentimentIcon(analysis.sentiment)}
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-blue-600">
                          {analysis.aiScore}/10
                        </div>
                        <div className="text-xs text-gray-500">{t.ai.aiScore}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <span className="text-xs text-gray-500">{t.ai.riskLevel}</span>
                        <Badge className={`ml-2 ${getRiskColor(analysis.riskLevel)}`}>
                          {analysis.riskLevel.toUpperCase()}
                        </Badge>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500">{t.ai.prediction}</span>
                        <span className="ml-2 text-sm font-medium capitalize">
                          {analysis.predictedOutcome}
                        </span>
                      </div>
                    </div>

                    <div className="mb-3">
                      <h5 className="text-sm font-medium text-gray-700 mb-1">{t.ai.aiReasoning}</h5>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {analysis.reasons.slice(0, 2).map((reason, index) => (
                          <li key={index} className="flex items-start gap-1">
                            <span className="text-blue-500">•</span>
                            {reason}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-1">{t.ai.recommendations}</h5>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {analysis.recommendations.slice(0, 2).map((rec, index) => (
                          <li key={index} className="flex items-start gap-1">
                            <span className="text-green-500">✓</span>
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-3 pt-3 border-t flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        {t.ai.confidence}: {analysis.confidence}%
                      </span>
                      <Button size="sm" variant="outline" className="text-xs">
                        {t.ai.viewFullAnalysis}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
