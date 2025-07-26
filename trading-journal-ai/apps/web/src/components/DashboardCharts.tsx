'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/lib/i18n/LanguageProvider';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

interface PnLChartProps {
  data: Array<{ date: string; pnl: number; cumulative: number }>;
}

export const PnLChart = ({ data }: PnLChartProps) => {
  const { t } = useLanguage();
  
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          📈 {t.dashboard.pnlOverTime}
        </CardTitle>
        <CardDescription>{t.dashboard.dailyPnlAndCumulative}</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="date" 
              className="text-xs"
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              className="text-xs"
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              formatter={(value: number, name: string) => [
                `$${value.toLocaleString()}`,
                name === 'pnl' ? t.dashboard.dailyPnl : t.dashboard.cumulativePnl
              ]}
            />
            <Legend />
            <Bar 
              dataKey="pnl" 
              fill="#3b82f6"
              fillOpacity={0.6}
              name={t.dashboard.dailyPnl}
            />
            <Line
              type="monotone"
              dataKey="cumulative"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              name={t.dashboard.cumulativePnl}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

interface AssetDistributionChartProps {
  data: Array<{ name: string; value: number; trades: number }>;
}

export const AssetDistributionChart = ({ data }: AssetDistributionChartProps) => {
  const { t } = useLanguage();
  
  const COLORS = {
    stock: '#3b82f6',      // Blue
    forex: '#10b981',      // Green
    crypto: '#f59e0b',     // Amber
    future: '#8b5cf6',     // Purple  
    option: '#ef4444',     // Red
    default: '#6b7280'     // Gray
  };

  const pieData = data.map(item => ({
    ...item,
    color: COLORS[item.name.toLowerCase() as keyof typeof COLORS] || COLORS.default
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🥧 {t.dashboard.assetDistribution}
        </CardTitle>
        <CardDescription>{t.dashboard.pnlByAssetType}</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              outerRadius={80}
              dataKey="value"
              label={({ name, value, percent }) => 
                `${name}: $${value.toLocaleString()} (${(percent * 100).toFixed(1)}%)`
              }
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => [`$${value.toLocaleString()}`, 'P&L']}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

interface MonthlyPerformanceChartProps {
  data: Array<{ month: string; pnl: number; trades: number }>;
}

export const MonthlyPerformanceChart = ({ data }: MonthlyPerformanceChartProps) => {
  const { t } = useLanguage();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          📊 {t.dashboard.monthlyPerformance}
        </CardTitle>
        <CardDescription>{t.dashboard.monthlyPnlAndTradeCount}</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="month" 
              className="text-xs"
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              yAxisId="pnl"
              orientation="left"
              className="text-xs"
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
            <YAxis 
              yAxisId="trades"
              orientation="right"
              className="text-xs"
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              formatter={(value: number, name: string) => [
                name === 'pnl' ? `$${value.toLocaleString()}` : value,
                name === 'pnl' ? t.dashboard.monthlyPnl : t.dashboard.tradesCount
              ]}
            />
            <Legend />
            <Bar
              yAxisId="pnl"
              dataKey="pnl"
              fill="#3b82f6"
              name={t.dashboard.monthlyPnl}
              radius={[4, 4, 0, 0]}
            />
            <Line
              yAxisId="trades"
              type="monotone"
              dataKey="trades"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
              name={t.dashboard.tradesCount}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

interface PerformanceMetricsProps {
  totalPnL: number;
  winRate: number;
  totalTrades: number;
  activePositions: number;
  averageWin: number;
  averageLoss: number;
  profitFactor: number;
  maxDrawdown: number;
  bestTrade: number;
  worstTrade: number;
}

export const PerformanceMetrics = ({
  totalPnL,
  winRate,
  totalTrades,
  activePositions,
  averageWin,
  averageLoss,
  profitFactor,
  maxDrawdown,
  bestTrade,
  worstTrade
}: PerformanceMetricsProps) => {
  const { t } = useLanguage();
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number) => `${value.toFixed(1)}%`;

  const metrics = [
    {
      title: t.dashboard.totalPnL,
      value: formatCurrency(totalPnL),
      change: totalPnL >= 0 ? '+' : '',
      color: totalPnL >= 0 ? 'text-green-600' : 'text-red-600',
      bgColor: totalPnL >= 0 ? 'bg-green-100' : 'bg-red-100',
      icon: totalPnL >= 0 ? '📈' : '📉'
    },
    {
      title: t.dashboard.winRate,
      value: formatPercentage(winRate),
      change: '',
      color: winRate >= 50 ? 'text-green-600' : 'text-red-600',
      bgColor: winRate >= 50 ? 'bg-green-100' : 'bg-red-100',
      icon: '🎯'
    },
    {
      title: t.dashboard.totalTrades,
      value: (totalTrades || 0).toString(),
      change: '',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      icon: '📊'
    },
    {
      title: t.dashboard.activePositions,
      value: (activePositions || 0).toString(),
      change: '',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      icon: '⚡'
    },
    {
      title: t.dashboard.averageWin,
      value: formatCurrency(averageWin),
      change: '',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      icon: '🏆'
    },
    {
      title: t.dashboard.averageLoss,
      value: formatCurrency(averageLoss),
      change: '',
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      icon: '💔'
    },
    {
      title: t.dashboard.profitFactor,
      value: profitFactor === Infinity ? '∞' : profitFactor.toFixed(2),
      change: '',
      color: profitFactor >= 1 ? 'text-green-600' : 'text-red-600',
      bgColor: profitFactor >= 1 ? 'bg-green-100' : 'bg-red-100',
      icon: '⚖️'
    },
    {
      title: t.dashboard.maxDrawdown,
      value: formatCurrency(maxDrawdown),
      change: '',
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      icon: '⬇️'
    },
    {
      title: t.dashboard.bestTrade,
      value: formatCurrency(bestTrade),
      change: '',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      icon: '🌟'
    },
    {
      title: t.dashboard.worstTrade,
      value: formatCurrency(worstTrade),
      change: '',
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      icon: '💀'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
      {metrics.map((metric, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">{metric.title}</p>
                <p className={`text-xl font-bold ${metric.color} mb-1`}>
                  {metric.change}{metric.value}
                </p>
              </div>
              <div className={`p-3 rounded-full ${metric.bgColor}`}>
                <span className="text-xl">{metric.icon}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
