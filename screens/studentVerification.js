import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios'; // Import axios

const StudentVerificationPage = ({ navigation }) => {
  const [studentName, setStudentName] = useState('');
  const [studentUniversity, setStudentUniversity] = useState('');
  const [enrollmentNumber, setEnrollmentNumber] = useState('');
  const [frontPhoto, setFrontPhoto] = useState(null);
  const [backPhoto, setBackPhoto] = useState(null);

  const selectPhoto = async (setPhoto) => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
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
      setPhoto(result.assets[0].uri);
    }
  };

  const handleVerifyStudent = async () => {
    if (!studentName || !studentUniversity || !enrollmentNumber || !frontPhoto || !backPhoto) {
      Alert.alert('Validation Error', 'Please fill out all fields and upload both ID card photos.');
      return;
    }
  
    try {
      const formData = new FormData();
      formData.append('studentName', studentName);
      formData.append('studentUniversity', studentUniversity);
      formData.append('enrollmentNumber', enrollmentNumber);
      formData.append('frontPhoto', {
        uri: frontPhoto,
        type: 'image/jpeg',
        name: 'frontPhoto.jpg',
      });
      formData.append('backPhoto', {
        uri: backPhoto,
        type: 'image/jpeg',
        name: 'backPhoto.jpg',
      });
  
      const response = await axios.post('http://127.0.0.1:3000/verifyStudent', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      if (response.status === 200) {
        setStudentName('');
        setStudentUniversity('');
        setEnrollmentNumber('');
        setFrontPhoto(frontPhoto);
        setBackPhoto(backPhoto);
      } else {
        console.log('Error', response.data.message);
      }
    } catch (error) {
      console.error('Error submitting verification:', error);
      console.log('Error', 'Something went wrong while submitting verification.');
    }
  };
  
  
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {/* Back Button */}
        <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')} style={styles.backButton}>
          <Ionicons name="arrow-back" size={30} color="#0056D2" />
        </TouchableOpacity>

        <View style={styles.headerContainer}>
          <Ionicons name="school-outline" size={40} color="#0056D2" />
          <Text style={styles.header}>Student Verification</Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>
            Student Name <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Enter student name"
            value={studentName}
            onChangeText={setStudentName}
            placeholderTextColor="#777"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>
            Student University <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Enter student university"
            value={studentUniversity}
            onChangeText={setStudentUniversity}
            placeholderTextColor="#777"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>
            Enrollment Number <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Enter enrollment number"
            value={enrollmentNumber}
            onChangeText={setEnrollmentNumber}
            placeholderTextColor="#777"
          />
        </View>

        <Text style={styles.sectionHeader}>Upload University ID Card</Text>

        <View style={styles.photoContainer}>
          <Text style={styles.label}>
            Front Photo <Text style={styles.required}>*</Text>
          </Text>
          {frontPhoto ? (
            <View style={styles.photoWrapper}>
              <Image source={{ uri: frontPhoto }} style={styles.photo} />
              <TouchableOpacity onPress={() => setFrontPhoto(null)} style={styles.removePhotoButton}>
                <Ionicons name="close-circle" size={24} color="#FF0000" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.photoUploader} onPress={() => selectPhoto(setFrontPhoto)}>
              <Ionicons name="camera-outline" size={50} color="#007BFF" />
              <Text style={styles.uploadText}>Upload Front Photo</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.photoContainer}>
          <Text style={styles.label}>
            Back Photo <Text style={styles.required}>*</Text>
          </Text>
          {backPhoto ? (
            <View style={styles.photoWrapper}>
              <Image source={{ uri: backPhoto }} style={styles.photo} />
              <TouchableOpacity onPress={() => setBackPhoto(null)} style={styles.removePhotoButton}>
                <Ionicons name="close-circle" size={24} color="#FF0000" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.photoUploader} onPress={() => selectPhoto(setBackPhoto)}>
              <Ionicons name="camera-outline" size={50} color="#007BFF" />
              <Text style={styles.uploadText}>Upload Back Photo</Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity style={styles.verifyButton} onPress={handleVerifyStudent}>
          <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
          <Text style={styles.verifyButtonText}>Verify Student</Text>
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
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  required: {
    color: 'red',
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007BFF',
    marginBottom: 10,
  },
  photoContainer: {
    marginBottom: 15,
  },
  photoUploader: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 150,
    borderWidth: 1,
    borderColor: '#007BFF',
    borderRadius: 10,
    backgroundColor: '#F0F8FF',
  },
  photo: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },
  photoWrapper: {
    position: 'relative',
    alignSelf: 'center',
  },
  removePhotoButton: {
    position: 'absolute',
    top: 5,
    right: 5,
  },
  uploadText: {
    fontSize: 16,
    color: '#007BFF',
    marginTop: 5,
  },
  verifyButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#28A745',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  verifyButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 10,
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 1,
  },
});

export default StudentVerificationPage;
