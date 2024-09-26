import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import RNPickerSelect from 'react-native-picker-select';

const categories = [
  { label: "Technology", value: "Technology" },
  { label: "Health", value: "Health" },
  { label: "Sports", value: "Sports" },
  { label: "Business", value: "Business" },
  { label: "Entertainment", value: "Entertainment" },
  { label: "Politics", value: "Politics" },
  { label: "Science", value: "Science" },
];

const AuthorsPage = () => {
  const [authorName, setAuthorName] = useState('');
  const [newsTitle, setNewsTitle] = useState('');
  const [newsContent, setNewsContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [authorPhoto, setAuthorPhoto] = useState(null);

  const handlePublish = () => {
    const namePattern = /^[A-Za-z]+$/;
    const wordCount = newsContent.trim().split(/\s+/).length;

    if (!namePattern.test(authorName)) {
      Alert.alert('Validation Error', 'Author name can only contain letters.');
      return;
    }

    if (wordCount > 500) {
      Alert.alert('Validation Error', 'News content cannot exceed 500 words.');
      return;
    }

    if (authorName && newsTitle && newsContent && selectedCategory) {
      Alert.alert('News Published!', `Your news in the category "${selectedCategory}" has been published by ${authorName}.`);
      setAuthorName('');
      setNewsTitle('');
      setNewsContent('');
      setSelectedCategory('');
      setAuthorPhoto(null);
    } else {
      Alert.alert('Error', 'Please fill out all fields before publishing.');
    }
  };

  const handleAuthorNameChange = (text) => {
    const formattedText = text.replace(/[^A-Za-z]/g, '');
    if (formattedText) {
      const capitalizedText = formattedText.charAt(0).toUpperCase() + formattedText.slice(1);
      setAuthorName(capitalizedText);
    } else {
      setAuthorName('');
    }
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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerContainer}>
        <Ionicons name="newspaper-outline" size={40} color="#000" />
        <Text style={styles.header}>Author Publish News</Text>
      </View>

      {/* Author Photo Section */}
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

      {/* Input Fields */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Author Name <Text style={styles.required}>*</Text></Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          value={authorName}
          onChangeText={handleAuthorNameChange}
          autoCapitalize="none"
          placeholderTextColor="#777"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>News Category <Text style={styles.required}>*</Text></Text>
        <RNPickerSelect
          onValueChange={(value) => setSelectedCategory(value)}
          items={categories}
          style={pickerSelectStyles}
          placeholder={{ label: 'Select a category', value: null }}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>News Title <Text style={styles.required}>*</Text></Text>
        <TextInput
          style={styles.input}
          placeholder="Enter news title"
          value={newsTitle}
          onChangeText={setNewsTitle}
          placeholderTextColor="#777"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>News Content <Text style={styles.required}>*</Text></Text>
        <TextInput
          style={styles.textArea}
          placeholder="Write your news content here..."
          value={newsContent}
          onChangeText={setNewsContent}
          multiline={true}
          numberOfLines={6}
          placeholderTextColor="#777"
        />
      </View>

      <TouchableOpacity
        style={styles.publishButton}
        onPress={handlePublish}
      >
        <Ionicons name="send" size={20} color="#fff" />
        <Text style={styles.publishButtonText}>Publish News</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    height: 50, // Same height as other input fields
    borderColor: '#000',
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: '#fff', // Set to white
    fontSize: 16,
    color: '#333',
    marginTop: 5, // Add some spacing from the label
  },
  inputAndroid: {
    height: 50, // Same height as other input fields
    borderColor: '#000',
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: '#fff', // Set to white
    fontSize: 16,
    color: '#333',
    marginTop: 5, // Add some spacing from the label
  },
  placeholder: {
    color: '#777',
  },
});

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff', // Set container background to white
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
    position: 'relative', // Added for positioning the remove button
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
    top: -10,
    right: -10,
    backgroundColor: 'transparent', // Removed orange color
  },
  inputContainer: {
    marginBottom: 15,
    alignSelf: 'center',
    width: '37.5%',
  },
  label: {
    fontSize: 16,
    color: '#000', // Set to black for contrast
    marginBottom: 5,
    fontWeight: '600',
    textAlign: 'center',
  },
  required: {
    color: 'red',
  },
  input: {
    height: 50,
    borderColor: '#000',
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: '#fff', // Set to white
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    height: 150,
    borderColor: '#000',
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingTop: 10,
    backgroundColor: '#fff', // Set to white
    textAlignVertical: 'top',
    fontSize: 16,
    color: '#333',
  },
  publishButton: {
    flexDirection: 'row',
    paddingVertical: 15,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    backgroundColor: '#0056b3',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    alignSelf: 'center',
    width: '30%',
  },
  publishButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default AuthorsPage;
