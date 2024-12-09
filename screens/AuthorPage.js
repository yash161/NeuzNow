import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, BackHandler } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import RNPickerSelect from 'react-native-picker-select';

const categories = [
  { label: 'Technology', value: 'Technology' },
  { label: 'Health', value: 'Health' },
  { label: 'Sports', value: 'Sports' },
  { label: 'Business', value: 'Business' },
];

const AuthorsPage = () => {
  const [authorName, setAuthorName] = useState('');
  const [authorPhoto, setAuthorPhoto] = useState(null);
  const [newsEntries, setNewsEntries] = useState([
    { category: '', title: '', content: '', document: null, documentName: null },
    { category: '', title: '', content: '', document: null, documentName: null },
    { category: '', title: '', content: '', document: null, documentName: null },
  ]);
  const navigation = useNavigation();

  useEffect(() => {
    // Handle back button press
    const backAction = () => {
      // Reset the navigation stack to the Login page
      navigation.reset({
        index: 0,
        routes: [{ name: 'LoginScreen' }],
      });
      return true; // Prevent the default back action
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    // Cleanup the listener on component unmount
    return () => backHandler.remove();
  }, [navigation]);

  const handleNewsChange = (index, key, value) => {
    const updatedNews = [...newsEntries];
    updatedNews[index][key] = value;
    setNewsEntries(updatedNews);
  };

  const handlePublish = () => {
    const namePattern = /^[A-Za-z\s]+$/;
    const nameValid = namePattern.test(authorName);
    const allFieldsFilled = newsEntries.every(
      (entry) => entry.category && entry.title && entry.content
    );
    const wordCountValid = newsEntries.every(
      (entry) => entry.content.trim().split(/\s+/).length <= 500
    );

    if (!nameValid) {
      Alert.alert('Validation Error', 'Author name can only contain letters and spaces.');
      return;
    }

    if (!allFieldsFilled) {
      Alert.alert('Validation Error', 'Please fill out all fields for each news entry.');
      return;
    }

    if (!wordCountValid) {
      Alert.alert('Validation Error', 'News content cannot exceed 500 words.');
      return;
    }

    Alert.alert('News Published!', 'All news articles have been successfully published.');
    setAuthorName('');
    setAuthorPhoto(null);
    setNewsEntries([
      { category: '', title: '', content: '', document: null, documentName: null },
      { category: '', title: '', content: '', document: null, documentName: null },
      { category: '', title: '', content: '', document: null, documentName: null },
    ]);
  };

  const selectPhoto = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert('Permission Denied', 'You need to enable permission to access the photo library.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setAuthorPhoto(result.assets[0].uri);
    }
  };

  const pickDocument = async (index) => {
    const result = await DocumentPicker.getDocumentAsync({
      type: '*/*',
    });

    if (result.type === 'success') {
      const updatedNews = [...newsEntries];
      updatedNews[index].document = result.uri;
      updatedNews[index].documentName = result.name;
      setNewsEntries(updatedNews);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Ionicons name="newspaper-outline" size={40} color="#0056D2" />
          <Text style={styles.header}>Author Verification</Text>
        </View>

        {/* Back Button */}
        <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')} style={styles.backButton}>
          <Ionicons name="arrow-back" size={30} color="#0056D2" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Author Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Author Name"
            value={authorName}
            onChangeText={setAuthorName}
            placeholderTextColor="#777"
          />
        </View>

        {newsEntries.map((news, index) => (
          <View key={index} style={styles.inputContainer}>
            <Text style={styles.label}>News {index + 1}</Text>
            <RNPickerSelect
              onValueChange={(value) => handleNewsChange(index, 'category', value)}
              items={categories}
              style={pickerSelectStyles}
              placeholder={{ label: 'Select a category', value: null }}
              value={news.category}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter news title"
              value={news.title}
              onChangeText={(value) => handleNewsChange(index, 'title', value)}
              placeholderTextColor="#777"
            />
            <TextInput
              style={styles.textArea}
              placeholder="Enter news content"
              value={news.content}
              onChangeText={(value) => handleNewsChange(index, 'content', value)}
              multiline
              numberOfLines={4}
              placeholderTextColor="#777"
            />
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={() => pickDocument(index)}
            >
              <Ionicons name="document-outline" size={20} color="#007BFF" />
              <Text style={styles.uploadButtonText}>
                {news.documentName ? `Uploaded: ${news.documentName}` : 'Upload Document'}
              </Text>
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity style={styles.verifyButton} onPress={handlePublish}>
          <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
          <Text style={styles.verifyButtonText}>Submit Verification</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E8F0F9',
    padding: 20,
  },
  container: {
    width: '100%',
    maxWidth: 400,
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#0056D2',
  },
  inputContainer: {
    marginBottom: 15,
  },
  input: {
    height: 50,
    borderColor: '#DDDDDD',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: '#F9FAFC',
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    height: 100,
    backgroundColor: '#F9FAFC',
    textAlignVertical: 'top',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  photoContainer: {
    marginBottom: 15,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  uploadButtonText: {
    marginLeft: 5,
    color: '#007BFF',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButtonText: {
    fontSize: 18,
    color: '#0056D2',
    marginLeft: 10,
  },
  verifyButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#28A745',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  verifyButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 10,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    height: 50,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 10,
    backgroundColor: '#F9FAFC',
    fontSize: 16,
    color: '#333',
  },
  inputAndroid: {
    height: 50,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 10,
    backgroundColor: '#F9FAFC',
    fontSize: 16,
    color: '#333',
  },
});

export default AuthorsPage;
