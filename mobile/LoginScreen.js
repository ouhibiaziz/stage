import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput, Pressable, Keyboard, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { loginUser } from './apiService';
import { storeToken } from './utils/auth';

const localIP = '192.168.1.190'; // User's local IP address for Wi-Fi connection
const apiUrl = Platform.OS === 'android' ? 'http://10.0.2.2:8081/api/auth' : `http://${localIP}:8081/api/auth`;
console.log('API URL:', apiUrl);

export default function LoginScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const onSubmit = async () => {
    Keyboard.dismiss();
    setLoading(true);
    try {
      const data = await loginUser(email, password);
      if (!data.token) {
        throw new Error('No authentication token received');
      }
      await storeToken(data.token);
      navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
    } catch (error) {
      console.error('Full login error:', error);
      let message = 'Login failed. Please try again.';
      if (error.response?.data?.error) {
        message = error.response.data.error;
      } else if (error.message) {
        message = error.message;
      }
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Pressable style={styles.container} onPress={Keyboard.dismiss}>
      <LinearGradient 
        colors={['#667eea', '#764ba2']} 
        style={styles.gradient}
      >
        <View style={styles.content}>
          <Text style={styles.header}>Welcome Back</Text>
          
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Email"
              placeholderTextColor="#999"
              onChangeText={setEmail}
              value={email}
              style={[styles.input, emailFocused && styles.inputFocused]}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Password"
              placeholderTextColor="#999"
              onChangeText={setPassword}
              value={password}
              style={[styles.input, passwordFocused && styles.inputFocused]}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
            />
          </View>

          <Pressable 
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
              loading && styles.buttonDisabled
            ]}
            onPress={onSubmit}
            disabled={loading}
          >
            <Text style={styles.buttonText}>{loading ? 'Loading...' : 'Login'}</Text>
          </Pressable>

          <TouchableOpacity 
            onPress={() => Alert.alert('Forgot Password', 'Password reset link sent to your email')}
            activeOpacity={0.7}
            style={styles.forgotPasswordButton}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.signUpButton,
              pressed && styles.signUpButtonPressed
            ]}
            onPress={() => navigation.navigate('SignUp')}
          >
            <Text style={styles.signUpButtonText}>Don't have an account? Sign Up</Text>
          </Pressable>
        </View>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    padding: 16,
    color: '#fff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  inputFocused: {
    borderColor: '#fff',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 3,
  },
  button: {
    backgroundColor: '#4a6cf7',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
    elevation: 3,
  },
  buttonPressed: {
    backgroundColor: '#3a5bd9',
  },
  buttonDisabled: {
    backgroundColor: '#a0a0a0',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  forgotPasswordButton: {
    alignSelf: 'center',
    marginTop: 15,
  },
  forgotPasswordText: {
    color: 'white',
    textDecorationLine: 'underline',
    fontSize: 14,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 25,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  dividerText: {
    color: 'white',
    paddingHorizontal: 10,
    fontSize: 14,
  },
  signUpButton: {
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  signUpButtonPressed: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  signUpButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
