// screens/CreateEvent.js
import React, { useState } from 'react';
import { StyleSheet, Alert, ScrollView } from 'react-native';
import { Card, Title } from 'react-native-paper';
import EventForm from '../components/EventForm';
import { addEvent, createNewEvent } from '../firebase/firestore';
import { uploadImage } from '../firebase/storage';
import { useAuth } from '../contexts/AuthContext';
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
      Alert.alert('Error', 'There was an error creating your event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer loading={loading} onRefresh={() => {}} navigation={navigation}>
      <ScrollView contentContainerStyle={styles.container}>
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.title}>Create New Event</Title>
            <EventForm onSubmit={handleSubmit} />
          </Card.Content>
        </Card>
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F5F5F5',
    padding: 16,
  },
  card: {
    borderRadius: 8,
    elevation: 4,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
});

export default CreateEvent;