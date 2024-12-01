import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./screens/LoginScreen";
import DrawerNavigator from "./navigation/DrawerNavigator";
import Home from "./screens/Home";
import AdminDashboard from "./screens/Admin";
import RegisterScreen from "./screens/RegisterScreen"
// Create a Stack Navigator
const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LoginScreen">
        {/* LoginScreen */}
        <Stack.Screen 
          name="LoginScreen" 
          component={LoginScreen} 
          options={{ headerShown: false }} 
        />
        
        {/* RegisterScreen */}
        <Stack.Screen 
          name="RegisterScreen" 
          component={RegisterScreen} 
          options={{ headerShown: false }} 
        />
        
        {/* Home Screen */}
        <Stack.Screen 
          name="Home" 
          component={Home} 
          options={{ headerShown: false }} 
        />
        
        {/* NewsDetail Screen */}
        <Stack.Screen 
          name="NewsDetail" 
          component={NewsDetail} 
          options={{ headerShown: false }} 
        />

        <Stack.Screen 
          name="RegisterScreen" 
          component={RegisterScreen} 
          options={{ headerShown: false }} 
        />
         <Stack.Screen 
          name="AdminDashboard" 
          component={AdminDashboard} 
          options={{ headerShown: false }} 
        />
        {/* Uncomment this if you're using DrawerNavigator */}
        {/* 
        <Stack.Screen 
          name="DrawerNavigator" 
          component={DrawerNavigator} 
          options={{ headerShown: false }} 
        /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
