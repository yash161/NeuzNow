import React, { useEffect, useState, useContext, useRef } from 'react';
import {
  View, StyleSheet, ActivityIndicator, Text, FlatList, ScrollView,
  StatusBar, Image, TouchableOpacity, Animated
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { LinearGradient } from 'expo-linear-gradient';
import newAPI from '../apis/News';
import Card from '../components/Card';
import YourCalendarComponent from '../components/YourCalendarComponent';
import themeContext from '../config/themeContext';
import { UserContext } from './UserContext';
const Tab = createBottomTabNavigator();

const UserMenu = ({ userName, navigation, onLogout }) => {
  const [isMenuVisible, setMenuVisible] = useState(false);

  return (
    <View style={styles.userMenuContainer}>
      <TouchableOpacity onPress={() => setMenuVisible(!isMenuVisible)}>
        <Text style={styles.userName}>{userName}</Text>
      </TouchableOpacity>
      {isMenuVisible && (
        <View style={styles.userMenuDropdown}>
          <TouchableOpacity onPress={() => {
            setMenuVisible(false);
            navigation.navigate('ProfileScreen');
          }}>
            <Text style={styles.userMenuItem}>View Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {
            setMenuVisible(false);
            onLogout();
          }}>
            <Text style={styles.userMenuItem}>Logout</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};
const HomeScreen = () => {
  const [isLoading, setLoading] = useState(true);
  const [news, setNews] = useState([]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const { user } = useContext(UserContext);
  const [userName, setUserName] = useState(user?.user || 'Guest'); // Display user name from context or 'Guest'
   console.log("Logged-in user:", userName);
  const navigation = useNavigation();
  const theme = useContext(themeContext);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const scrollAnim = new Animated.Value(0);
  const sidebarAnim = useRef(new Animated.Value(-300)).current;

  const advertisements = [
    { id: '1', text: '🚀 Your Ad Here! 🚀', color: '#FF6B6B' },
    { id: '2', text: '📣 Special Offer: 50% Off! 📣', color: '#4ECDC4' },
    { id: '3', text: '🎉 Join Our Newsletter for Updates! 🎉', color: '#45B649' },
  ];

  useEffect(() => {
    getNewsFromAPI();
    startAdRotation();
  }, []);

  const getNewsFromAPI = () => {
    newAPI
      .get('top-headlines?country=us&apiKey=1447d07f95c24384a8f4f010a21d5574')
      .then((response) => {
        setNews(response.data.articles);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const startAdRotation = () => {
    setInterval(() => {
      setCurrentAdIndex((prevIndex) => (prevIndex + 1) % advertisements.length);
    }, 3000);
  };

  useEffect(() => {
    Animated.spring(scrollAnim, {
      toValue: -currentAdIndex * 100,
      useNativeDriver: true,
    }).start();
  }, [currentAdIndex]);

  const toggleSidebar = () => {
    Animated.timing(sidebarAnim, {
      toValue: isSidebarVisible ? -300 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setSidebarVisible(!isSidebarVisible);
  };

  const date = new Date().getDate();
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const currentMonth = monthNames[new Date().getMonth()];

  return (
    <View style={[styles.container, { backgroundColor: theme.backColor }]}>
      <StatusBar backgroundColor={theme.statusColor} />
      
      <TouchableOpacity style={styles.topLeftButton} onPress={toggleSidebar}>
        <Icon name="bars" size={24} color="#FFFFFF" />
      </TouchableOpacity>

      <UserMenu 
        userName={userName}
        navigation={navigation}
        onLogout={() => {
          alert('Logged out successfully');
          navigation.replace('LoginScreen');
        }}
      />

      <Animated.View style={[styles.sidebar, { transform: [{ translateX: sidebarAnim }] }]}>
        <View style={styles.sidebarHeader}>
          <TouchableOpacity style={styles.backButton} onPress={toggleSidebar}>
            <Icon name="arrow-left" size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuButton} onPress={toggleSidebar}>
            <Icon name="bars" size={24} color="#000" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.sidebarItem} onPress={() => {
          toggleSidebar();
          navigation.navigate('Home');
        }}>
          <Text style={styles.sidebarText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.sidebarItem} onPress={() => {
          toggleSidebar();
          alert('Articles selected!');
        }}>
          <Text style={styles.sidebarText}>Articles</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.sidebarItem} onPress={() => {
          toggleSidebar();
          alert('Blogs selected!');
        }}>
          <Text style={styles.sidebarText}>Blogs</Text>
        </TouchableOpacity>
      </Animated.View>

      <LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']} style={styles.headerContainer}>
        <View style={styles.logoContainer}>
          <Image source={require('../assets/img/header-logo.png')} style={styles.logo} />
          <Text style={[styles.mainText, { color: '#fff' }]}>NeuzNow</Text>
        </View>
      </LinearGradient>

      <ScrollView>
        <View style={styles.bannerContainer}>
          <Animated.View style={[styles.banner, { transform: [{ translateY: scrollAnim }] }]}>
            {advertisements.map((ad) => (
              <LinearGradient key={ad.id} colors={[ad.color, '#fff']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.bannerItem}>
                <Text style={styles.bannerText}>{ad.text}</Text>
              </LinearGradient>
            ))}
          </Animated.View>
        </View>

        <TouchableOpacity onPress={() => setShowCalendar(!showCalendar)} style={styles.dateContainer}>
          <Icon name="calendar-alt" size={24} color={theme.textColor} />
          <Text style={[styles.dateText, { color: theme.textColor }]}>{currentMonth} {date}</Text>
        </TouchableOpacity>

        {showCalendar && <YourCalendarComponent />}

        <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Trending News</Text>
        {isLoading ? (
          <ActivityIndicator size="large" color="#0096FF" />
        ) : (
          <FlatList
            data={news}
            keyExtractor={(item, index) => 'key' + index}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => navigation.navigate('NewsDetail', { item })}>
                <Card item={item} />
              </TouchableOpacity>
            )}
          />
        )}
        <View style={styles.separator} />
      </ScrollView>
    </View>
  );
};

const NewsScreen = ({ category }) => {
  const [isLoading, setLoading] = useState(true);
  const [news, setNews] = useState([]);
  const navigation = useNavigation();
  const theme = useContext(themeContext);

  useEffect(() => {
    getNewsFromAPI();
  }, []);

  const getNewsFromAPI = () => {
    newAPI.get(`top-headlines?country=us&category=${category}&apiKey=126f7f4b15e5441aa59dfe9edbf6a08a`)
      .then((response) => {
        setNews(response.data.articles);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backColor }]}>
      <LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']} style={styles.headerContainer}>
        <Text style={styles.categoryTitle}>
          {category.charAt(0).toUpperCase() + category.slice(1)} News
        </Text>
      </LinearGradient>
      {isLoading ? (
        <ActivityIndicator size="large" color="#0096FF" />
      ) : (
        <FlatList
          data={news}
          keyExtractor={(item, index) => 'key' + index}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => navigation.navigate('NewsDetail', { item })}>
              <Card item={item} />
            </TouchableOpacity>
          )}
          style={{ marginBottom: 65 }}
        />
      )}
    </View>
  );
};

