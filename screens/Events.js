// screens/Events.js

import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet, TouchableOpacity, Image  } from 'react-native';
import { getEvents, getRegisteredEvents, unregisterForEvent, getCreatedEvents  } from '../firebase/firestore'; // Import function to fetch events and registered events from Firestore
import { useAuth } from '../contexts/AuthContext'; // Import useAuth to get the current user
import { Ionicons } from '@expo/vector-icons'; // Assuming you have installed expo vector icons
import { useRefresh } from '../contexts/RefreshContext'; // Import RefreshContext
import ScreenContainer from '../components/ScreenContainer';


const Events = ({ navigation }) => {
  const [events, setEvents] = useState([]);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [createdEvents, setCreatedEvents] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false); // Define loading state
  const { currentUser } = useAuth(); // Get the current user from AuthContext

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const eventsData = await getEvents(); // Fetch events data from Firestore
      setEvents(eventsData); // Update state with fetched events
      const registeredEventsData = await getRegisteredEvents(currentUser.uid); // Fetch registered events data from Firestore
      setRegisteredEvents(registeredEventsData); // Update registered events state
      const createdEventsData = await getCreatedEvents(currentUser.uid); // Fetch created events data from Firestore
      setCreatedEvents(createdEventsData); // Update created events state
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    setLoading(true); // Set loading to true when fetching events

    // Fetch all events when the component mounts
    const fetchEvents = async () => {
      try {
        const eventsData = await getEvents(); // Fetch events data from Firestore
        setEvents(eventsData); // Update state with fetched events
        const registeredEventsData = await getRegisteredEvents(currentUser.uid); // Fetch registered events data from Firestore
        setRegisteredEvents(registeredEventsData); // Update registered events state
        const createdEventsData = await getCreatedEvents(currentUser.uid); // Fetch created events data from Firestore
        setCreatedEvents(createdEventsData); // Update created events state
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false); // Set loading to false after events are fetched
      }
    };

    fetchEvents(); // Call fetchEvents function
  }, [currentUser]);

  const handleUnregister = async (eventId) => {
    try {
      await unregisterForEvent(currentUser.uid, eventId);
      alert('Unregistered successfully!');
      onRefresh(); // Refresh the list of events
    } catch (error) {
      console.error('Error unregistering from event:', error);
      alert('Error unregistering from event.');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'numeric', day: 'numeric', weekday: 'long' };
    return date.toLocaleDateString('en-US', options);
  };

// Function to format time
const formatTime = (timeString) => {
  //console.log("time in events:", timeString);

  if (!timeString) {
    return 'Invalid time2';
  }
  // Split the time string into parts
  const [hour, minute] = timeString.split(':');
  // Check if hour and minute are defined
  if (hour === undefined || minute === undefined) {
    return 'Invalid time2';
  }
  return hour + ':' + minute;
};
  

  // Render each event item in a FlatList
  const renderEventItem = ({ item }) => (
    <View style={styles.eventItem}>
      <View style={styles.eventDetailsContainer}>
        <Text style={styles.eventName}>{item.eventName}</Text>
        <Text style={styles.eventDetails}>{item.sportType}</Text>
        <Text style={styles.eventDetails}>{item.location}</Text>
        <Text style={styles.eventDetails}>{formatDate(item.date)}</Text>
        <Text style={styles.eventDetails}>{formatTime(item.time)}</Text>
        <Text style={styles.eventDetails}>Participants: {item.participants}</Text>
        <Text style={styles.eventDetails}>{item.description}</Text>
      </View>
      {item.picture && <Image source={{ uri: item.picture }} style={styles.eventImage} />}
    </View>
  );


  const renderRegisteredEventItem = ({ item }) => (
    <View style={styles.eventItem}>
      <View style={styles.eventDetailsContainer}>
        <Text style={styles.eventName}>{item.eventName}</Text>
        <Text style={styles.eventDetails}>{item.sportType}</Text>
        <Text style={styles.eventDetails}>{item.location}</Text>
        <Text style={styles.eventDetails}>{formatDate(item.date)}</Text>
        <Text style={styles.eventDetails}>{formatTime(item.time)}</Text>
        <Text style={styles.eventDetails}>Participants: {item.participants}</Text>
        <Text style={styles.eventDetails}>{item.description}</Text>
      </View>
      {item.picture && <Image source={{ uri: item.picture }} style={styles.eventImage} />}
      <Button title="Unregister" onPress={() => handleUnregister(item.id)} color="red" />
    </View>
  );
  const renderCreatedEventItem = ({ item }) => (
    <View style={styles.eventItem}>
      <View style={styles.eventDetailsContainer}>
        <Text style={styles.eventName}>{item.eventName}</Text>
        <Text style={styles.eventDetails}>{item.sportType}</Text>
        <Text style={styles.eventDetails}>{item.location}</Text>
        <Text style={styles.eventDetails}>{formatDate(item.date)}</Text>
        <Text style={styles.eventDetails}>{formatTime(item.time)}</Text>
        <Text style={styles.eventDetails}>Participants: {item.participants}</Text>
        <Text style={styles.eventDetails}>{item.description}</Text>
      </View>
      {item.picture && <Image source={{ uri: item.picture }} style={styles.eventImage} />}
      <View style={styles.buttonContainer}>
        <Button title="Edit" onPress={() => navigation.navigate('EditEvent', { eventId: item.id })} color="blue" />
      </View>
    </View>
  );

  return (
    <>

    <ScreenContainer loading={loading || refreshing} onRefresh={onRefresh} navigation={navigation}>
        <View style={styles.container}>
          <Text style={styles.header}>Registered Events:</Text>
          {registeredEvents.length === 0 ? (
            <Text>You are not currently registered for any events.</Text>
          ) : (
            <FlatList
              data={registeredEvents}
              renderItem={renderRegisteredEventItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          )}
          <Text style={styles.header}>Created Events:</Text>
          {createdEvents.length === 0 ? (
            <Text>You have not created any events.</Text>
          ) : (
            <FlatList
              data={createdEvents}
              renderItem={renderCreatedEventItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          )}
          </View>
          </ScreenContainer>

          <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('CreateEvent')}
      >
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>
        </>

  );
};

const styles = StyleSheet.create({
  
  container: {
    flex: 1,
    //backgroundColor: 'white',
    padding: 20,
    paddingBottom: 100, 

  },
  header: {
    fontSize: 24,
    marginVertical: 10,
    color: 'white', // Changed to white for better visibility

  },
  eventItem: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    //flexDirection: 'row',
    //justifyContent: 'space-between',
    //alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Added background color for better visibility
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
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 60, 
    backgroundColor: '#1E90FF',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    zIndex: 1,

  },
});

export default Events;