// screens/Events.js

import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image  } from 'react-native';
import { getEvents, getRegisteredEvents, unregisterForEvent, getCreatedEvents  } from '../firebase/firestore'; // Import function to fetch events and registered events from Firestore
import { useAuth } from '../contexts/AuthContext'; // Import useAuth to get the current user
import { Ionicons } from '@expo/vector-icons'; // Assuming you have installed expo vector icons
import { useRefresh } from '../contexts/RefreshContext'; // Import RefreshContext
import ScreenContainer from '../components/ScreenContainer';
import { useIsFocused } from '@react-navigation/native';
import { Card, Button, Chip, Divider } from 'react-native-paper';


const Events = ({ navigation }) => {
  const [events, setEvents] = useState([]);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [createdEvents, setCreatedEvents] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false); // Define loading state
  const { currentUser } = useAuth(); // Get the current user from AuthContext
  const isFocused = useIsFocused();


  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const eventsData = await getEvents(); // Fetch events data from Firestore
      //to add if empty use the cache
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
    if (isFocused) {
      // Refresh your data or perform other actions here
      onRefresh();
    }

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
  }, [currentUser, isFocused]);

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
  const renderEventItem = (item, actions) => (
    <Card style={styles.eventCard}>
      {item.picture && <Card.Cover source={{ uri: item.picture }} style={styles.eventImage} />}
      <Card.Content>
        <Text style={styles.eventName}>{item.eventName}</Text>
        <Chip style={styles.sportChip}>{item.sportType}</Chip>
        <Text style={styles.eventDetails}>{item.location}</Text>
        <Text style={styles.eventDetails}>{formatDate(item.date)} at {formatTime(item.time)}</Text>
        <Text style={styles.eventDetails}>Participants: {item.participants}</Text>
        <Divider style={styles.divider} />
        <Text style={styles.eventDescription}>{item.description}</Text>
      </Card.Content>
      {actions && <Card.Actions>{actions}</Card.Actions>}
    </Card>
  );

  const renderRegisteredEventItem = ({ item }) => 
    renderEventItem(item, (
      <Button mode="contained" onPress={() => handleUnregister(item.id)} color="red">
        Unregister
      </Button>
    ));

  const renderCreatedEventItem = ({ item }) => 
    renderEventItem(item, (
      <Button mode="contained" onPress={() => navigation.navigate('EditEvent', { eventId: item.id })} color="blue">
        Edit
      </Button>
    ));

  return (
    <>
      <ScreenContainer loading={loading || refreshing} onRefresh={onRefresh} navigation={navigation}>
        <View style={styles.container}>
          <Text style={styles.header}>Registered Events</Text>
          {registeredEvents.length === 0 ? (
            <Text style={styles.noEventsText}>You are not currently registered for any events.</Text>
          ) : (
            <FlatList
              data={registeredEvents}
              renderItem={renderRegisteredEventItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          )}
          <Text style={styles.header}>Created Events</Text>
          {createdEvents.length === 0 ? (
            <Text style={styles.noEventsText}>You have not created any events.</Text>
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
    backgroundColor: '#F5F5F5',
    padding: 16,
  },
  header: {
    fontSize: 24,
    marginVertical: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  eventCard: {
    marginBottom: 16,
    borderRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  eventImage: {
    height: 200,
    resizeMode: 'cover',
  },
  eventName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  sportChip: {
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  eventDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  divider: {
    marginVertical: 8,
  },
  eventDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  noEventsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 60,
    backgroundColor: '#007AFF',
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