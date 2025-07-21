export const Collections = {
  USERS: 'users',
  TRADES: 'trades',
  ACCOUNTS: 'accounts',
  STRATEGIES: 'strategies',
  MARKET_FLOWS: 'marketFlows',
  AI_INSIGHTS: 'aiInsights',
  PLANS: 'plans',
  TAGS: 'tags',
  NOTES: 'notes',
  EXCHANGE_API_KEYS: 'exchangeApiKeys',
  ALERTS: 'alerts',
  USER_SETTINGS: 'userSettings',
} as const;

export type CollectionName = typeof Collections[keyof typeof Collections];