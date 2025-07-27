import axios from 'axios';
import { logger } from '../utils/logger';

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  url: string;
  imageUrl?: string;
  publishedAt: string;
  source: string;
  category: 'stock' | 'crypto' | 'forex' | 'general';
  tickers?: string[];
  sentiment?: 'positive' | 'negative' | 'neutral';
  relevanceScore?: number;
}

export interface MarketNewsConfig {
  alphaVantageApiKey?: string;
  newsApiKey?: string;
  polygonApiKey?: string;
}

export class NewsService {
  private config: MarketNewsConfig;

  constructor(config: MarketNewsConfig) {
    this.config = config;
  }

  /**
   * Lấy tin tức từ Alpha Vantage News & Sentiment API
   */
  async getAlphaVantageNews(topics: string[] = ['financial_markets'], limit: number = 20): Promise<NewsArticle[]> {
    if (!this.config.alphaVantageApiKey) {
      logger.warn('Alpha Vantage API key not configured');
      return [];
    }

    try {
      logger.info('🔍 Fetching news from Alpha Vantage...');
      const topicsParam = topics.join(',');
      const url = 'https://www.alphavantage.co/query';
      const params = {
        function: 'NEWS_SENTIMENT',
        topics: topicsParam,
        apikey: this.config.alphaVantageApiKey,
        limit,
        sort: 'LATEST'
      };
      
      logger.info(`Alpha Vantage URL: ${url}`);
      logger.info(`Alpha Vantage params:`, { ...params, apikey: '***HIDDEN***' });
      
      const response = await axios.get(url, { params });

      logger.info(`Alpha Vantage response status: ${response.status}`);
      logger.info(`Alpha Vantage response data keys:`, Object.keys(response.data || {}));
      logger.info(`Alpha Vantage feed length:`, response.data.feed ? response.data.feed.length : 'No feed');
      logger.info(`Alpha Vantage items:`, response.data.items);
      
      if (response.data.feed && response.data.feed.length > 0) {
        const articles = response.data.feed.map((article: any) => ({
          id: article.url,
          title: article.title,
          summary: article.summary,
          url: article.url,
          imageUrl: article.banner_image,
          publishedAt: article.time_published,
          source: `${article.source} (Alpha Vantage)`,
          category: this.categorizeByTopics(article.topics),
          tickers: article.ticker_sentiment?.map((t: any) => t.ticker) || [],
          sentiment: this.mapSentiment(article.overall_sentiment_score),
          relevanceScore: parseFloat(article.relevance_score || '0')
        }));
        logger.info(`✅ Alpha Vantage: ${articles.length} articles fetched`);
        return articles;
      } else {
        logger.warn('⚠️ Alpha Vantage: No feed data received or feed is empty');
        logger.info('Alpha Vantage full response:', JSON.stringify(response.data, null, 2));
        
        // Check for API limit or error messages
        if (response.data.Note) {
          logger.warn('Alpha Vantage Note:', response.data.Note);
        }
        if (response.data.Information) {
          logger.warn('Alpha Vantage Information:', response.data.Information);
        }
        if (response.data['Error Message']) {
          logger.error('Alpha Vantage Error:', response.data['Error Message']);
        }
        
        return [];
      }
    } catch (error) {
      logger.error('❌ Alpha Vantage news fetch error:', error);
      return [];
    }
  }

  /**
   * Lấy tin tức từ NewsAPI
   */
  async getNewsApiData(query: string = 'financial markets', category: string = 'business'): Promise<NewsArticle[]> {
    if (!this.config.newsApiKey) {
      logger.warn('NewsAPI key not configured');
      return [];
    }

    try {
      logger.info('🔍 Fetching news from NewsAPI...');
      const response = await axios.get('https://newsapi.org/v2/everything', {
        params: {
          q: query,
          language: 'en',
          sortBy: 'publishedAt',
          pageSize: 20,
          apiKey: this.config.newsApiKey,
          domains: 'bloomberg.com,reuters.com,cnbc.com,marketwatch.com,finance.yahoo.com'
        }
      });

      if (response.data.articles) {
        const articles = response.data.articles.map((article: any) => ({
          id: article.url,
          title: article.title,
          summary: article.description || article.content?.substring(0, 200) + '...',
          url: article.url,
          imageUrl: article.urlToImage,
          publishedAt: article.publishedAt,
          source: `${article.source.name} (NewsAPI)`,
          category: 'general' as const,
          sentiment: 'neutral' as const
        }));
        logger.info(`✅ NewsAPI: ${articles.length} articles fetched`);
        return articles;
      }

      logger.warn('⚠️ NewsAPI: No articles data received');
      return [];
    } catch (error) {
      logger.error('❌ NewsAPI fetch error:', error);
      return [];
    }
  }

