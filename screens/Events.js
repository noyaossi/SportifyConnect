// screens/Events.js

import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { getEvents, getRegisteredEvents } from '../firebase/firestore'; // Import function to fetch events and registered events from Firestore
import { useAuth } from '../contexts/AuthContext'; // Import useAuth to get the current user
import { Ionicons } from '@expo/vector-icons'; // Assuming you have installed expo vector icons

const Events = ({ navigation }) => {
  const [events, setEvents] = useState([]);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const { currentUser } = useAuth(); // Get the current user from AuthContext

  useEffect(() => {
    // Fetch all events when the component mounts
    const fetchEvents = async () => {
      try {
        const eventsData = await getEvents(); // Fetch events data from Firestore
        setEvents(eventsData); // Update state with fetched events
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents(); // Call fetchEvents function
  }, []);

  useEffect(() => {
    // Fetch registered events when the current user changes
    const fetchRegisteredEvents = async () => {
      if (!currentUser) return;

      try {
        const registeredEventsData = await getRegisteredEvents(currentUser.uid); // Fetch registered events data from Firestore
        setRegisteredEvents(registeredEventsData); // Update state with fetched registered events
      } catch (error) {
        console.error('Error fetching registered events:', error);
      }
    };

    fetchRegisteredEvents(); // Call fetchRegisteredEvents function
  }, [currentUser]);

  // Render each event item in a FlatList
  const renderEventItem = ({ item }) => (
    <View style={styles.eventItem}>
      <Text style={styles.eventName}>{item.eventName}</Text>
      <Text style={styles.eventDetails}>{item.location}, {item.date}, {item.time}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>All Events:</Text>
      <FlatList
        data={events}
        renderItem={renderEventItem}
        keyExtractor={(item) => item.id} // Assuming each event has a unique identifier
      />
      <Text style={styles.header}>Registered Events:</Text>
      <FlatList
        data={registeredEvents}
        renderItem={renderEventItem}
        keyExtractor={(item) => item.id} // Assuming each event has a unique identifier
      />
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('CreateEvent')}
      >
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  header: {
    fontSize: 24,
    marginVertical: 10,
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
  },
  eventDetails: {
    fontSize: 16,
    color: '#888',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 80, // Increased bottom margin to avoid overlap with the bottom navigation bar
    backgroundColor: '#1E90FF',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
  },
});

export default Events;
