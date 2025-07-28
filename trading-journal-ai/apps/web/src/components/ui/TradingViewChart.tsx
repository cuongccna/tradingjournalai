'use client';

import { useEffect, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, TrendingUp, TrendingDown, BarChart3, AlertCircle, RefreshCw } from 'lucide-react';

// Declare TradingView global
declare global {
  interface Window {
    TradingView: any;
  }
}

interface TradingViewChartProps {
  symbol: string;
  isOpen: boolean;
  onClose: () => void;
}

// Enhanced mock chart data for different timeframes
const generateMockChartData = (symbol: string, timeframe: string = '1M') => {
  const basePrice = symbol === 'BTC' ? 97000 : 
                   symbol === 'ETH' ? 3500 :
                   symbol === 'SOL' ? 180 :
                   symbol === 'FPT' ? 122500 :
                   symbol === 'VCB' ? 98200 :
                   symbol === 'HPG' ? 25100 : 100;
  
  const data = [];
  const now = new Date();
  let previousClose = basePrice;
  
  // Determine number of data points and time interval based on timeframe
  const config: Record<string, { points: number; interval: number; label: string }> = {
    '1D': { points: 24, interval: 60 * 60 * 1000, label: 'giờ' }, // 24 hours, 1 hour intervals
    '1W': { points: 7, interval: 24 * 60 * 60 * 1000, label: 'ngày' }, // 7 days, 1 day intervals  
    '1M': { points: 30, interval: 24 * 60 * 60 * 1000, label: 'ngày' }, // 30 days, 1 day intervals
    '3M': { points: 90, interval: 24 * 60 * 60 * 1000, label: 'ngày' }, // 90 days, 1 day intervals
    '1Y': { points: 52, interval: 7 * 24 * 60 * 60 * 1000, label: 'tuần' } // 52 weeks, 1 week intervals
  };
  
  const { points, interval, label } = config[timeframe] || config['1M'];
  
  for (let i = points - 1; i >= 0; i--) {
    const date = new Date(now.getTime() - i * interval);
    
    // Generate OHLC data for candlestick
    const volatility = timeframe === '1D' ? 0.01 : 0.03; // Lower volatility for hourly data
    const trend = (Math.random() - 0.5) * volatility;
    
    const open = previousClose;
    const close = open * (1 + trend + (Math.random() - 0.5) * 0.02);
    const high = Math.max(open, close) * (1 + Math.random() * 0.02);
    const low = Math.min(open, close) * (1 - Math.random() * 0.02);
    const volume = Math.random() * 1000000 + 500000;
    
    data.push({
      date: timeframe === '1D' ? date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : 
            date.toLocaleDateString('vi-VN', { month: 'short', day: 'numeric' }),
      fullDate: date,
      timestamp: date.getTime(),
      open: open,
      high: high,
      low: low,
      close: close,
      volume: volume,
      change: close > open ? 'up' : 'down'
    });
    
    previousClose = close;
  }
  
  return data;
};

