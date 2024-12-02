import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const StudentVerificationPage = () => {
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

  const handleVerifyStudent = () => {
    if (!studentName || !studentUniversity || !enrollmentNumber || !frontPhoto || !backPhoto) {
      Alert.alert('Validation Error', 'Please fill out all fields and upload both ID card photos.');
      return;
    }

    Alert.alert('Verification Submitted!', 'Student verification has been successfully submitted.');
    setStudentName('');
    setStudentUniversity('');
    setEnrollmentNumber('');
    setFrontPhoto(null);
    setBackPhoto(null);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerContainer}>
        <Ionicons name="school-outline" size={40} color="#000" />
        <Text style={styles.header}>Student Verification</Text>
      </View>

      {/* Student Name */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Student Name <Text style={styles.required}>*</Text></Text>
        <TextInput
          style={styles.input}
          placeholder="Enter student name"
          value={studentName}
          onChangeText={setStudentName}
          placeholderTextColor="#777"
        />
      </View>

      {/* Student University */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Student University <Text style={styles.required}>*</Text></Text>
        <TextInput
          style={styles.input}
          placeholder="Enter student university"
          value={studentUniversity}
          onChangeText={setStudentUniversity}
          placeholderTextColor="#777"
        />
      </View>

      {/* Enrollment Number */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Enrollment Number <Text style={styles.required}>*</Text></Text>
        <TextInput
          style={styles.input}
          placeholder="Enter enrollment number"
          value={enrollmentNumber}
          onChangeText={setEnrollmentNumber}
          placeholderTextColor="#777"
        />
      </View>

      {/* ID Card Photos */}
      <Text style={styles.sectionHeader}>Upload University ID Card</Text>

      <View style={styles.photoContainer}>
        <Text style={styles.label}>Front Photo <Text style={styles.required}>*</Text></Text>
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
        <Text style={styles.label}>Back Photo <Text style={styles.required}>*</Text></Text>
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

      {/* Verify Button */}
      <TouchableOpacity style={styles.verifyButton} onPress={handleVerifyStudent}>
        <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
        <Text style={styles.verifyButtonText}>Verify Student</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

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
  inputContainer: {
    marginBottom: 15,
  },
  input: {
    height: 50,
    borderColor: '#000',
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
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
    borderWidth: 2,
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
    backgroundColor: '#007313',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  verifyButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 10,
  },
});

export default StudentVerificationPage;