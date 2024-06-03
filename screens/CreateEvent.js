// screens/CreateEvent.js

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import { addEvent } from '../firebase/firestore';
import { uploadImage } from '../firebase/storage';

const CreateEvent = ({ navigation }) => {
  const [eventName, setEventName] = useState('');
  const [sportType, setSportType] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [participants, setParticipants] = useState('');
  const [description, setDescription] = useState('');
  const [picture, setPicture] = useState(null);

  const getGalleryPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Please grant permission to access the photo library.');
    }
  };

  useEffect(() => {
    getGalleryPermission();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      console.log('Image picked:', result.assets[0].uri);
      setPicture(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      console.log('Photo taken:', result.assets[0].uri);
      setPicture(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    try {
      console.log('Submitting event:', eventName, sportType, location, date, time, participants, description);

      let pictureUrl = null;
      if (picture) {
        console.log('Uploading image...');
        pictureUrl = await uploadImage(picture);
        console.log('Image uploaded, URL:', pictureUrl);
      }

      const newEvent = {
        eventName,
        sportType,
        location,
        date,
        time,
        participants,
        description,
        picture: pictureUrl,
      };

      console.log('New event object:', newEvent);

      const eventId = await addEvent(newEvent);
      console.log('Event created with ID:', eventId);
      navigation.navigate('Events');
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
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
        <View style={styles.uploadPictureContainer}>
          {picture && <Image source={{ uri: picture }} style={styles.image} />}
          <Button title="Select from Gallery" onPress={pickImage} />
          <Button title="Take a Photo" onPress={takePhoto} />
        </View>
        <Button title="Submit" onPress={handleSubmit} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100, // Add padding to the bottom to ensure buttons are not covered
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
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    marginBottom: 12,
  },
});

export default CreateEvent;
