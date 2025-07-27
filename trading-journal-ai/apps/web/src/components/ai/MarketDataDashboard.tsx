'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useDashboardAnalytics } from '@/hooks/useDashboardAnalytics';
import { useLanguage } from '@/lib/i18n/LanguageProvider';
import { Trade } from '@/../../../../packages/shared/src/types';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity,
  DollarSign,
  BarChart3,
  RefreshCw,
  AlertTriangle,
  Target,
  Clock,
  Database
} from 'lucide-react';

interface PortfolioData {
  symbol: string;
  assetType: string;
  totalQuantity: number;
  averageEntryPrice: number;
  currentValue: number;
  totalPnL: number;
  pnlPercent: number;
  openPositions: number;
  closedTrades: number;
  winRate: number;
  lastTradeDate: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  tradeCount: number;
  avgPnL: number;
  performance: 'positive' | 'negative' | 'neutral';
}

interface TradingRecommendation {
  symbol: string;
  action: 'hold' | 'review' | 'buy' | 'sell';
  confidence: 'high' | 'medium' | 'low';
  reason: string;
}

export default function MarketDataDashboard() {
  const { analytics, loading: analyticsLoading, error } = useDashboardAnalytics();
  const { t, loading: languageLoading } = useLanguage();
  const [portfolioData, setPortfolioData] = useState<PortfolioData[]>([]);
  const [recommendations, setRecommendations] = useState<TradingRecommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  // Defensive check for translations
  const translations = (t as any)?.ai?.marketDataDashboard;
  
  // Only show loading if translations are not available
  if (!translations) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <BarChart3 className="h-12 w-12 text-blue-500 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Đang tải bản dịch...</p>
        </div>
      </div>
    );
  }

  useEffect(() => {
    if (analytics && !analyticsLoading) {
      analyzePortfolioData();
    }
  }, [analytics, analyticsLoading]);

  const analyzePortfolioData = async () => {
    if (!analytics) return;
    
    setLoading(true);
    
    // Analyze user's actual trading data
    const portfolioAnalysis: PortfolioData[] = [];
    const recommendations: TradingRecommendation[] = [];

    // Group trades by symbol to analyze portfolio
    const symbolGroups = analytics.recentTrades.reduce((acc: Record<string, Trade[]>, trade: Trade) => {
      const symbol = trade.symbol || 'Unknown';
      if (!acc[symbol]) {
        acc[symbol] = [];
      }
      acc[symbol].push(trade);
      return acc;
    }, {});

    // Analyze each symbol in portfolio
    Object.entries(symbolGroups).forEach(([symbol, trades]: [string, Trade[]]) => {
      const totalPnL = trades.reduce((sum, trade) => sum + (trade.pnl || 0), 0);
      const totalQuantity = trades.reduce((sum, trade) => sum + Math.abs(trade.size || 0), 0);
      const winRate = trades.filter(trade => (trade.pnl || 0) > 0).length / trades.length * 100;
      
      portfolioAnalysis.push({
        symbol,
        assetType: trades[0]?.assetType || 'unknown',
        totalQuantity,
        averageEntryPrice: trades.reduce((sum, trade) => sum + (trade.entryPrice || 0), 0) / trades.length,
        currentValue: totalQuantity * (trades[trades.length - 1]?.entryPrice || 0),
        totalPnL,
        pnlPercent: (totalPnL / Math.abs(totalQuantity * (trades[0]?.entryPrice || 1))) * 100,
        openPositions: trades.filter(trade => trade.status === 'open').length,
        closedTrades: trades.filter(trade => trade.status === 'closed').length,
        winRate,
        lastTradeDate: (() => {
          const lastTrade = trades[trades.length - 1];
          if (lastTrade?.exitDateTime) {
            return typeof lastTrade.exitDateTime === 'string' ? lastTrade.exitDateTime : lastTrade.exitDateTime.toISOString();
          }
          if (lastTrade?.entryDateTime) {
            return typeof lastTrade.entryDateTime === 'string' ? lastTrade.entryDateTime : lastTrade.entryDateTime.toISOString();
          }
          return new Date().toISOString();
        })(),
        sentiment: totalPnL > 500 ? 'bullish' : totalPnL < -500 ? 'bearish' : 'neutral',
        tradeCount: trades.length,
        avgPnL: totalPnL / trades.length,
        performance: totalPnL > 0 ? 'positive' : totalPnL < 0 ? 'negative' : 'neutral'
      });

      // Generate recommendations based on performance
      if (winRate > 70 && totalPnL > 0) {
        recommendations.push({
          symbol,
          action: 'hold',
          confidence: 'high',
          reason: `Strong performance với win rate ${winRate.toFixed(1)}% và tổng P&L: ${totalPnL.toFixed(2)}`
        });
      } else if (winRate < 30 || totalPnL < -1000) {
        recommendations.push({
          symbol,
          action: 'review',
          confidence: 'medium',
          reason: `Cần xem xét lại với win rate ${winRate.toFixed(1)}% và tổng P&L: ${totalPnL.toFixed(2)}`
        });
      }
    });

    setPortfolioData(portfolioAnalysis);
    setRecommendations(recommendations);
    setLastUpdate(new Date());
    setLoading(false);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const formatNumber = (value: number) => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
    return value.toLocaleString();
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'hold': return 'bg-green-100 text-green-800 border-green-200';
      case 'review': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'bearish': return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-blue-600" />
            {translations.title}
          </h2>
          <p className="text-gray-600 mt-1">{translations.subtitle}</p>
        </div>
        <div className="flex items-center gap-4">
          {lastUpdate && (
            <p className="text-sm text-gray-500">
              {translations.lastUpdate} {lastUpdate.toLocaleTimeString()}
            </p>
          )}
          <Button 
            onClick={analyzePortfolioData} 
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            {translations.refreshButton}
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Activity className="h-12 w-12 text-blue-500 animate-pulse mx-auto mb-4" />
            <p className="text-gray-600">{translations.loading}</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Market Overview */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-500" />
                  {translations.portfolioAnalysis.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {portfolioData.map((portfolio) => (
                    <div key={portfolio.symbol} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div>
                            <h3 className="font-bold text-lg">{portfolio.symbol}</h3>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <span className="capitalize">{translations.portfolioAnalysis[portfolio.performance]}</span>
                              <span>• {portfolio.tradeCount} {translations.portfolioAnalysis.trades}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-lg font-bold">${portfolio.totalPnL.toFixed(2)}</p>
                          <div className={`text-sm font-medium ${
                            portfolio.totalPnL >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {translations.portfolioAnalysis.winRate}: {portfolio.winRate.toFixed(1)}%
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">{translations.portfolioAnalysis.totalQuantity}:</span>
                          <p className="font-medium">{portfolio.totalQuantity.toFixed(2)}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">{translations.portfolioAnalysis.avgPnL}:</span>
                          <p className="font-medium">${portfolio.avgPnL.toFixed(2)}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">{translations.portfolioAnalysis.tradeCount}:</span>
                          <p className="font-medium">{portfolio.tradeCount}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">{translations.portfolioAnalysis.performance}:</span>
                          <p className={`font-medium capitalize ${
                            portfolio.performance === 'positive' ? 'text-green-600' :
                            portfolio.performance === 'negative' ? 'text-red-600' : 'text-gray-600'
                          }`}>
                            {translations.portfolioAnalysis[portfolio.performance]}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Trading Recommendations */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-orange-500" />
                  {translations.recommendations.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recommendations.map((recommendation, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{recommendation.symbol}</h4>
                        <Badge className={getActionColor(recommendation.action)}>
                          {recommendation.action.toUpperCase()}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500">{translations.recommendations.confidence}:</span>
                          <span className={`font-medium capitalize ${getConfidenceColor(recommendation.confidence)}`}>
                            {translations.recommendations[recommendation.confidence]}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mt-3 pt-3 border-t">
                        <p className="text-xs text-gray-600">{recommendation.reason}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Market Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            {translations.alerts.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">
                    {translations.alerts.highVolatility.title}
                  </p>
                  <p className="text-sm text-yellow-700 mt-1">
                    {translations.alerts.highVolatility.description}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-3 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
              <div className="flex items-start">
                <TrendingUp className="h-5 w-5 text-blue-400 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm font-medium text-blue-800">
                    {translations.alerts.momentumBreakout.title}
                  </p>
                  <p className="text-sm text-blue-700 mt-1">
                    {translations.alerts.momentumBreakout.description}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-3 bg-green-50 border-l-4 border-green-400 rounded-r-lg">
              <div className="flex items-start">
                <Target className="h-5 w-5 text-green-400 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm font-medium text-green-800">
                    {translations.alerts.priceTarget.title}
                  </p>
                  <p className="text-sm text-green-700 mt-1">
                    {translations.alerts.priceTarget.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
