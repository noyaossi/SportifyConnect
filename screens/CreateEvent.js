import React, { useState } from 'react';
import { Alert, View } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { addEvent, createNewEvent } from '../firebase/firestore';
import commonStyles from '../styles/styles';
import ScreenContainer from '../components/ScreenContainer';
import EventForm from '../components/EventForm';

const CreateEvent = ({ navigation }) => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleCreateEvent = async (event) => {
    setLoading(true);
    try {
      const eventId = await addEvent(event);
      await createNewEvent(currentUser.uid, eventId);
      Alert.alert('Event Created', 'Your event has been created successfully.');
      navigation.navigate('Events');
    } catch (error) {
      console.error('Error creating event:', error);
      Alert.alert('Error', 'Failed to create event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
      <View style={{ flex: 1 }}>
        <ScreenContainer loading={loading} onRefresh={() => {}}>
          <EventForm onSubmit={handleCreateEvent} />
        </ScreenContainer>
      </View>
  );
};

export default CreateEvent;
