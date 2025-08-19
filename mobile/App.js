import 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useContext } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';

import { AuthProvider, AuthContext } from './utils/AuthContext';
import LoginScreen from './LoginScreen';
import SignUpScreen from './SignUpScreen';
import HomeScreen from './HomeScreenSimple';
import ChatbotScreen from './ChatbotScreen';
import Sidebar from './components/Sidebar';

// Create navigators
const AuthStack = createStackNavigator();
const Drawer = createDrawerNavigator();

// Profile Screen Component
const ProfileScreen = () => {
  const { user } = useContext(AuthContext);
  return (
    <View style={styles.profileContainer}>
      <Text style={styles.profileTitle}>User Profile</Text>
      {user ? (
        <View>
          <Text style={styles.profileLabel}>Name:</Text>
          <Text style={styles.profileValue}>{user.name || 'N/A'}</Text>
          <Text style={styles.profileLabel}>Email:</Text>
          <Text style={styles.profileValue}>{user.email || 'N/A'}</Text>
        </View>
      ) : (
        <Text style={styles.profileValue}>Please log in to see your profile.</Text>
      )}
    </View>
  );
};

// Auth Stack for Login and Sign Up
const AuthStackScreen = () => (
  <AuthStack.Navigator screenOptions={{ headerShown: false }}>
    <AuthStack.Screen name="Login" component={LoginScreen} />
    <AuthStack.Screen 
      name="SignUp" 
      component={SignUpScreen}
      options={{ headerShown: true, title: 'Create Account' }}
    />
  </AuthStack.Navigator>
);

// Main App Drawer Navigator
const AppDrawer = () => (
  <Drawer.Navigator
    drawerContent={(props) => <Sidebar {...props} />}
    screenOptions={{ headerShown: true }} 
    initialRouteName="Home"  
  >
    <Drawer.Screen 
      name="Home" 
      component={HomeScreen} 
      options={{ title: 'Home' }} 
    />
    <Drawer.Screen name="Chatbot" component={ChatbotScreen} />
    <Drawer.Screen name="Profile" component={ProfileScreen} />
  </Drawer.Navigator>
);

// Root Navigator to switch between Auth and App
const RootNavigator = () => {
  const { isAuthenticated, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <AppDrawer /> : <AuthStackScreen />}
    </NavigationContainer>
  );
};

// Main App Component
const App = () => {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
};

// Styles
const styles = StyleSheet.create({
  profileContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  profileTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  profileLabel: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 15,
    color: '#555',
  },
  profileValue: {
    fontSize: 16,
    marginTop: 5,
  },
});

export default App;