console.log('🧪 Testing Dashboard Analytics with Debug...');

// Test case để verify dữ liệu
const mockTrades = [
  {
    id: "test1",
    symbol: "BTC/USD", 
    assetType: "CRYPTO",
    side: "BUY",
    quantity: 0.5,  // Note: using 'quantity' not 'size'
    entryPrice: 50000,
    status: "CLOSED", // Note: uppercase
    pnl: 1750,
    entryDateTime: new Date().toISOString()
  },
  {
    id: "test2",
    symbol: "ETH/USD",
    assetType: "CRYPTO", 
    side: "SELL",
    quantity: 2.0,
    entryPrice: 3000,
    status: "closed", // Note: lowercase
    pnl: undefined, // Note: undefined PnL
    entryDateTime: new Date().toISOString()
  }
];

console.log('📊 Mock trades for testing:', mockTrades);

// Test filtering logic
const closedTrades = mockTrades.filter(trade => 
  (trade.status?.toLowerCase() === 'closed') && trade.pnl !== undefined
);
const openTrades = mockTrades.filter(trade => 
  trade.status?.toLowerCase() === 'open'
);

console.log('🔍 Filter results:', {
  totalTrades: mockTrades.length,
  closedTrades: closedTrades.length,
  openTrades: openTrades.length,
  closedTradesWithPnL: closedTrades.filter(t => t.pnl !== undefined).length
});

// Test volume calculation with both field names
const totalVolume = mockTrades.reduce((sum, trade) => {
  const quantity = trade.size || trade.quantity || 0;
  return sum + (quantity * trade.entryPrice);
}, 0);

console.log('💰 Volume calculation:', totalVolume);
