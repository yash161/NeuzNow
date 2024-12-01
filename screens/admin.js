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
import newAPI from '../apis/News'; // Assuming you still fetch news
import Card from '../components/Card';
import themeContext from '../config/themeContext';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import icon library
import { Button } from 'react-native-paper'; // For admin actions like "Add User", "View Reports", etc.

const AdminDashboard = () => {
  const [isLoading, setLoading] = useState(true);
  const [news, setNews] = useState([]);
  const [showCalendar, setShowCalendar] = useState(false); // State to manage calendar visibility
  const navigation = useNavigation();
  const theme = useContext(themeContext);

  // Fetch news on component mount
  useEffect(() => {
    getNewsFromAPI();
  }, []);

  // Fetch news from API
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

  const date = new Date().getDate();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const currentMonth = monthNames[new Date().getMonth()];

  // Admin Actions
  const handleViewUsers = () => {
    navigation.navigate('UsersManagement'); // Navigate to User Management
  };

  const handleViewReports = () => {
    navigation.navigate('Reports'); // Navigate to Reports section
  };

  const handleAddNews = () => {
    navigation.navigate('AddNews'); // Navigate to Add News screen
  };

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
            Admin Dashboard
          </Text>
        </View>
      </View>

      {/* Content */}
      <ScrollView>
        {/* Admin Actions */}
        <View style={styles.adminActionsContainer}>
          <Button mode="contained" onPress={handleViewUsers} style={styles.adminButton}>
            Manage Users
          </Button>
          <Button mode="contained" onPress={handleViewReports} style={styles.adminButton}>
            View Reports
          </Button>
          <Button mode="contained" onPress={handleAddNews} style={styles.adminButton}>
            Add News
          </Button>
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
          <FlatList
            data={news.articles} // Assuming this holds your news articles
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
  adminActionsContainer: {
    marginTop: 20,
    padding: 20,
    alignItems: 'center',
  },
  adminButton: {
    marginBottom: 15,
    width: '80%',
  },
  bannerContainer: {
    height: 100,
    overflow: 'hidden',
    marginVertical: 20,
  },
  banner: {
    flexDirection: 'column',
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
    backgroundColor: '#f0f0f0',
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
});

export default AdminDashboard;
