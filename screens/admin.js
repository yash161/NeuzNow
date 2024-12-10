import React, { useContext } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  StatusBar,
  Image,
  Text,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button } from 'react-native-paper';
import themeContext from '../config/themeContext';

const AdminDashboard = () => {
  const navigation = useNavigation();
  const theme = useContext(themeContext);

  const handleViewUsers = () => {
    navigation.navigate('ManageAuthors');
  };

  const handleLogout = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'LoginScreen' }],
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backColor }]}>
      <StatusBar backgroundColor={theme.statusColor} />

      {/* Header */}
      <View style={styles.headerContainer}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/img/header-logo.png')}
            style={styles.logo}
          />
          <Text style={[styles.mainText, { color: theme.textColor }]}>
            Admin Dashboard
          </Text>
        </View>
        <Button
          mode="contained"
          onPress={handleLogout}
          style={styles.logoutButton}
          labelStyle={styles.logoutButtonText}
        >
          Logout
        </Button>
      </View>

      {/* Admin Actions */}
      <ScrollView>
        <View style={styles.adminActionsContainer}>
          <Button mode="contained" onPress={handleViewUsers} style={styles.adminButton}>
            Manage Users
          </Button>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    backgroundColor: '#638cbd',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 8,
    paddingRight: 10,
    paddingVertical: 10,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 80,
  },
  logo: {
    width: 80,
    height: 80,
  },
  mainText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  logoutButton: {
    backgroundColor: '#d32f2f',
    marginLeft: 'auto',
  },
  logoutButtonText: {
    fontSize: 12,
  },
  adminActionsContainer: {
    marginTop: 20,
    padding: 20,
    alignItems: 'center',
  },
  adminButton: {
    marginBottom: 15,
    width: '80%',
  },
});

export default AdminDashboard;
