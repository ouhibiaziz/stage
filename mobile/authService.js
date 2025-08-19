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
    let token = tokenOverride;
    if (!token) {
      token = await getToken();
    }

    // If no token is available, we can assume the user is not authenticated.
    if (!token) {
      return null;
    }

    const headers = {};
    // If tokenOverride already includes a scheme (e.g., 'Bearer x'), use it as-is
    if (tokenOverride && /\s/.test(tokenOverride)) {
      headers.Authorization = tokenOverride;
    } else {
      const scheme = (await getTokenScheme()) || 'Bearer';
      headers.Authorization = `${scheme} ${token}`;
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
