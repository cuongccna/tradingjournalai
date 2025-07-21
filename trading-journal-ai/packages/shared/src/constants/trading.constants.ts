export const ASSET_TYPES = {
  STOCK: 'stock',
  FOREX: 'forex',
  CRYPTO: 'crypto',
  FUTURES: 'futures',
  OPTIONS: 'options',
} as const;

export const TRADE_SIDES = {
  BUY: 'buy',
  SELL: 'sell',
  LONG: 'long',
  SHORT: 'short',
} as const;

export const TRADE_STATUS = {
  OPEN: 'open',
  CLOSED: 'closed',
  CANCELLED: 'cancelled',
} as const;

export const CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: ' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'Fr' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'VND', name: 'Vietnamese Dong', symbol: '₫' },
];

export const TIMEZONES = [
  { value: 'UTC', label: 'UTC' },
  { value: 'America/New_York', label: 'Eastern Time (US)' },
  { value: 'America/Chicago', label: 'Central Time (US)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (US)' },
  { value: 'Europe/London', label: 'London' },
  { value: 'Europe/Paris', label: 'Paris' },
  { value: 'Asia/Tokyo', label: 'Tokyo' },
  { value: 'Asia/Shanghai', label: 'Shanghai' },
  { value: 'Asia/Singapore', label: 'Singapore' },
  { value: 'Asia/Ho_Chi_Minh', label: 'Ho Chi Minh City' },
];

export const EXCHANGES = {
  STOCKS: ['NYSE', 'NASDAQ', 'LSE', 'TSE', 'HOSE', 'HNX'],
  CRYPTO: ['Binance', 'Coinbase', 'Kraken', 'Bybit', 'OKX', 'Bitfinex'],
  FOREX: ['Oanda', 'IG', 'Forex.com', 'Interactive Brokers'],
};

export const INTERVALS = {
  '1m': '1 Minute',
  '5m': '5 Minutes',
  '15m': '15 Minutes',
  '30m': '30 Minutes',
  '1h': '1 Hour',
  '4h': '4 Hours',
  '1d': '1 Day',
  '1w': '1 Week',
  '1M': '1 Month',
};