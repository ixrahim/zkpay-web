// src/types/index.ts

export interface User {
  userId: string;
  username: string;
  displayName: string;
  zkHash: string;
  verified: boolean;
  country?: string;
  currency?: string;
  secretAddress?: string;
}

export interface Identity {
  zkHash: string;
  userId: string;
  username: string;
  displayName?: string;
  verified: boolean;
  metadata: {
    country: string;
    currency: string;
    secretAddress?: string;
    verified?: boolean;
  };
  createdAt: string;
}

export interface UserProfile {
  username: string;
  displayName: string;
  avatar?: string;
  bio?: string;
  country: string;
  verified: boolean;
  createdAt: string;
}

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
  from: string;
  to: string;
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

export interface AuthResponse {
  token: string;
  user: User;
  zkHash: string;
  username: string;
  displayName: string;
  secretAddress: string;
  message: string;
}

// ✅ NEW: Split Bills Types
export interface SplitBill {
  id: string;
  creatorId: string;
  creatorZkHash: string;
  title: string;
  totalAmount: number;
  description?: string;
  status: 'pending' | 'completed' | 'cancelled';
  participants: SplitBillParticipant[];
  createdAt: string;
  completedAt?: string;
  cancelledAt?: string;
  updatedAt: string;
}

export interface SplitBillParticipant {
  userId: string;
  zkHash: string;
  username: string;
  amountOwed: number;
  status: 'pending' | 'paid';
  paidAt?: string;
  paymentId?: string;
}

export interface SplitBillStats {
  totalBills: number;
  pendingBills: number;
  completedBills: number;
  totalOwed: number;
  totalReceivable: number;
}

// ✅ NEW: Pots Types
export interface Pot {
  id: string;
  userId: string;
  zkHash: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
  emoji?: string;
  color?: string;
  status: 'active' | 'completed' | 'deleted';
  createdAt: string;
  completedAt?: string;
  updatedAt: string;
  progressPercentage?: number;
  daysRemaining?: number;
}

export interface PotTransaction {
  id: string;
  potId: string;
  type: 'deposit' | 'withdrawal';
  amount: number;
  note?: string;
  createdAt: string;
}

export interface PotStats {
  totalPots: number;
  activePots: number;
  completedPots: number;
  totalSaved: number;
  totalTargets: number;
}

// ✅ NEW: Analytics Types
export interface CategorySpending {
  category: string;
  totalSpent: number;
  transactionCount: number;
  averageAmount: number;
  percentage: number;
}

export interface SpendingTrend {
  period: string;
  transactionCount: number;
  totalSpent: number;
  totalReceived: number;
  netFlow: number;
}

export interface TopRecipient {
  zkHash: string;
  username: string;
  transactionCount: number;
  totalSent: number;
  lastTransaction: string;
}

export interface BudgetInsights {
  monthlyBudget: number;
  totalSpent: number;
  remaining: number;
  percentageUsed: number;
  transactionCount: number;
  averageTransaction: number;
  daysRemaining: number;
  suggestedDailyBudget: number;
  status: 'on_track' | 'warning' | 'over_budget';
}

export interface FinancialHealthScore {
  score: number;
  rating: 'excellent' | 'good' | 'fair' | 'needs_improvement';
  components: {
    totalSavings: number;
    avgMonthlySpending: number;
    savingsRatio: number;
  };
}

export interface SpendingComparison {
  thisMonth: {
    spent: number;
    transactions: number;
  };
  lastMonth: {
    spent: number;
    transactions: number;
  };
  difference: number;
  percentageChange: number;
  trend: 'increased' | 'decreased' | 'same';
}