// src/types/index.ts

export interface User {
  userId: string;
  username: string;        // ✅ NEW: Username
  displayName: string;     // ✅ NEW: Display name
  zkHash: string;
  verified: boolean;
  country?: string;
  currency?: string;
  secretAddress?: string;  // ✅ NEW: Secret Network wallet address
}

export interface Identity {
  zkHash: string;
  userId: string;
  username: string;        // ✅ NEW: Username
  displayName?: string;    // ✅ NEW: Display name
  verified: boolean;
  metadata: {
    country: string;
    currency: string;
    secretAddress?: string; // ✅ NEW: Secret wallet
    verified?: boolean;
  };
  createdAt: string;
}

// ✅ NEW: User profile (public view)
export interface UserProfile {
  username: string;
  displayName: string;
  avatar?: string;
  bio?: string;
  country: string;
  verified: boolean;
  createdAt: string;
}

// ✅ NEW: User search result
export interface UserSearchResult {
  username: string;
  displayName: string;
  avatar?: string;
  verified: boolean;
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
  from: string;             // ✅ UPDATED: Can be @username or zkHash
  to: string;               // ✅ UPDATED: Can be @username or zkHash
  amount: number;
  status: string;
  railType?: string;
  displayName?: string;
  cost?: number;
  receivedAmount?: number;
  instant?: boolean;
  features?: any;
  createdAt: string;
  completedAt?: string;
  updatedAt?: string;
  duration?: number;
}

// ✅ FIXED: RouteOption with optional fields
export interface RouteOption {
  type: 'CHANNEL' | 'STABLECOIN' | 'TRADITIONAL';
  cost?: number;
  estimatedCost?: number;
  estimatedTime?: number;
  description?: string;
  reliability?: number;
  privacy?: boolean;
  recommended?: boolean;
  metadata?: any;
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

// ✅ NEW: Create user request
export interface CreateUserRequest {
  userId: string;
  username: string;
  displayName?: string;
  password: string;
  sortCode: string;
  accountNumber: string;
  bankName: string;
  publicKey: string;
  country?: string;
}

// ✅ NEW: Auth response
export interface AuthResponse {
  token: string;
  user: User;
  zkHash: string;
  username: string;
  displayName: string;
  secretAddress: string;
  message: string;
}