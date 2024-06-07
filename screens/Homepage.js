// screens/Homepage.js

import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, StyleSheet, Button, RefreshControl, Image  } from 'react-native';
import { getEvents, registerForEvent } from '../firebase/firestore'; // Import function to fetch events and register for events from Firestore
import { useAuth } from '../contexts/AuthContext'; // Import AuthContext to get current user
import BottomNavigationBar from '../components/BottomNavigationBar';
import { NavigationContainer } from '@react-navigation/native';



const Homepage = ({ navigation }) => {

  <BottomNavigationBar navigation={navigation} />
  const [events, setEvents] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const { currentUser } = useAuth(); // Get the current user from AuthContext

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const eventsData = await getEvents(); // Fetch events data from Firestore
      setEvents(eventsData); // Update state with fetched events
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setRefreshing(false);
    }
  };

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

  const handleRegister = async (eventId) => {
    try {
      await registerForEvent(currentUser.uid, eventId); // Register user for the event
      alert('Registered successfully!');
      onRefresh(); // Refresh the list of events
    } catch (error) {
      console.error('Error registering for event:', error);
      alert('Error registering for event.');
    }
  };

  // Render each event item in a FlatList
  const renderEventItem = ({ item }) => (
    <View style={styles.eventItem}>
      <View style={styles.eventDetailsContainer}>
        <Text style={styles.eventName}>{item.eventName}</Text>
        <Text style={styles.eventDetails}>{item.location}, {item.date}</Text>
      </View>
      {item.picture && <Image source={{ uri: item.picture }} style={styles.eventImage} />}
      <Button
        title="Register"
        onPress={() => handleRegister(item.id)}
        color="green"
      />
    </View>
  );

  return (
    <View style={styles.maincontainer}>
      <View style={styles.container}>
        <FlatList
          data={events}
          renderItem={renderEventItem}
          keyExtractor={(item) => item.id} // Assuming each event has a unique identifier
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      </View>
      <BottomNavigationBar navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    paddingBottom: 100, // Increased padding from 20 to 100

  },
  eventItem: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eventDetailsContainer: {
    flex: 1,
    marginRight: 10,
  },
  eventName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  eventDetails: {
    fontSize: 16,
    color: '#888',
  },
  eventImage: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
    borderRadius: 10,
  },
});

export default Homepage;
