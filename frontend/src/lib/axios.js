import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === 'development' ? 'http://localhost:5000/api' : '/api',
  withCredentials: true,
  timeout: 10000, // Prevent hanging requests
});

// Add response interceptor for detailed error logging
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    console.error('Axios error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
    });
    return Promise.reject(error);
  }
);