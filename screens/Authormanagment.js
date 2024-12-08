import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Alert,
} from 'react-native';
import { Button } from 'react-native-paper';
import themeContext from '../config/themeContext';
import axios from 'axios';

const ManageAuthors = () => {
  const [authors, setAuthors] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const theme = useContext(themeContext);

  // Fetch authors from the API
  useEffect(() => {
    fetchAuthors();
  }, []);

  const fetchAuthors = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3000/authors');
      setAuthors(response.data);
    } catch (error) {
      console.error('Error fetching authors:', error);
    } finally {
      setLoading(false);
    }
  };

  // Verify author
  const handleVerify = async (email) => {
    try {
      const response = await axios.post('http://localhost:3000/verify-author', { email });
      Alert.alert('Success', 'Author verified successfully!');
      fetchAuthors(); // Refresh the list
    } catch (error) {
      console.error('Error verifying author:', error);
      Alert.alert('Error', 'Failed to verify the author.');
    }
  };

  // Delete author
  const handleDelete = async (email) => {
    console.log('Delete button clicked for:', email); // Debug log
    try {
      console.log('Attempting to delete:', email); // Debug log
      const response = await axios.delete(`http://localhost:3000/delete-author/${email}`);
      console.log('API response:', response.data); // Debug log
      console.log('Author deleted successfully');
      fetchAuthors(); // Refresh the list
    } catch (error) {
      console.error('Error deleting author:', error);
    }
  };
  
  const renderAuthor = ({ item }) => (
    <View style={styles.row}>
      <Text style={[styles.cell, { flex: 2 }]}>{item.name}</Text>
      <Text style={[styles.cell, { flex: 2 }]}>{item.email}</Text>
      <Text style={[styles.cell, { flex: 1 }]}>{item.verified === 'unverified' ? 'No' : 'Yes'}</Text>
      <View style={[styles.cell, styles.actionsCell]}>
        <Button mode="contained" onPress={() => handleVerify(item.email)} style={styles.actionButton}>
          Verify
        </Button>
        <Button
  mode="contained"
  onPress={() => handleDelete(item.email)} // Directly call handleDelete
  color="red"
  style={styles.actionButton}
>
  Delete
</Button>


      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.backColor }]}>
      {isLoading ? (
        <ActivityIndicator size="large" color={theme.textColor} style={styles.loader} />
      ) : (
        <>
          <Text style={[styles.title, { color: theme.textColor }]}>Manage Authors</Text>
          <View style={styles.tableHeader}>
            <Text style={[styles.cell, styles.headerCell, { flex: 2 }]}>Name</Text>
            <Text style={[styles.cell, styles.headerCell, { flex: 2 }]}>Email</Text>
            <Text style={[styles.cell, styles.headerCell, { flex: 1 }]}>Verified</Text>
            <Text style={[styles.cell, styles.headerCell, { flex: 2 }]}>Actions</Text>
          </View>
          <FlatList
            data={authors}
            renderItem={renderAuthor}
            keyExtractor={(item) => item.email} // Use email as the unique key
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
  },
  loader: {
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    alignSelf: 'center',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#638cbd',
    padding: 10,
    borderRadius: 5,
  },
  row: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    marginVertical: 5,
    borderRadius: 5,
    padding: 10,
  },
  cell: {
    fontSize: 16,
    paddingHorizontal: 5,
  },
  headerCell: {
    fontWeight: 'bold',
    color: '#fff',
  },
  actionsCell: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    marginHorizontal: 5,
  },
});

export default ManageAuthors;
