'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/lib/i18n/LanguageProvider';
import { 
  Shield, 
  AlertTriangle, 
  TrendingDown,
  Target,
  PieChart,
  Calculator,
  Activity,
  Zap,
  CheckCircle,
  XCircle,
  DollarSign
} from 'lucide-react';

interface RiskMetric {
  id: string;
  name: string;
  value: number;
  threshold: number;
  status: 'safe' | 'warning' | 'danger';
  description: string;
  recommendation: string;
}

interface PositionSizing {
  symbol: string;
  currentPosition: number;
  suggestedPosition: number;
  maxPosition: number;
  riskAmount: number;
  stopLoss: number;
  entryPrice: number;
}

interface RiskScenario {
  id: string;
  name: string;
  probability: number;
  impact: number;
  portfolioLoss: number;
  affectedPositions: string[];
  mitigation: string[];
}

export default function RiskManagement() {
  const { t, loading: languageLoading } = useLanguage();
  const [riskMetrics, setRiskMetrics] = useState<RiskMetric[]>([]);
  const [positionSizing, setPositionSizing] = useState<PositionSizing[]>([]);
  const [riskScenarios, setRiskScenarios] = useState<RiskScenario[]>([]);
  const [portfolioValue, setPortfolioValue] = useState(100000);
  const [maxRiskPerTrade, setMaxRiskPerTrade] = useState(2);
  const [loading, setLoading] = useState(false);

  // Defensive check for translations
  const translations = (t as any)?.ai?.riskManagement;
  
  // Only show loading if translations are not available
  if (!translations) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Shield className="h-12 w-12 text-blue-500 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Đang tải bản dịch...</p>
        </div>
      </div>
    );
  }

  useEffect(() => {
    calculateRiskMetrics();
  }, [portfolioValue, maxRiskPerTrade]);

  const calculateRiskMetrics = async () => {
    setLoading(true);
    
    // Simulate risk analysis
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockRiskMetrics: RiskMetric[] = [
      {
        id: '1',
        name: 'Portfolio Risk',
        value: 8.5,
        threshold: 10,
        status: 'safe',
        description: 'Total portfolio risk exposure',
        recommendation: 'Consider adding defensive positions'
      },
      {
        id: '2',
        name: 'Position Concentration',
        value: 68,
        threshold: 60,
        status: 'warning',
        description: 'Percentage in top 5 positions',
        recommendation: 'Diversify into other sectors'
      },
      {
        id: '3',
        name: 'Sector Concentration',
        value: 75,
        threshold: 50,
        status: 'danger',
        description: 'Technology sector exposure',
        recommendation: 'Reduce tech allocation immediately'
      },
      {
        id: '4',
        name: 'VaR (1 Day, 95%)',
        value: 3.2,
        threshold: 5,
        status: 'safe',
        description: 'Value at Risk over 1 day',
        recommendation: 'Risk levels acceptable'
      },
      {
        id: '5',
        name: 'Drawdown Risk',
        value: 12,
        threshold: 15,
        status: 'warning',
        description: 'Maximum potential drawdown',
        recommendation: 'Implement tighter stops'
      }
    ];

    const mockPositionSizing: PositionSizing[] = [
      {
        symbol: 'AAPL',
        currentPosition: 5000,
        suggestedPosition: 3500,
        maxPosition: 4000,
        riskAmount: 2000,
        stopLoss: 170,
        entryPrice: 175.50
      },
      {
        symbol: 'TSLA',
        currentPosition: 8000,
        suggestedPosition: 2500,
        maxPosition: 3000,
        riskAmount: 2000,
        stopLoss: 185,
        entryPrice: 201.34
      },
      {
        symbol: 'NVDA',
        currentPosition: 0,
        suggestedPosition: 4500,
        maxPosition: 5000,
        riskAmount: 2000,
        stopLoss: 435,
        entryPrice: 456.78
      }
    ];

    const mockRiskScenarios: RiskScenario[] = [
      {
        id: '1',
        name: 'Market Crash (20% Down)',
        probability: 15,
        impact: 18500,
        portfolioLoss: 18.5,
        affectedPositions: ['AAPL', 'MSFT', 'GOOGL', 'TSLA'],
        mitigation: ['Hedge with puts', 'Reduce position sizes', 'Add defensive stocks']
      },
      {
        id: '2',
        name: 'Tech Sector Correction',
        probability: 35,
        impact: 12000,
        portfolioLoss: 12.0,
        affectedPositions: ['AAPL', 'MSFT', 'NVDA', 'GOOGL'],
        mitigation: ['Diversify sectors', 'Take profits on winners', 'Set protective stops']
      },
      {
        id: '3',
        name: 'Interest Rate Spike',
        probability: 25,
        impact: 8500,
        portfolioLoss: 8.5,
        affectedPositions: ['Growth stocks', 'REITs'],
        mitigation: ['Rotate to value', 'Consider bonds', 'Reduce leverage']
      }
    ];

    setRiskMetrics(mockRiskMetrics);
    setPositionSizing(mockPositionSizing);
    setRiskScenarios(mockRiskScenarios);
    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'safe': return 'bg-green-100 text-green-800 border-green-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'danger': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'safe': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'danger': return <XCircle className="h-4 w-4 text-red-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Shield className="h-6 w-6 text-green-600" />
            {translations.title}
          </h2>
          <p className="text-gray-600 mt-1">{translations.subtitle}</p>
        </div>
        <Button onClick={calculateRiskMetrics} disabled={loading} className="flex items-center gap-2">
          <Zap className={`h-4 w-4 ${loading ? 'animate-pulse' : ''}`} />
          {translations.analyzeButton}
        </Button>
      </div>

      {/* Risk Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-blue-500" />
            {translations.riskParameters.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {translations.riskParameters.portfolioValue}
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="number"
                  value={portfolioValue}
                  onChange={(e) => setPortfolioValue(Number(e.target.value))}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {translations.riskParameters.maxRiskPerTrade}
              </label>
              <Input
                type="number"
                value={maxRiskPerTrade}
                onChange={(e) => setMaxRiskPerTrade(Number(e.target.value))}
                step="0.1"
                min="0.5"
                max="5"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Shield className="h-12 w-12 text-green-500 animate-pulse mx-auto mb-4" />
            <p className="text-gray-600">Analyzing portfolio risk...</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Risk Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                Risk Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {riskMetrics.map((metric) => (
                  <div key={metric.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(metric.status)}
                        <h4 className="font-semibold">{metric.name}</h4>
                      </div>
                      <Badge className={getStatusColor(metric.status)}>
                        {metric.status.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl font-bold">
                        {metric.value.toFixed(1)}%
                      </span>
                      <span className="text-sm text-gray-500">
                        Limit: {metric.threshold}%
                      </span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                      <div 
                        className={`h-2 rounded-full ${
                          metric.status === 'safe' ? 'bg-green-500' :
                          metric.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${Math.min((metric.value / metric.threshold) * 100, 100)}%` }}
                      ></div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">{metric.description}</p>
                    <p className="text-sm font-medium text-blue-600">{metric.recommendation}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Position Sizing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-500" />
                Position Sizing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {positionSizing.map((position) => (
                  <div key={position.symbol} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-lg">{position.symbol}</h4>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Risk Amount</p>
                        <p className="font-medium">{formatCurrency(position.riskAmount)}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                      <div>
                        <span className="text-gray-500">Current:</span>
                        <p className="font-medium">{formatCurrency(position.currentPosition)}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Suggested:</span>
                        <p className="font-medium text-blue-600">{formatCurrency(position.suggestedPosition)}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Max Position:</span>
                        <p className="font-medium">{formatCurrency(position.maxPosition)}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Entry Price:</span>
                        <p className="font-medium">{formatCurrency(position.entryPrice)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-sm">
                        <span className="text-gray-500">Stop Loss: </span>
                        <span className="font-medium text-red-600">
                          {formatCurrency(position.stopLoss)}
                        </span>
                      </div>
                      <Button size="sm" variant="outline">
                        Apply
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Risk Scenarios */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5 text-purple-500" />
            Risk Scenarios
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {riskScenarios.map((scenario) => (
              <div key={scenario.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-lg">{scenario.name}</h4>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{scenario.probability}% chance</Badge>
                    <Badge className="bg-red-100 text-red-800">
                      -{scenario.portfolioLoss}%
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Potential Loss</p>
                    <p className="text-lg font-bold text-red-600">
                      {formatCurrency(scenario.impact)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Affected Positions</p>
                    <div className="flex flex-wrap gap-1">
                      {scenario.affectedPositions.map((pos) => (
                        <Badge key={pos} variant="outline" className="text-xs">
                          {pos}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Mitigation Strategies:</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {scenario.mitigation.map((strategy, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                        {strategy}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
