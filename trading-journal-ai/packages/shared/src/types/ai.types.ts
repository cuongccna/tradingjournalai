export interface AIInsight {
  id: string;
  userId: string;
  tradeId?: string;
  type: InsightType;
  modelName: string;
  content: InsightContent;
  confidence: number;
  parameters?: Record<string, any>;
  generatedAt: Date;
}

export type InsightType = 
  | 'trade_analysis'
  | 'pattern_detection'
  | 'risk_evaluation'
  | 'emotion_analysis'
  | 'market_context'
  | 'performance_summary'
  | 'strategy_suggestion';

export interface InsightContent {
  summary: string;
  details: Record<string, any>;
  recommendations?: string[];
  warnings?: string[];
  relatedTrades?: string[];
  charts?: ChartData[];
}

export interface ChartData {
  type: 'line' | 'bar' | 'pie' | 'scatter' | 'heatmap';
  data: any;
  options?: any;
}

export interface MarketFlow {
  id: string;
  assetType: AssetType;
  symbol?: string;
  exchange?: string;
  periodStart: Date;
  periodEnd: Date;
  interval: '1m' | '5m' | '15m' | '1h' | '4h' | '1d' | '1w';
  metrics: FlowMetrics;
  dataSource: string;
  createdAt: Date;
}

export interface FlowMetrics {
  inflowVolume: number;
  outflowVolume: number;
  netFlow: number;
  inflowCount: number;
  outflowCount: number;
  averageInflowSize: number;
  averageOutflowSize: number;
  largeTransactions: number;
  whaleActivity: WhaleActivity;
}

export interface WhaleActivity {
  count: number;
  totalVolume: number;
  netPosition: 'bullish' | 'bearish' | 'neutral';
  addresses?: string[];
}