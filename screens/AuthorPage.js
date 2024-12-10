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
  const [email, setEmail] = useState('');  // New state for email
  const [newsEntries, setNewsEntries] = useState([
    { category: '', title: '', content: '', document: null, documentName: null },
    { category: '', title: '', content: '', document: null, documentName: null },
    { category: '', title: '', content: '', document: null, documentName: null },
  ]);
  const navigation = useNavigation();

  useEffect(() => {
    const backAction = () => {
      navigation.reset({
        index: 0,
        routes: [{ name: 'LoginScreen' }],
      });
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, [navigation]);

  const handleNewsChange = (index, key, value) => {
    const updatedNews = [...newsEntries];
    updatedNews[index][key] = value;
    setNewsEntries(updatedNews);
  };

  const handlePublish = async () => {
    const namePattern = /^[A-Za-z\s]+$/;
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;  // Email validation pattern
    const nameValid = namePattern.test(authorName);
    const emailValid = emailPattern.test(email);  // Validate email
    const allFieldsFilled = newsEntries.every(
      (entry) => entry.category && entry.title && entry.content
    );
    const wordCountValid = newsEntries.every(
      (entry) => entry.content.trim().split(/\s+/).length <= 500
    );

    if (!nameValid) {
      console.log('Validation Error: Author name can only contain letters and spaces.');
      return;
    }

    if (!emailValid) {
      console.log('Validation Error: Please enter a valid email address.');
      return;
    }

    if (!allFieldsFilled) {
      console.log('Validation Error: Please fill out all fields for each news entry.');
      return;
    }

    if (!wordCountValid) {
      console.log('Validation Error: News content cannot exceed 500 words.');
      return;
    }

    // Prepare the payload
    const payload = {
      authorName,
      email,  // Include email in the payload
      newsEntries,
    };

    try {
      const response = await fetch('http://127.0.0.1:3000/submitNews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const result = await response.json();
        setAuthorName('');
        setEmail('');  // Reset the email state after submission
        setNewsEntries([
          { category: '', title: '', content: '', document: null, documentName: null },
          { category: '', title: '', content: '', document: null, documentName: null },
          { category: '', title: '', content: '', document: null, documentName: null },
        ]);
        console.log('News submitted successfully:', result);
        navigation.navigate('LoginScreen');
      } else {
        const error = await response.json();
        console.log('Submission failed:', error);
      }
    } catch (error) {
      console.log('Error during submission:', error);
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

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Author Email"
            value={email}
            onChangeText={setEmail}
            placeholderTextColor="#777"
            keyboardType="email-address"
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
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0056D2',
    marginLeft: 10,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 10,
    backgroundColor: '#F9FAFC',
    fontSize: 16,
    color: '#333',
  },
  inputAndroid: {
    paddingVertical: 10,
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
