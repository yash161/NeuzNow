import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';

const YourCalendarComponent = () => {
  const [selectedDate, setSelectedDate] = useState('');

  const onDayPress = (day) => {
    setSelectedDate(day.dateString);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select a Date</Text>
      <Calendar
        onDayPress={onDayPress}
        markedDates={{
          [selectedDate]: { selected: true, marked: true, selectedColor: '#ffcc00' },
        }}
        style={styles.calendar}
      />
      {selectedDate ? (
        <Text style={styles.selectedDateText}>Selected Date: {selectedDate}</Text>
      ) : (
        <Text style={styles.noDateText}>No date selected</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  calendar: {
    marginBottom: 10,
  },
  selectedDateText: {
    fontSize: 16,
    color: 'green',
    marginTop: 10,
  },
  noDateText: {
    fontSize: 16,
    color: 'gray',
    marginTop: 10,
  },
});

export default YourCalendarComponent;