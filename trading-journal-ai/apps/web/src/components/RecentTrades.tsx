'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface RecentTradesProps {
  trades: any[];
}

export const RecentTrades = ({ trades }: RecentTradesProps) => {
  if (!trades?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🕒 Recent Trades
          </CardTitle>
          <CardDescription>
            Your latest trading activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">📊</div>
            <p>No recent trades found</p>
            <p className="text-sm">Start trading to see your activity here</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🕒 Recent Trades
        </CardTitle>
        <CardDescription>
          Your latest {trades.length} trades
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {trades.map((trade, index) => (
            <div key={trade.id || index} className="p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-semibold text-gray-900">
                    {trade.symbol || 'Unknown Symbol'}
                  </div>
                  <div className="text-sm text-gray-600">
                    {(trade.side || 'Unknown').toUpperCase()} • 
                    {trade.assetType || 'Unknown'} • 
                    Status: {(trade.status || 'Unknown').toUpperCase()}
                  </div>
                </div>
                <div className="text-right">
                  {trade.pnl !== undefined && (
                    <div className={`font-semibold ${
                      trade.pnl > 0 ? 'text-green-600' : trade.pnl < 0 ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {trade.pnl > 0 ? '+' : ''}${trade.pnl?.toFixed(2) || '0.00'}
                    </div>
                  )}
                  <div className="text-xs text-gray-500">
                    ${trade.entryPrice?.toFixed(2) || '0.00'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
