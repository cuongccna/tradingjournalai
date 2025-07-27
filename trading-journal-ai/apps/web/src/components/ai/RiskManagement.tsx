'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/lib/i18n/LanguageProvider';
import { api } from '@/lib/api';
import { 
  Shield, 
  AlertTriangle, 
  TrendingDown,
  Target,
  PieChart,
  Calculator,
  Activity,
  Zap,
  CheckCircle,
  XCircle,
  DollarSign
} from 'lucide-react';

interface RiskMetric {
  id: string;
  name: string;
  value: number;
  threshold: number;
  status: 'safe' | 'warning' | 'danger';
  description: string;
  recommendation: string;
}

interface PositionSizing {
  symbol: string;
  currentPosition: number;
  suggestedPosition: number;
  maxPosition: number;
  riskAmount: number;
  stopLoss: number;
  entryPrice: number;
}

interface RiskScenario {
  id: string;
  name: string;
  probability: number;
  impact: number;
  portfolioLoss: number;
  affectedPositions: string[];
  mitigation: string[];
}

interface Trade {
  id: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  quantity: number;
  entryPrice: number;
  exitPrice?: number;
  entryDate: string;
  exitDate?: string;
  pnl?: number;
  status: 'OPEN' | 'CLOSED' | 'open' | 'closed';
  stopLoss?: number;
  takeProfit?: number;
  tags?: string[];
  notes?: string;
}

