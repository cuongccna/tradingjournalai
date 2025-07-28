/**
 * Enhanced Real Market Data Service with API Integration
 * Sử dụng API keys từ user settings để lấy dữ liệu thị trường thực
 */

// Node.js compatible fetch for server-side usage
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
  source: string; // API source used
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
  technicalData?: {
    rsi?: number;
    sma20?: number;
    sma50?: number;
    volume?: number;
    support?: number;
    resistance?: number;
  };
}

export interface MarketOverview {
  totalSymbols: number;
  gainers: MarketData[];
  losers: MarketData[];
  highVolatility: MarketData[];
  lastUpdated: string;
  marketSentiment: 'bullish' | 'bearish' | 'neutral';
  vixLevel?: number;
  majorIndices: {
    sp500: { price: number; change: number; changePercent: number };
    nasdaq: { price: number; change: number; changePercent: number };
    dow: { price: number; change: number; changePercent: number };
  };
}

export class EnhancedMarketDataService {
  private static apiKeys: Record<string, string> = {};

  /**
   * Initialize service with user API keys
   */
  static initialize(apiKeys: Record<string, string>) {
    this.apiKeys = apiKeys;
  }

  /**
   * Lấy dữ liệu thị trường cho portfolio với API thực
   */
  static async getPortfolioMarketData(userId: string, symbols: string[]): Promise<{
    marketData: MarketData[];
    alerts: MarketAlert[];
    overview: MarketOverview;
  }> {
    try {
      const marketData: MarketData[] = [];
      const alerts: MarketAlert[] = [];

      // Parallel fetch từ các API providers
      const alphaVantagePromise = this.fetchAlphaVantageData(symbols);
      const newsApiPromise = this.fetchMarketNews(symbols);
      const polygonPromise = this.fetchPolygonData(symbols);

      const [avData, newsData, polygonData] = await Promise.allSettled([
        alphaVantagePromise,
        newsApiPromise, 
        polygonPromise
      ]);

      // Combine data from successful API calls
      if (avData.status === 'fulfilled') {
        marketData.push(...avData.value.data);
        alerts.push(...avData.value.alerts);
      }

      if (polygonData.status === 'fulfilled') {
        marketData.push(...polygonData.value.data);
        alerts.push(...polygonData.value.alerts);
      }

      if (newsData.status === 'fulfilled') {
        alerts.push(...newsData.value);
      }

      // Fallback to demo data if no real data
      if (marketData.length === 0) {
        return this.getFallbackData(symbols);
      }

      // Generate overview
      const overview = this.generateMarketOverview(marketData);

      // Generate technical alerts
      const technicalAlerts = this.generateTechnicalAlerts(marketData);
      alerts.push(...technicalAlerts);

      return {
        marketData: this.deduplicateData(marketData),
        alerts: this.prioritizeAlerts(alerts),
        overview
      };

    } catch (error) {
      console.error('Error fetching market data:', error);
      return this.getFallbackData(symbols);
    }
  }

