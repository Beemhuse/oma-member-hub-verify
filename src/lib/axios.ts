import axios from 'axios';
import { Cookies } from 'react-cookie';

const cookies = new Cookies();

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Attach token from cookies to all requests
api.interceptors.request.use(
  (config) => {
    const token = cookies.get('oma-token'); // Read from cookies
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Intercept 401 responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token from cookies and redirect to login
      cookies.remove('oma-token', { path: '/' });
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
