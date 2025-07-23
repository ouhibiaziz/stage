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
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    console.log('Attempting registration with:', { username, email, password });
    setLoading(true);
    try {
      const userData = { username, email, password };
      console.log('Sending registration request...');
      const response = await registerUser(userData);
      console.log('Registration response:', {
        status: response.status,
        headers: response.headers,
        data: response.data
      });
      Alert.alert('Success', response.data?.message || 'Registration successful', [
        { text: 'OK', onPress: () => navigation.navigate('Login') }
      ]);
    } catch (error) {
      console.error('Registration error details:', {
        message: error.message,
        response: error.response,
        config: error.config
      });
      Alert.alert('Error', 
        error.response?.data?.message || 
        error.message || 
        'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#3b5998', '#192f6a']} style={styles.container}>
      {/* TEST BUTTON */}
      <TouchableOpacity 
        onPress={() => console.log('TEST BUTTON PRESSED')}
        style={{padding: 20, backgroundColor: 'red'}}
      >
        <Text style={{color: 'white'}}>TEST BUTTON</Text>
      </TouchableOpacity>
      
      {/* TEST CONNECTIVITY BUTTON */}
      <TouchableOpacity 
        onPress={async () => {
          try {
            console.log('Testing backend connectivity...');
            const response = await api.get('/test/connectivity');
            console.log('Connectivity test response:', response.data);
            Alert.alert('Success', 'Backend connection successful!');
          } catch (error) {
            console.error('Connectivity test failed:', error);
            Alert.alert('Error', 'Failed to connect to backend');
          }
        }}
        style={{padding: 20, backgroundColor: 'green', marginTop: 20}}
      >
        <Text style={{color: 'white'}}>Test Backend Connection</Text>
      </TouchableOpacity>
      
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
