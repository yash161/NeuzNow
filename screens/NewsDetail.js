import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Linking, TouchableOpacity } from 'react-native';

const NewsDetail = ({ route }) => {
  const { item } = route.params; // Access the passed news item

  return (
    <ScrollView style={styles.container}>
      {item.urlToImage && (
        <Image
          source={{ uri: item.urlToImage }}
          style={styles.newsImage}
        />
      )}
      <Text style={styles.newsTitle}>{item.title}</Text>
      <Text style={styles.newsDescription}>{item.description}</Text>
      <Text style={styles.newsContent}>{item.content}</Text>
      
      {/* Display the article URL */}
      <TouchableOpacity onPress={() => Linking.openURL(item.url)}>
        <Text style={styles.articleUrl}>
          Article URL: 
          <Text style={styles.urlText}>
            {item.url}
          </Text>
        </Text>
      </TouchableOpacity>
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
  articleUrl: {
    marginTop: 20,
    fontSize: 16,
    color: '#007BFF', // Change color to indicate clickable link
  },
  urlText: {
    color: '#007BFF', // Use a consistent color for the link
    textDecorationLine: 'underline', // Underline for better visibility
  },
});

export default NewsDetail;