'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Plus, 
  Search, 
  Filter, 
  TrendingUp, 
  TrendingDown,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Bitcoin,
  DollarSign,
  BarChart3,
  Coins,
  Settings,
  AlertTriangle
} from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';
import TradeEntryForm from '@/components/trades/TradeEntryForm';
import TradeViewModal from '@/components/trades/TradeViewModal';
import TradeEditModal from '@/components/trades/TradeEditModal';
import Navigation from '@/components/Navigation';

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

// TradeCard Component
interface TradeCardProps {
  trade: Trade;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

function TradeCard({ trade, onView, onEdit, onDelete }: TradeCardProps) {
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

  const pnl = calculatePnL(trade);
  const isProfit = pnl !== null && pnl > 0;

  return (
    <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500">
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-3">
            <div className="font-bold text-xl text-gray-900">{trade.symbol}</div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              trade.side === 'buy' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {trade.side.toUpperCase()}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={onView} className="h-8 w-8 p-0">
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onEdit} className="h-8 w-8 p-0">
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onDelete} className="h-8 w-8 p-0 text-red-600 hover:text-red-700">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Strategy - Highlighted */}
        {trade.strategy && (
          <div className="mb-3">
            <span className="inline-block px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium rounded-full">
              📊 {trade.strategy}
            </span>
          </div>
        )}

        {/* Trade Details */}
        <div className="grid grid-cols-2 gap-3 text-sm mb-3">
          <div>
            <span className="text-gray-500">Quantity:</span>
            <p className="font-semibold">{trade.quantity}</p>
          </div>
          <div>
            <span className="text-gray-500">Entry:</span>
            <p className="font-semibold">{formatCurrency(trade.entryPrice)}</p>
          </div>
          <div>
            <span className="text-gray-500">Exit:</span>
            <p className="font-semibold">
              {trade.exitPrice ? formatCurrency(trade.exitPrice) : (
                <span className="text-blue-600 font-medium">Open</span>
              )}
            </p>
          </div>
          <div>
            <span className="text-gray-500">P&L:</span>
            {pnl !== null ? (
              <p className={`font-bold flex items-center gap-1 ${isProfit ? 'text-green-600' : 'text-red-600'}`}>
                {isProfit ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {formatCurrency(pnl)}
              </p>
            ) : (
              <p className="text-gray-400">-</p>
            )}
          </div>
        </div>

        {/* Tags - Highlighted */}
        {trade.tags && trade.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {trade.tags.slice(0, 4).map((tag, index) => (
              <span 
                key={tag} 
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  index === 0 ? 'bg-yellow-100 text-yellow-800' :
                  index === 1 ? 'bg-green-100 text-green-800' :
                  index === 2 ? 'bg-purple-100 text-purple-800' :
                  'bg-gray-100 text-gray-800'
                }`}
              >
                #{tag}
              </span>
            ))}
            {trade.tags.length > 4 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                +{trade.tags.length - 4} more
              </span>
            )}
          </div>
        )}

        {/* Date & Status */}
        <div className="flex justify-between items-center text-xs text-gray-500 pt-2 border-t">
          <span>{new Date(trade.entryDate).toLocaleDateString()}</span>
          <span className={`px-2 py-1 rounded-full font-medium ${
            trade.exitPrice 
              ? 'bg-gray-100 text-gray-800' 
              : 'bg-blue-100 text-blue-800'
          }`}>
            {trade.exitPrice ? 'Closed' : 'Open'}
          </span>
        </div>

        {/* Notes Preview */}
        {trade.notes && (
          <div className="mt-2 pt-2 border-t">
            <p className="text-xs text-gray-600 italic line-clamp-2">
              💭 {trade.notes.length > 100 ? `${trade.notes.substring(0, 100)}...` : trade.notes}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function TradesPage() {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'open' | 'closed'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'pnl' | 'symbol'>('date');
  const [loading, setLoading] = useState(true);
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Helper functions for asset types
  const getAssetTypeIcon = (assetType: string) => {
    switch (assetType) {
      case 'stocks': return <BarChart3 className="h-5 w-5 text-blue-600" />;
      case 'crypto': return <Bitcoin className="h-5 w-5 text-orange-600" />;
      case 'forex': return <DollarSign className="h-5 w-5 text-green-600" />;
      case 'commodities': return <Coins className="h-5 w-5 text-yellow-600" />;
      case 'options': return <Settings className="h-5 w-5 text-purple-600" />;
      default: return <AlertTriangle className="h-5 w-5 text-gray-600" />;
    }
  };

  const getAssetTypeColor = (assetType: string) => {
    switch (assetType) {
      case 'stocks': return 'bg-blue-100';
      case 'crypto': return 'bg-orange-100';
      case 'forex': return 'bg-green-100';
      case 'commodities': return 'bg-yellow-100';
      case 'options': return 'bg-purple-100';
      default: return 'bg-gray-100';
    }
  };

  const getAssetTypeLabel = (assetType: string) => {
    switch (assetType) {
      case 'stocks': return 'Stocks & ETFs';
      case 'crypto': return 'Cryptocurrency';
      case 'forex': return 'Forex';
      case 'commodities': return 'Commodities';
      case 'options': return 'Options';
      default: return 'Other Assets';
    }
  };

  const getTotalPnL = (trades: Trade[]) => {
    return trades.reduce((total, trade) => {
      const pnl = calculatePnL(trade);
      return total + (pnl || 0);
    }, 0);
  };

  // Action handlers
  const handleViewTrade = (trade: Trade) => {
    setSelectedTrade(trade);
    setShowViewModal(true);
  };

  const handleEditTrade = (trade: Trade) => {
    setSelectedTrade(trade);
    setShowEditModal(true);
  };

  const handleDeleteTrade = async (tradeId: string) => {
    if (!confirm('Are you sure you want to delete this trade?')) return;
    
    try {
      await api.trades.delete(tradeId);
      setTrades(prev => prev.filter(t => t.id !== tradeId));
      toast.success('Trade deleted successfully');
    } catch (error) {
      console.error('Error deleting trade:', error);
      toast.error('Failed to delete trade');
    }
  };

  // Fetch trades from API
  useEffect(() => {
    if (user) {
      fetchTrades();
    }
  }, [user]);

  const fetchTrades = async () => {
    try {
      setLoading(true);
      const response = await api.trades.list();
      if (response.data.success) {
        setTrades(response.data.data || []);
      }
    } catch (error: any) {
      console.error('Error fetching trades:', error);
      toast.error('Failed to fetch trades');
    } finally {
      setLoading(false);
    }
  };

  const handleTradeCreated = (newTrade: any) => {
    setTrades(prev => [newTrade, ...prev]);
    setShowForm(false);
  };

  const handleTradeUpdated = (updatedTrade: Trade) => {
    setTrades(prev => prev.map(trade => 
      trade.id === updatedTrade.id ? updatedTrade : trade
    ));
    setShowEditModal(false);
    setSelectedTrade(null);
  };

  const calculatePnL = (trade: Trade) => {
    if (!trade.exitPrice) return null;
    
    const multiplier = trade.side === 'buy' ? 1 : -1;
    const pnl = (trade.exitPrice - trade.entryPrice) * trade.quantity * multiplier;
    return pnl;
  };

  const getFilteredTrades = () => {
    let filtered = trades.filter(trade => {
      // Search filter
      const matchesSearch = trade.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           trade.strategy.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           trade.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // Status filter
      const matchesStatus = filterStatus === 'all' || 
                           (filterStatus === 'open' && !trade.exitPrice) ||
                           (filterStatus === 'closed' && trade.exitPrice);
      
      return matchesSearch && matchesStatus;
    });

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.entryDate).getTime() - new Date(a.entryDate).getTime();
        case 'symbol':
          return a.symbol.localeCompare(b.symbol);
        case 'pnl':
          const pnlA = calculatePnL(a) || 0;
          const pnlB = calculatePnL(b) || 0;
          return pnlB - pnlA;
        default:
          return 0;
      }
    });

    return filtered;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(2)}%`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Trade Management</h1>
            <p className="text-gray-600 mt-2">Track and analyze your trading positions</p>
          </div>
          <Button 
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add New Trade
          </Button>
        </div>

        {/* Filters & Search */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Filters & Search</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-64">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search trades by symbol, strategy, or tags..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="px-3 py-2 border rounded-md bg-white"
                >
                  <option value="all">All Trades</option>
                  <option value="open">Open Positions</option>
                  <option value="closed">Closed Positions</option>
                </select>
                
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-2 border rounded-md bg-white"
                >
                  <option value="date">Sort by Date</option>
                  <option value="symbol">Sort by Symbol</option>
                  <option value="pnl">Sort by P&L</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Trades List - Grouped by Asset Type */}
        <div className="space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : getFilteredTrades().length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <TrendingUp className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No trades found</h3>
              <p className="text-gray-500 mb-4">
                {trades.length === 0 
                  ? "Start by adding your first trade to begin tracking your performance."
                  : "Try adjusting your search or filter criteria."
                }
              </p>
              <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Your First Trade
              </Button>
            </div>
          ) : (
            // Group trades by asset type
            Object.entries(
              getFilteredTrades().reduce((groups, trade) => {
                const assetType = trade.assetType || 'other';
                if (!groups[assetType]) groups[assetType] = [];
                groups[assetType].push(trade);
                return groups;
              }, {} as Record<string, Trade[]>)
            ).map(([assetType, assetTrades]) => (
              <Card key={assetType} className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${getAssetTypeColor(assetType)}`}>
                        {getAssetTypeIcon(assetType)}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold capitalize text-gray-900">
                          {getAssetTypeLabel(assetType)}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {assetTrades.length} trades • {assetTrades.filter(t => !t.exitPrice).length} open
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Total P&L</div>
                      <div className={`text-lg font-bold ${
                        getTotalPnL(assetTrades) >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {formatCurrency(getTotalPnL(assetTrades))}
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 p-6">
                    {assetTrades.map((trade) => (
                      <TradeCard 
                        key={trade.id} 
                        trade={trade} 
                        onView={() => handleViewTrade(trade)}
                        onEdit={() => handleEditTrade(trade)}
                        onDelete={() => handleDeleteTrade(trade.id)}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Trade Entry Form */}
        {showForm && (
          <TradeEntryForm 
            onClose={() => setShowForm(false)} 
            onSubmit={handleTradeCreated}
          />
        )}

        {/* Trade View Modal */}
        <TradeViewModal 
          trade={selectedTrade}
          isOpen={showViewModal}
          onClose={() => {
            setShowViewModal(false);
            setSelectedTrade(null);
          }}
        />

        {/* Trade Edit Modal */}
        <TradeEditModal 
          trade={selectedTrade}
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedTrade(null);
          }}
          onUpdated={handleTradeUpdated}
        />
      </div>
    </div>
  );
}