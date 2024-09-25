import React, { useEffect, useState, useContext } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, FlatList, ScrollView, StatusBar, Image, TouchableOpacity, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import newAPI from '../apis/News';
import Card from '../components/Card';
import TrendNews from '../screens/TrendNews';
import YourCalendarComponent from '../components/YourCalendarComponent'; // Import your calendar component
import themeContext from '../config/themeContext';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import icon library

const Home = () => {
  const [isLoading, setLoading] = useState(true);
  const [news, setNews] = useState([]);
  const [showCalendar, setShowCalendar] = useState(false); // State to manage calendar visibility
  const navigation = useNavigation();
  const theme = useContext(themeContext);

  // Scrolling bar state
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const scrollAnim = new Animated.Value(0);

  // Define your advertisements
  const advertisements = [
    { id: '1', text: '🚀 Your Ad Here! 🚀' },
    { id: '2', text: '📣 Special Offer: 50% Off! 📣' },
    { id: '3', text: '🎉 Join Our Newsletter for Updates! 🎉' }
  ];

  useEffect(() => {
    getNewsFromAPI();
    startAdRotation();
  }, []);

  function getNewsFromAPI() {
    newAPI.get('top-headlines?country=us&apiKey=1447d07f95c24384a8f4f010a21d5574')
      .then(response => {
        setNews(response.data);
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  const startAdRotation = () => {
    setInterval(() => {
      setCurrentAdIndex(prevIndex => (prevIndex + 1) % advertisements.length);
    }, 3000); // Change ad every 3 seconds
  };

  // Scroll to the current advertisement
  useEffect(() => {
    Animated.spring(scrollAnim, {
      toValue: -currentAdIndex * 100, // Adjust based on height of each ad
      useNativeDriver: true,
    }).start();
  }, [currentAdIndex]);

  if (!news) {
    return null;
  }

  const date = new Date().getDate();
  const months = () => {
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return monthNames[new Date().getMonth()];
  };

  return (
    <View style={{ backgroundColor: theme.backColor }}>
      <StatusBar backgroundColor={theme.statusColor} />
      <View style={styles.headerContainer}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/img/header-logo.png')}
            style={styles.logo}
          />
          <Text style={[styles.mainText, { marginLeft: -15, marginTop: -10 }]}>NeuzNow</Text>
        </View>
      </View>
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
        
        {/* Date Container with Calendar Icon */}
        <View style={styles.dateContainer}>
          <TouchableOpacity onPress={() => setShowCalendar(!showCalendar)} style={styles.calendarIconContainer}>
            <Icon name="calendar" size={24} color={theme.textColor} />
          </TouchableOpacity>
          <Text style={[styles.dateText, { color: theme.textColor }]}>
            📅 {months()} {date}
          </Text>
        </View>

        {/* Show Calendar when icon is clicked */}
        {showCalendar && <YourCalendarComponent />}

        <Text style={[styles.sectionTitle, { color: theme.textColor }]}>
          Trending News
        </Text>
        {isLoading ? <ActivityIndicator size="large" color="#0096FF" /> : (
          <TrendNews />
        )}
        <View style={styles.separator} />
        <Text style={[styles.sectionTitle, { color: theme.textColor }]}>
          Recent News
        </Text>
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
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainText: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    margin: 15,
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 60,
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