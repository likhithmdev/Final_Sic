import axios from 'axios';

// Use relative /api when VITE_API_URL not set (proxied through Vite for ngrok/single-tunnel)
const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
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
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

export const rewardsAPI = {
  submitBottle: () => api.post('/rewards/submit-bottle'),
  checkIn: () => api.post('/rewards/check-in'),
  checkOut: () => api.post('/rewards/check-out'),
  getCheckInStatus: () => api.get('/rewards/check-in-status'),
  redeemItem: (data) => api.post('/rewards/redeem', data),
  getRedemptionHistory: () => api.get('/rewards/redemption-history'),
  getBottleHistory: () => api.get('/rewards/bottle-history'),
};

export const adminAPI = {
  getUsersSummary: () => api.get('/admin/users-summary'),
};

export const statsAPI = {
  getStats: () => api.get('/stats'),
  getHistory: (limit = 10) => api.get(`/history?limit=${limit}`),
};

export default api;
