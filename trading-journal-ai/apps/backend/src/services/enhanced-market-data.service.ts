/**
 * Enhanced Market Data Service - Backend Implementation
 * Tích hợp với API keys từ user settings
 */

import { db } from '../config/firebase-admin';
import fetch from 'node-fetch';

export interface MarketData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume?: number;
  high?: number;
  low?: number;
  open?: number;
  marketCap?: number;
  timestamp: string;
  source: string;
}

export interface MarketAlert {
  id: string;
  type: 'high_volatility' | 'price_target' | 'volume_spike' | 'news_impact' | 'technical_signal';
  symbol: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  timestamp: string;
  impact: 'positive' | 'negative' | 'neutral';
  recommendation?: string;
}

export interface MarketOverview {
  totalSymbols: number;
  gainers: MarketData[];
  losers: MarketData[];
  highVolatility: MarketData[];
  lastUpdated: string;
  marketSentiment: 'bullish' | 'bearish' | 'neutral';
  majorIndices: {
    sp500: { price: number; change: number; changePercent: number };
    nasdaq: { price: number; change: number; changePercent: number };
    dow: { price: number; change: number; changePercent: number };
  };
}

export class EnhancedMarketDataService {
  /**
   * Lấy dữ liệu thị trường với API keys của user
   */
  static async getPortfolioMarketData(userId: string, symbols: string[]): Promise<{
    marketData: MarketData[];
    alerts: MarketAlert[];
    overview: MarketOverview;
  }> {
    try {
      // Validate userId
      if (!userId || userId === 'undefined') {
        console.log('No valid userId provided, using fallback data');
        return this.getFallbackData(symbols);
      }

      // Lấy API keys của user từ Firebase
      const userDoc = await db.collection('users').doc(userId).get();
      const userData = userDoc.data();
      const apiKeys = userData?.apiKeys || {};

      console.log('Using API keys for user:', userId, 'Available keys:', Object.keys(apiKeys));

      const marketData: MarketData[] = [];
      const alerts: MarketAlert[] = [];

      // Always fetch crypto data from free APIs first
      const cryptoData = await this.fetchCryptoData(symbols);
      marketData.push(...cryptoData.data);
      alerts.push(...cryptoData.alerts);

      // Parallel API calls với fallback logic cho stocks
      const promises = [];
      const stockSymbols = symbols.filter(s => !['BTC', 'ETH', 'ADA', 'DOT', 'LINK'].includes(s));

      if (stockSymbols.length > 0) {
        if (apiKeys.alphaVantageApiKey) {
          promises.push(this.fetchAlphaVantageData(stockSymbols.slice(0, 3), apiKeys.alphaVantageApiKey));
        }

        if (apiKeys.polygonApiKey) {
          promises.push(this.fetchPolygonData(stockSymbols.slice(0, 2), apiKeys.polygonApiKey));
        }
      }

      if (apiKeys.newsApiKey) {
        promises.push(this.fetchMarketNews(symbols, apiKeys.newsApiKey));
      }

      if (promises.length > 0) {
        const results = await Promise.allSettled(promises);

        // Process results
        results.forEach((result, index) => {
          if (result.status === 'fulfilled') {
            const value = result.value;
            
            // Check if this is market data (has .data property) or news data (array)
            if (Array.isArray(value)) {
              // This is news alerts (array of MarketAlert)
              const newsAlerts = value as MarketAlert[];
              alerts.push(...newsAlerts);
            } else if (value && typeof value === 'object' && 'data' in value) {
              // This is market data (object with .data and .alerts)
              const data = value as { data: MarketData[]; alerts: MarketAlert[] };
              if (data.data && Array.isArray(data.data)) {
                marketData.push(...data.data);
              }
              if (data.alerts && Array.isArray(data.alerts)) {
                alerts.push(...data.alerts);
              }
            } else {
              console.warn('Unexpected API result format:', value);
            }
          } else {
            console.error('API call failed:', result.reason);
          }
        });
      }

      // Fallback for remaining symbols if no data obtained
      const obtainedSymbols = marketData.map(d => d.symbol);
      const missingSymbols = symbols.filter(s => !obtainedSymbols.includes(s));
      
      if (missingSymbols.length > 0) {
        console.log('Using fallback data for missing symbols:', missingSymbols);
        const fallbackData = this.getFallbackData(missingSymbols);
        marketData.push(...fallbackData.marketData.filter(d => missingSymbols.includes(d.symbol)));
        alerts.push(...fallbackData.alerts.filter(a => missingSymbols.includes(a.symbol)));
      }

      // Generate enhanced data
      const overview = this.generateMarketOverview(marketData);
      const technicalAlerts = this.generateTechnicalAlerts(marketData);
      alerts.push(...technicalAlerts);

      return {
        marketData: this.deduplicateData(marketData),
        alerts: this.prioritizeAlerts(alerts),
        overview
      };

    } catch (error) {
      console.error('Error in getPortfolioMarketData:', error);
      return this.getFallbackData(symbols);
    }
  }

