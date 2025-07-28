import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

interface BinanceTickerData {
  symbol: string;
  priceChange: string;
  priceChangePercent: string;
  lastPrice: string;
  volume: string;
  count: number;
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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const symbols = searchParams.get('symbols') || 'BTC,ETH,SOL';
    
    console.log('🔥 Fetching real Binance data for symbols:', symbols);
    
    const symbolList = symbols.split(',').map(s => s.trim().toUpperCase());
    const cryptoSymbols = symbolList.filter(s => 
      ['BTC', 'ETH', 'SOL', 'ADA', 'XRP', 'DOGE', 'BNB', 'MATIC', 'DOT', 'AVAX'].includes(s)
    );

    if (cryptoSymbols.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          marketData: [],
          alerts: [],
          overview: {
            totalSymbols: 0,
            gainers: [],
            losers: [],
            highVolatility: [],
            lastUpdated: new Date().toISOString(),
            marketSentiment: 'neutral'
          }
        },
        message: 'No crypto symbols found'
      });
    }

    // Fetch from Binance API
    const binanceSymbols = cryptoSymbols.map(s => `${s}USDT`);
    const binanceUrl = `https://api.binance.com/api/v3/ticker/24hr`;
    
    const response = await fetch(binanceUrl, {
      headers: {
        'User-Agent': 'TradingJournalAI/1.0'
      }
    });

    if (!response.ok) {
      throw new Error(`Binance API error: ${response.status}`);
    }

    const allTickers: BinanceTickerData[] = await response.json();
    console.log('📊 Received', allTickers.length, 'tickers from Binance');

    // Filter and format data for our symbols
    const relevantTickers = allTickers.filter(ticker => 
      binanceSymbols.includes(ticker.symbol)
    );

    console.log('🎯 Found', relevantTickers.length, 'relevant tickers');

    const marketData: MarketData[] = relevantTickers.map(ticker => {
      const baseSymbol = ticker.symbol.replace('USDT', '');
      const price = parseFloat(ticker.lastPrice);
      const change = parseFloat(ticker.priceChange);
      const changePercent = parseFloat(ticker.priceChangePercent);
      const volume = parseFloat(ticker.volume);

      return {
        symbol: baseSymbol,
        name: getCryptoName(baseSymbol),
        exchange: 'Binance',
        price: price,
        change: change,
        changePercent: changePercent,
        volume: volume,
        timestamp: new Date().toISOString(),
        currency: 'USDT'
      };
    });

    // Generate alerts for high volatility or significant changes
    const alerts = marketData
      .filter(data => Math.abs(data.changePercent) > 5 || (data.volume && data.volume > 100000))
      .map(data => ({
        id: `alert_${data.symbol}_${Date.now()}`,
        type: Math.abs(data.changePercent) > 10 ? 'high_volatility' as const : 'volume_spike' as const,
        symbol: data.symbol,
        title: Math.abs(data.changePercent) > 10 
          ? `Biến động mạnh ${data.symbol}` 
          : `Volume cao ${data.symbol}`,
        description: Math.abs(data.changePercent) > 10
          ? `${data.symbol} biến động ${data.changePercent.toFixed(2)}% trong 24h qua`
          : `${data.symbol} có volume giao dịch cao: ${((data.volume || 0) / 1000000).toFixed(1)}M USDT`,
        severity: Math.abs(data.changePercent) > 15 ? 'high' as const : 'medium' as const,
        timestamp: new Date().toISOString(),
        impact: data.changePercent > 0 ? 'positive' as const : 'negative' as const,
        recommendation: data.changePercent > 10 
          ? 'Cân nhắc chốt lời và quản lý rủi ro'
          : data.changePercent < -10
          ? 'Theo dõi để tìm cơ hội mua vào'
          : 'Theo dõi momentum tiếp theo'
      }));

    // Create overview
    const gainers = marketData.filter(d => d.changePercent > 0);
    const losers = marketData.filter(d => d.changePercent < 0);
    const highVolatility = marketData.filter(d => Math.abs(d.changePercent) > 5);

    const overview = {
      totalSymbols: marketData.length,
      gainers: gainers,
      losers: losers,
      highVolatility: highVolatility,
      lastUpdated: new Date().toISOString(),
      marketSentiment: gainers.length > losers.length ? 'bullish' : 
                      losers.length > gainers.length ? 'bearish' : 'neutral'
    };

    console.log('✅ Processed Binance data:', {
      symbols: marketData.length,
      alerts: alerts.length,
      gainers: gainers.length,
      losers: losers.length
    });

    return NextResponse.json({
      success: true,
      data: {
        marketData,
        alerts,
        overview
      },
      message: `Crypto market data retrieved successfully from Binance`
    });

  } catch (error) {
    console.error('❌ Error fetching Binance data:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch crypto market data from Binance',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

function getCryptoName(symbol: string): string {
  const names: { [key: string]: string } = {
    'BTC': 'Bitcoin',
    'ETH': 'Ethereum', 
    'SOL': 'Solana',
    'ADA': 'Cardano',
    'XRP': 'Ripple',
    'DOGE': 'Dogecoin',
    'BNB': 'Binance Coin',
    'MATIC': 'Polygon',
    'DOT': 'Polkadot',
    'AVAX': 'Avalanche'
  };
  
  return names[symbol] || symbol;
}
