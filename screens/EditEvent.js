// screens/EditEvent.js
import React, { useEffect, useState } from 'react';
import EventForm from '../components/EventForm';
import { getEvent, updateEvent, handleDeleteEvent } from '../firebase/firestore';
import { useAuth } from '../contexts/AuthContext'; 
import { uploadImage } from '../firebase/storage';
import { Alert, Text, View, Button, StyleSheet } from 'react-native'; // Import Alert, Text, View, Button, StyleSheet

const EditEvent = ({ navigation, route }) => {
  const { eventId } = route.params;
  const [initialData, setInitialData] = useState(null);
  const { currentUser } = useAuth(); 

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const event = await getEvent(eventId);
 
        event.participants = event.participants.toString(); // Ensure participants is a string for TextInput
        setInitialData(event);
      } catch (error) {
        console.error('Error fetching event:', error);
      }
    };

    fetchEvent();
  }, [eventId]);

  const handleSubmit = async (updatedEvent) => {
    try {
      let pictureUrl = initialData.picture;
      if (updatedEvent.picture && updatedEvent.picture !== initialData.picture) {
        pictureUrl = await uploadImage(updatedEvent.picture);
      }

      const eventToUpdate = {
        ...updatedEvent,
        picture: pictureUrl,
      };

      await updateEvent(eventId, eventToUpdate);

      Alert.alert('Event Updated', 'Your event has been updated successfully.');
      navigation.navigate('Events');
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await handleDeleteEvent(eventId, currentUser.uid);
      Alert.alert('Event Deleted', 'The event has been deleted successfully.');
      navigation.navigate('Events');
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  return (
    initialData ? (
      <View style={styles.container}>
        <EventForm onSubmit={handleSubmit} initialData={initialData} />
        <Button title="Delete Event" onPress={handleDelete} color="red" />
      </View>
    ) : (
      <Text>Loading...</Text>
    )
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
});

export default EditEvent;