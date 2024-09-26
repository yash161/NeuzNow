// App.js
import React from 'react';
import { SafeAreaView, Text, StyleSheet } from 'react-native';
// /zimport AuthorsPage from './author/AuthorsPage'; // Include the subdirectory in the path
import AuthorsPage from './AuthorsPage';
const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <AuthorsPage /> {/* Try commenting this out to check if something else renders */}
      {/* <Text>Hello, World!</Text> Uncomment this to test basic rendering */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default App;