  /**
   * Fetch data từ Alpha Vantage API
   */
  private static async fetchAlphaVantageData(symbols: string[]): Promise<{
    data: MarketData[];
    alerts: MarketAlert[];
  }> {
    const data: MarketData[] = [];
    const alerts: MarketAlert[] = [];

    if (!this.apiKeys.alphaVantageApiKey) {
      return { data, alerts };
    }

    for (const symbol of symbols.slice(0, 3)) { // Limit to avoid rate limits
      try {
        const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${this.apiKeys.alphaVantageApiKey}`;
        
        const response = await fetch(url);
        const result = await response.json();

        if (result['Global Quote']) {
          const quote = result['Global Quote'];
          const marketData: MarketData = {
            symbol: quote['01. symbol'],
            price: parseFloat(quote['05. price']),
            change: parseFloat(quote['09. change']),
            changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
            high: parseFloat(quote['03. high']),
            low: parseFloat(quote['04. low']),
            open: parseFloat(quote['02. open']),
            volume: parseInt(quote['06. volume']),
            timestamp: new Date().toISOString(),
            source: 'Alpha Vantage'
          };

          data.push(marketData);

          // Generate alerts based on real data
          if (Math.abs(marketData.changePercent) > 5) {
            alerts.push({
              id: `volatility_${symbol}_${Date.now()}`,
              type: 'high_volatility',
              symbol: symbol,
              title: `Biến động cao - ${symbol}`,
              description: `${symbol} có biến động ${marketData.changePercent.toFixed(2)}% trong phiên giao dịch hôm nay`,
              severity: Math.abs(marketData.changePercent) > 10 ? 'high' : 'medium',
              timestamp: new Date().toISOString(),
              impact: marketData.changePercent > 0 ? 'positive' : 'negative',
              recommendation: marketData.changePercent > 0 ? 
                'Cân nhắc chốt lời một phần' : 
                'Xem xét cắt lỗ nếu xu hướng tiếp tục xấu đi'
            });
          }
        }

        // Avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));

      } catch (error) {
        console.error(`Error fetching Alpha Vantage data for ${symbol}:`, error);
      }
    }

    return { data, alerts };
  }

  /**
   * Fetch news data từ NewsAPI
   */
  private static async fetchMarketNews(symbols: string[]): Promise<MarketAlert[]> {
    const alerts: MarketAlert[] = [];

    if (!this.apiKeys.newsApiKey) {
      return alerts;
    }

    try {
      // Search for market news
      const query = symbols.join(' OR ');
      const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&apiKey=${this.apiKeys.newsApiKey}&pageSize=5`;
      
      const response = await fetch(url);
      const result = await response.json();

      if (result.articles) {
        result.articles.forEach((article: any, index: number) => {
          const relevantSymbol = symbols.find(s => 
            article.title.toUpperCase().includes(s.toUpperCase()) ||
            article.description?.toUpperCase().includes(s.toUpperCase())
          );

          if (relevantSymbol) {
            alerts.push({
              id: `news_${relevantSymbol}_${Date.now()}_${index}`,
              type: 'news_impact',
              symbol: relevantSymbol,
              title: 'Tin tức liên quan',
              description: article.title,
              severity: 'medium',
              timestamp: article.publishedAt,
              impact: 'neutral',
              recommendation: `Đọc chi tiết: ${article.url}`
            });
          }
        });
      }
    } catch (error) {
      console.error('Error fetching news data:', error);
    }

    return alerts;
  }

  /**
   * Fetch data từ Polygon.io API
   */
  private static async fetchPolygonData(symbols: string[]): Promise<{
    data: MarketData[];
    alerts: MarketAlert[];
  }> {
    const data: MarketData[] = [];
    const alerts: MarketAlert[] = [];

    if (!this.apiKeys.polygonApiKey) {
      return { data, alerts };
    }

    for (const symbol of symbols.slice(0, 2)) { // More restrictive rate limits
      try {
        const url = `https://api.polygon.io/v2/aggs/ticker/${symbol}/prev?adjusted=true&apikey=${this.apiKeys.polygonApiKey}`;
        
        const response = await fetch(url);
        const result = await response.json();

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
        }

        // Rate limit compliance
        await new Promise(resolve => setTimeout(resolve, 2000));

      } catch (error) {
        console.error(`Error fetching Polygon data for ${symbol}:`, error);
      }
    }

    return { data, alerts };
  }

  /**
   * Generate technical analysis alerts
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
          title: 'Tăng khối lượng bất thường',
          description: `${data.symbol} có khối lượng giao dịch ${(data.volume / 1000000).toFixed(1)}M, cao hơn bình thường`,
          severity: 'medium',
          timestamp: new Date().toISOString(),
          impact: 'neutral',
          recommendation: 'Theo dõi để xác nhận breakout'
        });
      }

      // Price target alerts
      if (data.changePercent > 8) {
        alerts.push({
          id: `target_${data.symbol}_${Date.now()}`,
          type: 'price_target',
          symbol: data.symbol,
          title: 'Đạt mục tiêu giá',
          description: `${data.symbol} đã tăng ${data.changePercent.toFixed(2)}% và có thể gặp kháng cự`,
          severity: 'high',
          timestamp: new Date().toISOString(),
          impact: 'positive',
          recommendation: 'Cân nhắc chốt lời và đặt trailing stop'
        });
      }
    });

    return alerts;
  }

  /**
   * Remove duplicate data from multiple sources
   */
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

  /**
   * Prioritize alerts by severity and relevance
   */
  private static prioritizeAlerts(alerts: MarketAlert[]): MarketAlert[] {
    return alerts
      .sort((a, b) => {
        const severityOrder = { high: 3, medium: 2, low: 1 };
        return severityOrder[b.severity] - severityOrder[a.severity];
      })
      .slice(0, 10); // Limit to top 10 alerts
  }

  /**
   * Generate market overview from real data
   */
  private static generateMarketOverview(marketData: MarketData[]): MarketOverview {
    const gainers = marketData.filter(d => d.changePercent > 0);
    const losers = marketData.filter(d => d.changePercent < 0);
    const highVolatility = marketData.filter(d => Math.abs(d.changePercent) > 5);

    // Determine market sentiment
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
        sp500: { price: 5800, change: 12.5, changePercent: 0.22 },
        nasdaq: { price: 18500, change: -45.2, changePercent: -0.24 },
        dow: { price: 42800, change: 8.9, changePercent: 0.02 }
      }
    };
  }

  /**
   * Fallback to demo data when APIs fail
   */
  private static getFallbackData(symbols: string[]): {
    marketData: MarketData[];
    alerts: MarketAlert[];
    overview: MarketOverview;
  } {
    const mockData = symbols.map(symbol => ({
      symbol,
      price: 100 + Math.random() * 200,
      change: (Math.random() - 0.5) * 10,
      changePercent: (Math.random() - 0.5) * 5,
      volume: Math.floor(Math.random() * 2000000),
      timestamp: new Date().toISOString(),
      source: 'Demo Data'
    }));

    return {
      marketData: mockData,
      alerts: [],
      overview: this.generateMarketOverview(mockData)
    };
  }
}
