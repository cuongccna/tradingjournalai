'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useDashboardAnalytics } from '@/hooks/useDashboardAnalytics';
import { useLanguage } from '@/lib/i18n/LanguageProvider';
import { 
  TrendingUp, 
  TrendingDown,
  BarChart3,
  Target,
  AlertCircle,
  Clock,
  Star,
  Eye,
  Activity,
  Zap
} from 'lucide-react';

interface TradingPattern {
  id: string;
  name: string;
  type: 'bullish' | 'bearish' | 'neutral';
  confidence: number;
  symbol: string;
  description: string;
  entryPrice: number;
  target1: number;
  target2?: number;
  stopLoss: number;
  timeframe: string;
  riskReward: number;
  probability: number;
  historicalAccuracy: number;
  relatedTrades?: string[];
}

interface PerformanceMetric {
  pattern: string;
  totalOccurrences: number;
  successfulTrades: number;
  successRate: number;
  avgReturn: number;
  bestReturn: number;
  worstReturn: number;
  avgHoldingPeriod: number;
}

export default function PatternRecognition() {
  const { analytics, loading: analyticsLoading, error } = useDashboardAnalytics();
  const { t } = useLanguage();
  const [patterns, setPatterns] = useState<TradingPattern[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetric[]>([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'1D' | '1W' | '1M'>('1D');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (analytics && !analyticsLoading) {
      scanForPatterns();
    }
  }, [analytics, analyticsLoading, selectedTimeframe]);

  const scanForPatterns = async () => {
    if (!analytics) return;
    
    setLoading(true);
    
    // Generate patterns based on real trade data
    const patterns: TradingPattern[] = [];
    const performanceMetrics: PerformanceMetric[] = [];

    // Analyze trading patterns from actual trades
    const symbolGroups = analytics.recentTrades.reduce((acc, trade) => {
      if (!acc[trade.symbol]) {
        acc[trade.symbol] = [];
      }
      acc[trade.symbol].push(trade);
      return acc;
    }, {} as Record<string, typeof analytics.recentTrades>);

    // Generate patterns for symbols with multiple trades
    Object.entries(symbolGroups).forEach(([symbol, trades]) => {
      if (trades.length >= 2) {
        const closedTrades = trades.filter(t => t.status === 'closed' && t.pnl !== undefined);
        const winningTrades = closedTrades.filter(t => t.pnl! > 0);
        const successRate = closedTrades.length > 0 ? (winningTrades.length / closedTrades.length) * 100 : 0;
        
        if (successRate > 60) {
          // Bullish pattern detected
          patterns.push({
            id: `${symbol}-bullish`,
            name: (t as any).ai.winningStrategyPattern,
            type: 'bullish',
            confidence: Math.min(95, 50 + successRate * 0.5),
            symbol,
            description: `${symbol} shows consistent profitable patterns. ${winningTrades.length} out of ${closedTrades.length} trades were profitable.`,
            entryPrice: trades[0].entryPrice,
            target1: trades[0].entryPrice * 1.05,
            target2: trades[0].entryPrice * 1.10,
            stopLoss: trades[0].entryPrice * 0.95,
            timeframe: '1D',
            riskReward: 2.0,
            probability: successRate,
            historicalAccuracy: successRate,
            relatedTrades: trades.map(t => t.id!).filter(Boolean)
          });
        } else if (successRate < 40 && closedTrades.length >= 3) {
          // Bearish pattern detected
          patterns.push({
            id: `${symbol}-bearish`,
            name: (t as any).ai.lossPatternAlert,
            type: 'bearish',
            confidence: 80,
            symbol,
            description: `${symbol} shows concerning pattern with ${successRate.toFixed(1)}% success rate. Consider avoiding or revising strategy.`,
            entryPrice: trades[0].entryPrice,
            target1: trades[0].entryPrice * 0.95,
            stopLoss: trades[0].entryPrice * 1.05,
            timeframe: '1D',
            riskReward: 1.0,
            probability: 100 - successRate,
            historicalAccuracy: 100 - successRate,
            relatedTrades: trades.map(t => t.id!).filter(Boolean)
          });
        }

        // Add to performance metrics
        if (closedTrades.length > 0) {
          const avgReturn = closedTrades.reduce((sum, t) => sum + (t.pnl! / (t.entryPrice * t.size) * 100), 0) / closedTrades.length;
          const returns = closedTrades.map(t => t.pnl! / (t.entryPrice * t.size) * 100);
          
          performanceMetrics.push({
            pattern: symbol,
            totalOccurrences: trades.length,
            successfulTrades: winningTrades.length,
            successRate,
            avgReturn,
            bestReturn: Math.max(...returns),
            worstReturn: Math.min(...returns),
            avgHoldingPeriod: 2 // Simplified
          });
        }
      }
    });

    // Strategy-based patterns
    const strategyGroups = analytics.recentTrades.reduce((acc, trade) => {
      if (trade.strategyId) {
        if (!acc[trade.strategyId]) {
          acc[trade.strategyId] = [];
        }
        acc[trade.strategyId].push(trade);
      }
      return acc;
    }, {} as Record<string, typeof analytics.recentTrades>);

    Object.entries(strategyGroups).forEach(([strategy, trades]) => {
      const closedTrades = trades.filter(t => t.status === 'closed' && t.pnl !== undefined);
      if (closedTrades.length >= 2) {
        const winningTrades = closedTrades.filter(t => t.pnl! > 0);
        const successRate = (winningTrades.length / closedTrades.length) * 100;
        
        patterns.push({
          id: `strategy-${strategy}`,
          name: `${strategy} Pattern`,
          type: successRate > 50 ? 'bullish' : 'bearish',
          confidence: Math.abs(successRate - 50) + 50,
          symbol: 'STRATEGY',
          description: `"${strategy}" strategy shows ${successRate.toFixed(1)}% success rate across ${closedTrades.length} trades.`,
          entryPrice: 0,
          target1: 0,
          stopLoss: 0,
          timeframe: 'ALL',
          riskReward: successRate > 50 ? 2.0 : 0.5,
          probability: successRate,
          historicalAccuracy: successRate,
          relatedTrades: trades.map(t => t.id!).filter(Boolean)
        });

        // Add strategy performance metrics
        const avgReturn = closedTrades.reduce((sum, t) => sum + (t.pnl! / (t.entryPrice * t.size) * 100), 0) / closedTrades.length;
        const returns = closedTrades.map(t => t.pnl! / (t.entryPrice * t.size) * 100);
        
        performanceMetrics.push({
          pattern: strategy,
          totalOccurrences: trades.length,
          successfulTrades: winningTrades.length,
          successRate,
          avgReturn,
          bestReturn: Math.max(...returns),
          worstReturn: Math.min(...returns),
          avgHoldingPeriod: 5 // Simplified
        });
      }
    });

    setPatterns(patterns);
    setPerformanceMetrics(performanceMetrics);
    setLoading(false);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const getPatternTypeIcon = (type: string) => {
    switch (type) {
      case 'bullish': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'bearish': return <TrendingDown className="h-4 w-4 text-red-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPatternTypeColor = (type: string) => {
    switch (type) {
      case 'bullish': return 'bg-green-100 text-green-800 border-green-200';
      case 'bearish': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-green-600';
    if (confidence >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (analyticsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Activity className="h-12 w-12 text-blue-500 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">{(t as any).ai.loadingPatternData}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600">{(t as any).ai.errorLoadingData} {error}</p>
        </div>
      </div>
    );
  }

  if (!analytics || analytics.totalTrades === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">{(t as any).ai.noTradesFound}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Activity className="h-6 w-6 text-blue-600" />
            {(t as any).ai.patternRecognition}
            <Badge className="bg-blue-100 text-blue-700 ml-2">
              {(t as any).ai.realData}
            </Badge>
          </h2>
          <p className="text-gray-600 mt-1">
            {(t as any).ai.aiPoweredPatternDetection.replace('{count}', analytics.totalTrades)}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">{(t as any).ai.timeframe}:</span>
            <div className="flex rounded-lg bg-gray-100 p-1">
              {(['1D', '1W', '1M'] as const).map((timeframe) => (
                <button
                  key={timeframe}
                  onClick={() => setSelectedTimeframe(timeframe)}
                  className={`px-3 py-1 text-xs rounded transition-colors ${
                    selectedTimeframe === timeframe
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {timeframe}
                </button>
              ))}
            </div>
          </div>
          <Button 
            onClick={scanForPatterns} 
            disabled={loading}
            className="flex items-center gap-2"
          >
            <Zap className={`h-4 w-4 ${loading ? 'animate-pulse' : ''}`} />
            {(t as any).ai.scanPatterns}
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Activity className="h-12 w-12 text-blue-500 animate-pulse mx-auto mb-4" />
            <p className="text-gray-600">{(t as any).ai.scanningPatterns}</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Detected Patterns */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-purple-500" />
                {(t as any).ai.detectedPatterns.replace('{count}', patterns.length)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {patterns.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>{(t as any).ai.noSignificantPatterns}</p>
                    <p className="text-sm">{(t as any).ai.addMoreTradesAnalysis}</p>
                  </div>
                ) : (
                  patterns.map((pattern) => (
                    <div key={pattern.id} className="p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getPatternTypeIcon(pattern.type)}
                          <h4 className="font-semibold text-gray-900">{pattern.name}</h4>
                          <Badge className={`text-xs ${getPatternTypeColor(pattern.type)}`}>
                            {pattern.type}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <div className={`text-sm font-bold ${getConfidenceColor(pattern.confidence)}`}>
                            {pattern.confidence.toFixed(0)}%
                          </div>
                          <div className="text-xs text-gray-500">{(t as any).ai.patternConfidence}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 mb-2">
                        <span className="text-sm font-medium text-gray-700">{pattern.symbol}</span>
                        <Badge variant="outline" className="text-xs">
                          {pattern.timeframe}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {(t as any).ai.success}: {pattern.probability.toFixed(1)}%
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">{pattern.description}</p>
                      
                      {pattern.symbol !== 'STRATEGY' && (
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-gray-500">{(t as any).trades.entry}:</span>
                            <span className="ml-1 font-medium">{formatCurrency(pattern.entryPrice)}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">{(t as any).ai.target}:</span>
                            <span className="ml-1 font-medium text-green-600">{formatCurrency(pattern.target1)}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">{(t as any).ai.stopLoss}:</span>
                            <span className="ml-1 font-medium text-red-600">{formatCurrency(pattern.stopLoss)}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">R/R:</span>
                            <span className="ml-1 font-medium">{pattern.riskReward.toFixed(1)}:1</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-green-500" />
                {(t as any).ai.patternPerformance}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {performanceMetrics.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <BarChart3 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>{(t as any).ai.noPerformanceData}</p>
                  </div>
                ) : (
                  performanceMetrics.map((metric, index) => (
                    <div key={index} className="p-4 rounded-lg bg-gray-50 border">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-gray-900">{metric.pattern}</h4>
                        <Badge className="bg-blue-100 text-blue-800">
                          {metric.successRate.toFixed(1)}% {(t as any).ai.winRate}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">{(t as any).ai.totalTrades}:</span>
                          <span className="ml-2 font-medium">{metric.totalOccurrences}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">{(t as any).ai.successful}:</span>
                          <span className="ml-2 font-medium text-green-600">{metric.successfulTrades}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">{(t as any).ai.avgReturn}:</span>
                          <span className="ml-2 font-medium">{metric.avgReturn.toFixed(1)}%</span>
                        </div>
                        <div>
                          <span className="text-gray-500">{(t as any).ai.bestReturn}:</span>
                          <span className="ml-2 font-medium text-green-600">{metric.bestReturn.toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
