import React, { useEffect, useState } from 'react';
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { EventRegister } from 'react-native-event-listeners';
import theme from '../config/theme';
import themeContext from '../config/themeContext';

import TabNavigator from "./TabNavigator"; // Adjust path if necessary
import India from '../screens/Country/India';
import Japan from '../screens/Country/Japan';
import Germany from '../screens/Country/Germany';
import US from '../screens/Country/US';
import Canada from '../screens/Country/Canada';
import Australia from '../screens/Country/Australia';
import NewZealand from '../screens/Country/NewZeal';
import DrawerContent from "./CustomDrawerContent"; // Adjust path if necessary

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    const eventListener = EventRegister.addEventListener('themeChange', (data) => {
      setIsEnabled(data);
      console.log(data);
    });
    return () => {
      EventRegister.removeEventListener(eventListener);
    };
  }, []);

  return (
    <themeContext.Provider value={isEnabled ? theme.light : theme.dark}>
      <NavigationContainer theme={isEnabled ? DarkTheme : DefaultTheme}>
        <Drawer.Navigator
          initialRouteName="Home"
          drawerContent={(props) => <DrawerContent {...props} />}
        >
          <Drawer.Screen name="Home" component={TabNavigator} options={{
            headerShown: false,
            drawerIcon: ({ focused, size }) => (
              <Ionicons name="md-home" size={size} color={focused ? '#2E5BE3' : '#0096FF'} />
            ),
          }} />
          <Drawer.Screen name="India" component={India} options={{ headerShown: true }} />
          <Drawer.Screen name="US" component={US} options={{ headerShown: true }} />
          <Drawer.Screen name="Canada" component={Canada} options={{ headerShown: true }} />
          <Drawer.Screen name="Australia" component={Australia} options={{ headerShown: true }} />
          <Drawer.Screen name="New Zealand" component={NewZealand} options={{ headerShown: true }} />
          <Drawer.Screen name="Japan" component={Japan} options={{ headerShown: true }} />
          <Drawer.Screen name="Germany" component={Germany} options={{ headerShown: true }} />
        </Drawer.Navigator>
      </NavigationContainer>
    </themeContext.Provider>
  );
}

export default DrawerNavigator;
