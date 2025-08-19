import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'user_token';
const TOKEN_SCHEME_KEY = 'token_scheme';

export const storeToken = async (token) => {
  try {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  } catch (e) {
    console.error('Failed to save the token to storage', e);
  }
};

export const getToken = async () => {
  try {
    return await AsyncStorage.getItem(TOKEN_KEY);
  } catch (e) {
    console.error('Failed to fetch the token from storage', e);
    return null;
  }
};

export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem(TOKEN_KEY);
  } catch (e) {
    console.error('Failed to remove the token from storage', e);
  }
};

export const getTokenScheme = async () => {
  try {
    return await AsyncStorage.getItem(TOKEN_SCHEME_KEY);
  } catch (e) {
    console.error('Failed to fetch the token scheme', e);
    return null;
  }
};

export const storeTokenScheme = async (scheme) => {
  try {
    await AsyncStorage.setItem(TOKEN_SCHEME_KEY, scheme);
  } catch (e) {
    console.error('Failed to save the token scheme', e);
  }
};

export const removeTokenScheme = async () => {
  try {
    await AsyncStorage.removeItem(TOKEN_SCHEME_KEY);
  } catch (e) {
    console.error('Failed to remove the token scheme', e);
  }
};
