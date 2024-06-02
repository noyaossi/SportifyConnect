// screens/Events.js
import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet, Image } from 'react-native';
import { getEvents } from '../firebase/firestore'; // Import function to fetch events from Firestore



const Events = ({ navigation }) => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Fetch events data when the component mounts
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

  // Render each event item in a FlatList
  const renderEventItem = ({ item }) => (
    <View style={styles.eventItem}>
      <Text style={styles.eventName}>{item.eventName}</Text>
      <Text style={styles.eventDetails}>{item.location}, {item.date}, {item.time}</Text>
      <Button title="View Details" onPress={() => handleViewDetails(item)} />
    </View>
  );

  const handleViewDetails = (event) => {
    // Navigate to event details screen, passing the event data as a parameter
    navigation.navigate('EventDetails', { event });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={events}
        renderItem={renderEventItem}
        keyExtractor={(item) => item.id}
      />
      <View style={[styles.createEventContainer, { marginBottom: 60 }]}>
        {/* Adjust marginBottom to accommodate the height of your BottomNavigationBar */}
        <Image
          source={require('../assets/images/plus.png')}
          style={styles.image}
        />
        <Button
          title="Create New Event"
          onPress={() => navigation.navigate('CreateEvent')}
          style={styles.createEventButton}
        />
        
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  createEventContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  createEventButton: {
    marginRight: 10,
  },
  image: {
    width: 30,
    height: 30,
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

export default Events;