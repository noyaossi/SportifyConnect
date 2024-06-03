// screens/CreateEvent.js

import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker'; // Import ImagePicker module

import { addEvent } from '../firebase/firestore'; // Ensure correct import
import { getStorage, ref, uploadFile, getDownloadURL } from 'firebase/storage';




const CreateEvent = ({ navigation }) => {
  const [eventName, setEventName] = useState('');
  const [sportType, setSportType] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [participants, setParticipants] = useState('');
  const [description, setDescription] = useState('');
  const [picture, setPicture] = useState(' '); // State to store the selected image URI

  // Function to handle picking an image from device gallery
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  
    if (!result.cancelled) {
      try {
        const imageRef = ref(storage, 'images/' + result.uri.split('/').pop()); // Create a reference to the image in Firebase Storage
        await uploadFile(imageRef, result.uri); // Upload the image
        const imageUrl = await getDownloadURL(imageRef); // Get the URL of the uploaded image
  
        // Now you have the imageUrl, you can include it in your event object
        const newEvent = {
          eventName,
          sportType,
          location,
          date,
          time,
          participants,
          description,
          picture: imageUrl, // Include the image URL in your event object
        };
  
        try {
          const eventId = await addEvent(newEvent); // Add the event to Firestore
          console.log('Event created with ID: ', eventId);
          navigation.navigate('Events'); // Navigate back to the events screen or wherever you want to go after creating the event
        } catch (error) {
          console.error('Error adding event: ', error);
        }
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };

// Function to handle taking a photo with the camera
const takePhoto = async () => {
  let result = await ImagePicker.launchCameraAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
  });

  if (!result.cancelled) {
    setPicture(result.uri); // Set the picture state with the URI of the taken photo
  }
};

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
        placeholder="Picture"
        value={description}
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
  uploadPictureContainer: {
    marginBottom: 12,
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'cover',
    marginBottom: 12,
  },
});

export default CreateEvent;