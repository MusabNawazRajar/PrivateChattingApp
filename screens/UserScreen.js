import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserScreen = ({ navigation }) => {
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the current user from AsyncStorage
        const storedUser = await AsyncStorage.getItem('username');
        setCurrentUser(storedUser);

        const response = await fetch('http://192.168.43.234:3000/users');
        const data = await response.json();

        // Filter out the current user from the list
        const filteredUserList = data.filter((user) => user.username !== storedUser);
        setUserList(filteredUserList);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleUserPress = (item) => {
    // Handle user press, you can navigate to a chat screen or perform other actions
    console.log('User pressed:', item.username);
    navigation.navigate('ChatRoom', {
      userId: item.id,
      userName: item.username,
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={userList}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleUserPress(item)}>
            <View style={styles.userItem}>
              <Ionicons name="person" size={40} color="#3498db" style={styles.userIcon} />
              <View style={styles.userInfo}>
                <Text style={styles.username}>{item.username}</Text>
                <Text>{`${item.firstName} ${item.lastName}`}</Text>
              </View>
              <Ionicons name="chatbubble" size={24} color="#3498db" style={styles.chatIcon} />
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#3498db',
    borderRadius: 10,
  },
  userIcon: {
    marginRight: 10,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  chatIcon: {
    marginLeft: 10,
  },
});

export default UserScreen;
