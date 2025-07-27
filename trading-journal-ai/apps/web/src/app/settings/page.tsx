'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navigation from '@/components/Navigation';
import LanguageSettings from '@/components/settings/LanguageSettings';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Settings,
  User,
  Bell,
  Shield,
  Database,
  Palette,
  Globe,
  Smartphone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Check,
  AlertTriangle,
  Key
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/lib/i18n/LanguageProvider';
import { api } from '@/lib/api';

interface UserSettings {
  profile: {
    displayName: string;
    email: string;
    phone: string;
    timezone: string;
    language: string;
  };
  notifications: {
    email: boolean;
    push: boolean;
    trades: boolean;
    analysis: boolean;
    alerts: boolean;
  };
  privacy: {
    profileVisible: boolean;
    dataSharing: boolean;
    analytics: boolean;
  };
  trading: {
    defaultRiskPercent: number;
    autoStopLoss: boolean;
    alertThreshold: number;
    currency: string;
  };
  api: {
    alphaVantageApiKey: string;
    newsApiKey: string;
    polygonApiKey: string;
  };
}

function SettingsContent() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'security' | 'trading' | 'api' | 'data' | 'language'>('profile');
  const [settings, setSettings] = useState<UserSettings>({
    profile: {
      displayName: '',
      email: user?.email || '',
      phone: '',
      timezone: 'America/New_York',
      language: 'en'
    },
    notifications: {
      email: true,
      push: false,
      trades: true,
      analysis: true,
      alerts: true
    },
    privacy: {
      profileVisible: false,
      dataSharing: false,
      analytics: true
    },
    trading: {
      defaultRiskPercent: 2,
      autoStopLoss: false,
      alertThreshold: 5,
      currency: 'USD'
    },
    api: {
      alphaVantageApiKey: '',
      newsApiKey: '',
      polygonApiKey: ''
    }
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showApiKeys, setShowApiKeys] = useState({
    alphaVantage: false,
    newsApi: false,
    polygon: false
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Check URL query parameter for tab
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['profile', 'notifications', 'security', 'trading', 'api', 'data', 'language'].includes(tab)) {
      setActiveTab(tab as 'profile' | 'notifications' | 'security' | 'trading' | 'api' | 'data' | 'language');
    }
  }, [searchParams]);

  // Load API keys on component mount
  useEffect(() => {
    const loadApiKeys = async () => {
      try {
        const response = await api.get('/user/api-keys');
        
        if (response.success) {
          console.log('API status loaded:', response.data);
          // Show that keys are configured (but don't expose actual values)
          setSettings(prev => ({
            ...prev,
            api: {
              alphaVantageApiKey: response.data.hasAlphaVantage ? '••••••••••••••••' : '',
              newsApiKey: response.data.hasNewsApi ? '••••••••••••••••' : '',
              polygonApiKey: response.data.hasPolygon ? '••••••••••••••••' : ''
            }
          }));
        }
      } catch (error) {
        console.error('Error loading API status:', error);
      }
    };

    loadApiKeys();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    
    try {
      // Save API configuration to backend
      if (settings.api.alphaVantageApiKey || settings.api.newsApiKey || settings.api.polygonApiKey) {
        // Only send keys that are not placeholder values
        const apiKeysToSave: any = {};
        
        if (settings.api.alphaVantageApiKey && !settings.api.alphaVantageApiKey.includes('••••')) {
          apiKeysToSave.alphaVantageApiKey = settings.api.alphaVantageApiKey;
        }
        if (settings.api.newsApiKey && !settings.api.newsApiKey.includes('••••')) {
          apiKeysToSave.newsApiKey = settings.api.newsApiKey;
        }
        if (settings.api.polygonApiKey && !settings.api.polygonApiKey.includes('••••')) {
          apiKeysToSave.polygonApiKey = settings.api.polygonApiKey;
        }

        if (Object.keys(apiKeysToSave).length > 0) {
          const result = await api.post('/user/api-keys', apiKeysToSave);
          
          if (!result.success) {
            throw new Error(result.message || 'Failed to save API configuration');
          }

          console.log('API keys saved successfully:', result);
        }
      }

      // Save other settings (simulate API call for now)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      // Show error message here if needed
    } finally {
      setSaving(false);
    }
  };

  const updateSettings = (section: keyof UserSettings, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Please log in to access settings.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Settings className="h-8 w-8 text-blue-600" />
              Settings
            </h1>
            <p className="text-gray-600 mt-2">Manage your account and application preferences</p>
          </div>
          <div className="flex items-center gap-3">
            {saved && (
              <div className="flex items-center gap-2 text-green-600 text-sm">
                <Check className="h-4 w-4" />
                Settings saved!
              </div>
            )}
            <Button 
              onClick={handleSave} 
              disabled={saving}
              className="flex items-center gap-2"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-4">
                <nav className="space-y-2">
                  {[
                    { id: 'profile', label: t.settings.profile, icon: User },
                    { id: 'language', label: t.settings.language, icon: Globe },
                    { id: 'notifications', label: t.settings.notifications, icon: Bell },
                    { id: 'security', label: t.settings.security, icon: Shield },
                    { id: 'trading', label: 'Trading', icon: Settings },
                    { id: 'api', label: 'API Settings', icon: Key },
                    { id: 'data', label: 'Data & Privacy', icon: Database }
                  ].map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-left transition-colors ${
                          activeTab === tab.id 
                            ? 'bg-blue-100 text-blue-700 font-medium' 
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        {tab.label}
                      </button>
                    );
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-3">
            {activeTab === 'profile' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Profile Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Display Name
                      </label>
                      <Input
                        value={settings.profile.displayName}
                        onChange={(e) => updateSettings('profile', 'displayName', e.target.value)}
                        placeholder="Your display name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <Input
                        value={settings.profile.email}
                        onChange={(e) => updateSettings('profile', 'email', e.target.value)}
                        type="email"
                        disabled
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <Input
                        value={settings.profile.phone}
                        onChange={(e) => updateSettings('profile', 'phone', e.target.value)}
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Language
                      </label>
                      <select
                        value={settings.profile.language}
                        onChange={(e) => updateSettings('profile', 'language', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="en">English</option>
                        <option value="vi">Tiếng Việt</option>
                        <option value="en-vi">English - Việt</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Timezone
                      </label>
                      <select
                        value={settings.profile.timezone}
                        onChange={(e) => updateSettings('profile', 'timezone', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="America/New_York">Eastern Time (ET)</option>
                        <option value="America/Chicago">Central Time (CT)</option>
                        <option value="America/Denver">Mountain Time (MT)</option>
                        <option value="America/Los_Angeles">Pacific Time (PT)</option>
                        <option value="Asia/Ho_Chi_Minh">Indochina Time (ICT)</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'language' && (
              <LanguageSettings />
            )}

            {activeTab === 'notifications' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notification Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    {[
                      { key: 'email', label: 'Email Notifications', description: 'Receive notifications via email' },
                      { key: 'push', label: 'Push Notifications', description: 'Browser push notifications' },
                      { key: 'trades', label: 'Trade Updates', description: 'Notifications for trade executions' },
                      { key: 'analysis', label: 'AI Analysis', description: 'New insights and analysis reports' },
                      { key: 'alerts', label: 'Price Alerts', description: 'Stock price and market alerts' }
                    ].map((notification) => (
                      <div key={notification.key} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{notification.label}</h4>
                          <p className="text-sm text-gray-600">{notification.description}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.notifications[notification.key as keyof typeof settings.notifications]}
                            onChange={(e) => updateSettings('notifications', notification.key, e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'security' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Security Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-yellow-800">Security Notice</h4>
                        <p className="text-sm text-yellow-700 mt-1">
                          Your account is secured with Firebase Authentication. For password changes, please use the password reset feature.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Two-Factor Authentication</h4>
                      <p className="text-sm text-gray-600 mb-3">
                        Add an extra layer of security to your account
                      </p>
                      <Button variant="outline">Setup 2FA</Button>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Active Sessions</h4>
                      <p className="text-sm text-gray-600 mb-3">
                        Manage your active login sessions
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Current session</span>
                          <Badge className="bg-green-100 text-green-800">Active</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'trading' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Trading Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Default Risk Per Trade (%)
                      </label>
                      <Input
                        type="number"
                        value={settings.trading.defaultRiskPercent}
                        onChange={(e) => updateSettings('trading', 'defaultRiskPercent', Number(e.target.value))}
                        step="0.1"
                        min="0.1"
                        max="10"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Alert Threshold (%)
                      </label>
                      <Input
                        type="number"
                        value={settings.trading.alertThreshold}
                        onChange={(e) => updateSettings('trading', 'alertThreshold', Number(e.target.value))}
                        step="0.5"
                        min="1"
                        max="20"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Base Currency
                      </label>
                      <select
                        value={settings.trading.currency}
                        onChange={(e) => updateSettings('trading', 'currency', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="USD">USD - US Dollar</option>
                        <option value="EUR">EUR - Euro</option>
                        <option value="GBP">GBP - British Pound</option>
                        <option value="JPY">JPY - Japanese Yen</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Auto Stop Loss</h4>
                        <p className="text-sm text-gray-600">Automatically set stop loss based on risk percentage</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.trading.autoStopLoss}
                          onChange={(e) => updateSettings('trading', 'autoStopLoss', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'api' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="h-5 w-5" />
                    API Settings
                  </CardTitle>
                  <p className="text-gray-600 text-sm">
                    Configure API keys for market data and news sources
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Alpha Vantage */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">Alpha Vantage</h4>
                        <p className="text-sm text-gray-600">News & sentiment analysis, 25 requests/day free</p>
                      </div>
                      <a
                        href="https://www.alphavantage.co/support/#api-key"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                      >
                        Get API Key
                        <Database className="h-3 w-3" />
                      </a>
                    </div>
                    <div className="relative">
                      <Input
                        type={showApiKeys.alphaVantage ? 'text' : 'password'}
                        value={settings.api.alphaVantageApiKey}
                        onChange={(e) => updateSettings('api', 'alphaVantageApiKey', e.target.value)}
                        placeholder="Enter your Alpha Vantage API key..."
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowApiKeys(prev => ({ ...prev, alphaVantage: !prev.alphaVantage }))}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showApiKeys.alphaVantage ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {['News & Sentiment', 'Stocks & Crypto', 'Real-time data'].map((feature) => (
                        <Badge key={feature} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* NewsAPI */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">NewsAPI</h4>
                        <p className="text-sm text-gray-600">Financial news from Bloomberg, Reuters, CNBC, 1,000 requests/day free</p>
                      </div>
                      <a
                        href="https://newsapi.org/register"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                      >
                        Get API Key
                        <Database className="h-3 w-3" />
                      </a>
                    </div>
                    <div className="relative">
                      <Input
                        type={showApiKeys.newsApi ? 'text' : 'password'}
                        value={settings.api.newsApiKey}
                        onChange={(e) => updateSettings('api', 'newsApiKey', e.target.value)}
                        placeholder="Enter your NewsAPI key..."
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowApiKeys(prev => ({ ...prev, newsApi: !prev.newsApi }))}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showApiKeys.newsApi ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {['70,000+ sources', 'Advanced search', 'Time filtering'].map((feature) => (
                        <Badge key={feature} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Polygon.io */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">Polygon.io</h4>
                        <p className="text-sm text-gray-600">Market data and news from exchanges, 5 calls/min free</p>
                      </div>
                      <a
                        href="https://polygon.io/dashboard/signup"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                      >
                        Get API Key
                        <Database className="h-3 w-3" />
                      </a>
                    </div>
                    <div className="relative">
                      <Input
                        type={showApiKeys.polygon ? 'text' : 'password'}
                        value={settings.api.polygonApiKey}
                        onChange={(e) => updateSettings('api', 'polygonApiKey', e.target.value)}
                        placeholder="Enter your Polygon.io API key..."
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowApiKeys(prev => ({ ...prev, polygon: !prev.polygon }))}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showApiKeys.polygon ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {['Options & Futures', 'Real-time data', 'Sentiment analysis'].map((feature) => (
                        <Badge key={feature} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Help Section */}
                  <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
                    <div className="flex items-start">
                      <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-yellow-800">
                          How to get API keys:
                        </p>
                        <ol className="text-sm text-yellow-700 mt-1 space-y-1">
                          <li>1. Click "Get API Key" links above</li>
                          <li>2. Register for free accounts</li>
                          <li>3. Copy API keys from dashboards</li>
                          <li>4. Paste them here and save</li>
                        </ol>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'data' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Data & Privacy
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    {[
                      { 
                        key: 'profileVisible', 
                        label: 'Profile Visibility', 
                        description: 'Make your profile visible to other users' 
                      },
                      { 
                        key: 'dataSharing', 
                        label: 'Anonymous Data Sharing', 
                        description: 'Help improve our service by sharing anonymous usage data' 
                      },
                      { 
                        key: 'analytics', 
                        label: 'Analytics Tracking', 
                        description: 'Allow analytics tracking for better user experience' 
                      }
                    ].map((privacy) => (
                      <div key={privacy.key} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{privacy.label}</h4>
                          <p className="text-sm text-gray-600">{privacy.description}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.privacy[privacy.key as keyof typeof settings.privacy]}
                            onChange={(e) => updateSettings('privacy', privacy.key, e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h4 className="font-medium text-red-800 mb-2">Data Export & Deletion</h4>
                    <p className="text-sm text-red-700 mb-4">
                      You can export your data or delete your account at any time.
                    </p>
                    <div className="flex gap-3">
                      <Button variant="outline" size="sm">Export Data</Button>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SettingsContent />
    </Suspense>
  );
}
