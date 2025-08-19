import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Keyboard, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { registerUser } from './apiService';
import { api } from './apiService';

const SignUpScreen = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  const navigation = useNavigation();

  const handleSignUp = async () => {
    console.log('Sign Up button pressed');
    // Basic client-side validation to reduce 400 errors from backend
    const isEmailValid = /^\S+@\S+\.\S+$/.test(email);
    if (!username || username.length < 3) {
      console.log('Validation failed: Username is too short.');
      Alert.alert('Error', 'Username must be at least 3 characters.');
      return;
    }
    if (!isEmailValid) {
      console.log('Validation failed: Email is invalid.');
      Alert.alert('Error', 'Please enter a valid email address.');
      return;
    }
    if (!password || password.length < 6) {
      console.log('Validation failed: Password is too short.');
      Alert.alert('Error', 'Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      console.log('Validation failed: Passwords do not match.');
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    console.log('Attempting registration with:', { username, email, password });
    setLoading(true);
    try {
      // Include both username and name to satisfy common Spring DTOs
      const payload = { username, name: username, email, password };
      console.log('Sending registration request...');
      const data = await registerUser(payload); // registerUser returns response.data
      console.log('Registration response data:', data);
      Alert.alert('Success', data?.message || 'Registration successful', [
        { text: 'OK', onPress: () => navigation.navigate('Login') }
      ]);
    } catch (error) {
      const data = error?.response?.data;
      // Construct a helpful message from typical Spring validation formats
      let message =
        data?.message ||
        (Array.isArray(data?.errors)
          ? data.errors
              .map(e => e.defaultMessage || e.message || (e.field ? `${e.field}: ${e.error}` : String(e)))
              .join('\n')
          : (data && typeof data === 'object')
            ? Object.values(data).flat().join('\n')
            : null) ||
        error.message ||
        'Registration failed. Please try again.';
      console.error('Registration error details:', {
        message: error.message,
        response: error.response,
        data,
        config: error.config
      });
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#3b5998', '#192f6a']} style={styles.container}>

      
      <Text style={styles.title}>Create Account</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          placeholder="Enter your username"
          placeholderTextColor="#a0a0a0"
          autoCapitalize="none"
          returnKeyType="next"
          onSubmitEditing={() => emailRef.current.focus()}
        />
        <Text style={styles.label}>Email</Text>
        <TextInput
          ref={emailRef}
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          placeholderTextColor="#a0a0a0"
          keyboardType="email-address"
          autoCapitalize="none"
          returnKeyType="next"
          onSubmitEditing={() => passwordRef.current.focus()}
        />
        <Text style={styles.label}>Password</Text>
        <TextInput
          ref={passwordRef}
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
          placeholderTextColor="#a0a0a0"
          secureTextEntry
          returnKeyType="next"
          onSubmitEditing={() => confirmPasswordRef.current.focus()}
        />
        <Text style={styles.label}>Confirm Password</Text>
        <TextInput
          ref={confirmPasswordRef}
          style={styles.input}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Confirm your password"
          placeholderTextColor="#a0a0a0"
          secureTextEntry
          returnKeyType="done"
          onSubmitEditing={handleSignUp}
        />
        {loading ? (
          <ActivityIndicator size="large" color="#ffffff" style={styles.loader} />
        ) : (
          <TouchableOpacity 
            onPress={handleSignUp} 
            style={styles.button}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.loginLink}>
          <Text style={styles.loginText}>Already have an account? Log in</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 40,
  },
  inputContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 20,
  },
  label: {
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 10,
    paddingLeft: 5,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    padding: 15,
    color: '#ffffff',
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  button: {
    backgroundColor: '#ffffff',
    padding: 18,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#3b5998',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loginLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  loginText: {
    color: '#ffffff',
    fontSize: 16,
  },
  loader: {
    marginVertical: 20,
  },
});

export default SignUpScreen;