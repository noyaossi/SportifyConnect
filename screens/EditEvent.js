// screens/EditEvent.js

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, Alert, ScrollView  } from 'react-native';
import { getEvent, updateEvent, handleDeleteEvent } from '../firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { checkLoginStatus } from '../firebase/auth';

const EditEvent = ({ route, navigation }) => {
  const { eventId } = route.params;
  const [eventDetails, setEventDetails] = useState({
    eventName: '',
    sportType: '',
    location: '',
    date: '',
    participants:'',
    description:'',
    picture: '',
  });

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        console.log(`Fetching details for event ID: ${eventId}`);
        const event = await getEvent(eventId);
        setEventDetails({
            eventName: event.eventName || '',
            sportType: event.sportType || '',
            location: event.location || '',
            date: event.date || '',
            participants: event.participants || '',
            description: event.description || '',
            picture: event.picture || '',
          });
      } catch (error) {
        console.error('Error fetching event details:', error);
      } 
    };

    fetchEventDetails();
  }, [eventId]);

  const getGalleryPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Please grant permission to access the photo library.');
    }
  };
  useEffect(() => {
    getGalleryPermission();
  }, []);
 
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

  const handleDelete = async () => {
    try {
      const user = await checkLoginStatus();
      if (user) {
        await handleDeleteEvent(eventId, user.uid);
        alert('Event deleted successfully!');
        navigation.goBack(); // Navigate back to the previous screen
      } else {
        throw new Error('User not logged in');
      }
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  // Add a new function to handle image picking
const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  
    if (!result.canceled) {
      console.log('Image picked:', result.assets[0].uri);
      setEventDetails({ ...eventDetails, picture: result.assets[0].uri });
    }
  };

  return (
    <ScrollView style={styles.scrollView}>
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
        placeholder="Sport Type"
        value={eventDetails.sportType}
        onChangeText={(text) => setEventDetails({ ...eventDetails, sportType: text })}
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
        placeholder="Number Of Participants"
        value={eventDetails.participants}
        onChangeText={(text) => setEventDetails({ ...eventDetails, participants: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Event Description"
        value={eventDetails.description}
        onChangeText={(text) => setEventDetails({ ...eventDetails, description: text })}
      />
      {eventDetails.picture ? (
        <Image source={{ uri: eventDetails.picture }} style={styles.image} />
      ) : null}
      <Button title="Upload Picture" onPress={pickImage} />
      <Button title="Save" onPress={handleSave} />
      <Button title="Delete Event" onPress={handleDelete} />
    </View>
    </ScrollView>
  );
};


const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        backgroundColor: 'white',
      },
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
    image: {
      width: '100%',
      height: 200,
      marginBottom: 20,
    },
  });

export default EditEvent;