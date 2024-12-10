import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Modal,
  Button,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import themeContext from '../config/themeContext';
import newAPI from '../apis/News';
import { UserContext } from './UserContext';

const ProfileScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [blogs, setBlogs] = useState([]);
  const [profilePhoto, setProfilePhoto] = useState(require('../assets/UML_State_2_updated.png'));
  const { user } = useContext(UserContext);
  const [studentName, setUserName] = useState(user?.user || 'Guest');
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const theme = useContext(themeContext);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchBlogs = async () => {
      if (!studentName) return;
      try {
        const response = await newAPI.get(`http://127.0.0.1:3000/displayblogs?user=${studentName}`);
        setBlogs(response.data.blogs || []);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, [studentName]);

  const selectProfilePhoto = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert('Permission to access camera roll is required!');
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!pickerResult.canceled) {
      setProfilePhoto({ uri: pickerResult.assets[0].uri });
    }
  };

  const handleEditName = () => {
    setIsEditModalVisible(true);
  };

  const saveName = () => {
    setIsEditModalVisible(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backColor }]}>
      {/* Header Section */}
      <LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']} style={styles.header}>
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.backButtonText}>{'<-'}</Text>
        </TouchableOpacity>

        {/* Profile Details */}
        <View style={styles.profileContainer}>
          <TouchableOpacity onPress={selectProfilePhoto}>
            <Image source={profilePhoto} style={styles.profileImage} />
          </TouchableOpacity>
          <View style={styles.profileDetails}>
            <TouchableOpacity onPress={handleEditName}>
              <Text style={[styles.userName, { color: theme.textColor }]}>{studentName}</Text>
            </TouchableOpacity>
            <Text style={[styles.blogCount, { color: theme.textColor }]}>
              Total Blogs: {blogs.length}
            </Text>
            <TouchableOpacity
              style={styles.addBlogButton}
              onPress={() =>
                navigation.navigate('AddBlog', {
                  updateBlogsCount: () => setBlogs([...blogs, {}]),
                })
              }
            >
              <Text style={styles.addBlogText}>Add Blog</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      {/* Blogs Section */}
      <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Your Blogs</Text>
      {isLoading ? (
        <ActivityIndicator size="large" color="#0096FF" />
      ) : blogs.length > 0 ? (
        <FlatList
          data={blogs}
          keyExtractor={(item, index) => `blog-${index}`}
          numColumns={3}
          contentContainerStyle={styles.blogsGrid}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.blogCard}
              onPress={() => navigation.navigate('BlogDetail', { blog: item })}
            >
              <Image source={{ uri: item.image }} style={styles.blogImage} />
              <Text style={styles.blogTitle} numberOfLines={2}>
                {item.title}
              </Text>
            </TouchableOpacity>
          )}
        />
      ) : (
        <Text style={[styles.noBlogsText, { color: theme.textColor }]}>No Blogs Uploaded</Text>
      )}

      {/* Modal for Editing Name */}
      <Modal visible={isEditModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Name</Text>
            <TextInput
              style={styles.input}
              value={studentName}
              onChangeText={setUserName}
              placeholder="Enter your name"
              placeholderTextColor="#aaa"
            />
            <Button title="Save" onPress={saveName} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    position: 'absolute',
    left: 10,
    top: 20,
    zIndex: 1,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 50,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  profileDetails: {
    marginLeft: 10,
    alignItems: 'flex-start',
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  blogCount: {
    fontSize: 14,
    marginTop: 5,
  },
  addBlogButton: {
    marginTop: 10,
    backgroundColor: '#3b5998',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  addBlogText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    marginHorizontal: 10,
  },
  blogsGrid: {
    paddingHorizontal: 10,
  },
  blogCard: {
    flex: 1,
    margin: 5,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 2,
  },
  blogImage: {
    width: '100%',
    height: 100,
  },
  blogTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    padding: 5,
    textAlign: 'center',
  },
  noBlogsText: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
  },
});

export default ProfileScreen;
