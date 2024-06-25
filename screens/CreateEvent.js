// screens/CreateEvent.js
import React from 'react';
import EventForm from '../components/EventForm';
import { addEvent, createNewEvent } from '../firebase/firestore';
import { uploadImage } from '../firebase/storage';
import { useAuth } from '../contexts/AuthContext'; 
import { Alert } from 'react-native';

const CreateEvent = ({ navigation }) => {
  const { currentUser } = useAuth(); 

  const handleSubmit = async (newEvent) => {
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
    }
  };

  return <EventForm onSubmit={handleSubmit} />;
};

export default CreateEvent;