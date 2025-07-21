export const APP_NAME = 'Trading Journal AI';
export const APP_VERSION = '1.0.0';
export const APP_DESCRIPTION = 'Professional trading journal with AI-powered insights';

export const ROUTES = {
  // Public
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  PRICING: '/pricing',
  
  // Auth required
  DASHBOARD: '/dashboard',
  TRADES: '/trades',
  TRADES_NEW: '/trades/new',
  TRADES_EDIT: '/trades/:id/edit',
  ANALYTICS: '/analytics',
  ACCOUNTS: '/accounts',
  STRATEGIES: '/strategies',
  SETTINGS: '/settings',
  PROFILE: '/profile',
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    PROFILE: '/auth/profile',
  },
  TRADES: {
    LIST: '/trades',
    CREATE: '/trades',
    GET: '/trades/:id',
    UPDATE: '/trades/:id',
    DELETE: '/trades/:id',
    STATS: '/trades/stats',
  },
  ACCOUNTS: {
    LIST: '/accounts',
    CREATE: '/accounts',
    GET: '/accounts/:id',
    UPDATE: '/accounts/:id',
    DELETE: '/accounts/:id',
    SYNC: '/accounts/:id/sync',
  },
  ANALYTICS: {
    OVERVIEW: '/analytics/overview',
    PERFORMANCE: '/analytics/performance',
    ASSETS: '/analytics/assets',
    STRATEGIES: '/analytics/strategies',
  },
};

export const PLANS = {
  FREE: {
    id: 'free',
    name: 'Free',
    price: 0,
    features: {
      maxTradesPerMonth: 50,
      maxAccounts: 1,
      canExportReports: false,
      canAutoSync: false,
      hasAIFeatures: false,
      hasAdvancedAnalytics: false,
      hasCustomStrategies: false,
      hasAPIAccess: false,
      dataRetentionDays: 30,
    },
  },
  PRO: {
    id: 'pro',
    name: 'Pro',
    price: 29,
    features: {
      maxTradesPerMonth: 500,
      maxAccounts: 5,
      canExportReports: true,
      canAutoSync: true,
      hasAIFeatures: true,
      hasAdvancedAnalytics: true,
      hasCustomStrategies: true,
      hasAPIAccess: false,
      dataRetentionDays: 365,
    },
  },
  PREMIUM: {
    id: 'premium',
    name: 'Premium',
    price: 99,
    features: {
      maxTradesPerMonth: -1, // Unlimited
      maxAccounts: -1, // Unlimited
      canExportReports: true,
      canAutoSync: true,
      hasAIFeatures: true,
      hasAdvancedAnalytics: true,
      hasCustomStrategies: true,
      hasAPIAccess: true,
      dataRetentionDays: -1, // Unlimited
    },
  },
};