import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Dimensions, ActivityIndicator, Linking } from 'react-native';

const NewsDetail = ({ route }) => {
  const { item } = route.params;
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  // Function to summarize the content
  const summarizeContent = async (content) => {
    try {
      const summarized = await generateSummary(content); // Example function
      setSummary(summarized);
    } catch (error) {
      console.error('Failed to summarize content:', error);
      setSummary(content); // Fallback to original content if summarization fails
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (item.content) {
      summarizeContent(item.content);
    } else {
      setSummary(item.description); // Fallback if content is missing
      setLoading(false);
    }
  }, []);

  // Example function for generating summary (replace with actual implementation)
  const generateSummary = async (content) => {
    const words = content.split(' ');
    return words.slice(0, 60).join(' ') + '...';
  };

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: item.urlToImage }}
        style={styles.image}
        onError={() => setImageError(true)}
      />
      {imageError && (
        <Text style={styles.imageErrorText}>
          Image failed to load. Please check your connection or try again later.
        </Text>
      )}
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.author}>By: {item.author}</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Text style={styles.content}>{summary}</Text>
      )}
      <Text style={styles.readMore} onPress={() => Linking.openURL(item.url)}>
        Read the full article here
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  imageErrorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  author: {
    fontSize: 16,
    fontStyle: 'italic',
    marginBottom: 10,
  },
  content: {
    fontSize: 18,
  },
  readMore: {
    color: 'blue',
    marginTop: 20,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});

export default NewsDetail;