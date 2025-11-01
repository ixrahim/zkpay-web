import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

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

// ✅ FIXED: Auth API now uses /api/identity/login (your actual endpoint)
export const authAPI = {
  login: (data: { email: string; password: string }) => 
    api.post('/api/identity/login', { 
      userId: data.email, 
      password: data.password 
    }),
};

// ✅ Identity API
export const identityAPI = {
  create: (data: {
    userId: string;
    username: string;        // ✅ NEW: Username field
    displayName?: string;    // ✅ NEW: Display name (optional)
    password: string;
    sortCode: string;
    accountNumber: string;
    bankName: string;
    publicKey: string;
    country?: string;        // ✅ NEW: Country (optional)
  }) => api.post('/api/identity/create', data),

  get: (zkHash: string) => api.get(`/api/identity/${zkHash}`),
  
  verify: (zkHash: string) => api.post('/api/identity/verify', { zkHash }),

  // ✅ NEW: Check if username is available
  checkUsername: (username: string) => 
    api.get(`/api/identity/username/${username}/available`),

  // ✅ NEW: Search users by username (autocomplete)
  searchUsers: (query: string, limit: number = 10) => 
    api.get('/api/identity/search', { params: { q: query, limit } }),

  // ✅ NEW: Get user profile by username
  getUserProfile: (username: string) => 
    api.get(`/api/identity/profile/${username}`),
};

// ✅ Payment API
export const paymentAPI = {
  send: (data: {
    from: string;          // ✅ UPDATED: Can now be @username or zkHash
    to: string;            // ✅ UPDATED: Can now be @username or zkHash
    amount: number;
    preferences?: any;
  }) => api.post('/api/payments/send', data),

  getTransfer: (transferId: string) => api.get(`/api/payments/${transferId}`),
  
  getHistory: (params?: { limit?: number; offset?: number }) =>
    api.get('/api/payments/history', { params }),
  
  estimateRoutes: (data: { from: string; to: string; amount: number }) =>
    api.post('/api/payments/estimate', data),
};

// ✅ Channel API
export const channelAPI = {
  open: (data: { with: string; myDeposit: number; theirDeposit: number }) =>
    api.post('/api/channels/open', data),
  
  getAll: (status?: string) =>
    api.get('/api/channels/', { params: status ? { status } : {} }),
  
  get: (channelId: string) => api.get(`/api/channels/${channelId}`),
  
  close: (channelId: string) => api.post(`/api/channels/${channelId}/close`),
};

export default api;