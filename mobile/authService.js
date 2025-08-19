import { api } from './apiService';
import { getToken, getTokenScheme } from './utils/auth';

// This function handles the login API call
export const loginUser = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  // Return both data and headers to allow token extraction from headers when needed
  return { ...response.data, headers: response.headers };
};

// This function checks the current authentication status
export const checkAuthStatus = async (tokenOverride) => {
  try {
    const headers = {};
    if (tokenOverride) {
      // If tokenOverride already includes a scheme (e.g., 'Bearer x'), use it as-is
      if (/\s/.test(tokenOverride)) {
        headers.Authorization = tokenOverride;
      } else {
        const scheme = (await getTokenScheme()) || 'Bearer';
        headers.Authorization = `${scheme} ${tokenOverride}`;
      }
    } else {
      // Fallback: attach token from storage if available
      const storedToken = await getToken();
      if (storedToken) {
        const scheme = (await getTokenScheme()) || 'Bearer';
        headers.Authorization = `${scheme} ${storedToken}`;
      }
    }
    const response = await api.get('/auth/status', { headers });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      return null; // Not authenticated, not an error
    }
    throw error; // Re-throw other errors
  }
};

// This function handles user registration
export const registerUser = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

// This function handles the logout API call
export const logoutUser = async () => {
  // The backend should handle session invalidation. 
  // The request interceptor in apiService.js already removes the token.
  try {
    await api.post('/auth/logout');
  } catch (error) {
    console.warn('Logout API call failed, but logging out locally anyway.');
  }
};