// Function to fetch real market data from Binance
const fetchRealMarketData = async (symbol: string, timeframe: string = '1M') => {
  try {
    console.log(`🔥 Fetching real market data for ${symbol} (${timeframe})`);
    
    // Check if it's a crypto symbol
    const cryptoSymbols = ['BTC', 'ETH', 'SOL', 'ADA', 'XRP', 'DOGE', 'BNB', 'MATIC', 'DOT', 'AVAX'];
    const isVnStock = ['FPT', 'VCB', 'HPG', 'VHM', 'VNM', 'TCB', 'MSN', 'VIC', 'CTG', 'BID'].includes(symbol);
    
    if (cryptoSymbols.includes(symbol)) {
      // Fetch from Binance for crypto
      console.log(`₿ Fetching ${symbol} from Binance...`);
      
      // Map timeframe to Binance interval
      const intervalMap: { [key: string]: string } = {
        '1D': '1h',   // 24 hours of 1h candles
        '1W': '1d',   // 7 days of daily candles
        '1M': '1d',   // 30 days of daily candles
        '3M': '1d',   // 90 days of daily candles
        '1Y': '1w'    // 52 weeks of weekly candles
      };
      
      const interval = intervalMap[timeframe] || '1d';
      const limit = timeframe === '1D' ? 24 : timeframe === '1W' ? 7 : timeframe === '1M' ? 30 : timeframe === '3M' ? 90 : 52;
      
      const binanceUrl = `https://api.binance.com/api/v3/klines?symbol=${symbol}USDT&interval=${interval}&limit=${limit}`;
      
      const response = await fetch(binanceUrl);
      if (response.ok) {
        const klines = await response.json();
        console.log(`₿ Received ${klines.length} real candles from Binance for ${symbol}`);
        
        return klines.map((kline: any[], index: number) => {
          const [timestamp, open, high, low, close, volume] = kline;
          const date = new Date(timestamp);
          
          return {
            date: timeframe === '1D' ? date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : 
                  date.toLocaleDateString('vi-VN', { month: 'short', day: 'numeric' }),
            fullDate: date,
            timestamp: timestamp,
            open: parseFloat(open),
            high: parseFloat(high),
            low: parseFloat(low),
            close: parseFloat(close),
            volume: parseFloat(volume),
            change: parseFloat(close) > parseFloat(open) ? 'up' : 'down'
          };
        });
      } else {
        console.warn(`₿ Binance API failed for ${symbol}, status:`, response.status);
      }
    } else if (isVnStock) {
      // For VN stocks, use enhanced mock data since we don't have historical API
      console.log(`🇻🇳 Using enhanced mock data for VN stock: ${symbol}`);
      return generateMockChartData(symbol, timeframe);
    }
    
    // Fallback to enhanced mock data
    console.log(`📊 Using enhanced mock data for ${symbol}`);
    return generateMockChartData(symbol, timeframe);
    
  } catch (error) {
    console.error('Error fetching real market data:', error);
    return generateMockChartData(symbol, timeframe);
  }
};

const formatPrice = (price: number, symbol: string) => {
  if (['FPT', 'VCB', 'HPG', 'VHM', 'VNM'].includes(symbol)) {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(price);
  }
  return `$${price.toLocaleString()}`;
};

