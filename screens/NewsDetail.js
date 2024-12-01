import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from "react-native";

const NewsDetail = ({ route, navigation }) => {
  const { item } = route.params; // Receiving the news item from Home
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
      {/* Custom Back Arrow */}
      <TouchableOpacity onPress={() => navigation.navigate("Home")}>
        <Text style={styles.backArrow}>←</Text> {/* Custom back arrow */}
      </TouchableOpacity>

      {item.urlToImage && (
        <Image
          source={{ uri: item.urlToImage }}
          style={styles.newsImage}
        />
      )}
      <Text style={styles.newsTitle}>{item.title}</Text>
      <Text style={styles.author}>By {item.author || "Unknown"}</Text>

      {/* Display fetched summary or error */}
      {summary ? (
        <>
          <Text style={styles.summaryTitle}>Summary:</Text>
          <Text style={styles.fetchedContent}>{summary}</Text>
        </>
      ) : (
        <Text style={styles.errorMessage}>{errorMessage || item.content || "No content available"}</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  newsImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  newsTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  author: {
    fontSize: 16,
    fontStyle: "italic",
    marginBottom: 10,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
  },
  fetchedContent: {
    marginTop: 10,
    fontSize: 16,
    color: "#000",
  },
  errorMessage: {
    marginTop: 10,
    fontSize: 16,
    color: "red",
  },
  backArrow: {
    fontSize: 30,
    color: "black",
    marginBottom: 10,
    marginLeft: 10,
  },
});

export default NewsDetail;
