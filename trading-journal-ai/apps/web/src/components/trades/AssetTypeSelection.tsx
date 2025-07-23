'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  TrendingUp, 
  Bitcoin, 
  DollarSign, 
  BarChart3, 
  Settings,
  Search
} from 'lucide-react';
import { TradeData } from './TradeEntryForm';

interface Props {
  tradeData: TradeData;
  onUpdate: (updates: Partial<TradeData>) => void;
}

const ASSET_TYPES = [
  {
    id: 'stocks',
    name: 'Stocks',
    description: 'Individual stocks and ETFs',
    icon: TrendingUp,
    color: 'bg-blue-500',
    examples: ['AAPL', 'GOOGL', 'MSFT', 'TSLA']
  },
  {
    id: 'crypto',
    name: 'Cryptocurrency',
    description: 'Digital currencies and tokens',
    icon: Bitcoin,
    color: 'bg-orange-500',
    examples: ['BTC', 'ETH', 'ADA', 'SOL']
  },
  {
    id: 'forex',
    name: 'Forex',
    description: 'Foreign exchange pairs',
    icon: DollarSign,
    color: 'bg-green-500',
    examples: ['EUR/USD', 'GBP/USD', 'USD/JPY']
  },
  {
    id: 'commodities',
    name: 'Commodities',
    description: 'Gold, oil, agricultural products',
    icon: BarChart3,
    color: 'bg-yellow-500',
    examples: ['GOLD', 'OIL', 'WHEAT']
  },
  {
    id: 'options',
    name: 'Options',
    description: 'Call and put options',
    icon: Settings,
    color: 'bg-purple-500',
    examples: ['AAPL Call', 'SPY Put']
  }
];

// Popular symbols for each asset type
const POPULAR_SYMBOLS = {
  stocks: [
    'AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'META', 'NVDA', 'NFLX',
    'SPY', 'QQQ', 'VOO', 'VTI'
  ],
  crypto: [
    'BTC/USD', 'ETH/USD', 'ADA/USD', 'SOL/USD', 'DOT/USD', 'AVAX/USD',
    'BTC/USDT', 'ETH/BTC', 'ADA/BTC'
  ],
  forex: [
    'EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD', 'USD/CAD', 'NZD/USD',
    'EUR/GBP', 'GBP/JPY', 'CHF/JPY'
  ],
  commodities: [
    'GOLD', 'SILVER', 'OIL', 'NATGAS', 'WHEAT', 'CORN', 'COPPER', 'PLATINUM'
  ],
  options: [
    'AAPL Call', 'SPY Put', 'QQQ Call', 'TSLA Put', 'NVDA Call'
  ]
};

export default function AssetTypeSelection({ tradeData, onUpdate }: Props) {
  const [symbolSearch, setSymbolSearch] = useState('');

  const handleAssetTypeSelect = (assetType: string) => {
    onUpdate({ 
      assetType: assetType as TradeData['assetType'],
      symbol: '' // Reset symbol when changing asset type
    });
  };

  const handleSymbolSelect = (symbol: string) => {
    onUpdate({ symbol });
    setSymbolSearch('');
  };

  const getFilteredSymbols = () => {
    if (!tradeData.assetType) return [];
    
    const symbols = POPULAR_SYMBOLS[tradeData.assetType] || [];
    
    if (!symbolSearch) return symbols;
    
    return symbols.filter(symbol => 
      symbol.toLowerCase().includes(symbolSearch.toLowerCase())
    );
  };

  return (
    <div className="space-y-6 bg-white">
      <div className="bg-white p-6 rounded-lg border border-gray-100">
        <h3 className="text-lg font-semibold mb-2 text-gray-900">Select Asset Type</h3>
        <p className="text-gray-600 text-sm mb-4">
          Choose the type of asset you're trading
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ASSET_TYPES.map((type) => {
            const Icon = type.icon;
            const isSelected = tradeData.assetType === type.id;
            
            return (
              <button
                key={type.id}
                onClick={() => handleAssetTypeSelect(type.id)}
                className={`
                  p-4 rounded-lg border-2 text-left transition-all shadow-sm hover:shadow-md
                  ${isSelected 
                    ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 bg-white'
                  }
                `}
              >
                <div className="flex items-center mb-3">
                  <div className={`${type.color} p-2 rounded-lg text-white mr-3 shadow-sm`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h4 className="font-semibold text-gray-900">{type.name}</h4>
                </div>
                <p className="text-sm text-gray-600 mb-3">{type.description}</p>
                <div className="flex flex-wrap gap-1">
                  {type.examples.slice(0, 3).map((example) => (
                    <span 
                      key={example}
                      className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
                    >
                      {example}
                    </span>
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {tradeData.assetType && (
        <div className="bg-white p-6 rounded-lg border border-gray-100">
          <h3 className="text-lg font-semibold mb-2 text-gray-900">Enter Symbol</h3>
          <p className="text-gray-600 text-sm mb-4">
            Search or select from popular {ASSET_TYPES.find(t => t.id === tradeData.assetType)?.name.toLowerCase()} symbols
          </p>
          
          <div className="space-y-4">
            {/* Symbol Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder={`Search ${tradeData.assetType} symbols...`}
                value={symbolSearch || tradeData.symbol}
                onChange={(e) => {
                  const value = e.target.value;
                  setSymbolSearch(value);
                  onUpdate({ symbol: value });
                }}
                className="pl-10 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Popular Symbols */}
            {!symbolSearch && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <Label className="text-sm font-medium text-gray-700 mb-3 block">
                  Popular symbols:
                </Label>
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                  {getFilteredSymbols().slice(0, 12).map((symbol) => (
                    <button
                      key={symbol}
                      onClick={() => handleSymbolSelect(symbol)}
                      className={`
                        px-3 py-2 text-sm rounded-md border transition-colors shadow-sm
                        ${tradeData.symbol === symbol
                          ? 'bg-blue-500 text-white border-blue-500'
                          : 'bg-white hover:bg-blue-50 border-gray-200 hover:border-blue-300'
                        }
                      `}
                    >
                      {symbol}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Search Results */}
            {symbolSearch && (
              <div>
                <Label className="text-sm text-gray-600 mb-2 block">
                  Search results:
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-40 overflow-y-auto">
                  {getFilteredSymbols().map((symbol) => (
                    <button
                      key={symbol}
                      onClick={() => handleSymbolSelect(symbol)}
                      className="px-3 py-2 text-sm rounded border bg-white hover:bg-gray-50 border-gray-200 text-left"
                    >
                      {symbol}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {tradeData.symbol && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center">
                <div className="flex items-center">
                  <span className="text-sm text-green-600 font-medium">
                    Selected: {tradeData.symbol}
                  </span>
                  <span className="ml-2 text-xs text-green-500 bg-green-100 px-2 py-1 rounded">
                    {ASSET_TYPES.find(t => t.id === tradeData.assetType)?.name}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
