'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  const [patterns, setPatterns] = useState<TradingPattern[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetric[]>([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'1D' | '1W' | '1M'>('1D');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    scanForPatterns();
  }, [selectedTimeframe]);

  const scanForPatterns = async () => {
    setLoading(true);
    
    // Simulate pattern recognition analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockPatterns: TradingPattern[] = [
      {
        id: '1',
        name: 'Bull Flag',
        type: 'bullish',
        confidence: 87,
        symbol: 'AAPL',
        description: 'Strong uptrend followed by consolidation in a tight range. Bullish continuation pattern with high probability.',
        entryPrice: 175.50,
        target1: 185.00,
        target2: 192.00,
        stopLoss: 170.00,
        timeframe: '1D',
        riskReward: 2.4,
        probability: 78,
        historicalAccuracy: 82
      },
      {
        id: '2',
        name: 'Head and Shoulders',
        type: 'bearish',
        confidence: 73,
        symbol: 'TSLA',
        description: 'Classic reversal pattern showing potential trend change from bullish to bearish.',
        entryPrice: 200.00,
        target1: 185.00,
        stopLoss: 210.00,
        timeframe: '1W',
        riskReward: 1.5,
        probability: 68,
        historicalAccuracy: 71
      },
      {
        id: '3',
        name: 'Ascending Triangle',
        type: 'bullish',
        confidence: 91,
        symbol: 'NVDA',
        description: 'Bullish continuation pattern with strong resistance test and higher lows formation.',
        entryPrice: 456.00,
        target1: 485.00,
        target2: 510.00,
        stopLoss: 435.00,
        timeframe: '1D',
        riskReward: 2.8,
        probability: 85,
        historicalAccuracy: 88
      },
      {
        id: '4',
        name: 'Double Bottom',
        type: 'bullish',
        confidence: 79,
        symbol: 'MSFT',
        description: 'Potential reversal pattern indicating end of downtrend and start of bullish momentum.',
        entryPrice: 338.50,
        target1: 355.00,
        stopLoss: 325.00,
        timeframe: '1W',
        riskReward: 1.2,
        probability: 72,
        historicalAccuracy: 76
      },
      {
        id: '5',
        name: 'Wedge Pattern',
        type: 'bearish',
        confidence: 65,
        symbol: 'GOOGL',
        description: 'Rising wedge indicating potential bearish reversal despite recent upward movement.',
        entryPrice: 142.00,
        target1: 135.00,
        stopLoss: 148.00,
        timeframe: '1D',
        riskReward: 1.16,
        probability: 58,
        historicalAccuracy: 63
      }
    ];

    const mockMetrics: PerformanceMetric[] = [
      {
        pattern: 'Bull Flag',
        totalOccurrences: 45,
        successfulTrades: 37,
        successRate: 82.2,
        avgReturn: 8.5,
        bestReturn: 24.6,
        worstReturn: -4.2,
        avgHoldingPeriod: 12
      },
      {
        pattern: 'Head and Shoulders',
        totalOccurrences: 28,
        successfulTrades: 20,
        successRate: 71.4,
        avgReturn: 6.8,
        bestReturn: 18.9,
        worstReturn: -8.1,
        avgHoldingPeriod: 18
      },
      {
        pattern: 'Ascending Triangle',
        totalOccurrences: 33,
        successfulTrades: 29,
        successRate: 87.9,
        avgReturn: 11.2,
        bestReturn: 31.4,
        worstReturn: -3.8,
        avgHoldingPeriod: 9
      },
      {
        pattern: 'Double Bottom',
        totalOccurrences: 19,
        successfulTrades: 14,
        successRate: 73.7,
        avgReturn: 7.3,
        bestReturn: 19.5,
        worstReturn: -6.4,
        avgHoldingPeriod: 21
      }
    ];

    setPatterns(mockPatterns);
    setPerformanceMetrics(mockMetrics);
    setLoading(false);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const getPatternIcon = (type: string) => {
    switch (type) {
      case 'bullish': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'bearish': return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <BarChart3 className="h-4 w-4 text-gray-600" />;
    }
  };

  const getPatternColor = (type: string) => {
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Activity className="h-6 w-6 text-purple-600" />
            Pattern Recognition
          </h2>
          <p className="text-gray-600 mt-1">AI-powered technical analysis and pattern detection</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex bg-gray-100 rounded-lg">
            {['1D', '1W', '1M'].map((timeframe) => (
              <button
                key={timeframe}
                onClick={() => setSelectedTimeframe(timeframe as any)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  selectedTimeframe === timeframe 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {timeframe}
              </button>
            ))}
          </div>
          <Button onClick={scanForPatterns} disabled={loading} className="flex items-center gap-2">
            <Zap className={`h-4 w-4 ${loading ? 'animate-pulse' : ''}`} />
            Scan Patterns
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Activity className="h-12 w-12 text-purple-500 animate-pulse mx-auto mb-4" />
            <p className="text-gray-600">Scanning for trading patterns...</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Detected Patterns */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-500" />
                  Detected Patterns ({patterns.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {patterns.map((pattern) => (
                    <div key={pattern.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          {getPatternIcon(pattern.type)}
                          <div>
                            <h3 className="font-semibold text-lg">{pattern.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge className={getPatternColor(pattern.type)}>
                                {pattern.type}
                              </Badge>
                              <Badge variant="outline">{pattern.symbol}</Badge>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-lg font-bold ${getConfidenceColor(pattern.confidence)}`}>
                            {pattern.confidence}%
                          </div>
                          <div className="text-xs text-gray-500">Confidence</div>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 mb-4">{pattern.description}</p>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                        <div>
                          <span className="text-gray-500">Entry:</span>
                          <p className="font-medium">{formatCurrency(pattern.entryPrice)}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Target 1:</span>
                          <p className="font-medium text-green-600">{formatCurrency(pattern.target1)}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Stop Loss:</span>
                          <p className="font-medium text-red-600">{formatCurrency(pattern.stopLoss)}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">R:R Ratio:</span>
                          <p className="font-medium">{pattern.riskReward.toFixed(1)}:1</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-gray-400" />
                            <span className="text-gray-500">{pattern.timeframe}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-yellow-500" />
                            <span className="text-gray-600">{pattern.probability}% probability</span>
                          </div>
                        </div>
                        <Button size="sm" variant="ghost" className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          View Chart
                        </Button>
                      </div>

                      {pattern.target2 && (
                        <div className="mt-3 pt-3 border-t">
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-gray-500">Extended Target:</span>
                            <span className="font-medium text-green-600">{formatCurrency(pattern.target2)}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Pattern Performance */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-green-500" />
                  Pattern Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {performanceMetrics.map((metric) => (
                    <div key={metric.pattern} className="p-3 border rounded-lg">
                      <h4 className="font-semibold text-sm mb-2">{metric.pattern}</h4>
                      
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Success Rate:</span>
                          <span className="font-medium text-green-600">
                            {metric.successRate.toFixed(1)}%
                          </span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-gray-500">Trades:</span>
                          <span className="font-medium">
                            {metric.successfulTrades}/{metric.totalOccurrences}
                          </span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-gray-500">Avg Return:</span>
                          <span className="font-medium text-blue-600">
                            {metric.avgReturn.toFixed(1)}%
                          </span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-gray-500">Best:</span>
                          <span className="font-medium text-green-600">
                            {metric.bestReturn.toFixed(1)}%
                          </span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-gray-500">Worst:</span>
                          <span className="font-medium text-red-600">
                            {metric.worstReturn.toFixed(1)}%
                          </span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-gray-500">Avg Hold:</span>
                          <span className="font-medium">
                            {metric.avgHoldingPeriod} days
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Pattern Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-500" />
            Pattern Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-green-50 border-l-4 border-green-400 rounded-r-lg">
              <div className="flex items-start">
                <TrendingUp className="h-5 w-5 text-green-400 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm font-medium text-green-800">
                    New Bull Flag Formation
                  </p>
                  <p className="text-sm text-green-700 mt-1">
                    AAPL showing strong bull flag pattern with 87% confidence. High probability trade setup.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-3 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
              <div className="flex items-start">
                <Target className="h-5 w-5 text-blue-400 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm font-medium text-blue-800">
                    Triangle Breakout Imminent
                  </p>
                  <p className="text-sm text-blue-700 mt-1">
                    NVDA ascending triangle nearing breakout point. Monitor for volume confirmation.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-3 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
              <div className="flex items-start">
                <TrendingDown className="h-5 w-5 text-red-400 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm font-medium text-red-800">
                    Bearish Pattern Warning
                  </p>
                  <p className="text-sm text-red-700 mt-1">
                    TSLA head and shoulders pattern suggests potential reversal. Consider profit taking.
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
