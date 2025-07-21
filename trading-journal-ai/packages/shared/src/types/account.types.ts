export interface Account {
  id: string;
  userId: string;
  name: string;
  brokerName: string;
  accountNumber?: string;
  accountType: 'real' | 'demo' | 'paper';
  currency: string;
  initialBalance: number;
  currentBalance: number;
  isActive: boolean;
  apiConnection?: ApiConnection;
  lastSyncedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiConnection {
  exchangeName: string;
  apiKeyId: string;
  isConnected: boolean;
  permissions: string[];
  lastError?: string;
  lastSuccessfulSync?: Date;
}

export interface ExchangeApiKey {
  id: string;
  userId: string;
  exchangeName: string;
  apiKey: string;
  apiSecret?: string; // Encrypted
  passphrase?: string; // For some exchanges
  ipWhitelist?: string[];
  permissions: string[];
  isActive: boolean;
  testMode: boolean;
  createdAt: Date;
  updatedAt: Date;
}