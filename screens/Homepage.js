import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet, TouchableOpacity, Image, ScrollView, RefreshControl } from 'react-native';
import { getEvents, registerForEvent } from '../firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import BottomNavigationBar from '../components/BottomNavigationBar';
import { Ionicons } from '@expo/vector-icons';
import { useRefresh } from '../contexts/RefreshContext';

const Homepage = ({ navigation }) => {
  const [events, setEvents] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const { currentUser } = useAuth();
  const { refreshing: contextRefreshing } = useRefresh();

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const eventsData = await getEvents();
      setEvents(eventsData);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsData = await getEvents();
        setEvents(eventsData);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };
    fetchEvents();
  }, [currentUser]);

  useEffect(() => {
    if (contextRefreshing) {
      onRefresh();
    }
  }, [contextRefreshing]);

  const handleRegister = async (eventId) => {
    try {
      await registerForEvent(currentUser.uid, eventId);
      alert('Registered successfully!');
      onRefresh();
    } catch (error) {
      console.error('Error registering for event:', error);
      alert('Error registering for event.');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'numeric', day: 'numeric', weekday: 'long' };
    return date.toLocaleDateString('en-US', options);
  };

  const renderEventItem = ({ item }) => (
    <View style={styles.eventItem}>
      <View style={styles.eventDetailsContainer}>
        <Text style={styles.eventName}>{item.eventName}</Text>
        <Text style={styles.eventDetails}>{item.sportType}</Text>
        <Text style={styles.eventDetails}>{item.location}</Text>
        <Text style={styles.eventDetails}>{formatDate(item.date)}</Text>
        <Text style={styles.eventDetails}>{(item.time)}</Text>
        <Text style={styles.eventDetails}>Participants: {item.participants}</Text>
        <Text style={styles.eventDetails}>{item.description}</Text>
      </View>
      {item.picture && <Image source={{ uri: item.picture }} style={styles.eventImage} />}
      <Button title="Register" onPress={() => handleRegister(item.id)} />
    </View>
  );

  return (
    <View style={styles.maincontainer}>
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.container}>
          <Text style={styles.header}>Explore Events:</Text>
          {events.length === 0 ? (
            <Text>No events available at the moment.</Text>
          ) : (
            <FlatList
              data={events}
              renderItem={renderEventItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          )}
        </View>
      </ScrollView>
      <BottomNavigationBar navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollViewContent: {
    paddingBottom: 100,
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    paddingBottom: 100,
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
    bottom: 80,
    backgroundColor: '#1E90FF',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
  },
});

export default Homepage;
