import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  FlatList,
  ScrollView,
  StatusBar,
  Image,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'; // Import bottom tab navigator
import Icon from 'react-native-vector-icons/FontAwesome';
import newAPI from '../apis/News';
import Card from '../components/Card';
import TrendNews from '../screens/TrendNews';
import YourCalendarComponent from '../components/YourCalendarComponent'; 
import themeContext from '../config/themeContext';

// Create a bottom tab navigator
const Tab = createBottomTabNavigator();

const HomeScreen = () => {
  const [isLoading, setLoading] = useState(true);
  const [news, setNews] = useState([]);
  const [showCalendar, setShowCalendar] = useState(false);
  const navigation = useNavigation();
  const theme = useContext(themeContext);

  // Advertisement scrolling bar state
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const scrollAnim = new Animated.Value(0);

  // Define your advertisements
  const advertisements = [
    { id: '1', text: '🚀 Your Ad Here! 🚀' },
    { id: '2', text: '📣 Special Offer: 50% Off! 📣' },
    { id: '3', text: '🎉 Join Our Newsletter for Updates! 🎉' },
  ];

  // Fetch news on component mount
  useEffect(() => {
    getNewsFromAPI();
    startAdRotation();
  }, []);

  const getNewsFromAPI = () => {
    newAPI.get('top-headlines?country=us&apiKey=1447d07f95c24384a8f4f010a21d5574')
      .then((response) => {
        setNews(response.data);
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

  const date = new Date().getDate();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const currentMonth = monthNames[new Date().getMonth()];

  return (
    <View style={[styles.container, { backgroundColor: theme.backColor }]}>
      <StatusBar backgroundColor={theme.statusColor} />

      {/* Header */}
      <View style={styles.headerContainer}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/img/header-logo.png')}
            style={styles.logo}
          />
          <Text style={[styles.mainText, { color: theme.textColor }]}>
            NeuzNow
          </Text>
        </View>
      </View>

      {/* Content */}
      <ScrollView>
        {/* Scrolling Advertisement Banner */}
        <View style={styles.bannerContainer}>
          <Animated.View style={[styles.banner, { transform: [{ translateY: scrollAnim }] }]}>
            {advertisements.map((ad) => (
              <View key={ad.id} style={styles.bannerItem}>
                <Text style={styles.bannerText}>{ad.text}</Text>
              </View>
            ))}
          </Animated.View>
        </View>

        {/* Date with Calendar Icon */}
        <View style={styles.dateContainer}>
          <TouchableOpacity onPress={() => setShowCalendar(!showCalendar)} style={styles.calendarIconContainer}>
            <Icon name="calendar" size={24} color={theme.textColor} />
          </TouchableOpacity>
          <Text style={[styles.dateText, { color: theme.textColor }]}>
            📅 {currentMonth} {date}
          </Text>
        </View>

        {/* Calendar Component */}
        {showCalendar && <YourCalendarComponent />}

        {/* Trending News Section */}
        <Text style={[styles.sectionTitle, { color: theme.textColor }]}>
          Trending News
        </Text>
        {isLoading ? (
          <ActivityIndicator size="large" color="#0096FF" />
        ) : (
          <TrendNews />
        )}

        {/* Separator */}
        <View style={styles.separator} />

        {/* Recent News Section */}
        <Text style={[styles.sectionTitle, { color: theme.textColor }]}>
          Recent News
        </Text>
        {isLoading ? (
          <ActivityIndicator size="large" color="#0096FF" />
        ) : (
          <FlatList
            data={news.articles}
            keyExtractor={(item, index) => 'key' + index}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => navigation.navigate('NewsDetail', { item })}>
                <Card item={item} />
              </TouchableOpacity>
            )}
            style={{ marginBottom: 65 }}
          />
        )}
      </ScrollView>
    </View>
  );
};

// Dummy screens for each tab
const SportsScreen = () => <Text>Sports Screen</Text>;
const HealthScreen = () => <Text>Health Screen</Text>;
const EntertainmentScreen = () => <Text>Entertainment Screen</Text>;
const GlobalScreen = () => <Text>Global Screen</Text>;
const LatestScreen = () => <Text>Latest Screen</Text>;

const Home = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Latest',
          tabBarIcon: ({ color, size }) => (
            <Icon name="newspaper-o" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Sports"
        component={SportsScreen}
        options={{
          tabBarLabel: 'Sports',
          tabBarIcon: ({ color, size }) => (
            <Icon name="soccer-ball-o" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Health"
        component={HealthScreen}
        options={{
          tabBarLabel: 'Health',
          tabBarIcon: ({ color, size }) => (
            <Icon name="heartbeat" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Entertainment"
        component={EntertainmentScreen}
        options={{
          tabBarLabel: 'Entertainment',
          tabBarIcon: ({ color, size }) => (
            <Icon name="film" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Global"
        component={GlobalScreen}
        options={{
          tabBarLabel: 'Global',
          tabBarIcon: ({ color, size }) => (
            <Icon name="globe" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    backgroundColor: '#638cbd',
    flexDirection: 'row',
    justifyContent: 'space-between',
    elevation: 8,
  },
  logoContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 100,
  },
  logo: {
    width: 100,
    height: 100,
  },
  mainText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginLeft: -15,
    marginTop: -10,
  },
  bannerContainer: {
    height: 100, // Adjust this height for your banner
    overflow: 'hidden', // Hide overflow for smooth scrolling
    marginVertical: 20,
  },
  banner: {
    flexDirection: 'column',
  },
  bannerItem: {
    height: 100, // Same height as bannerContainer
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffcc00', // Background color for the banner
    marginBottom: 10, // Space between ads
    borderRadius: 10,
  },
  bannerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 25,
    justifyContent: 'center',
    width: '90%',
    padding: 10,
    marginTop: 20,
    marginLeft: 20,
    elevation: 3,
    backgroundColor: '#f0f0f0', // Change background color if needed
  },
  calendarIconContainer: {
    marginRight: 10,
  },
  dateText: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 10,
    marginLeft: 20,
  },
  separator: {
    borderBottomColor: 'gray',
    borderBottomWidth: 0.5,
    width: '90%',
    alignSelf: 'center',
    marginTop: 5,
  },
});

export default Home;
