export interface User {
  userId: string;
  zkHash: string;
  verified: boolean;
}

export interface Identity {
  zkHash: string;
  userId: string;
  verified: boolean;
  metadata: {
    country: string;
    currency: string;
  };
  createdAt: string;
}

export interface Channel {
  channelId: string;
  participants: string[];
  balances: Record<string, number>;
  status: 'OPEN' | 'SETTLING' | 'CLOSED';
  totalTransfers: number;
  createdAt: string;
  lastUpdated: string;
}

export interface Transfer {
  transferId: string;
  from: string;
  to: string;
  amount: number;
  state: string;
  createdAt: string;
  completedAt?: string;
  duration?: number;
}

export interface RouteOption {
  type: 'CHANNEL' | 'STABLECOIN' | 'TRADITIONAL';
  estimatedCost: number;
  estimatedTime: number;
  reliability: number;
  privacy: boolean;
  recommended: boolean;
}

export interface TransferResult {
  transferId: string;
  status: string;
  railType: string;
  displayName: string;
  instant: boolean;
  sentAmount: number;
  receivedAmount: number;
  cost: number;
  metadata?: any;
}
