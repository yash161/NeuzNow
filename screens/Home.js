import React, { useEffect, useState, useContext } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, FlatList, ScrollView, StatusBar, Image, TouchableOpacity, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome5';
import newAPI from '../apis/News';
import Card from '../components/Card';
import YourCalendarComponent from '../components/YourCalendarComponent';
import themeContext from '../config/themeContext';
import { LinearGradient } from 'expo-linear-gradient';

const Tab = createBottomTabNavigator();

const HomeScreen = () => {
  const [isLoading, setLoading] = useState(true);
  const [news, setNews] = useState([]);
  const [showCalendar, setShowCalendar] = useState(false);
  const navigation = useNavigation();
  const theme = useContext(themeContext);

  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const scrollAnim = new Animated.Value(0);

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
    newAPI.get('top-headlines?country=us&apiKey=1447d07f95c24384a8f4f010a21d5574')
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

  const date = new Date().getDate();
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'];
  const currentMonth = monthNames[new Date().getMonth()];

  return (
    <View style={[styles.container, { backgroundColor: theme.backColor }]}>
      <StatusBar backgroundColor={theme.statusColor} />

      <LinearGradient
        colors={['#4c669f', '#3b5998', '#192f6a']}
        style={styles.headerContainer}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/img/header-logo.png')}
            style={styles.logo}
          />
          <Text style={[styles.mainText, { color: '#fff' }]}>
            NeuzNow
          </Text>
        </View>
      </LinearGradient>

      <ScrollView>
        <View style={styles.bannerContainer}>
          <Animated.View style={[styles.banner, { transform: [{ translateY: scrollAnim }] }]}>
            {advertisements.map((ad) => (
              <LinearGradient
                key={ad.id}
                colors={[ad.color, '#fff']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.bannerItem}>
                <Text style={styles.bannerText}>{ad.text}</Text>
              </LinearGradient>
            ))}
          </Animated.View>
        </View>

        <TouchableOpacity
          onPress={() => setShowCalendar(!showCalendar)}
          style={styles.dateContainer}>
          <Icon name="calendar-alt" size={24} color={theme.textColor} />
          <Text style={[styles.dateText, { color: theme.textColor }]}>
            {currentMonth} {date}
          </Text>
        </TouchableOpacity>

        {showCalendar && <YourCalendarComponent />}

        <Text style={[styles.sectionTitle, { color: theme.textColor }]}>
          Trending News
        </Text>
        {isLoading ? (
          <ActivityIndicator size="large" color="#0096FF" />
        ) : (
          <FlatList
            data={news}
            keyExtractor={(item, index) => 'key' + index}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => navigation.navigate('NewsDetail', { item })}>
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
    newAPI.get(`top-headlines?country=us&category=${category}&apiKey=920deb9f754348c0bec4871fef36d971`)
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
      <LinearGradient
        colors={['#4c669f', '#3b5998', '#192f6a']}
        style={styles.headerContainer}>
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
            <TouchableOpacity
              onPress={() => navigation.navigate('NewsDetail', { item })}>
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
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  mainText: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  bannerContainer: {
    height: 100,
    overflow: 'hidden',
  },
  banner: {
    flexDirection: 'column',
  },
  bannerItem: {
    padding: 20,
    alignItems: 'center',
  },
  bannerText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  dateText: {
    fontSize: 18,
    marginLeft: 10,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
  },
  separator: {
    height: 50,
  },
  categoryTitle: {
    fontSize: 30,
    color: '#fff',
    textAlign: 'center',
    padding: 15,
  },
});

export default App;