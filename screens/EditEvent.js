import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { getEvent, updateEvent } from '../firebase/firestore';

const EditEvent = ({ route, navigation }) => {
  const { eventId } = route.params;
  const [eventDetails, setEventDetails] = useState({
    eventName: '',
    location: '',
    date: '',
    time: '',
    picture: '',
  });

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const event = await getEvent(eventId);
        setEventDetails(event);
      } catch (error) {
        console.error('Error fetching event details:', error);
      }
    };

    fetchEventDetails();
  }, [eventId]);

  const handleSave = async () => {
    try {
      await updateEvent(eventId, eventDetails);
      alert('Event updated successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Error updating event:', error);
      alert('Error updating event.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Edit Event</Text>
      <TextInput
        style={styles.input}
        placeholder="Event Name"
        value={eventDetails.eventName}
        onChangeText={(text) => setEventDetails({ ...eventDetails, eventName: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Location"
        value={eventDetails.location}
        onChangeText={(text) => setEventDetails({ ...eventDetails, location: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Date"
        value={eventDetails.date}
        onChangeText={(text) => setEventDetails({ ...eventDetails, date: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Time"
        value={eventDetails.time}
        onChangeText={(text) => setEventDetails({ ...eventDetails, time: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Picture URL"
        value={eventDetails.picture}
        onChangeText={(text) => setEventDetails({ ...eventDetails, picture: text })}
      />
      <Button title="Save" onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});

export default EditEvent;
