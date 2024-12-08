import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Picker, Alert } from 'react-native'; // Added Alert for response messages
import { Text } from 'react-native-paper';
import Background from '../components/Background';
import Logo from '../components/Logo';
import Header from '../components/Header';
import Button from '../components/Button';
import TextInput from '../components/TextInput';
import BackButton from '../components/BackButton';
import { theme } from '../core/theme';
import { emailValidator } from '../helpers/emailValidator';
// import AdminDashboard from "./screens/Admin";
import AdminDashboard from './Admin';
import { passwordValidator } from '../helpers/passwordValidator';
import { nameValidator } from '../helpers/nameValidator';
import axios from 'axios'; // Import axios for API calls

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState({ value: '', error: '' });
  const [email, setEmail] = useState({ value: '', error: '' });
  const [password, setPassword] = useState({ value: '', error: '' });
  const [retypePassword, setRetypePassword] = useState({ value: '', error: '' });
  const [role, setRole] = useState('User'); // Default role

  const onSignUpPressed = async () => {
    const nameError = nameValidator(name.value);
    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);
    const retypePasswordError = password.value !== retypePassword.value ? "Passwords don't match" : '';

    if (emailError || passwordError || nameError || retypePasswordError) {
      setName({ ...name, error: nameError });
      setEmail({ ...email, error: emailError });
      setPassword({ ...password, error: passwordError });
      setRetypePassword({ ...retypePassword, error: retypePasswordError });
      return;
    }

    // Send data to the backend
    try {
      const response = await axios.post('http://127.0.0.1:3000/register', {
        name: name.value,
        email: email.value,
        password: password.value,
        retypePassword: retypePassword.value,
        role: role,
      });

      // Handle the response
      if (response.status === 201) {
        Alert.alert('Success', 'Registration successful!');
  
        // Log and ensure that the role-based redirect is being reached
        console.log(`Role is ${role}. Proceeding with redirection...`);
        
        const roleLower = role.toLowerCase(); // Convert role to lowercase for case-insensitive comparison
        
        if (roleLower === 'admin') {
          console.log("Redirected to admin panel");
          navigation.reset({
            index: 0,
            routes: [{ name: 'AdminDashboard' }], // Redirect to Admin Page if role is Admin
          });
        } else if (roleLower === 'author') {
          console.log("Redirected to author page");
          navigation.reset({
            index: 0,
            routes: [{ name: 'AuthorsPage' }], // Redirect to Author Page if role is Author
          });
        } else {
          console.log("Redirected to user dashboard");
          navigation.reset({
            index: 0,
            routes: [{ name: 'DrawerNavigator' }], // Default redirect for other roles (User, Student)
          });
        }
        
      }
    } catch (error) {
      // Display error message from the backend
      if (error.response && error.response.data) {
        Alert.alert('Error', error.response.data.message);
      } else {
        Alert.alert('Error', 'Something went wrong. Please try again later.');
      }
    }
  };

  return (
    <Background>
      <BackButton goBack={navigation.goBack} />
      <Logo />
      <Header>Create Account</Header>
      <TextInput
        label="Name"
        returnKeyType="next"
        value={name.value}
        onChangeText={(text) => setName({ value: text, error: '' })}
        error={!!name.error}
        errorText={name.error}
      />
      <TextInput
        label="Email"
        returnKeyType="next"
        value={email.value}
        onChangeText={(text) => setEmail({ value: text, error: '' })}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
      />
      <TextInput
        label="Password"
        returnKeyType="next"
        value={password.value}
        onChangeText={(text) => setPassword({ value: text, error: '' })}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry
      />
      <TextInput
        label="Retype Password"
        returnKeyType="done"
        value={retypePassword.value}
        onChangeText={(text) => setRetypePassword({ value: text, error: '' })}
        error={!!retypePassword.error}
        errorText={retypePassword.error}
        secureTextEntry
      />
      <Picker
        selectedValue={role}
        onValueChange={(itemValue) => setRole(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="User" value="User" />
        <Picker.Item label="Author" value="Author" />
        <Picker.Item label="Student" value="Student" />
        <Picker.Item label="Admin" value="Admin" /> {/* Added Admin role */}
      </Picker>
      <Button
        mode="contained"
        onPress={onSignUpPressed}
        style={{ marginTop: 24 }}
      >
        Sign Up
      </Button>
      <View style={styles.row}>
        <Text>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.replace('LoginScreen')}>
          <Text style={styles.link}>Login</Text>
        </TouchableOpacity>
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  picker: {
    height: 50,
    width: '100%',
    marginVertical: 10,
  },
});