  /**
   * Fetch crypto data from CoinGecko API (Free, no API key needed)
   */
  private static async fetchCryptoData(symbols: string[]): Promise<{
    data: MarketData[];
    alerts: MarketAlert[];
  }> {
    const data: MarketData[] = [];
    const alerts: MarketAlert[] = [];

    // Map symbols to CoinGecko IDs
    const cryptoMap: { [key: string]: string } = {
      'BTC': 'bitcoin',
      'ETH': 'ethereum', 
      'ADA': 'cardano',
      'DOT': 'polkadot',
      'LINK': 'chainlink'
    };

    const cryptoSymbols = symbols.filter(s => cryptoMap[s]);
    if (cryptoSymbols.length === 0) {
      return { data, alerts };
    }

    try {
      const cryptoIds = cryptoSymbols.map(s => cryptoMap[s]).join(',');
      const url = `https://api.coingecko.com/api/v3/simple/price?ids=${cryptoIds}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true`;
      
      console.log('🔗 Fetching crypto data from CoinGecko:', url);
      
      const response = await fetch(url);
      const result = await response.json() as any;

      for (const symbol of cryptoSymbols) {
        const coinId = cryptoMap[symbol];
        const coinData = result[coinId];

        if (coinData) {
          const price = coinData.usd;
          const change24h = coinData.usd_24h_change || 0;
          const volume24h = coinData.usd_24h_vol || 0;

          const marketData: MarketData = {
            symbol: symbol,
            price: price,
            change: (price * change24h) / 100,
            changePercent: change24h,
            volume: Math.round(volume24h / price), // Convert USD volume to coin volume
            timestamp: new Date().toISOString(),
            source: 'CoinGecko'
          };

          data.push(marketData);

          // Generate crypto-specific alerts
          if (Math.abs(change24h) > 5) {
            alerts.push({
              id: `crypto_volatility_${symbol}_${Date.now()}`,
              type: 'high_volatility',
              symbol: symbol,
              title: `CoinGecko: ${symbol} biến động mạnh`,
              description: `${symbol} có biến động ${change24h.toFixed(2)}% trong 24h (dữ liệu từ CoinGecko)`,
              severity: Math.abs(change24h) > 10 ? 'high' : 'medium',
              timestamp: new Date().toISOString(),
              impact: change24h > 0 ? 'positive' : 'negative',
              recommendation: `Dữ liệu real-time từ CoinGecko. ${change24h > 0 ? 'Cân nhắc chốt lời một phần' : 'Theo dõi support levels'}`
            });
          }

          console.log(`✅ CoinGecko data fetched for ${symbol}: $${price.toLocaleString()}`);
        }
      }

    } catch (error) {
      console.error('Error fetching CoinGecko data:', error);
    }

    return { data, alerts };
  }

