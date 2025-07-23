'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Link,
  X,
  Plus,
  Tag
} from 'lucide-react';
import { TradeData } from './TradeEntryForm';

interface Props {
  tradeData: TradeData;
  onUpdate: (updates: Partial<TradeData>) => void;
}

// Predefined trading strategies
const TRADING_STRATEGIES = [
  'Scalping',
  'Day Trading',
  'Swing Trading',
  'Position Trading',
  'Momentum Trading',
  'Mean Reversion',
  'Breakout Strategy',
  'Trend Following',
  'Support/Resistance',
  'Moving Average Crossover',
  'RSI Divergence',
  'Fibonacci Retracement',
  'MACD Strategy',
  'Bollinger Bands',
  'Custom Strategy'
];

// Predefined tags
const PREDEFINED_TAGS = [
  'profitable', 'loss', 'breakeven', 'high-conviction', 'experimental',
  'news-driven', 'technical', 'fundamental', 'earnings', 'dividend',
  'momentum', 'reversal', 'breakout', 'support', 'resistance',
  'oversold', 'overbought', 'trend-following', 'counter-trend'
];

export default function TradeNotesEditor({ tradeData, onUpdate }: Props) {
  const [newTag, setNewTag] = useState('');
  const [isFormattingOpen, setIsFormattingOpen] = useState(false);

  const handleStrategySelect = (strategy: string) => {
    onUpdate({ strategy });
  };

  const handleAddTag = (tag: string) => {
    if (tag && !tradeData.tags.includes(tag)) {
      onUpdate({ tags: [...tradeData.tags, tag] });
    }
    setNewTag('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onUpdate({ tags: tradeData.tags.filter(tag => tag !== tagToRemove) });
  };

  const insertFormatting = (type: string) => {
    const textarea = document.getElementById('tradeNotes') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    
    let formattedText = '';
    
    switch (type) {
      case 'bold':
        formattedText = `**${selectedText || 'bold text'}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText || 'italic text'}*`;
        break;
      case 'list':
        formattedText = `\n- ${selectedText || 'list item'}\n`;
        break;
      case 'orderedList':
        formattedText = `\n1. ${selectedText || 'list item'}\n`;
        break;
      case 'link':
        formattedText = `[${selectedText || 'link text'}](url)`;
        break;
    }

    const newText = 
      textarea.value.substring(0, start) + 
      formattedText + 
      textarea.value.substring(end);
    
    onUpdate({ notes: newText });
    
    // Focus back to textarea
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + formattedText.length,
        start + formattedText.length
      );
    }, 0);
  };

  return (
    <div className="space-y-6 bg-white">
      <div className="bg-white p-6 rounded-lg border border-gray-100">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 border-b pb-2">Trading Strategy</h3>
        <p className="text-gray-600 text-sm mb-4">
          Select your trading strategy or enter a custom one
        </p>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="strategy" className="text-sm font-medium text-gray-700 mb-2 block">Strategy Name</Label>
            <Input
              id="strategy"
              type="text"
              value={tradeData.strategy}
              onChange={(e) => onUpdate({ strategy: e.target.value })}
              placeholder="Enter or select a trading strategy"
              list="strategies"
              className="shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            
            <datalist id="strategies">
              {TRADING_STRATEGIES.map((strategy) => (
                <option key={strategy} value={strategy} />
              ))}
            </datalist>
          </div>
          
          {/* Strategy Quick Select */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <Label className="text-sm font-medium text-gray-700 mb-3 block">
              Quick select:
            </Label>
            <div className="flex flex-wrap gap-2">
              {TRADING_STRATEGIES.slice(0, 8).map((strategy) => (
                <button
                  key={strategy}
                  type="button"
                  onClick={() => handleStrategySelect(strategy)}
                  className={`
                    px-3 py-2 text-xs rounded-full border transition-colors shadow-sm
                    ${tradeData.strategy === strategy
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white hover:bg-blue-50 border-gray-200 hover:border-blue-300'
                    }
                  `}
                >
                  {strategy}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Rich Text Notes Editor */}
      <div className="bg-white p-6 rounded-lg border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <Label htmlFor="tradeNotes" className="text-lg font-semibold text-gray-900">Trade Notes & Analysis</Label>
            <p className="text-sm text-gray-600 mt-1">Document your trading thoughts and analysis</p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsFormattingOpen(!isFormattingOpen)}
            className="shadow-sm"
          >
            Formatting Tools
          </Button>
        </div>
        
        {/* Formatting Toolbar */}
        {isFormattingOpen && (
          <div className="mb-4 p-4 bg-gray-50 rounded-lg border">
            <div className="flex flex-wrap gap-2 mb-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => insertFormatting('bold')}
                className="shadow-sm"
              >
                <Bold className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => insertFormatting('italic')}
                className="shadow-sm"
              >
                <Italic className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => insertFormatting('list')}
                className="shadow-sm"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => insertFormatting('orderedList')}
                className="shadow-sm"
              >
                <ListOrdered className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => insertFormatting('link')}
                className="shadow-sm"
              >
                <Link className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              Select text and click formatting buttons, or use Markdown syntax directly
            </p>
          </div>
        )}
        
        <textarea
          id="tradeNotes"
          value={tradeData.notes}
          onChange={(e) => onUpdate({ notes: e.target.value })}
          placeholder="Enter your trade analysis, reasoning, and observations...

Examples:
• Market conditions and context
• Technical analysis findings
• Risk management decisions
• Lessons learned
• Next steps or improvements"
          className="w-full min-h-[200px] p-4 border border-gray-300 rounded-lg resize-y shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          rows={10}
        />
        
        <p className="text-xs text-gray-500 mt-2 bg-blue-50 p-2 rounded">
          💡 Tip: Supports Markdown formatting: **bold**, *italic*, - lists, [links](url)
        </p>
      </div>

      {/* Tags Section */}
      <div className="bg-white p-6 rounded-lg border border-gray-100">
        <div className="mb-4">
          <Label className="text-lg font-semibold text-gray-900 mb-2 block">Tags</Label>
          <p className="text-gray-600 text-sm">
            Add tags to categorize and filter your trades
          </p>
        </div>
        
        {/* Current Tags */}
        {tradeData.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            {tradeData.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-3 py-1 text-sm bg-blue-500 text-white rounded-full shadow-sm"
              >
                <Tag className="h-3 w-3 mr-1" />
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-2 hover:text-blue-200 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}
        
        {/* Add New Tag */}
        <div className="flex gap-2 mb-4">
          <Input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Add a tag..."
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddTag(newTag);
              }
            }}
            className="shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => handleAddTag(newTag)}
            disabled={!newTag}
            className="shadow-sm"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Predefined Tags */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <Label className="text-sm font-medium text-gray-700 mb-3 block">
            Quick add:
          </Label>
          <div className="flex flex-wrap gap-2">
            {PREDEFINED_TAGS.filter(tag => !tradeData.tags.includes(tag)).slice(0, 12).map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleAddTag(tag)}
                className="px-3 py-1 text-xs bg-white hover:bg-blue-50 text-gray-700 hover:text-blue-700 rounded-full border border-gray-200 hover:border-blue-300 transition-colors shadow-sm"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
