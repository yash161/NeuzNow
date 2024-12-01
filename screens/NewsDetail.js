import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';

const NewsDetail = ({ route }) => {
  const { item } = route.params;
  const [summary, setSummary] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch(`http://localhost:3000/proxy?url=${encodeURIComponent(item.url)}`); // Using proxy server
        const data = await response.json(); // Expecting JSON response
        setSummary(data.summary); // Display the summary
      } catch (error) {
        console.error('Error fetching URL content:', error);
        setErrorMessage('Failed to fetch URL content.');
      }
    };

    fetchContent();
  }, [item.url]);

  return (
    <ScrollView style={styles.container}>
      {item.urlToImage && (
        <Image
          source={{ uri: item.urlToImage }}
          style={styles.newsImage}
        />
      )}
      <Text style={styles.newsTitle}>{item.title}</Text>
      
      {/* Display fetched summary or error */}
      {summary ? (
        <>
          <Text style={styles.summaryTitle}>Summary:</Text> {/* Bold title for summary */}
          <Text style={styles.fetchedContent}>{summary}</Text>
        </>
      ) : (
        <Text style={styles.errorMessage}>{errorMessage}</Text>
      )}
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
  summaryTitle: {
    fontSize: 20,  // Increased font size for summary title
    fontWeight: 'bold', // Bold style for summary title
    marginTop: 10,
  },
  fetchedContent: {
    marginTop: 20,
    fontSize: 16,
    color: '#000',
  },
  errorMessage: {
    marginTop: 20,
    fontSize: 16,
    color: 'red',
  },
});

export default NewsDetail;
