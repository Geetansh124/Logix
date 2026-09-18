import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL.replace(/\/+$/, '')}/api/v1`
  : '/api/v1';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 token refresh & prototype mock fallback
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken === 'demo_prototype_token') {
          return Promise.reject(error);
        }
        const { data } = await axios.post(`${API_BASE}/auth/refresh`, { refreshToken });
        localStorage.setItem('accessToken', data.data.accessToken);
        localStorage.setItem('refreshToken', data.data.refreshToken);
        original.headers.Authorization = `Bearer ${data.data.accessToken}`;
        return api(original);
      } catch {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      }
    }

    // Prototype demo fallback when backend is not connected
    if (!error.response || error.response.status === 404 || error.response.status === 405) {
      const url = original.url || '';
      const {
        MOCK_STATIONS,
        MOCK_EXPEDITIONS,
        MOCK_CARGO,
        MOCK_INVENTORY,
        MOCK_PERSONNEL,
        MOCK_EMERGENCIES,
        MOCK_ASSETS,
      } = await import('./mockData');

      if (url.includes('/stations')) {
        return { data: { data: MOCK_STATIONS } };
      }
      if (url.includes('/expeditions')) {
        return { data: { data: MOCK_EXPEDITIONS } };
      }
      if (url.includes('/cargo')) {
        return { data: { data: MOCK_CARGO } };
      }
      if (url.includes('/inventory')) {
        return { data: { data: MOCK_INVENTORY } };
      }
      if (url.includes('/personnel')) {
        return { data: { data: MOCK_PERSONNEL } };
      }
      if (url.includes('/emergencies')) {
        return { data: { data: MOCK_EMERGENCIES } };
      }
      if (url.includes('/assets')) {
        return { data: { data: MOCK_ASSETS } };
      }
    }

    return Promise.reject(error);
  },
);

export default api;
