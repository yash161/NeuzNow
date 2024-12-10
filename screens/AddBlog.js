import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import newAPI from '../apis/News';
import { UserContext } from './UserContext';

const AddBlog = ({ navigation, route }) => {
  const { updateBlogsCount } = route.params; // Callback to update blog count in profile
  const [title, setTitle] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const { user } = useContext(UserContext);
  const [studentName, setUserName] = useState(user?.user || 'Guest');
  const [selectedImage, setSelectedImage] = useState(null);

  const selectImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission required', 'Camera roll access is required to upload a photo.');
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!pickerResult.canceled) {
      setSelectedImage({ uri: pickerResult.assets[0].uri });
    }
  };

  const handlePublish = async () => {
    if (!title.trim() || !blogContent.trim()) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    try {
      const newBlog = { studentName, title, content: blogContent };

      await newAPI.post('http://127.0.0.1:3000/blogs', newBlog);
      Alert.alert('Success', 'Blog published successfully!');
      updateBlogsCount(); // Call the callback to update blogs count
      navigation.goBack(); // Navigate back to the profile
    } catch (error) {
      console.error('Error publishing blog:', error);
      Alert.alert('Error', 'Something went wrong while publishing the blog.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate('ProfileScreen')}
      >
        <Text style={styles.backButtonText}>{'<-'}</Text>
      </TouchableOpacity>

      <Text style={styles.headerText}>Add New Blog</Text>

      {/* Title Input */}
      <TextInput
        style={styles.input}
        placeholder="Enter Blog Title"
        placeholderTextColor="#aaa"
        value={title}
        onChangeText={setTitle}
      />

      {/* Blog Content Input */}
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Write your blog content here..."
        placeholderTextColor="#aaa"
        value={blogContent}
        onChangeText={setBlogContent}
        multiline
        numberOfLines={10}
      />

      {/* Publish Button */}
      <TouchableOpacity style={styles.publishButton} onPress={handlePublish}>
        <Text style={styles.publishButtonText}>Publish Blog</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
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
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  textArea: {
    height: 150,
    textAlignVertical: 'top',
  },
  publishButton: {
    backgroundColor: '#4c669f',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  publishButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddBlog;
