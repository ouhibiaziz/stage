import axios from 'axios';
import { Platform } from 'react-native';

const API_HOST = Platform.OS === 'android' ? 'http://10.0.2.2:8081' : 'http://localhost:8081';
const client = axios.create({
  baseURL: `${API_HOST}/api/auth`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const registerUser = (username, email, password) => {
  return client.post('/register', {
    username,
    email,
    password,
  });
};

export const loginUser = (email, password) => {
  return client.post('/login', {
    email,
    password,
  });
};
