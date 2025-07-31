import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { getToken, clearToken } from './utils/auth';
import { fetchHello } from './apiService';

export default function HomeScreen({ navigation }) {
  const isFocused = useIsFocused();
  const [message, setMessage] = useState('');

  const validateSession = async () => {
    const token = await getToken();
    if (!token) {
      navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
      return;
    }
    try {
      const text = await fetchHello();
      setMessage(text);
    } catch (e) {
      console.error(e);
      await clearToken();
      navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
    }
  };

  useEffect(() => {
    if (isFocused) {
      validateSession();
    }
  }, [isFocused]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message || 'Welcome!'}</Text>

      <TouchableOpacity style={styles.chatButton} onPress={() => navigation.navigate('ChatbotScreen')}>
        <Text style={styles.chatButtonText}>Chat with AI</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={async () => {
        await clearToken();
        navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
      }}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  text: {
    fontSize: 20,
    marginBottom: 40,
    color: '#333',
  },
  chatButton: {
    backgroundColor: '#7e5bef',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginBottom: 20,
  },
  chatButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    marginTop: 10,
    padding: 10,
  },
  logoutText: {
    color: '#7e5bef',
    fontSize: 16,
  },
});
