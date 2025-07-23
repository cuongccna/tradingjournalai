'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Target,
  Calendar,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';
import Navigation from '@/components/Navigation';

interface TradeStats {
  totalTrades: number;
  totalPnL: number;
  winRate: number;
  avgWin: number;
  avgLoss: number;
  winningTrades: number;
  losingTrades: number;
  totalVolume: number;
  bestTrade: number;
  worstTrade: number;
  avgHoldingPeriod: number;
  profitFactor: number;
}

interface MonthlyData {
  month: string;
  pnl: number;
  trades: number;
}

export default function AnalyticsPage() {
  const [stats, setStats] = useState<TradeStats>({
    totalTrades: 0,
    totalPnL: 0,
    winRate: 0,
    avgWin: 0,
    avgLoss: 0,
    winningTrades: 0,
    losingTrades: 0,
    totalVolume: 0,
    bestTrade: 0,
    worstTrade: 0,
    avgHoldingPeriod: 0,
    profitFactor: 0
  });
  
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      
      // Fetch from backend API
      const response = await fetch('http://localhost:3001/api/trades/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data.data);
      }
      
      // Mock monthly data for now
      setMonthlyData([
        { month: 'Jan', pnl: 1200, trades: 15 },
        { month: 'Feb', pnl: -800, trades: 12 },
        { month: 'Mar', pnl: 2400, trades: 18 },
        { month: 'Apr', pnl: 1800, trades: 16 },
        { month: 'May', pnl: -400, trades: 10 },
        { month: 'Jun', pnl: 3200, trades: 22 }
      ]);
      
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
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

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    trend, 
    trendValue, 
    color = 'blue' 
  }: {
    title: string;
    value: string;
    icon: any;
    trend?: 'up' | 'down';
    trendValue?: string;
    color?: string;
  }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {trend && trendValue && (
              <div className={`flex items-center mt-2 text-sm ${
                trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {trend === 'up' ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                {trendValue}
              </div>
            )}
          </div>
          <div className={`p-3 rounded-full bg-${color}-100`}>
            <Icon className={`h-6 w-6 text-${color}-600`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Trading Analytics</h1>
          <p className="text-gray-600 mt-2">Comprehensive view of your trading performance</p>
        </div>

        {/* Key Performance Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total P&L"
            value={formatCurrency(stats.totalPnL)}
            icon={DollarSign}
            trend={stats.totalPnL >= 0 ? 'up' : 'down'}
            trendValue={`${stats.totalTrades} trades`}
            color={stats.totalPnL >= 0 ? 'green' : 'red'}
          />
          
          <StatCard
            title="Win Rate"
            value={formatPercentage(stats.winRate)}
            icon={Target}
            trend={stats.winRate >= 0.5 ? 'up' : 'down'}
            trendValue={`${stats.winningTrades}W / ${stats.losingTrades}L`}
            color="blue"
          />
          
          <StatCard
            title="Total Trades"
            value={stats.totalTrades.toString()}
            icon={Activity}
            trendValue={`${Math.round(stats.totalTrades / 6)} avg/month`}
            color="purple"
          />
          
          <StatCard
            title="Profit Factor"
            value={stats.profitFactor.toFixed(2)}
            icon={BarChart3}
            trend={stats.profitFactor >= 1 ? 'up' : 'down'}
            trendValue={stats.profitFactor >= 1 ? 'Profitable' : 'Unprofitable'}
            color={stats.profitFactor >= 1 ? 'green' : 'red'}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Performance Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PieChart className="h-5 w-5 mr-2" />
                Performance Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                  <div>
                    <p className="font-medium text-green-800">Average Win</p>
                    <p className="text-2xl font-bold text-green-700">{formatCurrency(stats.avgWin)}</p>
                  </div>
                  <div className="text-green-600">
                    <TrendingUp className="h-8 w-8" />
                  </div>
                </div>
                
                <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg">
                  <div>
                    <p className="font-medium text-red-800">Average Loss</p>
                    <p className="text-2xl font-bold text-red-700">{formatCurrency(Math.abs(stats.avgLoss))}</p>
                  </div>
                  <div className="text-red-600">
                    <TrendingDown className="h-8 w-8" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-600">Best Trade</p>
                    <p className="text-lg font-bold text-blue-700">{formatCurrency(stats.bestTrade)}</p>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <p className="text-sm text-orange-600">Worst Trade</p>
                    <p className="text-lg font-bold text-orange-700">{formatCurrency(stats.worstTrade)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Monthly Performance Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Monthly Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {monthlyData.map((month) => (
                  <div key={month.month} className="flex items-center justify-between">
                    <div className="flex items-center w-20">
                      <span className="text-sm font-medium text-gray-600">{month.month}</span>
                    </div>
                    <div className="flex-1 mx-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            month.pnl >= 0 ? 'bg-green-500' : 'bg-red-500'
                          }`}
                          style={{
                            width: `${Math.min(Math.abs(month.pnl) / 3500 * 100, 100)}%`
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-end w-24">
                      <span className={`text-sm font-medium ${
                        month.pnl >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {formatCurrency(month.pnl)}
                      </span>
                    </div>
                    <div className="w-16 text-right">
                      <span className="text-xs text-gray-500">{month.trades} trades</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Risk Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Max Drawdown</span>
                  <span className="font-medium text-red-600">-12.5%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sharpe Ratio</span>
                  <span className="font-medium">1.24</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Risk/Reward Ratio</span>
                  <span className="font-medium">1.8:1</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Trading Habits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg Hold Time</span>
                  <span className="font-medium">{stats.avgHoldingPeriod} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Most Active Day</span>
                  <span className="font-medium">Wednesday</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Preferred Asset</span>
                  <span className="font-medium">Stocks (65%)</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Volume Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Volume</span>
                  <span className="font-medium">{formatCurrency(stats.totalVolume)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg Trade Size</span>
                  <span className="font-medium">{formatCurrency(stats.totalVolume / stats.totalTrades || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Largest Position</span>
                  <span className="font-medium">{formatCurrency(15000)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
