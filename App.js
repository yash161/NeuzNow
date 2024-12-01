import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./screens/LoginScreen";
import Home from "./screens/Home"; // Import your Home screen
import RegisterScreen from "./screens/RegisterScreen";
import NewsDetail from "./screens/NewsDetail"; // Import your NewsDetail screen
// Uncomment this if you are using DrawerNavigator
// import DrawerNavigator from "./navigation/DrawerNavigator"; 

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
