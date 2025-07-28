import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
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
      // Optionally, you can decode token or call backend validate
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
      <Button
        title="Logout"
        onPress={async () => {
          await clearToken();
          navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
  },
});