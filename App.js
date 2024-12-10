import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./screens/LoginScreen";
import DrawerNavigator from "./navigation/DrawerNavigator";
import NewsDetail from "./screens/NewsDetail";
import Home from "./screens/Home";
import AdminDashboard from "./screens/Admin";
import RegisterScreen from "./screens/RegisterScreen";
import ResetPasswordScreen from "./screens/ResetPasswordScreen";
import StudentVerificationPage from "./screens/studentVerification";
import AuthorsPage from "./screens/AuthorPage";
import ProfileScreen from "./screens/ProfileScreen";
import AddBlog from './screens/AddBlog';
import { UserProvider } from "./screens/UserContext";
import ManageAuthors from "./screens/Authormanagment";
import AuthorProfile from "./screens/AuthorProfile";
import StudentProfile from "./screens/StudentProfile";
import UserProfile from "./screens/UserProfile";
import GetAuthors from "./screens/Author_Blogs";
// Create a Stack Navigator
const Stack = createStackNavigator();

const App = () => {
  return (
    <UserProvider>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="GetAuthors">
        {/* LoginScreen */}
        <Stack.Screen 
                  name="LoginScreen" 
          component={LoginScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
        
        
        name="UserProfile" 
        component={UserProfile} 
        options={{ headerShown: false }} 
      />
        <Stack.Screen name="AddBlog" component={AddBlog} options={{ headerShown: false }} />

        {/* Register Screen */}
        <Stack.Screen 
          name="RegisterScreen" 
          component={RegisterScreen} 
          options={{ headerShown: false }} 
        />
          <Stack.Screen 
          name="GetAuthors" 
          component={GetAuthors} 
          options={{ headerShown: false }} 
        />
          <Stack.Screen 
          name="StudentProfile" 
          component={StudentProfile} 
          options={{ headerShown: false }} 
        />

        {/* Home Screen */}
        <Stack.Screen 
          name="Home" 
          component={Home} 
          options={{ headerShown: false }} 
        />

        {/* News Detail Screen */}
        <Stack.Screen 
          name="NewsDetail" 
          component={NewsDetail} 
          options={{ headerShown: false }} 
        />

        {/* Admin Dashboard */}
        <Stack.Screen 
          name="AdminDashboard" 
          component={AdminDashboard} 
          options={{ headerShown: false }} 
        />
        
        {/* Student Dashboard */}
        <Stack.Screen 
          name="ProfileScreen" 
          component={ProfileScreen} 
          options={{ headerShown: false }} 
        />

        {/* Drawer Navigator */}
        <Stack.Screen 
          name="DrawerNavigator" 
          component={DrawerNavigator} 
          options={{ headerShown: false }} 
        />
         {/* Drawer Navigator */}
         <Stack.Screen 
          name="ManageAuthors" 
          component={ManageAuthors} 
          options={{ headerShown: false }} 
        />

        {/* Reset Password Screen */}
        <Stack.Screen 
          name="ResetPasswordScreen" 
          component={ResetPasswordScreen} 
          options={{ headerShown: false }} 
        />

        {/* Student Verification Page */}
        <Stack.Screen 
          name="StudentVerificationPage" 
          component={StudentVerificationPage} 
          options={{ headerShown: false }} 
        />

        {/* Authors Page */}
        <Stack.Screen 
          name="AuthorsPage" 
          component={AuthorsPage} 
          options={{ headerShown: false }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
    </UserProvider>
  );
};

export default App;
