// screens/Events.js

import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet, TouchableOpacity, Image, RefreshControl, ScrollView} from 'react-native';
import { getEvents, getRegisteredEvents, unregisterForEvent, getCreatedEvents, handleDeleteEvent  } from '../firebase/firestore'; // Import function to fetch events and registered events from Firestore
import { useAuth } from '../contexts/AuthContext'; // Import useAuth to get the current user
import { Ionicons } from '@expo/vector-icons'; // Assuming you have installed expo vector icons
import BottomNavigationBar from '../components/BottomNavigationBar';


const Events = ({ navigation }) => {
  const [events, setEvents] = useState([]);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [createdEvents, setCreatedEvents] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const { currentUser } = useAuth(); // Get the current user from AuthContext

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const eventsData = await getEvents(); // Fetch events data from Firestore
      setEvents(eventsData); // Update state with fetched events
      if (currentUser && currentUser.uid) {
        const registeredEventsData = await getRegisteredEvents(currentUser.uid);
        setRegisteredEvents(registeredEventsData);
        const createdEventsData = await getCreatedEvents(currentUser.uid);
        setCreatedEvents(createdEventsData);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setRefreshing(false);
    }
  };

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
    const fetchRegisteredAndCreatedEvents  = async () => {
      if (!currentUser || !currentUser.uid) return; // Exit if no currentUser or UID
    
      try {
        const registeredEventsData = await getRegisteredEvents(currentUser.uid);
        if (registeredEventsData.length !== 0) { // Check if data is not empty
          setRegisteredEvents(registeredEventsData);
        }
        const createdEventsData = await getCreatedEvents(currentUser.uid);
        if (createdEventsData.length !== 0) {
          setCreatedEvents(createdEventsData);
        }
      } catch (error) {
        console.error('Error fetching registered or created events:', error);
      }
    };

    fetchRegisteredAndCreatedEvents(); // Call fetchRegisteredEvents function
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

  // Render each event item in a FlatList
  const renderEventItem = ({ item }) => (
    <View style={styles.eventItem}>
      <View style={styles.eventDetailsContainer}>
        <Text style={styles.eventName}>{item.eventName}</Text>
        <Text style={styles.eventDetails}>{item.location}, {item.date}, {item.time}</Text>
      </View>
      {item.picture && <Image source={{ uri: item.picture }} style={styles.eventImage} />}
    </View>
  );

  const renderRegisteredEventItem = ({ item }) => (
    <View style={styles.eventItem}>
      <View style={styles.eventDetailsContainer}>
        <Text style={styles.eventName}>{item.eventName}</Text>
        <Text style={styles.eventDetails}>{item.location}, {item.date}, {item.time}</Text>
      </View>
      {item.picture && <Image source={{ uri: item.picture }} style={styles.eventImage} />}
      <Button
        title="Unregister"
        onPress={() => handleUnregister(item.id)}
        color="red"
      />
    </View>
  );
  const renderCreatedEventItem = ({ item }) => (
    <View style={styles.eventItem}>
      <View style={styles.eventDetailsContainer}>
        <Text style={styles.eventName}>{item.eventName}</Text>
        <Text style={styles.eventDetails}>{item.location}, {item.date}, {item.time}</Text>
      </View>
      {item.picture && <Image source={{ uri: item.picture }} style={styles.eventImage} />}
      <View style={styles.buttonContainer}>
      <Button
        title="Edit"
        onPress={() => navigation.navigate('EditEvent', { eventId: item.id })}
        color="blue"
      />
    </View>
    </View>
  );


  return (
    <View style={styles.maincontainer}>
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
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
      </ScrollView>
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('CreateEvent')}
      >
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>
      <BottomNavigationBar navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  maincontainer:{
      flex: 1,
      backgroundColor: 'white',
  },
  scrollViewContent: {
    paddingBottom: 100, // Increased padding from 20 to 100
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    paddingBottom: 100, // Increased padding from 20 to 100

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