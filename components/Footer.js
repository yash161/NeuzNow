// AppFooter.js (or any other name you prefer)
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AppFooter = () => {
  return (
    <View style={styles.footerContainer}>
      <Text style={styles.footerText}>© 2024 NeuzNow - All Rights Reserved</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    padding: 10,
    backgroundColor: '#4c669f',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  footerText: {
    color: 'white',
    fontSize: 12,
  },
});

export default AppFooter;