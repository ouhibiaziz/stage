import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'user_token';

export const storeToken = async (token, remember) => {
  try {
    if (remember) {
      await AsyncStorage.setItem(TOKEN_KEY, token);
    } else {
      // Store but could also use a global variable for in-memory session
      await AsyncStorage.setItem(TOKEN_KEY, token);
    }
  } catch (e) {
    console.error('Error storing token', e);
  }
};

export const getToken = async () => {
  try {
    return await AsyncStorage.getItem(TOKEN_KEY);
  } catch (e) {
    console.error('Error getting token', e);
    return null;
  }
};

export const clearToken = async () => {
  try {
    await AsyncStorage.removeItem(TOKEN_KEY);
  } catch (e) {
    console.error('Error clearing token', e);
  }
};