  /**
   * Alpha Vantage API integration
   */
  private static async fetchAlphaVantageData(symbols: string[], apiKey: string): Promise<{
    data: MarketData[];
    alerts: MarketAlert[];
  }> {
    const data: MarketData[] = [];
    const alerts: MarketAlert[] = [];

    for (const symbol of symbols) {
      try {
        const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`;
        
        const response = await fetch(url);
        const result = await response.json() as any;

        if (result['Global Quote'] && Object.keys(result['Global Quote']).length > 0) {
          const quote = result['Global Quote'];
          const marketData: MarketData = {
            symbol: quote['01. symbol'] || symbol,
            price: parseFloat(quote['05. price'] || '0'),
            change: parseFloat(quote['09. change'] || '0'),
            changePercent: parseFloat((quote['10. change percent'] || '0%').replace('%', '')),
            high: parseFloat(quote['03. high'] || '0'),
            low: parseFloat(quote['04. low'] || '0'),
            open: parseFloat(quote['02. open'] || '0'),
            volume: parseInt(quote['06. volume'] || '0'),
            timestamp: new Date().toISOString(),
            source: 'Alpha Vantage'
          };

          data.push(marketData);

          // Generate volatility alerts
          if (Math.abs(marketData.changePercent) > 5) {
            alerts.push({
              id: `av_volatility_${symbol}_${Date.now()}`,
              type: 'high_volatility',
              symbol: symbol,
              title: `Alpha Vantage: Biến động cao ${symbol}`,
              description: `${symbol} có biến động ${marketData.changePercent.toFixed(2)}% (dữ liệu từ Alpha Vantage)`,
              severity: Math.abs(marketData.changePercent) > 10 ? 'high' : 'medium',
              timestamp: new Date().toISOString(),
              impact: marketData.changePercent > 0 ? 'positive' : 'negative',
              recommendation: `Dữ liệu thực từ Alpha Vantage. ${marketData.changePercent > 0 ? 'Cân nhắc chốt lời một phần' : 'Xem xét cắt lỗ'}`
            });
          }

          console.log(`✅ Alpha Vantage data fetched for ${symbol}: $${marketData.price}`);
        } else if (result['Note']) {
          console.warn(`Alpha Vantage rate limit for ${symbol}:`, result['Note']);
        } else {
          console.warn(`No data from Alpha Vantage for ${symbol}:`, result);
        }

        // Respect rate limits (5 calls per minute)
        await new Promise(resolve => setTimeout(resolve, 12000));

      } catch (error) {
        console.error(`Error fetching Alpha Vantage data for ${symbol}:`, error);
      }
    }

    return { data, alerts };
  }

  /**
   * NewsAPI integration for market sentiment
   */
  private static async fetchMarketNews(symbols: string[], apiKey: string): Promise<MarketAlert[]> {
    const alerts: MarketAlert[] = [];

    try {
      // Search for relevant market news
      const query = symbols.slice(0, 3).join(' OR ') + ' market stock';
      const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&sortBy=publishedAt&apiKey=${apiKey}&pageSize=5`;
      
      const response = await fetch(url);
      const result = await response.json() as any;

      if (result.articles) {
        result.articles.forEach((article: any, index: number) => {
          const relevantSymbol = symbols.find(s => 
            article.title.toUpperCase().includes(s.toUpperCase()) ||
            (article.description && article.description.toUpperCase().includes(s.toUpperCase()))
          );

          if (relevantSymbol) {
            alerts.push({
              id: `news_${relevantSymbol}_${Date.now()}_${index}`,
              type: 'news_impact',
              symbol: relevantSymbol,
              title: `NewsAPI: Tin tức về ${relevantSymbol}`,
              description: article.title,
              severity: 'medium',
              timestamp: article.publishedAt,
              impact: 'neutral',
              recommendation: `Tin tức mới từ ${article.source.name}. Đọc chi tiết để đánh giá tác động.`
            });
          }
        });

        console.log(`✅ NewsAPI: Found ${alerts.length} relevant news articles`);
      }
    } catch (error) {
      console.error('Error fetching NewsAPI data:', error);
    }

    return alerts;
  }

  /**
   * Polygon.io API integration
   */
  private static async fetchPolygonData(symbols: string[], apiKey: string): Promise<{
    data: MarketData[];
    alerts: MarketAlert[];
  }> {
    const data: MarketData[] = [];
    const alerts: MarketAlert[] = [];

    for (const symbol of symbols) {
      try {
        const url = `https://api.polygon.io/v2/aggs/ticker/${symbol}/prev?adjusted=true&apikey=${apiKey}`;
        
        const response = await fetch(url);
        const result = await response.json() as any;

        if (result.results && result.results[0]) {
          const quote = result.results[0];
          const change = quote.c - quote.o;
          const changePercent = (change / quote.o) * 100;

          const marketData: MarketData = {
            symbol: symbol,
            price: quote.c,
            change: change,
            changePercent: changePercent,
            high: quote.h,
            low: quote.l,
            open: quote.o,
            volume: quote.v,
            timestamp: new Date().toISOString(),
            source: 'Polygon.io'
          };

          data.push(marketData);
          console.log(`✅ Polygon.io data fetched for ${symbol}: $${marketData.price}`);
        }

        // Respect rate limits (5 calls per minute for free tier)
        await new Promise(resolve => setTimeout(resolve, 12000));

      } catch (error) {
        console.error(`Error fetching Polygon data for ${symbol}:`, error);
      }
    }

    return { data, alerts };
  }

  /**
   * Generate technical alerts from real data
   */
  private static generateTechnicalAlerts(marketData: MarketData[]): MarketAlert[] {
    const alerts: MarketAlert[] = [];

    marketData.forEach(data => {
      // Volume spike detection
      if (data.volume && data.volume > 1000000) {
        alerts.push({
          id: `volume_${data.symbol}_${Date.now()}`,
          type: 'volume_spike',
          symbol: data.symbol,
          title: `Khối lượng bất thường - ${data.symbol}`,
          description: `Khối lượng giao dịch ${(data.volume / 1000000).toFixed(1)}M, cao hơn bình thường`,
          severity: 'medium',
          timestamp: new Date().toISOString(),
          impact: 'neutral',
          recommendation: 'Theo dõi để xác nhận breakout hoặc breakdown'
        });
      }

      // Strong momentum alert
      if (data.changePercent > 8) {
        alerts.push({
          id: `momentum_${data.symbol}_${Date.now()}`,
          type: 'price_target',
          symbol: data.symbol,
          title: `Đột phá mạnh - ${data.symbol}`,
          description: `Tăng ${data.changePercent.toFixed(2)}% trong phiên, có thể gặp kháng cự`,
          severity: 'high',
          timestamp: new Date().toISOString(),
          impact: 'positive',
          recommendation: 'Cân nhắc chốt lời một phần và đặt trailing stop'
        });
      } else if (data.changePercent < -8) {
        alerts.push({
          id: `decline_${data.symbol}_${Date.now()}`,
          type: 'price_target',
          symbol: data.symbol,
          title: `Sụt giảm mạnh - ${data.symbol}`,
          description: `Giảm ${Math.abs(data.changePercent).toFixed(2)}% trong phiên`,
          severity: 'high',
          timestamp: new Date().toISOString(),
          impact: 'negative',
          recommendation: 'Xem xét cắt lỗ nếu vượt ngưỡng stop loss'
        });
      }
    });

    return alerts;
  }

  private static deduplicateData(marketData: MarketData[]): MarketData[] {
    const seen = new Set<string>();
    return marketData.filter(data => {
      if (seen.has(data.symbol)) {
        return false;
      }
      seen.add(data.symbol);
      return true;
    });
  }

  private static prioritizeAlerts(alerts: MarketAlert[]): MarketAlert[] {
    return alerts
      .sort((a, b) => {
        const severityOrder = { high: 3, medium: 2, low: 1 };
        return severityOrder[b.severity] - severityOrder[a.severity];
      })
      .slice(0, 15);
  }

  private static generateMarketOverview(marketData: MarketData[]): MarketOverview {
    const gainers = marketData.filter(d => d.changePercent > 0);
    const losers = marketData.filter(d => d.changePercent < 0);
    const highVolatility = marketData.filter(d => Math.abs(d.changePercent) > 3);

    const avgChange = marketData.reduce((sum, d) => sum + d.changePercent, 0) / marketData.length;
    const marketSentiment: 'bullish' | 'bearish' | 'neutral' = 
      avgChange > 1 ? 'bullish' : avgChange < -1 ? 'bearish' : 'neutral';

    return {
      totalSymbols: marketData.length,
      gainers,
      losers,
      highVolatility,
      lastUpdated: new Date().toISOString(),
      marketSentiment,
      majorIndices: {
        sp500: { price: 5847, change: 12.5, changePercent: 0.21 },
        nasdaq: { price: 18502, change: -15.2, changePercent: -0.08 },
        dow: { price: 42856, change: 25.9, changePercent: 0.06 }
      }
    };
  }

  private static getFallbackData(symbols: string[]): {
    marketData: MarketData[];
    alerts: MarketAlert[];
    overview: MarketOverview;
  } {
    const mockData: MarketData[] = [
      {
        symbol: 'GOOGL',
        price: 182.45 + (Math.random() - 0.5) * 10,
        change: 3.55 + (Math.random() - 0.5) * 2,
        changePercent: 1.98 + (Math.random() - 0.5),
        volume: 1500000,
        timestamp: new Date().toISOString(),
        source: 'Demo Data'
      },
      {
        symbol: 'BTC',
        price: 97450 + (Math.random() - 0.5) * 1000,
        change: 1250 + (Math.random() - 0.5) * 500,
        changePercent: 1.30 + (Math.random() - 0.5),
        volume: 25000,
        timestamp: new Date().toISOString(),
        source: 'Demo Data'
      },
      {
        symbol: 'FPT',
        price: 112500 + (Math.random() - 0.5) * 2000,
        change: 500 + (Math.random() - 0.5) * 1000,
        changePercent: 0.45 + (Math.random() - 0.5),
        volume: 890000,
        timestamp: new Date().toISOString(),
        source: 'Demo Data'
      }
    ];

    const mockAlerts: MarketAlert[] = [
      {
        id: 'demo_alert_1',
        type: 'high_volatility',
        symbol: 'GOOGL',
        title: 'Demo: Biến động cao GOOGL',
        description: 'Đây là dữ liệu demo. Hãy cấu hình API keys để nhận dữ liệu thật.',
        severity: 'medium',
        timestamp: new Date().toISOString(),
        impact: 'positive',
        recommendation: 'Đi tới Settings > API để cấu hình các API keys'
      }
    ];

    return {
      marketData: mockData,
      alerts: mockAlerts,
      overview: this.generateMarketOverview(mockData)
    };
  }
}
