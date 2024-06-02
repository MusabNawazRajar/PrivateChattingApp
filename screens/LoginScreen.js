import React, { useState, useRef } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';



const LoginScreen = ({ navigation }) => {
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const isLoadingRef = useRef(false);

  const handleLogin = () => {
    if (isLoadingRef.current) {
      return;
    }
  
    // Start loading
    setIsLoading(true);
    isLoadingRef.current = true;
  
    // Fetch user data based on the entered username
    fetch(`http://192.168.43.234:3000/users?username=${username}`)
      .then(response => response.json())
      .then(data => {
        // Check if user exists and password matches
        const user = data[0];
        if (user) {
          if (user.password === password) {
            // Authentication successful, save the username to AsyncStorage
            AsyncStorage.setItem('username', user.username);
  
            // Navigate to WelcomeScreen
            navigation.replace('Welcome');
          } else {
            // Password doesn't match, show an alert
            Alert.alert('Authentication failed', 'Incorrect password. Please try again.');
          }
        } else {
          // User doesn't exist, show an alert
          Alert.alert('Authentication failed', 'User not found. Please sign up or check your credentials.');
        }
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
      })
      .finally(() => {
        // Stop loading
        setIsLoading(false);
        isLoadingRef.current = false;
      });
  };

  const handleNavigateToSignup = () => {
    // Navigate to Signup screen
    navigation.replace('Signup');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={text => setUsername(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={text => setPassword(text)}
      />
      <Button title="Login" onPress={handleLogin} />
      {isLoading && <ActivityIndicator size="large" color="#0000ff" />}
      <TouchableOpacity onPress={handleNavigateToSignup}>
        <Text style={styles.signupText}>Don't have an account? Sign up here</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
    width: '100%',
  },
  signupText: {
    marginTop: 20,
    color: 'blue',
  },
});

export default LoginScreen;
