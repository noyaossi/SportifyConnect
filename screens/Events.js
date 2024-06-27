// screens/Events.js

import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
// Import function to fetch events and registered events from Firestore
import { getEvents, getRegisteredEvents, unregisterForEvent, getCreatedEvents  } from '../firebase/firestore'; 
import { useAuth } from '../contexts/AuthContext'; 
import { Ionicons } from '@expo/vector-icons'; 
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
        <Chip icon="tag" style={styles.sportChip}>{item.sportType}</Chip>
        <View style={styles.eventDetailsContainer}>
          <Ionicons name="location" size={16} color="#8A2BE2" style={styles.icon} />
          <Text style={styles.eventDetails}>{item.location}</Text>
        </View>
        <View style={styles.eventDetailsContainer}>
          <Ionicons name="calendar" size={16} color="#8A2BE2" style={styles.icon} />
          <Text style={styles.eventDetails}>{formatDate(item.date)} at {formatTime(item.time)}</Text>
        </View>
        <View style={styles.eventDetailsContainer}>
          <Ionicons name="people" size={16} color="#8A2BE2" style={styles.icon} />
          <Text style={styles.eventDetails}>Participants: {item.participants}</Text>
        </View>
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
            <Text style={styles.noEventsText}>You are currently not registered for any events.</Text>
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
            <Text style={styles.noEventsText}>You have not created any events yet.</Text>
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
    flexGrow: 1,
  },
  eventCard: {
    marginBottom: 16,
    borderRadius: 8,
    elevation: 3,
    backgroundColor: '#FFFFFF',
  },
  eventImage: {
    height: 200,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  eventName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8A2BE2',
    marginBottom: 8,
    marginTop: 10,
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
    marginBottom: 20,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 60,
    backgroundColor: '#8A2BE2',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    zIndex: 1,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#8A2BE2',
    textAlign: 'left',
    marginBottom: 20,
  },
  eventDetailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  eventDetails: {
    fontSize: 14,
    color: '#666',
  },
  divider: {
    marginVertical: 8,
  },
  eventDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  icon: {
    marginRight: 8,
  },

});


export default Events;