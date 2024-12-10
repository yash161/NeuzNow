import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import themeContext from '../config/themeContext';
import axios from 'axios';

const GetAuthors = () => {
  const [authorNews, setAuthorNews] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const theme = useContext(themeContext);

  useEffect(() => {
    fetchAuthorsNews();
  }, []);

  const fetchAuthorsNews = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3000/getAuthorNews');
      setAuthorNews(response.data);
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
      {isLoading ? (
        <ActivityIndicator size="large" color={theme.textColor} style={styles.loader} />
      ) : (
        <>
          <Text style={[styles.title, { color: theme.textColor }]}>Author Blogs</Text>
          <View style={styles.tableHeader}>
            <Text style={styles.headerCell}>Author</Text>
            <Text style={styles.headerCell}>News ID</Text>
            <Text style={styles.headerCell}>Category</Text>
            <Text style={styles.headerCell}>Title</Text>
            <Text style={styles.headerCell}>Content</Text>
          </View>
          <FlatList
            data={authorNews}
            renderItem={renderAuthorNews}
            keyExtractor={(item) => item.news_id.toString()}
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
  loader: {
    marginTop: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#34495E',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#34495E',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
  },
  headerCell: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
    flex: 1,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    backgroundColor: '#F7F9F9',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 6,
    elevation: 1,
  },
  cell: {
    fontSize: 14,
    flex: 1,
    textAlign: 'center',
    color: '#2C3E50',
  },
});

export default GetAuthors;
