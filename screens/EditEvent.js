import React, { useState, useEffect } from 'react';
import { Alert, View, TouchableOpacity, Text } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { getEvent, updateEvent, deleteEvent } from '../firebase/firestore';
import commonStyles from '../styles/styles';
import ScreenContainer from '../components/ScreenContainer';
import EventForm from '../components/EventForm';
import BottomNavigationBar from '../components/BottomNavigationBar';

const EditEvent = ({ route, navigation }) => {
  const { eventId } = route.params;
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const event = await getEvent(eventId);
 
        event.participants = event.participants.toString(); // Ensure participants is a string for TextInput
        setInitialData(event);
      } catch (error) {
        console.error('Error fetching event:', error);
        Alert.alert('Error', 'Failed to load event details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  const handleUpdateEvent = async (updatedEvent) => {
    setLoading(true);
    try {
      await updateEvent(eventId, updatedEvent);
      Alert.alert('Event Updated', 'Your event has been updated successfully.');
      navigation.navigate('Events');
    } catch (error) {
      console.error('Error updating event:', error);
      Alert.alert('Error', 'Failed to update event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async () => {
    setLoading(true);
    try {
      await deleteEvent(eventId);
      Alert.alert('Event Deleted', 'Your event has been deleted successfully.');
      navigation.navigate('Events');
    } catch (error) {
      console.error('Error deleting event:', error);
      Alert.alert('Error', 'Failed to delete event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
      <View style={{ flex: 1 }}>
        <ScreenContainer loading={loading} onRefresh={() => {}}>
          {event && <EventForm onSubmit={handleUpdateEvent} initialData={event} />}
          <TouchableOpacity style={commonStyles.button} onPress={handleDeleteEvent}>
            <Text style={commonStyles.buttonText}>Delete Event</Text>
          </TouchableOpacity>
        </ScreenContainer>
        <BottomNavigationBar navigation={navigation} />
      </View>
  );
};

export default EditEvent;