export default function RiskManagement() {
  const { t, loading: languageLoading } = useLanguage();
  const [riskMetrics, setRiskMetrics] = useState<RiskMetric[]>([]);
  const [positionSizing, setPositionSizing] = useState<PositionSizing[]>([]);
  const [riskScenarios, setRiskScenarios] = useState<RiskScenario[]>([]);
  const [portfolioValue, setPortfolioValue] = useState(100000);
  const [maxRiskPerTrade, setMaxRiskPerTrade] = useState(2);
  const [loading, setLoading] = useState(false);

  // Defensive check for translations
  const translations = (t as any)?.ai?.riskManagement;
  
  // Only show loading if translations are not available
  if (!translations) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Shield className="h-12 w-12 text-blue-500 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Đang tải bản dịch...</p>
        </div>
      </div>
    );
  }

  useEffect(() => {
    calculateRiskMetrics();
  }, [portfolioValue, maxRiskPerTrade]);

  const calculateRiskMetrics = async () => {
    setLoading(true);
    
    try {
      // Fetch real trades data
      const trades: Trade[] = await api.trades.list();
      
      // Calculate risk metrics from real data
      const riskMetrics = calculateRiskFromTrades(trades, translations);
      const positionSizing = calculatePositionSizing(trades);
      const riskScenarios = generateRiskScenarios(trades, translations);
      
      setRiskMetrics(riskMetrics);
      setPositionSizing(positionSizing);
      setRiskScenarios(riskScenarios);
    } catch (error) {
      console.error('Error fetching trades for risk analysis:', error);
      // Fallback to mock data if API fails
      setRiskMetrics(getMockRiskMetrics());
      setPositionSizing(getMockPositionSizing());
      setRiskScenarios(getMockRiskScenarios());
    }
    
    setLoading(false);
  };

  const calculateRiskFromTrades = (trades: Trade[], translations: any): RiskMetric[] => {
    if (trades.length === 0) {
      return getMockRiskMetrics();
    }

    const openTrades = trades.filter(trade => 
      trade.status === 'OPEN' || trade.status === 'open'
    );
    const closedTrades = trades.filter(trade => 
      trade.status === 'CLOSED' || trade.status === 'closed'
    );
    
    // Calculate portfolio value and concentration
    const totalPortfolioValue = openTrades.reduce((sum, trade) => 
      sum + (trade.quantity * trade.entryPrice), 0);
    
    // Symbol concentration
    const symbolCounts = openTrades.reduce((acc, trade) => {
      acc[trade.symbol] = (acc[trade.symbol] || 0) + (trade.quantity * trade.entryPrice);
      return acc;
    }, {} as Record<string, number>);
    
    const topSymbolValue = Math.max(...Object.values(symbolCounts));
    const concentrationPercent = totalPortfolioValue > 0 ? 
      (topSymbolValue / totalPortfolioValue) * 100 : 0;
    
    // Calculate drawdown from closed trades
    const losses = closedTrades.filter(trade => (trade.pnl || 0) < 0);
    const consecutiveLosses = calculateConsecutiveLosses(closedTrades);
    const totalLoss = losses.reduce((sum, trade) => sum + Math.abs(trade.pnl || 0), 0);
    const avgLoss = losses.length > 0 ? totalLoss / losses.length : 0;
    
    // Win rate
    const winners = closedTrades.filter(trade => (trade.pnl || 0) > 0).length;
    const winRate = closedTrades.length > 0 ? (winners / closedTrades.length) * 100 : 0;
    
    return [
      {
        id: '1',
        name: translations.portfolioRisk || 'Portfolio Risk',
        value: totalPortfolioValue > 50000 ? 8.5 : 4.2,
        threshold: 10,
        status: totalPortfolioValue > 50000 ? 'warning' : 'safe',
        description: translations.portfolioRiskDesc || 'Total portfolio risk exposure',
        recommendation: totalPortfolioValue > 50000 ? 
          translations.reduceExposure || 'Consider reducing position sizes' :
          translations.canIncrease || 'Can consider increasing positions'
      },
      {
        id: '2',
        name: translations.concentration || 'Position Concentration',
        value: concentrationPercent,
        threshold: 30,
        status: concentrationPercent > 50 ? 'danger' : 
               concentrationPercent > 30 ? 'warning' : 'safe',
        description: translations.concentrationDesc || 'Largest position as % of portfolio',
        recommendation: concentrationPercent > 30 ? 
          translations.diversify || 'Diversify positions' :
          translations.goodDiversification || 'Good diversification'
      },
      {
        id: '3',
        name: translations.winRate || 'Win Rate',
        value: winRate,
        threshold: 50,
        status: winRate >= 60 ? 'safe' : winRate >= 40 ? 'warning' : 'danger',
        description: translations.winRateDesc || 'Percentage of profitable trades',
        recommendation: winRate < 50 ? 
          translations.improveStrategy || 'Review and improve trading strategy' :
          translations.goodPerformance || 'Good trading performance'
      },
      {
        id: '4',
        name: translations.avgLoss || 'Average Loss',
        value: avgLoss,
        threshold: 1000,
        status: avgLoss > 2000 ? 'danger' : avgLoss > 1000 ? 'warning' : 'safe',
        description: translations.avgLossDesc || 'Average loss per losing trade',
        recommendation: avgLoss > 1000 ? 
          translations.tightenStops || 'Implement tighter stop losses' :
          translations.goodRiskControl || 'Good risk control'
      },
      {
        id: '5',
        name: translations.consecutiveLosses || 'Max Consecutive Losses',
        value: consecutiveLosses,
        threshold: 3,
        status: consecutiveLosses >= 5 ? 'danger' : consecutiveLosses >= 3 ? 'warning' : 'safe',
        description: translations.consecutiveLossesDesc || 'Maximum consecutive losing trades',
        recommendation: consecutiveLosses >= 3 ? 
          translations.reviewStrategy || 'Review strategy and take a break' :
          translations.goodConsistency || 'Good consistency'
      }
    ];
  };

  const calculatePositionSizing = (trades: Trade[]): PositionSizing[] => {
    const openTrades = trades.filter(trade => 
      trade.status === 'OPEN' || trade.status === 'open'
    );
    
    console.log('🔍 Position Sizing Debug:', {
      totalTrades: trades.length,
      openTrades: openTrades.length,
      openTradesData: openTrades.map(t => ({
        symbol: t.symbol,
        status: t.status,
        value: t.quantity * t.entryPrice
      }))
    });
    
    if (openTrades.length === 0) {
      // Return empty array instead of mock data when no open trades
      return [];
    }
    
    return openTrades.slice(0, 5).map(trade => {
      const currentValue = trade.quantity * trade.entryPrice;
      const riskAmount = portfolioValue * (maxRiskPerTrade / 100); // Use actual risk parameters
      const suggestedPosition = Math.min(riskAmount / 0.05, currentValue); // Max 5% risk per position
      
      return {
        symbol: trade.symbol,
        currentPosition: currentValue,
        suggestedPosition: suggestedPosition,
        maxPosition: portfolioValue * 0.1, // Max 10% per position
        riskAmount: riskAmount,
        stopLoss: trade.stopLoss || trade.entryPrice * 0.95,
        entryPrice: trade.entryPrice
      };
    });
  };

  const generateRiskScenarios = (trades: Trade[], translations: any): RiskScenario[] => {
    const openTrades = trades.filter(trade => 
      trade.status === 'OPEN' || trade.status === 'open'
    );
    const totalValue = openTrades.reduce((sum, trade) => 
      sum + (trade.quantity * trade.entryPrice), 0);
    
    const techSymbols = openTrades.filter(trade => 
      ['AAPL', 'MSFT', 'GOOGL', 'NVDA', 'TSLA', 'META', 'AMZN'].includes(trade.symbol.toUpperCase())
    );
    
    return [
      {
        id: '1',
        name: translations.marketCrash || 'Market Crash (20% Down)',
        probability: 15,
        impact: totalValue * 0.20,
        portfolioLoss: 20.0,
        affectedPositions: openTrades.map(t => t.symbol),
        mitigation: [
          translations.hedgeWithPuts || 'Hedge with puts',
          translations.reducePositions || 'Reduce position sizes',
          translations.addDefensive || 'Add defensive stocks'
        ]
      },
      {
        id: '2',
        name: translations.techCorrection || 'Tech Sector Correction',
        probability: 35,
        impact: techSymbols.reduce((sum, trade) => 
          sum + (trade.quantity * trade.entryPrice * 0.15), 0),
        portfolioLoss: techSymbols.length > 0 ? 15.0 : 5.0,
        affectedPositions: techSymbols.map(t => t.symbol),
        mitigation: [
          translations.diversifySectors || 'Diversify sectors',
          translations.takeProfits || 'Take profits on winners',
          translations.setStops || 'Set protective stops'
        ]
      },
      {
        id: '3',
        name: translations.interestRateRisk || 'Interest Rate Spike',
        probability: 25,
        impact: totalValue * 0.10,
        portfolioLoss: 10.0,
        affectedPositions: openTrades.filter(t => 
          ['Growth stocks', 'REITs'].some(type => 
            t.tags?.includes(type) || false
          )
        ).map(t => t.symbol),
        mitigation: [
          translations.rotateToValue || 'Rotate to value',
          translations.considerBonds || 'Consider bonds',
          translations.reduceLeverage || 'Reduce leverage'
        ]
      }
    ];
  };

  const calculateConsecutiveLosses = (trades: Trade[]): number => {
    const sortedTrades = trades
      .filter(trade => trade.exitDate)
      .sort((a, b) => new Date(a.exitDate!).getTime() - new Date(b.exitDate!).getTime());
    
    let maxConsecutive = 0;
    let currentConsecutive = 0;
    
    for (const trade of sortedTrades) {
      if ((trade.pnl || 0) < 0) {
        currentConsecutive++;
        maxConsecutive = Math.max(maxConsecutive, currentConsecutive);
      } else {
        currentConsecutive = 0;
      }
    }
    
    return maxConsecutive;
  };

  // Fallback mock data functions
  const getMockRiskMetrics = (): RiskMetric[] => [
    {
      id: '1',
      name: 'Portfolio Risk',
      value: 8.5,
      threshold: 10,
      status: 'safe',
      description: 'Total portfolio risk exposure',
      recommendation: 'Consider adding defensive positions'
    },
      {
        id: '2',
        name: 'Position Concentration',
        value: 68,
        threshold: 60,
        status: 'warning',
        description: 'Percentage in top 5 positions',
        recommendation: 'Diversify into other sectors'
      },
      {
        id: '3',
        name: 'Sector Concentration',
        value: 75,
        threshold: 50,
        status: 'danger',
        description: 'Technology sector exposure',
        recommendation: 'Reduce tech allocation immediately'
      },
      {
        id: '4',
        name: 'VaR (1 Day, 95%)',
        value: 3.2,
        threshold: 5,
        status: 'safe',
        description: 'Value at Risk over 1 day',
        recommendation: 'Risk levels acceptable'
      },
      {
        id: '5',
        name: 'Drawdown Risk',
        value: 12,
        threshold: 15,
        status: 'warning',
        description: 'Maximum potential drawdown',
        recommendation: 'Implement tighter stops'
      }
    ];

  const getMockPositionSizing = (): PositionSizing[] => [
    {
      symbol: 'AAPL',
      currentPosition: 5000,
      suggestedPosition: 3500,
      maxPosition: 4000,
      riskAmount: 2000,
      stopLoss: 170,
      entryPrice: 175.50
    },
      {
        symbol: 'TSLA',
        currentPosition: 8000,
        suggestedPosition: 2500,
        maxPosition: 3000,
        riskAmount: 2000,
        stopLoss: 185,
        entryPrice: 201.34
      },
      {
        symbol: 'NVDA',
        currentPosition: 0,
        suggestedPosition: 4500,
        maxPosition: 5000,
        riskAmount: 2000,
        stopLoss: 435,
        entryPrice: 456.78
      }
    ];

  const getMockRiskScenarios = (): RiskScenario[] => [
    {
      id: '1',
      name: 'Market Crash (20% Down)',
      probability: 15,
      impact: 18500,
      portfolioLoss: 18.5,
      affectedPositions: ['AAPL', 'MSFT', 'GOOGL', 'TSLA'],
      mitigation: ['Hedge with puts', 'Reduce position sizes', 'Add defensive stocks']
    },
      {
        id: '2',
        name: 'Tech Sector Correction',
        probability: 35,
        impact: 12000,
        portfolioLoss: 12.0,
        affectedPositions: ['AAPL', 'MSFT', 'NVDA', 'GOOGL'],
        mitigation: ['Diversify sectors', 'Take profits on winners', 'Set protective stops']
      },
      {
        id: '3',
        name: 'Interest Rate Spike',
        probability: 25,
        impact: 8500,
        portfolioLoss: 8.5,
        affectedPositions: ['Growth stocks', 'REITs'],
        mitigation: ['Rotate to value', 'Consider bonds', 'Reduce leverage']
      }
    ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'safe': return 'bg-green-100 text-green-800 border-green-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'danger': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'safe': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'danger': return <XCircle className="h-4 w-4 text-red-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Shield className="h-6 w-6 text-green-600" />
            {translations.title}
          </h2>
          <p className="text-gray-600 mt-1">{translations.subtitle}</p>
        </div>
        <Button onClick={calculateRiskMetrics} disabled={loading} className="flex items-center gap-2">
          <Zap className={`h-4 w-4 ${loading ? 'animate-pulse' : ''}`} />
          {translations.analyzeButton}
        </Button>
      </div>

      {/* Risk Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-blue-500" />
            {translations.riskParameters.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {translations.riskParameters.portfolioValue}
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="number"
                  value={portfolioValue}
                  onChange={(e) => setPortfolioValue(Number(e.target.value))}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {translations.riskParameters.maxRiskPerTrade}
              </label>
              <Input
                type="number"
                value={maxRiskPerTrade}
                onChange={(e) => setMaxRiskPerTrade(Number(e.target.value))}
                step="0.1"
                min="0.5"
                max="5"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Shield className="h-12 w-12 text-green-500 animate-pulse mx-auto mb-4" />
            <p className="text-gray-600">Analyzing portfolio risk...</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Risk Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                {translations.riskMetrics?.title || 'Risk Metrics'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {riskMetrics.map((metric) => (
                  <div key={metric.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(metric.status)}
                        <h4 className="font-semibold">{metric.name}</h4>
                      </div>
                      <Badge className={getStatusColor(metric.status)}>
                        {metric.status.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl font-bold">
                        {metric.value.toFixed(1)}%
                      </span>
                      <span className="text-sm text-gray-500">
                        Limit: {metric.threshold}%
                      </span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                      <div 
                        className={`h-2 rounded-full ${
                          metric.status === 'safe' ? 'bg-green-500' :
                          metric.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${Math.min((metric.value / metric.threshold) * 100, 100)}%` }}
                      ></div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">{metric.description}</p>
                    <p className="text-sm font-medium text-blue-600">{metric.recommendation}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Position Sizing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-500" />
                {translations.positionSizing?.title || 'Position Sizing'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {positionSizing.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>{translations.positionSizing?.noOpenPositions || 'No open positions to analyze'}</p>
                  <p className="text-sm mt-2">{translations.positionSizing?.addTradesMessage || 'Add some open trades to see position sizing recommendations'}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {positionSizing.map((position) => (
                    <div key={position.symbol} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-lg">{position.symbol}</h4>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">{translations.positionSizing?.riskAmount || 'Risk Amount'}</p>
                          <p className="font-medium">{formatCurrency(position.riskAmount)}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                        <div>
                          <span className="text-gray-500">{translations.positionSizing?.current || 'Current'}:</span>
                          <p className="font-medium">{formatCurrency(position.currentPosition)}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">{translations.positionSizing?.suggested || 'Suggested'}:</span>
                          <p className="font-medium text-blue-600">{formatCurrency(position.suggestedPosition)}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">{translations.positionSizing?.maxPosition || 'Max Position'}:</span>
                          <p className="font-medium">{formatCurrency(position.maxPosition)}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">{translations.positionSizing?.entryPrice || 'Entry Price'}:</span>
                          <p className="font-medium">{formatCurrency(position.entryPrice)}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-sm">
                          <span className="text-gray-500">{translations.positionSizing?.stopLoss || 'Stop Loss'}: </span>
                          <span className="font-medium text-red-600">
                            {formatCurrency(position.stopLoss)}
                          </span>
                        </div>
                        <Button size="sm" variant="outline">
                          {translations.positionSizing?.applyButton || 'Apply'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Risk Scenarios */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5 text-purple-500" />
            {translations.riskScenarios?.title || 'Risk Scenarios'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {riskScenarios.map((scenario) => (
              <div key={scenario.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-lg">{scenario.name}</h4>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{scenario.probability}% {translations.riskScenarios?.chance || 'chance'}</Badge>
                    <Badge className="bg-red-100 text-red-800">
                      -{scenario.portfolioLoss}%
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">{translations.riskScenarios?.impact || 'Potential Loss'}</p>
                    <p className="text-lg font-bold text-red-600">
                      {formatCurrency(scenario.impact)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">{translations.riskScenarios?.affectedPositions || 'Affected Positions'}</p>
                    <div className="flex flex-wrap gap-1">
                      {scenario.affectedPositions.map((pos) => (
                        <Badge key={pos} variant="outline" className="text-xs">
                          {pos}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">{translations.riskScenarios?.mitigationStrategies || 'Mitigation Strategies'}:</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {scenario.mitigation.map((strategy, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                        {strategy}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
