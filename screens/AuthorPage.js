import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import RNPickerSelect from 'react-native-picker-select';

const categories = [
  { label: "Technology", value: "Technology" },
  { label: "Health", value: "Health" },
  { label: "Sports", value: "Sports" },
  { label: "Business", value: "Business" },
];

const AuthorsPage = () => {
  const [authorName, setAuthorName] = useState('');
  const [authorPhoto, setAuthorPhoto] = useState(null);
  const [newsEntries, setNewsEntries] = useState([
    { category: '', title: '', content: '', document: null, documentName: null },
    { category: '', title: '', content: '', document: null, documentName: null },
    { category: '', title: '', content: '', document: null, documentName: null },
  ]);

  const handleNewsChange = (index, key, value) => {
    const updatedNews = [...newsEntries];
    updatedNews[index][key] = value;
    setNewsEntries(updatedNews);
  };

  const handlePublish = () => {
    const namePattern = /^[A-Za-z]+$/;
    const nameValid = namePattern.test(authorName);
    const allFieldsFilled = newsEntries.every(
      (entry) => entry.category && entry.title && entry.content
    );
    const wordCountValid = newsEntries.every(
      (entry) => entry.content.trim().split(/\s+/).length <= 500
    );

    if (!nameValid) {
      Alert.alert('Validation Error', 'Author name can only contain letters.');
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

    Alert.alert('News Published!', 'All three news articles have been successfully published.');
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

  const removePhoto = () => {
    setAuthorPhoto(null);
  };

  const pickDocument = async (index) => {
    const result = await DocumentPicker.getDocumentAsync({
      type: '*/*',
    });

    if (result.type === 'success') {
      const updatedNews = [...newsEntries];
      updatedNews[index].document = result.uri;
      updatedNews[index].documentName = result.name; // Update document name
      setNewsEntries(updatedNews);
    } else {
      Alert.alert('No document selected', 'You need to select a document.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerContainer}>
        <Ionicons name="newspaper-outline" size={40} color="#000" />
        <Text style={styles.header}>Author Verification Page</Text>
      </View>

      <View style={styles.photoContainer}>
        {authorPhoto ? (
          <>
            <TouchableOpacity onPress={removePhoto} style={styles.removePhotoButton}>
              <Ionicons name="close-circle" size={24} color="#FF0000" />
            </TouchableOpacity>
            <View style={styles.photoBorder}>
              <Image source={{ uri: authorPhoto }} style={styles.photo} />
            </View>
          </>
        ) : (
          <TouchableOpacity style={styles.photoBorder} onPress={selectPhoto}>
            <Ionicons name="person-circle-outline" size={100} color="#007BFF" />
          </TouchableOpacity>
        )}
      </View>

      <Text style={[styles.label, { fontWeight: 'bold', fontSize: 20 }]}>
        Publish 3 News to get Verified
      </Text>

      {newsEntries.map((news, index) => (
        <View key={index} style={styles.newsContainer}>
          <Text style={styles.newsHeader}>News {index + 1}</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>News Category <Text style={styles.required}>*</Text></Text>
            <RNPickerSelect
              onValueChange={(value) => handleNewsChange(index, 'category', value)}
              items={categories}
              style={pickerSelectStyles}
              placeholder={{ label: 'Select a category', value: null }}
              value={news.category}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>News Title <Text style={styles.required}>*</Text></Text>
            <TextInput
              style={styles.input}
              placeholder="Enter news title"
              value={news.title}
              onChangeText={(value) => handleNewsChange(index, 'title', value)}
              placeholderTextColor="#777"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>News Content <Text style={styles.required}>*</Text></Text>
            <View style={styles.textAreaContainer}>
              <TouchableOpacity
                style={styles.uploadDocumentButton}
                onPress={() => pickDocument(index)}
              >
                <Ionicons name="link" size={24} color="#007BFF" />
              </TouchableOpacity>
              <Text style={styles.documentName}>
                {news.documentName ? `Uploaded: ${news.documentName}` : 'No document uploaded.'}
              </Text>
              <TextInput
                style={styles.textArea}
                value={news.content}
                onChangeText={(value) => handleNewsChange(index, 'content', value)}
                multiline={true}
                numberOfLines={6}
                placeholder="Enter news content"
                placeholderTextColor="#777"
              />
            </View>
          </View>
        </View>
      ))}

      <TouchableOpacity style={styles.publishButton} onPress={handlePublish}>
        <Ionicons name="send" size={20} color="#fff" />
        <Text style={styles.publishButtonText}>Get Verified</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    height: 50,
    borderColor: '#000',
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#333',
    marginTop: 5,
  },
  inputAndroid: {
    height: 50,
    borderColor: '#000',
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#333',
    marginTop: 5,
  },
  placeholder: {
    color: '#777',
  },
});

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginLeft: 10,
    color: '#000',
  },
  photoContainer: {
    alignSelf: 'center',
    marginBottom: 15,
    position: 'relative',
  },
  photoBorder: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderColor: '#000',
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  removePhotoButton: {
    position: 'absolute',
    top: 24,
    right: 5,
    backgroundColor: 'transparent',
  },
  inputContainer: {
    marginVertical: 10,
  },
  input: {
    height: 50,
    borderColor: '#000',
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    fontSize: 16,
    marginTop: 5,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  required: {
    color: '#FF0000',
    fontSize: 16,
  },
  textAreaContainer: {
    borderWidth: 2,
    borderRadius: 10,
    borderColor: '#000',
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginTop: 5,
  },
  textArea: {
    textAlignVertical: 'top',
    fontSize: 16,
    color: '#333',
    height: 120,
    marginTop: 5,
  },
  uploadDocumentButton: {
    alignSelf: 'flex-start',
  },
  documentName: {
    marginTop: 5,
    fontSize: 16,
    color: '#007BFF',
  },
  newsContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  newsHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  publishButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#15700b',
    padding: 15,
    borderRadius: 10,
  },
  publishButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 5,
  },
});

export default AuthorsPage;
