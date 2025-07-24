'use client';

import { useAuth } from '@/hooks/useAuth';
import { useDashboardAnalytics } from '@/hooks/useDashboardAnalytics';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, RefreshCw } from 'lucide-react';
import Navigation from '@/components/Navigation';
import { PerformanceMetrics, PnLChart, AssetDistributionChart, MonthlyPerformanceChart } from '@/components/DashboardCharts';
import { RecentTrades } from '@/components/RecentTrades';
import { AIInsights } from '@/components/AIInsights';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, userProfile, loading: authLoading, logout } = useAuth();
  const { analytics, loading: analyticsLoading, error, refetch } = useDashboardAnalytics();

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
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
            <CardDescription>Please log in to access the dashboard</CardDescription>
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="container mx-auto px-6 py-8">
        {/* Header with refresh button */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Welcome back, {userProfile?.displayName || user?.email || 'Guest'}
            </p>
          </div>
          <Button 
            onClick={refetch} 
            disabled={analyticsLoading}
            variant="outline"
            className="gap-2"
          >
            {analyticsLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Refresh Data
          </Button>
        </div>

        {error && (
          <Card className="mb-8 border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-red-800">
                <span>⚠️</span>
                <span>Error loading data: {error}</span>
                <Button 
                  onClick={refetch} 
                  variant="outline" 
                  size="sm" 
                  className="ml-auto"
                >
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {analyticsLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-600" />
              <p className="text-lg font-medium text-gray-700">Loading analytics...</p>
              <p className="text-gray-500">Analyzing your trading data</p>
            </div>
          </div>
        ) : (
          <>
            {/* Performance Metrics Cards */}
            <PerformanceMetrics
              totalPnL={analytics.totalPnL}
              winRate={analytics.winRate}
              totalTrades={analytics.totalTrades}
              activePositions={analytics.activePositions}
              averageWin={analytics.averageWin}
              averageLoss={analytics.averageLoss}
              profitFactor={analytics.profitFactor}
              maxDrawdown={analytics.maxDrawdown}
              bestTrade={analytics.bestTrade}
              worstTrade={analytics.worstTrade}
            />

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              {/* P&L Chart - Takes 2 columns */}
              <PnLChart data={analytics.pnlOverTime} />
              
              {/* Asset Distribution Chart */}
              <AssetDistributionChart data={analytics.assetTypeDistribution} />
            </div>

            {/* Monthly Performance Chart */}
            <div className="mb-8">
              <MonthlyPerformanceChart data={analytics.monthlyPerformance} />
            </div>

            {/* Recent Activity and AI Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Recent Trades */}
              <RecentTrades trades={analytics.recentTrades} />

              {/* AI Insights */}
              <AIInsights analytics={analytics as any} />
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🚀 Quick Actions
                </CardTitle>
                <CardDescription>Get started with your trading journal</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Link href="/trades" className="block">
                    <div className="p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <span className="text-xl">📊</span>
                        </div>
                        <div>
                          <p className="font-medium">View All Trades</p>
                          <p className="text-sm text-gray-500">Manage your trading history</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                  
                  <Link href="/trades" className="block">
                    <div className="p-4 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <span className="text-xl">➕</span>
                        </div>
                        <div>
                          <p className="font-medium">Add New Trade</p>
                          <p className="text-sm text-gray-500">Record your latest trades</p>
                        </div>
                      </div>
                    </div>
                  </Link>

                  <div className="p-4 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <span className="text-xl">📈</span>
                      </div>
                      <div>
                        <p className="font-medium">Advanced Analytics</p>
                        <p className="text-sm text-gray-500">Deep dive into performance</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Empty State for New Users */}
            {analytics.totalTrades === 0 && (
              <Card className="mt-8 border-dashed border-2 border-gray-300">
                <CardContent className="p-12 text-center">
                  <div className="text-6xl mb-4">📊</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Start Your Trading Journey
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Add your first trade to unlock powerful analytics, AI insights, and performance tracking.
                  </p>
                  <Link href="/trades">
                    <Button size="lg" className="gap-2">
                      <span>➕</span>
                      Add Your First Trade
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </main>
    </div>
  );
}
