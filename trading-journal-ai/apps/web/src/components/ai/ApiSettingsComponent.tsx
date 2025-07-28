'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/lib/i18n/LanguageProvider';
import { 
  Settings, 
  Key, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  ExternalLink,
  Save,
  Eye,
  EyeOff
} from 'lucide-react';

interface ApiStatus {
  alphaVantage: boolean;
  newsApi: boolean;
  polygon: boolean;
}

export default function ApiSettingsComponent() {
  const { t } = useLanguage();
  const [apiKeys, setApiKeys] = useState({
    alphaVantageApiKey: '',
    newsApiKey: '',
    polygonApiKey: ''
  });
  const [apiStatus, setApiStatus] = useState<ApiStatus>({
    alphaVantage: false,
    newsApi: false,
    polygon: false
  });
  const [loading, setLoading] = useState(false);
  const [showKeys, setShowKeys] = useState({
    alphaVantage: false,
    newsApi: false,
    polygon: false
  });
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Defensive check for translations
  const translations = (t as any)?.ai?.apiSettings;
  
  if (!translations) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Settings className="h-12 w-12 text-blue-500 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Đang tải bản dịch...</p>
        </div>
      </div>
    );
  }

  useEffect(() => {
    checkApiStatus();
  }, []);

  const checkApiStatus = async () => {
    try {
      const response = await fetch('/api/news/status', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setApiStatus(data.data);
        }
      }
    } catch (error) {
      console.error('Error checking API status:', error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/news/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(apiKeys)
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: translations.saveSuccess });
        await checkApiStatus();
      } else {
        setMessage({ type: 'error', text: data.message || translations.saveError });
      }
    } catch (error) {
      setMessage({ type: 'error', text: translations.saveError });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setApiKeys(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleShowKey = (field: 'alphaVantage' | 'newsApi' | 'polygon') => {
    setShowKeys(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const getStatusIcon = (status: boolean) => {
    return status ? (
      <CheckCircle className="h-5 w-5 text-green-500" />
    ) : (
      <XCircle className="h-5 w-5 text-red-500" />
    );
  };

  const getStatusBadge = (status: boolean) => {
    return (
      <Badge className={status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
        {status ? translations.status.connected : translations.status.disconnected}
      </Badge>
    );
  };

  const apiProviders = [
    {
      name: 'Alpha Vantage',
      description: translations.providers.alphaVantage.description,
      field: 'alphaVantageApiKey',
      status: apiStatus.alphaVantage,
      showKey: showKeys.alphaVantage,
      website: 'https://www.alphavantage.co/support/#api-key',
      features: translations.providers.alphaVantage.features
    },
    {
      name: 'NewsAPI',
      description: translations.providers.newsApi.description,
      field: 'newsApiKey',
      status: apiStatus.newsApi,
      showKey: showKeys.newsApi,
      website: 'https://newsapi.org/register',
      features: translations.providers.newsApi.features
    },
    {
      name: 'Polygon.io',
      description: translations.providers.polygon.description,
      field: 'polygonApiKey',
      status: apiStatus.polygon,
      showKey: showKeys.polygon,
      website: 'https://polygon.io/dashboard/signup',
      features: translations.providers.polygon.features
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Settings className="h-6 w-6 text-blue-600" />
            {translations.title}
          </h2>
          <p className="text-gray-600 mt-1">{translations.subtitle}</p>
        </div>
      </div>

      {/* Status Message */}
      {message && (
        <div className={`p-4 rounded-lg border-l-4 ${
          message.type === 'success' 
            ? 'bg-green-50 border-green-400' 
            : 'bg-red-50 border-red-400'
        }`}>
          <div className="flex items-start">
            {message.type === 'success' ? (
              <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 mr-3" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5 mr-3" />
            )}
            <p className={`text-sm font-medium ${
              message.type === 'success' ? 'text-green-800' : 'text-red-800'
            }`}>
              {message.text}
            </p>
          </div>
        </div>
      )}

      {/* API Providers */}
      <div className="grid gap-6">
        {apiProviders.map((provider) => (
          <Card key={provider.name}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-3">
                  <Key className="h-5 w-5 text-blue-500" />
                  {provider.name}
                  {getStatusIcon(provider.status)}
                  {getStatusBadge(provider.status)}
                </CardTitle>
                <a
                  href={provider.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                >
                  <ExternalLink className="h-4 w-4" />
                  {translations.getApiKey}
                </a>
              </div>
              <p className="text-gray-600 text-sm">{provider.description}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* API Key Input */}
              <div className="space-y-2">
                <Label htmlFor={provider.field}>{translations.apiKeyLabel}</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      id={provider.field}
                      type={provider.showKey ? 'text' : 'password'}
                      value={apiKeys[provider.field as keyof typeof apiKeys]}
                      onChange={(e) => handleInputChange(provider.field, e.target.value)}
                      placeholder={translations.apiKeyPlaceholder}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => toggleShowKey(provider.name.toLowerCase().replace(/[^a-z]/g, '') as any)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {provider.showKey ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  {translations.features}:
                </Label>
                <div className="flex flex-wrap gap-2">
                  {provider.features.map((feature: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button 
          onClick={handleSave} 
          disabled={loading}
          className="flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          {loading ? translations.saving : translations.saveButton}
        </Button>
      </div>

      {/* Help Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            {translations.help.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm text-gray-600 space-y-2">
            <p><strong>{translations.help.step1.title}:</strong> {translations.help.step1.description}</p>
            <p><strong>{translations.help.step2.title}:</strong> {translations.help.step2.description}</p>
            <p><strong>{translations.help.step3.title}:</strong> {translations.help.step3.description}</p>
            <p><strong>{translations.help.step4.title}:</strong> {translations.help.step4.description}</p>
          </div>
          
          <div className="p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
            <p className="text-sm text-yellow-800">
              <strong>{translations.help.note.title}:</strong> {translations.help.note.description}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
