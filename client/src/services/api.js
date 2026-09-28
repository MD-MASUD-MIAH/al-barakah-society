import axios from 'axios';

let rawBaseUrl =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? 'https://al-barakah-server.vercel.app/api' : 'http://localhost:5000/api');
if (rawBaseUrl.startsWith('http') && !rawBaseUrl.endsWith('/api') && !rawBaseUrl.endsWith('/api/')) {
  rawBaseUrl = `${rawBaseUrl.replace(/\/+$/, '')}/api`;
}

const API_BASE_URL = rawBaseUrl;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach token & normalize duplicate /api prefix
api.interceptors.request.use(
  (config) => {
    // If URL mistakenly starts with /api/, strip it since baseURL already has /api
    if (config.url && config.url.startsWith('/api/')) {
      config.url = config.url.replace(/^\/api/, '');
    }

    const token = localStorage.getItem('al_barakah_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/register') {
        localStorage.removeItem('al_barakah_token');
        localStorage.removeItem('al_barakah_user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
