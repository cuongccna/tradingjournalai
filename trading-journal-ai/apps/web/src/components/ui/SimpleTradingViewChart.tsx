'use client';

import { useEffect, useRef } from 'react';

interface SimpleTradingViewChartProps {
  symbol: string;
  height?: number;
}

export default function SimpleTradingViewChart({ symbol, height = 400 }: SimpleTradingViewChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      // Clear previous content
      containerRef.current.innerHTML = '';

      // Format symbol for TradingView
      const formatSymbol = (sym: string) => {
        if (['BTC', 'ETH', 'SOL'].includes(sym)) {
          return `BINANCE:${sym}USDT`;
        }
        if (['GOOGL', 'AAPL', 'MSFT', 'TSLA'].includes(sym)) {
          return `NASDAQ:${sym}`;
        }
        if (['FPT', 'VCB', 'HPG'].includes(sym)) {
          return `BINANCE:BTCUSDT`; // Fallback to BTC for VN stocks since they may not be available
        }
        return `BINANCE:BTCUSDT`;
      };

      const formattedSymbol = formatSymbol(symbol);
      
      // Create TradingView widget using the embedded script approach
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js';
      script.async = true;
      
      const config = {
        "symbol": formattedSymbol,
        "width": "100%",
        "height": height,
        "locale": "en",
        "dateRange": "12M",
        "colorTheme": "light",
        "trendLineColor": "rgba(41, 98, 255, 1)",
        "underLineColor": "rgba(41, 98, 255, 0.3)",
        "underLineBottomColor": "rgba(41, 98, 255, 0)",
        "isTransparent": false,
        "autosize": true,
        "largeChartUrl": ""
      };

      script.innerHTML = JSON.stringify(config);

      // Create container
      const widgetContainer = document.createElement('div');
      widgetContainer.className = 'tradingview-widget-container';
      widgetContainer.style.height = `${height}px`;
      widgetContainer.style.width = '100%';

      const chartDiv = document.createElement('div');
      chartDiv.className = 'tradingview-widget-container__widget';

      widgetContainer.appendChild(chartDiv);
      widgetContainer.appendChild(script);

      containerRef.current.appendChild(widgetContainer);
    }
  }, [symbol, height]);

  return (
    <div 
      ref={containerRef} 
      className="w-full border rounded-lg bg-white"
      style={{ height: `${height}px` }}
    />
  );
}
