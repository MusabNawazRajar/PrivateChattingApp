// App.js
import React, { useEffect, useState } from "react";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import WelcomeScreen from "./screens/WelcomeScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import UserScreen from "./screens/UserScreen";
import ChatRoomScreen from "./screens/ChatRoomScreen";

const Stack = createStackNavigator();

const App = () => {
  const [usernameAsynStorage, setUsernameAsynStorage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAsyncStorage = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem("username");
        console.log("Stored Username:", storedUsername);

        if (storedUsername) {
          setUsernameAsynStorage(storedUsername);
        }
      } catch (error) {
        console.error("Error checking AsyncStorage:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAsyncStorage();
  }, []);

  if (loading) {
    return (
      <ActivityIndicator
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        size="large"
        color="#0000ff"
      />
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={usernameAsynStorage ? "Welcome" : "Login"}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={({ navigation }) => ({
            headerRight: () => (
              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Ionicons
                  name="log-out"
                  size={24}
                  color="black"
                  style={{ marginRight: 20 }}
                />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="User"
          component={UserScreen}
          options={({ navigation }) => ({  // Fix here: useNavigation to get navigation
            title: "User List",
            headerRight: () => (
              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Ionicons
                  name="log-out"
                  size={24}
                  color="black"
                  style={{ marginRight: 20 }}
                />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="ChatRoom"
          component={ChatRoomScreen}
          options={({ route }) => ({
            title: route.params.userName,
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
