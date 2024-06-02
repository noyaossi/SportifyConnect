// screens/Homepage.js

import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, StyleSheet, RefreshControl } from 'react-native';
import BottomNavigationBar from '../components/BottomNavigationBar'; // Import the BottomNavigationBar component
import { getEvents } from '../firebase/firestore'; // Import function to fetch events from Firestore
import { useFocusEffect } from '@react-navigation/native';



const Homepage = ({ navigation }) => {
  const [events, setEvents] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchEvents = async () => {
    try {
      const eventsData = await getEvents(); // Fetch events data from Firestore
      setEvents(eventsData); // Update state with fetched events
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await fetchEvents();
    setRefreshing(false);
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchEvents(); // Fetch events data when the screen comes into focus
    }, [])
  );

  // Render each event item in a FlatList
  const renderEventItem = ({ item }) => (
    <View style={styles.eventItem}>
      <Text style={styles.eventName}>{item.eventName}</Text>
      <Text style={styles.eventDetails}>{item.location}, {item.date}, {item.time}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={events}
        renderItem={renderEventItem}
        keyExtractor={(item) => item.id} // Assuming each event has a unique identifier
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}

      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  eventItem: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  eventName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  eventDetails: {
    fontSize: 16,
    color: '#888',
  },
});

export default Homepage;
