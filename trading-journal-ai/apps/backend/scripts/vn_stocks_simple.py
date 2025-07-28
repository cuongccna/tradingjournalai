#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import sys
import json
import random
from datetime import datetime, timedelta

def get_vn_stock_data(symbol):
    """Get Vietnamese stock data with realistic mock data"""
    
    # Base prices for Vietnamese stocks
    base_prices = {
        'FPT': 125000,
        'VCB': 95000,
        'HPG': 28000,
        'VHM': 65000,
        'VNM': 58000,
        'TCB': 25000,
        'MSN': 145000,
        'VIC': 42000,
        'CTG': 35000,
        'BID': 28000
    }
    
    # Company names in Vietnamese
    company_names = {
        'FPT': 'FPT Corporation',
        'VCB': 'Ngân hàng Vietcombank',
        'HPG': 'Tập đoàn Hòa Phát',
        'VHM': 'Vinhomes',
        'VNM': 'Vinamilk',
        'TCB': 'Ngân hàng Techcombank',
        'MSN': 'Tập đoàn Masan',
        'VIC': 'Tập đoàn Vingroup',
        'CTG': 'Ngân hàng VietinBank',
        'BID': 'Ngân hàng BIDV'
    }
    
    # Exchange information
    exchanges = {
        'FPT': 'HSX',
        'VCB': 'HSX', 
        'HPG': 'HSX',
        'VHM': 'HSX',
        'VNM': 'HSX',
        'TCB': 'HSX',
        'MSN': 'HSX',
        'VIC': 'HSX',
        'CTG': 'HSX',
        'BID': 'HSX'
    }
    
    base_price = base_prices.get(symbol, 50000)
    
    # Generate realistic price movement
    change_percent = random.uniform(-3.5, 4.2)
    change_amount = base_price * (change_percent / 100)
    current_price = base_price + change_amount
    
    # Generate volume
    volume = random.randint(500000, 2500000)
    
    return {
        "symbol": symbol,
        "name": company_names.get(symbol, symbol),
        "exchange": exchanges.get(symbol, "HSX"),
        "price": round(current_price, 0),
        "change": round(change_amount, 0),
        "changePercent": round(change_percent, 2),
        "volume": volume,
        "timestamp": datetime.now().isoformat(),
        "currency": "VND"
    }

