'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';
// import AssetTypeSelection from './AssetTypeSelection';
// import TradeNotesEditor from './TradeNotesEditor';

export interface TradeData {
  // Step 1: Asset Selection
  assetType: 'stocks' | 'crypto' | 'forex' | 'commodities' | 'options' | '';
  symbol: string;
  
  // Step 2: Trade Details
  side: 'buy' | 'sell' | '';
  quantity: number;
  entryPrice: number;
  exitPrice?: number;
  entryDate: string;
  exitDate?: string;
  
  // Step 3: Analysis & Notes
  strategy: string;
  notes: string;
  tags: string[];
  
  // Additional fields
  stopLoss?: number;
  takeProfit?: number;
  commission?: number;
}

interface Props {
  onClose: () => void;
  onSubmit?: (data: TradeData) => void;
}

const STEPS = [
  { id: 1, title: 'Asset Type', description: 'Select asset type and symbol' },
  { id: 2, title: 'Trade Details', description: 'Enter trade execution details' },
  { id: 3, title: 'Analysis & Notes', description: 'Add strategy and notes' }
];

export default function TradeEntryForm({ onClose, onSubmit }: Props) {
  const [currentStep, setCurrentStep] = useState(1);
  const [tradeData, setTradeData] = useState<TradeData>({
    assetType: '',
    symbol: '',
    side: '',
    quantity: 0,
    entryPrice: 0,
    entryDate: new Date().toISOString().split('T')[0],
    strategy: '',
    notes: '',
    tags: []
  });

  const updateTradeData = (updates: Partial<TradeData>) => {
    setTradeData(prev => ({ ...prev, ...updates }));
  };

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      // Map frontend data format to backend API format
      const tradePayload = {
        symbol: tradeData.symbol.toUpperCase(),
        assetType: tradeData.assetType === 'stocks' ? 'stock' : 
                   tradeData.assetType === 'crypto' ? 'crypto' :
                   tradeData.assetType === 'forex' ? 'forex' :
                   tradeData.assetType === 'commodities' ? 'future' :
                   tradeData.assetType === 'options' ? 'option' : 'stock',
        side: tradeData.side,
        quantity: tradeData.quantity,
        entryPrice: tradeData.entryPrice,
        exitPrice: tradeData.exitPrice,
        entryDate: tradeData.entryDate,
        exitDate: tradeData.exitDate,
        status: tradeData.exitPrice ? 'closed' : 'open',
        strategy: tradeData.strategy,
        notes: tradeData.notes,
        tags: tradeData.tags
      };

      const response = await api.trades.create(tradePayload);
      
      if (response.data.success) {
        toast.success('Trade created successfully!');
        onSubmit?.(response.data.data);
        onClose();
      } else {
        toast.error('Failed to create trade');
      }
    } catch (error: any) {
      console.error('Error creating trade:', error);
      const errorMessage = error.response?.data?.message || 'Failed to create trade';
      toast.error(errorMessage);
    }
  };

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 1:
        return tradeData.assetType !== '' && tradeData.symbol !== '';
      case 2:
        return tradeData.side !== '' && tradeData.quantity > 0 && tradeData.entryPrice > 0;
      case 3:
        return true; // Notes are optional
      default:
        return false;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-2xl max-h-[90vh] bg-white rounded-lg shadow-2xl border flex flex-col">
        {/* Header - Fixed */}
        <div className="flex items-center justify-between p-6 border-b bg-white rounded-t-lg flex-shrink-0">
          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-semibold text-gray-900 truncate">Add New Trade</h2>
            <p className="text-sm text-gray-600 mt-1 truncate">
              Step {currentStep} of {STEPS.length}: {STEPS[currentStep - 1].description}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="ml-4 flex-shrink-0 hover:bg-gray-100">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {/* Progress Steps */}
            <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-lg">
              {STEPS.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold border-2 transition-all
                    ${currentStep > step.id 
                      ? 'bg-green-500 text-white border-green-500' 
                      : currentStep === step.id 
                      ? 'bg-blue-500 text-white border-blue-500' 
                      : 'bg-white text-gray-400 border-gray-200'
                    }
                  `}>
                    {currentStep > step.id ? <Check className="h-4 w-4" /> : step.id}
                  </div>
                  <div className="ml-2 min-w-0 hidden sm:block">
                    <p className={`text-xs font-medium truncate ${
                      currentStep >= step.id ? 'text-gray-900' : 'text-gray-400'
                    }`}>{step.title}</p>
                  </div>
                  {index < STEPS.length - 1 && (
                    <div className={`
                      w-8 sm:w-12 h-1 mx-2 sm:mx-3 rounded transition-all
                      ${currentStep > step.id ? 'bg-green-500' : 'bg-gray-200'}
                    `} />
                  )}
                </div>
              ))}
            </div>

            {/* Step Content */}
            <div className="min-h-[300px]">
              {currentStep === 1 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Select Asset Type</h3>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {[
                      { type: 'stocks', label: 'Stocks', icon: '📈' },
                      { type: 'crypto', label: 'Crypto', icon: '₿' },
                      { type: 'forex', label: 'Forex', icon: '💱' },
                      { type: 'commodities', label: 'Commodities', icon: '🏅' },
                      { type: 'options', label: 'Options', icon: '📊' }
                    ].map((asset) => (
                      <button
                        key={asset.type}
                        type="button"
                        onClick={() => updateTradeData({ assetType: asset.type as any })}
                        className={`p-4 border-2 rounded-lg text-center transition-all ${
                          tradeData.assetType === asset.type
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="text-2xl mb-2">{asset.icon}</div>
                        <div className="font-medium text-sm">{asset.label}</div>
                      </button>
                    ))}
                  </div>

                  {tradeData.assetType && (
                    <div className="space-y-2 pt-4">
                      <Label htmlFor="symbol" className="text-sm font-medium text-gray-700">Symbol</Label>
                      <Input
                        id="symbol"
                        type="text"
                        value={tradeData.symbol}
                        onChange={(e) => updateTradeData({ symbol: e.target.value.toUpperCase() })}
                        placeholder="Enter symbol (e.g., AAPL, BTC)"
                        className="shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      />
                    </div>
                  )}
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Trade Execution Details</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="side" className="text-sm font-medium text-gray-700">Trade Side</Label>
                      <select
                        id="side"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                        value={tradeData.side}
                        onChange={(e) => updateTradeData({ side: e.target.value as 'buy' | 'sell' })}
                      >
                        <option value="">Select side</option>
                        <option value="buy">Buy / Long</option>
                        <option value="sell">Sell / Short</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="quantity" className="text-sm font-medium text-gray-700">Quantity</Label>
                      <Input
                        id="quantity"
                        type="number"
                        step="any"
                        value={tradeData.quantity || ''}
                        onChange={(e) => updateTradeData({ quantity: parseFloat(e.target.value) || 0 })}
                        placeholder="Enter quantity"
                        className="shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="entryPrice" className="text-sm font-medium text-gray-700">Entry Price</Label>
                      <Input
                        id="entryPrice"
                        type="number"
                        step="any"
                        value={tradeData.entryPrice || ''}
                        onChange={(e) => updateTradeData({ entryPrice: parseFloat(e.target.value) || 0 })}
                        placeholder="Enter entry price"
                        className="shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="exitPrice" className="text-sm font-medium text-gray-700">Exit Price (Optional)</Label>
                      <Input
                        id="exitPrice"
                        type="number"
                        step="any"
                        value={tradeData.exitPrice || ''}
                        onChange={(e) => updateTradeData({ exitPrice: parseFloat(e.target.value) || undefined })}
                        placeholder="Enter exit price"
                        className="shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="entryDate" className="text-sm font-medium text-gray-700">Entry Date</Label>
                      <Input
                        id="entryDate"
                        type="date"
                        value={tradeData.entryDate}
                        onChange={(e) => updateTradeData({ entryDate: e.target.value })}
                        className="shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="exitDate" className="text-sm font-medium text-gray-700">Exit Date (Optional)</Label>
                      <Input
                        id="exitDate"
                        type="date"
                        value={tradeData.exitDate || ''}
                        onChange={(e) => updateTradeData({ exitDate: e.target.value || undefined })}
                        className="shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="stopLoss" className="text-sm font-medium text-gray-700">Stop Loss (Optional)</Label>
                      <Input
                        id="stopLoss"
                        type="number"
                        step="any"
                        value={tradeData.stopLoss || ''}
                        onChange={(e) => updateTradeData({ stopLoss: parseFloat(e.target.value) || undefined })}
                        placeholder="Enter stop loss"
                        className="shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="takeProfit" className="text-sm font-medium text-gray-700">Take Profit (Optional)</Label>
                      <Input
                        id="takeProfit"
                        type="number"
                        step="any"
                        value={tradeData.takeProfit || ''}
                        onChange={(e) => updateTradeData({ takeProfit: parseFloat(e.target.value) || undefined })}
                        placeholder="Enter take profit"
                        className="shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Strategy & Notes</h3>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="strategy" className="text-sm font-medium text-gray-700">Trading Strategy</Label>
                      <Input
                        id="strategy"
                        type="text"
                        value={tradeData.strategy}
                        onChange={(e) => updateTradeData({ strategy: e.target.value })}
                        placeholder="e.g., Swing Trading, Day Trading, Scalping"
                        className="shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes" className="text-sm font-medium text-gray-700">Trade Notes</Label>
                      <textarea
                        id="notes"
                        rows={4}
                        value={tradeData.notes}
                        onChange={(e) => updateTradeData({ notes: e.target.value })}
                        placeholder="Add your trade analysis, reasons for entry/exit, market conditions, etc."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Tags</Label>
                      <div className="flex flex-wrap gap-2">
                        {['Breakout', 'Support/Resistance', 'News', 'Technical', 'Fundamental'].map((tag) => (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => {
                              const tags = tradeData.tags.includes(tag)
                                ? tradeData.tags.filter(t => t !== tag)
                                : [...tradeData.tags, tag];
                              updateTradeData({ tags });
                            }}
                            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                              tradeData.tags.includes(tag)
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer - Fixed */}
        <div className="flex justify-between items-center p-4 border-t bg-gray-50 rounded-b-lg flex-shrink-0">
          <Button 
            variant="outline" 
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="shadow-sm"
            size="sm"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>

          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="shadow-sm"
              size="sm"
            >
              Cancel
            </Button>
            
            {currentStep < STEPS.length ? (
              <Button 
                onClick={handleNext}
                disabled={!isStepValid(currentStep)}
                className="shadow-sm bg-blue-600 hover:bg-blue-700 text-white"
                size="sm"
              >
                Next
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit}
                disabled={!isStepValid(currentStep)}
                className="bg-green-600 hover:bg-green-700 shadow-sm text-white"
                size="sm"
              >
                <Check className="h-4 w-4 mr-1" />
                Create Trade
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
