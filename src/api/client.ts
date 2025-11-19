import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (data: { email: string; password: string }) => 
    api.post('/api/identity/login', { 
      userId: data.email, 
      password: data.password 
    }),
};

// Identity API
export const identityAPI = {
  create: (data: {
    userId: string;
    username: string;
    displayName?: string;
    password: string;
    sortCode: string;
    accountNumber: string;
    bankName: string;
    publicKey: string;
    country?: string;
  }) => api.post('/api/identity/create', data),

  get: (zkHash: string) => api.get(`/api/identity/${zkHash}`),
  
  verify: (zkHash: string) => api.post('/api/identity/verify', { zkHash }),

  checkUsername: (username: string) => 
    api.get(`/api/identity/username/${username}/available`),

  searchUsers: (query: string, limit: number = 10) => 
    api.get('/api/identity/search', { params: { q: query, limit } }),

  getUserProfile: (username: string) => 
    api.get(`/api/identity/profile/${username}`),
};

// Payment API
export const paymentAPI = {
  send: (data: {
    from: string;
    to: string;
    amount: number;
    preferences?: any;
  }) => api.post('/api/payments/send', data),

  getTransfer: (transferId: string) => api.get(`/api/payments/${transferId}`),
  
  getHistory: (params?: { limit?: number; offset?: number }) =>
    api.get('/api/payments/history', { params }),
  
  estimateRoutes: (data: { from: string; to: string; amount: number }) =>
    api.post('/api/payments/estimate', data),
};

// Channel API
export const channelAPI = {
  open: (data: { with: string; myDeposit: number; theirDeposit: number }) =>
    api.post('/api/channels/open', data),
  
  getAll: (status?: string) =>
    api.get('/api/channels/', { params: status ? { status } : {} }),
  
  get: (channelId: string) => api.get(`/api/channels/${channelId}`),
  
  close: (channelId: string) => api.post(`/api/channels/${channelId}/close`),
};

// ✅ NEW: Split Bills API
export const splitBillsAPI = {
  create: (data: {
    title: string;
    totalAmount: number;
    participants: Array<{
      username: string;
      customAmount?: number;
    }>;
    description?: string;
  }) => api.post('/api/splitbills', data),

  getAll: (status?: 'pending' | 'completed' | 'cancelled') =>
    api.get('/api/splitbills', { params: status ? { status } : {} }),

  get: (billId: string) => api.get(`/api/splitbills/${billId}`),

  pay: (billId: string) => api.post(`/api/splitbills/${billId}/pay`),

  cancel: (billId: string) => api.delete(`/api/splitbills/${billId}`),

  getStats: () => api.get('/api/splitbills/stats'),
};

// ✅ NEW: Pots API
export const potsAPI = {
  create: (data: {
    name: string;
    targetAmount: number;
    deadline?: string;
    emoji?: string;
    color?: string;
  }) => api.post('/api/pots', data),

  getAll: (includeCompleted?: boolean) =>
    api.get('/api/pots', { params: { includeCompleted } }),

  get: (potId: string) => api.get(`/api/pots/${potId}`),

  deposit: (potId: string, amount: number, note?: string) =>
    api.post(`/api/pots/${potId}/deposit`, { amount, note }),

  withdraw: (potId: string, amount: number, note?: string) =>
    api.post(`/api/pots/${potId}/withdraw`, { amount, note }),

  update: (potId: string, data: {
    name?: string;
    targetAmount?: number;
    deadline?: string;
    emoji?: string;
    color?: string;
  }) => api.patch(`/api/pots/${potId}`, data),

  delete: (potId: string, withdrawFunds?: boolean) =>
    api.delete(`/api/pots/${potId}`, { 
      params: { withdrawFunds } 
    }),

  getStats: () => api.get('/api/pots/stats'),
};

// ✅ NEW: Analytics API
export const analyticsAPI = {
  getSpendingByCategory: (params?: {
    startDate?: string;
    endDate?: string;
  }) => api.get('/api/analytics/spending-by-category', { params }),

  getTrends: (params?: {
    period?: 'daily' | 'weekly' | 'monthly';
    limit?: number;
  }) => api.get('/api/analytics/trends', { params }),

  getTopRecipients: (limit?: number) =>
    api.get('/api/analytics/top-recipients', { params: { limit } }),

  getBudget: (monthlyBudget: number) =>
    api.get('/api/analytics/budget', { params: { monthlyBudget } }),

  getFinancialHealth: () =>
    api.get('/api/analytics/financial-health'),

  getComparison: () =>
    api.get('/api/analytics/comparison'),
};

export default api;