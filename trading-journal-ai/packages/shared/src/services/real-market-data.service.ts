/**
 * Real Market Data Service
 * Lấy dữ liệu thị trường thực từ nhiều API providers
 */

import { MarketMapperService, MarketData, MarketMapping, APIProvider } from './market-mapper.service';

export interface MarketAlert {
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

export class RealMarketDataService {
  private static readonly API_KEYS = {
    ALPHA_VANTAGE: 'demo', // Will be configured via environment
    COINGECKO: 'demo' // CoinGecko không cần API key cho basic calls
  };

  /**
   * Lấy dữ liệu thị trường cho danh sách trades
   */
  static async getPortfolioMarketData(trades: any[]): Promise<MarketData[]> {
    try {
      const openTrades = trades.filter(trade => 
        trade.status.toLowerCase() === 'open'
      );

      if (openTrades.length === 0) {
        return [];
      }

      const mappings = MarketMapperService.getPortfolioMarkets(openTrades);
      const groupedByProvider = MarketMapperService.groupByProvider(mappings);

      const results: MarketData[] = [];

      // Parallel API calls
      const promises = Object.entries(groupedByProvider).map(async ([provider, mappings]) => {
        switch (provider as APIProvider) {
          case 'alpha_vantage':
            return this.fetchAlphaVantageData(mappings);
          case 'yahoo_finance':
            return this.fetchYahooFinanceData(mappings);
          case 'coingecko':
            return this.fetchCoinGeckoData(mappings);
          default:
            return [];
        }
      });

      const providerResults = await Promise.allSettled(promises);
      
      providerResults.forEach(result => {
        if (result.status === 'fulfilled') {
          results.push(...result.value);
        }
      });

      return results;
    } catch (error) {
      // console.error('Error fetching portfolio market data:', error);
      return [];
    }
  }

  /**
   * Lấy dữ liệu từ Alpha Vantage (US Stocks, Forex)
   */
  private static async fetchAlphaVantageData(mappings: MarketMapping[]): Promise<MarketData[]> {
    const results: MarketData[] = [];

    for (const mapping of mappings) {
      try {
        const function_name = mapping.marketType === 'forex' ? 'FX_DAILY' : 'GLOBAL_QUOTE';
        const url = `https://www.alphavantage.co/query?function=${function_name}&symbol=${mapping.apiSymbol}&apikey=${this.API_KEYS.ALPHA_VANTAGE}`;
        
        // Note: In production, use proper fetch implementation
        // const response = await fetch(url);
        // const data = await response.json();
        
        // Temporarily use mock data for demo
        const mockData = this.getMockAlphaVantageData(mapping);
        if (mockData) results.push(mockData);
      } catch (error) {
        // console.error(`Error fetching Alpha Vantage data for ${mapping.symbol}:`, error);
      }
    }

    return results;
  }

  /**
   * Lấy dữ liệu từ Yahoo Finance (Vietnam Stocks)
   */
  private static async fetchYahooFinanceData(mappings: MarketMapping[]): Promise<MarketData[]> {
    const results: MarketData[] = [];

    for (const mapping of mappings) {
      try {
        // Yahoo Finance API không chính thức, sử dụng proxy hoặc alternative
        // Đây là mock data cho Vietnam stocks
        const mockData = this.getMockVietnamStockData(mapping.symbol);
        if (mockData) {
          results.push(mockData);
        }
      } catch (error) {
        // console.error(`Error fetching Yahoo Finance data for ${mapping.symbol}:`, error);
      }
    }

    return results;
  }

  /**
   * Lấy dữ liệu từ CoinGecko (Cryptocurrency)
   */
  private static async fetchCoinGeckoData(mappings: MarketMapping[]): Promise<MarketData[]> {
    const results: MarketData[] = [];

    try {
      const coinIds = mappings.map(m => m.apiSymbol).join(',');
      const url = `https://api.coingecko.com/api/v3/simple/price?ids=${coinIds}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true&include_market_cap=true`;
      
      // Note: In production, implement proper fetch
      // const response = await fetch(url);
      // const data = await response.json();
      
      // Use mock data for now
      mappings.forEach(mapping => {
        const mockData = this.getMockCryptoData(mapping.symbol);
        if (mockData) results.push(mockData);
      });
    } catch (error) {
      // console.error('Error fetching CoinGecko data:', error);
    }

    return results;
  }

