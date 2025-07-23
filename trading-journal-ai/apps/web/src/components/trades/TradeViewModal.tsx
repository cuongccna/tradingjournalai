'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Calendar, DollarSign, BarChart3, FileText, X } from 'lucide-react';

interface Trade {
  id: string;
  symbol: string;
  assetType: string;
  side: 'buy' | 'sell';
  quantity: number;
  entryPrice: number;
  exitPrice?: number;
  entryDate: string;
  exitDate?: string;
  pnl?: number;
  status: 'open' | 'closed';
  strategy: string;
  notes: string;
  tags: string[];
}

interface Props {
  trade: Trade | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function TradeViewModal({ trade, isOpen, onClose }: Props) {
  if (!trade) return null;

  const calculatePnL = (trade: Trade) => {
    if (!trade.exitPrice) return null;
    const multiplier = trade.side === 'buy' ? 1 : -1;
    const pnl = (trade.exitPrice - trade.entryPrice) * trade.quantity * multiplier;
    return pnl;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const pnl = calculatePnL(trade);
  const isProfit = pnl !== null && pnl > 0;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white shadow-2xl">
        <CardHeader className="flex flex-row items-center justify-between border-b bg-white sticky top-0 z-10">
          <CardTitle className="flex items-center gap-3 text-2xl">
            <div className={`p-2 rounded-lg ${
              trade.assetType === 'stocks' ? 'bg-blue-100' :
              trade.assetType === 'crypto' ? 'bg-orange-100' :
              trade.assetType === 'forex' ? 'bg-green-100' :
              'bg-gray-100'
            }`}>
              <BarChart3 className="h-6 w-6" />
            </div>
            {trade.symbol}
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              trade.side === 'buy' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {trade.side.toUpperCase()}
            </span>
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose} className="hover:bg-gray-100">
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="p-6">
          <div className="space-y-6">
          {/* Trade Overview */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Trade Details
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Asset Type:</span>
                    <span className="font-medium capitalize">{trade.assetType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Quantity:</span>
                    <span className="font-medium">{trade.quantity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Entry Price:</span>
                    <span className="font-medium">{formatCurrency(trade.entryPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Exit Price:</span>
                    <span className="font-medium">
                      {trade.exitPrice ? formatCurrency(trade.exitPrice) : (
                        <span className="text-blue-600">Open Position</span>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Timeline
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Entry Date:</span>
                    <span className="font-medium">{formatDate(trade.entryDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Exit Date:</span>
                    <span className="font-medium">
                      {trade.exitDate ? formatDate(trade.exitDate) : (
                        <span className="text-blue-600">-</span>
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Status:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      trade.exitPrice ? 'bg-gray-100 text-gray-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {trade.exitPrice ? 'Closed' : 'Open'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* P&L Section */}
          {pnl !== null && (
            <div className={`border rounded-lg p-4 ${
              isProfit ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
            }`}>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                {isProfit ? <TrendingUp className="h-4 w-4 text-green-600" /> : <TrendingDown className="h-4 w-4 text-red-600" />}
                Profit & Loss
              </h3>
              <div className="text-3xl font-bold">
                <span className={isProfit ? 'text-green-600' : 'text-red-600'}>
                  {formatCurrency(pnl)}
                </span>
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {((pnl / (trade.entryPrice * trade.quantity)) * 100).toFixed(2)}% return
              </div>
            </div>
          )}

          {/* Strategy */}
          {trade.strategy && (
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Strategy</h3>
              <div className="inline-block px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full font-medium">
                📊 {trade.strategy}
              </div>
            </div>
          )}

          {/* Tags */}
          {trade.tags && trade.tags.length > 0 && (
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {trade.tags.map((tag, index) => (
                  <span 
                    key={tag} 
                    className={`px-2 py-1 rounded-full text-xs font-medium border ${
                      index === 0 ? 'bg-yellow-50 border-yellow-200 text-yellow-800' :
                      index === 1 ? 'bg-green-50 border-green-200 text-green-800' :
                      index === 2 ? 'bg-purple-50 border-purple-200 text-purple-800' :
                      'bg-gray-50 border-gray-200 text-gray-800'
                    }`}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {trade.notes && (
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Notes
              </h3>
              <div className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">
                {trade.notes}
              </div>
            </div>
          )}
        </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
