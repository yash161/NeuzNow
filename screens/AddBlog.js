import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import newAPI from '../apis/News';

const AddBlog = ({ navigation, route }) => {
  const { updateBlogsCount } = route.params; // Callback to update blog count in profile
  const [title, setTitle] = useState('');
  const [blogContent, setBlogContent] = useState('');
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
    if (!title.trim() || !blogContent.trim() || !selectedImage) {
      Alert.alert('Error', 'Please fill in all fields and add a photo.');
      return;
    }

    try {
      const newBlog = {
        title,
        content: blogContent,
        image: selectedImage.uri, // Replace with actual file upload logic
      };

      await newAPI.post('/student/blogs', newBlog); // Replace with your API endpoint
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

      {/* Image Picker */}
      {selectedImage ? (
        <Image source={selectedImage} style={styles.imagePreview} />
      ) : (
        <TouchableOpacity style={styles.imagePicker} onPress={selectImage}>
          <Text style={styles.imagePickerText}>Add Blog Photo</Text>
        </TouchableOpacity>
      )}

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
  imagePicker: {
    height: 150,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#f8f8f8',
  },
  imagePickerText: {
    color: '#666',
    fontSize: 16,
  },
  imagePreview: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 15,
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
