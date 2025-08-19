import { Platform } from 'react-native';
import axios from 'axios';
import { getToken, getTokenScheme } from './utils/auth';

// Configuration for different environments
const getApiBaseUrl = () => {
  // Always use absolute URLs for API requests
  return Platform.select({
    android: 'http://192.168.1.190:8080/api',
    web: 'http://localhost:8080/api',  // Special case for web
    default: 'http://192.168.1.190:8080/api'
  });
};

const API_BASE_URL = getApiBaseUrl();
console.log('API Base URL:', API_BASE_URL);

// Create axios instance with credentials
const api = axios.create({
  baseURL: getApiBaseUrl(),
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add request interceptor for debugging
api.interceptors.request.use(config => {
  console.log('Making request to:', {
    url: config.url,
    fullUrl: config.baseURL + config.url,
    method: config.method,
    headers: config.headers,
    data: config.data
  });
  return config;
});

// Request interceptor to add token
api.interceptors.request.use(async (config) => {
  try {
    const token = await getToken();
    const scheme = (await getTokenScheme()) || 'Bearer';
    if (token) {
      config.headers.Authorization = `${scheme} ${token}`;
    }
    // Log sanitized Authorization header after it is set
    try {
      const auth = config.headers.Authorization;
      const preview = auth ? `${auth.split(' ')[0]} ${(auth.split(' ')[1] || '').slice(0, 8)}...` : 'none';
      console.log('Auth header:', preview, '->', (config.method || 'GET').toUpperCase(), config.baseURL + config.url);
    } catch {}
    return config;
  } catch (error) {
    console.error('Token retrieval error:', error);
    return config;
  }
});

// Response interceptor to handle errors globally
api.interceptors.response.use(
  response => {
    // Check if response is HTML (error case)
    if (response.headers['content-type']?.includes('text/html')) {
      throw new Error('Received HTML response instead of JSON - likely a server error');
    }
    return response;
  },
  error => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// API Methods
export const fetchHello = async () => {
  try {
    const response = await api.get('/hello');
    return response.data;
  } catch (error) {
    throw handleApiError(error, 'fetchHello');
  }
};

// Helper functions
const handleApiError = (error, context) => {
  const errorInfo = {
    context,
    message: error.message,
    response: error.response?.data,
    status: error.response?.status,
  };
  console.error('API Error Details:', errorInfo);
  return new Error(error.response?.data?.message || `Failed to ${context}`);
};

// Implement this if using refresh tokens
const refreshToken = async () => {
  // Your token refresh implementation
  throw new Error('Refresh token not implemented');
};

// For testing connection
export const testConnection = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL.replace('/api', '')}/actuator/health`);
    return response.data;
  } catch (error) {
    throw handleApiError(error, 'testConnection');
  }
};

export { api };