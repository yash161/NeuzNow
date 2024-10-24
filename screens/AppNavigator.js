// AppNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../screens/Home';  // Import Home Screen
import NewsDetail from '../screens/NewsDetail';  // Import NewsDetail Screen

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen 
        name="NewsDetail" 
        component={NewsDetail} 
        options={{ title: 'News Details' }} // Optionally customize the title
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
