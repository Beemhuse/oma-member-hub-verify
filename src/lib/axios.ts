import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Attach token directly to headers
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token');
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Intercept responses for 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized access globally
      console.warn('Unauthorized. Redirecting to login...');
      
      // Optional: clear session and redirect
      sessionStorage.removeItem('token');
      window.location.href = '/login'; // or your login route
    }
    return Promise.reject(error);
  }
);

export default api;