def generate_alerts(market_data):
    """Generate market alerts based on stock data"""
    alerts = []
    
    # Vietnamese translations for alerts
    alert_messages = {
        "high_volatility": {
            "title": "Biến động mạnh {symbol}",
            "description": "{symbol} có biến động {change:.1f}% trong phiên hôm nay",
            "recommendation": "Theo dõi sát sao và cân nhắc điều chỉnh vị thế"
        },
        "price_breakout": {
            "title": "Đột phá tăng giá {symbol}",
            "description": "{symbol} vượt qua mức kháng cự với mức tăng {change:.1f}%",
            "recommendation": "Xem xét cơ hội mua thêm nếu có xác nhận"
        },
        "price_drop": {
            "title": "Giảm giá mạnh {symbol}",
            "description": "{symbol} giảm {change:.1f}% có thể là cơ hội mua vào",
            "recommendation": "Chờ tín hiệu xác nhận trước khi vào lệnh"
        },
        "volume_spike": {
            "title": "Khối lượng tăng đột biến {symbol}",
            "description": "{symbol} có khối lượng giao dịch cao bất thường",
            "recommendation": "Theo dõi xu hướng giá trong phiên"
        }
    }
    
    for stock in market_data:
        symbol = stock["symbol"]
        change_percent = stock["changePercent"]
        volume = stock.get("volume", 0)
        
        # High volatility alert
        if abs(change_percent) > 3:
            severity = "high" if abs(change_percent) > 5 else "medium"
            impact = "positive" if change_percent > 0 else "negative"
            
            alert_type = "high_volatility"
            msg = alert_messages[alert_type]
            
            alerts.append({
                "id": f"alert_{symbol}_{int(datetime.now().timestamp())}",
                "type": alert_type,
                "symbol": symbol,
                "title": msg["title"].format(symbol=symbol),
                "description": msg["description"].format(symbol=symbol, change=abs(change_percent)),
                "severity": severity,
                "timestamp": datetime.now().isoformat(),
                "impact": impact,
                "recommendation": msg["recommendation"]
            })
        
        # Price breakout alert
        if change_percent > 2.5:
            msg = alert_messages["price_breakout"]
            alerts.append({
                "id": f"breakout_{symbol}_{int(datetime.now().timestamp())}",
                "type": "price_target",
                "symbol": symbol,
                "title": msg["title"].format(symbol=symbol),
                "description": msg["description"].format(symbol=symbol, change=change_percent),
                "severity": "medium",
                "timestamp": datetime.now().isoformat(),
                "impact": "positive",
                "recommendation": msg["recommendation"]
            })
        
        # Price drop alert (opportunity)
        elif change_percent < -2.5:
            msg = alert_messages["price_drop"]
            alerts.append({
                "id": f"drop_{symbol}_{int(datetime.now().timestamp())}",
                "type": "price_target",
                "symbol": symbol,
                "title": msg["title"].format(symbol=symbol),
                "description": msg["description"].format(symbol=symbol, change=abs(change_percent)),
                "severity": "medium",
                "timestamp": datetime.now().isoformat(),
                "impact": "neutral",
                "recommendation": msg["recommendation"]
            })
        
        # Volume spike alert
        if volume > 1500000:  # High volume threshold
            msg = alert_messages["volume_spike"]
            alerts.append({
                "id": f"volume_{symbol}_{int(datetime.now().timestamp())}",
                "type": "volume_spike",
                "symbol": symbol,
                "title": msg["title"].format(symbol=symbol),
                "description": msg["description"].format(symbol=symbol),
                "severity": "low",
                "timestamp": datetime.now().isoformat(),
                "impact": "neutral",
                "recommendation": msg["recommendation"]
            })
    
    return alerts

def main():
    if len(sys.argv) < 2:
        print('{"success": false, "error": "No symbols provided"}')
        sys.exit(1)
    
    symbols_str = sys.argv[1]
    symbols = [s.strip() for s in symbols_str.split(',')]
    
    market_results = {
        "marketData": [],
        "alerts": [],
        "overview": {
            "totalSymbols": len(symbols),
            "gainers": [],
            "losers": [],
            "highVolatility": [],
            "lastUpdated": datetime.now().isoformat(),
            "marketSentiment": "tích cực",
            "marketStatus": "Đang giao dịch",
            "totalVolume": 0,
            "marketCap": "Thị trường Việt Nam"
        }
    }
    
    total_volume = 0
    for symbol in symbols:
        stock_data = get_vn_stock_data(symbol)
        market_results["marketData"].append(stock_data)
        total_volume += stock_data["volume"]
        
        # Categorize by performance
        if stock_data["changePercent"] > 0:
            market_results["overview"]["gainers"].append(stock_data)
        elif stock_data["changePercent"] < 0:
            market_results["overview"]["losers"].append(stock_data)
            
        # High volatility check
        if abs(stock_data["changePercent"]) > 2:
            market_results["overview"]["highVolatility"].append(stock_data)
    
    # Update market overview
    market_results["overview"]["totalVolume"] = total_volume
    
    # Determine market sentiment based on gainers vs losers
    gainers_count = len(market_results["overview"]["gainers"])
    losers_count = len(market_results["overview"]["losers"])
    
    if gainers_count > losers_count:
        market_results["overview"]["marketSentiment"] = "tích cực"
    elif losers_count > gainers_count:
        market_results["overview"]["marketSentiment"] = "tiêu cực"
    else:
        market_results["overview"]["marketSentiment"] = "trung tính"
    
    # Generate alerts
    market_results["alerts"] = generate_alerts(market_results["marketData"])
    
    # Output with proper encoding
    output = json.dumps(market_results, ensure_ascii=False, indent=2)
    # Force UTF-8 output for Vietnamese characters
    sys.stdout.buffer.write(output.encode('utf-8'))

if __name__ == "__main__":
    main()
