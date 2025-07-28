import { Router, Request, Response } from 'express';
import { EnhancedMarketDataService } from '../services/enhanced-market-data.service';

const router: Router = Router();

/**
 * GET /api/market/portfolio-data
 * Lấy dữ liệu thị trường cho portfolio hiện tại
 */
router.get('/portfolio-data', async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId as string;
    const symbols = (req.query.symbols as string)?.split(',') || ['GOOGL', 'BTC', 'FPT'];

    console.log('Market API: Fetching portfolio data for user:', userId, 'symbols:', symbols);

    // Use the enhanced service
    const result = await EnhancedMarketDataService.getPortfolioMarketData(userId, symbols);

    console.log(`Market API: Successfully fetched ${result.marketData.length} market data items and ${result.alerts.length} alerts`);

    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Market API Error:', error);
    res.status(500).json({
      success: false,
      error: 'Lỗi khi lấy dữ liệu thị trường',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/market/symbol/:symbol
 * Lấy dữ liệu thị trường cho một symbol cụ thể
 */
router.get('/symbol/:symbol', async (req: Request, res: Response) => {
  try {
    const { symbol } = req.params;
    
    // Mock mapping logic
    const identifyMarket = (sym: string) => {
      const vietnamStocks = ['FPT', 'HPG', 'VCB', 'VIC'];
      const cryptos = ['BTC', 'ETH', 'BTC/USD'];
      const forex = ['USD/EUR', 'EUR/USD'];
      
      if (vietnamStocks.includes(sym.toUpperCase())) {
        return { marketType: 'vietnam_stock', apiProvider: 'yahoo_finance' };
      } else if (cryptos.some(c => sym.includes(c))) {
        return { marketType: 'crypto', apiProvider: 'coingecko' };
      } else if (forex.some(f => sym.includes(f))) {
        return { marketType: 'forex', apiProvider: 'alpha_vantage' };
      } else {
        return { marketType: 'us_stock', apiProvider: 'alpha_vantage' };
      }
    };
    
    const mapping = identifyMarket(symbol);
    
    res.json({
      success: true,
      data: {
        mapping,
        recommendation: `Use ${mapping.apiProvider} API for ${symbol}`
      }
    });
  } catch (error) {
    console.error('Error identifying market for symbol:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * GET /api/market/alerts  
 * Lấy các cảnh báo thị trường
 */
router.get('/alerts', async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId as string;
    const symbols = (req.query.symbols as string)?.split(',') || ['GOOGL', 'BTC', 'FPT'];

    // Get alerts from enhanced service
    const result = await EnhancedMarketDataService.getPortfolioMarketData(userId, symbols);

    res.json({
      success: true,
      data: result.alerts
    });
  } catch (error) {
    console.error('Error fetching market alerts:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export default router;
