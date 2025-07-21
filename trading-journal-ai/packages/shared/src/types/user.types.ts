export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  planId: string;
  settings?: UserSettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  defaultCurrency: string;
  defaultTimezone: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  alertSettings: AlertSettings;
}

export interface AlertSettings {
  priceAlerts: boolean;
  tradeAlerts: boolean;
  performanceAlerts: boolean;
  dailySummary: boolean;
  weeklySummary: boolean;
}

export interface Plan {
  id: string;
  name: 'free' | 'pro' | 'premium';
  displayName: string;
  price: number;
  currency: string;
  features: PlanFeatures;
}

export interface PlanFeatures {
  maxTradesPerMonth: number;
  maxAccounts: number;
  canExportReports: boolean;
  canAutoSync: boolean;
  hasAIFeatures: boolean;
  hasAdvancedAnalytics: boolean;
  hasCustomStrategies: boolean;
  hasAPIAccess: boolean;
  dataRetentionDays: number;
}