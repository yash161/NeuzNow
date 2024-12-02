import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import Background from '../components/Background';
import Logo from '../components/Logo';
import Header from '../components/Header';
import Button from '../components/Button';
import TextInput from '../components/TextInput';
import BackButton from '../components/BackButton';
import { theme } from '../core/theme';
import { emailValidator } from '../helpers/emailValidator';

export default function ResetPasswordScreen({ navigation }) {
  const [email, setEmail] = useState({ value: '', error: '' });
  const [message, setMessage] = useState('');

  const onSendPressed = async () => {
    const emailError = emailValidator(email.value);
    if (emailError) {
      setEmail({ ...email, error: emailError });
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:3000/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.value }),
      });

      const jsonResponse = await response.json();
      if (response.ok) {
        setMessage('Check your email for reset instructions.');
      } else {
        setEmail({ ...email, error: jsonResponse.message });
      }
    } catch (error) {
      console.error('Error sending reset link:', error);
      setEmail({ ...email, error: 'Something went wrong. Please try again.' });
    }
  };

  return (
    <Background>
      <BackButton goBack={navigation.goBack} />
      <Logo />
      <Header>Reset Password</Header>
      <TextInput
        label="Email"
        value={email.value}
        onChangeText={(text) => setEmail({ value: text, error: '' })}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        keyboardType="email-address"
      />
      {message ? <Text style={styles.message}>{message}</Text> : null}
      <Button mode="contained" onPress={onSendPressed}>
        Send Reset Link
      </Button>
    </Background>
  );
}

const styles = StyleSheet.create({
  message: {
    fontSize: 14,
    color: theme.colors.primary,
    marginTop: 10,
    textAlign: 'center',
  },
});
