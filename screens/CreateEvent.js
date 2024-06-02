// screens/CreateEvent.js

import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { addEvent } from '../firebase/firestore'; // Ensure correct import

const CreateEvent = ({ navigation }) => {
  const [eventName, setEventName] = useState('');
  const [sportType, setSportType] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [participants, setParticipants] = useState('');
  const [description, setDescription] = useState('');
  const [picture, setPicture] = useState('');

  const handleSubmit = async () => {
    const newEvent = {
      eventName,
      sportType,
      location,
      date,
      time,
      participants,
      description,
      picture,
    };

    try {
      const eventId = await addEvent(newEvent);
      console.log('Event created with ID: ', eventId);
      navigation.navigate('Events'); // Navigate back to the events screen or wherever you want to go after creating the event
    } catch (error) {
      console.error('Error creating event: ', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Create New Event:</Text>
      <TextInput
        style={styles.input}
        placeholder="Event Name"
        value={eventName}
        onChangeText={setEventName}
      />
      <TextInput
        style={styles.input}
        placeholder="Sport Type"
        value={sportType}
        onChangeText={setSportType}
      />
      <TextInput
        style={styles.input}
        placeholder="Location"
        value={location}
        onChangeText={setLocation}
      />
      <TextInput
        style={styles.input}
        placeholder="Date"
        value={date}
        onChangeText={setDate}
      />
      <TextInput
        style={styles.input}
        placeholder="Time"
        value={time}
        onChangeText={setTime}
      />
      <TextInput
        style={styles.input}
        placeholder="Number Of Participants"
        value={participants}
        onChangeText={setParticipants}
      />
      <TextInput
        style={styles.input}
        placeholder="Event Description"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="Upload Picture"
        value={picture}
        onChangeText={setPicture}
      />
      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    padding: 8,
  },
});

export default CreateEvent;
