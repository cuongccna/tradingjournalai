'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import TradingViewChart from '@/components/ui/TradingViewChart';
import { useLanguage } from '@/lib/i18n/LanguageProvider';
import { useAuth } from '@/hooks/useAuth';
import { 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  Volume2,
  Newspaper,
  RefreshCw,
  ExternalLink,
  Clock,
  BarChart3
} from 'lucide-react';
import { api } from '@/lib/api';

interface MarketAlert {
  id: string;
  type: 'high_volatility' | 'price_target' | 'volume_spike' | 'news_impact';
  symbol: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  timestamp: string;
  impact: 'positive' | 'negative' | 'neutral';
  recommendation?: string;
}

interface MarketData {
  symbol: string;
  name?: string;
  exchange?: string;
  price: number;
  change: number;
  changePercent: number;
  volume?: number;
  timestamp: string;
  currency?: string;
}

interface MarketOverview {
  totalSymbols: number;
  gainers: MarketData[];
  losers: MarketData[];
  highVolatility: MarketData[];
  lastUpdated: string;
}

export default function MarketAlertsAndData() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<MarketAlert[]>([]);
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [overview, setOverview] = useState<MarketOverview | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const [selectedSymbol, setSelectedSymbol] = useState<string>('');
  const [showChart, setShowChart] = useState(false);

  const translations = (t as any)?.ai?.marketAlerts || {};

  useEffect(() => {
    console.log('🚀 MarketAlertsAndData component mounted!');
    fetchMarketData();
    // Auto refresh every 5 minutes
    const interval = setInterval(fetchMarketData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchMarketData = async () => {
    console.log('🔥 fetchMarketData called!');
    console.log('👤 Current user state:', user ? { uid: user.uid, email: user.email } : 'No user');
    
    setLoading(true);
    
    try {
      let symbols = ['BTC', 'ETH', 'SOL', 'FPT', 'VCB', 'HPG']; // Default including VN stocks
      
      // Try to fetch real trades if user is authenticated
      if (user?.uid) {
        console.log('✅ User authenticated, fetching real trades...');
        try {
          const tradesResponse = await api.get('/trades');
          console.log('🔍 Trades API response:', tradesResponse.data);
          
          if (tradesResponse.data?.success && tradesResponse.data.data?.length > 0) {
            const trades = tradesResponse.data.data;
            console.log('📊 Found', trades.length, 'trades');
            
            // Extract unique symbols from trades
            const extractedSymbols = [...new Set(trades.map((trade: any) => {
              let symbol = trade.symbol;
              if (symbol && symbol.includes('/')) {
                symbol = symbol.split('/')[0]; // Get base currency: "SOL/USDT" -> "SOL"
              }
              return symbol ? symbol.toUpperCase() : '';
            }).filter(Boolean) as string[])];
            
            console.log('🔍 Extracted symbols from trades:', extractedSymbols);
            
            if (extractedSymbols.length > 0) {
              symbols = [...extractedSymbols, 'FPT', 'VCB', 'HPG']; // Include VN stocks
              console.log('✅ Using extracted symbols with VN stocks:', symbols);
            } else {
              console.log('⚠️ No symbols extracted, using defaults with VN stocks');
            }
          } else {
            console.log('⚠️ No trades found, using default symbols with VN stocks');
          }
        } catch (tradesError: any) {
          // Handle specific authentication errors
          if (tradesError?.response?.status === 401) {
            console.log('🔒 User not authenticated for trades API, using default symbols');
          } else if (tradesError?.response?.status === 403) {
            console.log('🚫 User not authorized for trades API, using default symbols');
          } else {
            console.error('❌ Error fetching trades:', tradesError);
          }
          console.log('⚠️ Using fallback symbols including VN stocks');
        }
      } else {
        console.log('⚠️ No authenticated user, using default symbols');
      }
      
      console.log('🎯 Final symbols for market data:', symbols);
      
      // Separate crypto/forex symbols and VN symbols
      const vnSymbols = symbols.filter(s => ['FPT', 'VCB', 'HPG', 'VHM', 'VNM', 'TCB', 'MSN', 'VIC', 'CTG', 'BID'].includes(s));
      const otherSymbols = symbols.filter(s => !vnSymbols.includes(s));
      
      console.log('🇻🇳 Vietnamese symbols separated:', vnSymbols);
      console.log('🌍 International symbols separated:', otherSymbols);
      
      let combinedData = {
        marketData: [] as MarketData[],
        alerts: [] as MarketAlert[],
        overview: {
          totalSymbols: symbols.length,
          gainers: [] as MarketData[],
          losers: [] as MarketData[],
          highVolatility: [] as MarketData[],
          lastUpdated: new Date().toISOString(),
          marketSentiment: 'neutral'
        }
      };
      
      // Fetch crypto data from Binance
      if (otherSymbols.length > 0) {
        console.log('₿ Fetching real crypto data from Binance for symbols:', otherSymbols);
        try {
          const binanceResponse = await fetch(`/api/market/binance-data?symbols=${otherSymbols.join(',')}`);
          const binanceData = await binanceResponse.json();
          
          if (binanceData.success && binanceData.data) {
            console.log('₿ Binance crypto data received:', binanceData.data.marketData?.length || 0, 'symbols');
            combinedData.marketData.push(...(binanceData.data.marketData || []));
            combinedData.alerts.push(...(binanceData.data.alerts || []));
            if (binanceData.data.overview) {
              combinedData.overview.gainers.push(...(binanceData.data.overview.gainers || []));
              combinedData.overview.losers.push(...(binanceData.data.overview.losers || []));
              combinedData.overview.highVolatility.push(...(binanceData.data.overview.highVolatility || []));
            }
            console.log('✅ Added Binance crypto data, total symbols:', combinedData.marketData.length);
          } else {
            console.warn('₿ Binance API returned no data:', binanceData);
          }
        } catch (error) {
          console.error('❌ Error fetching Binance crypto data:', error);
        }
      }
      
      // Fetch Vietnamese market data from vnstock API
      if (vnSymbols.length > 0) {
        console.log('🇻🇳 Fetching real Vietnamese market data for symbols:', vnSymbols);
        try {
          const vnResponse = await api.get(`/trades/market-data?symbols=${vnSymbols.join(',')}`);
          console.log('🇻🇳 VN stocks API response:', vnResponse.data);
          
          if (vnResponse.data?.success && vnResponse.data.data) {
            const vnData = vnResponse.data.data;
            console.log('🇻🇳 Real VN market data received:', vnData.marketData?.length || 0, 'symbols');
            combinedData.marketData.push(...(vnData.marketData || []));
            combinedData.alerts.push(...(vnData.alerts || []));
            if (vnData.overview) {
              combinedData.overview.gainers.push(...(vnData.overview.gainers || []));
              combinedData.overview.losers.push(...(vnData.overview.losers || []));
              combinedData.overview.highVolatility.push(...(vnData.overview.highVolatility || []));
            }
            console.log('✅ Added real VN data, total symbols:', combinedData.marketData.length);
          } else {
            console.warn('🇻🇳 VN stocks API returned no data:', vnResponse.data);
          }
        } catch (error) {
          console.error('❌ Error fetching Vietnamese market data:', error);
        }
      }
      
      // Update overview with real data only
      if (combinedData.marketData.length > 0) {
        console.log('✅ Real market data received from APIs:', combinedData.marketData.length, 'symbols');
        setMarketData(combinedData.marketData);
        setAlerts(combinedData.alerts);
        setOverview(combinedData.overview);
        setLastUpdate(new Date().toLocaleTimeString('vi-VN'));
      } else {
        console.warn('⚠️ No real market data available from APIs');
        // Clear data when no real data is available
        setMarketData([]);
        setAlerts([]);
        setOverview(null);
        setLastUpdate(new Date().toLocaleTimeString('vi-VN'));
      }
    } catch (error) {
      console.error('❌ Error fetching market data from APIs:', error);
      // No fallback to mock data - only show real data
      setMarketData([]);
      setAlerts([]);
      setOverview(null);
      setLastUpdate(new Date().toLocaleTimeString('vi-VN'));
    }
    setLoading(false);
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'high_volatility':
        return <AlertTriangle className="h-4 w-4" />;
      case 'price_target':
        return <TrendingUp className="h-4 w-4" />;
      case 'volume_spike':
        return <Volume2 className="h-4 w-4" />;
      case 'news_impact':
        return <Newspaper className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      case 'low':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'positive':
        return 'text-green-600';
      case 'negative':
        return 'text-red-600';
      case 'neutral':
        return 'text-gray-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatPrice = (price: number, symbol: string, currency?: string) => {
    if (currency === 'VND' || symbol.includes('VN') || ['FPT', 'HPG', 'VCB', 'VHM', 'VNM', 'TCB', 'MSN', 'VIC', 'CTG', 'BID'].includes(symbol)) {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(price);
    } else if (symbol.includes('BTC') || symbol.includes('ETH')) {
      return `$${price.toLocaleString()}`;
    } else {
      return `$${price.toFixed(2)}`;
    }
  };

  const formatChange = (change: number, changePercent: number) => {
    const sign = change >= 0 ? '+' : '';
    const color = change >= 0 ? 'text-green-600' : 'text-red-600';
    return (
      <span className={color}>
        {sign}{change.toFixed(2)} ({sign}{changePercent.toFixed(2)}%)
      </span>
    );
  };

  const handleViewChart = (symbol: string) => {
    console.log('🔥 Opening chart for symbol:', symbol);
    setSelectedSymbol(symbol);
    setShowChart(true);
  };

  return (
    <div className="space-y-6">
      {/* TradingView Chart Modal */}
      <TradingViewChart
        symbol={selectedSymbol}
        isOpen={showChart}
        onClose={() => setShowChart(false)}
      />
      {/* Header với refresh button */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {translations.title || 'Cảnh báo & Thông báo thị trường'}
          </h3>
          <p className="text-sm text-gray-500">
            {translations.subtitle || 'Cập nhật thời gian thực từ thị trường'}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {lastUpdate && (
            <span className="text-xs text-gray-500 flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {lastUpdate}
            </span>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={fetchMarketData}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {translations.refresh || 'Cập nhật'}
          </Button>
        </div>
      </div>

      {/* Market Overview */}
      {overview && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              {translations.marketOverview || 'Tổng quan thị trường'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{overview.totalSymbols}</div>
                <div className="text-xs text-gray-500">Tổng số mã</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{overview.gainers.length}</div>
                <div className="text-xs text-gray-500">Tăng giá</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{overview.losers.length}</div>
                <div className="text-xs text-gray-500">Giảm giá</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{overview.highVolatility.length}</div>
                <div className="text-xs text-gray-500">Biến động cao</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Market Data */}
      {marketData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              {translations.portfolioPositions || 'Vị thế Portfolio'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {marketData.map((data) => (
                <div key={data.symbol} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div>
                      <div className="font-medium">{data.symbol}</div>
                      {data.name && (
                        <div className="text-xs text-gray-500">{data.name}</div>
                      )}
                    </div>
                    <div className="flex flex-col space-y-1">
                      <Badge variant="outline" className="text-xs">
                        {data.volume ? `Vol: ${(data.volume / 1000).toFixed(0)}K` : 'Live'}
                      </Badge>
                      {data.exchange && (
                        <Badge variant="secondary" className="text-xs">
                          {data.exchange}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <div className="font-medium">{formatPrice(data.price, data.symbol, data.currency)}</div>
                      <div className="text-sm">{formatChange(data.change, data.changePercent)}</div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewChart(data.symbol)}
                      className="p-2"
                    >
                      <BarChart3 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium flex items-center">
            <AlertTriangle className="h-4 w-4 mr-2" />
            {translations.alerts || 'Cảnh báo thị trường'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {alerts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>{translations.noAlerts || 'Không có cảnh báo nào'}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div key={alert.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {getAlertIcon(alert.type)}
                      <span className="font-medium text-sm">{alert.symbol}</span>
                      <Badge variant={getSeverityColor(alert.severity) as any} className="text-xs">
                        {alert.severity.toUpperCase()}
                      </Badge>
                    </div>
                    <span className={`text-xs ${getImpactColor(alert.impact)}`}>
                      {alert.impact === 'positive' ? '↗️' : alert.impact === 'negative' ? '↘️' : '➡️'}
                    </span>
                  </div>
                  
                  <h4 className="font-medium text-sm mb-1">{alert.title}</h4>
                  <p className="text-sm text-gray-600 mb-2">{alert.description}</p>
                  
                  {alert.recommendation && (
                    <div className="bg-blue-50 p-2 rounded text-xs">
                      <strong>Khuyến nghị:</strong> {alert.recommendation}
                    </div>
                  )}
                  
                  <div className="text-xs text-gray-400 mt-2">
                    {new Date(alert.timestamp).toLocaleString('vi-VN')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
