'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity,
  DollarSign,
  BarChart3,
  RefreshCw,
  AlertTriangle,
  Target,
  Clock
} from 'lucide-react';

interface MarketData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap?: number;
  pe?: number;
  sentiment: 'bullish' | 'bearish' | 'neutral';
}

interface TradingSignal {
  id: string;
  symbol: string;
  type: 'buy' | 'sell' | 'hold';
  strength: 'strong' | 'moderate' | 'weak';
  reason: string;
  target: number;
  stopLoss: number;
  confidence: number;
  timestamp: Date;
}

export default function MarketDataDashboard() {
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [tradingSignals, setTradingSignals] = useState<TradingSignal[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    fetchMarketData();
    const interval = setInterval(fetchMarketData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchMarketData = async () => {
    setLoading(true);
    
    // Simulate API call - In real implementation, this would fetch from financial APIs
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockData: MarketData[] = [
      {
        symbol: 'AAPL',
        price: 175.32,
        change: 2.15,
        changePercent: 1.24,
        volume: 65420000,
        marketCap: 2750000000000,
        pe: 28.5,
        sentiment: 'bullish'
      },
      {
        symbol: 'MSFT',
        price: 338.45,
        change: -1.23,
        changePercent: -0.36,
        volume: 24680000,
        marketCap: 2520000000000,
        pe: 32.1,
        sentiment: 'neutral'
      },
      {
        symbol: 'GOOGL',
        price: 142.87,
        change: 4.32,
        changePercent: 3.12,
        volume: 31200000,
        marketCap: 1800000000000,
        pe: 25.6,
        sentiment: 'bullish'
      },
      {
        symbol: 'TSLA',
        price: 201.34,
        change: -8.76,
        changePercent: -4.17,
        volume: 98500000,
        marketCap: 640000000000,
        pe: 65.2,
        sentiment: 'bearish'
      },
      {
        symbol: 'NVDA',
        price: 456.78,
        change: 12.45,
        changePercent: 2.80,
        volume: 42300000,
        marketCap: 1120000000000,
        pe: 78.3,
        sentiment: 'bullish'
      },
      {
        symbol: 'SPY',
        price: 421.56,
        change: 1.89,
        changePercent: 0.45,
        volume: 89200000,
        sentiment: 'bullish'
      }
    ];

    const mockSignals: TradingSignal[] = [
      {
        id: '1',
        symbol: 'AAPL',
        type: 'buy',
        strength: 'strong',
        reason: 'Bullish momentum with strong volume confirmation',
        target: 185.00,
        stopLoss: 170.00,
        confidence: 87,
        timestamp: new Date()
      },
      {
        id: '2',
        symbol: 'TSLA',
        type: 'sell',
        strength: 'moderate',
        reason: 'Bearish divergence in RSI and price action',
        target: 190.00,
        stopLoss: 210.00,
        confidence: 72,
        timestamp: new Date()
      },
      {
        id: '3',
        symbol: 'NVDA',
        type: 'hold',
        strength: 'strong',
        reason: 'Consolidation phase, wait for breakout',
        target: 480.00,
        stopLoss: 440.00,
        confidence: 81,
        timestamp: new Date()
      }
    ];

    setMarketData(mockData);
    setTradingSignals(mockSignals);
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

  const getSignalColor = (type: string) => {
    switch (type) {
      case 'buy': return 'bg-green-100 text-green-800 border-green-200';
      case 'sell': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'strong': return 'text-green-600';
      case 'moderate': return 'text-yellow-600';
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
            Market Data Dashboard
          </h2>
          <p className="text-gray-600 mt-1">Real-time market data and trading signals</p>
        </div>
        <div className="flex items-center gap-4">
          {lastUpdate && (
            <p className="text-sm text-gray-500">
              Updated {lastUpdate.toLocaleTimeString()}
            </p>
          )}
          <Button 
            onClick={fetchMarketData} 
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh Data
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Activity className="h-12 w-12 text-blue-500 animate-pulse mx-auto mb-4" />
            <p className="text-gray-600">Fetching market data...</p>
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
                  Market Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {marketData.map((stock) => (
                    <div key={stock.symbol} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div>
                            <h3 className="font-bold text-lg">{stock.symbol}</h3>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              {getSentimentIcon(stock.sentiment)}
                              <span className="capitalize">{stock.sentiment}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-lg font-bold">{formatCurrency(stock.price)}</p>
                          <div className={`text-sm font-medium ${
                            stock.change >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} 
                            ({stock.changePercent.toFixed(2)}%)
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Volume:</span>
                          <p className="font-medium">{formatNumber(stock.volume)}</p>
                        </div>
                        {stock.marketCap && (
                          <div>
                            <span className="text-gray-500">Market Cap:</span>
                            <p className="font-medium">{formatNumber(stock.marketCap)}</p>
                          </div>
                        )}
                        {stock.pe && (
                          <div>
                            <span className="text-gray-500">P/E:</span>
                            <p className="font-medium">{stock.pe}</p>
                          </div>
                        )}
                        <div>
                          <span className="text-gray-500">Status:</span>
                          <p className={`font-medium capitalize ${
                            stock.sentiment === 'bullish' ? 'text-green-600' :
                            stock.sentiment === 'bearish' ? 'text-red-600' : 'text-gray-600'
                          }`}>
                            {stock.sentiment}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Trading Signals */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-orange-500" />
                  Trading Signals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tradingSignals.map((signal) => (
                    <div key={signal.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{signal.symbol}</h4>
                        <Badge className={getSignalColor(signal.type)}>
                          {signal.type.toUpperCase()}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500">Strength:</span>
                          <span className={`font-medium capitalize ${getStrengthColor(signal.strength)}`}>
                            {signal.strength}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500">Confidence:</span>
                          <span className="font-medium">{signal.confidence}%</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500">Target:</span>
                          <span className="font-medium text-green-600">
                            {formatCurrency(signal.target)}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500">Stop Loss:</span>
                          <span className="font-medium text-red-600">
                            {formatCurrency(signal.stopLoss)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mt-3 pt-3 border-t">
                        <p className="text-xs text-gray-600">{signal.reason}</p>
                      </div>
                      
                      <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {signal.timestamp.toLocaleTimeString()}
                        </div>
                        <Button size="sm" variant="ghost" className="text-xs">
                          View Details
                        </Button>
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
            Market Alerts & Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">
                    High Volatility Alert
                  </p>
                  <p className="text-sm text-yellow-700 mt-1">
                    TSLA showing unusual volume spikes. Consider adjusting position sizes.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-3 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
              <div className="flex items-start">
                <TrendingUp className="h-5 w-5 text-blue-400 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm font-medium text-blue-800">
                    Momentum Breakout
                  </p>
                  <p className="text-sm text-blue-700 mt-1">
                    NVDA breaking above resistance at $450. Strong bullish signal detected.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-3 bg-green-50 border-l-4 border-green-400 rounded-r-lg">
              <div className="flex items-start">
                <Target className="h-5 w-5 text-green-400 mt-0.5 mr-3" />
                <div>
                  <p className="text-sm font-medium text-green-800">
                    Price Target Reached
                  </p>
                  <p className="text-sm text-green-700 mt-1">
                    AAPL reached your target price of $175. Consider taking profits.
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
