import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import themeContext from '../config/themeContext';
import axios from 'axios';

const GetAuthors = ({ navigation }) => {
  const [authorNews, setAuthorNews] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const theme = useContext(themeContext);

  // Fetch authors and news data from the API
  useEffect(() => {
    fetchAuthorsNews();
  }, []);

  const fetchAuthorsNews = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3000/getAuthorNews');
      setAuthorNews(response.data); // Assuming response.data is an array of author news
    } catch (error) {
      console.error('Error fetching authors news:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderAuthorNews = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.author_name}</Text>
      <Text style={styles.cell}>{item.news_id}</Text>
      <Text style={styles.cell}>{item.category}</Text>
      <Text style={styles.cell}>{item.title}</Text>
      <Text style={styles.cell}>{item.content}</Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.backColor }]}>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate('Home')} // Navigate to the home page
      >
        <Text style={styles.backButtonText}>{'<-'}</Text>
      </TouchableOpacity>

      {isLoading ? (
        <ActivityIndicator size="large" color={theme.textColor} style={styles.loader} />
      ) : (
        <>
          <Text style={[styles.title, { color: theme.textColor }]}>Author Blogs</Text>
          <View style={styles.tableHeader}>
            <Text style={[styles.headerCell]}>Author</Text>
            <Text style={[styles.headerCell]}>News ID</Text>
            <Text style={[styles.headerCell]}>Category</Text>
            <Text style={[styles.headerCell]}>Title</Text>
            <Text style={[styles.headerCell]}>Content</Text>
          </View>
          <FlatList
            data={authorNews}
            renderItem={renderAuthorNews}
            keyExtractor={(item) => item.news_id.toString()} // Use news_id as the unique key
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    paddingTop: 20,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 10,
    zIndex: 1,
  },
  backButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loader: {
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#2C3E50',
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginBottom: 10,
    borderRadius: 5,
  },
  headerCell: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    backgroundColor: '#ECF0F1',
    marginVertical: 5,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 5,
    borderBottomWidth: 1,
    borderColor: '#BDC3C7',
  },
  cell: {
    fontSize: 16,
    flex: 1,
    textAlign: 'center',
    color: '#2C3E50',
  },
});

export default GetAuthors;
