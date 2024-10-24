import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';

const NewsDetail = ({ route }) => {
  const { item } = route.params; // Access the passed news item

  // Fallback content if the item is undefined or missing necessary fields
  if (!item) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>News article not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Display image if it exists */}
      {item.urlToImage ? (
        <Image source={{ uri: item.urlToImage }} style={styles.newsImage} />
      ) : (
        <View style={styles.placeholderImage} />
      )}
      <Text style={styles.newsTitle}>{item.title || 'No Title Available'}</Text>
      <Text style={styles.newsDescription}>{item.description || 'No Description Available'}</Text>
      <Text style={styles.newsContent}>{item.content || 'No Content Available'}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  newsImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  placeholderImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#e0e0e0', // Placeholder background color
    borderRadius: 10,
    marginBottom: 10,
  },
  newsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  newsDescription: {
    fontSize: 18,
    marginBottom: 15,
    color: '#555',
  },
  newsContent: {
    fontSize: 16,
    lineHeight: 24,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default NewsDetail;