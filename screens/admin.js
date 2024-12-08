import React, { useEffect, useState, useContext } from 'react';
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

  // Navigate to Manage Authors screen
  const handleViewUsers = () => {
    navigation.navigate('ManageAuthors');
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
      </View>

      {/* Admin Actions */}
      <ScrollView>
        <View style={styles.adminActionsContainer}>
          <Button mode="contained" onPress={handleViewUsers} style={styles.adminButton}>
            Manage Authors
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
    elevation: 8,
  },
  logoContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 100,
  },
  logo: {
    width: 100,
    height: 100,
  },
  mainText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginLeft: -15,
    marginTop: -10,
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