  /**
   * Mock data cho Alpha Vantage (US Stocks, Forex)
   */
  private static getMockAlphaVantageData(mapping: MarketMapping): MarketData | null {
    const mockPrices: Record<string, any> = {
      'GOOGL': { price: 182.45, change: 3.55, changePercent: 1.98 },
      'AAPL': { price: 178.92, change: -2.15, changePercent: -1.19 },
      'TSLA': { price: 248.50, change: 2.70, changePercent: 1.10 },
      'USD/EUR': { price: 0.9245, change: -0.0012, changePercent: -0.13 }
    };

    const data = mockPrices[mapping.symbol];
    if (!data) return null;

    return {
      symbol: mapping.symbol,
      price: data.price,
      change: data.change,
      changePercent: data.changePercent,
      volume: Math.floor(Math.random() * 10000000),
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Mock data cho Crypto
   */
  private static getMockCryptoData(symbol: string): MarketData | null {
    const mockPrices: Record<string, any> = {
      'BTC': { price: 97450, change: 1250, changePercent: 1.30 },
      'BTC/USD': { price: 97450, change: 1250, changePercent: 1.30 },
      'ETH': { price: 3420, change: -85, changePercent: -2.42 }
    };

    const data = mockPrices[symbol];
    if (!data) return null;

    return {
      symbol,
      price: data.price,
      change: data.change,
      changePercent: data.changePercent,
      volume: Math.floor(Math.random() * 1000000),
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Mock data cho chứng khoán Việt Nam (tạm thời)
   */
  private static getMockVietnamStockData(symbol: string): MarketData | null {
    const mockPrices: Record<string, any> = {
      'FPT': { price: 112500, change: 500, changePercent: 0.45 },
      'HPG': { price: 12200, change: -200, changePercent: -1.61 },
      'VCB': { price: 95000, change: 1000, changePercent: 1.06 },
      'VIC': { price: 45500, change: -500, changePercent: -1.09 }
    };

    const data = mockPrices[symbol];
    if (!data) return null;

    return {
      symbol,
      price: data.price,
      change: data.change,
      changePercent: data.changePercent,
      volume: Math.floor(Math.random() * 1000000),
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Tạo cảnh báo thị trường dựa trên dữ liệu thực
   */
  static generateMarketAlerts(marketData: MarketData[], trades: any[]): MarketAlert[] {
    const alerts: MarketAlert[] = [];

    marketData.forEach(data => {
      const trade = trades.find(t => t.symbol === data.symbol && t.status.toLowerCase() === 'open');
      if (!trade) return;

      // High volatility alert
      if (Math.abs(data.changePercent) > 5) {
        alerts.push({
          id: `volatility_${data.symbol}_${Date.now()}`,
          type: 'high_volatility',
          symbol: data.symbol,
          title: `Biến động cao`,
          description: `${data.symbol} đã thay đổi ${data.changePercent.toFixed(2)}% trong 24h qua. Hãy cân nhắc điều chỉnh kích thước vị thế.`,
          severity: Math.abs(data.changePercent) > 10 ? 'high' : 'medium',
          timestamp: new Date().toISOString(),
          impact: data.changePercent > 0 ? 'positive' : 'negative',
          recommendation: data.changePercent > 0 ? 
            'Cân nhắc chốt lời một phần' : 
            'Xem xét cắt lỗ hoặc tăng vị thế'
        });
      }

      // Price target alert
      const currentPrice = data.price;
      const entryPrice = trade.entryPrice;
      const pnlPercent = ((currentPrice - entryPrice) / entryPrice) * 100;

      if (pnlPercent > 15) {
        alerts.push({
          id: `profit_${data.symbol}_${Date.now()}`,
          type: 'price_target',
          symbol: data.symbol,
          title: `Đạt mục tiêu lợi nhuận`,
          description: `${data.symbol} đã tăng ${pnlPercent.toFixed(2)}% so với giá vào. Cân nhắc chốt lời.`,
          severity: 'medium',
          timestamp: new Date().toISOString(),
          impact: 'positive',
          recommendation: 'Chốt lời 50% và để trailing stop cho phần còn lại'
        });
      } else if (pnlPercent < -10) {
        alerts.push({
          id: `loss_${data.symbol}_${Date.now()}`,
          type: 'price_target',
          symbol: data.symbol,
          title: `Cảnh báo biến động cao`,
          description: `${data.symbol} đã giảm ${Math.abs(pnlPercent).toFixed(2)}% so với giá vào. Hãy cân nhắc điều chỉnh kích thước vị thế.`,
          severity: 'high',
          timestamp: new Date().toISOString(),
          impact: 'negative',
          recommendation: 'Xem xét cắt lỗ nếu xu hướng tiếp tục xấu đi'
        });
      }
    });

    return alerts;
  }
}