const App = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Sports') {
            iconName = 'football-ball';
          } else if (route.name === 'Health') {
            iconName = 'heartbeat';
          } else if (route.name === 'Tech') {
            iconName = 'microchip';
          } else if (route.name === 'Business') {
            iconName = 'briefcase';
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4c669f',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: { paddingBottom: 5 },
      })}>
      <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Sports" component={() => <NewsScreen category="sports" />} options={{ headerShown: false }} />
      <Tab.Screen name="Health" component={() => <NewsScreen category="health" />} options={{ headerShown: false }} />
      <Tab.Screen name="Tech" component={() => <NewsScreen category="technology" />} options={{ headerShown: false }} />
      <Tab.Screen name="Business" component={() => <NewsScreen category="business" />} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    paddingTop: 30,
    paddingBottom: 15,
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 30,
    height: 30,
    marginRight: 5,
  },
  mainText: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  dateText: {
    fontSize: 18,
    marginLeft: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingVertical: 10,
  },
  separator: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 20,
  },
  bannerContainer: {
    height: 100,
    overflow: 'hidden',
  },
  banner: {
    flexDirection: 'column',
  },
  bannerItem: {
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerText: {
    color: '#fff',
    fontSize: 16,
  },
  topLeftButton: {
    position: 'absolute',
    left: 15,
    top: 10,
    zIndex: 10,
  },
  sidebar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 300,
    backgroundColor: '#fff',
    zIndex: 1000,
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  sidebarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 5,
  },
  menuButton: {
    padding: 5,
  },
  sidebarItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sidebarText: {
    fontSize: 18,
    color: '#000',
  },
  userMenuContainer: {
    position: 'absolute',
    right: 15,
    top: 10,
    zIndex: 10,
  },
  userName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  userMenuDropdown: {
    position: 'absolute',
    top: 30,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  userMenuItem: {
    fontSize: 16,
    paddingVertical: 5,
    color: '#000',
  },
});

export default App;
