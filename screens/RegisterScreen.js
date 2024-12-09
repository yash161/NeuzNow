import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Picker, Alert } from 'react-native'; 
import { Text } from 'react-native-paper';
import Background from '../components/Background';
import Logo from '../components/Logo';
import Header from '../components/Header';
import Button from '../components/Button';
import TextInput from '../components/TextInput';
import BackButton from '../components/BackButton';
import { theme } from '../core/theme';
import { emailValidator } from '../helpers/emailValidator';
import { passwordValidator } from '../helpers/passwordValidator';
import { nameValidator } from '../helpers/nameValidator';
import axios from 'axios'; 

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState({ value: '', error: '' });
  const [email, setEmail] = useState({ value: '', error: '' });
  const [password, setPassword] = useState({ value: '', error: '' });
  const [retypePassword, setRetypePassword] = useState({ value: '', error: '' });
  const [role, setRole] = useState('User'); 

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

    try {
      const response = await axios.post('http://127.0.0.1:3000/register', {
        name: name.value,
        email: email.value,
        password: password.value,
        retypePassword: retypePassword.value,
        role: role,
      });

      if (response.status === 201) {
        Alert.alert('Success', 'Registration successful!');
        
        const roleLower = role.toLowerCase(); 

        if (roleLower === 'admin') {
          navigation.reset({
            index: 0,
            routes: [{ name: 'AdminDashboard' }],
          });
        } else if (roleLower === 'author') {
          navigation.reset({
            index: 0,
            routes: [{ name: 'AuthorsPage' }],
          });
        } else if (roleLower === 'student') {
          navigation.reset({
            index: 0,
            routes: [{ name: 'StudentVerificationPage' }],
          });
        } else {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Home' }],
          });
        }
      }
    } catch (error) {
      if (error.response && error.response.data) {
        Alert.alert('Error', error.response.data.message);
      } else {
        Alert.alert('Error', 'Something went wrong. Please try again later.');
      }
    }
  };

  return (
    <Background>
      {/* Modify the BackButton to handle the back navigation */}
      <BackButton goBack={() => navigation.replace('LoginScreen')} />
      
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
