import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SignupScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Cleanup the loading state when the component unmounts
    return () => setIsLoading(false);
  }, []);

  const handleSignUp = () => {
    // Check if the username already exists
    setIsLoading(true);

    fetch(`http://192.168.43.234:3000/users?username=${username}`)
      .then(response => response.json())
      .then(data => {
        const existingUser = data[0];

        if (existingUser) {
          // User already exists, show an alert
          alert('Username already exists. Please choose a different username.');
          setIsLoading(false);
        } else {
          // User doesn't exist, proceed with user creation
          const newUser = {
            username,
            firstName,
            lastName,
            age: parseInt(age), // Convert age to number
            password,
          };

          // Send POST request to the server
          fetch('http://192.168.43.234:3000/users', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(newUser),
          })
            .then(response => response.json())
            .then(data => {
              console.log('User successfully registered:', data);

              // Save the username in AsyncStorage
              AsyncStorage.setItem('username', newUser.username);

              // Navigate to Welcome screen
              navigation.replace('Welcome');
            })
            .catch(error => {
              console.error('Error registering user:', error);
            })
            .finally(() => setIsLoading(false));
        }
      })
      .catch(error => {
        console.error('Error checking existing user:', error);
        setIsLoading(false);
      });
  };

  const handleNavigateToLogin = () => {
    // Navigate to Login screen
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Signup</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={text => setUsername(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={firstName}
        onChangeText={text => setFirstName(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={lastName}
        onChangeText={text => setLastName(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Age"
        value={age}
        onChangeText={text => setAge(text)}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={text => setPassword(text)}
      />
      <View style={styles.buttonContainer}>
        <Button title="Sign Up" onPress={handleSignUp} />
      </View>
      {isLoading && <ActivityIndicator size="large" color="#0000ff" />}
      <TouchableOpacity onPress={handleNavigateToLogin}>
        <Text style={styles.loginText}>Already have an account? Login here</Text>
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
  buttonContainer: {
    marginTop: 10,
    width: '100%',
  },
  loginText: {
    marginTop: 20,
    color: 'blue',
  },
});

export default SignupScreen;
