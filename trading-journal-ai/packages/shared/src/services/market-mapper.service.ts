/**
 * Market Mapper Service
 * Xác định thị trường và API provider phù hợp cho mỗi symbol
 */

export type MarketType = 'vietnam_stock' | 'us_stock' | 'crypto' | 'forex' | 'global_stock';
export type APIProvider = 'alpha_vantage' | 'yahoo_finance' | 'coingecko' | 'vietstock' | 'finhay';

export interface MarketMapping {
  symbol: string;
  marketType: MarketType;
  apiProvider: APIProvider;
  apiSymbol: string; // Symbol format cho API call
  currency: string;
  exchange?: string;
  country?: string;
}

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
}

export class MarketMapperService {
  private static readonly VIETNAM_STOCKS = [
    'FPT', 'VCB', 'VIC', 'VNM', 'HPG', 'MSN', 'TCB', 'BID', 'CTG', 'VJC',
    'GAS', 'PLX', 'POW', 'NVL', 'TPB', 'MBB', 'ACB', 'STB', 'HDB', 'EIB',
    'SSI', 'VND', 'VRE', 'PDR', 'KDH', 'DIG', 'FLC', 'PNJ', 'MWG', 'REE'
  ];

  private static readonly CRYPTO_PATTERNS = [
    /^BTC/, /^ETH/, /^ADA/, /^DOT/, /^LINK/, /^UNI/, /^AAVE/, /^COMP/,
    /\/USD$/, /\/USDT$/, /\/BTC$/, /\/ETH$/
  ];

  private static readonly FOREX_PATTERNS = [
    /^[A-Z]{3}\/[A-Z]{3}$/, // EUR/USD, GBP/JPY format
    /^USD/, /^EUR/, /^GBP/, /^JPY/, /^AUD/, /^CAD/, /^CHF/, /^NZD/
  ];

  /**
   * Xác định thị trường cho symbol
   */
  static identifyMarket(symbol: string, assetType?: string): MarketMapping {
    const upperSymbol = symbol.toUpperCase();

    // Crypto detection
    if (this.isCrypto(upperSymbol, assetType)) {
      return {
        symbol: upperSymbol,
        marketType: 'crypto',
        apiProvider: 'coingecko',
        apiSymbol: this.formatCryptoSymbol(upperSymbol),
        currency: 'USD'
      };
    }

    // Forex detection
    if (this.isForex(upperSymbol, assetType)) {
      return {
        symbol: upperSymbol,
        marketType: 'forex',
        apiProvider: 'alpha_vantage',
        apiSymbol: upperSymbol,
        currency: 'USD'
      };
    }

    // Vietnam stock detection
    if (this.VIETNAM_STOCKS.includes(upperSymbol) || assetType === 'stocks') {
      return {
        symbol: upperSymbol,
        marketType: 'vietnam_stock',
        apiProvider: 'yahoo_finance',
        apiSymbol: `${upperSymbol}.VN`,
        currency: 'VND',
        exchange: 'HOSE',
        country: 'Vietnam'
      };
    }

    // Default to US stock
    return {
      symbol: upperSymbol,
      marketType: 'us_stock',
      apiProvider: 'alpha_vantage',
      apiSymbol: upperSymbol,
      currency: 'USD',
      exchange: 'NASDAQ',
      country: 'United States'
    };
  }

  /**
   * Kiểm tra xem có phải crypto không
   */
  private static isCrypto(symbol: string, assetType?: string): boolean {
    if (assetType === 'crypto' || assetType === 'CRYPTO') return true;
    
    return this.CRYPTO_PATTERNS.some(pattern => pattern.test(symbol));
  }

  /**
   * Kiểm tra xem có phải forex không
   */
  private static isForex(symbol: string, assetType?: string): boolean {
    if (assetType === 'forex') return true;
    
    return this.FOREX_PATTERNS.some(pattern => pattern.test(symbol));
  }

  /**
   * Format crypto symbol cho CoinGecko API
   */
  private static formatCryptoSymbol(symbol: string): string {
    const cryptoMapping: Record<string, string> = {
      'BTC': 'bitcoin',
      'BTC/USD': 'bitcoin',
      'ETH': 'ethereum',
      'ETH/USD': 'ethereum',
      'ADA': 'cardano',
      'DOT': 'polkadot',
      'LINK': 'chainlink',
      'UNI': 'uniswap'
    };

    return cryptoMapping[symbol] || symbol.toLowerCase().replace(/\/.*/, '');
  }

  /**
   * Lấy danh sách tất cả markets từ portfolio
   */
  static getPortfolioMarkets(trades: any[]): MarketMapping[] {
    const uniqueSymbols = [...new Set(trades.map(trade => trade.symbol))];
    
    return uniqueSymbols.map(symbol => {
      const trade = trades.find(t => t.symbol === symbol);
      return this.identifyMarket(symbol, trade?.assetType);
    });
  }

  /**
   * Nhóm symbols theo API provider
   */
  static groupByProvider(mappings: MarketMapping[]): Record<APIProvider, MarketMapping[]> {
    return mappings.reduce((groups, mapping) => {
      if (!groups[mapping.apiProvider]) {
        groups[mapping.apiProvider] = [];
      }
      groups[mapping.apiProvider].push(mapping);
      return groups;
    }, {} as Record<APIProvider, MarketMapping[]>);
  }
}
