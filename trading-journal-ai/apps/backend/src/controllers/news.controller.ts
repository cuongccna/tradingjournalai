import { Request, Response } from 'express';
import { NewsService, MarketNewsConfig } from '../services/news.service';
import { logger } from '../utils/logger';
import { db } from '../config/firebase';

export class NewsController {
  private newsService: NewsService;

  constructor() {
    // Khởi tạo với config từ environment variables
    const config: MarketNewsConfig = {
      alphaVantageApiKey: process.env.ALPHA_VANTAGE_API_KEY,
      newsApiKey: process.env.NEWS_API_KEY,
      polygonApiKey: process.env.POLYGON_API_KEY
    };
    
    this.newsService = new NewsService(config);
  }

  /**
   * Get user's API keys from their profile
   */
  private async getUserApiKeys(userId: string): Promise<MarketNewsConfig> {
    try {
      const userDoc = await db.collection('users').doc(userId).get();
      
      if (!userDoc.exists) {
        return {
          alphaVantageApiKey: process.env.ALPHA_VANTAGE_API_KEY,
          newsApiKey: process.env.NEWS_API_KEY,
          polygonApiKey: process.env.POLYGON_API_KEY
        };
      }

      const userData = userDoc.data();
      const apiKeys = userData?.apiKeys || {};

      return {
        alphaVantageApiKey: apiKeys.alphaVantageApiKey || process.env.ALPHA_VANTAGE_API_KEY,
        newsApiKey: apiKeys.newsApiKey || process.env.NEWS_API_KEY,
        polygonApiKey: apiKeys.polygonApiKey || process.env.POLYGON_API_KEY
      };
    } catch (error) {
      logger.error('Error getting user API keys:', error);
      // Fallback to environment variables
      return {
        alphaVantageApiKey: process.env.ALPHA_VANTAGE_API_KEY,
        newsApiKey: process.env.NEWS_API_KEY,
        polygonApiKey: process.env.POLYGON_API_KEY
      };
    }
  }

  /**
   * Lấy tất cả tin tức thị trường
   */
  async getAllNews(req: Request, res: Response) {
    try {
      const userId = (req as any).user.uid;
      
      // Get user's API keys
      const config = await this.getUserApiKeys(userId);
      const newsService = new NewsService(config);
      
      const news = await newsService.getAllMarketNews();
      
      res.json({
        success: true,
        data: news,
        total: news.length,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logger.error('Error in getAllNews:', error);
      res.status(500).json({
        success: false,
        message: 'Không thể lấy tin tức thị trường',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Lấy tin tức theo danh mục
   */
  async getNewsByCategory(req: Request, res: Response) {
    try {
      const { category } = req.params;
      
      if (!['stock', 'crypto', 'forex', 'general'].includes(category)) {
        return res.status(400).json({
          success: false,
          message: 'Danh mục không hợp lệ. Sử dụng: stock, crypto, forex, general'
        });
      }

      const news = await this.newsService.getNewsByCategory(category as any);
      
      res.json({
        success: true,
        data: news,
        category,
        total: news.length,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logger.error('Error in getNewsByCategory:', error);
      res.status(500).json({
        success: false,
        message: 'Không thể lấy tin tức theo danh mục',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Tìm kiếm tin tức
   */
  async searchNews(req: Request, res: Response) {
    try {
      const { q: query } = req.query;
      
      if (!query || typeof query !== 'string') {
        return res.status(400).json({
          success: false,
          message: 'Từ khóa tìm kiếm là bắt buộc'
        });
      }

      const news = await this.newsService.searchNews(query);
      
      res.json({
        success: true,
        data: news,
        query,
        total: news.length,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logger.error('Error in searchNews:', error);
      res.status(500).json({
        success: false,
        message: 'Không thể tìm kiếm tin tức',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Lấy tin tức theo ticker cụ thể
   */
  async getNewsByTicker(req: Request, res: Response) {
    try {
      const { ticker } = req.params;
      
      if (!ticker) {
        return res.status(400).json({
          success: false,
          message: 'Ticker symbol là bắt buộc'
        });
      }

      // Sử dụng Polygon API để lấy tin tức theo ticker
      const news = await this.newsService.getPolygonNews(ticker.toUpperCase());
      
      res.json({
        success: true,
        data: news,
        ticker: ticker.toUpperCase(),
        total: news.length,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logger.error('Error in getNewsByTicker:', error);
      res.status(500).json({
        success: false,
        message: 'Không thể lấy tin tức theo ticker',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Cập nhật cấu hình API keys - Deprecated, use /api/user/api-keys instead
   */
  async updateApiConfig(req: Request, res: Response) {
    res.status(410).json({
      success: false,
      message: 'This endpoint is deprecated. Please use /api/user/api-keys instead.',
      redirectTo: '/api/user/api-keys'
    });
  }

  /**
   * Kiểm tra trạng thái các API
   */
  async checkApiStatus(req: Request, res: Response) {
    try {
      const userId = (req as any).user.uid;
      
      // Get user's API keys
      const config = await this.getUserApiKeys(userId);
      
      const status = {
        alphaVantage: !!config.alphaVantageApiKey,
        newsApi: !!config.newsApiKey,
        polygon: !!config.polygonApiKey
      };
      
      res.json({
        success: true,
        data: status,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logger.error('Error in checkApiStatus:', error);
      res.status(500).json({
        success: false,
        message: 'Không thể kiểm tra trạng thái API',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}
