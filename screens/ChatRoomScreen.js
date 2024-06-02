import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ChatRoomScreen = ({ route }) => {
  const { userId, userName } = route.params;
  const [currentUser, setCurrentUser] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the current user from AsyncStorage
        const storedUser = await AsyncStorage.getItem('username');
        setCurrentUser(storedUser);

        // Fetch messages from the server
        const response = await fetch('http://192.168.43.234:3000/messages');
        const messages = await response.json();

        // Filter messages based on sender and receiver
        const filteredMessages = messages.filter(
          (message) =>
            (message.sender === storedUser && message.receiver === userName) ||
            (message.sender === userName && message.receiver === storedUser)
        );

        // Arrange messages based on sender and receiver using message id
        const arrangedMessages = filteredMessages.sort((a, b) => a.id - b.id);

        setChatMessages(arrangedMessages);
      } catch (error) {
        console.error('Error fetching chat data:', error);
      }
    };

    fetchData();
  }, [currentUser, userName]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === '') {
      return;
    }

    const timestamp = new Date().toISOString();

    const newChatMessage = {
      id: (chatMessages.length + 1).toString(),
      sender: currentUser,
      receiver: userName,
      message: newMessage,
      timestamp,
    };

    // Update local state
    setChatMessages([...chatMessages, newChatMessage]);
    setNewMessage('');

    // Send the new message to the server
    try {
      const response = await fetch('http://192.168.43.234:3000/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newChatMessage),
      });

      // If the message was sent successfully, update the local state with the server response
      if (response.ok) {
        const responseData = await response.json();
        setChatMessages([...chatMessages, responseData]);
      } else {
        console.error('Failed to send message:', response.status);
      }
    } catch (error) {
      console.error('Error sending message to the server:', error);
    }
  };

  const renderChatBubble = ({ item }) => {
    return (
      <View
        style={[
          styles.messageContainer,
          item.sender === currentUser ? styles.currentUserContainer : styles.otherUserContainer,
        ]}
      >
        <View style={styles.bubbleContainer}>
          <Text style={styles.sender}>{item.sender}</Text>
          <Text style={styles.message}>{item.message}</Text>
          <Text style={styles.timestamp}>{item.timestamp}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={chatMessages}
        keyExtractor={(item) => item.id}
        renderItem={renderChatBubble}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={newMessage}
          onChangeText={(text) => setNewMessage(text)}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
          <Ionicons name="send" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#e5ddd5',
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  currentUserContainer: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  otherUserContainer: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  bubbleContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    maxWidth: '80%',
  },
  sender: {
    fontSize: 12,
    color: '#128C7E',
    marginBottom: 4,
  },
  message: {
    fontSize: 16,
  },
  timestamp: {
    fontSize: 10,
    color: '#767676',
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  input: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: '#128C7E',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ChatRoomScreen;
