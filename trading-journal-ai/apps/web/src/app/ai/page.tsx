'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import AITradeAnalysis from '@/components/ai/AITradeAnalysis';
import MarketDataDashboard from '@/components/ai/MarketDataDashboard';
import PatternRecognition from '@/components/ai/PatternRecognition';
import RiskManagement from '@/components/ai/RiskManagement';
import NewsComponent from '@/components/ai/NewsComponent';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/lib/i18n/LanguageProvider';
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
  const { t } = useLanguage();
  const router = useRouter();
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
      title: 'Energy Sector Shows Volatility',
      summary: 'Oil prices fluctuate amid global economic uncertainty and production changes.',
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
      message: t.ai.messages.initialMessage,
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
              {t.ai.title}
            </h1>
            <p className="text-gray-600 mt-2">{t.ai.subtitle}</p>
          </div>
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => router.push('/settings?tab=api')}
          >
            <Settings className="h-4 w-4" />
            {t.ai.aiSettings}
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
            {t.ai.analysis}
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
            {t.ai.patterns}
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
            {t.ai.market}
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
            {t.ai.risk}
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
            Tin tức
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
            {t.ai.chat}
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'analysis' && <AITradeAnalysis />}

        {activeTab === 'patterns' && <PatternRecognition />}

        {activeTab === 'market' && <MarketDataDashboard />}

        {activeTab === 'risk' && <RiskManagement />}

        {activeTab === 'news' && <NewsComponent />}

        {activeTab === 'chat' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-green-500" />
                  {t.ai.chat}
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
                    placeholder={t.ai.messages.placeholder}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <Button onClick={handleSendMessage}>{t.ai.messages.sendButton}</Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Questions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t.ai.quickQuestions}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    t.ai.analyzePerformance,
                    t.ai.bestPatterns,
                    t.ai.diversifyPortfolio,
                    t.ai.improveWinRate,
                    t.ai.riskExposure,
                    t.ai.positionSizing
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
