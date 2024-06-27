import React, { useState } from 'react';
import EventForm from '../components/EventForm';
import { addEvent, createNewEvent } from '../firebase/firestore';
import { uploadImage } from '../firebase/storage';
import { useAuth } from '../contexts/AuthContext';
import { Alert } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
const CreateEvent = ({ navigation }) => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (newEvent) => {
    setLoading(true);
    try {
      let pictureUrl = null;
      if (newEvent.picture) {
        pictureUrl = await uploadImage(newEvent.picture);
      }
      const eventToSubmit = {
        ...newEvent,
        picture: pictureUrl,
      };
      const eventId = await addEvent(eventToSubmit);
      await createNewEvent(currentUser.uid, eventId);
      Alert.alert('Event Created', 'Your event has been created successfully.');
      navigation.navigate('Events');
    } catch (error) {
      console.error('Error creating event:', error);
    }  finally {
      setLoading(false);
    }
  };
  return (
    <ScreenContainer loading={loading} onRefresh={() => {}} navigation={navigation}>
      <EventForm onSubmit={handleSubmit} />
    </ScreenContainer>
  );
};
export default CreateEvent;