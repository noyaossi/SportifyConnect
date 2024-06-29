import React, { useState } from 'react';
import { StyleSheet, Alert, View, Text } from 'react-native';
import { addEvent, createNewEvent } from '../firebase/firestore';
import { uploadImage } from '../firebase/storage';
import { useAuth } from '../contexts/AuthContext';
import ScreenContainer from '../components/ScreenContainer';
import EventForm from '../components/EventForm';


const CreateEvent = ({ navigation }) => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (eventData) => {
    setLoading(true);
    try {
      let pictureUrl = null;
      if (eventData.picture) {
        pictureUrl = await uploadImage(eventData.picture);
      }
      const eventToSubmit = {
        ...eventData,
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
      <View style={styles.container}>
        <Text style={styles.header}>Create New Event</Text>
            <EventForm onSubmit={handleSubmit} />
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#8A2BE2',
    textAlign: 'center',
  },
});

export default CreateEvent;