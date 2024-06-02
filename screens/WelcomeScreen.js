// WelcomeScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const WelcomeScreen = () => {
  const navigation = useNavigation();
  const [usernameAsynStorage, setUsernameAsynStorage] = useState(null);

  useEffect(() => {
    const checkAsyncStorage = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem('username');

        if (storedUsername) {
          setUsernameAsynStorage(storedUsername);
        }
      } catch (error) {
        console.error('Error checking AsyncStorage:', error);
      }
    };

    checkAsyncStorage();
  }, []);


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, {usernameAsynStorage}!</Text>
     <Button title='next' onPress={()=>{navigation.navigate('User')}}/>
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
});

export default WelcomeScreen;
