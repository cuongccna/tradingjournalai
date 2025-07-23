'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Target,
  BarChart3,
  Lightbulb,
  Zap,
  RefreshCw
} from 'lucide-react';

interface AIInsight {
  id: string;
  type: 'pattern' | 'risk' | 'opportunity' | 'performance';
  title: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  actionable: boolean;
  relatedTrades?: string[];
}

interface TradeAnalysis {
  tradeId: string;
  symbol: string;
  aiScore: number;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  riskLevel: 'low' | 'medium' | 'high';
  predictedOutcome: 'profit' | 'loss' | 'breakeven';
  confidence: number;
  reasons: string[];
  recommendations: string[];
}

export default function AITradeAnalysis() {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [tradeAnalysis, setTradeAnalysis] = useState<TradeAnalysis[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    generateAIInsights();
  }, []);

  const generateAIInsights = async () => {
    setLoading(true);
    
    // Simulate AI analysis - In real implementation, this would call an AI service
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockInsights: AIInsight[] = [
      {
        id: '1',
        type: 'pattern',
        title: 'Strong Momentum Pattern Detected',
        description: 'Your tech stock trades show a consistent winning pattern during market opens. Consider increasing position sizes for morning trades.',
        confidence: 87,
        impact: 'high',
        actionable: true,
        relatedTrades: ['AAPL-001', 'MSFT-002', 'GOOGL-003']
      },
      {
        id: '2',
        type: 'risk',
        title: 'Portfolio Concentration Risk',
        description: 'Your portfolio is heavily concentrated in technology sector (68%). Consider diversifying into other sectors to reduce risk.',
        confidence: 92,
        impact: 'high',
        actionable: true,
        relatedTrades: ['AAPL-001', 'MSFT-002', 'TSLA-004']
      },
      {
        id: '3',
        type: 'opportunity',
        title: 'Optimal Entry Timing',
        description: 'Historical data suggests you perform 23% better when entering positions after 10:30 AM EST.',
        confidence: 76,
        impact: 'medium',
        actionable: true
      },
      {
        id: '4',
        type: 'performance',
        title: 'Win Rate Improvement',
        description: 'Your win rate has improved by 12% over the last 30 days. Current strategy is showing positive results.',
        confidence: 89,
        impact: 'medium',
        actionable: false
      }
    ];

    const mockTradeAnalysis: TradeAnalysis[] = [
      {
        tradeId: 'AAPL-001',
        symbol: 'AAPL',
        aiScore: 8.5,
        sentiment: 'bullish',
        riskLevel: 'low',
        predictedOutcome: 'profit',
        confidence: 85,
        reasons: [
          'Strong technical indicators',
          'Positive earnings momentum',
          'Favorable market conditions',
          'Historical performance pattern match'
        ],
        recommendations: [
          'Consider scaling into position',
          'Set stop loss at -3%',
          'Target profit at +8%'
        ]
      },
      {
        tradeId: 'TSLA-004',
        symbol: 'TSLA',
        aiScore: 6.2,
        sentiment: 'neutral',
        riskLevel: 'high',
        predictedOutcome: 'breakeven',
        confidence: 62,
        reasons: [
          'Mixed technical signals',
          'High volatility environment',
          'Sector rotation concerns'
        ],
        recommendations: [
          'Reduce position size',
          'Implement tighter stop loss',
          'Monitor closely for trend changes'
        ]
      }
    ];

    setInsights(mockInsights);
    setTradeAnalysis(mockTradeAnalysis);
    setLastUpdated(new Date());
    setLoading(false);
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'pattern': return <BarChart3 className="h-5 w-5" />;
      case 'risk': return <AlertTriangle className="h-5 w-5" />;
      case 'opportunity': return <Target className="h-5 w-5" />;
      case 'performance': return <TrendingUp className="h-5 w-5" />;
      default: return <Brain className="h-5 w-5" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'pattern': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'risk': return 'bg-red-100 text-red-800 border-red-200';
      case 'opportunity': return 'bg-green-100 text-green-800 border-green-200';
      case 'performance': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'bearish': return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <div className="h-4 w-4 bg-gray-400 rounded-full"></div>;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Brain className="h-6 w-6 text-blue-600" />
            AI Trade Analysis
          </h2>
          <p className="text-gray-600 mt-1">AI-powered insights and trade recommendations</p>
        </div>
        <div className="flex items-center gap-4">
          {lastUpdated && (
            <p className="text-sm text-gray-500">
              Updated {lastUpdated.toLocaleTimeString()}
            </p>
          )}
          <Button 
            onClick={generateAIInsights} 
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh Analysis
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Brain className="h-12 w-12 text-blue-500 animate-pulse mx-auto mb-4" />
            <p className="text-gray-600">AI is analyzing your trades...</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* AI Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                AI Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {insights.map((insight) => (
                  <div key={insight.id} className="p-4 rounded-lg border border-gray-200">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getInsightIcon(insight.type)}
                        <Badge className={getInsightColor(insight.type)}>
                          {insight.type.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">
                          {insight.confidence}% confidence
                        </span>
                        {insight.impact === 'high' && (
                          <Zap className="h-4 w-4 text-orange-500" />
                        )}
                      </div>
                    </div>
                    
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {insight.title}
                    </h4>
                    <p className="text-sm text-gray-600 mb-3">
                      {insight.description}
                    </p>
                    
                    {insight.actionable && (
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          Actionable
                        </Badge>
                        <Button size="sm" variant="ghost" className="text-xs">
                          View Details
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Trade Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-green-500" />
                Trade Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tradeAnalysis.map((analysis) => (
                  <div key={analysis.tradeId} className="p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-lg">{analysis.symbol}</h4>
                        {getSentimentIcon(analysis.sentiment)}
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-blue-600">
                          {analysis.aiScore}/10
                        </div>
                        <div className="text-xs text-gray-500">AI Score</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <span className="text-xs text-gray-500">Risk Level</span>
                        <Badge className={`ml-2 ${getRiskColor(analysis.riskLevel)}`}>
                          {analysis.riskLevel.toUpperCase()}
                        </Badge>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500">Prediction</span>
                        <span className="ml-2 text-sm font-medium capitalize">
                          {analysis.predictedOutcome}
                        </span>
                      </div>
                    </div>

                    <div className="mb-3">
                      <h5 className="text-sm font-medium text-gray-700 mb-1">AI Reasoning:</h5>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {analysis.reasons.slice(0, 2).map((reason, index) => (
                          <li key={index} className="flex items-start gap-1">
                            <span className="text-blue-500">•</span>
                            {reason}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-1">Recommendations:</h5>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {analysis.recommendations.slice(0, 2).map((rec, index) => (
                          <li key={index} className="flex items-start gap-1">
                            <span className="text-green-500">✓</span>
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-3 pt-3 border-t flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        Confidence: {analysis.confidence}%
                      </span>
                      <Button size="sm" variant="outline" className="text-xs">
                        View Full Analysis
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
