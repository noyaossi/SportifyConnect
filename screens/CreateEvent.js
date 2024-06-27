import React, { useState } from 'react';
import { StyleSheet, Alert, ScrollView, View, Platform, Text } from 'react-native';
import { TextInput, Button, Title, List, Card } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
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
        // date: eventData.date.toISOString().split('T')[0],
        // time: eventData.time.toTimeString().split(' ')[0],
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
        {/* <Card style={styles.card}>
          <Card.Content>
          </Card.Content>
        </Card> */}
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

  // card: {
  //   borderRadius: 8,
  //   elevation: 4,
  //   backgroundColor: 'white',
  // },
});

export default CreateEvent;