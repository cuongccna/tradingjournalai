#!/usr/bin/env python3
"""
Vietnamese Stock Market Data Fetcher - Simplified version
Provides mock data for Vietnamese stocks when vnstock is not available
"""

import sys
import json
import random
from datetime import datetime

def get_vn_stock_data(symbols):
    """
    Generate mock Vietnamese stock market data for given symbols
    
    Args:
        symbols (list): List of stock symbols (e.g., ['FPT', 'VCB', 'HPG'])
    
    Returns:
        dict: Market data with price, change, volume information
    """
    results = {
        'marketData': [],
        'alerts': [],
        'overview': {
            'totalSymbols': len(symbols),
            'gainers': [],
            'losers': [],
            'highVolatility': [],
            'lastUpdated': datetime.now().isoformat(),
            'marketSentiment': 'neutral'
        }
    }
    
    # Mock prices for Vietnamese stocks (in VND)
    base_prices = {
        'FPT': 125000,
        'VCB': 85000,
        'HPG': 25000,
        'VHM': 45000,
        'VNM': 75000,
        'TCB': 55000,
        'MSN': 150000,
        'VIC': 35000,
        'CTG': 42000,
        'BID': 48000
    }
    
    try:
        for symbol in symbols:
            try:
                # Generate realistic mock data
                base_price = base_prices.get(symbol, 50000)
                
                # Random variations
                price_variation = random.uniform(-0.05, 0.05)  # +/- 5%
                current_price = base_price * (1 + price_variation)
                
                change_percent = price_variation * 100
                change = base_price * price_variation
                
                volume = random.randint(100000, 1000000)
                
                market_data = {
                    'symbol': symbol,
                    'price': round(current_price, 0),
                    'change': round(change, 0),
                    'changePercent': round(change_percent, 2),
                    'volume': volume,
                    'high': round(current_price * 1.02, 0),
                    'low': round(current_price * 0.98, 0),
                    'open': round(base_price, 0),
                    'timestamp': datetime.now().isoformat(),
                    'source': 'vnstock_mock'
                }
                
                results['marketData'].append(market_data)
                
                # Categorize for overview
                if change_percent > 0:
                    results['overview']['gainers'].append(market_data)
                elif change_percent < 0:
                    results['overview']['losers'].append(market_data)
                
                if abs(change_percent) > 3:  # High volatility threshold for VN stocks
                    results['overview']['highVolatility'].append(market_data)
                    
                    # Generate volatility alert
                    alert = {
                        'id': f'volatility_{symbol}_{int(datetime.now().timestamp())}',
                        'type': 'high_volatility',
                        'symbol': symbol,
                        'title': f'Biến động cao - {symbol}',
                        'description': f'{symbol} có biến động {change_percent:.2f}% trong phiên giao dịch',
                        'severity': 'high' if abs(change_percent) > 5 else 'medium',
                        'timestamp': datetime.now().isoformat(),
                        'impact': 'positive' if change_percent > 0 else 'negative',
                        'recommendation': 'Theo dõi sát diễn biến thị trường và điều chỉnh vị thế phù hợp'
                    }
                    results['alerts'].append(alert)
            
            except Exception as e:
                print(f"Error generating data for {symbol}: {str(e)}", file=sys.stderr)
                continue
        
        # Determine market sentiment
        gainers_count = len(results['overview']['gainers'])
        losers_count = len(results['overview']['losers'])
        
        if gainers_count > losers_count * 1.5:
            results['overview']['marketSentiment'] = 'bullish'
        elif losers_count > gainers_count * 1.5:
            results['overview']['marketSentiment'] = 'bearish'
        else:
            results['overview']['marketSentiment'] = 'neutral'
            
    except Exception as e:
        print(f"General error in VN stock data generation: {str(e)}", file=sys.stderr)
    
    return results

def get_vn_stock_news(symbols, limit=5):
    """
    Generate mock news alerts for Vietnamese stocks
    
    Args:
        symbols (list): List of stock symbols
        limit (int): Number of news articles to fetch
    
    Returns:
        list: News-based alerts
    """
    alerts = []
    
    news_templates = [
        'Cổ phiếu {symbol} có động thái tích cực từ thị trường',
        '{symbol} công bố kết quả kinh doanh khả quan',
        'Nhà đầu tư quan tâm đến triển vọng của {symbol}',
        'Phân tích kỹ thuật cho thấy {symbol} có tín hiệu tích cực'
    ]
    
    try:
        for symbol in symbols[:3]:  # Limit to avoid rate limits
            try:
                for i in range(min(2, limit)):  # Max 2 news per symbol
                    news_title = random.choice(news_templates).format(symbol=symbol)
                    
                    alert = {
                        'id': f'news_{symbol}_{i}_{int(datetime.now().timestamp())}',
                        'type': 'news_impact',
                        'symbol': symbol,
                        'title': 'Tin tức thị trường',
                        'description': news_title,
                        'severity': 'medium',
                        'timestamp': datetime.now().isoformat(),
                        'impact': 'neutral',
                        'recommendation': f'Đọc chi tiết để đánh giá tác động đến {symbol}'
                    }
                    alerts.append(alert)
                        
            except Exception as e:
                print(f"Error generating news for {symbol}: {str(e)}", file=sys.stderr)
                continue
                
    except Exception as e:
        print(f"General error in VN stock news generation: {str(e)}", file=sys.stderr)
    
    return alerts

def main():
    """Main function to handle command line arguments"""
    if len(sys.argv) < 2:
        print("Usage: python vn_stocks.py symbol1,symbol2,symbol3", file=sys.stderr)
        sys.exit(1)
    
    symbols_str = sys.argv[1]
    symbols = [s.strip().upper() for s in symbols_str.split(',')]
    
    # Filter for Vietnamese stock symbols
    vn_symbols = [s for s in symbols if s in ['FPT', 'VCB', 'HPG', 'VHM', 'VNM', 'TCB', 'MSN', 'VIC', 'CTG', 'BID']]
    
    if not vn_symbols:
        print(json.dumps({
            'marketData': [],
            'alerts': [],
            'overview': {
                'totalSymbols': 0,
                'gainers': [],
                'losers': [],
                'highVolatility': [],
                'lastUpdated': datetime.now().isoformat(),
                'marketSentiment': 'neutral'
            }
        }))
        return
    
    # Fetch market data
    market_results = get_vn_stock_data(vn_symbols)
    
    # Fetch news alerts
    news_alerts = get_vn_stock_news(vn_symbols)
    market_results['alerts'].extend(news_alerts)
    
    # Sort alerts by severity
    severity_order = {'high': 3, 'medium': 2, 'low': 1}
    market_results['alerts'].sort(
        key=lambda x: severity_order.get(x['severity'], 0), 
        reverse=True
    )
    
    # Limit alerts
    market_results['alerts'] = market_results['alerts'][:10]
    
    print(json.dumps(market_results, ensure_ascii=False, indent=2))

if __name__ == "__main__":
    main()
