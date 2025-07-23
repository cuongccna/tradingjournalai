'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Save } from 'lucide-react';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';

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
  onUpdated: (updatedTrade: Trade) => void;
}

export default function TradeEditModal({ trade, isOpen, onClose, onUpdated }: Props) {
  const [formData, setFormData] = useState<Partial<Trade>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (trade) {
      setFormData({
        symbol: trade.symbol,
        assetType: trade.assetType,
        side: trade.side,
        quantity: trade.quantity,
        entryPrice: trade.entryPrice,
        exitPrice: trade.exitPrice,
        entryDate: trade.entryDate,
        exitDate: trade.exitDate,
        strategy: trade.strategy,
        notes: trade.notes,
        tags: trade.tags || []
      });
    }
  }, [trade]);

  if (!trade || !isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const response = await api.trades.update(trade.id, formData);
      
      if (response.data.success) {
        toast.success('Trade updated successfully!');
        onUpdated(response.data.data);
        onClose();
      } else {
        toast.error('Failed to update trade');
      }
    } catch (error: any) {
      console.error('Error updating trade:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update trade';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleTagsInput = (value: string) => {
    const tags = value.split(',').map(tag => tag.trim()).filter(tag => tag);
    setFormData(prev => ({ ...prev, tags }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white shadow-2xl">
        <CardHeader className="flex flex-row items-center justify-between border-b bg-white sticky top-0 z-10">
          <CardTitle className="text-xl font-semibold text-gray-900">
            Edit Trade: {trade.symbol}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose} className="hover:bg-gray-100">
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Trade Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="symbol">Symbol</Label>
                <Input
                  id="symbol"
                  type="text"
                  value={formData.symbol || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, symbol: e.target.value.toUpperCase() }))}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="assetType">Asset Type</Label>
                <select
                  id="assetType"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  value={formData.assetType || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, assetType: e.target.value }))}
                  required
                >
                  <option value="">Select asset type</option>
                  <option value="stocks">Stocks</option>
                  <option value="crypto">Cryptocurrency</option>
                  <option value="forex">Forex</option>
                  <option value="commodities">Commodities</option>
                  <option value="options">Options</option>
                </select>
              </div>
            </div>

            {/* Trade Details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="side">Side</Label>
                <select
                  id="side"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  value={formData.side || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, side: e.target.value as 'buy' | 'sell' }))}
                  required
                >
                  <option value="">Select side</option>
                  <option value="buy">Buy / Long</option>
                  <option value="sell">Sell / Short</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  step="any"
                  value={formData.quantity || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseFloat(e.target.value) || 0 }))}
                  required
                />
              </div>
            </div>

            {/* Prices */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="entryPrice">Entry Price</Label>
                <Input
                  id="entryPrice"
                  type="number"
                  step="any"
                  value={formData.entryPrice || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, entryPrice: parseFloat(e.target.value) || 0 }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="exitPrice">Exit Price (Optional)</Label>
                <Input
                  id="exitPrice"
                  type="number"
                  step="any"
                  value={formData.exitPrice || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, exitPrice: parseFloat(e.target.value) || undefined }))}
                />
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="entryDate">Entry Date</Label>
                <Input
                  id="entryDate"
                  type="date"
                  value={formData.entryDate || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, entryDate: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="exitDate">Exit Date (Optional)</Label>
                <Input
                  id="exitDate"
                  type="date"
                  value={formData.exitDate || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, exitDate: e.target.value || undefined }))}
                />
              </div>
            </div>

            {/* Strategy */}
            <div className="space-y-2">
              <Label htmlFor="strategy">Strategy</Label>
              <Input
                id="strategy"
                type="text"
                value={formData.strategy || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, strategy: e.target.value }))}
                placeholder="e.g., Swing Trading, Day Trading, Scalping"
              />
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                type="text"
                value={(formData.tags || []).join(', ')}
                onChange={(e) => handleTagsInput(e.target.value)}
                placeholder="e.g., breakout, support, news"
              />
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <textarea
                id="notes"
                rows={4}
                value={formData.notes || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Add your trade analysis, lessons learned, etc."
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Updating...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    Update Trade
                  </div>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
