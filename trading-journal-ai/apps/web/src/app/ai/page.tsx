'use client';

import { useState } from 'react';
import Navigation from '@/components/Navigation';
import AITradeAnalysis from '@/components/ai/AITradeAnalysis';
import MarketDataDashboard from '@/components/ai/MarketDataDashboard';
import PatternRecognition from '@/components/ai/PatternRecognition';
import RiskManagement from '@/components/ai/RiskManagement';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Newspaper, 
  TrendingUp, 
  AlertCircle,
  Globe,
  Clock,
  MessageSquare,
  Bot,
  Settings,
  BarChart3,
  Activity,
  Shield
} from 'lucide-react';

interface MarketNews {
  id: string;
  title: string;
  summary: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  impact: 'high' | 'medium' | 'low';
  source: string;
  publishedAt: string;
  relevantSymbols: string[];
}

interface AIChat {
  id: string;
  message: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export default function AIPage() {
  const [activeTab, setActiveTab] = useState<'analysis' | 'patterns' | 'market' | 'risk' | 'news' | 'chat'>('analysis');
  const [marketNews, setMarketNews] = useState<MarketNews[]>([
    {
      id: '1',
      title: 'Tech Stocks Rally on Positive Earnings Reports',
      summary: 'Major technology companies reported stronger than expected earnings, driving sector-wide gains.',
      sentiment: 'positive',
      impact: 'high',
      source: 'MarketWatch',
      publishedAt: '2 hours ago',
      relevantSymbols: ['AAPL', 'MSFT', 'GOOGL']
    },
    {
      id: '2',
      title: 'Federal Reserve Hints at Rate Cut',
      summary: 'Fed officials suggest potential interest rate adjustments in upcoming meeting.',
      sentiment: 'positive',
      impact: 'high',
      source: 'Reuters',
      publishedAt: '4 hours ago',
      relevantSymbols: ['SPY', 'QQQ']
    },
    {
      id: '3',
      title: 'Energy Sector Volatility Expected',
      summary: 'Oil price fluctuations may impact energy stock performance this week.',
      sentiment: 'neutral',
      impact: 'medium',
      source: 'Bloomberg',
      publishedAt: '6 hours ago',
      relevantSymbols: ['XOM', 'CVX']
    }
  ]);

  const [chatMessages, setChatMessages] = useState<AIChat[]>([
    {
      id: '1',
      message: 'Hello! I\'m your AI trading assistant. How can I help you analyze your trades today?',
      sender: 'ai',
      timestamp: new Date()
    }
  ]);

  const [chatInput, setChatInput] = useState('');

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;

    const newMessage: AIChat = {
      id: Date.now().toString(),
      message: chatInput,
      sender: 'user',
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, newMessage]);
    setChatInput('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: AIChat = {
        id: (Date.now() + 1).toString(),
        message: generateAIResponse(chatInput),
        sender: 'ai',
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, aiResponse]);
    }, 1500);
  };

  const generateAIResponse = (userMessage: string): string => {
    const responses = [
      "Based on your trading patterns, I'd recommend focusing on your winning strategies during the first hour of market open.",
      "Your portfolio shows strong momentum in tech stocks. Consider taking partial profits on positions with 15%+ gains.",
      "I notice you have better success rates with medium-sized positions. Consider adjusting your position sizing strategy.",
      "The current market volatility suggests implementing tighter stop-losses on new positions.",
      "Your win rate has improved significantly. Keep following your current risk management rules."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-100 text-green-800';
      case 'negative': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Brain className="h-8 w-8 text-blue-600" />
              AI Trading Assistant
            </h1>
            <p className="text-gray-600 mt-2">AI-powered analysis, insights, and market intelligence</p>
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            AI Settings
          </Button>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('analysis')}
            className={`flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === 'analysis' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <TrendingUp className="h-4 w-4" />
            AI Analysis
          </button>
          <button
            onClick={() => setActiveTab('patterns')}
            className={`flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === 'patterns' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Activity className="h-4 w-4" />
            Patterns
          </button>
          <button
            onClick={() => setActiveTab('market')}
            className={`flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === 'market' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            Market
          </button>
          <button
            onClick={() => setActiveTab('risk')}
            className={`flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === 'risk' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Shield className="h-4 w-4" />
            Risk
          </button>
          <button
            onClick={() => setActiveTab('news')}
            className={`flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === 'news' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Newspaper className="h-4 w-4" />
            News
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === 'chat' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <MessageSquare className="h-4 w-4" />
            AI Chat
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'analysis' && <AITradeAnalysis />}

        {activeTab === 'patterns' && <PatternRecognition />}

        {activeTab === 'market' && <MarketDataDashboard />}

        {activeTab === 'risk' && <RiskManagement />}

        {activeTab === 'news' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-blue-500" />
                  Market News & Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {marketNews.map((news) => (
                    <div key={news.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 flex-1">{news.title}</h3>
                        <div className="flex items-center gap-2 ml-4">
                          <Badge className={getSentimentColor(news.sentiment)}>
                            {news.sentiment}
                          </Badge>
                          <Badge className={getImpactColor(news.impact)}>
                            {news.impact} impact
                          </Badge>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-3">{news.summary}</p>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center gap-4">
                          <span>{news.source}</span>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {news.publishedAt}
                          </div>
                        </div>
                        <div className="flex gap-1">
                          {news.relevantSymbols.map(symbol => (
                            <Badge key={symbol} variant="outline" className="text-xs">
                              {symbol}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-green-500" />
                  AI Trading Assistant
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="min-h-96 max-h-96 overflow-y-auto space-y-4 mb-4 p-4 border rounded-lg bg-gray-50">
                  {chatMessages.map((message) => (
                    <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.sender === 'user' 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-white text-gray-900 border'
                      }`}>
                        <p className="text-sm">{message.message}</p>
                        <p className="text-xs mt-1 opacity-70">
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex gap-2">
                  <Input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask me about your trades, strategies, or market analysis..."
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <Button onClick={handleSendMessage}>Send</Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Questions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    "Analyze my recent performance",
                    "What are my best trading patterns?",
                    "Should I diversify my portfolio?",
                    "How can I improve my win rate?",
                    "What's my risk exposure?",
                    "Suggest position sizing for AAPL"
                  ].map((question) => (
                    <Button
                      key={question}
                      variant="outline"
                      className="justify-start h-auto py-3 px-4 text-left"
                      onClick={() => setChatInput(question)}
                    >
                      <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                      {question}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
