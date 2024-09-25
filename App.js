import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Home from './screens/Home';
import NewsDetail from './screens/NewsDetail'; // Import the detail screen

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} options={{ title: 'Home' }} />
        <Stack.Screen name="NewsDetail" component={NewsDetail} options={{ title: 'News Detail' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
