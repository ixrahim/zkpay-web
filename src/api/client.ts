import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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

export const authAPI = {
  login: (data: { email: string; password: string }) => 
    axios.post('/auth/login', data).then(res => res.data),
  // ... other auth methods
};

export const identityAPI = {
  create: (data: {
    userId: string;
    password: string;
    sortCode: string;
    accountNumber: string;
    bankName: string;
    publicKey: string;
  }) => api.post('/api/identity/create', data),

  get: (zkHash: string) => api.get(`/api/identity/${zkHash}`),
  verify: (zkHash: string) => api.post('/api/identity/verify', { zkHash }),
};

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

export const channelAPI = {
  open: (data: { with: string; myDeposit: number; theirDeposit: number }) =>
    api.post('/api/channels/open', data),
  getAll: (status?: string) =>
    api.get('/api/channels/', { params: status ? { status } : {} }),
};
