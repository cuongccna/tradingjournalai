/**
 * Demo script để test API keys và lấy dữ liệu BTC thật
 */

const fetch = require('node-fetch');

async function testBitcoinPrice() {
  console.log('🔍 Testing real Bitcoin price APIs...\n');

  // 1. Test CoinGecko API (free, không cần API key)
  console.log('1. Testing CoinGecko API (Free):');
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true');
    const data = await response.json();
    
    if (data.bitcoin) {
      console.log(`   ✅ Bitcoin price: $${data.bitcoin.usd.toLocaleString()}`);
      console.log(`   📈 24h change: ${data.bitcoin.usd_24h_change?.toFixed(2)}%\n`);
    }
  } catch (error) {
    console.log(`   ❌ CoinGecko error: ${error.message}\n`);
  }

  // 2. Test Binance API (free, không cần API key)
  console.log('2. Testing Binance API (Free):');
  try {
    const response = await fetch('https://api.binance.com/api/v3/ticker/24hr?symbol=BTCUSDT');
    const data = await response.json();
    
    if (data.symbol) {
      const price = parseFloat(data.lastPrice);
      const change = parseFloat(data.priceChangePercent);
      console.log(`   ✅ Bitcoin price: $${price.toLocaleString()}`);
      console.log(`   📈 24h change: ${change.toFixed(2)}%\n`);
    }
  } catch (error) {
    console.log(`   ❌ Binance error: ${error.message}\n`);
  }

  // 3. Test Alpha Vantage với demo key
  console.log('3. Testing Alpha Vantage API (Demo key):');
  try {
    const response = await fetch('https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_DAILY&symbol=BTC&market=USD&apikey=demo');
    const data = await response.json();
    
    if (data['Time Series (Digital Currency Daily)']) {
      const latest = Object.keys(data['Time Series (Digital Currency Daily)'])[0];
      const latestData = data['Time Series (Digital Currency Daily)'][latest];
      const price = parseFloat(latestData['4a. close (USD)']);
      
      console.log(`   ✅ Bitcoin price: $${price.toLocaleString()}`);
      console.log(`   📅 Date: ${latest}\n`);
    } else if (data['Note']) {
      console.log(`   ⚠️ Rate limited: ${data['Note']}\n`);
    } else {
      console.log(`   ❌ Unexpected response:`, data);
    }
  } catch (error) {
    console.log(`   ❌ Alpha Vantage error: ${error.message}\n`);
  }

  console.log('💡 Recommendation: Use CoinGecko or Binance for real-time crypto prices');
}

// Chạy test
testBitcoinPrice();
