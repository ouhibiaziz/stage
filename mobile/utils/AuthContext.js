import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { checkAuthStatus, loginUser, logoutUser } from '../authService';
import { api } from '../apiService';
import { storeToken, removeToken, storeTokenScheme, removeTokenScheme } from './auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const clearAuthForDevelopment = async () => {
      if (__DEV__) {
        console.log('Development mode: Clearing auth token for a fresh start.');
        await removeToken();
        await removeTokenScheme();
      }
    };

    clearAuthForDevelopment();
  }, []);

  useEffect(() => {
    const verifySession = async () => {
      try {
        const status = await checkAuthStatus();
        const normalizedUser = status?.user ?? status;
        if (normalizedUser && (normalizedUser.id || normalizedUser.email || normalizedUser.username)) {
          setUser(normalizedUser);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.log('Auth verification failed:', error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    verifySession();
  }, []);

  const login = async (email, password) => {
    try {
      const loginData = await loginUser(email, password);

      // Find token from headers or body, prioritizing Authorization header
      const authHeader = loginData?.headers?.authorization || loginData?.headers?.Authorization;
      const bodyToken = loginData?.token || loginData?.accessToken || loginData?.jwt;

      if (!authHeader && !bodyToken) {
        throw new Error('Invalid credentials');
      }

      // If we have a full header, use it. Otherwise, construct it.
      const finalAuthHeader = authHeader || `Bearer ${bodyToken}`;
      const tokenParts = finalAuthHeader.split(' ');
      const scheme = tokenParts.length > 1 ? tokenParts[0] : 'Bearer';
      const tokenValue = tokenParts.length > 1 ? tokenParts[1] : tokenParts[0];

      // Persist token and scheme
      await storeToken(tokenValue);
      await storeTokenScheme(scheme);

      // Ensure header is attached immediately in this runtime
      try {
        api.defaults.headers.common.Authorization = finalAuthHeader;
      } catch {}

      // Prefer user bundled in login response; otherwise fetch status
      let userData = loginData?.user ?? loginData?.data?.user;
      if (!userData) {
        console.log('Sending this header to /auth/status:', finalAuthHeader);
        const status = await checkAuthStatus(finalAuthHeader);
        userData = status?.user ?? status;
      }

      if (userData && (userData.id || userData.email || userData.username)) {
        setUser(userData);
        setIsAuthenticated(true);
        return { success: true };
      }

      throw new Error('Login succeeded but user data unavailable');
    } catch (error) {
      console.error('Login failed:', error);
      setUser(null);
      setIsAuthenticated(false);
      await removeToken();
      await removeTokenScheme();
      throw new Error(error.message || 'Login failed');
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      // Always clear local state regardless of API call success
      delete api.defaults.headers.common.Authorization; // Clear auth header
      await removeToken(); // Clear the token from storage
      await removeTokenScheme();
      setUser(null);
      setIsAuthenticated(false);
      
      // For web, also clear any stored session data
      if (typeof window !== 'undefined') {
        // Clear any localStorage or sessionStorage if used
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        sessionStorage.clear();
      }
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
