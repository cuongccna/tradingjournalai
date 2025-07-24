'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Target,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useDashboardAnalytics } from '@/hooks/useDashboardAnalytics';
import Navigation from '@/components/Navigation';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Cell, Pie } from 'recharts';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

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

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16'];

export default function AnalyticsPage() {
  const { user, loading: authLoading } = useAuth();
  const { analytics, loading: analyticsLoading, error, refetch } = useDashboardAnalytics();

  const loading = authLoading || analyticsLoading;

  // Authentication check
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-96">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>Please log in to access analytics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Link href="/login">
                <Button className="w-full">Go to Login</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Loading analytics...</p>
            </div>
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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Trading Analytics</h1>
            <p className="text-gray-600 mt-2">Comprehensive view of your trading performance</p>
          </div>
          <Button onClick={refetch} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh Data
          </Button>
        </div>

        {/* Key Performance Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total P&L"
            value={formatCurrency(analytics.totalPnL)}
            icon={DollarSign}
            trend={analytics.totalPnL >= 0 ? 'up' : 'down'}
            trendValue={`${analytics.totalTrades} trades`}
            color={analytics.totalPnL >= 0 ? 'green' : 'red'}
          />
          
          <StatCard
            title="Win Rate"
            value={formatPercentage(analytics.winRate / 100)}
            icon={Target}
            trend={analytics.winRate >= 50 ? 'up' : 'down'}
            trendValue={`${analytics.winningTrades}W / ${analytics.losingTrades}L`}
            color="blue"
          />
          
          <StatCard
            title="Total Trades"
            value={analytics.totalTrades.toString()}
            icon={Activity}
            trendValue={`${analytics.monthlyPerformance.length} months`}
            color="purple"
          />
          
          <StatCard
            title="Profit Factor"
            value={analytics.profitFactor.toFixed(2)}
            icon={BarChart3}
            trend={analytics.profitFactor >= 1 ? 'up' : 'down'}
            trendValue={analytics.profitFactor >= 1 ? 'Profitable' : 'Unprofitable'}
            color={analytics.profitFactor >= 1 ? 'green' : 'red'}
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
                    <p className="text-2xl font-bold text-green-700">{formatCurrency(analytics.averageWin)}</p>
                  </div>
                  <div className="text-green-600">
                    <TrendingUp className="h-8 w-8" />
                  </div>
                </div>
                
                <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg">
                  <div>
                    <p className="font-medium text-red-800">Average Loss</p>
                    <p className="text-2xl font-bold text-red-700">{formatCurrency(Math.abs(analytics.averageLoss))}</p>
                  </div>
                  <div className="text-red-600">
                    <TrendingDown className="h-8 w-8" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-600">Best Trade</p>
                    <p className="text-lg font-bold text-blue-700">{formatCurrency(analytics.bestTrade)}</p>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <p className="text-sm text-orange-600">Worst Trade</p>
                    <p className="text-lg font-bold text-orange-700">{formatCurrency(analytics.worstTrade)}</p>
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
                {analytics.monthlyPerformance.map((month) => (
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

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* P&L Over Time Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                P&L Over Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analytics.pnlOverTime}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => [formatCurrency(Number(value)), '']} />
                  <Legend />
                  <Line type="monotone" dataKey="cumulative" stroke="#8884d8" strokeWidth={2} name="Cumulative P&L" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Asset Distribution Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PieChart className="h-5 w-5 mr-2" />
                Asset Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={analytics.assetTypeDistribution.map((entry, index) => ({
                      ...entry,
                      fill: entry.name === 'stock' ? '#3b82f6' :
                            entry.name === 'crypto' ? '#f59e0b' :
                            entry.name === 'forex' ? '#10b981' :
                            entry.name === 'future' ? '#8b5cf6' :
                            entry.name === 'option' ? '#ef4444' :
                            COLORS[index % COLORS.length]
                    }))}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }: any) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {analytics.assetTypeDistribution.map((entry, index) => {
                      const color = entry.name === 'stock' ? '#3b82f6' :
                                   entry.name === 'crypto' ? '#f59e0b' :
                                   entry.name === 'forex' ? '#10b981' :
                                   entry.name === 'future' ? '#8b5cf6' :
                                   entry.name === 'option' ? '#ef4444' :
                                   COLORS[index % COLORS.length];
                      return <Cell key={`cell-${index}`} fill={color} />;
                    })}
                  </Pie>
                  <Tooltip formatter={(value) => [formatCurrency(Number(value)), 'Volume']} />
                </RechartsPieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Performance Chart */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Monthly Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.monthlyPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [formatCurrency(Number(value)), 'P&L']} />
                <Legend />
                <Bar dataKey="pnl" fill="#8884d8" name="Monthly P&L" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

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
                  <span className="font-medium text-red-600">{formatCurrency(analytics.maxDrawdown)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Profit Factor</span>
                  <span className="font-medium">{analytics.profitFactor.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Volume</span>
                  <span className="font-medium">{formatCurrency(analytics.totalVolume)}</span>
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
                  <span className="text-gray-600">Active Positions</span>
                  <span className="font-medium">{analytics.activePositions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Recent Trades</span>
                  <span className="font-medium">{analytics.recentTrades.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Asset Types</span>
                  <span className="font-medium">{analytics.assetTypeDistribution.length}</span>
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
                  <span className="font-medium">{formatCurrency(analytics.totalVolume)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg Trade Size</span>
                  <span className="font-medium">{formatCurrency(analytics.totalVolume / analytics.totalTrades || 0)}</span>
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
