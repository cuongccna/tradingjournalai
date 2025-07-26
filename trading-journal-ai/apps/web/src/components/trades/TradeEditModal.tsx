'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Save } from 'lucide-react';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';
import { useLanguage } from '@/lib/i18n/LanguageProvider';

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
  const { t } = useLanguage();
  const [formData, setFormData] = useState<Partial<Trade>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (trade) {
      // Map backend assetType to frontend values
      const frontendAssetType = trade.assetType === 'stock' ? 'stocks' :
                               trade.assetType === 'crypto' ? 'crypto' :
                               trade.assetType === 'forex' ? 'forex' :
                               trade.assetType === 'future' ? 'commodities' :
                               trade.assetType === 'option' ? 'options' : 'stocks';
      
      setFormData({
        symbol: trade.symbol,
        assetType: frontendAssetType,
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
      
      // Map frontend data format to backend API format (same as TradeEntryForm)
      const mappedAssetType = formData.assetType === 'stocks' ? 'stock' : 
                             formData.assetType === 'crypto' ? 'crypto' :
                             formData.assetType === 'forex' ? 'forex' :
                             formData.assetType === 'commodities' ? 'future' :
                             formData.assetType === 'options' ? 'option' : 'stock';
      
      const updatePayload = {
        ...formData,
        assetType: mappedAssetType,
        symbol: formData.symbol?.toUpperCase() || ''
      };
      
      const response = await api.trades.update(trade.id, updatePayload);
      
      if (response.data.success) {
        toast.success(t.trades.tradeUpdatedSuccess);
        onUpdated(response.data.data);
        onClose();
      } else {
        toast.error(t.trades.failedToUpdateTrade);
      }
    } catch (error: any) {
      console.error('Error updating trade:', error);
      const errorMessage = error.response?.data?.message || t.trades.failedToUpdateTrade;
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
            {t.trades.editTrade}: {trade.symbol}
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
                <Label htmlFor="symbol">{t.trades.symbol}</Label>
                <Input
                  id="symbol"
                  type="text"
                  value={formData.symbol || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, symbol: e.target.value.toUpperCase() }))}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="assetType">{t.trades.assetType}</Label>
                <select
                  id="assetType"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  value={formData.assetType || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, assetType: e.target.value }))}
                  required
                >
                  <option value="">{t.trades.selectAssetType}</option>
                  <option value="stocks">{t.trades.stocksEtfs}</option>
                  <option value="crypto">{t.trades.cryptocurrency}</option>
                  <option value="forex">{t.trades.forex}</option>
                  <option value="commodities">{t.trades.commodities}</option>
                  <option value="options">{t.trades.options}</option>
                </select>
              </div>
            </div>

            {/* Trade Details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="side">{t.trades.side}</Label>
                <select
                  id="side"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  value={formData.side || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, side: e.target.value as 'buy' | 'sell' }))}
                  required
                >
                  <option value="">{t.trades.selectSide}</option>
                  <option value="buy">{t.trades.buy} / {t.trades.long}</option>
                  <option value="sell">{t.trades.sell} / {t.trades.short}</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">{t.trades.quantity}</Label>
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
                <Label htmlFor="entryPrice">{t.trades.entryPrice}</Label>
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
                <Label htmlFor="exitPrice">{t.trades.exitPrice} ({t.trades.optional})</Label>
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
                <Label htmlFor="entryDate">{t.trades.entryDate}</Label>
                <Input
                  id="entryDate"
                  type="date"
                  value={formData.entryDate || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, entryDate: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="exitDate">{t.trades.exitDate} ({t.trades.optional})</Label>
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
              <Label htmlFor="strategy">{t.trades.strategy}</Label>
              <Input
                id="strategy"
                type="text"
                value={formData.strategy || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, strategy: e.target.value }))}
                placeholder={t.trades.enterStrategy}
              />
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label htmlFor="tags">{t.trades.tags} ({t.trades.enterTags})</Label>
              <Input
                id="tags"
                type="text"
                value={(formData.tags || []).join(', ')}
                onChange={(e) => handleTagsInput(e.target.value)}
                placeholder={t.trades.enterTags}
              />
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">{t.trades.notes}</Label>
              <textarea
                id="notes"
                rows={4}
                value={formData.notes || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder={t.trades.enterNotes}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                {t.trades.cancel}
              </Button>
              <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    {t.trades.updating}...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    {t.trades.updateTrade}
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