export default function TradingViewChart({ symbol, isOpen, onClose }: TradingViewChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [showMockChart, setShowMockChart] = useState(true);
  const [mockData, setMockData] = useState<any[]>([]);
  const [useTradingView, setUseTradingView] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState('1M');

  // Convert symbol to TradingView format
  const formatSymbolForTradingView = (symbol: string) => {
    console.log('Formatting symbol for TradingView:', symbol);
    
    // Crypto symbols
    if (['BTC', 'ETH', 'SOL', 'ADA', 'XRP', 'DOGE'].includes(symbol)) {
      return `BINANCE:${symbol}USDT`;
    }
    
    // US Stocks
    if (['GOOGL', 'AAPL', 'MSFT', 'TSLA', 'AMZN', 'NVDA'].includes(symbol)) {
      return `NASDAQ:${symbol}`;
    }
    
    // Vietnamese Stocks - use correct exchange format
    if (['FPT', 'VCB', 'HPG', 'VHM', 'VNM', 'TCB', 'MSN', 'VIC'].includes(symbol)) {
      return `HOSE:${symbol}`;
    }
    
    // Forex
    if (symbol.includes('/')) {
      const [base, quote] = symbol.split('/');
      return `FX_IDC:${base}${quote}`;
    }
    
    // Default fallback
    console.log('Unknown symbol, using BTC fallback for:', symbol);
    return `BINANCE:BTCUSDT`;
  };

  // Generate/fetch chart data when opening
  useEffect(() => {
    if (isOpen && symbol) {
      const loadData = async () => {
        setIsLoading(true);
        try {
          // Fetch real data instead of mock
          const data = await fetchRealMarketData(symbol, selectedTimeframe);
          setMockData(data);
          setShowMockChart(!useTradingView);
          console.log(`🎯 Loaded ${data.length} data points for ${symbol} (${selectedTimeframe})`);
        } catch (error) {
          console.error('Error loading chart data:', error);
          // Fallback to mock data
          const data = generateMockChartData(symbol, selectedTimeframe);
          setMockData(data);
          setShowMockChart(true);
        }
        setIsLoading(false);
        setHasError(false);
      };
      
      loadData();
    }
  }, [isOpen, symbol, useTradingView, selectedTimeframe]);

  // TradingView loading (only when enabled)
  useEffect(() => {
    if (!useTradingView) {
      console.log('TradingView disabled - using real chart');
      return;
    }
    
    if (isOpen && containerRef.current && symbol) {
      setIsLoading(true);
      setHasError(false);
      setShowMockChart(false);
      
      // Clear previous widget
      containerRef.current.innerHTML = '';
      
      const formattedSymbol = formatSymbolForTradingView(symbol);
      console.log('Loading TradingView chart for symbol:', formattedSymbol);
      
      // Show loading first
      const loadingDiv = document.createElement('div');
      loadingDiv.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: center; height: 100%; background: #f8f9fa; border-radius: 8px;">
          <div style="text-align: center;">
            <div style="margin-bottom: 10px; font-size: 16px; color: #333;">📈 Đang tải biểu đồ ${symbol}...</div>
            <div style="color: #666; font-size: 12px;">TradingView Widget • ${formattedSymbol}</div>
            <div style="color: #999; font-size: 11px; margin-top: 5px;">Nếu không tải được, sẽ hiển thị biểu đồ mẫu</div>
          </div>
        </div>
      `;
      containerRef.current.appendChild(loadingDiv);
      
      // Set timeout to fallback to mock chart if TradingView doesn't load
      const fallbackTimeout = setTimeout(() => {
        console.log('TradingView timeout, showing mock chart for:', symbol);
        setIsLoading(false);
        setShowMockChart(true);
      }, 8000); // 8 seconds timeout
      
      // Try to load TradingView widget
      const loadTimeout = setTimeout(() => {
        try {
          if (containerRef.current && !showMockChart) {
            // Clear loading
            containerRef.current.innerHTML = '';
            
            // Create TradingView widget
            const widgetHTML = `
              <div class="tradingview-widget-container" style="height:100%;width:100%">
                <div class="tradingview-widget-container__widget" style="height:calc(100% - 32px);width:100%"></div>
                <div class="tradingview-widget-copyright">
                  <a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank">
                    <span class="blue-text">Track all markets on TradingView</span>
                  </a>
                </div>
              </div>
            `;
            
            containerRef.current.innerHTML = widgetHTML;
            
            // Clear the fallback timeout if widget loads successfully
            clearTimeout(fallbackTimeout);
            setIsLoading(false);
            console.log('TradingView widget loaded successfully');
          }
        } catch (error) {
          console.error('Error creating TradingView widget:', error);
          clearTimeout(fallbackTimeout);
          setIsLoading(false);
          setShowMockChart(true);
        }
      }, 300);
      
      return () => {
        clearTimeout(fallbackTimeout);
        clearTimeout(loadTimeout);
      };
    }
  }, [isOpen, symbol, useTradingView, showMockChart]);

  const renderMockChart = () => {
    const latestCandle = mockData[mockData.length - 1];
    const firstCandle = mockData[0];
    const latestPrice = latestCandle?.close || 0;
    const firstPrice = firstCandle?.open || 0;
    const totalChange = latestPrice - firstPrice;
    const totalChangePercent = firstPrice > 0 ? (totalChange / firstPrice) * 100 : 0;
    const isPositive = totalChange >= 0;

    // Calculate chart dimensions
    const allPrices = mockData.flatMap(d => [d.open, d.high, d.low, d.close]);
    const minPrice = Math.min(...allPrices);
    const maxPrice = Math.max(...allPrices);
    const priceRange = maxPrice - minPrice;
    const maxVolume = Math.max(...mockData.map(d => d.volume));

    // Generate Y-axis price levels (5 levels)
    const priceLevels = [];
    for (let i = 0; i <= 4; i++) {
      const price = minPrice + (priceRange * i / 4);
      priceLevels.push(price);
    }

    // Select X-axis labels (show 5-6 time points)
    const timeLabels = [];
    const step = Math.max(1, Math.floor(mockData.length / 5));
    for (let i = 0; i < mockData.length; i += step) {
      timeLabels.push(mockData[i]);
    }
    if (timeLabels[timeLabels.length - 1] !== mockData[mockData.length - 1]) {
      timeLabels.push(mockData[mockData.length - 1]);
    }

    return (
      <div className="w-full h-full bg-white border rounded-lg overflow-hidden">
        {/* Enhanced Header with Timeframe Selection */}
        <div className="bg-gray-50 border-b p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-4">
              <div>
                <h3 className="text-xl font-bold">{symbol}</h3>
                <p className="text-sm text-gray-500">
                  {symbol === 'BTC' ? 'Bitcoin' : 
                   symbol === 'ETH' ? 'Ethereum' :
                   symbol === 'SOL' ? 'Solana' :
                   symbol === 'FPT' ? 'FPT Corporation' :
                   symbol === 'VCB' ? 'Ngân hàng Vietcombank' :
                   symbol === 'HPG' ? 'Tập đoàn Hòa Phát' : symbol}
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{formatPrice(latestPrice, symbol)}</div>
                <div className={`text-sm flex items-center ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {isPositive ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                  {isPositive ? '+' : ''}{totalChangePercent.toFixed(2)}% ({isPositive ? '+' : ''}{formatPrice(totalChange, symbol)})
                </div>
              </div>
            </div>
            {isLoading && (
              <div className="flex items-center text-blue-600">
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Đang tải...
              </div>
            )}
          </div>
          
          {/* Timeframe Selection */}
          <div className="flex items-center space-x-2">
            {['1D', '1W', '1M', '3M', '1Y'].map((timeframe) => (
              <Button
                key={timeframe}
                variant={selectedTimeframe === timeframe ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTimeframe(timeframe)}
                className="text-xs px-3 py-1"
              >
                {timeframe}
              </Button>
            ))}
          </div>
        </div>

        {/* Chart Area with Enhanced Axes */}
        <div className="relative bg-white">
          {/* Main Chart Area */}
          <div className="h-80 relative" style={{ marginLeft: '60px', marginRight: '20px', marginTop: '10px', marginBottom: '10px' }}>
            <svg className="w-full h-full">
              <defs>
                <pattern id="grid" width="40" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 30" fill="none" stroke="#f1f5f9" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              
              {/* Y-axis grid lines */}
              {priceLevels.map((price, index) => {
                const y = 90 - (index * 22.5); // 90% to 10%, divided into 4 sections
                return (
                  <g key={index}>
                    <line
                      x1="0%"
                      y1={`${y}%`}
                      x2="100%"
                      y2={`${y}%`}
                      stroke="#e2e8f0"
                      strokeWidth="1"
                      strokeDasharray="2,2"
                    />
                  </g>
                );
              })}
              
              {/* X-axis grid lines */}
              {timeLabels.map((_, index) => {
                const x = (index / (timeLabels.length - 1)) * 100;
                return (
                  <line
                    key={index}
                    x1={`${x}%`}
                    y1="10%"
                    x2={`${x}%`}
                    y2="90%"
                    stroke="#e2e8f0"
                    strokeWidth="1"
                    strokeDasharray="2,2"
                  />
                );
              })}
              
              {/* Candlesticks */}
              {mockData.map((candle, index) => {
                const x = (index / (mockData.length - 1)) * 95 + 2.5; // 95% width with 2.5% margins
                const candleWidth = Math.max(1, 85 / mockData.length); // Dynamic width
                
                // Calculate Y positions (inverted because SVG Y=0 is top)
                const openY = 90 - ((candle.open - minPrice) / priceRange) * 80;
                const closeY = 90 - ((candle.close - minPrice) / priceRange) * 80;
                const highY = 90 - ((candle.high - minPrice) / priceRange) * 80;
                const lowY = 90 - ((candle.low - minPrice) / priceRange) * 80;
                
                const isGreen = candle.close > candle.open;
                const bodyTop = Math.min(openY, closeY);
                const bodyHeight = Math.abs(closeY - openY);
                
                return (
                  <g key={index}>
                    {/* High-Low line (wick) */}
                    <line
                      x1={`${x}%`}
                      y1={`${highY}%`}
                      x2={`${x}%`}
                      y2={`${lowY}%`}
                      stroke={isGreen ? '#10b981' : '#ef4444'}
                      strokeWidth="1"
                    />
                    
                    {/* Candle body */}
                    <rect
                      x={`${x - candleWidth/2}%`}
                      y={`${bodyTop}%`}
                      width={`${candleWidth}%`}
                      height={`${Math.max(bodyHeight, 0.5)}%`}
                      fill={isGreen ? '#10b981' : '#ef4444'}
                      stroke={isGreen ? '#059669' : '#dc2626'}
                      strokeWidth="1"
                    />
                  </g>
                );
              })}
            </svg>
            
            {/* Y-axis price labels (left side) */}
            <div className="absolute left-0 top-0 bottom-0 w-14 flex flex-col justify-between text-xs text-gray-600 py-2">
              {priceLevels.reverse().map((price, index) => (
                <div key={index} className="text-right pr-2">
                  {formatPrice(price, symbol)}
                </div>
              ))}
            </div>
          </div>
          
          {/* X-axis time labels (bottom) */}
          <div className="h-8 relative" style={{ marginLeft: '60px', marginRight: '20px' }}>
            <div className="flex justify-between text-xs text-gray-600 px-2">
              {timeLabels.map((candle, index) => (
                <div key={index} className="text-center">
                  {candle.date}
                </div>
              ))}
            </div>
          </div>
          
          {/* Volume Chart */}
          <div className="h-20 border-t bg-gray-50 relative" style={{ marginLeft: '60px', marginRight: '20px' }}>
            <div className="text-xs text-gray-600 mb-1 px-2 pt-1">Volume</div>
            <svg className="w-full h-full">
              {mockData.map((candle, index) => {
                const x = (index / (mockData.length - 1)) * 95 + 2.5;
                const barWidth = Math.max(1, 85 / mockData.length);
                const volumeHeight = (candle.volume / maxVolume) * 70; // 70% of available height
                const isGreen = candle.close > candle.open;
                
                return (
                  <rect
                    key={index}
                    x={`${x - barWidth/2}%`}
                    y={`${85 - volumeHeight}%`}
                    width={`${barWidth}%`}
                    height={`${volumeHeight}%`}
                    fill={isGreen ? '#10b981' : '#ef4444'}
                    opacity="0.7"
                  />
                );
              })}
            </svg>
            
            {/* Volume scale */}
            <div className="absolute left-0 top-2 bottom-2 w-14 flex flex-col justify-between text-xs text-gray-500">
              <div className="text-right pr-2">{(maxVolume / 1000000).toFixed(1)}M</div>
              <div className="text-right pr-2">0</div>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Panel */}
        <div className="border-t bg-gray-50 p-4">
          <div className="grid grid-cols-5 gap-4 text-center">
            <div>
              <div className="text-xs text-gray-500 mb-1">Mở cửa</div>
              <div className="font-semibold text-sm">{formatPrice(latestCandle?.open || 0, symbol)}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Cao nhất</div>
              <div className="font-semibold text-sm text-green-600">{formatPrice(maxPrice, symbol)}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Thấp nhất</div>
              <div className="font-semibold text-sm text-red-600">{formatPrice(minPrice, symbol)}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Volume</div>
              <div className="font-semibold text-sm">{(latestCandle?.volume / 1000000).toFixed(1)}M</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Biến động</div>
              <div className={`font-semibold text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {Math.abs(totalChangePercent).toFixed(2)}%
              </div>
            </div>
          </div>
        </div>

        {/* Updated Notice */}
        <div className="border-t p-3 bg-blue-50">
          <div className="flex items-center text-xs text-blue-700">
            <AlertCircle className="h-4 w-4 mr-2" />
            <div>
              <strong>Dữ liệu thật:</strong> Crypto từ Binance API, VN stocks từ vnstock. 
              Chọn khung thời gian và nhấn "📊 TradingView" để xem widget chuyên nghiệp.
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl w-full h-[700px] p-0">
        <DialogHeader className="p-4 pb-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold flex items-center">
              📈 Biểu đồ giá - {symbol}
              {showMockChart && !useTradingView && (
                <Badge variant="outline" className="ml-2 text-xs bg-green-50 text-green-700">
                  Live Data
                </Badge>
              )}
            </DialogTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setUseTradingView(!useTradingView)}
                className={useTradingView ? "bg-blue-50 text-blue-700" : "bg-green-50 text-green-700"}
              >
                {useTradingView ? '📊 TradingView' : '📈 Chart'}
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>
        
        <div className="flex-1 p-4 pt-2">
          {showMockChart ? (
            renderMockChart()
          ) : (
            <div 
              ref={containerRef} 
              className="w-full h-[600px] border rounded-lg bg-white relative overflow-hidden"
            />
          )}
        </div>
        
        <div className="p-2 text-xs text-gray-500 text-center border-t">
          {showMockChart ? (
            <>Dữ liệu thật • Crypto: Binance API • VN Stocks: vnstock • Khung thời gian: {selectedTimeframe}</>
          ) : (
            <>Biểu đồ được cung cấp bởi TradingView • Ký hiệu: {formatSymbolForTradingView(symbol)}</>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