  /**
   * Lấy tin tức từ Polygon.io
   */
  async getPolygonNews(ticker?: string, limit: number = 20): Promise<NewsArticle[]> {
    if (!this.config.polygonApiKey) {
      logger.warn('Polygon API key not configured');
      return [];
    }

    try {
      logger.info('🔍 Fetching news from Polygon.io...');
      const url = ticker 
        ? `https://api.polygon.io/v2/reference/news?ticker=${ticker}`
        : 'https://api.polygon.io/v2/reference/news';

      const response = await axios.get(url, {
        params: {
          apikey: this.config.polygonApiKey,
          limit,
          order: 'desc'
        }
      });

      if (response.data.results) {
        const articles = response.data.results.map((article: any) => ({
          id: article.id,
          title: article.title,
          summary: article.description,
          url: article.article_url,
          imageUrl: article.image_url,
          publishedAt: article.published_utc,
          source: `${article.publisher.name} (Polygon.io)`,
          category: this.categorizeByTickers(article.tickers),
          tickers: article.tickers || [],
          sentiment: 'neutral' as const
        }));
        logger.info(`✅ Polygon.io: ${articles.length} articles fetched`);
        return articles;
      }

      logger.warn('⚠️ Polygon.io: No results data received');
      return [];
    } catch (error) {
      logger.error('❌ Polygon.io fetch error:', error);
      return [];
    }
  }

  /**
   * Kết hợp tin tức từ tất cả nguồn
   */
  async getAllMarketNews(): Promise<NewsArticle[]> {
    logger.info('🚀 Starting to fetch news from all sources...');
    
    const promises = [
      this.getAlphaVantageNews(['financial_markets', 'technology', 'blockchain']),
      this.getNewsApiData('stock market OR cryptocurrency OR forex'),
      this.getPolygonNews()
    ];

    try {
      const results = await Promise.allSettled(promises);
      const allNews: NewsArticle[] = [];

      results.forEach((result, index) => {
        const sourceName = ['Alpha Vantage', 'NewsAPI', 'Polygon.io'][index];
        if (result.status === 'fulfilled') {
          allNews.push(...result.value);
          logger.info(`✅ ${sourceName}: ${result.value.length} articles added`);
        } else {
          logger.error(`❌ ${sourceName}: ${result.reason}`);
        }
      });

      // Loại bỏ trùng lặp và sắp xếp theo thời gian
      const uniqueNews = this.removeDuplicates(allNews);
      logger.info(`📰 Total articles after deduplication: ${uniqueNews.length}`);
      
      return uniqueNews.sort((a, b) => 
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
    } catch (error) {
      logger.error('Error fetching all market news:', error);
      return [];
    }
  }

  /**
   * Lọc tin tức theo danh mục
   */
  async getNewsByCategory(category: 'stock' | 'crypto' | 'forex' | 'general'): Promise<NewsArticle[]> {
    const allNews = await this.getAllMarketNews();
    return allNews.filter(news => news.category === category);
  }

  /**
   * Tìm kiếm tin tức theo từ khóa
   */
  async searchNews(query: string): Promise<NewsArticle[]> {
    const promises = [
      this.getNewsApiData(query),
      this.getAlphaVantageNews([query])
    ];

    const results = await Promise.allSettled(promises);
    const allNews: NewsArticle[] = [];

    results.forEach((result) => {
      if (result.status === 'fulfilled') {
        allNews.push(...result.value);
      }
    });

    return this.removeDuplicates(allNews);
  }

  private categorizeByTopics(topics: any[]): 'stock' | 'crypto' | 'forex' | 'general' {
    if (!topics) return 'general';
    
    const topicLabels = topics.map(t => t.topic.toLowerCase());
    
    if (topicLabels.some(t => t.includes('crypto') || t.includes('blockchain'))) {
      return 'crypto';
    }
    if (topicLabels.some(t => t.includes('forex') || t.includes('currency'))) {
      return 'forex';
    }
    if (topicLabels.some(t => t.includes('stock') || t.includes('equity'))) {
      return 'stock';
    }
    
    return 'general';
  }

  private categorizeByTickers(tickers: string[]): 'stock' | 'crypto' | 'forex' | 'general' {
    if (!tickers || tickers.length === 0) return 'general';
    
    // Crypto tickers thường có ký tự đặc biệt hoặc kết thúc bằng USD
    if (tickers.some(t => t.includes('USD') || t.includes('BTC') || t.includes('ETH'))) {
      return 'crypto';
    }
    
    return 'stock';
  }

  private mapSentiment(score: number): 'positive' | 'negative' | 'neutral' {
    if (score > 0.1) return 'positive';
    if (score < -0.1) return 'negative';
    return 'neutral';
  }

  private removeDuplicates(news: NewsArticle[]): NewsArticle[] {
    const seen = new Set();
    return news.filter(article => {
      const key = article.title.toLowerCase().trim();
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }
}
