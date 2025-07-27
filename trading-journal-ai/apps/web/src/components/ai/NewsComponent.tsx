'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/lib/i18n/LanguageProvider';
import { api } from '@/lib/api';
import { 
  Newspaper, 
  TrendingUp, 
  Search, 
  ExternalLink, 
  RefreshCw,
  Filter,
  Calendar,
  Globe,
  AlertCircle,
  Clock
} from 'lucide-react';

interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  url: string;
  imageUrl?: string;
  publishedAt: string;
  source: string;
  category: 'stock' | 'crypto' | 'forex' | 'general';
  tickers?: string[];
  sentiment?: 'positive' | 'negative' | 'neutral';
  relevanceScore?: number;
}

export default function NewsComponent() {
  const { t, loading: languageLoading } = useLanguage();
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  // Defensive check for translations
  const translations = (t as any)?.ai?.news;
  
  // Only show loading if translations are not available
  if (!translations) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Newspaper className="h-12 w-12 text-blue-500 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Đang tải bản dịch...</p>
        </div>
      </div>
    );
  }

  useEffect(() => {
    fetchNews();
  }, [selectedCategory]);

  const fetchNews = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const endpoint = selectedCategory === 'all' 
        ? '/news' 
        : `/news/category/${selectedCategory}`;
      
      const data = await api.get(endpoint);
      
      if (data.success) {
        setNews(data.data);
        setLastUpdate(new Date());
      } else {
        throw new Error(data.message || 'Failed to load news');
      }
    } catch (err) {
      console.error('News fetch error:', err);
      setError(err instanceof Error ? err.message : 'Không thể tải tin tức');
      // Fallback with mock data for development
      // setNews(getMockNews());
      setNews([]); // Force empty to see actual API response
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchNews();
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await api.get(`/news/search?q=${encodeURIComponent(searchQuery)}`);
      
      if (data.success) {
        setNews(data.data);
        setLastUpdate(new Date());
      } else {
        throw new Error(data.message || 'Failed to search news');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tìm kiếm tin tức');
    } finally {
      setLoading(false);
    }
  };

  const getMockNews = (): NewsArticle[] => [
    {
      id: '1',
      title: 'Tech Stocks Rally on Positive Earnings Reports',
      summary: 'Major technology companies reported stronger than expected earnings, driving sector-wide gains.',
      url: 'https://example.com/news/1',
      imageUrl: 'https://via.placeholder.com/400x200',
      publishedAt: new Date().toISOString(),
      source: 'MarketWatch',
      category: 'stock',
      tickers: ['AAPL', 'MSFT', 'GOOGL'],
      sentiment: 'positive',
      relevanceScore: 0.9
    },
    {
      id: '2',
      title: 'Cryptocurrency Market Shows Signs of Recovery',
      summary: 'Bitcoin and major altcoins see significant gains as institutional adoption continues.',
      url: 'https://example.com/news/2',
      imageUrl: 'https://via.placeholder.com/400x200',
      publishedAt: new Date(Date.now() - 3600000).toISOString(),
      source: 'CoinDesk',
      category: 'crypto',
      tickers: ['BTC', 'ETH'],
      sentiment: 'positive',
      relevanceScore: 0.8
    },
    {
      id: '3',
      title: 'Federal Reserve Signals Potential Rate Changes',
      summary: 'Fed officials hint at upcoming monetary policy adjustments in latest statements.',
      url: 'https://example.com/news/3',
      imageUrl: 'https://via.placeholder.com/400x200',
      publishedAt: new Date(Date.now() - 7200000).toISOString(),
      source: 'Reuters',
      category: 'forex',
      tickers: ['USD', 'EUR'],
      sentiment: 'neutral',
      relevanceScore: 0.7
    }
  ];

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Vừa xong';
    if (diffInHours === 1) return '1 giờ trước';
    if (diffInHours < 24) return `${diffInHours} giờ trước`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return '1 ngày trước';
    return `${diffInDays} ngày trước`;
  };

  const getSentimentColor = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600 bg-green-50 border-green-200';
      case 'negative': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'stock': return 'bg-blue-100 text-blue-800';
      case 'crypto': return 'bg-purple-100 text-purple-800';
      case 'forex': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const categories = [
    { value: 'all', label: translations.categories.all },
    { value: 'stock', label: translations.categories.stock },
    { value: 'crypto', label: translations.categories.crypto },
    { value: 'forex', label: translations.categories.forex },
    { value: 'general', label: translations.categories.general }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Newspaper className="h-6 w-6 text-blue-600" />
            {translations.title}
          </h2>
          <p className="text-gray-600 mt-1">{translations.subtitle}</p>
        </div>
        <div className="flex items-center gap-4">
          {lastUpdate && (
            <p className="text-sm text-gray-500">
              {translations.lastUpdate} {lastUpdate.toLocaleTimeString()}
            </p>
          )}
          <Button 
            onClick={fetchNews} 
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            {translations.refreshButton}
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 flex gap-2">
              <Input
                placeholder={translations.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="flex-1"
              />
              <Button onClick={handleSearch} disabled={loading}>
                <Search className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex gap-2">
              <Filter className="h-5 w-5 text-gray-500 mt-2" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error State */}
      {error && (
        <div className="p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 mr-3" />
            <div>
              <p className="text-sm font-medium text-red-800">
                {translations.error.title}
              </p>
              <p className="text-sm text-red-700 mt-1">
                {error}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Newspaper className="h-12 w-12 text-blue-500 animate-pulse mx-auto mb-4" />
            <p className="text-gray-600">{translations.loading}</p>
          </div>
        </div>
      ) : (
        /* News List */
        <div className="space-y-4">
          {news.map((article) => (
            <Card key={article.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex gap-4">
                  {/* Article Image */}
                  {article.imageUrl && (
                    <div className="hidden sm:block w-32 h-24 flex-shrink-0">
                      <img
                        src={article.imageUrl}
                        alt={article.title}
                        className="w-full h-full object-cover rounded-lg"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  
                  {/* Article Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                          {article.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {article.summary}
                        </p>
                        
                        {/* Article Meta */}
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Globe className="h-4 w-4" />
                            <span>{article.source}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{formatTimeAgo(article.publishedAt)}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Article Actions */}
                      <div className="flex flex-col gap-2 items-end">
                        <a
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                        >
                          <ExternalLink className="h-4 w-4" />
                          <span className="text-sm">{translations.readMore}</span>
                        </a>
                      </div>
                    </div>
                    
                    {/* Tags and Badges */}
                    <div className="flex items-center gap-2 mt-4">
                      <Badge className={getCategoryColor(article.category)}>
                        {translations.categories[article.category]}
                      </Badge>
                      
                      {article.sentiment && (
                        <Badge className={getSentimentColor(article.sentiment)}>
                          {translations.sentiment[article.sentiment]}
                        </Badge>
                      )}
                      
                      {article.tickers && article.tickers.length > 0 && (
                        <div className="flex gap-1">
                          {article.tickers.slice(0, 3).map((ticker) => (
                            <Badge key={ticker} variant="outline" className="text-xs">
                              {ticker}
                            </Badge>
                          ))}
                          {article.tickers.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{article.tickers.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && news.length === 0 && !error && (
        <div className="text-center py-12">
          <Newspaper className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {translations.emptyState.title}
          </h3>
          <p className="text-gray-600">
            {translations.emptyState.description}
          </p>
        </div>
      )}
    </div>
  );
}
