import { Platform } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
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

export const registerUser = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    console.error('Registration failed:', error);
    throw error;
  }
};

export const loginUser = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      await AsyncStorage.setItem('token', response.data.token);
    }
    return response.data;
  } catch (error) {
    throw handleApiError(error, 'loginUser');
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