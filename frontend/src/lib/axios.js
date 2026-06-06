import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5001/api', // Backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the auth token
api.interceptors.request.use(
  (config) => {
    // We will store the token in localStorage
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
